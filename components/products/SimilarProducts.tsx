"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Star, Zap, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

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


const PER_VIEW = 4;

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const SimilarProducts = () => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(products.length / PER_VIEW);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [totalPages]);

  return (
    <section className="mt-24">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-extrabold text-2xl tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Similar Products
        </h2>

        <div className="flex gap-2">
          <button
            disabled={!canPrev}
            onClick={() => setPage((p) => p - 1)}
            className={`rounded-full p-2 shadow transition cursor-pointer bg-white
              ${!canPrev ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-100"}
            `}
          >
            <ChevronLeft />
          </button>

          <button
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className={`rounded-full p-2 shadow transition cursor-pointer bg-white
              ${!canNext ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-100"}
            `}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${page * 100}%` }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="flex"
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="grid w-full shrink-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products
                .slice(
                  pageIndex * PER_VIEW,
                  pageIndex * PER_VIEW + PER_VIEW
                )
                .map((product, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    className="group rounded-2xl border border-black/5 bg-neutral-50 overflow-hidden shadow-[0_16px_48px_-28px_rgba(0,0,0,0.35)]"
                  >
                    <div className="relative h-56 bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {product.name}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span className="text-xs font-medium text-neutral-700">
                          {product.rating}
                        </span>
                      </div>

                      <p className="mt-2.5 text-lg font-bold text-neutral-900">
                        {product.price}
                      </p>

                      <div className="mt-3 flex gap-3 text-xs text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-indigo-500" /> Inverter
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-indigo-500" />
                          Warranty
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/products/${slugify(product.name)}`}
                      className="block w-full cursor-pointer rounded-b-xl py-2.5 text-center text-sm font-semibold text-indigo-600 bg-white shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all duration-300 hover:font-bold hover:shadow-[0_0_48px_rgba(99,102,241,0.65)] hover:-translate-y-0.5"
                    >
                      View Details
                    </Link>
                  </motion.div>
                ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SimilarProducts;
