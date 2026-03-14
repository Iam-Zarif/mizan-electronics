"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import { MdHomeRepairService, MdOutlineHomeRepairService } from "react-icons/md";

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-1 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto w-full px-2 ">
        <div className="flex  justify-between rounded-full  bg-white/90 border dark:border-neutral-200 border-neutral-100 px-6 w-full pt-3 pb-1 shadow-xl backdrop-blur-xl dark:bg-black/90">
          <Item
            href="/"
            label="হোম"
            active={pathname === "/"}
            icon={<HiOutlineHome  className="text-lg"/>}
            iconActive={<HiHome  className="text-lg"/>}
          />
          <Item
            href="/services"
            label="সার্ভিস"
            active={pathname === "/services"}
            icon={<MdOutlineHomeRepairService className="text-lg" />}
            iconActive={<MdHomeRepairService className="text-lg" />}
          />
          <Item
            href="/contact"
            label="যোগাযোগ"
            active={pathname === "/contact"}
            icon={<FiPhone  className="text-lg"/>}
            iconActive={<FaPhoneAlt  className="text-lg"/>}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;

const Item = ({
  href,
  label,
  icon,
  iconActive,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
  active: boolean;
}) => (
  <Link
    href={href}
    className={`flex flex-1 flex-col items-center gap-1 transition ${
      active
        ? "font-semibold text-black dark:text-white"
        : "text-gray-600 dark:text-gray-400"
    }`}
  >
    <span className="text-2xl">{active ? iconActive : icon}</span>
    <span className="text-[11px]">{label}</span>
  </Link>
);
