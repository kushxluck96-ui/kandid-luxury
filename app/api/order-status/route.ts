
import { NextResponse } from "next/server";
import {
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    const checkoutToken =
      typeof body.checkoutToken === "string"
        ? body.checkoutToken.trim()
        : "";

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        orderId
      );

    if (
      !isValidUuid ||
      !/^[a-f0-9]{64}$/.test(checkoutToken)
    ) {
      return NextResponse.json(
        { error: "Invalid order recovery credentials." },
        { status: 400 }
      );
    }

    const suppliedHash = createHash("sha256")
      .update(checkoutToken)
      .digest();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Order status lookup failed:", error.message);

      return NextResponse.json(
        { error: "Unable to retrieve order status right now." },
        { status: 500 }
      );
    }

    if (
      !order ||
      typeof order.checkout_token_hash !== "string" ||
      !/^[a-f0-9]{64}$/.test(order.checkout_token_hash)
    ) {
      return NextResponse.json(
        {
          error:
            "Order not found or recovery credentials are invalid.",
        },
        { status: 404 }
      );
    }

    const storedHash = Buffer.from(
      order.checkout_token_hash,
      "hex"
    );

    if (
      storedHash.length !== suppliedHash.length ||
      !timingSafeEqual(storedHash, suppliedHash)
    ) {
      return NextResponse.json(
        {
          error:
            "Order not found or recovery credentials are invalid.",
        },
        { status: 404 }
      );
    }

    // Return only customer-facing order and tracking fields.
    // Never expose checkout_token_hash or other database fields.
    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          total: Number(order.total),
          paymentStatus: order.payment_status,
          orderStatus: order.order_status,
          createdAt: order.created_at,
          courierName: order.courier_name ?? null,
          trackingNumber: order.tracking_number ?? null,
          trackingUrl: order.tracking_url ?? null,
          shippedAt: order.shipped_at ?? null,
          deliveredAt: order.delivered_at ?? null,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Order status request failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve order status right now." },
      { status: 500 }
    );
  }
}
