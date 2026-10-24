"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const SERVICE_ITEMS = [
  {
    number: "01",
    title: "Project Planning & Coordination",
    desc: "Project planning, execution roadmap, and overall coordination.",
  },
  {
    number: "02",
    title: "Documentation Support",
    desc: "Coordination and support for required project documentation.",
  },
  {
    number: "03",
    title: "Vendor/Supplier/Contractor Management",
    desc: "Contractor selection, work order coordination, and performance follow-up.",
  },
  {
    number: "04",
    title: "Construction Supervision",
    desc: "Site monitoring and coordination among engineers, supervisors, contractors, and management.",
  },
  {
    number: "05",
    title: "Quality Control",
    desc: "Site checklists, technical observations, corrective actions, and compliance follow-up.",
  },
  {
    number: "06",
    title: "Cost & Financial Transparency",
    desc: "Construction cost monitoring and maintenance of bills, vouchers, and payment records.",
  },
  {
    number: "07",
    title: "Shareholder Support",
    desc: "Regular project communication and shareholder service.",
  },
  {
    number: "08",
    title: "Digital Transparency",
    desc: "Project updates and live CCTV access through the App/website, where available.",
  },
  {
    number: "09",
    title: "Handover Coordination",
    desc: "Completion checklist and final unit handover coordination.",
  },
];

export function ServiceChargeContent() {
  return (
    <section className="w-full bg-[#f8faf9] py-16 sm:py-20 md:py-24 text-[#1f2723]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal text-[#044133] tracking-tight">
            Declaration Of Services Covered Under Service Charge
          </h2>
        </div>

        {/* Narrative / Letter */}
        <div className="space-y-4 font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed mb-10 pb-8 border-b border-[#e5dfd2]/80">
          <p className="font-medium text-[#1f2723]">Dear Valued Shareholders,</p>
          <p>
            The Premium Homes Ltd. follows a consultancy and developer model where
            shareholders first acquire registered land shares and subsequently
            contribute to the actual construction cost through a structured
            installment plan.
          </p>
          <p>
            Under this model, The Premium Homes Ltd. provides end-to-end planning,
            construction consultancy, coordination, supervision, and project
            management services. For these services, a 10% / 12% / 15% consultancy
            service charge, as applicable to the respective project, is charged on the
            actual construction cost.
          </p>
        </div>

        {/* The Service Charge Covers: */}
        <div className="mb-8">
          <h3 className="font-heading text-lg sm:text-xl font-normal text-[#044133] tracking-tight mb-6">
            The Service Charge Covers:
          </h3>

          <div className="space-y-5 sm:space-y-6">
            {SERVICE_ITEMS.map((item) => (
              <div
                key={item.number}
                className="flex items-start gap-4 sm:gap-6 group"
              >
                <span className="font-sans font-medium text-xs sm:text-sm text-[#044133] w-6 sm:w-8 pt-0.5 flex-shrink-0 select-none">
                  {item.number}
                </span>
                <div className="flex-1 font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
                  <span className="font-medium text-[#1f2723]">{item.title}</span> –{" "}
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote / Highlight Box */}
        <div className="mt-14 sm:mt-16 bg-[#fdfbf7] border border-[#d0a65b]/50 rounded-lg p-6 sm:p-7 shadow-[0_2px_8px_rgba(208,166,91,0.06)]">
          <blockquote className="font-sans text-xs sm:text-sm text-[#526058] font-normal italic leading-relaxed text-center sm:text-left">
            “A home is more than a structure. It is a dream, a responsibility, and a
            future. We remain committed to delivering every project with transparency,
            care, and professional accountability.”
          </blockquote>
        </div>

        {/* Contact Us Section */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#e5dfd2]/80 space-y-4">
          <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
            Contact Us
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
            If you have any questions about the services covered under the consultancy
            and project management service charge, please contact us:
          </p>

          <div className="mt-4 space-y-2.5 font-sans text-xs sm:text-sm text-[#384640]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#044133] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#1f2723]">
                  The Premium Homes Ltd
                </span>
                <br />
                <span>
                  Land View Commercial Center, 9th Floor 28 Gulshan North C/A,
                  Gulshan Circle-2, Dhaka
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#044133] flex-shrink-0" />
              <span className="font-medium text-[#1f2723]">Email:</span>
              <a
                href="mailto:info@dpremiumhomes.com"
                className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
              >
                info@dpremiumhomes.com
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#044133] flex-shrink-0" />
              <span className="font-medium text-[#1f2723]">Phone:</span>
              <a
                href="tel:+8801958253301"
                className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
              >
                +8801958253301
              </a>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <ExternalLink className="w-4 h-4 text-[#044133] flex-shrink-0" />
              <span className="font-medium text-[#1f2723]">Contact page:</span>
              <Link
                href="/contact"
                className="text-[#044133] hover:text-[#d0a65b] underline-offset-4 hover:underline transition-colors"
              >
                https://www.dpremiumhomes.com/contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
