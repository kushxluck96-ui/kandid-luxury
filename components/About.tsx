"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

export default function About() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "about")
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setContent(data.content);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#F8F8F6] px-6 py-24">
        <div className="mx-auto max-w-5xl text-center text-neutral-500">
          Loading...
        </div>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
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
            {content.sectionLabel}
          </p>

          <h2 className="mt-6 text-5xl font-serif font-light italic leading-tight text-neutral-900 whitespace-pre-line">
            {content.heading}
          </h2>

          <div className="mt-8 h-px w-16 bg-neutral-300" />

          <p className="mt-8 max-w-2xl leading-8 text-neutral-600 text-lg whitespace-pre-line">
            {content.paragraph1}
          </p>

          <p className="mt-4 max-w-2xl leading-8 text-neutral-600 text-lg whitespace-pre-line">
            {content.paragraph2}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Marketed By
              </p>

              <p className="text-sm text-neutral-700 leading-6 whitespace-pre-line">
                {content.marketedBy}
              </p>
            </div>

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Sourced From
              </p>

              <p className="text-sm text-neutral-700 leading-6">
                {content.sourcedFrom}
              </p>
            </div>

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Packaged In
              </p>

              <p className="text-sm text-neutral-700 leading-6">
                {content.packagedIn}
              </p>
            </div>

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Batch Number
              </p>

              <p className="text-sm text-neutral-700">
                {content.batchNumber}
              </p>
            </div>

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Manufactured
              </p>

              <p className="text-sm text-neutral-700">
                {content.manufactured}
              </p>
            </div>

            <div>
              <p className="tracking-[0.3em] uppercase text-xs text-neutral-400 mb-2">
                Expires
              </p>

              <p className="text-sm text-neutral-700">
                {content.expires}
              </p>
            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}