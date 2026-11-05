
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartProvider";
import DiwaliDecorations from "@/components/DiwaliDecorations";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  weight: string | null;
  image_url: string | null;
  stock_quantity: number;
  free_delivery: boolean;
};

const slugs = [
  "revive-anti-aging-botox-face-pack",
  "pure-pearl-powder",
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, slug, name, description, price, original_price, weight, image_url, stock_quantity, free_delivery"
        )
        .eq("is_active", true)
        .in("slug", slugs);

      if (error) {
        console.error(error);
        setError("Unable to load products. Please try again.");
      } else {
        const sorted = [...(data ?? [])].sort(
          (a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug)
        );

        setProducts(sorted as Product[]);
        setQuantities(
          Object.fromEntries(sorted.map((p) => [p.id, 1]))
        );
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  function updateQuantity(product: Product, change: number) {
    setQuantities((current) => ({
      ...current,
      [product.id]: Math.max(
        1,
        Math.min(
          Number(product.stock_quantity),
          (current[product.id] ?? 1) + change
        )
      ),
    }));
  }

  function addProduct(product: Product) {
    const quantity = quantities[product.id] ?? 1;

    if (product.stock_quantity < 1) return;

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      original_price:
        product.original_price == null
          ? null
          : Number(product.original_price),
      weight: product.weight,
      image_url: product.image_url,
      quantity,
    });

    setAdded(product.id);
  }

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  // Fallback original prices for the two Diwali sale products.
  function getOriginalPrice(product: Product) {
    if (product.original_price != null) {
      return Number(product.original_price);
    }

    if (product.slug === "revive-anti-aging-botox-face-pack") {
      return 3500;
    }

    if (product.slug === "pure-pearl-powder") {
      return 2600;
    }

    return Number(product.price);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F7F6F2] text-[#28251F]">
      {/* Diwali lights and fireworks */}
      <DiwaliDecorations />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F8F7F3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/"
            className="text-[13px] font-medium uppercase tracking-[0.22em] sm:text-[12px] sm:tracking-[0.35em]"
          >
            KANDID LUXURY
          </Link>

          <Link
            href="/cart"
            className="flex min-h-11 items-center gap-2 border border-black/15 px-4 py-2.5 text-[12px] font-medium uppercase tracking-wider transition hover:bg-[#28251F] hover:text-white sm:text-[10px]"
          >
            <ShoppingBag size={17} strokeWidth={1.5} />
            Bag ({cartCount})
          </Link>
        </div>
      </header>

      {/* SHOP HEADING */}
      <section className="mx-auto flex max-w-7xl items-center justify-between px-4 py-7 sm:px-8 sm:py-5">
        <div>
          <h1 className="font-serif text-3xl font-light sm:text-4xl">
            The Collection
          </h1>

          <p className="mt-2 text-[13px] text-[#827B70] sm:text-[10px]">
            {products.length} MiniMagic Skincare Essentials
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-[0.13em] text-[#827B70] sm:text-[9px] sm:tracking-[0.2em]">
          KANDID COLLECTION
        </span>
      </section>

      {/* DIWALI SALE BANNER */}
      <section className="mx-auto max-w-7xl px-3 pb-7 sm:px-8">
        <div className="relative overflow-hidden border border-[#D9C49B] bg-gradient-to-r from-[#34251D] via-[#573B28] to-[#34251D] px-5 py-7 text-center text-[#F9E9C4] sm:py-9">
          <div className="absolute left-5 top-4 text-[#E8C77D]/60">
            <Sparkles size={19} />
          </div>

          <div className="absolute bottom-4 right-5 text-[#E8C77D]/60">
            <Sparkles size={19} />
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#E8C77D] sm:text-xs">
            A Season of Light & Beauty
          </p>

          <h2 className="mt-2 font-serif text-3xl font-light tracking-wide sm:text-4xl">
            Diwali Celebration Sale
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-[#F2E4CB]/85 sm:text-sm">
            Celebrate the festive season with special prices on your
            MiniMagic skincare favourites.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 border border-[#E8C77D]/60 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F9E9C4] sm:text-xs">
            <Sparkles size={14} />
            Limited Festive Offers
            <Sparkles size={14} />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-3 pb-12 sm:px-8">
        {loading ? (
          <p className="py-20 text-center text-base">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-base">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-base">
            No active products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => {
              const quantity = quantities[product.id] ?? 1;

              const image =
                product.image_url ||
                (product.slug === "pure-pearl-powder"
                  ? "/images/pearl.png"
                  : "/images/revive.png");

              const productLink =
                product.slug === "revive-anti-aging-botox-face-pack"
                  ? "/revive"
                  : "/pearl";

              const originalPrice = getOriginalPrice(product);
              const currentPrice = Number(product.price);
              const hasSale = originalPrice > currentPrice;

              const savings = hasSale
                ? originalPrice - currentPrice
                : 0;

              const discount = hasSale
                ? Math.round((savings / originalPrice) * 100)
                : 0;

              return (
                <article
                  key={product.id}
                  className="min-w-0 overflow-hidden border border-black/[0.07] bg-white"
                >
                  {/* PRODUCT IMAGE */}
                  <Link href={productLink} className="block">
                    <div
                      className={`relative ${
                        index === 0 ? "bg-[#E9EFF0]" : "bg-[#EEE5D8]"
                      }`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-3 transition-transform duration-300 sm:p-5"
                        />
                      </div>

                      {/* AVAILABILITY */}
                      <span className="absolute left-2 top-2 bg-white/90 px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[#827B70] sm:text-[8px]">
                        {product.stock_quantity > 0
                          ? "Available"
                          : "Sold out"}
                      </span>

                      {/* DIWALI SALE BADGE */}
                      {hasSale && (
                        <div className="absolute right-2 top-2 bg-[#8D3026] px-2.5 py-2 text-center text-white shadow-md">
                          <p className="text-[9px] font-semibold uppercase tracking-wider sm:text-[10px]">
                            Diwali Sale
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold sm:text-xs">
                            {discount}% OFF
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* PRODUCT INFORMATION */}
                  <div className="p-3 sm:p-4">
                    <Link href={productLink}>
                      <h2 className="min-h-[48px] line-clamp-2 text-[14px] font-medium leading-5 sm:min-h-[38px] sm:text-sm">
                        {product.name}
                      </h2>
                    </Link>

                    {/* PRICE */}
                    <div className="mt-2 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                      <span className="text-[16px] font-semibold text-[#8D3026] sm:text-sm">
                        {money(currentPrice)}
                      </span>

                      {hasSale && (
                        <span className="text-[11px] text-[#928B80] line-through sm:text-[10px]">
                          {money(originalPrice)}
                        </span>
                      )}
                    </div>

                    {hasSale && (
                      <p className="mt-1 text-[11px] font-medium text-[#8D3026] sm:text-[10px]">
                        You save {money(savings)}
                      </p>
                    )}

                    {product.weight && (
                      <p className="mt-2 text-[12px] text-[#827B70] sm:text-[10px]">
                        {product.weight}
                      </p>
                    )}

                    <p className="mt-1 text-[11px] leading-5 text-[#827B70] sm:text-[9px]">
                      {product.free_delivery
                        ? "Free delivery"
                        : "Delivery calculated at checkout"}
                    </p>

                    {/* QUANTITY */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-[#827B70] sm:text-[9px]">
                        Quantity
                      </span>

                      <div className="flex h-9 items-center border border-black/15">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(product, -1)}
                          className="flex h-9 w-9 items-center justify-center disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-6 text-center text-[13px]">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={quantity >= product.stock_quantity}
                          onClick={() => updateQuantity(product, 1)}
                          className="flex h-9 w-9 items-center justify-center disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* ADD TO BAG */}
                    {added === product.id ? (
                      <Link
                        href="/cart"
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 bg-[#28251F] px-2 py-3 text-[11px] font-medium uppercase tracking-wider text-white sm:text-[9px]"
                      >
                        <ShoppingBag size={15} />
                        Go to Bag
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={product.stock_quantity < 1}
                        onClick={() => addProduct(product)}
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 bg-[#28251F] px-2 py-3 text-[11px] font-medium uppercase tracking-wider text-white transition hover:bg-[#49443C] disabled:bg-[#AAA69E] sm:text-[9px]"
                      >
                        <ShoppingBag size={15} />
                        {product.stock_quantity > 0
                          ? "Add to Bag"
                          : "Out of Stock"}
                      </button>
                    )}

                    {/* VIEW PRODUCT */}
                    <Link
                      href={productLink}
                      className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 border border-black/20 px-2 py-2.5 text-[11px] font-medium uppercase tracking-wider transition hover:bg-[#F0EEE8] sm:text-[9px]"
                    >
                      View Product
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-[#F0EEE8] px-4 py-7 text-center">
        <p className="font-serif text-base tracking-[0.18em]">
          KANDID LUXURY
        </p>

        <Link
          href="/cart"
          className="mt-3 inline-flex items-center gap-2 text-[12px] uppercase tracking-wider"
        >
          View shopping bag <ArrowRight size={14} />
        </Link>
      </footer>
    </main>
  );
}
