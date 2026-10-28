
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
    // Verify the signed-in administrator.
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

    const newStatus =
      typeof body.orderStatus === "string"
        ? body.orderStatus.trim()
        : "";

    if (!isValidUuid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    if (!["processing", "shipped", "delivered"].includes(newStatus)) {
      return NextResponse.json(
        { error: "Invalid fulfillment status" },
        { status: 400 }
      );
    }

    // Fetch current state before validating the transition.
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

    // Update only fulfillment/tracking fields, never payment status.
    // Conditions prevent overwriting a concurrent status change.
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
