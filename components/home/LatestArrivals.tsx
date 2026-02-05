"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { memo, useState } from "react";
import { Star, Zap, ShieldCheck, ArrowDown, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "Walton WSI-18 Inverter AC 1.5 Ton",
    image:
      "https://meemelectronics.com/wp-content/uploads/2025/01/AS18TZ4RMATD01AU-1024x1024.png",
    price: "৳ 68,900",
    rating: "4.7",
  },
  {
    name: "Gree GS-18 Fairy Split Inverter AC",
    image:
      "https://bestcomputerhub.com/wp-content/uploads/2025/02/smart_cool-2025_2-1000x1000.png-2.webp",
    price: "৳ 74,500",
    rating: "4.8",
  },
  {
    name: "Samsung AR18 Digital Inverter AC",
    image:
      "https://brandbazaarbd.com/image/cache/catalog/Hisense/h1.5-1000x1000.jpg.webp",
    price: "৳ 89,900",
    rating: "4.9",
  },
  {
    name: "LG DualCool Inverter AC 1.5 Ton",
    image:
      "https://static-01.daraz.com.bd/p/e0ab016ad143eed9124ba0501fac08c4.jpg",
    price: "৳ 92,500",
    rating: "4.8",
  },
  {
    name: "Haier CleanCool Inverter AC",
    image:
      "https://giftall.s3.amazonaws.com/uploads/images/product/product_6283c50961ef2_1131287993.jpg",
    price: "৳ 70,900",
    rating: "4.6",
  },
  {
    name: "Singer EcoCool Inverter AC 1.5 Ton",
    image:
      "https://ministerbd.com/media/catalog/product/cache/4ca62bf5a19099a80c75eced13b95361/1/_/1.5_ton_inv_m18k410gwcp_wht--600x600_1_.jpg",
    price: "৳ 69,500",
    rating: "4.5",
  },
  {
    name: "Panasonic Aero Series Inverter AC",
    image: "https://ponnobd.com/public/uploads/products/photos/24L90LVLGT.webp",
    price: "৳ 96,000",
    rating: "4.8",
  },
  {
    name: "Hitachi Kashikoi Inverter AC",
    image:
      "https://www.householdz.com/images/products/singer-air-conditioner-sas12l90lvlgt.jpg",
    price: "৳ 98,500",
    rating: "4.9",
  },
  {
    name: "General ASGG Split Inverter AC",
    image:
      "https://iconicmnl.com/wp-content/uploads/2022/09/TCL-FreshIN-Series-air-conditioner.jpg",
    price: "৳ 1,04,000",
    rating: "4.9",
  },
  {
    name: "Sharp PlasmaCluster Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/909/thumb/11755584095.jpg",
    price: "৳ 87,900",
    rating: "4.7",
  },
  {
    name: "Walton WSI-12 Smart Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/906/thumb/11754370521.jpg",
    price: "৳ 62,900",
    rating: "4.6",
  },
  {
    name: "Gree GS-12 Pular Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/455/thumb/11737522346.jpg",
    price: "৳ 66,500",
    rating: "4.7",
  },
  {
    name: "Samsung WindFree Inverter AC",
    image:
      "https://cdn.othoba.com/images/thumbs/0654002_vision-15-ton-split-type-ac-non-inverter-bec-3d-elite.jpeg",
    price: "৳ 1,09,900",
    rating: "4.9",
  },
  {
    name: "LG AI Smart Dual Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/822/thumb/11755519683.jpg",
    price: "৳ 1,02,500",
    rating: "4.8",
  },
  {
    name: "Haier TurboCool Inverter AC",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/1/QS/HT/JR/43332590/daikin-1-5-ton-3-star-non-inverter-split-ac-500x500.jpg",
    price: "৳ 72,000",
    rating: "4.6",
  },
  {
    name: "Singer SmartCool Pro Inverter AC",
    image: "https://m.media-amazon.com/images/I/81OAMDVERhL.jpg",
    price: "৳ 71,500",
    rating: "4.5",
  },
  {
    name: "Panasonic Nanoe-X Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/822/thumb/11755519683.jpg",
    price: "৳ 1,05,000",
    rating: "4.9",
  },
  {
    name: "Hitachi AirHome Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/906/thumb/11754370521.jpg",
    price: "৳ 94,500",
    rating: "4.8",
  },
  {
    name: "General CoolPlus Inverter AC",
    image:
      "https://www.estorejamuna.com/uploads/products/455/thumb/11737522346.jpg",
    price: "৳ 99,900",
    rating: "4.8",
  },
  {
    name: "Sharp Eco Inverter AC 1.5 Ton",
    image:
      "https://iconicmnl.com/wp-content/uploads/2022/09/TCL-FreshIN-Series-air-conditioner.jpg",
    price: "৳ 85,000",
    rating: "4.7",
  },
];

function LatestArrivals() {
  const [visible, setVisible] = useState(12);
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <section className="relative py-20 overflow-hidden">
      <motion.div
        className="absolute -z-10 right-[-25%] top-[15%] h-[32.5rem] w-[32.5rem] rounded-full bg-indigo-500/20 blur-[160px]"
        animate={{ x: [0, -120, 0], y: [0, 80, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Latest Arrivals
            </span>
          </h1>
          <p className="mt-3 text-neutral-500">
            Brand new inverter ACs with modern cooling technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, visible).map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -8 }}
              className="
                      group rounded-2xl border border-black/5 dark:border-white/10
                      bg-neutral-50 dark:bg-neutral-900/50
                      backdrop-blur-xl overflow-hidden
                      shadow-[0_16px_48px_-28px_rgba(0,0,0,0.35)]
                  "
            >
              <div className="relative  h-64 bg-white  w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain  w-full  transition-transform duration-500 group-hover:scale-110"
                />
              </div>

        <div className="p-4">
  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
    {product.name}
  </h3>

  <div className="mt-1.5 flex items-center gap-1 text-yellow-500">
    <Star className="h-4 w-4 fill-yellow-500" />
    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
      {product.rating}
    </span>
  </div>

  <div className="mt-2.5 flex items-center justify-between">
    <p className="text-lg font-bold text-neutral-900 dark:text-white">
      {product.price}
    </p>

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

  <div className="mt-3 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
    <span className="flex items-center gap-1">
      <Zap className="h-3 w-3 text-indigo-500" /> Inverter
    </span>
    <span className="flex items-center gap-1">
      <ShieldCheck className="h-3 w-3 text-indigo-500" /> Warranty
    </span>
  </div>
</div>


              <Link
                href={`/products/${slugify(product.name)}`}
                className="
      w-full block text-center cursor-pointer rounded-b-xl py-2.5 text-sm font-semibold
      text-indigo-600 bg-white
      shadow-[0_0_12px_rgba(99,102,241,0.25)]
      transition-all duration-300
      hover:font-bold hover:shadow-[0_0_48px_rgba(99,102,241,0.65)]
      hover:-translate-y-0.5
    "
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>

        {visible < products.length && (
          <div className="mt-14 flex justify-center">
            <motion.button
              onClick={() =>
                setVisible((p) => Math.min(p + 4, products.length))
              }
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
        )}
      </div>
    </section>
  );
}

export default memo(LatestArrivals);
