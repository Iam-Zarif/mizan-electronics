import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import FloatingContacts from "@/components/shared/FloatingContacts";
import FirebaseAnalytics from "@/components/shared/FirebaseAnalytics";
import { PendingReviewPrompt } from "@/components/shared/PendingReviewPrompt";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/Providers/AuthProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const socialPreviewImage =
  "https://res.cloudinary.com/dj5olrziv/image/upload/v1773778353/mizan_ac_services_update_pxplj5.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://mizan-ac-servicing.vercel.app"),
  title: {
    default: "Mizan AC Servicing",
    template: "%s | Mizan AC Servicing",
  },
  description:
    "Mizan AC Servicing in Dhaka provides AC servicing, AC repair, AC installation, gas refill, leak fixing, cleaning, maintenance, compressor and spare parts support across Dhaka.",
  keywords: [
    "Mizan AC Servicing",
    "AC servicing Dhaka",
    "AC repair Dhaka",
    "AC installation Dhaka",
    "AC gas refill Dhaka",
    "AC cleaning Dhaka",
    "AC maintenance Dhaka",
    "AC technician Dhaka",
    "AC leak fixing Dhaka",
    "AC compressor replacement Dhaka",
  ],
  applicationName: "Mizan AC Servicing",
  category: "Home Services",
  alternates: {
    canonical: "https://mizan-ac-servicing.vercel.app",
  },
  openGraph: {
    title: "Mizan AC Servicing",
    description:
      "AC servicing, repair, installation, gas refill and maintenance in Dhaka by Mizan AC Servicing.",
    url: "https://mizan-ac-servicing.vercel.app",
    siteName: "Mizan AC Servicing",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: socialPreviewImage,
        width: 1200,
        height: 700,
        alt: "Mizan AC Servicing in Dhaka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan AC Servicing | AC Service in Dhaka",
    description:
      "AC servicing, repair, installation and gas refill in Dhaka by Mizan AC Servicing.",
    images: [socialPreviewImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    google: "notranslate",
  },
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mizan AC Servicing",
  image: socialPreviewImage,
  url: "https://mizan-ac-servicing.vercel.app",
  telephone: "+8801949397234",
  address: {
    "@type": "PostalAddress",
    streetAddress: "657, Hatimbag, Dakshinkhan",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  areaServed: "Dhaka",
  serviceArea: {
    "@type": "City",
    name: "Dhaka",
  },
  sameAs: [
    "https://www.facebook.com/mizanACservicing",
    "https://www.youtube.com/@MizanACservicing",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Repair" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Installation" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Cleaning" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Gas Refill" } },
  ],
};

const themeBootstrapScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("mizan-theme");
    const storedLang = window.localStorage.getItem("mizan-lang");
    const theme = storedTheme === "dark" ? "dark" : "light";
    const locale = storedLang === "en" ? "en" : "bn";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = locale;
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" translate="no" className="notranslate" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} notranslate bg-neutral-100 dark:bg-neutral-900 antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <AuthProvider>
          <LanguageProvider>
            <FirebaseAnalytics />
            <FloatingContacts />
            <Navbar />
            <Suspense fallback={null}>
              <PendingReviewPrompt />
            </Suspense>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationStructuredData),
              }}
            />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
