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

/** Sections in Figma "Contact Us" order. */
export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-warm text-sage">
        <ContactHero />
        <ContactForm />
        <ContactOffices />
        <ContactDepartments />
      </main>
      <Footer reveal />
    </div>
  );
}
