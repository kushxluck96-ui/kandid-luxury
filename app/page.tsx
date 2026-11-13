
import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
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

      <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8">

  {/* MiniMagic Logo - Center */}
  <Link
    href="/"
    aria-label="MiniMagic Skincare home"
    className="absolute left-1/2 top-1/2 block h-14 w-36 -translate-x-1/2 -translate-y-1/2 sm:h-16 sm:w-44"
  >
    <Image
      src="/images/minimagic.png"
      alt="MiniMagic Skincare"
      fill
      priority
      sizes="(max-width: 640px) 144px, 176px"
      className="object-contain"
    />
  </Link>



{/* Account - Right Corner */}
<div className="ml-auto z-10">
  {user ? (
    <Link
      href="/account"
      aria-label="Open your account"
      className="inline-flex max-w-[140px] items-center gap-2 rounded-full px-3 py-2 text-sm font-medium tracking-wide text-[#514A3D] transition-colors duration-300 hover:bg-[#F5F3EE]"
    >
      <UserRound size={18} strokeWidth={1.5} className="shrink-0" />
      <span className="truncate">{displayName.split(" ")[0]}</span>
    </Link>
  ) : (
    <Link
      href="/account/login"
      aria-label="Login to your account"
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide text-[#514A3D] transition-colors duration-300 hover:bg-[#F5F3EE]"
    >
      <UserRound size={18} strokeWidth={1.5} />
      <span>Login</span>
    </Link>
  )}
</div>


      </header>

      <Hero />

      <Footer />
    </main>
  );
}
