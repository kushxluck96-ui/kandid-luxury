
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

const reviveImages = [
  "/images/revive.png",
  "/images/revive1.png",
  "/images/revive2.png",
  "/images/revive3.png",
  "/images/revive4.png",
  
  
];

export default function RevivePage() {
  const { addToCart } = useCart();

  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(reviveImages[0]);

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

  function handleAddToCart() {
    if (!product || product.stock_quantity <= 0) return;

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
  }

  // Discourage casual saving of product photos.
  function protectImage(e: React.SyntheticEvent) {
    e.preventDefault();
  }

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
      <section className="relative overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFC] via-[#F4F9FA] to-[#EAF4F7]" />

        <div className="absolute -right-40 top-[18%] h-[420px] w-[420px] rounded-full bg-[#DDF2F8] opacity-70 blur-[100px] md:h-[650px] md:w-[650px]" />

        <div className="absolute -left-40 bottom-[-10%] h-[350px] w-[350px] rounded-full bg-white blur-[100px] md:h-[500px] md:w-[500px]" />

        {/* ARCHITECTURAL LINES */}
        <div className="absolute left-[6%] top-0 hidden h-full w-px bg-black/[0.05] md:block" />
        <div className="absolute right-[6%] top-0 hidden h-full w-px bg-black/[0.05] md:block" />

        {/* MAIN CONTAINER */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-7 md:px-10 md:py-8">

          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <Link
  href="/"
  className="text-[9px] font-medium uppercase tracking-[0.38em] text-neutral-500 sm:text-[10px] sm:tracking-[0.45em]"
>
  KANDID LUXURY
</Link>

            <Link
              href="/cart"
              className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 transition hover:text-black sm:text-[10px]"
            >
              Cart →
            </Link>
          </motion.header>

          <div className="grid flex-1 items-center gap-8 md:grid-cols-2 md:gap-4">

            {/* LEFT CONTENT */}
            <div className="relative z-20 pt-10 md:pt-0">

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[9px] uppercase tracking-[0.35em] text-neutral-500 sm:text-[10px] sm:tracking-[0.4em]"
              >
                Anti-Aging Face Pack
              </motion.p>

              {/* TITLE */}
              <motion.h1
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="mt-4 font-serif text-[19vw] font-light leading-[0.85] tracking-[-0.07em] text-neutral-950 sm:text-[17vw] md:mt-0 md:text-[clamp(6rem,11vw,10rem)]"
              >
                REVIVE
              </motion.h1>

              {/* MOBILE PRODUCT GALLERY */}
              <div
                onContextMenu={protectImage}
                onDragStart={protectImage}
                className="relative mt-6 mb-7 flex flex-col items-center select-none [-webkit-touch-callout:none] md:hidden"
              >
                <div className="absolute top-1/2 h-[270px] w-[270px] -translate-y-1/2 rounded-full bg-white/80 blur-[65px] sm:h-[340px] sm:w-[340px]" />

                <p className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-serif text-[10rem] font-light leading-none text-black/[0.025]">
                  02
                </p>

                {/* MAIN IMAGE */}
                <div className="relative z-10 flex h-[290px] w-full items-center justify-center sm:h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="relative flex h-full w-full items-center justify-center"
                    >
                      <Image
                        src={selectedImage}
                        alt={`${product.name} product photo`}
                        width={600}
                        height={600}
                        priority
                        draggable={false}
                        onContextMenu={protectImage}
                        onDragStart={protectImage}
                        className="h-full w-full pointer-events-none select-none object-contain p-3"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="absolute bottom-[65px] left-1/2 h-6 w-44 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />

                {/* MOBILE THUMBNAILS */}
                <div className="relative z-20 mt-3 flex w-full justify-center gap-2 overflow-x-auto px-1 pb-2">
                  {reviveImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      onContextMenu={protectImage}
                      onDragStart={protectImage}
                      aria-label={`View Revive photo ${index + 1}`}
                      aria-pressed={selectedImage === image}
                      className={`relative h-[55px] w-[55px] shrink-0 overflow-hidden rounded-lg border bg-white transition-all sm:h-[64px] sm:w-[64px] ${
                        selectedImage === image
                          ? "border-black ring-1 ring-black"
                          : "border-black/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Revive photo ${index + 1}`}
                        fill
                        sizes="64px"
                        draggable={false}
                        onContextMenu={protectImage}
                        onDragStart={protectImage}
                        className="pointer-events-none select-none object-contain p-1"
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-neutral-400">
                  Select a photo · {reviveImages.indexOf(selectedImage) + 1} / {reviveImages.length}
                </p>
              </div>

              {/* DIVIDER */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-5 h-px max-w-[420px] bg-black/10 sm:mt-6 md:mt-10"
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

              {/* PRICE AND PURCHASE */}
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
                      Special price
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

                {/* ADD TO CART */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  className="mt-5 w-full max-w-[420px] bg-black px-6 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {product.stock_quantity <= 0
                    ? "Out of Stock"
                    : addedToCart
                      ? "Added to Cart ✓"
                      : "Add to Cart"}
                </button>

                {/* GO TO CART */}
                {addedToCart && (
                  <div className="mt-4 max-w-[420px]">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                      Revive has been added to your cart.
                    </p>

                    <Link
                      href="/cart"
                      className="mt-3 flex w-full items-center justify-center border border-black px-6 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
                    >
                      Go to Cart →
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* PRODUCT DETAILS */}
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

            {/* DESKTOP PRODUCT GALLERY */}
            <div
              onContextMenu={protectImage}
              onDragStart={protectImage}
              className="relative hidden min-h-[650px] flex-col items-center justify-center select-none [-webkit-touch-callout:none] md:flex"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-serif text-[24rem] font-light leading-none text-black/[0.025]"
              >
                02
              </motion.p>

              <div className="absolute h-[500px] w-[500px] rounded-full bg-white/80 blur-[90px]" />

              {/* MAIN IMAGE */}
              <div className="relative z-10 flex h-[510px] w-full items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex h-full w-full items-center justify-center"
                  >
                    <Image
                      src={selectedImage}
                      alt={`${product.name} product photo`}
                      width={700}
                      height={700}
                      priority
                      draggable={false}
                      onContextMenu={protectImage}
                      onDragStart={protectImage}
                      className="h-full w-full pointer-events-none select-none object-contain p-5 drop-shadow-[0_40px_55px_rgba(0,0,0,0.13)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* DESKTOP THUMBNAILS */}
              <div className="relative z-20 mt-3 flex justify-center gap-3">
                {reviveImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    onContextMenu={protectImage}
                    onDragStart={protectImage}
                    aria-label={`View Revive photo ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    className={`relative h-[68px] w-[68px] overflow-hidden rounded-lg border bg-white transition-all ${
                      selectedImage === image
                        ? "border-black ring-1 ring-black"
                        : "border-black/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Revive photo ${index + 1}`}
                      fill
                      sizes="68px"
                      draggable={false}
                      onContextMenu={protectImage}
                      onDragStart={protectImage}
                      className="pointer-events-none select-none object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              <p className="relative z-10 mt-3 text-[8px] uppercase tracking-[0.25em] text-neutral-400">
                Select a photo · {reviveImages.indexOf(selectedImage) + 1} / 7
              </p>

              <div className="absolute bottom-[5%] left-1/2 h-8 w-64 -translate-x-1/2 rounded-full bg-black/10 blur-3xl" />

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
            className="mt-5 flex items-center justify-between border-t border-black/[0.07] pt-4 sm:pt-5"
          >
            <p className="max-w-[220px] text-[8px] uppercase tracking-[0.28em] text-neutral-400 sm:max-w-none sm:text-[9px] sm:tracking-[0.35em]">
              A RITUAL FOR RENEWED SKIN
            </p>

            <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-400 sm:text-[9px] sm:tracking-[0.35em]">
              {product.weight || "50G"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <section className="relative bg-[#F8FAFA] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">

          {/* INTRODUCTION */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[9px] uppercase tracking-[0.45em] text-neutral-400">
              The Revive Experience
            </p>

            <h2 className="mt-6 font-serif text-4xl font-light leading-tight tracking-tight text-neutral-900 md:text-6xl">
              A more refreshed
              <br />
              expression of you.
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-neutral-500 md:text-base">
              Revive Anti-Aging Botox Face Pack is a powder-based facial
              Pack formulated with Acetyl Hexapeptide-8, Allantoin
              and Panthenol. Designed as an at-home skincare ritual,
              it helps leave the skin feeling smooth, refreshed and
              looking more radiant.
            </p>

            <p className="mt-5 text-xs leading-6 text-neutral-400">
              A cosmetic skincare product. Not an injectable Botox
              treatment and does not paralyze facial muscles.
            </p>
          </div>

          {/* BENEFITS */}
<div className="mt-24">
  <div className="text-center">
    <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">
      Why Revive
    </p>

    <h3 className="mt-6 font-serif text-4xl font-light leading-tight tracking-tight text-neutral-900 md:text-6xl">
      The benefits of the ritual
    </h3>
  </div>

            <div className="mt-14 grid gap-px bg-[#DDE5E7] sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "Firmer-looking skin",
                  description:
                    "Helps improve the appearance of loose and tired-looking skin.",
                },
                {
                  number: "02",
                  title: "Smoother appearance",
                  description:
                    "Helps soften the appearance of fine lines and wrinkles.",
                },
                {
                  number: "03",
                  title: "Gentle exfoliation",
                  description:
                    "Helps remove surface dead skin cells for a smoother feel.",
                },
                {
                  number: "04",
                  title: "Radiant glow",
                  description:
                    "Leaves skin looking refreshed, smooth and radiant.",
                },
              ].map((benefit) => (
  <div
    key={benefit.number}
    className="bg-[#F8FAFA] px-7 py-10"
  >
    <p className="font-serif text-4xl font-light text-[#C5B18E]">
      {benefit.number}
    </p>

    <h4 className="mt-7 text-base font-semibold text-neutral-900">
      {benefit.title}
    </h4>

    <p className="mt-3 text-sm leading-7 text-neutral-600">
      {benefit.description}
    </p>
  </div>
))}
            </div>
          </div>

          {/* INGREDIENTS */}
          <div className="mt-24 grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">
                Inside the formulation
              </p>

              <h3 className="mt-5 font-serif text-4xl font-light leading-tight text-neutral-900 md:text-5xl">
                Thoughtful ingredients.
                <br />
                Refined skincare.
              </h3>

              <p className="mt-6 text-sm leading-8 text-neutral-500">
                A carefully listed blend of cosmetic ingredients,
                including Acetyl Hexapeptide-8, Allantoin and Panthenol,
                brought together for your facial care ritual.
              </p>
            </div>

            <div className="border-y border-[#DDE5E7] py-8">
              <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">
                Full ingredient list
              </p>

              <p className="mt-6 text-sm leading-8 text-neutral-600">
                Albumen, Zea Mays (Corn) Starch, Acetyl Hexapeptide-8,
                Allantoin, Panthenol, Silica, Dipalmitoyl Hydroxyproline,
                Butylene Glycol, 1,2-Hexanediol, Caprylyl Glycol.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "No Parabens",
                  "No Artificial Coloring",
                  "No Alcohol",
                  "No Fragrance",
                ].map((item) => (
                  <span
                    key={item}
                    className="border border-[#DDE5E7] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-neutral-500"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* APPLICATION */}
          <div className="mt-24 bg-[#EDF3F4] px-7 py-14 md:px-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">
                  Your skincare ritual
                </p>

                <h3 className="mt-4 font-serif text-5xl font-light text-neutral-900 md:text-5xl">
                  How to use Revive
                </h3>

                <p className="mt-5 text-md text-neutral-500">
                  A simple skincare ritual, 1–2 times a week.
                </p>
              </div>

              <div className="mt-3 space-y-4 divide-y divide-black/10 border-t border-black/10 pt-6   leading-7 text-neutral-900">
                
                
                {[
                  {
                    number: "01",
                    title: "Prepare",
                    description:
                      "Mix equal quantities of Revive Powder and water until you obtain a creamy consistency.",
                  },
                  {
                    number: "02",
                    title: "Apply",
                    description:
                      "Apply evenly with a brush, avoiding the eye and lip areas.",
                  },
                  {
                    number: "03",
                    title: "Relax",
                    description:
                      "Leave the mask on for 10–15 minutes.",
                  },
                  {
                    number: "04",
                    title: "Rinse",
                    description:
                      "Rinse thoroughly with water and follow with your favourite moisturizer.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-6 border-b border-black/10 pb-7"
                  >
                    <span className="font-serif text-3xl font-light text-[#B69B70]">
                      {step.number}
                    </span>

                    <div>
                      <h4 className="text-lg font-medium text-neutral-900">
                        {step.title}
                      </h4>

                      <p className="mt-3 text-lg leading-8 font-normal text-neutral-700">
  {step.description}
</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-center text-[10px] leading-6 text-neutral-500">
                Avoid steam or heat exposure for 24 hours after application.
                Patch test before use.
              </p>
            </div>
          </div>

          {/* PRECAUTIONS AND STORAGE */}
          <div className="mt-24 grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">
                Important information
              </p>

              <h3 className="mt-4 font-serif text-4xl font-light text-neutral-900">
                Precautions
              </h3>

              <ul className="mt-7 space-y-4 text-xs leading-7 text-neutral-500">
                <li>
                  • Avoid contact with eyes. If contact occurs, rinse thoroughly with water.
                </li>
                <li>• Use eye protection if necessary.</li>
                <li>• If ingested, consult a doctor.</li>
                <li>• Keep out of reach of children.</li>
                <li>
                  • Do not use during pregnancy or lactation, as stated in the product instructions.
                </li>
                <li>• Discontinue use if irritation occurs.</li>
              </ul>
            </div>

            <div className="border-t border-[#DDE5E7] pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">
                Product care
              </p>

              <h3 className="mt-4 font-serif text-4xl font-light text-neutral-900">
                Storage
              </h3>

              <p className="mt-7 text-sm leading-8 text-neutral-500">
                Store Revive in a cool, dark place, away from direct
                sunlight and excessive heat.
              </p>

              <p className="mt-5 font-serif text-3xl font-light text-neutral-900">
                0°–30°C
              </p>

              <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Recommended storage temperature
              </p>
            </div>
          </div>

          {/* CLOSING */}
          <div className="mt-24 border-t border-[#DDE5E7] pt-14 text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">
              KANDID LUXURY
            </p>

            <h3 className="mt-5 font-serif text-3xl font-light text-neutral-900 md:text-4xl">
              Make time for your skin.
            </h3>

            <p className="mt-4 text-xs tracking-wide text-neutral-400">
              REVIVE ANTI-AGING BOTOX FACE PACK
            </p>

            <Link
              href="/cart"
              className="mt-8 inline-flex border border-black px-8 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
            >
              View Your Cart →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
