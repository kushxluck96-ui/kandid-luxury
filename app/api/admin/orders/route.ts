
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "kusheazy@gmail.com";

async function isAuthorizedAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return false;
  }

  return true;
}

export async function GET() {
  try {
    if (!(await isAuthorizedAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_country, subtotal, delivery_charge, total, payment_method, payment_status, order_status, payment_id, payment_order_id, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (ordersError) {
      console.error("Admin orders query failed:", ordersError.message);

      return NextResponse.json(
        { error: "Unable to load orders" },
        { status: 500 }
      );
    }

    const orderIds = (orders ?? []).map((order) => order.id);

    let items: Array<{
      id: string;
      order_id: string;
      product_id: string;
      product_name: string;
      product_slug: string;
      price: number;
      quantity: number;
      weight: string | null;
      image_url: string | null;
    }> = [];

    if (orderIds.length > 0) {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from("order_items")
        .select(
          "id, order_id, product_id, product_name, product_slug, price, quantity, weight, image_url"
        )
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("Admin order items query failed:", itemsError.message);

        return NextResponse.json(
          { error: "Unable to load order items" },
          { status: 500 }
        );
      }

      items = orderItems ?? [];
    }

    const itemsByOrder = new Map<string, typeof items>();

    for (const item of items) {
      const existing = itemsByOrder.get(item.order_id) ?? [];
      existing.push(item);
      itemsByOrder.set(item.order_id, existing);
    }

    const result = (orders ?? []).map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) ?? [],
    }));

    return NextResponse.json(
      { orders: result },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin orders API failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
