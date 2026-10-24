import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TermsHero } from "@/components/section/terms/terms_hero";
import { TermsContent } from "@/components/section/terms/terms_content";

export const metadata: Metadata = {
  title: "Terms & Conditions | The Premium Homes Ltd",
  description:
    "Please read these Terms & Conditions before using our website or relying on property information.",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <TermsHero />
        <TermsContent />
      </main>
      <Footer />
    </div>
  );
}
