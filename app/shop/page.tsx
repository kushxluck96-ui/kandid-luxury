
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartProvider";

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
    window.setTimeout(() => setAdded(""), 1600);
  }

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#28251F]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-10">
          <Link href="/" className="font-serif text-xl tracking-[0.2em]">
            KANDID <span className="text-xs tracking-[0.25em]">LUXURY</span>
          </Link>
          <Link href="/cart" className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <ShoppingBag size={18} strokeWidth={1.4} />
            Bag ({cartCount})
          </Link>
        </div>
      </header>

      <section className="px-5 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
        <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[#8B8275]">
          The KANDID collection
        </p>
        <h1 className="font-serif text-5xl leading-tight tracking-tight sm:text-7xl">
          Your ritual. Your radiance.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#777168]">
          Discover considered skincare essentials designed to make
          your daily ritual feel a little more personal.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-10 sm:pb-28">
        {loading ? (
          <p className="py-20 text-center text-sm">Discovering the collection…</p>
        ) : error ? (
          <p className="py-20 text-center text-sm">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-sm">
            No active products found. Check your Supabase product records.
          </p>
        ) : (
          <div className="grid gap-14 sm:grid-cols-2 sm:gap-8 lg:gap-12">
            {products.map((product, index) => {
              const quantity = quantities[product.id] ?? 1;
              const image =
                product.image_url ||
                (product.slug === "pure-pearl-powder"
                  ? "/images/pearl.png"
                  : "/images/revive.png");

              return (
                <article key={product.id}>
                  <div className={`relative overflow-hidden ${index === 0 ? "bg-[#E9EFF0]" : "bg-[#EEE5D8]"}`}>
                    <div className="relative aspect-[4/4.2]">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain p-7 transition-transform duration-700 hover:scale-[1.04]"
                      />
                      <span className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.2em]">
                        No. 0{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B8275]">
                      {index === 0 ? "The rejuvenation ritual" : "The radiance ritual"}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                      {product.name}
                    </h2>

                    <div className="mt-3 flex items-center gap-3">
                      <span>{money(Number(product.price))}</span>
                      {product.original_price != null &&
                        Number(product.original_price) > Number(product.price) && (
                          <span className="text-sm text-[#928B80] line-through">
                            {money(Number(product.original_price))}
                          </span>
                        )}
                      {product.weight && (
                        <span className="text-xs text-[#827B70]">{product.weight}</span>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#777168]">
                      {product.description || "A considered addition to your skincare ritual."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-y border-black/10 py-4">
                      <span className="text-[10px] uppercase tracking-widest">
                        Quantity
                      </span>
                      <div className="flex items-center border border-black/15">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(product, -1)}
                          className="p-3 disabled:opacity-30"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={quantity >= product.stock_quantity}
                          onClick={() => updateQuantity(product, 1)}
                          className="p-3 disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={product.stock_quantity < 1}
                      onClick={() => addProduct(product)}
                      className="mt-5 flex w-full items-center justify-center gap-3 bg-[#28251F] px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-[#49443C] disabled:bg-[#AAA69E]"
                    >
                      {added === product.id
                        ? "Added to bag ✓"
                        : product.stock_quantity > 0
                          ? "Add to bag"
                          : "Out of stock"}
                      <ArrowRight size={15} />
                    </button>

                    <p className="mt-3 text-center text-[10px] text-[#827B70]">
                      {product.stock_quantity > 0
                        ? "Limited availability"
                        : "Currently unavailable"}
                      {product.free_delivery ? " · Complimentary delivery" : ""}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-black/10 bg-[#F0EEE8] px-5 py-12 text-center">
        <p className="font-serif text-lg tracking-[0.2em]">KANDID LUXURY</p>
        <Link href="/cart" className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest">
          View shopping bag <ArrowRight size={14} />
        </Link>
      </footer>
    </main>
  );
}
