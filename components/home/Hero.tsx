"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";

const slides = [
  { id: 1, image: "https://i.ibb.co.com/Qj6Pzjxb/Mizan-Electronics.png" },
  {
    id: 2,
    image:
      "https://i.ibb.co.com/21ZsvK7z/Screenshot-2026-03-15-at-12-34-45-AM.png",
  },
];

export default function Hero() {
  const { locale } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % slides.length), 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-16 lg:pt-22">
      <div className="w-full max-w-7xl mx-auto px-0">
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[19/9] sm:aspect-[18/8] md:aspect-[18/7] lg:aspect-[16/7]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.image}
                alt={`hero-${slide.id}-${locale}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-10 bg-[#6366f1]" : "w-4 bg-neutral-300/80"}`}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
