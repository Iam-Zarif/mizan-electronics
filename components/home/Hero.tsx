"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

const slidesDesktop = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dj5olrziv/image/upload/v1773765464/mizan_ac_servicing_1_npooxg.png",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dj5olrziv/image/upload/v1773765463/mizan_ac_servicing_2_h7bus8.png",
  },
];

const slidesMobile = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dj5olrziv/image/upload/v1773765463/mizan_ac_servicing_responsive_mobile_kfkii0.png",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dj5olrziv/image/upload/v1773765463/mizan_ac_servicing_responsive_mobile_1_eazz5r.png",
  },
];

export default function Hero() {
  const { locale } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slides = isMobile ? slidesMobile : slidesDesktop;

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % slides.length), 4200);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden pt-16 lg:pt-22">
      <div className="w-full max-w-7xl mx-auto px-0">
        <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl aspect-19/17 sm:aspect-18/8 md:aspect-18/7 lg:aspect-16/7">
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
                loading={i === 0 ? "eager" : "lazy"}
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
