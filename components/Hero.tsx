
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#F8F7F3] text-[#28261F]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#F8F7F3] to-[#EEEAE1]" />
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-white/80 blur-[100px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#E9DFCC]/40 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Brand introduction */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 text-center lg:text-left"
          >
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-[12px] font-medium uppercase tracking-[0.38em] text-[#9B896B] sm:text-[10px]">
                MINIMAGIC SKINCARE
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#8B806D]">
                by KANDID LUXURY
              </p>
            </div>

            <p className="mt-7 font-serif text-3xl font-light italic text-[#85765F] sm:text-4xl">
              Little Magic.
            </p>

            <h1 className="mt-1 font-serif text-[46px] font-normal leading-[1.05] tracking-tight text-[#29271F] sm:text-6xl lg:text-7xl">
              Beautiful
              <br />
              Skin.
            </h1>

            <p className="mt-3 font-serif text-2xl font-light italic text-[#85765F] sm:text-3xl">
              Everyday Confidence.
            </p>

            <p className="mx-auto mt-5 max-w-sm text-[13px] leading-6 text-[#777166] sm:text-sm sm:leading-7 lg:mx-0">
              Discover a little magic in your everyday skincare ritual.
              Thoughtful skincare, made to make every moment feel special.
            </p>

            <div className="mt-7 flex justify-center lg:justify-start">
              <Link
                href="/shop"
                className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-[#29271F] px-7 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#494437]"
              >
                Explore Collection
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <p className="mt-7 text-[9px] uppercase tracking-[0.3em] text-[#A69B88]">
              A BEAUTY EXPERIENCE BY KANDID LUXURY
            </p>
          </motion.div>

          {/* Product showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 relative mx-auto w-full max-w-[470px]"
          >
            {/* Soft background glow */}
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[70px] sm:h-[390px] sm:w-[390px]" />

            {/* Equal-height product display area */}
            <div className="relative grid min-h-[270px] grid-cols-2 items-center gap-2 sm:min-h-[410px] sm:gap-5">

              {/* Pearl Powder */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-full min-w-0 items-center justify-center"
              >
                <Link
                  href="/pearl"
                  aria-label="Discover Pearl Powder"
                  className="block w-full rounded-xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#9B896B]"
                >
                  <Image
                    src="/images/pearl.png"
                    alt="MiniMagic Pearl Powder by Kandid Luxury"
                    width={380}
                    height={380}
                    priority
                    draggable={false}
                    className="h-[235px] w-full select-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.13)] sm:h-[350px]"
                  />
                </Link>
              </motion.div>

              {/* Revive Face Pack */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-full min-w-0 items-center justify-center"
              >
                <Link
                  href="/revive"
                  aria-label="Discover Revive Face Pack"
                  className="block w-full rounded-xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#9B896B]"
                >
                  <Image
                    src="/images/revive.png"
                    alt="MiniMagic Revive Face Pack by Kandid Luxury"
                    width={380}
                    height={380}
                    draggable={false}
                    className="h-[235px] w-full select-none object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.14)] sm:h-[350px]"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Clickable product names and Discover links */}
            <div className="relative mt-1 flex items-center justify-center gap-5 text-center">
              <Link
                href="/pearl"
                className="group rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#9B896B]"
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#766D5D] transition-colors group-hover:text-black">
                  Pearl Powder
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-[#AAA08F] transition-colors group-hover:text-[#766D5D]">
                  Discover <ArrowRight size={10} />
                </p>
              </Link>

              <div className="h-7 w-px bg-[#D9D1C3]" />

              <Link
                href="/revive"
                className="group rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#9B896B]"
              >
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#766D5D] transition-colors group-hover:text-black">
                  Revive Face Pack
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-[#AAA08F] transition-colors group-hover:text-[#766D5D]">
                  Discover <ArrowRight size={10} />
                </p>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom brand detail */}
        <div className="mt-12 border-t border-[#DED8CC] pt-5 sm:mt-16">
          <p className="text-center font-serif text-sm italic text-[#96866B] sm:text-base">
            Let the Magic Begin.
          </p>
        </div>
      </div>
    </section>
  );
}
