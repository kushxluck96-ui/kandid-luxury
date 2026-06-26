"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import HowToApplyModal from "./HowToApplyModal";

export default function ApplySection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="bg-[#F8F8F6] px-6 py-20">

        <div className="mx-auto max-w-5xl rounded-[40px] bg-white p-10 shadow-sm border border-neutral-200">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-500">
            EXPERIENCE
          </p>

          <h2 className="mt-5 text-5xl font-serif font-light">
            Learn the Pearl Ritual
          </h2>

          <p className="mt-6 max-w-xl text-neutral-600 leading-8">
            Discover the recommended way to prepare and apply Kandid Pearl
            Powder for the best results.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-neutral-900 px-8 py-4 text-white transition hover:bg-black"
          >
            Learn How to Apply

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </button>

        </div>

      </section>

      <HowToApplyModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}