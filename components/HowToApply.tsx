"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Sparkles,
  Hand,
  Heart,
} from "lucide-react";

const steps = [
  {
    icon: Droplets,
    title: "Step 1",
    subtitle: "Cleanse",
    description:
      "Wash your face thoroughly and gently pat dry before application.",
  },
  {
    icon: Sparkles,
    title: "Step 2",
    subtitle: "Mix",
    description:
      "Mix a small amount of Pearl Powder with water, rose water or yogurt to create a smooth paste.",
  },
  {
    icon: Hand,
    title: "Step 3",
    subtitle: "Apply",
    description:
      "Spread an even layer across your face while avoiding the eye area.",
  },
  {
    icon: Heart,
    title: "Step 4",
    subtitle: "Rinse",
    description:
      "Leave for 10–15 minutes, then rinse with lukewarm water and moisturize.",
  },
];

export default function HowToApply() {
  return (
    <section className="bg-[#F8F8F6] px-6 py-24">

      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-neutral-500">
            HOW TO APPLY
          </p>

          <h2 className="mt-4 text-5xl font-serif font-light text-neutral-900">
            Your Luxury Ritual
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            Follow these simple steps to enjoy the full benefits of Kandid
            Pearl Powder.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="rounded-[32px] border border-neutral-200 bg-white/70 p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Icon size={24} />
                </div>

                <p className="mt-6 text-sm uppercase tracking-[0.25em] text-neutral-500">
                  {step.title}
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-neutral-900">
                  {step.subtitle}
                </h3>

                <p className="mt-4 leading-7 text-neutral-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}