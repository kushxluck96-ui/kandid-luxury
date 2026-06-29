import Hero from "@/components/Hero";
import About from "@/components/About";


import HowToApply from "@/components/HowToApply";
import Benefits from "@/components/Benefits";


export default function Home() {
  return (
    <main className="bg-[#F8F8F6]">

      <Hero />
      <HowToApply />
      <Benefits />
      <About />

      

    </main>
  );
}