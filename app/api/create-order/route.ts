
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Wait this long before attempting recovery of an interrupted claim.
const CLAIM_RECOVERY_DELAY_MS = 2 * 60 * 1000;

function validOrderId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function sameToken(supplied: string, stored: string) {
  if (!/^[a-f0-9]{64}$/.test(supplied)) return false;
  if (!/^[a-f0-9]{64}$/.test(stored)) return false;

  const a = createHash("sha256").update(supplied).digest();
  const b = Buffer.from(stored, "hex");

  return a.length === b.length && timingSafeEqual(a, b);
}

function paymentError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay environment variables are missing.");

      return paymentError(
        "Online payment is temporarily unavailable.",
        503
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return paymentError("Invalid request body.", 400);
    }

    const orderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";

    const checkoutToken =
      typeof body.checkoutToken === "string"
        ? body.checkoutToken.trim()
        : "";

    if (!validOrderId(orderId) || !/^[a-f0-9]{64}$/.test(checkoutToken)) {
      return paymentError("Invalid checkout credentials.", 400);
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const loadOrder = async () => {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(
          "id, total, payment_status, payment_order_id, checkout_token_hash, payment_order_creation_started_at"
        )
        .eq("id", orderId)
        .maybeSingle();

      if (error) {
        console.error("Could not retrieve checkout order.", error);
        throw new Error("Could not verify checkout credentials.");
      }

      return data;
    };

    let order = await loadOrder();

    if (!order || !sameToken(checkoutToken, order.checkout_token_hash ?? "")) {
      return paymentError(
        "Checkout credentials are invalid or expired.",
        403
      );
    }

    if (order.payment_status !== "pending") {
      return paymentError("This order is not awaiting payment.", 409);
    }

    const amount = Math.round(Number(order.total) * 100);

    if (!Number.isSafeInteger(amount) || amount < 100) {
      return paymentError("The order amount is invalid.", 400);
    }

    // Validate and reuse the stored Razorpay order if one exists.
    const respondWithExistingOrder = async (paymentOrderId: string) => {
      const existing = await razorpay.orders.fetch(paymentOrderId);

      if (
        existing.id !== paymentOrderId ||
        existing.amount !== amount ||
        existing.currency !== "INR" ||
        existing.receipt !== orderId
      ) {
        console.error("Razorpay order validation failed.", orderId);

        return paymentError(
          "The payment order could not be validated. Please contact support.",
          409
        );
      }

      return NextResponse.json({
        key_id: razorpayKeyId,
        order_id: existing.id,
        amount: existing.amount,
        currency: existing.currency,
      });
    };

    if (order.payment_order_id) {
      return await respondWithExistingOrder(order.payment_order_id);
    }

    const now = new Date();
    const claimTimestamp = now.toISOString();

    // Atomic claim: only one concurrent request can claim this order.
    const { data: claimedOrder, error: claimError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_order_creation_started_at: claimTimestamp,
        updated_at: claimTimestamp,
      })
      .eq("id", orderId)
      .eq("payment_status", "pending")
      .is("payment_order_id", null)
      .is("payment_order_creation_started_at", null)
      .select("id")
      .maybeSingle();

    if (claimError) {
      console.error("Could not claim payment-order creation.", claimError);

      return paymentError(
        "Could not safely start payment. Check the order status before retrying.",
        503
      );
    }

    if (!claimedOrder) {
      // Another request may be creating the order. Reload before deciding.
      order = await loadOrder();

      if (!order || !sameToken(checkoutToken, order.checkout_token_hash ?? "")) {
        return paymentError("Checkout credentials are invalid or expired.", 403);
      }

      if (order.payment_status !== "pending") {
        return paymentError("This order is not awaiting payment.", 409);
      }

      if (order.payment_order_id) {
        return await respondWithExistingOrder(order.payment_order_id);
      }

      const startedAt = order.payment_order_creation_started_at
        ? new Date(order.payment_order_creation_started_at).getTime()
        : NaN;

      const ageMs = Date.now() - startedAt;

      if (!Number.isFinite(startedAt) || ageMs < CLAIM_RECOVERY_DELAY_MS) {
        return paymentError(
          "Payment setup is already in progress. Wait a moment and check the order status before retrying.",
          409
        );
      }

      // Recover an interrupted attempt using Razorpay's receipt filter.
      // Never automatically create another order if reconciliation is ambiguous.
      const results = await razorpay.orders.all({
        receipt: orderId,
        count: 100,
      });

      const matches = (results.items ?? []).filter(
        (item) =>
          item.receipt === orderId &&
          item.amount === amount &&
          item.currency === "INR"
      );

      if (matches.length !== 1) {
        console.error(
          "Payment-order recovery requires manual reconciliation.",
          { orderId, matchCount: matches.length }
        );

        return paymentError(
          "We could not safely recover payment setup. Please contact support with your order ID before trying again.",
          503
        );
      }

      const recovered = matches[0];

      const { data: recoveredOrder, error: recoveryError } =
        await supabaseAdmin
          .from("orders")
          .update({
            payment_order_id: recovered.id,
            payment_order_creation_started_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("payment_status", "pending")
          .is("payment_order_id", null)
          .select("id")
          .maybeSingle();

      if (recoveryError) {
        console.error("Could not save recovered Razorpay order.", recoveryError);

        return paymentError(
          "Payment setup needs support review. Do not retry payment yet.",
          503
        );
      }

      if (!recoveredOrder) {
        // Another request may have saved the order while recovery was running.
        const latest = await loadOrder();

        if (latest?.payment_order_id) {
          return await respondWithExistingOrder(latest.payment_order_id);
        }

        return paymentError(
          "Payment setup changed while recovering. Check order status before retrying.",
          409
        );
      }

      return await respondWithExistingOrder(recovered.id);
    }

    // This request owns the claim and is the only request allowed to create.
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: orderId,
      notes: { checkout_order_id: orderId },
    });

    // Save only if this request still owns the claim.
    const { data: savedOrder, error: saveError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_order_id: razorpayOrder.id,
        payment_order_creation_started_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("payment_status", "pending")
      .is("payment_order_id", null)
      .eq("payment_order_creation_started_at", claimTimestamp)
      .select("id")
      .maybeSingle();

    if (saveError || !savedOrder) {
      console.error("Could not persist Razorpay order ID.", {
        orderId,
        error: saveError,
      });

      // Keep the claim if saving failed. A later request can attempt recovery.
      return paymentError(
        "Payment setup could not be confirmed. Do not retry payment yet; check order status or contact support.",
        503
      );
    }

    return NextResponse.json({
      key_id: razorpayKeyId,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation or recovery failed.", error);

    return paymentError(
      "Could not safely start payment. Check order status before retrying.",
      502
    );
  }
}
