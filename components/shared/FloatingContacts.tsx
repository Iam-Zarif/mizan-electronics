"use client";

import { useProvider } from "@/Providers/AuthProviders";
import { trackContactClick } from "@/lib/contact-tracking";
import { FaWhatsapp, FaFacebookMessenger, FaPhoneAlt } from "react-icons/fa";

const FloatingContacts = () => {
  const { user } = useProvider();

  const handleContactClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    input: {
      channel: "phone" | "whatsapp" | "messenger";
      targetValue: string;
      href: string;
      newTab?: boolean;
    },
  ) => {
    event.preventDefault();

    void trackContactClick({
      source: "floating",
      channel: input.channel,
      targetValue: input.targetValue,
      user,
    });

    if (input.newTab) {
      window.open(input.href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = input.href;
  };

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-4 md:bottom-6 md:right-6">
      <a
        href="https://wa.me/8801949397234"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) =>
          void handleContactClick(event, {
            channel: "whatsapp",
            targetValue: "+8801949397234",
            href: "https://wa.me/8801949397234",
            newTab: true,
          })
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_25px_rgba(34,197,94,0.8)]  hover:scale-110 transition"
      >
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-40 blur-xl"></span>
        <FaWhatsapp className="relative text-2xl" />
      </a>

      <a
        href="tel:+8801949397234"
        onClick={(event) =>
          void handleContactClick(event, {
            channel: "phone",
            targetValue: "+8801949397234",
            href: "tel:+8801949397234",
          })
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.8)]  hover:scale-110 transition"
      >
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-40 blur-xl"></span>
        <FaPhoneAlt className="relative text-xl" />
      </a>

      <a
        href="https://m.me/mizanACservicing"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) =>
          void handleContactClick(event, {
            channel: "messenger",
            targetValue: "mizanACservicing",
            href: "https://m.me/mizanACservicing",
            newTab: true,
          })
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.8)]  hover:scale-110 transition"
      >
        <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-40 blur-xl"></span>
        <FaFacebookMessenger className="relative text-2xl" />
      </a>
    </div>
  );
};

export default FloatingContacts;
