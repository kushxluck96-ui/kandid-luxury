"use client";

import { motion } from "framer-motion";
import { Sparkles, Droplets, Heart, Leaf } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Fresh-Looking Skin",
    description:
      "A luxurious face-pack ritual designed to leave skin looking refreshed and radiant.",
  },
  {
    icon: Droplets,
    title: "Hydrated Feel",
    description:
      "Helps give your skin a softer, smoother and more comfortable feel after application.",
  },
  {
    icon: Heart,
    title: "Self-Care Ritual",
    description:
      "Turn your skincare routine into a relaxing at-home beauty ritual.",
  },
  {
    icon: Leaf,
    title: "Luxury Care",
    description:
      "A carefully presented treatment experience created for your regular skincare routine.",
  },
];

export default function ReviveBenefits() {
  return (
    <section className="relative overflow-hidden bg-[#F8F8F6] px-6 py-24 md:py-32">
      
      {/* Soft background glow */}
      <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            The Revive Ritual
          </p>

          <h2 className="mt-4 font-serif text-5xl font-light italic text-neutral-900 md:text-6xl">
            Let your skin
            <br />
            <span className="not-italic">feel revived.</span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-neutral-500 md:text-base">
            A simple, luxurious face-pack ritual created to complement your
            skincare routine and leave your skin feeling refreshed.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group rounded-3xl border border-black/[0.06] bg-white/70 p-7 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F1EE] transition-transform duration-300 group-hover:scale-105">
                  <Icon
                    strokeWidth={1.4}
                    className="h-6 w-6 text-neutral-700"
                  />
                </div>

                <h3 className="mt-6 text-lg font-medium text-neutral-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}