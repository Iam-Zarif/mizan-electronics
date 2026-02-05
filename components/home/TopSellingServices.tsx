"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Wind,
  ShieldCheck,
  Thermometer,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "AC Installation",
    desc: "Professional wall & split AC installation",
    icon: Wrench,
    price: "From ৳ 2,500",
    glow: "shadow-[0_0_40px_rgba(99,102,241,0.35)]",
  },
  {
    title: "AC Gas Refill",
    desc: "Cooling efficiency restoration service",
    icon: Wind,
    price: "From ৳ 3,200",
    glow: "shadow-[0_0_40px_rgba(236,72,153,0.35)]",
  },
  {
    title: "Annual Servicing",
    desc: "Complete cleaning & performance check",
    icon: ShieldCheck,
    price: "From ৳ 1,800",
    glow: "shadow-[0_0_40px_rgba(225,139,148,0.35)]",
  },
  {
    title: "Cooling Issue Fix",
    desc: "Low cooling & airflow problem solution",
    icon: Thermometer,
    price: "From ৳ 1,200",
    glow: "shadow-[0_0_40px_rgba(99,102,241,0.35)]",
  },
  {
    title: "AC Repair",
    desc: "PCB, fan motor & sensor repair",
    icon: Zap,
    price: "From ৳ 900",
    glow: "shadow-[0_0_40px_rgba(236,72,153,0.35)]",
  },
  {
    title: "Emergency Support",
    desc: "Same-day service & urgent fixes",
    icon: ShieldCheck,
    price: "24/7 Available",
    glow: "shadow-[0_0_40px_rgba(225,139,148,0.35)]",
  },
];

export default function TopSellingServices() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
              <Zap className="h-4 w-4" />
              Most Requested Services
            </span>
            <h2 className="text-3xl mt-2 md:text-4xl font-extrabold">
              Top Selling <span className="text-indigo-500">AC Services</span>
            </h2>
          </div>

          <Link href="/services" className="w-full sm:w-auto">
            <Button size="lg" className="group w-full cursor-pointer sm:w-auto">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`
                  relative rounded-3xl p-6
                  bg-white/70 dark:bg-neutral-900/50
                  backdrop-blur-xl
                  border border-black/5 dark:border-white/10
                  ${service.glow}
                `}
              >
                <div className="absolute right-4 top-4 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold text-indigo-500">
                  Top Seller
                </div>

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mb-1 text-lg font-semibold">{service.title}</h3>

                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {service.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600">
                    {service.price}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full bg-indigo-500/10 cursor-pointer p-2 text-indigo-600 hover:bg-indigo-500 hover:text-white transition"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
