
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { supabase } from "@/lib/supabase/client";

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

type SavedAddress = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
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

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressesLoading, setAddressesLoading] = useState(true);

  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState("");
  const [paymentReview, setPaymentReview] = useState(false);

  // Load saved addresses and customer details.
  useEffect(() => {
    let active = true;

    async function loadCustomerDetails() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          setAddressesLoading(false);
          return;
        }

        const metadata = user.user_metadata || {};

        setForm((current) => ({
          ...current,
          name:
            current.name ||
            metadata.full_name ||
            metadata.name ||
            [metadata.given_name, metadata.family_name]
              .filter(Boolean)
              .join(" ") ||
            "",
          email: current.email || user.email || "",
        }));

        const { data, error: addressError } = await supabase
          .from("customer_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (!active) return;

        if (addressError) {
          console.error("Unable to load saved addresses:", addressError);
          setAddressesLoading(false);
          return;
        }

        const addresses = (data || []) as SavedAddress[];
        setSavedAddresses(addresses);

        const defaultAddress =
          addresses.find((address) => address.is_default) ||
          addresses[0];

        if (defaultAddress) {
          applySavedAddress(defaultAddress);
        }
      } catch (loadError) {
        console.error("Unable to load customer details:", loadError);
      } finally {
        if (active) setAddressesLoading(false);
      }
    }

    loadCustomerDetails();

    return () => {
      active = false;
    };
  }, []);

  // Check whether Razorpay is already available.
  useEffect(() => {
    if (window.Razorpay) {
      setScriptReady(true);
    }
  }, []);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));

    // Once the customer edits a prefilled address, treat it as manual.
    if (
      ["name", "phone", "address", "city", "state", "pincode"].includes(field)
    ) {
      setSelectedAddressId("");
    }
  }

  function applySavedAddress(address: SavedAddress) {
    const fullAddress = [
      address.address_line1,
      address.address_line2,
      address.landmark ? `Landmark: ${address.landmark}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    setForm((current) => ({
      ...current,
      name: address.recipient_name || current.name,
      phone: address.phone || current.phone,
      address: fullAddress,
      city: address.city || "",
      state: address.state || "",
      pincode: address.postal_code || "",
    }));

    setSelectedAddressId(address.id);
    setError("");
    setMessage("");
  }

  function handleAddressSelection(id: string) {
    setSelectedAddressId(id);

    if (!id) {
      setForm((current) => ({
        ...current,
        address: "",
        city: "",
        state: "",
        pincode: "",
      }));
      return;
    }

    const selected = savedAddresses.find((address) => address.id === id);

    if (selected) {
      applySavedAddress(selected);
    }
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
      // Keep the existing checkout API payload unchanged.
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

      try {
        localStorage.setItem(
          `kandid_order_${checkout.orderId}`,
          JSON.stringify({
            orderId: checkout.orderId,
            checkoutToken: checkout.checkoutToken,
          })
        );
      } catch {
        console.warn("Order recovery storage is unavailable.");
      }

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
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#F8F8F6] px-5 py-10 text-black">
        <section className="mx-auto w-full max-w-xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em]">
            KANDID LUXURY
          </p>

          <h1 className="mt-6 font-serif text-3xl font-medium sm:text-4xl">
            {paymentReview
              ? "Your payment was received."
              : "Thank you for your order."}
          </h1>

          <p className="mt-5 text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
            {paymentReview
              ? "Your payment was received, but your order requires manual review. Please do not make another payment. Our team needs to review your order before confirming fulfilment."
              : "Your payment has been verified successfully and your order is confirmed."}
          </p>

          <p className="mt-4 break-all text-xs text-neutral-500">
            Order ID: {confirmedOrder}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
            >
              Continue Shopping
            </Link>

            <Link
              href={`/order-status?orderId=${encodeURIComponent(
                confirmedOrder
              )}`}
              className="border border-black/20 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Track Your Order
            </Link>
          </div>
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

      <main className="min-h-[100dvh] bg-[#F8F8F6] px-3 pb-36 pt-4 text-black sm:px-8 sm:pb-10 sm:pt-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-6 flex h-10 items-center justify-between sm:mb-9">
            <Link
              href="/cart"
              className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600"
            >
              ← Back to bag
            </Link>

            <span className="text-[10px] font-semibold tracking-[0.25em]">
              KANDID LUXURY
            </span>

            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
              Secure
            </span>
          </header>

          <div className="mb-6 sm:mb-9">
            <h1 className="text-lg font-medium tracking-tight sm:text-2xl">
              Checkout
            </h1>

            <p className="mt-2 text-xs leading-5 text-neutral-500 sm:text-sm">
              Complete your details to continue to secure payment.
            </p>
          </div>

          {items.length === 0 ? (
            <section className="border-t border-black/10 py-10">
              <p className="text-sm text-neutral-600">
                Your shopping bag is empty.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
              >
                Explore Skincare
              </Link>
            </section>
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
              {/* Order summary */}
              <aside className="order-1 h-fit border border-black/[0.07] bg-white/70 p-3 sm:p-5 lg:order-2 lg:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium tracking-tight sm:text-lg">
                    Your Order
                  </h2>

                  <span className="text-[10px] text-neutral-500">
                    {totalItems} items
                  </span>
                </div>

                <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-[68px] w-[68px] shrink-0 bg-[#EEF1EF] sm:h-20 sm:w-20">
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

                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="text-xs font-medium leading-4 sm:text-sm">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[10px] text-neutral-500 sm:text-xs">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-t border-black/10 pt-4 text-xs sm:mt-5 sm:text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-500">
                      Bag Subtotal ({totalItems} items)
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-neutral-500">Delivery</span>
                    <span className="text-[10px] uppercase tracking-wider">
                      Free
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/10 pt-4">
                    <div>
                      <p className="text-xs font-medium">Total Amount</p>
                      <p className="mt-1 text-[10px] text-neutral-500">
                        Inclusive of free delivery
                      </p>
                    </div>

                    <span className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="text-[10px] leading-4 text-neutral-500 sm:text-xs sm:leading-5">
                    Final price and stock are checked by the server before payment.
                  </p>
                </div>
              </aside>

              {/* Customer form */}
              <form
                id="checkout-form"
                onSubmit={handleCheckout}
                className="order-2 space-y-6 lg:order-1 lg:space-y-7"
              >
                {/* Contact details */}
                <section>
                  <h2 className="mb-4 text-base font-medium tracking-tight sm:text-lg">
                    Contact Details
                  </h2>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <input
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="col-span-2 w-full border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:col-span-1 sm:px-4 sm:py-4"
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
                      className="col-span-2 w-full border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:col-span-1 sm:px-4 sm:py-4"
                    />

                    <input
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="Email address (optional)"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="col-span-2 w-full border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:px-4 sm:py-4"
                    />
                  </div>
                </section>

                {/* Shipping address */}
                <section>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-base font-medium tracking-tight sm:text-lg">
                      Shipping Address
                    </h2>

                    <Link
                      href="/account"
                      className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500 underline underline-offset-4 hover:text-black"
                    >
                      Manage addresses
                    </Link>
                  </div>

                  {/* Saved address selector */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-4 border border-black/10 bg-white p-3 sm:p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-medium">
                          Your saved addresses
                        </p>
                        <span className="text-[10px] text-neutral-400">
                          {savedAddresses.length} saved
                        </span>
                      </div>

                      <select
                        value={selectedAddressId}
                        onChange={(e) =>
                          handleAddressSelection(e.target.value)
                        }
                        className="w-full border border-black/15 bg-[#F8F8F6] px-3 py-3 text-sm text-black outline-none focus:border-black"
                      >
                        <option value="">Enter a different address</option>

                        {savedAddresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.label}
                            {address.is_default ? " (Default)" : ""} —{" "}
                            {address.city}
                          </option>
                        ))}
                      </select>

                      <p className="mt-2 text-[10px] leading-4 text-neutral-500">
                        Select an address to automatically fill your delivery details.
                      </p>
                    </div>
                  )}

                  {addressesLoading && (
                    <p className="mb-3 text-[11px] text-neutral-400">
                      Checking your saved addresses...
                    </p>
                  )}

                  <div className="grid gap-2.5 sm:gap-3">
                    <input
                      required
                      maxLength={500}
                      autoComplete="street-address"
                      placeholder="House / flat, street, area"
                      value={form.address}
                      onChange={(e) =>
                        updateField("address", e.target.value)
                      }
                      className="w-full border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:px-4 sm:py-4"
                    />

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      <input
                        required
                        maxLength={100}
                        autoComplete="address-level2"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full min-w-0 border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:px-4 sm:py-4"
                      />

                      <input
                        required
                        maxLength={100}
                        autoComplete="address-level1"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="w-full min-w-0 border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:px-4 sm:py-4"
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
                        className="col-span-2 w-full border border-black/15 bg-white px-3 py-3.5 text-sm font-normal text-black outline-none placeholder:text-neutral-400 focus:border-black sm:px-4 sm:py-4"
                      />
                    </div>
                  </div>
                </section>

                {/* Error messages */}
                {error && (
                  <p
                    role="alert"
                    className="border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800 sm:p-4 sm:text-sm"
                  >
                    {error}
                  </p>
                )}

                {message && (
                  <p
                    role="status"
                    className="border border-black/10 bg-white p-3 text-xs leading-5 text-neutral-600 sm:p-4 sm:text-sm"
                  >
                    {message}
                  </p>
                )}

                {/* Desktop payment button */}
                <button
                  type="submit"
                  disabled={loading || !scriptReady}
                  className="hidden w-full bg-black px-8 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 lg:block"
                >
                  {loading
                    ? "Preparing Secure Checkout..."
                    : !scriptReady
                      ? "Loading Secure Payment..."
                      : "Continue to Secure Payment"}
                </button>

                <p className="text-xs leading-5 text-neutral-500 sm:text-sm">
                  Online payment only. Your order is confirmed after payment verification.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky payment bar */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#F8F8F6]/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                Total Amount
              </p>

              <p className="mt-0.5 text-xl font-semibold tracking-tight text-black">
                {formatPrice(subtotal)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500">
                {totalItems} items
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                Free Delivery
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading || !scriptReady}
            className="mx-auto mt-3 flex h-12 w-full max-w-6xl items-center justify-center bg-black text-[10px] font-medium uppercase tracking-[0.2em] text-white active:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Preparing Secure Checkout..."
              : !scriptReady
                ? "Loading Secure Payment..."
                : "Continue to Secure Payment →"}
          </button>
        </div>
      )}
    </>
  );
}
