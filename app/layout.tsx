import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import FloatingContacts from "@/components/shared/FloatingContacts";
import FirebaseAnalytics from "@/components/shared/FirebaseAnalytics";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mizan-ac-servicing.vercel.app"),
  title: {
    default: "Mizan AC Servicing",
    template: "%s | Mizan AC Servicing",
  },
  description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
  openGraph: {
    title: "Mizan AC Servicing",
    description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
    url: "https://mizan-ac-servicing.vercel.app",
    siteName: "Mizan AC Servicing",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dj5olrziv/image/upload/v1773771046/mizanacservicing_agydre.png",
        width: 1200,
        height: 630,
        alt: "Mizan AC Servicing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan AC Servicing",
    description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
    images: [
      "https://res.cloudinary.com/dj5olrziv/image/upload/v1773771046/mizanacservicing_agydre.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-100 dark:bg-neutral-900 antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <FirebaseAnalytics />
            <FloatingContacts />
            <Navbar />
            {children}
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
