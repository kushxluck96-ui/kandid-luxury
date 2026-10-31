
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Razorpay from "razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "kusheazy@gmail.com";

const allowedTransitions: Record<string, string[]> = {
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
};

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

function isValidTrackingUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function PATCH(request: Request) {
  try {
    // Verify administrator authentication.
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (
      authError ||
      !user ||
      user.email?.toLowerCase() !== ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId =
      typeof body.orderId === "string" ? body.orderId.trim() : "";

    if (!isValidUuid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Retrieve the current order.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) {
      console.error("Order lookup failed:", orderError.message);

      return NextResponse.json(
        { error: "Unable to verify order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    /*
     * SPECIAL ADMIN ACTION:
     * Verify payment directly with Razorpay and confirm the order.
     */
    if (body.action === "verify_and_confirm") {
      if (order.order_status !== "payment_review") {
        return NextResponse.json(
          {
            error:
              "This order is no longer in payment review. Refresh the orders page.",
          },
          { status: 409 }
        );
      }

      if (!order.payment_id || !order.payment_order_id) {
        return NextResponse.json(
          {
            error:
              "Payment ID or Razorpay order ID is missing. Cannot verify this payment.",
          },
          { status: 400 }
        );
      }

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return NextResponse.json(
          {
            error: "Razorpay verification is not configured on the server.",
          },
          { status: 503 }
        );
      }

      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // Independently retrieve the payment from Razorpay.
      const payment = await razorpay.payments.fetch(order.payment_id);

      const expectedAmount = Math.round(Number(order.total) * 100);
      const refundedAmount = Number(payment.amount_refunded ?? 0);

      if (payment.order_id !== order.payment_order_id) {
        return NextResponse.json(
          {
            error:
              "Razorpay payment belongs to a different order. Order was not confirmed.",
          },
          { status: 409 }
        );
      }

      if (
        payment.status !== "captured" ||
        Number(payment.amount) !== expectedAmount ||
        payment.currency !== "INR" ||
        refundedAmount > 0
      ) {
        return NextResponse.json(
          {
            error:
              "Razorpay could not verify a fully captured, non-refunded payment for the exact order amount. Order was not confirmed.",
          },
          { status: 409 }
        );
      }

      // Confirm only if the order is still in payment_review.
      // Payment status is updated from Razorpay's verified result.
      const { data: updatedOrder, error: updateError } =
        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("order_status", "payment_review")
          .eq("payment_status", order.payment_status)
          .select(
            "id, order_status, payment_status, payment_id, payment_order_id, updated_at"
          )
          .maybeSingle();

      if (updateError) {
        console.error(
          "Payment review confirmation failed:",
          updateError.message
        );

        return NextResponse.json(
          {
            error:
              "Razorpay verified the payment, but the order update failed. Do not ask the customer to pay again. Refresh and check the order.",
          },
          { status: 500 }
        );
      }

      if (!updatedOrder) {
        return NextResponse.json(
          {
            error:
              "The order changed during verification. Refresh the page and check its current status.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Razorpay payment verified. Order confirmed successfully.",
        order: updatedOrder,
      });
    }

    // NORMAL FULFILLMENT STATUS UPDATE.
    const newStatus =
      typeof body.orderStatus === "string"
        ? body.orderStatus.trim()
        : "";

    if (!["processing", "shipped", "delivered"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid fulfillment status" },
        { status: 400 }
      );
    }

    if ((order.payment_status ?? "").toLowerCase() !== "paid") {
      return NextResponse.json(
        { error: "Only paid orders can be fulfilled" },
        { status: 409 }
      );
    }

    const currentStatus = order.order_status ?? "";
    const allowedNextStatuses = allowedTransitions[currentStatus] ?? [];

    if (!allowedNextStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot change order from "${currentStatus}" to "${newStatus}"`,
        },
        { status: 409 }
      );
    }

    const update: Record<string, string> = {
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "shipped") {
      const courierName =
        typeof body.courierName === "string"
          ? body.courierName.trim()
          : "";

      const trackingNumber =
        typeof body.trackingNumber === "string"
          ? body.trackingNumber.trim()
          : "";

      const trackingUrl =
        typeof body.trackingUrl === "string"
          ? body.trackingUrl.trim()
          : "";

      if (
        !courierName ||
        courierName.length > 100 ||
        !trackingNumber ||
        trackingNumber.length > 100 ||
        !trackingUrl ||
        trackingUrl.length > 2048 ||
        !isValidTrackingUrl(trackingUrl)
      ) {
        return NextResponse.json(
          {
            error:
              "For shipping, provide a valid courier name, tracking number, and HTTP/HTTPS tracking URL.",
          },
          { status: 400 }
        );
      }

      update.courier_name = courierName;
      update.tracking_number = trackingNumber;
      update.tracking_url = trackingUrl;
      update.shipped_at = new Date().toISOString();
    }

    if (newStatus === "delivered") {
      update.delivered_at = new Date().toISOString();
    }

    const { data: updatedOrder, error: updateError } =
      await supabaseAdmin
        .from("orders")
        .update(update)
        .eq("id", orderId)
        .eq("payment_status", "paid")
        .eq("order_status", currentStatus)
        .select(
          "id, order_status, payment_status, courier_name, tracking_number, tracking_url, shipped_at, delivered_at, updated_at"
        )
        .maybeSingle();

    if (updateError) {
      console.error("Order status update failed:", updateError.message);

      return NextResponse.json(
        { error: "Unable to update order status" },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        {
          error:
            "The order changed while you were updating it. Refresh and try again.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Admin order status API failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
