
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

      

      <Hero />

      <div className="flex flex-col items-center justify-center gap-4 px-5 py-9 sm:flex-row">
        <Link
          href="/shop"
          className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#B8A47A] bg-[#292820] px-8 py-4 text-sm tracking-[0.08em] text-[#F8F5ED] shadow-sm transition duration-300 hover:bg-[#403D31] sm:w-auto"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          Explore the Collection
        </Link>

        <Link
          href="/account/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D8D3C7] px-8 py-4 text-sm tracking-wide text-[#514A3D] transition duration-300 hover:border-[#B8A47A] hover:bg-[#EFEEE8] sm:w-auto"
        >
          <UserRound size={17} strokeWidth={1.5} />
          Continue with Google
        </Link>
      </div>

      <HowToApply />
      <Benefits />
      <About />
      <Footer />
    </main>
  );
}
