"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

export default function RevivePage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", "revive-anti-aging-botox-face-pack")
        .eq("is_active", true)
        .single();

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    }

    loadProduct();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F8F9]">
        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          Loading Revive
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F8F9] px-6">
        <p className="text-sm text-red-500">
          Unable to load product.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F5F8F9] text-black">
      <section className="relative min-h-screen overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#F4F9FA] to-[#EAF4F7]" />

        {/* Soft background glow */}
        <div className="absolute -right-40 top-[18%] h-[420px] w-[420px] rounded-full bg-[#DDF2F8] opacity-70 blur-[100px] md:h-[650px] md:w-[650px]" />

        <div className="absolute -left-40 bottom-[-10%] h-[350px] w-[350px] rounded-full bg-white blur-[100px] md:h-[500px] md:w-[500px]" />

        {/* Desktop architectural lines */}
        <div className="absolute left-[6%] top-0 hidden h-full w-px bg-black/[0.05] md:block" />
        <div className="absolute right-[6%] top-0 hidden h-full w-px bg-black/[0.05] md:block" />

        {/* Main container */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-7 md:px-10 md:py-8">

          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.38em] text-neutral-500 sm:text-[10px] sm:tracking-[0.45em]">
              KANDID LUXURY
            </p>

            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 sm:text-[10px] sm:tracking-[0.3em]">
              REVIVE / 01
            </p>
          </motion.header>

          <div className="grid flex-1 items-center md:grid-cols-2">

            {/* LEFT CONTENT */}
            <div className="relative z-20 pt-12 md:pt-0">

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[9px] uppercase tracking-[0.35em] text-neutral-500 sm:text-[10px] sm:tracking-[0.4em]"
              >
                Anti-Aging Face Treatment
              </motion.p>

              {/* TITLE */}
              <motion.h1
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="
                  mt-4
                  font-serif
                  text-[20vw]
                  font-light
                  leading-[0.72]
                  tracking-[-0.07em]
                  text-neutral-950
                  sm:text-[17vw]
                  md:mt-0
                  md:text-[clamp(6rem,11vw,10rem)]
                "
              >
                REVIVE
              </motion.h1>

              {/* MOBILE PRODUCT */}
              <div className="relative mt-[-1vw] flex items-center justify-center md:hidden">

                <div className="absolute h-[280px] w-[280px] rounded-full bg-white/80 blur-[65px] sm:h-[340px] sm:w-[340px]" />

                <p className="absolute right-[-5px] top-1/2 -translate-y-1/2 select-none font-serif text-[11rem] font-light leading-none text-black/[0.025]">
                  01
                </p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative z-10"
                >
                  <Image
                    src={product.image_url || "/images/revive.png"}
                    alt={product.name}
                    width={500}
                    height={500}
                    priority
                    draggable={false}
                    className="h-auto w-[270px] select-none sm:w-[320px]"
                  />
                </motion.div>

                <div className="absolute bottom-4 left-1/2 h-6 w-44 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />
              </div>

              {/* Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-3 h-px max-w-[420px] bg-black/10 sm:mt-5 md:mt-10"
              />

              {/* DESCRIPTION */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="mt-5 max-w-md sm:mt-6 md:mt-7"
              >
                <h2 className="text-lg font-medium tracking-tight sm:text-xl md:text-2xl">
                  {product.name}
                </h2>

                <p className="mt-3 text-[13px] leading-6 text-neutral-500 sm:text-sm sm:leading-7 md:mt-4 md:text-[15px]">
                  {product.description ||
                    "A refined at-home face pack ritual designed to leave your skin feeling refreshed, smooth and beautifully renewed."}
                </p>
              </motion.div>

              {/* DETAILS */}
              <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.85 }}
  className="mt-7"
>
  <div className="flex items-baseline gap-3">
    <span className="text-2xl font-medium tracking-tight">
      ₹{product.price.toLocaleString("en-IN")}
    </span>

    {product.original_price && (
      <span className="text-sm text-neutral-400 line-through">
        ₹{product.original_price.toLocaleString("en-IN")}
      </span>
    )}
  </div>

  <div className="mt-2 flex items-center gap-2">
    {product.original_price && (
      <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
        Pre-order price
      </span>
    )}

    {product.free_delivery && (
      <>
        <span className="h-1 w-1 rounded-full bg-neutral-300" />

        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          Free delivery across India
        </span>
      </>
    )}
  </div>

  {/* PURCHASE BUTTON */}
 <button
  type="button"
  onClick={() => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      weight: product.weight,
      image_url: product.image_url,
      quantity: 1,
    });

    setAddedToCart(true);

   
  }}
  className="
    mt-5
    w-full
    max-w-[420px]
    bg-black
    px-6
    py-4
    text-[10px]
    font-medium
    uppercase
    tracking-[0.3em]
    text-white
    transition
    hover:bg-neutral-800
    active:scale-[0.99]
  "
>
  {addedToCart
    ? "Added to Cart ✓"
    : product.stock_quantity > 0
      ? "Add to Cart"
      : "Pre-Order Now"}
</button>

{addedToCart && (
  <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-neutral-500">
    Revive has been added to your cart.
  </p>
)}
</motion.div>

{/* DETAILS */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.95 }}
  className="mt-7 flex items-center gap-5 pb-8 sm:mt-8 sm:gap-7 md:mt-10"
>
  <div>
    <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
      NET WEIGHT
    </p>

    <p className="mt-1.5 text-sm font-medium">
      {product.weight || "50g"}
    </p>
  </div>

  <div className="h-7 w-px bg-black/10" />

  <div>
    <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
      COLLECTION
    </p>

    <p className="mt-1.5 text-sm font-medium">
      REVIVE
    </p>
  </div>

  <div className="h-7 w-px bg-black/10" />

  <div>
    <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
      FORM
    </p>

    <p className="mt-1.5 text-sm font-medium">
      FACE PACK
    </p>
  </div>
</motion.div>

            </div>

            {/* DESKTOP PRODUCT */}
            <div className="relative hidden min-h-[650px] items-center justify-center md:flex">

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 select-none font-serif text-[24rem] font-light leading-none text-black/[0.025]"
              >
                01
              </motion.p>

              <div className="absolute h-[500px] w-[500px] rounded-full bg-white/80 blur-[90px]" />

              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-10 translate-x-8 lg:translate-x-14"
              >
                <Image
                  src={product.image_url || "/images/revive.png"}
                  alt={product.name}
                  width={560}
                  height={560}
                  priority
                  draggable={false}
                  className="h-auto w-[500px] select-none drop-shadow-[0_50px_70px_rgba(0,0,0,0.18)]"
                />
              </motion.div>

              <div className="absolute bottom-[8%] left-1/2 h-8 w-64 -translate-x-1/2 rounded-full bg-black/10 blur-3xl" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2"
              >
                <p className="text-[9px] uppercase tracking-[0.45em] text-neutral-400 [writing-mode:vertical-rl]">
                  KANDID LUXURY · REVIVE · {product.weight || "50G"}
                </p>
              </motion.div>

            </div>
          </div>

          {/* FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-between border-t border-black/[0.07] pt-4 sm:pt-5"
          >
            <p className="max-w-[220px] text-[8px] uppercase tracking-[0.28em] text-neutral-400 sm:max-w-none sm:text-[9px] sm:tracking-[0.35em]">
              A DAILY RITUAL FOR RENEWED SKIN
            </p>

            <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-400 sm:text-[9px] sm:tracking-[0.35em]">
              {product.weight || "50G"}
            </p>
          </motion.div>

        </div>
      </section>
    </main>
  );
}