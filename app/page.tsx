
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

      <header className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-5 py-5 sm:px-8">
        <Link
          href="/account/login"
          aria-label="Login to your account"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm tracking-wide text-[#514A3D] transition hover:bg-[#EFEEE8]"
        >
          <UserRound size={16} strokeWidth={1.5} />
          Login
        </Link>

        <Link
          href="/shop"
          className="group inline-flex items-center gap-2.5 rounded-full border border-[#B8A47A] bg-[#292820] px-5 py-3 text-sm tracking-wide text-[#F8F5ED] shadow-sm transition duration-300 hover:border-[#D5C29A] hover:bg-[#403D31]"
        >
          <ShoppingBag
            size={17}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          <span>Shop Now</span>
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
