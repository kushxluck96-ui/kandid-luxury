
import { NextResponse } from "next/server";
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSecret || !keyId || !keySecret) {
      console.error("Razorpay webhook environment variables are missing.");
      return NextResponse.json(
        { error: "Webhook configuration unavailable." },
        { status: 503 }
      );
    }

    // Verify the signature against the original, unmodified body.
    const rawBody = await request.text();
    const receivedSignature =
      request.headers.get("x-razorpay-signature") ?? "";

    if (!/^[a-f0-9]{64}$/i.test(receivedSignature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest();

    const suppliedSignature = Buffer.from(
      receivedSignature,
      "hex"
    );

    if (
      suppliedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(suppliedSignature, expectedSignature)
    ) {
      console.error("Razorpay webhook signature verification failed.");

      return NextResponse.json(
        { error: "Webhook signature verification failed." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    // We only finalize successfully captured payments.
    if (event.event !== "payment.captured") {
      return NextResponse.json({
        received: true,
        ignored: true,
      });
    }

    const entity = event.payload?.payment?.entity;

    const paymentId =
      typeof entity?.id === "string" ? entity.id : "";

    const razorpayOrderId =
      typeof entity?.order_id === "string" ? entity.order_id : "";

    if (!paymentId || !razorpayOrderId) {
      console.error("Captured webhook is missing payment/order IDs.");

      return NextResponse.json(
        { error: "Payment details are missing." },
        { status: 400 }
      );
    }

    // Retrieve the payment independently from Razorpay.
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const payment = await razorpay.payments.fetch(paymentId);

    if (
      payment.id !== paymentId ||
      payment.order_id !== razorpayOrderId ||
      payment.status !== "captured"
    ) {
      console.error("Razorpay payment could not be independently verified.", {
        paymentId,
        razorpayOrderId,
        status: payment.status,
      });

      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 409 }
      );
    }

    // Find the Kandid order using its Razorpay order ID.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, total, payment_status, payment_order_id")
      .eq("payment_order_id", razorpayOrderId)
      .maybeSingle();

    if (orderError) {
      console.error("Webhook could not retrieve Kandid order.", orderError);
      return NextResponse.json(
        { error: "Could not retrieve order." },
        { status: 500 }
      );
    }

    if (!order) {
      console.error("No Kandid order matches captured Razorpay order.", {
        razorpayOrderId,
        paymentId,
      });

      return NextResponse.json({
        received: true,
        requiresReview: true,
      });
    }

    // Check the amount and currency before changing order status.
    const expectedAmount = Math.round(Number(order.total) * 100);

    if (
      !Number.isFinite(expectedAmount) ||
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      console.error("Captured payment amount/currency mismatch.", {
        checkoutOrderId: order.id,
        paymentId,
        expectedAmount,
        receivedAmount: payment.amount,
        currency: payment.currency,
      });

      return NextResponse.json({
        received: true,
        requiresReview: true,
      });
    }

    // The database function handles duplicates and expired reservations.
    const { data: result, error: finalizeError } =
      await supabaseAdmin.rpc("finalize_checkout_payment", {
        p_order_id: order.id,
        p_payment_id: paymentId,
      });

    if (finalizeError) {
      console.error("Webhook could not finalize payment.", finalizeError);

      // A non-2xx response asks Razorpay to retry the webhook.
      return NextResponse.json(
        { error: "Order finalization failed." },
        { status: 500 }
      );
    }

    if (
      result !== "confirmed" &&
      result !== "payment_review"
    ) {
      console.error("Captured payment requires manual review.", {
        checkoutOrderId: order.id,
        paymentId,
        result,
      });
    }

    console.log("Razorpay captured payment processed.", {
      checkoutOrderId: order.id,
      paymentId,
      result,
    });

    return NextResponse.json({
      received: true,
      orderId: order.id,
      orderStatus: result,
    });
  } catch (error) {
    console.error("Razorpay webhook processing failed.", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
