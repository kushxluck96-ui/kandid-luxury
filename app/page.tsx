
import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowToApply from "@/components/HowToApply";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Pure Pearl Powder for Skin",
  description:
    "Discover Kandid Luxury's 100% pure pearl powder for a refined skincare ritual and naturally luminous-looking skin.",
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
      "@type": "Product",
      name: "Kandid Pearl Powder",
      description:
        "100% pure pearl powder for a refined skincare ritual and luminous-looking skin.",
      image: "https://kandidluxury.com/images/pearl.png",
      brand: {
        "@type": "Brand",
        name: "Kandid Luxury",
      },
      category: "Skincare",
    },
  ],
};


export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F8F6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      
<header className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 items-center justify-end gap-3 rounded-full border border-[#D8D0BE]/70 bg-[#F8F8F6]/90 px-4 py-3 shadow-[0_8px_30px_rgba(41,40,32,0.08)] backdrop-blur-xl sm:top-6 sm:w-[calc(100%-3rem)] sm:px-6">
  <Link
    href="/account/login"
    className="rounded-full px-4 py-2 text-sm tracking-wide text-[#514A3D] transition hover:text-[#9A8153]"
  >
    Login
  </Link>

  <Link
    href="/shop"
    aria-label="Shop skincare"
    className="inline-flex items-center gap-2 rounded-full border border-[#B8A47A]/70 bg-[#292820] px-5 py-2.5 text-sm tracking-wide text-[#F8F5ED] transition duration-300 hover:bg-[#403D31]"
  >
    <ShoppingBag size={17} strokeWidth={1.5} />
    <span>Shop</span>
  </Link>
</header>


      <Hero />
      <HowToApply />
      <Benefits />
      <About />
      <Footer />
    </main>
  );
}
