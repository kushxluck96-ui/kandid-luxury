
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const router = useRouter();

  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  if (items.length === 0) {
    return (
      <main className="flex min-h-[100dvh] flex-col bg-[#F8F8F6] text-black">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-5">
          <Link href="/" className="text-[10px] font-semibold tracking-[0.25em]">
            KANDID LUXURY
          </Link>
          <span className="text-[9px] tracking-[0.2em] text-neutral-400">
            CART
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-serif text-5xl text-neutral-300">00</p>
          <h1 className="mt-4 text-xl font-medium">Your cart is empty</h1>
          <p className="mt-2 max-w-xs text-xs leading-5 text-neutral-500">
            Discover our refined skincare rituals and add something to your collection.
          </p>
          <Link
            href="/shop"
            className="mt-6 bg-black px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#F8F8F6] text-black">
      {/* Compact header */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-[#F8F8F6]/95 px-4 backdrop-blur sm:px-8">
        <Link href="/" className="text-[10px] font-semibold tracking-[0.25em]">
          KANDID LUXURY
        </Link>

        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          My Bag ({totalItems})
        </span>
      </header>

      {/* Cart content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-4 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between py-3 sm:py-5">
          <h1 className="text-lg font-medium tracking-tight sm:text-2xl">
            Shopping Bag
          </h1>
          <Link
            href="/shop"
            className="text-[9px] uppercase tracking-[0.15em] text-neutral-500 underline underline-offset-4"
          >
            Add more
          </Link>
        </div>

        <div className="grid flex-1 items-start gap-4 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Products */}
          <section aria-label="Cart items" className="space-y-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex min-h-[112px] gap-3 border border-black/[0.07] bg-white/70 p-2.5 sm:gap-5 sm:p-4"
              >
                {/* Product image */}
                <div className="flex h-[88px] w-[82px] shrink-0 items-center justify-center bg-[#EEF1EF] sm:h-28 sm:w-28">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={140}
                      height={140}
                      className="h-auto max-h-full w-full max-w-[82px] object-contain sm:max-w-[110px]"
                    />
                  ) : (
                    <span className="text-[8px] uppercase tracking-widest text-neutral-400">
                      Kandid
                    </span>
                  )}
                </div>

                {/* Product details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">
                      KANDID LUXURY
                    </p>

                    <h2 className="mt-1 line-clamp-2 text-xs font-medium leading-4 sm:text-sm">
                      {item.name}
                    </h2>

                    {item.weight && (
                      <p className="mt-1 text-[10px] text-neutral-500">
                        {item.weight}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price)}
                    </span>

                    {item.original_price != null &&
                      item.original_price > item.price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                  </div>
                </div>

                {/* Quantity and remove */}
                <div className="flex shrink-0 flex-col items-end justify-between py-0.5">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-[8px] uppercase tracking-wider text-neutral-400"
                  >
                    Remove
                  </button>

                  <div className="flex h-7 items-center border border-black/10 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center text-sm disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="flex h-7 w-6 items-center justify-center border-x border-black/10 text-[10px]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-[9px] text-neutral-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </article>
            ))}
          </section>

          {/* Desktop order summary */}
          <aside className="hidden border border-black/10 bg-white/70 p-5 lg:block">
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              Order Summary
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal ({totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery</span>
                <span className="text-xs uppercase">Free</span>
              </div>

              <div className="flex justify-between border-t border-black/10 pt-4 font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full bg-black px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="mt-4 block text-center text-[9px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="sticky bottom-0 z-40 mt-auto border-t border-black/10 bg-[#F8F8F6]/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
              Total Amount · {totalItems} items
            </p>
            <p className="mt-0.5 text-lg font-semibold">
              {formatPrice(subtotal)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-neutral-500">Delivery</p>
            <p className="text-[10px] font-medium uppercase tracking-wider">
              Free
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="flex h-12 w-full items-center justify-center bg-black text-[10px] font-medium uppercase tracking-[0.25em] text-white active:bg-neutral-800"
        >
          Proceed to Checkout →
        </button>

        <Link
          href="/shop"
          className="mt-2 block text-center text-[8px] uppercase tracking-[0.2em] text-neutral-400"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
