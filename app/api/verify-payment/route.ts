
import { NextResponse } from "next/server";
import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment verification is unavailable." },
        { status: 503 }
      );
    }

    const body = await request.json();

    const checkoutOrderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";

    const checkoutToken =
      typeof body.checkoutToken === "string"
        ? body.checkoutToken.trim()
        : "";

    const paymentId =
      typeof body.razorpay_payment_id === "string"
        ? body.razorpay_payment_id.trim()
        : "";

    const razorpayOrderId =
      typeof body.razorpay_order_id === "string"
        ? body.razorpay_order_id.trim()
        : "";

    const signature =
      typeof body.razorpay_signature === "string"
        ? body.razorpay_signature.trim()
        : "";

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        checkoutOrderId
      );

    if (
      !isValidUuid ||
      !/^[a-f0-9]{64}$/.test(checkoutToken) ||
      !paymentId ||
      !razorpayOrderId ||
      !signature
    ) {
      return NextResponse.json(
        { error: "Required payment details are invalid or missing." },
        { status: 400 }
      );
    }

    // Verify checkout ownership before processing payment confirmation.
    const suppliedTokenHash = createHash("sha256")
      .update(checkoutToken)
      .digest();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, total, payment_status, payment_order_id, checkout_token_hash"
      )
      .eq("id", checkoutOrderId)
      .maybeSingle();

    if (orderError) {
      console.error("Could not retrieve checkout order.", orderError);

      return NextResponse.json(
        { error: "Could not verify checkout credentials." },
        { status: 500 }
      );
    }

    if (
      !order ||
      typeof order.checkout_token_hash !== "string" ||
      !/^[a-f0-9]{64}$/.test(order.checkout_token_hash)
    ) {
      return NextResponse.json(
        { error: "Checkout credentials are invalid or expired." },
        { status: 403 }
      );
    }

    const storedTokenHash = Buffer.from(
      order.checkout_token_hash,
      "hex"
    );

    if (
      storedTokenHash.length !== suppliedTokenHash.length ||
      !timingSafeEqual(storedTokenHash, suppliedTokenHash)
    ) {
      return NextResponse.json(
        { error: "Checkout credentials are invalid or expired." },
        { status: 403 }
      );
    }

    if (order.payment_order_id !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Payment does not match this order." },
        { status: 400 }
      );
    }

    // Verify Razorpay's checkout signature.
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest();

    if (!/^[a-fA-F0-9]{64}$/.test(signature)) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const receivedSignature = Buffer.from(signature, "hex");

    if (
      receivedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    // Independently verify the payment with Razorpay.
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const payment = await razorpay.payments.fetch(paymentId);

    if (
      payment.order_id !== razorpayOrderId ||
      payment.status !== "captured" ||
      Number(payment.amount) !==
        Math.round(Number(order.total) * 100) ||
      payment.currency !== "INR"
    ) {
      return NextResponse.json(
        {
          error:
            "Payment is not confirmed as captured. Please check your payment status before trying again.",
        },
        { status: 409 }
      );
    }

    // Atomically finalize payment in Supabase.
    const { data: result, error: finalizeError } =
      await supabaseAdmin.rpc("finalize_checkout_payment", {
        p_order_id: order.id,
        p_payment_id: paymentId,
      });

    if (finalizeError) {
      console.error(
        "Could not finalize checkout payment.",
        finalizeError
      );

      return NextResponse.json(
        {
          error:
            "Payment was verified, but order confirmation needs checking. Please do not pay again; contact customer support.",
        },
        { status: 500 }
      );
    }

    if (result === "confirmed") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderStatus: "confirmed",
      });
    }

    if (result === "payment_review") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderStatus: "payment_review",
        message:
          "Payment received. Your order needs manual review. Please do not pay again; contact customer support.",
      });
    }

    if (result === "not_found") {
      return NextResponse.json(
        { error: "Checkout order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Payment was received, but the order could not be confirmed automatically. Please do not pay again; contact customer support.",
      },
      { status: 409 }
    );
  } catch (error) {
    console.error("Payment verification failed.", error);

    return NextResponse.json(
      {
        error:
          "Could not verify payment. Please contact customer support.",
      },
      { status: 502 }
    );
  }
}
