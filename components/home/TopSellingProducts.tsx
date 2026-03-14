"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown, Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export default function TopSellingProducts() {
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const topSellingProducts = [
    {
      id: 1,
      name: "Walton WSI-18 Inverter AC 1.5 Ton",
      image:
        "https://meemelectronics.com/wp-content/uploads/2025/01/AS18TZ4RMATD01AU-1024x1024.png",
      price: 68999,
      oldPrice: 79999,
      rating: 4.9,
      reviews: 1240,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Gree GS-18 Fairy Split Inverter AC",
      image:
        "https://bestcomputerhub.com/wp-content/uploads/2025/02/smart_cool-2025_2-1000x1000.png-2.webp",
      price: 72499,
      oldPrice: 84999,
      rating: 4.8,
      reviews: 980,
      badge: "Hot Deal",
    },
    {
      id: 3,
      name: "LG DualCool Inverter AC 1.5 Ton",
      image:
        "https://static-01.daraz.com.bd/p/e0ab016ad143eed9124ba0501fac08c4.jpg",
      price: 88999,
      oldPrice: 99999,
      rating: 4.9,
      reviews: 860,
      badge: "Top Rated",
    },
    {
      id: 4,
      name: "Samsung WindFree Inverter AC",
      image:
        "https://cdn.othoba.com/images/thumbs/0654002_vision-15-ton-split-type-ac-non-inverter-bec-3d-elite.jpeg",
      price: 91499,
      oldPrice: 104999,
      rating: 4.8,
      reviews: 740,
      badge: "Popular",
    },
    {
      id: 5,
      name: "Hitachi Kashikoi Inverter AC",
      image:
        "https://www.householdz.com/images/products/singer-air-conditioner-sas12l90lvlgt.jpg",
      price: 82999,
      oldPrice: 94999,
      rating: 4.7,
      reviews: 620,
      badge: "Trending",
    },
    {
      id: 6,
      name: "Panasonic Aero Series Inverter AC",
      image:
        "https://ponnobd.com/public/uploads/products/photos/24L90LVLGT.webp",
      price: 76499,
      oldPrice: 87999,
      rating: 4.8,
      reviews: 710,
      badge: "Top Choice",
    },
    {
      id: 7,
      name: "Haier CleanCool Inverter AC",
      image:
        "https://giftall.s3.amazonaws.com/uploads/images/product/product_6283c50961ef2_1131287993.jpg",
      price: 65499,
      oldPrice: 74999,
      rating: 4.7,
      reviews: 540,
      badge: "Value Pick",
    },
    {
      id: 8,
      name: "Singer EcoCool Inverter AC 1.5 Ton",
      image:
        "https://ministerbd.com/media/catalog/product/cache/4ca62bf5a19099a80c75eced13b95361/1/_/1.5_ton_inv_m18k410gwcp_wht--600x600_1_.jpg",
      price: 61999,
      oldPrice: 69999,
      rating: 4.7,
      reviews: 480,
      badge: "Budget Star",
    },
    {
      id: 9,
      name: "General ASGG Split Inverter AC",
      image:
        "https://iconicmnl.com/wp-content/uploads/2022/09/TCL-FreshIN-Series-air-conditioner.jpg",
      price: 97999,
      oldPrice: 109999,
      rating: 4.9,
      reviews: 390,
      badge: "Premium",
    },
    {
      id: 10,
      name: "Walton WSI-12 Smart Inverter AC",
      image:
        "https://www.estorejamuna.com/uploads/products/906/thumb/11754370521.jpg",
      price: 70499,
      oldPrice: 79999,
      rating: 4.8,
      reviews: 690,
      badge: "Customer Favorite",
    },
    {
      id: 11,
      name: "LG AI Smart Dual Inverter AC",
      image:
        "https://www.estorejamuna.com/uploads/products/822/thumb/11755519683.jpg",
      price: 95499,
      oldPrice: 108999,
      rating: 4.9,
      reviews: 510,
      badge: "AI Powered",
    },
    {
      id: 12,
      name: "Samsung AR18 Digital Inverter AC",
      image:
        "https://brandbazaarbd.com/image/cache/catalog/Hisense/h1.5-1000x1000.jpg.webp",
      price: 88999,
      oldPrice: 99999,
      rating: 4.8,
      reviews: 660,
      badge: "Most Loved",
    },
  ];

  return (
    <section className="relative py-8 overflow-hidden">
      <motion.div
        className="absolute -z-10 left-[-30%] top-[20%] h-130 w-130 rounded-full bg-pink-500/20 blur-[160px]"
        animate={{ x: [0, 120, 0], y: [0, -80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 items-center flex-col flex justify-center ">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Top Selling Products
            </span>
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Most loved ACs with the highest ratings & best value
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topSellingProducts.map((p, i) => {
            const discount = Math.round(
              ((p.oldPrice - p.price) / p.oldPrice) * 100,
            );

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="
                  group rounded-2xl border border-black/5 dark:border-white/10
                  bg-neutral-50 dark:bg-neutral-900/50
                  backdrop-blur-xl overflow-hidden
                  shadow-[0_16px_48px_-28px_rgba(0,0,0,0.35)]
                "
              >
                <div className="relative h-64 bg-white w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#e18b94] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_24px_rgba(225,139,148,0.55)]">
                    {discount}% OFF
                  </span>

                  <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    {p.badge}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                    {p.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {p.rating} ({p.reviews})
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">
                        ৳ {p.price.toLocaleString()}
                      </span>
                      <span className="text-sm line-through text-neutral-400">
                        ৳ {p.oldPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-full p-2 bg-white shadow cursor-pointer transition hover:scale-105"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="h-4 w-4 text-neutral-600" />
                      </button>

                      <button
                        className="rounded-full p-2 bg-white shadow cursor-pointer transition hover:scale-105"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/products/${slugify(p.name)}`}
                  className="
                    w-full block text-center cursor-pointer rounded-b-xl py-2.5 text-sm font-semibold text-indigo-600 bg-white shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all duration-300 hover:font-bold hover:shadow-[0_0_48px_rgba(99,102,241,0.65)] hover:-translate-y-0.5 
                  "
                >
                  View Details
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="
                    group inline-flex items-center gap-2
                    rounded-full px-8 py-3
                    bg-indigo-600 text-white text-sm font-semibold
                    shadow-[0_0_40px_rgba(99,102,241,0.45)]
                    transition-all duration-300
                    hover:bg-indigo-500  cursor-pointer  hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]
                "
          >
            Show More
            <ArrowDown className="h-4 w-4 transition group-hover:translate-y-1" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
