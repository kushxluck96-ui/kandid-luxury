"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const recipes = {
  "Dry Skin": [
    "Aloe vera juice and pearl powder",
    "Honey, aloe vera and pearl powder",
    "Yoghurt (Plain/Unsweetened), honey and pearl powder",
    "Rose water, glycerin and pearl powder",
    "Yoghurt, honey, turmeric & pearl powder",
    "Honey, turmeric and pearl powder",
    "Aloe vera juice, butter and pearl powder",
    "Avocado and pearl powder",
    "Milk, honey and pearl powder",
    "Milk, glycerin and pearl powder",
    "Banana, milk and pearl powder",
    "Banana, honey and pearl powder",
    "Banana, olive oil and pearl powder",
    "Banana, avocado and pearl powder mask",
    "Moisturizer and pearl powder",
  ],
  "Oily Skin": [
    "Rose water and pearl powder",
    "Green tea and pearl powder",
    "Aloe vera and pearl powder",
    "Yoghurt (Plain/Unsweetened) and pearl powder",
    "Yoghurt, turmeric and pearl powder",
    "Cucumber juice and pearl powder",
    "Apple cider vinegar and pearl powder",
    "Honey and pearl powder",
    "Banana, oat milk scrub and pearl powder",
    "Tomato juice and pearl powder",
    "Coffee grounds, water and pearl powder",
    "Tea tree oil and pearl powder",
    "Oil free moisturizer and pearl powder",
  ],
  "Combination Skin": [
    "Rose water and pearl powder",
    "Honey and pearl powder",
    "Yogurt (Plain/Unsweetened) and pearl powder",
    "Aloe vera juice and pearl powder",
    "Cucumber juice and pearl powder",
    "Green tea (cooled) and pearl powder",
    "Rice water and pearl powder",
    "Coconut water and pearl powder",
  ],
};

type SkinType = keyof typeof recipes;

interface Props {
  onClose: () => void;
}

export default function Application({ onClose }: Props) {
  const [active, setActive] = useState<SkinType>("Dry Skin");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-[32px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-neutral-100">
          <p className="tracking-[0.4em] uppercase text-xs text-neutral-400">
            How to Use
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light italic text-neutral-900">
            Pearl Powder Applications
          </h2>

          {/* Skin Type Tabs */}
          <div className="mt-6 flex gap-2 flex-wrap">
            {(Object.keys(recipes) as SkinType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActive(type)}
                className={`rounded-full px-5 py-1.5 text-xs tracking-widest uppercase transition-all duration-200 ${
                  active === type
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe List */}
        <div className="overflow-y-auto max-h-[50vh] px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.ol
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {recipes[active].map((recipe, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="mt-0.5 text-xs tracking-widest text-neutral-300 font-light w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-neutral-700 text-sm leading-6">
                    {recipe}
                  </span>
                </li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition-colors"
        >
          <X size={16} className="text-neutral-500" />
        </button>
      </motion.div>
    </motion.div>
  );
}