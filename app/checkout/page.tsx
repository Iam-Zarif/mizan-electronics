"use client";

import { useState } from "react";

export default function CheckoutPage() {
  return (
    <section className="pt-[7.5rem] pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-xl md:text-3xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-bold text-lg">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  placeholder="Full Name"
                />
                <input
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  placeholder="Phone Number"
                />
                <input
                  className="md:col-span-2 w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  placeholder="Email (optional)"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-bold text-lg">
                Delivery Address
              </h2>

              <div className="space-y-4">
                <input
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  placeholder="Full Address"
                />
                <input
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  placeholder="City / Area"
                />
                <textarea
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none"
                  rows={3}
                  placeholder="Delivery notes (optional)"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6">
              <h2 className="mb-4 font-bold text-lg">
                Payment Method
              </h2>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" defaultChecked />
                <span className="text-sm font-semibold">
                  Cash on Delivery
                </span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 h-fit">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold">৳ 143,400</span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-semibold">৳ 1,500</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-indigo-600">৳ 144,900</span>
              </div>
            </div>

            <button
              className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
