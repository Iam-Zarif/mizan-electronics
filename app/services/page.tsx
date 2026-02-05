"use client";

import { motion } from "motion/react";
import {
  Wrench,
  Wind,
  ShieldCheck,
  Thermometer,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    title: "AC Installation",
    icon: Wrench,
    price: "৳ 2,500 – ৳ 4,500",
    duration: "2–3 Hours",
    features: [
      "Indoor & outdoor unit setup",
      "Copper pipe fitting",
      "Gas pressure check",
      "Cooling test & demo",
    ],
  },
  {
    title: "AC Gas Refill",
    icon: Wind,
    price: "৳ 3,200 – ৳ 6,000",
    duration: "1–2 Hours",
    features: [
      "Leak detection",
      "R32 / R410 gas refill",
      "Cooling optimization",
      "Performance testing",
    ],
  },
  {
    title: "Annual AC Servicing",
    icon: ShieldCheck,
    price: "৳ 1,800",
    duration: "1 Hour",
    features: [
      "Indoor deep cleaning",
      "Outdoor unit wash",
      "Drain & filter cleanup",
      "Health & cooling check",
    ],
  },
  {
    title: "Cooling Problem Fix",
    icon: Thermometer,
    price: "From ৳ 1,200",
    duration: "Depends on issue",
    features: [
      "Low cooling diagnosis",
      "Airflow problem fix",
      "Sensor check",
      "Gas & PCB inspection",
    ],
  },
  {
    title: "AC Repair",
    icon: Zap,
    price: "From ৳ 900",
    duration: "Depends on damage",
    features: [
      "PCB repair",
      "Fan motor replacement",
      "Capacitor & sensor fix",
      "Power issue solving",
    ],
  },
];

export default function ServicesPage() {
  return (
    <section className="relative pt-[7.5rem] pb-10">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
            <Zap className="h-4 w-4" />
            Professional AC Services
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Reliable <span className="text-indigo-500">AC Services</span> You
            Can Trust
          </h1>

          <p className="mt-4 text-neutral-600">
            Expert technicians, transparent pricing, and same-day service
            availability across Dhaka. Pay partially online or Cash on Delivery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-neutral-200 bg-white p-6 transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="text-sm text-neutral-500">
                        {service.duration}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {service.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <CheckCircle size={14} className="text-indigo-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-xs text-neutral-500">Starting Price</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {service.price}
                    </p>
                  </div>

                  <Button className="group cursor-pointer">
                    Book Service
                    <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-12 overflow-hidden rounded-3xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://mybayutcdn.bayut.com/mybayut/wp-content/uploads/Top-AC-Maintenance-Cleaning-Companies-in-Dubai-Cover-27-07-2021.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 text-white">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                <Clock size={14} />
                Emergency Support
              </span>

              <h3 className="mt-4 text-3xl font-extrabold leading-tight">
                Same-Day AC Service
                <br />
                <span className="text-white/90">Across Dhaka City</span>
              </h3>

              <p className="mt-4 text-sm text-white/90">
                Cooling failure? Power issue? Our certified technicians are
                ready for urgent installations & repairs — pay partially online
                or cash on delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group cursor-pointer">
                Call for Emergency
                <Clock className="ml-2 h-4 w-4 text-white" />
              </Button>

              <Button
                size="lg"
                className="
      cursor-pointer
      bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
      text-white
      font-extrabold tracking-wide
      shadow-xl
      hover:opacity-90
      active:scale-[0.98]
      transition
    "
              >
                Book Service Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
