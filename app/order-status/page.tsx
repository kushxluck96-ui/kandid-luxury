
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedRecovery = {
  orderId: string;
  checkoutToken: string;
};

type OrderStatusResponse = {
  success?: boolean;
  error?: string;
  order?: {
    id: string;
    total: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    courierName?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
  };
};

function formatStatus(value: string | null | undefined) {
  if (!value) return "Unknown";

  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function validRecovery(value: Partial<SavedRecovery>, orderId: string) {
  return (
    value.orderId === orderId &&
    typeof value.checkoutToken === "string" &&
    /^[a-f0-9]{64}$/.test(value.checkoutToken)
  );
}

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] =
    useState<OrderStatusResponse["order"]>();

  async function checkOrder(credentials: SavedRecovery) {
    setLoading(true);
    setError("");
    setOrder(undefined);
    setOrderId(credentials.orderId);

    try {
      const response = await fetch("/api/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        cache: "no-store",
      });

      const data = (await response.json()) as OrderStatusResponse;

      if (!response.ok || !data.success || !data.order) {
        throw new Error(
          data.error || "We couldn't retrieve this order."
        );
      }

      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve your order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const requestedOrderId = new URLSearchParams(
      window.location.search
    ).get("orderId");

    if (!requestedOrderId) return;

    setOrderId(requestedOrderId);

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(requestedOrderId)) {
      setError("The order link is invalid.");
      return;
    }

    try {
      const saved = localStorage.getItem(
        `kandid_order_${requestedOrderId}`
      );

      if (!saved) {
        setError(
          "Recovery details were not found in this browser. Please use the browser where you placed the order."
        );
        return;
      }

      const credentials = JSON.parse(saved) as Partial<SavedRecovery>;

      if (!validRecovery(credentials, requestedOrderId)) {
        setError("The saved order recovery details are invalid.");
        return;
      }

      void checkOrder({
        orderId: credentials.orderId!,
        checkoutToken: credentials.checkoutToken!,
      });
    } catch {
      setError("Unable to read the saved order recovery details.");
    }
    // Load the requested order once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function recoverSavedOrder() {
    setError("");
    setOrder(undefined);

    const normalizedId = orderId.trim();

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        normalizedId
      )
    ) {
      setError("Enter a valid order ID.");
      return;
    }

    try {
      const saved = localStorage.getItem(
        `kandid_order_${normalizedId}`
      );

      if (!saved) {
        setError(
          "No saved recovery details were found for this order on this browser."
        );
        return;
      }

      const credentials = JSON.parse(saved) as Partial<SavedRecovery>;

      if (!validRecovery(credentials, normalizedId)) {
        setError("Saved recovery details are invalid.");
        return;
      }

      void checkOrder({
        orderId: credentials.orderId!,
        checkoutToken: credentials.checkoutToken!,
      });
    } catch {
      setError(
        "Unable to read the saved recovery details from this browser."
      );
    }
  }

  function refreshOrder() {
    if (!order) return;

    try {
      const saved = localStorage.getItem(`kandid_order_${order.id}`);

      if (!saved) {
        setError("Saved recovery details are no longer available in this browser.");
        return;
      }

      const credentials = JSON.parse(saved) as Partial<SavedRecovery>;

      if (!validRecovery(credentials, order.id)) {
        setError("Saved recovery details are invalid.");
        return;
      }

      void checkOrder({
        orderId: credentials.orderId!,
        checkoutToken: credentials.checkoutToken!,
      });
    } catch {
      setError("Unable to read the saved recovery details.");
    }
  }

  const shipped =
    Boolean(order?.shippedAt) ||
    ["shipped", "delivered"].includes(
      (order?.orderStatus ?? "").toLowerCase()
    );

  const delivered =
    (order?.orderStatus ?? "").toLowerCase() === "delivered";

  return (
    <main className="min-h-screen bg-[#F8F8F6] px-6 py-20 text-[#25251F] sm:py-28">
      <section className="mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.35em]">
          Kandid Luxury
        </p>

        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">
          Track your order
        </h1>

        <p className="mt-5 text-sm leading-7 text-neutral-600">
          Check your payment, order progress, and courier tracking
          details using the recovery information saved in this browser.
        </p>

        <form
          className="mt-10 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            recoverSavedOrder();
          }}
        >
          <label
            htmlFor="orderId"
            className="block text-xs uppercase tracking-[0.18em] text-neutral-600"
          >
            Order ID
          </label>

          <input
            id="orderId"
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Enter your order ID"
            autoComplete="off"
            className="w-full border border-neutral-300 bg-transparent px-4 py-4 text-sm outline-none focus:border-neutral-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#25251F] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            {loading ? "Checking order…" : "Check order status"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        {order && (
          <section className="mt-10 border border-neutral-300 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Order details
            </p>

            <p className="mt-4 break-all text-xs text-neutral-500">
              {order.id}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Total</span>
                <span className="font-medium">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Payment status</span>
                <span className="text-right">
                  {formatStatus(order.paymentStatus)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Order status</span>
                <span className="text-right font-medium">
                  {formatStatus(order.orderStatus)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">Order placed</span>
                <span className="text-right">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            <div className="mt-7 border-t border-neutral-300 pt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Delivery tracking
              </p>

              {!shipped ? (
                <div className="mt-4 bg-white p-4">
                  <p className="font-medium">
                    {order.orderStatus?.toLowerCase() === "processing"
                      ? "Your order is being prepared."
                      : "Your order has not shipped yet."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Courier details and the tracking link will appear here
                    once your order has been shipped.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4 bg-white p-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-neutral-500">Delivery status</span>
                    <span className="text-right font-medium">
                      {delivered ? "Delivered" : "Shipped"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-neutral-500">Courier</span>
                    <span className="text-right font-medium">
                      {order.courierName || "Not provided"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-neutral-500">Tracking / AWB</span>
                    <span className="break-all text-right font-medium">
                      {order.trackingNumber || "Not provided"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-neutral-500">Shipped on</span>
                    <span className="text-right">
                      {formatDate(order.shippedAt)}
                    </span>
                  </div>

                  {delivered && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-neutral-500">Delivered on</span>
                      <span className="text-right">
                        {formatDate(order.deliveredAt)}
                      </span>
                    </div>
                  )}

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-[#25251F] px-5 py-4 text-center text-xs uppercase tracking-[0.18em] text-white transition hover:bg-neutral-700"
                    >
                      Track with courier
                    </a>
                  )}

                  {!order.trackingUrl && (
                    <p className="text-sm leading-6 text-neutral-600">
                      Your shipment has been marked as shipped. Contact
                      customer support if you need help tracking it.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-neutral-300 pt-4">
              <p className="text-xs leading-6 text-neutral-500">
                Order status is retrieved from our server. If your payment
                was deducted but is still pending, please contact customer
                support before trying another payment.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={refreshOrder}
              className="mt-6 w-full border border-neutral-300 px-6 py-4 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh order status"}
            </button>
          </section>
        )}

        <Link
          href="/shop"
          className="mt-10 inline-block text-xs uppercase tracking-[0.2em] text-neutral-600 underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
