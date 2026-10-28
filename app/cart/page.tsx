
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F8F6] text-black">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 sm:px-10">
          <header className="flex items-center justify-between border-b border-black/10 pb-6">
            <Link
              href="/"
              className="text-[10px] font-medium uppercase tracking-[0.35em]"
            >
              KANDID LUXURY
            </Link>

            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              CART
            </span>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-serif text-6xl font-light text-neutral-300">
              00
            </p>

            <h1 className="mt-6 text-2xl font-medium tracking-tight">
              Your cart is empty
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
              Discover our refined skincare rituals and add something to your
              collection.
            </p>

            <Link
              href="/shop"
              className="mt-8 bg-black px-8 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-black">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8 md:px-10 md:py-10">
        <header className="flex items-center justify-between border-b border-black/10 pb-6">
          <Link
            href="/"
            className="text-[10px] font-medium uppercase tracking-[0.35em]"
          >
            KANDID LUXURY
          </Link>

          <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
            YOUR CART ({items.reduce((total, item) => total + item.quantity, 0)})
          </span>
        </header>

        <div className="mt-10">
          <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">
            YOUR SELECTION
          </p>

          <h1 className="mt-3 font-serif text-5xl font-light tracking-tight sm:text-6xl">
            Cart
          </h1>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <section aria-label="Cart items" className="space-y-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 border-b border-black/10 pb-6 sm:gap-7"
              >
                <div className="flex h-32 w-28 shrink-0 items-center justify-center bg-[#EEF5F7] sm:h-40 sm:w-36">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={180}
                      height={180}
                      className="h-auto w-full max-w-[130px] object-contain"
                    />
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400">
                      Kandid
                    </span>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                      KANDID LUXURY
                    </p>

                    <h2 className="mt-2 text-base font-medium sm:text-lg">
                      {item.name}
                    </h2>

                    {item.weight && (
                      <p className="mt-1 text-xs text-neutral-500">
                        {item.weight}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-base font-medium">
                        {formatPrice(item.price)}
                      </span>

                      {item.original_price != null &&
                        item.original_price > item.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(item.original_price)}
                          </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-neutral-500">
                      Item total: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-[8px] uppercase tracking-[0.25em] text-neutral-400 transition hover:text-black"
                  >
                    Remove
                  </button>

                  <div className="flex items-center border border-black/10">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-9 w-8 items-center justify-center text-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>

                    <span
                      aria-label={`Quantity: ${item.quantity}`}
                      className="flex h-9 w-8 items-center justify-center border-x border-black/10 text-xs"
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-9 w-8 items-center justify-center text-sm transition hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-black/10 bg-white/60 p-6 sm:p-7">
            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              ORDER SUMMARY
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-500">Delivery</span>
                <span className="text-xs uppercase tracking-wider">Free</span>
              </div>

              <div className="border-t border-black/10 pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-7 w-full bg-black px-6 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="mt-5 block text-center text-[9px] uppercase tracking-[0.25em] text-neutral-400 transition hover:text-black"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
