  "use client";

  import { motion, AnimatePresence } from "motion/react";
  import Image from "next/image";
  import { useEffect, useState } from "react";
  import { Button } from "@/components/ui/button";
  import { ArrowRight, Zap } from "lucide-react";

  const slides = [
    {
      id: 1,
      title: "Smart Electronics",
      subtitle: "Upgrade your lifestyle with premium gadgets",
      image: "https://i.ibb.co/r2x4hdB8/ac2-removebg-preview.png",
    },

    {
      id: 2,
      title: "Next-Gen Devices",
      subtitle: "Performance. Design. Innovation.",
      image: "https://i.ibb.co/nNCrXhxp/ac1-removebg-preview.png",
    },
    {
      id: 3,
      title: "Reliable Technology",
      subtitle: "Built for everyday excellence",
      image: "https://i.ibb.co/JWpRvLH3/ac3-removebg-preview.png",
    },
  ];

  export default function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const t = setInterval(() => setIndex((p) => (p + 1) % slides.length), 4200);
      return () => clearInterval(t);
    }, []);

    return (
      <section className="relative pt-24 lg:pt-0 lg:min-h-screen overflow-hidden flex items-center">
        <motion.div
          className="absolute -z-10 left-[-25%] top-[-35%] h-[32.5rem] w-[32.5rem] rounded-full bg-pink-500/25 blur-[160px]"
          animate={{ x: [0, 140, 0], y: [0, 100, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute -z-10 right-[-25%] top-[5%] h-[32.5rem] w-[32.5rem] rounded-full bg-indigo-500/25 blur-[160px]"
          animate={{ x: [0, -140, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute -z-10 left-[20%] bottom-[-35%] h-[32.5rem] w-[32.5rem] rounded-full bg-[#e18b94]/20 blur-[160px]"
          animate={{ x: [0, 120, 0], y: [0, -80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />

        <div className="mx-auto max-w-7xl px-4 w-full">
          <div className="grid md:grid-cols-2 items-center gap-14 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-5"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
                <Zap className="h-4 w-4" />
                Premium Electronics Store
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Power Your Life With{" "}
                <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  Smart Electronics
                </span>
              </h1>

              <p className="max-w-xl text-base md:text-lg text-gray-600 dark:text-gray-300">
                Discover premium electronics, cutting-edge devices, and trusted
                technology — designed to elevate your everyday life.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="group cursor-pointer">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1.5" />
                </Button>

                <Button size="lg" variant="outline" className="cursor-pointer">
                  Explore Products
                </Button>
              </div>

              <div className="flex w-full flex-col items-stretch gap-5 pt-8 sm:flex-row">
                <motion.div
                  animate={{ backgroundPosition: ["0% 50%", "180% 50%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear",
                  }}
                  whileHover={{ y: -4 }}
                  className="
        relative flex flex-1 flex-col items-center justify-center
        overflow-hidden rounded-3xl
        border border-black/5 dark:border-white/10
        bg-white dark:bg-neutral-900/50
        backdrop-blur-xl
        p-5 text-center
        shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]
        dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]
      "
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.35), transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  <Image
                    src="/hero/delivery.gif"
                    alt="Fast Delivery"
                    width={40}
                    height={40}
                    unoptimized
                    className="mb-4"
                  />
                  <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    Fast Delivery
                  </p>
                </motion.div>

                {/* Warranty */}
                <motion.div
                  animate={{ backgroundPosition: ["0% 50%", "180% 50%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear",
                  }}
                  whileHover={{ y: -4 }}
                  className="
        relative flex flex-1 flex-col items-center justify-center
        overflow-hidden rounded-3xl
        border border-black/5 dark:border-white/10
        bg-white dark:bg-neutral-900/50
        backdrop-blur-xl
        p-5 text-center
        shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]
        dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]
      "
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.35), transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  <Image
                    src="/hero/warranty.gif"
                    alt="Warranty"
                    width={40}
                    height={40}
                    unoptimized
                    className="mb-4"
                  />
                  <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    Warranty Protected
                  </p>
                </motion.div>

                {/* Easy Returns */}
                <motion.div
                  animate={{ backgroundPosition: ["0% 50%", "180% 50%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear",
                  }}
                  whileHover={{ y: -4 }}
                  className="
        relative flex flex-1 flex-col items-center justify-center
        overflow-hidden rounded-3xl
        border border-black/5 dark:border-white/10
        bg-white dark:bg-neutral-900/50
        backdrop-blur-xl
        p-5 text-center
        shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]
        dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]
      "
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.35), transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  <Image
                    src="/hero/return.gif"
                    alt="Easy Returns"
                    width={40}
                    height={40}
                    unoptimized
                    className="mb-4"
                  />
                  <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    Easy Returns
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <div className="relative h-[26.25rem] sm:h-[32.5rem] md:h-[36.25rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[index].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={slides[index].image}
                      alt={slides[index].title}
                      fill
                      sizes="(max-width: 768px) 90vw, 50vw"
                      priority
                      className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute left-4 top-8 rounded-2xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 py-3 shadow-[0_0_40px_rgba(236,72,153,0.35)]"
                  >
                    <p className="text-[10px] font-semibold tracking-wider text-pink-500">
                      STARTING PRICE
                    </p>
                    <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                      ৳ 48,999
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute right-6 top-20 rounded-2xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 py-3 shadow-[0_0_40px_rgba(225,139,148,0.35)]"
                  >
                    <p className="text-[10px] font-semibold tracking-wider text-emerald-500">
                      WARRANTY
                    </p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                      10-Year Compressor
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-14 right-10 rounded-2xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 py-3 shadow-[0_0_40px_rgba(99,102,241,0.35)]"
                  >
                    <p className="text-[10px] font-semibold tracking-wider text-indigo-500">
                      CUSTOMER RATING
                    </p>
                    <p className=" font-semibold text-neutral-900 dark:text-white">
                      ⭐ 4.9 / 5
                    </p>
                  </motion.div>

                  <div className="absolute bottom-14 left-6 text-neutral-600 dark:text-neutral-400">
                    <h3 className="text-lg md:text-xl font-semibold">
                      {slides[index].title}
                    </h3>
                    <p className="text-xs opacity-80">{slides[index].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
    {slides.map((_, i) => {
      const active =
        i === index &&
        (i === 0
          ? "bg-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.9)]"
          : i === 1
          ? "bg-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.9)]"
          : "bg-[#e18b94] shadow-[0_0_16px_rgba(225,139,148,0.9)]");

      return (
        <div
          key={i}
          className={`
            h-1.5 rounded-full transition-all duration-500
            ${i === index ? "w-8" : "w-5 bg-neutral-400/40"}
            ${active ?? ""}
          `}
        />
      );
    })}
  </div>


            </div>
          </div>
        </div>
      </section>
    );
  }
