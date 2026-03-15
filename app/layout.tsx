import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import FloatingContacts from "@/components/shared/FloatingContacts";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mizanelectronics.vercel.app"),
  title: {
    default: "Mizan Electronics",
    template: "%s | Mizan Electronics",
  },
  description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
  openGraph: {
    title: "Mizan Electronics",
    description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
    url: "https://mizanelectronics.vercel.app",
    siteName: "Mizan Electronics",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "https://i.ibb.co.com/rfvR43dy/facebook-profile.png",
        width: 1200,
        height: 630,
        alt: "Mizan Electronics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan Electronics",
    description: "ঢাকার নির্ভরযোগ্য এসি সার্ভিস, ইনস্টলেশন ও মেইনটেন্যান্স",
    images: ["https://i.ibb.co.com/rfvR43dy/facebook-profile.png"],
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
        <LanguageProvider>
          <FloatingContacts/>
          <Navbar/>
          {children}
          <Footer/> 
        </LanguageProvider>
      </body>
    </html>
  );
}
