import Image from "next/image";

export default function PearlArt() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-6 flex justify-center">
        <Image
          src="/images/pearl-art.png"
          alt="Ancient Chinese women making pearl powder"
          width={1200}
          height={700}
          priority
          className="w-full max-w-5xl h-auto object-contain"
        />
      </div>
    </section>
  );
}