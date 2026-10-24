import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PrivacyPolicyHero } from "@/components/section/privacy/privacy_policy_hero";
import { PrivacyPolicyContent } from "@/components/section/privacy/privacy_policy_content";

export const metadata: Metadata = {
  title: "Privacy Policy | The Premium Homes Ltd",
  description:
    "Your privacy matters to us. Learn how The Premium Homes Ltd. collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <PrivacyPolicyHero />
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </div>
  );
}
