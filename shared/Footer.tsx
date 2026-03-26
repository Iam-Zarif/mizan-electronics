"use client";

import Link from "next/link";
import { FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import BrandLogo from "@/components/shared/BrandLogo";

const Footer = () => {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
    return null;
  }
  return (
    <footer className="relative pt-8 lg:pt-14 overflow-hidden w-full">
      <div
        className="absolute -z-10 right-[-25%] bottom-[-30%] h-130 w-130 rounded-full bg-[#e18b94]/25 blur-[180px]"
      />

      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div
          className="
            rounded-[2.5rem]
            border border-black/5 dark:border-white/10
            bg-white/70 dark:bg-black/50
            backdrop-blur-2xl
            shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)]
            px-8 pt-14
          "
        >
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
                <BrandLogo size={52} />
                <span className="text-center text-2xl font-extrabold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent md:text-left">
                  Mizan AC Servicing
                </span>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {locale === "en"
                  ? "All-in-one AC care—install, deep clean, gas, repair, shifting & spares across Dhaka."
                  : "সব এসি সেবার এক ঠিকানা—ইনস্টল, ডিপ ক্লিন, গ্যাস, রিপেয়ার, শিফটিং ও স্পেয়ার।"}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                {t("footer.navigation")}
              </p>
              <ul className="space-y-3 text-sm font-medium">
                <FooterLink href="/" label={t("nav.home")} />
                <FooterLink href="/services" label={t("nav.services")} />
                <FooterLink href="/auth/login" label={t("nav.login")} />
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                {locale === "en" ? "Service Categories" : "সার্ভিস ক্যাটাগরি"}
              </p>
              <ul className="space-y-3 text-sm font-medium">
                <FooterLink href="/services/category/cleaning-maintenance" label="এসি পরিষ্কার ও রক্ষণাবেক্ষণ" />
                <FooterLink href="/services/category/installation" label="এসি ইনস্টলেশন ও রি-ইনস্টলেশন" />
                <FooterLink href="/services/category/repair" label="এসি মেরামত" />
                <FooterLink href="/services/category/gas" label="এসি গ্যাস ও কুলিং সিস্টেম" />
                <FooterLink href="/services/category/shifting" label="এসি শিফটিং ও আনইনস্টল" />
                <FooterLink href="/services/category/spares" label="এসি কম্প্রেসর ও স্পেয়ার পার্টস" />
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                {t("footer.follow")}
              </p>
              <div className="flex items-center gap-5">
                <SocialIcon
                  href="https://www.facebook.com/mizanACservicing"
                  icon={<FaFacebookF />}
                  color="text-blue-600"
                  label="Follow on Facebook"
                />

                <SocialIcon
                  href="https://www.youtube.com/@MizanACservicing"
                  icon={<FaYoutube />}
                  color="text-red-500"
                  label="Watch on YouTube"
                />

                <SocialIcon
                  href="https://wa.me/8801949397234"
                  icon={<FaWhatsapp />}
                  color="text-green-500"
                  label="Chat on WhatsApp"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-black/5 py-3 text-center text-xs tracking-wide text-neutral-600 dark:border-white/10 dark:text-neutral-300">
            © {new Date().getFullYear()} Mizan AC Servicing. {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="
        inline-block
        bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500
        bg-size-[0%_2px]
        bg-bottom-left bg-no-repeat
        transition-all duration-500
        hover:bg-size-[100%_2px]
        hover:text-indigo-500
      "
    >
      {label}
    </Link>
  </li>
);

const SocialIcon = ({
  href,
  icon,
  color,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}) => (
  <Link
    href={href}
    target="_blank"
    aria-label={label}
    title={label}
    className={`
      group relative flex h-11 w-11 items-center justify-center rounded-full
      ${color}
      transition-all duration-300
      hover:-translate-y-0.5 hover:scale-105
      shadow-[0_2px_6px_rgba(0,0,0,0.15)]
      hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
    `}
  >
    <span className="text-[18px] drop-shadow-sm group-hover:drop-shadow-md">
      {icon}
    </span>
    <span className="sr-only">{label}</span>
  </Link>
);
