import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactHero } from "@/components/section/contact/contact_hero";
import { ContactForm } from "@/components/section/contact/contact_form";
import { ContactOffices } from "@/components/section/contact/contact_offices";
import { ContactDepartments } from "@/components/section/contact/contact_departments";

export const metadata: Metadata = {
  title: "Contact Us | Premium Homes Ltd.",
  description:
    "We're here to help you find your dream home. Reach out to Premium Homes Ltd. anytime for sales inquiries, office visits, property consultations, and departmental support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f6f2ea] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <ContactForm />
        <ContactOffices />
        <ContactDepartments />
      </main>
      <Footer />
    </div>
  );
}
