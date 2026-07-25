"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function usePage(slug: string) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    console.log("Loading slug:", slug);

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
      setLoading(false);
      return;
    }

    setPage(data);
    setLoading(false);
  }

  async function save(content: any) {
    const { error } = await supabase
      .from("pages")
      .update({ content })
      .eq("slug", slug);

    console.log("Save error:", error);

    if (!error) {
      setPage((prev: any) => ({
        ...prev,
        content,
      }));
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  return {
    page,
    loading,
    save,
  };
}