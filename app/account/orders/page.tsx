
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  product_name: string;
  product_slug: string;
  price: number;
  quantity: number;
  weight: string | null;
  image_url: string | null;
};

type Order = {
  id: string;
  created_at: string;
  subtotal: number;
  delivery_charge: number;
  total: number;
  payment_method: string | null;
  payment_status: string;
  order_status: string;
  courier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  items: OrderItem[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function prettyStatus(value: string | null) {
  if (!value) return "Pending";
  return value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/account/login");
          return;
        }

        const response = await fetch("/api/account/orders", {
          cache: "no-store",
        });

        const result = await response.json();

        if (response.status === 401) {
          router.replace("/account/login");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load your orders.");
        }

        if (active) {
          setOrders(result.orders ?? []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your orders."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F8F8F6] px-5 py-10 text-[#292821] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="text-sm text-[#77766E] transition hover:text-black"
        >
          ← My account
        </Link>

        <header className="mb-9 mt-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8A897F]">
            KANDID LUXURY
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            My Orders
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#77766E]">
            Your purchases, payment updates and delivery details.
          </p>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-[#E7E5DF] bg-white p-8 text-sm text-[#77766E]">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#E7D6D2] bg-white p-6">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E7E5DF] bg-white px-6 py-12 text-center">
            <h2 className="font-serif text-2xl">No orders yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77766E]">
              Orders placed while signed in will appear here. Previous guest
              orders may not be linked to this account.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#292821] px-7 py-3 text-sm text-white transition hover:bg-black"
            >
              Explore skincare
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-[#E7E5DF] bg-white"
              >
                <div className="flex flex-col gap-4 border-b border-[#EEECE6] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-xs text-[#8A897F]">
                      ORDER PLACED
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="mt-2 break-all text-xs text-[#77766E]">
                      Order ID: {order.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[#F3F1EB] px-3 py-2">
                      {prettyStatus(order.order_status)}
                    </span>
                    <span className="rounded-full bg-[#F3F1EB] px-3 py-2">
                      Payment: {prettyStatus(order.payment_status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-20 w-20 rounded-xl border border-[#EEECE6] bg-[#F8F8F6] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EB] font-serif text-xl">
                          K
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        {item.weight && (
                          <p className="mt-1 text-sm text-[#77766E]">
                            {item.weight}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-[#77766E]">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-2 text-sm">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-[#EEECE6] pt-4">
                    <div className="flex justify-between gap-4 text-sm text-[#77766E]">
                      <span>Subtotal</span>
                      <span>{formatPrice(Number(order.subtotal))}</span>
                    </div>
                    <div className="mt-2 flex justify-between gap-4 text-sm text-[#77766E]">
                      <span>Delivery</span>
                      <span>
                        {Number(order.delivery_charge) === 0
                          ? "Free"
                          : formatPrice(Number(order.delivery_charge))}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between gap-4 font-medium">
                      <span>Total</span>
                      <span>{formatPrice(Number(order.total))}</span>
                    </div>
                  </div>

                  {(order.courier_name ||
                    order.tracking_number ||
                    order.tracking_url ||
                    order.shipped_at ||
                    order.delivered_at) && (
                    <div className="rounded-xl bg-[#F8F8F6] p-4">
                      <h3 className="text-sm font-medium">
                        Delivery details
                      </h3>

                      {order.courier_name && (
                        <p className="mt-2 text-sm text-[#77766E]">
                          Courier: {order.courier_name}
                        </p>
                      )}

                      {order.tracking_number && (
                        <p className="mt-1 break-all text-sm text-[#77766E]">
                          Tracking number: {order.tracking_number}
                        </p>
                      )}

                      {order.shipped_at && (
                        <p className="mt-1 text-sm text-[#77766E]">
                          Shipped: {formatDate(order.shipped_at)}
                        </p>
                      )}

                      {order.delivered_at && (
                        <p className="mt-1 text-sm text-[#77766E]">
                          Delivered: {formatDate(order.delivered_at)}
                        </p>
                      )}

                      {order.tracking_url &&
                        (() => {
                          try {
                            const trackingUrl = new URL(order.tracking_url);

                            if (
                              trackingUrl.protocol !== "https:" &&
                              trackingUrl.protocol !== "http:"
                            ) {
                              return null;
                            }

                            return (
                              <a
                                href={trackingUrl.toString()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block text-sm underline underline-offset-4"
                              >
                                Track shipment ↗
                              </a>
                            );
                          } catch {
                            return null;
                          }
                        })()}
                    </div>
                  )}

                  <div className="break-all text-xs text-[#8A897F]">
                    Payment method: {prettyStatus(order.payment_method)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/shop"
            className="text-sm underline underline-offset-4"
          >
            Continue shopping →
          </Link>
        </div>
      </div>
    </main>
  );
}
