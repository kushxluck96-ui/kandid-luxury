
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  price: number;
  quantity: number;
  weight: string | null;
  image_url: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string | null;
  shipping_pincode: string;
  shipping_country: string | null;
  subtotal: number;
  delivery_charge: number | null;
  total: number;
  payment_method: string | null;
  payment_status: string | null;
  order_status: string | null;
  payment_id: string | null;
  payment_order_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  courier_name?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  items: OrderItem[];
};

function money(value: number | null | undefined) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: string | null) {
  const value = (status ?? "").toLowerCase();

  if (["paid", "confirmed", "delivered", "captured"].includes(value)) {
    return "bg-green-100 text-black";
  }

  if (["pending", "processing", "shipped"].includes(value)) {
    return "bg-amber-100 text-black";
  }

  if (["failed", "cancelled", "canceled", "refunded", "expired"].includes(value)) {
    return "bg-red-100 text-black";
  }

  return "bg-neutral-200 text-black";
}

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-400 bg-white px-3 py-3 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? "You are not authorized to view orders. Please sign in with your admin account."
            : data.error || "Unable to load orders."
        );
      }

      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = async (
    orderId: string,
    orderStatus: "processing" | "shipped" | "delivered"
  ) => {
    setUpdatingOrderId(orderId);
    setStatusMessage("");
    setStatusError("");

    try {
      const payload: {
        orderId: string;
        orderStatus: string;
        courierName?: string;
        trackingNumber?: string;
        trackingUrl?: string;
      } = { orderId, orderStatus };

      if (orderStatus === "shipped") {
        const cleanCourier = courierName.trim();
        const cleanTrackingNumber = trackingNumber.trim();
        const cleanTrackingUrl = trackingUrl.trim();

        if (!cleanCourier || !cleanTrackingNumber || !cleanTrackingUrl) {
          throw new Error(
            "Enter the courier name, tracking number, and tracking URL before shipping."
          );
        }

        let parsedUrl: URL;

        try {
          parsedUrl = new URL(cleanTrackingUrl);
        } catch {
          throw new Error("Enter a valid tracking URL.");
        }

        if (!["https:", "http:"].includes(parsedUrl.protocol)) {
          throw new Error("Tracking URL must start with http:// or https://.");
        }

        payload.courierName = cleanCourier;
        payload.trackingNumber = cleanTrackingNumber;
        payload.trackingUrl = cleanTrackingUrl;
      }

      const response = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update order status.");
      }

      setStatusMessage(`Order status updated to ${orderStatus}.`);

      if (orderStatus === "shipped") {
        setCourierName("");
        setTrackingNumber("");
        setTrackingUrl("");
      }

      await loadOrders();
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      const searchable = [
        order.id,
        order.customer_name,
        order.customer_email ?? "",
        order.customer_phone,
        order.payment_status ?? "",
        order.order_status ?? "",
        order.courier_name ?? "",
        order.tracking_number ?? "",
        ...order.items.map((item) => item.product_name),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [orders, search]);

  const paidCount = orders.filter(
    (order) => (order.payment_status ?? "").toLowerCase() === "paid"
  ).length;

  const pendingCount = orders.filter((order) =>
    ["pending", "created", "awaiting_payment"].includes(
      (order.payment_status ?? "").toLowerCase()
    )
  ).length;

  const revenue = orders
    .filter((order) => (order.payment_status ?? "").toLowerCase() === "paid")
    .reduce((sum, order) => sum + Number(order.total ?? 0), 0);

  return (
    <main className="space-y-8 text-black">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-black">
            Kandid Luxury CMS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Orders
          </h1>
          <p className="mt-2 text-sm text-black">
            Review orders, payments, fulfillment, and courier tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders()}
          disabled={loading}
          className="rounded-xl border border-neutral-400 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh orders"}
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-300 bg-white p-5">
          <p className="text-sm font-medium text-black">Orders loaded</p>
          <p className="mt-2 text-3xl font-bold text-black">{orders.length}</p>
          <p className="mt-1 text-xs text-neutral-800">Latest 200 maximum</p>
        </div>

        <div className="rounded-2xl border border-neutral-300 bg-white p-5">
          <p className="text-sm font-medium text-black">Paid orders</p>
          <p className="mt-2 text-3xl font-bold text-black">{paidCount}</p>
        </div>

        <div className="rounded-2xl border border-neutral-300 bg-white p-5">
          <p className="text-sm font-medium text-black">Revenue from paid orders</p>
          <p className="mt-2 text-3xl font-bold text-black">{money(revenue)}</p>
          <p className="mt-1 text-xs text-neutral-800">Based on loaded orders</p>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-300 bg-white p-5 text-black sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">All orders</h2>
            <p className="mt-1 text-sm text-black">
              {filteredOrders.length} matching orders
              {pendingCount > 0 ? ` · ${pendingCount} awaiting payment` : ""}
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, phone, order ID, tracking..."
            className="w-full rounded-xl border border-neutral-400 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-neutral-700 outline-none focus:border-black focus:ring-1 focus:ring-black sm:max-w-sm"
          />
        </div>

        {loading && (
          <p className="py-12 text-center text-sm font-medium text-black">
            Loading orders...
          </p>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-900">{error}</p>
            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <p className="py-12 text-center text-sm font-medium text-black">
            {search ? "No orders match your search." : "No orders found yet."}
          </p>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => {
              const expanded = expandedId === order.id;
              const paid =
                (order.payment_status ?? "").toLowerCase() === "paid";

              const nextStatus: Record<string, "processing" | "shipped" | "delivered"> = {
                confirmed: "processing",
                processing: "shipped",
                shipped: "delivered",
              };

              const nextLabel: Record<string, string> = {
                confirmed: "Start processing",
                processing: "Mark as shipped",
                shipped: "Mark as delivered",
              };

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-neutral-300 bg-white text-black"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    aria-expanded={expanded}
                    className="grid w-full gap-4 p-4 text-left text-black transition hover:bg-neutral-50 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:p-5"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-black">{order.customer_name}</p>
                      <p className="mt-1 break-all text-xs font-medium text-black">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-xs font-medium text-black">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.payment_status)}`}>
                        Payment: {order.payment_status ?? "Unknown"}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.order_status)}`}>
                        Order: {order.order_status ?? "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-lg font-bold text-black">{money(order.total)}</span>
                      <span className="font-bold text-black">{expanded ? "−" : "+"}</span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-neutral-300 bg-white p-4 text-black sm:p-5">
                      <section className="mb-7 rounded-2xl border border-neutral-300 bg-neutral-50 p-4 sm:p-5">
                        <h3 className="font-bold text-black">Order fulfillment</h3>
                        <p className="mt-2 text-sm text-black">
                          Current status: <span className="font-semibold">{order.order_status ?? "Unknown"}</span>
                        </p>

                        {statusMessage && (
                          <p className="mt-3 text-sm font-semibold text-green-800" role="status">
                            {statusMessage}
                          </p>
                        )}

                        {statusError && (
                          <p className="mt-3 text-sm font-semibold text-red-800" role="alert">
                            {statusError}
                          </p>
                        )}

                        {!paid ? (
                          <p className="mt-3 text-sm font-medium text-red-800">
                            Fulfillment is disabled because this order is not marked as paid.
                          </p>
                        ) : order.order_status === "processing" ? (
                          <div className="mt-4 space-y-4">
                            <p className="text-sm text-black">
                              Enter the courier details before marking this order as shipped.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="block text-sm font-semibold text-black">
                                Courier name
                                <input
                                  value={courierName}
                                  onChange={(event) => setCourierName(event.target.value)}
                                  placeholder="e.g. Delhivery, Blue Dart"
                                  maxLength={100}
                                  className={inputClass}
                                />
                              </label>

                              <label className="block text-sm font-semibold text-black">
                                Tracking / AWB number
                                <input
                                  value={trackingNumber}
                                  onChange={(event) => setTrackingNumber(event.target.value)}
                                  placeholder="Enter tracking number"
                                  maxLength={100}
                                  className={inputClass}
                                />
                              </label>

                              <label className="block text-sm font-semibold text-black sm:col-span-2">
                                Tracking URL
                                <input
                                  type="url"
                                  value={trackingUrl}
                                  onChange={(event) => setTrackingUrl(event.target.value)}
                                  placeholder="https://courier.example/track"
                                  maxLength={2048}
                                  className={inputClass}
                                />
                              </label>
                            </div>

                            <button
                              type="button"
                              disabled={updatingOrderId === order.id}
                              onClick={() => void updateOrderStatus(order.id, "shipped")}
                              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingOrderId === order.id ? "Updating..." : "Save tracking & mark shipped"}
                            </button>
                          </div>
                        ) : order.order_status === "confirmed" || order.order_status === "shipped" ? (
                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            onClick={() => {
                              const status = nextStatus[order.order_status ?? ""];
                              if (status) void updateOrderStatus(order.id, status);
                            }}
                            className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingOrderId === order.id
                              ? "Updating..."
                              : nextLabel[order.order_status ?? ""]}
                          </button>
                        ) : order.order_status === "delivered" ? (
                          <p className="mt-3 text-sm font-semibold text-green-800">
                            This order has been delivered.
                          </p>
                        ) : null}

                        {(order.courier_name || order.tracking_number || order.tracking_url) && (
                          <div className="mt-5 space-y-2 border-t border-neutral-300 pt-4 text-sm text-black">
                            <h4 className="font-bold">Saved tracking details</h4>
                            <p>Courier: {order.courier_name ?? "—"}</p>
                            <p>Tracking number: {order.tracking_number ?? "—"}</p>
                            {order.tracking_url && (
                              <p>
                                Tracking link:{" "}
                                <a
                                  href={order.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="break-all underline underline-offset-2"
                                >
                                  Open courier tracking
                                </a>
                              </p>
                            )}
                            <p>Shipped: {formatDate(order.shipped_at ?? null)}</p>
                            <p>Delivered: {formatDate(order.delivered_at ?? null)}</p>
                          </div>
                        )}
                      </section>

                      <div className="grid gap-6 lg:grid-cols-2">
                        <section>
                          <h3 className="font-bold text-black">Customer</h3>
                          <div className="mt-3 space-y-2 text-sm font-medium text-black">
                            <p>{order.customer_name}</p>
                            {order.customer_email && (
                              <p className="break-all">
                                <a href={`mailto:${order.customer_email}`} className="text-black underline underline-offset-2">
                                  {order.customer_email}
                                </a>
                              </p>
                            )}
                            <p>
                              <a href={`tel:${order.customer_phone}`} className="text-black underline underline-offset-2">
                                {order.customer_phone}
                              </a>
                            </p>
                          </div>

                          <h3 className="mt-6 font-bold text-black">Shipping address</h3>
                          <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-black">
                            {[
                              order.shipping_address,
                              order.shipping_city,
                              order.shipping_state,
                              order.shipping_pincode,
                              order.shipping_country,
                            ].filter(Boolean).join(", ")}
                          </p>
                        </section>

                        <section>
                          <h3 className="font-bold text-black">Payment details</h3>
                          <div className="mt-3 space-y-2 text-sm font-medium text-black">
                            <p>Method: {order.payment_method ?? "—"}</p>
                            <p>Payment status: {order.payment_status ?? "—"}</p>
                            <p>Payment ID: {order.payment_id ?? "—"}</p>
                            <p className="break-all">Razorpay order ID: {order.payment_order_id ?? "—"}</p>
                          </div>

                          <div className="mt-5 space-y-2 border-t border-neutral-300 pt-4 text-sm text-black">
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">Subtotal</span>
                              <span className="font-semibold">{money(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">Delivery</span>
                              <span className="font-semibold">{money(order.delivery_charge)}</span>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-neutral-300 pt-3 font-bold">
                              <span>Total</span>
                              <span>{money(order.total)}</span>
                            </div>
                          </div>
                        </section>
                      </div>

                      <section className="mt-7">
                        <h3 className="font-bold text-black">Products ordered</h3>

                        {order.items.length === 0 ? (
                          <p className="mt-3 text-sm font-medium text-black">
                            No item details are available for this order.
                          </p>
                        ) : (
                          <div className="mt-3 divide-y divide-neutral-300">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 py-4 text-black">
                                {item.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    className="h-16 w-16 rounded-xl border border-neutral-300 bg-white object-cover"
                                  />
                                ) : (
                                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-100 text-xs font-medium text-black">
                                    No image
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-black">{item.product_name}</p>
                                  <p className="mt-1 text-xs font-medium text-black">
                                    {item.weight ? `${item.weight} · ` : ""}
                                    Qty: {item.quantity}
                                  </p>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="font-bold text-black">{money(item.price * item.quantity)}</p>
                                  <p className="mt-1 text-xs font-medium text-black">{money(item.price)} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
