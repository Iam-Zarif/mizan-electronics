"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Home,
  Building2,
  Pencil,
  CheckCircle,
  Check,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export function ProfileDetails() {
  const [defaultAddress, setDefaultAddress] = useState<"home" | "office">(
    "home",
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 shadow"
    >
      <div>
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Image
                src="https://i.ibb.co/67fpNVMH/profile.jpg"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full object-cover cursor-pointer"
              />

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Mostofa Fatin
                  </h2>

                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                </div>

                <p className="text-sm text-neutral-500">
                  mostofafatin.developer@gmail.com
                </p>
              </div>
            </div>
            <InfoInline
              icon={
                <div className="flex items-center gap-2">
                  <Image
                    src="https://cdn-icons-png.freepik.com/256/2496/2496112.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="w-5 rounded-xl"
                  />
                  <span className="h-4 w-px bg-neutral-300" />
                  <Phone size={14} />
                </div>
              }
              label="Phone"
              value="+880 1XXXXXXXXX"
            />
          </div>
          <button className="flex cursor-pointer items-center gap-1 rounded-full border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition">
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <AddressCard
          title="Home Address"
          icon={<Home size={18} />}
          address="House 12, Road 7, Mirpur, Dhaka"
          phone="+880 1XXXXXXXXX"
          payments={["bkash", "nagad"]}
          selected={defaultAddress === "home"}
          onSelect={() => setDefaultAddress("home")}
        />

        <AddressCard
          title="Office / Business Address"
          icon={<Building2 size={18} />}
          address="Level 4, IDB Bhaban, Agargaon, Dhaka"
          phone="+880 1XXXXXXXXX"
          payments={["bkash"]}
          selected={defaultAddress === "office"}
          onSelect={() => setDefaultAddress("office")}
        />
      </div>
    </motion.div>
  );
}

function InfoInline({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
      <span className="text-indigo-500">{icon}</span>
      <p className="text-xs text-neutral-500">{label}:</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function AddressCard({
  title,
  icon,
  address,
  phone,
  payments,
  selected,
  onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  address: string;
  phone: string;
  payments: ("bkash" | "nagad")[];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl border py-4 pl-4 pr-12 transition ${
        selected
          ? "border-indigo-600 bg-indigo-50"
          : "border-neutral-200 bg-white hover:bg-neutral-50"
      }`}
    >
      {selected && (
        <span className="absolute right-4 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
          <Check size={14} className="text-white" />
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-indigo-600">{icon}</span>

          <div>
            <p className="font-semibold text-sm text-neutral-900">{title}</p>
            <p className="text-sm text-neutral-600">{address}</p>
            <p className="mt-0.5 text-xs text-neutral-500">Phone: {phone}</p>

            <div className="mt-2 flex gap-2">
              {payments.includes("bkash") && (
                <span className="inline-flex items-center gap-1 rounded-md bg-pink-100 px-2 py-0.5 text-[11px] font-semibold text-pink-600">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe49-EQh6sSkNAkHNzGp9SDvaAswt6zw0gQ&s"
                    alt="bKash"
                    width={14}
                    height={14}
                    className="h-3.5 w-auto"
                  />
                  bKash
                </span>
              )}

              {payments.includes("nagad") && (
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3C4scU6yzxmjQh9dC4-J-xpXqB5m3taH5bA&s"
                    alt="Nagad"
                    width={14}
                    height={14}
                    className="h-3.5 w-auto"
                  />
                  Nagad
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer rounded-full border border-indigo-200 p-2 text-indigo-600 hover:bg-indigo-50 transition"
        >
          <Pencil size={14} />
        </button>
      </div>

      {selected && (
        <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600">
          <CheckCircle size={12} />
          Default Shipping Address
        </p>
      )}
    </div>
  );
}
