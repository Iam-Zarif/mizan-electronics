"use client";

import { JSX, useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

type OrderTab = "Ongoing" | "Previous" | "Cancelled";

type OnlinePayment = {
  method: "bKash" | "Nagad";
  amount: string;
  label?: string;
};

type CODPayment = {
  amount: string;
};

type PaymentInfo = {
  online?: OnlinePayment;
  cod?: CODPayment;
};

type Order = {
  id: string;
  date: string;
  total: string;
  status: "Processing" | "Delivered" | "Cancelled";
  items: string;
  payment: PaymentInfo;
};

const ORDER_TABS: OrderTab[] = ["Ongoing", "Previous", "Cancelled"];

const orders: Record<OrderTab, Order[]> = {
  Ongoing: [
    {
      id: "#ORD-1023",
      date: "Jan 22, 2026",
      total: "৳ 74,500",
      status: "Processing",
      items: "AC • Refrigerator",
      payment: {
        online: { method: "bKash", amount: "৳ 37,250" },
        cod: { amount: "৳ 37,250" },
      },
    },
  ],
  Previous: [
    {
      id: "#ORD-0911",
      date: "Dec 12, 2025",
      total: "৳ 68,900",
      status: "Delivered",
      items: "Washing Machine",
      payment: {
        online: {
          method: "Nagad",
          amount: "৳ 120",
          label: "Delivery Charge",
        },
        cod: { amount: "৳ 68,780" },
      },
    },
  ],
  Cancelled: [
    {
      id: "#ORD-0834",
      date: "Nov 5, 2025",
      total: "৳ 92,500",
      status: "Cancelled",
      items: "LED TV",
      payment: {
        online: { method: "bKash", amount: "৳ 92,500" },
      },
    },
  ],
};

export default function ProfileOrders() {
  const [orderTab, setOrderTab] = useState<OrderTab>("Ongoing");

  return (
    <div className="">
      <div className="mb-2 rounded-2xl border border-neutral-200 bg-white p-1">
        <div className="flex gap-2">
          {ORDER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setOrderTab(t)}
              className={`cursor-pointer flex-1 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                orderTab === t
                  ? "bg-indigo-600 text-white shadow"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {t}
              <span className="ml-1 text-[10px] opacity-80">
                ({orders[t].length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {orders[orderTab].map((o) => (
          <motion.div
            key={o.id}
            whileHover={{ y: -3 }}
            className="cursor-pointer rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-2">
                  <Package size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {o.id}
                  </p>
                  <p className="text-xs text-neutral-500">{o.date}</p>
                </div>
              </div>
              <OrderStatus status={o.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-neutral-500">Items</p>
                <p className="font-medium">{o.items}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Payment</p>
                <div className="mt-1 space-y-1">
                  {o.payment.online && (
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Image
                        src={
                          o.payment.online.method === "bKash"
                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe49-EQh6sSkNAkHNzGp9SDvaAswt6zw0gQ&s"
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3C4scU6yzxmjQh9dC4-J-xpXqB5m3taH5bA&s"
                        }
                        alt={o.payment.online.method}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      <span>
                        {o.payment.online.amount}
                        {o.payment.online.label && (
                          <span className="ml-1 text-xs text-neutral-500">
                            ({o.payment.online.label})
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {o.payment.cod && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <Package size={14} />
                      Cash on Delivery — {o.payment.cod.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-lg font-bold text-indigo-600">{o.total}</p>
              <button className="cursor-pointer flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition">
                View Details
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrderStatus({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], JSX.Element> = {
    Processing: (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        <Clock size={12} /> Processing
      </span>
    ),
    Delivered: (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <CheckCircle size={12} /> Delivered
      </span>
    ),
    Cancelled: (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <XCircle size={12} /> Cancelled
      </span>
    ),
  };

  return map[status];
}
