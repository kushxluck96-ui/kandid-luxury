"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function About() {
  const [showApp, setShowApp] = useState(false);

  return (
    <>
      <section className="bg-[#F8F8F6] px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="rounded-[40px] border border-neutral-200 bg-white/70 backdrop-blur-xl p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

            <p className="tracking-[0.4em] uppercase text-xs text-neutral-400">
              About
            </p>

            <h2 className="mt-6 text-5xl font-serif font-light italic leading-tight text-neutral-900">
              Crafted from
              <br />
              Pure Natural Pearls
            </h2>

            <div className="mt-8 h-px w-16 bg-neutral-300" />

            <p className="mt-8 max-w-2xl leading-8 text-neutral-600 text-lg">
              Discover the timeless beauty of 100% Pure Pearl Powder — a precious mineral powder made from carefully selected pearl material, 
              naturally rich in amino acids, minerals, and calcium. Revered for centuries in Asian beauty rituals, pearl powder is known for 
              its luxurious skincare benefits that help enhance radiance, support a smoother-looking complexion, and nourish the skin.
              Traditionally valued for beauty care, it has also been used to support the appearance of healthy-looking hair, nails, and whiter-looking
              teeth. Pearl has long been associated with purity, calmness, and feminine elegance — bringing a sense of harmony and timeless beauty to your self-care ritual.
              A pure, elegant ingredient inspired by nature’s own beauty.
            </p>

            <p className="mt-4 max-w-2xl leading-8 text-neutral-600 text-lg">
              Suitable for all skin types. With regular use, Pearl Powder helps
              promote a healthy-looking glow and enhances your skin's natural
              beauty.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Marketed By</p>
                <p className="text-sm text-neutral-700 leading-6">KANDID LUXURY<br />Dubai, UAE</p>
              </div>
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Sourced From</p>
                <p className="text-sm text-neutral-700 leading-6">China · Japan · Philippines</p>
              </div>
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Packaged In</p>
                <p className="text-sm text-neutral-700 leading-6">China · UAE · Nepal</p>
              </div>
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Batch Number</p>
                <p className="text-sm text-neutral-700">—</p>
              </div>
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Manufactured</p>
                <p className="text-sm text-neutral-700">—</p>
              </div>
              <div>
                <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">Expires</p>
                <p className="text-sm text-neutral-700">—</p>
              </div>
            </div>

            

          </div>
        </motion.div>
      </section>

      
    </>
  );
}