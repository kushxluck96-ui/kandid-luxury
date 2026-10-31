
import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MiniMagic Skincare by Kandid Luxury",
  description:
    "Little Magic. Beautiful Skin. Everyday Confidence. Discover MiniMagic skincare by Kandid Luxury.",
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Kandid Luxury",
      url: "https://kandidluxury.com/",
      logo: "https://kandidluxury.com/favicon.ico",
    },
    {
      "@type": "Brand",
      name: "MiniMagic Skincare",
      slogan: "Little Magic. Beautiful Skin. Everyday Confidence.",
    },
  ],
};

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.given_name ||
    user?.email?.split("@")[0] ||
    "My Account";

  return (
    <main className="min-h-screen bg-[#F8F8F6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <header className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-5 py-5 sm:px-8">
        {user ? (
          <Link
            href="/account"
            aria-label="Open your account"
            className="inline-flex max-w-[180px] items-center gap-2 rounded-full px-3 py-2.5 text-sm tracking-wide text-[#514A3D] transition hover:bg-[#EFEEE8]"
          >
            <UserRound
              size={16}
              strokeWidth={1.5}
              className="shrink-0"
            />
            <span className="truncate">
              {displayName}
            </span>
          </Link>
        ) : (
          <Link
            href="/account/login"
            aria-label="Login to your account"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm tracking-wide text-[#514A3D] transition hover:bg-[#EFEEE8]"
          >
            <UserRound size={16} strokeWidth={1.5} />
            Login
          </Link>
        )}

       
      </header>

      <Hero />

      <Footer />
    </main>
  );
}
