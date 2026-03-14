"use client";

import { useState } from "react";
import { User, Package, Heart, ShoppingCart } from "lucide-react";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileWishlist from "@/components/profile/ProfileWishlist";
import ProfileCart from "@/components/profile/ProfileCart";

const TABS = {
  Profile: {
    icon: User,
    component: ProfileDetails,
  },
  Orders: {
    icon: Package,
    component: ProfileOrders,
  },
  Wishlist: {
    icon: Heart,
    component: ProfileWishlist,
  },
  Cart: {
    icon: ShoppingCart,
    component: ProfileCart,
  },
} as const;

type TabType = keyof typeof TABS;

export default function ProfilePage() {
  const [tab, setTab] = useState<TabType>("Profile");

  const ActiveComponent = TABS[tab].component;

  return (
    <section className="pt-25 pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-6 text-3xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Account
        </h1>

        <div className="mb-6 flex flex-wrap gap-4">
          {Object.entries(TABS).map(([key, value]) => {
            const Icon = value.icon;
            const isActive = tab === key;

            return (
              <button
                key={key}
                onClick={() => setTab(key as TabType)}
                className={`flex items-center gap-2 cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }
                `}
              >
                <Icon size={16} />
                {key}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <ActiveComponent />
        </div>
      </div>
    </section>
  );
}
