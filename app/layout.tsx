import type { Metadata, Viewport } from "next";
import { Seaweed_Script } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SiteShell } from "@/components/providers/site_shell";
import "./globals.css";

const kVictor = localFont({
  src: [
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-10Hairline.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-30Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-40Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-50Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-60Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-70Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/K Victor Trial/KVictorTrial-80Black.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-victor",
  display: "swap",
});

const vazirmatn = localFont({
  src: [
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const seaweedScript = Seaweed_Script({
  weight: "400",
  variable: "--font-seaweed-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Homes | A Regional Real Estate Developer",
  description:
    "Building Communities With Vision, Precision, And Purpose. Premium luxury residences and commercial masterworks.",
};

export const viewport: Viewport = {
  themeColor: "#09221c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${vazirmatn.variable} ${seaweedScript.variable} ${kVictor.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#1f2723]">
        {/* Always open at the top on reload: the intro and hero start the page. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "history.scrollRestoration='manual'",
          }}
        />
        <SiteShell>{children}</SiteShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
