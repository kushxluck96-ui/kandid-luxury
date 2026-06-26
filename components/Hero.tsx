"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F8F6]">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8F8F6] to-[#F2F1EE]" />
      <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-white blur-[120px]" />
      <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-white blur-[120px]" />
      <div className="absolute left-1/2 top-[45%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white opacity-90 blur-[150px]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-10 pb-10">

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="tracking-[0.55em] text-xs uppercase text-neutral-500"
        >
          KANDID LUXURY
        </motion.p>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-4 text-center"
        >
          <h1 className="font-serif text-5xl italic font-light text-neutral-800 md:text-6xl">
            I am
          </h1>
          <h2 className="mt-1 font-serif text-7xl italic font-light leading-none text-black md:text-8xl">
            100% Pure
          </h2>
        </motion.div>

        {/* Floating Product */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mt-16 flex h-[380px] w-[380px] items-center justify-center"
        >
          <Image
  src="/images/pearl.png"
  alt="Pearl Powder"
  width={380}
  height={380}
  priority
  className="h-auto w-full max-w-[380px] drop-shadow-[0_45px_70px_rgba(0,0,0,0.15)]"
/>
          <div className="absolute bottom-6 left-1/2 h-5 w-52 -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="-mt-8 text-center"
        >
          <h3 className="text-4xl font-semibold tracking-tight text-black">
            Pearl Powder
          </h3>
          

          {/* Feature Pills */}
          <div className="mt-5 flex items-center justify-center gap-4 tracking-widest text-xs uppercase text-neutral-400">
  <span>100% Pure</span>
  <span className="h-3 w-px bg-neutral-300" />
  <span>Food Grade</span>
  <span className="h-3 w-px bg-neutral-300" />
  <span>30 g</span>
</div>
        </motion.div>

      </div>
    </section>
  );
}