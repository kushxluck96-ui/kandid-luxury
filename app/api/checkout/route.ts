
import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Checkout authentication check:", authError.message);
    }

    const customerId = user?.id ?? null;

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const address =
      typeof body.address === "string" ? body.address.trim() : "";
    const city =
      typeof body.city === "string" ? body.city.trim() : "";
    const state =
      typeof body.state === "string" ? body.state.trim() : "";
    const pincode =
      typeof body.pincode === "string" ? body.pincode.trim() : "";

    if (!name || !phone || !address || !city || !pincode) {
      return NextResponse.json(
        { error: "Please complete all required shipping details." },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      address.length > 500 ||
      city.length > 100
    ) {
      return NextResponse.json(
        { error: "Please check your shipping details." },
        { status: 400 }
      );
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Enter a valid 6-digit Indian PIN code." },
        { status: 400 }
      );
    }

   if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return NextResponse.json(
    { error: "Enter a valid email address." },
    { status: 400 }
  );
}

    if (email.length > 254 || state.length > 100) {
      return NextResponse.json(
        { error: "Please check your contact and address details." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.length > 10
    ) {
      return NextResponse.json(
        { error: "Your bag is empty or contains too many items." },
        { status: 400 }
      );
    }

    const items = body.items.map(
      (item: { id?: unknown; quantity?: unknown }) => {
        if (
          typeof item.id !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            item.id
          ) ||
          !Number.isInteger(item.quantity) ||
          (item.quantity as number) < 1 ||
          (item.quantity as number) > 200
        ) {
          throw new Error("INVALID_CART");
        }

        return {
          product_id: item.id,
          quantity: item.quantity,
        };
      }
    );

    // Generate a high-entropy, one-per-checkout recovery token.
    const checkoutToken = randomBytes(32).toString("hex");
    const checkoutTokenHash = createHash("sha256")
      .update(checkoutToken)
      .digest("hex");

    const { data, error } = await supabaseAdmin.rpc(
      "create_checkout_order",
      {
        p_customer_name: name,
        p_customer_email: email,
        p_customer_phone: phone,
        p_shipping_address: address,
        p_shipping_city: city,
        p_shipping_state: state,
        p_shipping_pincode: pincode,
        p_items: items,
        p_checkout_token_hash: checkoutTokenHash,
        p_customer_id: customerId,
      }
    );

    if (error) {
      console.error("Checkout order creation failed:", error.message);

      const stockOrProductIssue =
        /stock|unavailable|quantity|empty|invalid product/i.test(
          error.message
        );

      return NextResponse.json(
        {
          error: stockOrProductIssue
            ? "A product is unavailable or stock has changed. Please review your bag."
            : "We couldn't prepare your order. Please check your details and try again.",
        },
        { status: stockOrProductIssue ? 409 : 400 }
      );
    }

    const order = Array.isArray(data) ? data[0] : data;

    if (!order?.order_id || order.order_total == null) {
      console.error("Checkout RPC returned an unexpected response.");
      return NextResponse.json(
        { error: "We couldn't prepare your order. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.order_id,
      total: Number(order.order_total),
      checkoutToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CART") {
      return NextResponse.json(
        {
          error:
            "Your bag contains invalid items. Please refresh and try again.",
        },
        { status: 400 }
      );
    }

    console.error("Checkout request failed.", error);

    return NextResponse.json(
      { error: "Something went wrong while preparing checkout." },
      { status: 400 }
    );
  }
}
