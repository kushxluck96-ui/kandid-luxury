import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F8F8F6]">
      {/* Illustration */}
      <div className="flex justify-center pt-8">
        <Image
          src="/images/pearl-art.png"
          alt="Ancient artisans crafting pearl powder"
          width={1500}
          height={900}
          draggable={false}
          className="w-full max-w-5xl h-auto select-none pointer-events-none"
          priority
        />
      </div>

      {/* Quote */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A] leading-tight">
          Ancient heritage.
          <br />
          Modern purity.
        </h2>

        <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.45em] text-[#666666]">
          Timeless Pearl Powder
        </p>

        <div className="w-20 h-px bg-[#D8B67D] mx-auto my-10" />

        <p className="text-sm text-[#8A8A8A]">
          © {new Date().getFullYear()} Kandid Luxury. All rights reserved.
        </p>
      </div>
    </footer>
  );
}