import type { Metadata } from "next";
import {
  Vazirmatn,
  Seaweed_Script,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

import localFont from "next/font/local";

const kVictor = localFont({
  src: [
    {
      path: "../public/fonts/KVictorTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/KVictorTrial-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/KVictorTrial-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/KVictorTrial-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-victor",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  display: "swap",
});

const seaweedScript = Seaweed_Script({
  weight: "400",
  variable: "--font-seaweed-script",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Homes | A Regional Real Estate Developer",
  description:
    "Building Communities With Vision, Precision, And Purpose. Premium luxury residences and commercial masterworks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${vazirmatn.variable} ${seaweedScript.variable} ${cormorantGaramond.variable} ${kVictor.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#1f2723]">
        {children}
      </body>
    </html>
  );
}
