import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FAQHero } from "@/components/section/faq/faq_hero";
import { FAQContent } from "@/components/section/faq/faq_content";

export const metadata: Metadata = {
  title: "FAQ | Premium Homes Ltd.",
  description:
    "Find answers to common questions about Premium Homes Ltd., including property development, booking, payment, and legal documentation.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <FAQHero />
        <FAQContent />
      </main>
      <Footer />
    </div>
  );
}
