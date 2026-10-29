import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FAQHero } from "@/components/section/faq/faq_hero";
import { FAQContent } from "@/components/section/faq/faq_content";
import { getFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ | Premium Homes Ltd.",
  description:
    "Find answers to common questions about Premium Homes Ltd., including property development, booking, payment, and legal documentation.",
};

/** Sections in Figma "FAQ" order. */
export default async function FAQPage() {
  const categories = await getFaqs();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <FAQHero />
        <FAQContent categories={categories} />
      </main>
      <Footer reveal />
    </div>
  );
}
