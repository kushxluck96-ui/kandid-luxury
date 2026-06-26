"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Application from "./Application";

const benefits = [

     {
    number: "01",
    title: "Brightens Complexion",
    description:
      "Pearl powder contains nacre and amino acids that naturally illuminate skin, reducing dullness and promoting a luminous, even-toned glow.",
  },
  {
    number: "02",
    title: "Deep Hydration",
    description:
      "Rich in calcium and trace minerals, it strengthens the skin barrier and helps lock in moisture for long-lasting softness.",
  },
  {
    number: "03",
    title: "Anti-Aging",
    description:
      "Naturally occurring conchiolin protein stimulates collagen production, visibly reducing fine lines and improving skin elasticity over time.",
  },
  {
    number: "04",
    title: "Calms & Soothes",
    description:
      "Pearl's cooling properties reduce redness and irritation, making it ideal for sensitive or reactive skin types.",
  },
  {
    number: "05",
    title: "Detoxifies Skin",
    description:
      "Acts as a gentle detoxifier, drawing out impurities and excess sebum while leaving the skin clean and refreshed.",
  },
  {
    number: "06",
    title: "Enhances Radiance",
    description:
      "Regular use imparts a soft-focus, lit-from-within radiance — the signature of pearl-infused skincare traditions.",
  },
  // ... same as before
];

export default function Benefits() {
  const [showApp, setShowApp] = useState(false);

  return (
    <>
      <section className="bg-[#F8F8F6] px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          {/* Header */}
          <div className="mb-16">
            <p className="tracking-[0.4em] uppercase text-xs text-neutral-400">
              Why Pearl
            </p>
            <h2 className="mt-4 font-serif text-5xl font-light italic leading-tight text-neutral-900">
              The Art of
              <br />
              Natural Transformation
            </h2>
            <div className="mt-6 h-px w-16 bg-neutral-300" />
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-14">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-xs tracking-widest text-neutral-300 font-light mb-4">
                  {benefit.number}
                </p>
                <h3 className="font-serif text-xl font-light italic text-neutral-900 mb-3">
                  {benefit.title}
                </h3>
                <div className="h-px w-8 bg-neutral-200 mb-4" />
                <p className="text-sm text-neutral-500 leading-7">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 flex flex-col items-center text-center"
          >
            <p className="tracking-[0.4em] uppercase text-xs text-neutral-400 mb-4">
              Ready to Begin
            </p>
            <h3 className="font-serif text-3xl font-light italic text-neutral-900 mb-8">
              Find Your Perfect Formula
            </h3>
            <button
              onClick={() => setShowApp(true)}
              className="inline-flex items-center gap-3 rounded-full border border-neutral-900 px-10 py-3.5 text-xs tracking-[0.3em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              View Applications
            </button>
          </motion.div>

        </motion.div>
      </section>

      <AnimatePresence>
        {showApp && <Application onClose={() => setShowApp(false)} />}
      </AnimatePresence>
    </>
  );
}