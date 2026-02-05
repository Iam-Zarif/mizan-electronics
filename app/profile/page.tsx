"use client";

import { useState } from "react";
import { User, Package } from "lucide-react";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import ProfileOrders from "@/components/profile/ProfileOrders";

const TABS = ["Profile", "Orders"] as const;

export default function ProfilePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  return (
    <section className="pt-[7.5rem] pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-10 text-3xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Account
        </h1>

        <div className="mb-4 flex gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`cursor-pointer flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition
                ${
                  tab === t
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white text-neutral-700 hover:bg-neutral-100"
                }
              `}
            >
              {t === "Profile" ? <User size={16} /> : <Package size={16} />}
              {t}
            </button>
          ))}
        </div>

        {tab === "Profile" && <ProfileDetails />}
        {tab === "Orders" && <ProfileOrders />}
      </div>
    </section>
  );
}
