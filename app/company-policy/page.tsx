import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PrivacyHero } from "@/components/section/privacy/privacy_hero";
import { PolicyIndexList } from "@/components/section/privacy/policy_index_list";
import { ContactDepartments } from "@/components/section/contact/contact_departments";

export const metadata: Metadata = {
  title: "Policies & Guidelines | The Premium Homes Ltd",
  description:
    "Browse all official policies of The Premium Homes Ltd. Select any policy below to view its full terms and conditions.",
};

export default function CompanyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <PrivacyHero />
        <PolicyIndexList />
        <ContactDepartments />
      </main>
      <Footer />
    </div>
  );
}
