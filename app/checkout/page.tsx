
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type VerificationResponse = {
  success?: boolean;
  orderId?: string;
  orderStatus?: "confirmed" | "payment_review";
  error?: string;
};

type CheckoutResponse = {
  orderId: string;
  total: number;
  checkoutToken: string;
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [scriptReady, setScriptReady] = useState(false);
  useEffect(() => {
  if (window.Razorpay) {
    setScriptReady(true);
  }
}, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState("");
  const [paymentReview, setPaymentReview] = useState(false);

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function postJSON(
    url: string,
    body: unknown
  ): Promise<Record<string, unknown>> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: unknown = await response.json();

    if (!data || typeof data !== "object") {
      throw new Error(
        "We received an unexpected response. Please check your order status before trying again."
      );
    }

    const result = data as Record<string, unknown>;

    if (!response.ok) {
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : "Something went wrong. Please try again."
      );
    }

    return result;
  }

  async function handleCheckout(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!scriptReady || !window.Razorpay) {
      setError(
        "Secure payment is loading. Please try again in a moment."
      );
      return;
    }

    setLoading(true);

    try {
      // Create the checkout order and reserve stock on the server.
      const checkoutResult = await postJSON("/api/checkout", {
        ...form,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      if (
        typeof checkoutResult.orderId !== "string" ||
        typeof checkoutResult.total !== "number" ||
        typeof checkoutResult.checkoutToken !== "string" ||
        !/^[a-f0-9]{64}$/.test(checkoutResult.checkoutToken)
      ) {
        throw new Error(
          "We couldn't prepare your order securely. Please contact customer support if an order was created."
        );
      }

      const checkout: CheckoutResponse = {
  orderId: checkoutResult.orderId,
  total: checkoutResult.total,
  checkoutToken: checkoutResult.checkoutToken,
};

// Save recovery credentials before opening the payment window.
try {
  localStorage.setItem(
    `kandid_order_${checkout.orderId}`,
    JSON.stringify({
      orderId: checkout.orderId,
      checkoutToken: checkout.checkoutToken,
    })
  );
} catch {
  // Checkout can continue if browser storage is unavailable.
  console.warn("Order recovery storage is unavailable.");
}

      // Create the Razorpay order using the saved server-side order.
      // The API must validate the token against the stored hash.
      const paymentOrder = await postJSON("/api/create-order", {
        orderId: checkout.orderId,
        checkoutToken: checkout.checkoutToken,
      });

      if (
        typeof paymentOrder.key_id !== "string" ||
        typeof paymentOrder.order_id !== "string" ||
        typeof paymentOrder.amount !== "number" ||
        typeof paymentOrder.currency !== "string"
      ) {
        throw new Error(
          "We couldn't initialize secure payment. Please check your order status before trying again."
        );
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.key_id,
        order_id: paymentOrder.order_id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "KANDID LUXURY",
        description: "Premium skincare order",
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          checkout_order_id: checkout.orderId,
        },
        theme: {
          color: "#25251F",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage(
              "The payment window was closed. Your order may still be pending. Check its payment status before attempting another payment."
            );
          },
        },
        handler: async (response: unknown) => {
          const payment = response as Partial<RazorpaySuccess>;

          if (
            typeof payment.razorpay_payment_id !== "string" ||
            typeof payment.razorpay_order_id !== "string" ||
            typeof payment.razorpay_signature !== "string"
          ) {
            setLoading(false);
            setError(
              "We couldn't read the payment confirmation. Please contact customer support before attempting another payment."
            );
            return;
          }

          try {
            const result = await postJSON("/api/verify-payment", {
              orderId: checkout.orderId,
              checkoutToken: checkout.checkoutToken,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_signature: payment.razorpay_signature,
            });

            const verification = result as VerificationResponse;

            if (
              verification.success === true &&
              verification.orderStatus === "confirmed"
            ) {
              clearCart();
              setPaymentReview(false);
              setConfirmedOrder(
                typeof verification.orderId === "string"
                  ? verification.orderId
                  : checkout.orderId
              );
              setError("");
              setMessage("");
              return;
            }

            if (
              verification.success === true &&
              verification.orderStatus === "payment_review"
            ) {
              clearCart();
              setPaymentReview(true);
              setConfirmedOrder(
                typeof verification.orderId === "string"
                  ? verification.orderId
                  : checkout.orderId
              );
              setError("");
              setMessage("");
              return;
            }

            setError(
              "Your payment status could not be confirmed. Please do not pay again. Contact customer support with your order ID: " +
                checkout.orderId
            );
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message +
                  " Do not make another payment until your payment status has been checked. Order ID: " +
                  checkout.orderId
                : "We couldn't confirm your payment. Do not pay again until the payment status has been checked. Order ID: " +
                  checkout.orderId
            );
          } finally {
            setLoading(false);
          }
        },
      });

      razorpay.on("payment.failed", (response: unknown) => {
        const details = response as {
          error?: {
            description?: string;
            reason?: string;
          };
        };

        setLoading(false);
        setError(
          details.error?.description ||
            "Payment failed. Your order has not been confirmed. If money was deducted, check the payment status before trying again."
        );
      });

      razorpay.open();
    } catch (checkoutError) {
  setLoading(false);

  setError(
    checkoutError instanceof Error
      ? `${checkoutError.message} If an order was created, your stock reservation may remain active for up to 15 minutes. If you are unsure whether payment was completed, check your order status before trying again.`
      : "Unable to start checkout. If an order was created, check its status before trying again."
  );
}
  }

  if (confirmedOrder) {
    return (
      <main className="min-h-screen bg-[#F8F8F6] px-6 py-24 text-[#25251F]">
        <section className="mx-auto max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.3em]">
            Kandid Luxury
          </p>

          <h1 className="mt-6 font-serif text-4xl">
            {paymentReview
              ? "Your payment was received."
              : "Thank you for your order."}
          </h1>

          <p className="mt-5 text-sm leading-7 text-neutral-600">
            {paymentReview
              ? "Your payment was received, but your order requires manual review. Please do not make another payment. Our team needs to review your order before confirming fulfilment."
              : "Your payment has been verified successfully and your order is confirmed."}
          </p>

          <p className="mt-4 break-all text-xs text-neutral-500">
            Order ID: {confirmedOrder}
          </p>

          <Link
            href="/shop"
            className="mt-10 inline-flex bg-[#25251F] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white"
          >
            Continue Shopping
          </Link>
          <Link
  href={`/order-status?orderId=${encodeURIComponent(confirmedOrder)}`}
  className="mt-4 inline-flex border border-neutral-300 px-8 py-4 text-xs uppercase tracking-[0.2em]"
>
  Track Your Order
</Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() =>
          setError(
            "Unable to load secure payment. Please refresh and try again."
          )
        }
      />

      <main className="min-h-screen bg-[#F8F8F6] px-5 py-12 text-[#25251F] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/cart"
            className="text-xs uppercase tracking-[0.2em] text-neutral-500"
          >
            ← Back to bag
          </Link>

          <header className="mb-12 mt-8">
            <p className="text-xs uppercase tracking-[0.35em]">
              Kandid Luxury
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
              Checkout
            </h1>
            <p className="mt-4 text-sm text-neutral-500">
              Complete your shipping details to continue to secure
              payment.
            </p>
          </header>

          {items.length === 0 ? (
            <section className="border-t border-neutral-300 py-12">
              <p className="text-neutral-600">
                Your shopping bag is empty.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block bg-[#25251F] px-7 py-4 text-xs uppercase tracking-[0.2em] text-white"
              >
                Explore skincare
              </Link>
            </section>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <form onSubmit={handleCheckout} className="space-y-8">
                <section>
                  <h2 className="mb-5 font-serif text-2xl">
                    Contact details
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                    />

                    <input
                      required
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      autoComplete="tel-national"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                    />

                    <input
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="Email address (optional)"
                      value={form.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                      className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800 sm:col-span-2"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="mb-5 font-serif text-2xl">
                    Shipping address
                  </h2>

                  <div className="grid gap-4">
                    <input
                      required
                      maxLength={500}
                      autoComplete="street-address"
                      placeholder="House / flat, street, area"
                      value={form.address}
                      onChange={(e) =>
                        updateField("address", e.target.value)
                      }
                      className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        required
                        maxLength={100}
                        autoComplete="address-level2"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                          updateField("city", e.target.value)
                        }
                        className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                      />

                      <input
                        maxLength={100}
                        autoComplete="address-level1"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) =>
                          updateField("state", e.target.value)
                        }
                        className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                      />

                      <input
                        required
                        inputMode="numeric"
                        pattern="[1-9][0-9]{5}"
                        maxLength={6}
                        autoComplete="postal-code"
                        placeholder="6-digit PIN code"
                        value={form.pincode}
                        onChange={(e) =>
                          updateField(
                            "pincode",
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
                      />
                    </div>
                  </div>
                </section>

                {error && (
                  <p
                    role="alert"
                    className="border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                  >
                    {error}
                  </p>
                )}

                {message && (
                  <p
                    role="status"
                    className="border border-neutral-300 p-4 text-sm text-neutral-700"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !scriptReady}
                  className="w-full bg-[#25251F] px-8 py-5 text-xs uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Preparing secure checkout…"
                    : !scriptReady
                      ? "Loading secure payment…"
                      : "Continue to secure payment"}
                </button>

                <p className="text-xs leading-6 text-neutral-500">
                  Online payment only. Your order is confirmed after
                  payment verification.
                </p>
              </form>

              <aside className="h-fit border border-neutral-300 p-6 sm:p-8">
                <h2 className="font-serif text-2xl">Your order</h2>

                <div className="mt-7 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 bg-white">
                        {item.image_url && (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm">{item.name}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-2 text-sm">
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4 border-t border-neutral-300 pt-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-600">
                      Bag subtotal
                    </span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-600">Delivery</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-neutral-300 pt-5 font-medium">
                    <span>Estimated total</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <p className="text-xs leading-5 text-neutral-500">
                    Final price and stock are checked by the server
                    before payment.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
