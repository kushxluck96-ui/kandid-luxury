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
    <main className="bg-[#F8F8F6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />
     
      <HowToApply />
      <Benefits />
      <About />
      
      <Footer/>
      

    </main>
  );
}
