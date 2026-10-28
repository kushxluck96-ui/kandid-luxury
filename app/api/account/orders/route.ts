
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Verify the signed-in customer using their server-side session.
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your orders." },
        { status: 401 }
      );
    }

    // Only retrieve orders linked to this authenticated account.
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, subtotal, delivery_charge, total, payment_method, payment_status, order_status, courier_name, tracking_number, tracking_url, shipped_at, delivered_at"
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Customer orders query failed:", ordersError.message);
      return NextResponse.json(
        { success: false, error: "Unable to load your orders right now." },
        { status: 500 }
      );
    }

    const orderIds = (orders ?? []).map((order) => order.id);

    let items: Array<{
      id: string;
      order_id: string;
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
          "id, order_id, product_name, product_slug, price, quantity, weight, image_url"
        )
        .in("order_id", orderIds);

      if (itemsError) {
        console.error("Customer order items query failed:", itemsError.message);
        return NextResponse.json(
          { success: false, error: "Unable to load order details right now." },
          { status: 500 }
        );
      }

      items = orderItems ?? [];
    }

    const ordersWithItems = (orders ?? []).map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
    });
  } catch (error) {
    console.error("Customer orders API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
