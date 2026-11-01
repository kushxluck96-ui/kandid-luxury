
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
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 px-5 sm:px-8">
          <Link
            href="/"
            className="text-xs font-semibold tracking-[0.2em]"
          >
            KANDID LUXURY
          </Link>

          <span className="text-xs tracking-[0.15em] text-neutral-400">
            CART
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-serif text-6xl text-neutral-300">00</p>

          <h1 className="mt-5 text-2xl font-medium">
            Your cart is empty
          </h1>

          <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">
            Discover our refined skincare rituals and add something to your collection.
          </p>

          <Link
            href="/shop"
            className="mt-8 bg-black px-8 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#F8F8F6] text-black">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-[#F8F8F6]/95 px-4 backdrop-blur sm:px-8">
        <Link
          href="/"
          className="text-xs font-semibold tracking-[0.2em]"
        >
          KANDID LUXURY
        </Link>

        <span className="text-xs uppercase tracking-[0.15em] text-neutral-500">
          My Bag ({totalItems})
        </span>
      </header>

      {/* Cart content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 sm:px-8 sm:py-7">
        <div className="flex items-center justify-between py-5 sm:py-6">
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Shopping Bag
          </h1>

          <Link
            href="/shop"
            className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-500 underline underline-offset-4"
          >
            Add more
          </Link>
        </div>

        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Products */}
          <section aria-label="Cart items" className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex min-h-[130px] gap-3 border border-black/[0.07] bg-white/70 p-3 sm:gap-5 sm:p-4"
              >
                {/* Product image */}
                <div className="flex h-[104px] w-[96px] shrink-0 items-center justify-center bg-[#EEF1EF] sm:h-28 sm:w-28">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={140}
                      height={140}
                      className="h-auto max-h-full w-full max-w-[96px] object-contain sm:max-w-[110px]"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-neutral-400">
                      Kandid
                    </span>
                  )}
                </div>

                {/* Product details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                      KANDID LUXURY
                    </p>

                    <h2 className="mt-1.5 line-clamp-2 text-sm font-medium leading-5 sm:text-base">
                      {item.name}
                    </h2>

                    {item.weight && (
                      <p className="mt-1.5 text-xs text-neutral-500">
                        {item.weight}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold">
                      {formatPrice(item.price)}
                    </span>

                    {item.original_price != null &&
                      item.original_price > item.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                  </div>
                </div>

                {/* Quantity and remove */}
                <div className="flex shrink-0 flex-col items-end justify-between py-1">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="min-h-8 text-[11px] font-medium uppercase tracking-wider text-neutral-500 underline underline-offset-4"
                  >
                    Remove
                  </button>

                  <div className="flex h-9 items-center border border-black/10 bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center text-lg disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="flex h-9 w-8 items-center justify-center border-x border-black/10 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center text-lg"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-medium text-neutral-500">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </article>
            ))}
          </section>

          {/* Desktop order summary */}
          <aside className="hidden border border-black/10 bg-white/70 p-6 lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Order Summary
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-neutral-500">
                  Subtotal ({totalItems} items)
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery</span>
                <span className="text-xs uppercase">Free</span>
              </div>

              <div className="flex justify-between border-t border-black/10 pt-5 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-7 min-h-[56px] w-full bg-black px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/shop"
              className="mt-5 block text-center text-xs uppercase tracking-[0.15em] text-neutral-400 hover:text-black"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="sticky bottom-0 z-40 mt-auto border-t border-black/10 bg-[#F8F8F6]/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-4 backdrop-blur-lg lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
              Total Amount · {totalItems} items
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {formatPrice(subtotal)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-neutral-500">Delivery</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider">
              Free
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="flex h-14 w-full items-center justify-center bg-black text-sm font-medium uppercase tracking-[0.12em] text-white active:bg-neutral-800"
        >
          Proceed to Checkout →
        </button>

        <Link
          href="/shop"
          className="mt-3 block text-center text-xs uppercase tracking-[0.15em] text-neutral-500"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
