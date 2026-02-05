"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

const cart = [
  {
    name: "Walton WSI-18 Inverter AC 1.5 Ton",
    image:
      "https://meemelectronics.com/wp-content/uploads/2025/01/AS18TZ4RMATD01AU-1024x1024.png",
    price: 68900,
    quantity: 1,
  },
  {
    name: "Gree GS-18 Fairy Inverter AC",
    image:
      "https://bestcomputerhub.com/wp-content/uploads/2025/02/smart_cool-2025_2-1000x1000.png-2.webp",
    price: 74500,
    quantity: 1,
  },
];

export default function CartPage() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 1500;
  const total = subtotal + shipping;

  return (
    <section className="pt-[7.5rem] pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-xl md:text-3xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-indigo-600">
                      ৳ {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                      <button className="cursor-pointer">
                        <Minus size={16} />
                      </button>

                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button className="cursor-pointer">
                        <Plus size={16} />
                      </button>
                    </div>

                    <button className="cursor-pointer text-red-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-block cursor-pointer text-sm font-semibold text-indigo-600 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-semibold">
                  ৳ {shipping.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-indigo-600">
                  ৳ {total.toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
