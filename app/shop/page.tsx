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
  }

  const money = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#28251F]">
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F8F7F3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <Link
              href="/"
              className="text-[12px] font-medium uppercase tracking-[0.35em]"
            >
              KANDID LUXURY
            </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] uppercase tracking-widest transition hover:bg-[#28251F] hover:text-white"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            Bag ({cartCount})
          </Link>
        </div>
      </header>

      {/* Shop Heading */}
      <section className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">


        
        <div>
          
          <p className="mt-1 text-[10px] text-[#827B70]">
            {products.length} Minimagic Skincare Essentials
          </p>
        </div>

        <span className="text-[9px] uppercase tracking-[0.2em] text-[#827B70]">
          KANDID COLLECTION
        </span>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-8">
        {loading ? (
          <p className="py-20 text-center text-sm">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-sm">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-sm">
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

              return (
                <article
                  key={product.id}
                  className="min-w-0 overflow-hidden border border-black/[0.07] bg-white"
                >
                  {/* Product Image */}
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
                          className="object-contain p-4 transition-transform duration-300 sm:p-5"
                        />
                      </div>

                      <span className="absolute left-2 top-2 bg-white/90 px-2 py-1 text-[8px] uppercase tracking-wider text-[#827B70]">
                        {product.stock_quantity > 0
                          ? "Available"
                          : "Sold out"}
                      </span>
                    </div>
                  </Link>

                  {/* Product Information */}
                  <div className="p-3 sm:p-4">
                    <Link href={productLink}>
                      <h2 className="line-clamp-2 min-h-[38px] font-medium text-xs leading-5 sm:text-sm">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {money(Number(product.price))}
                      </span>

                      {product.original_price != null &&
                        Number(product.original_price) >
                          Number(product.price) && (
                          <span className="text-[10px] text-[#928B80] line-through">
                            {money(Number(product.original_price))}
                          </span>
                        )}
                    </div>

                    {product.weight && (
                      <p className="mt-1 text-[10px] text-[#827B70]">
                        {product.weight}
                      </p>
                    )}

                    <p className="mt-1 text-[9px] text-[#827B70]">
                      {product.free_delivery
                        ? "Free delivery"
                        : "Delivery calculated at checkout"}
                    </p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider text-[#827B70]">
                        Qty
                      </span>

                      <div className="flex items-center border border-black/15">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(product, -1)}
                          className="p-1.5 disabled:opacity-30"
                        >
                          <Minus size={11} />
                        </button>

                        <span className="w-5 text-center text-[10px]">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={quantity >= product.stock_quantity}
                          onClick={() => updateQuantity(product, 1)}
                          className="p-1.5 disabled:opacity-30"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Add to Bag / Go to Bag */}
                    {added === product.id ? (
                      <Link
                        href="/cart"
                        className="mt-3 flex w-full items-center justify-center gap-1.5 bg-[#28251F] px-2 py-2.5 text-[9px] uppercase tracking-wider text-white"
                      >
                        <ShoppingBag size={13} />
                        Go to Bag
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={product.stock_quantity < 1}
                        onClick={() => addProduct(product)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 bg-[#28251F] px-2 py-2.5 text-[9px] uppercase tracking-wider text-white transition hover:bg-[#49443C] disabled:bg-[#AAA69E]"
                      >
                        <ShoppingBag size={13} />
                        {product.stock_quantity > 0
                          ? "Add to Bag"
                          : "Out of Stock"}
                      </button>
                    )}

                    {/* View Product */}
                    <Link
                      href={productLink}
                      className="mt-2 flex w-full items-center justify-center gap-1 border border-black/20 px-2 py-2 text-[9px] uppercase tracking-wider transition hover:bg-[#F0EEE8]"
                    >
                      View Product
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-[#F0EEE8] px-4 py-5 text-center">
        <p className="font-serif text-sm tracking-[0.18em]">
          KANDID LUXURY
        </p>

        <Link
          href="/cart"
          className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest"
        >
          View shopping bag <ArrowRight size={12} />
        </Link>
      </footer>
    </main>
  );
}