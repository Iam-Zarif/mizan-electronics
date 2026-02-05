"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

const wishlist = [
  {
    name: "Walton WSI-18 Inverter AC 1.5 Ton",
    image:
      "https://meemelectronics.com/wp-content/uploads/2025/01/AS18TZ4RMATD01AU-1024x1024.png",
    price: 68900,
    rating: 4.7,
  },
  {
    name: "Gree GS-18 Fairy Inverter AC",
    image:
      "https://bestcomputerhub.com/wp-content/uploads/2025/02/smart_cool-2025_2-1000x1000.png-2.webp",
    price: 74500,
    rating: 4.8,
  },
  {
    name: "Samsung Digital Inverter AC",
    image:
      "https://brandbazaarbd.com/image/cache/catalog/Hisense/h1.5-1000x1000.jpg.webp",
    price: 89900,
    rating: 4.9,
  },
  {
    name: "LG DualCool Inverter AC",
    image:
      "https://static-01.daraz.com.bd/p/e0ab016ad143eed9124ba0501fac08c4.jpg",
    price: 92500,
    rating: 4.8,
  },
];

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function WishlistPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const total = wishlist.length;

  const toggleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="pt-[7.5rem] pb-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center w-full">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Wishlist
            </h1>
            <p className="mt-1 text-neutral-500">
              You have {total} product{total > 1 ? "s" : ""} saved
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              <ShoppingCart size={16} />
              Add to cart
            </button>

            <button
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-400 transition"
            >
              <Trash2 size={16} />
              Remove Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="
                group rounded-2xl border border-black/5
                bg-neutral-50 overflow-hidden
                shadow-[0_16px_48px_-28px_rgba(0,0,0,0.35)]
              "
            >
              <div className="relative h-56 bg-white">
                <input
                  type="checkbox"
                  checked={selected.includes(i)}
                  onChange={() => toggleSelect(i)}
                  className="absolute top-3 left-3 z-10 cursor-pointer h-4 w-4 accent-indigo-600"
                />

                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
                  {p.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span className="text-xs font-medium text-neutral-700">
                    {p.rating}
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold text-indigo-600">
                  ৳ {p.price.toLocaleString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>

                  <Link
                    href={`/products/${slugify(p.name)}`}
                    className="cursor-pointer flex-1 text-center rounded-lg py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
