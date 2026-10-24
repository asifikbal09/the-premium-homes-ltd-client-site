"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import type { BookingPolicyData } from "./data";

interface BookingPolicyContentProps {
  data: BookingPolicyData;
}

export function BookingPolicyContent({ data }: BookingPolicyContentProps) {
  return (
    <section className="w-full bg-[#f8faf9] py-16 sm:py-20 md:py-24 text-[#1f2723]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-normal text-[#044133] tracking-tight">
            {data.sectionTitle}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#526058] font-light leading-relaxed max-w-3xl mt-3">
            {data.sectionSubtitle}
          </p>
        </div>

        {/* Numbered Rules List */}
        <div className="space-y-6 sm:space-y-7">
          {data.rules.map((rule) => (
            <div
              key={rule.number}
              className="flex items-start gap-4 sm:gap-6 group"
            >
              {/* Number Badge */}
              <span className="font-sans font-medium text-xs sm:text-sm text-[#044133] w-6 sm:w-8 pt-0.5 flex-shrink-0 select-none">
                {rule.number}
              </span>

              {/* Rule Body */}
              <div className="flex-1 font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
                <p className="text-justify sm:text-left">
                  {rule.text}
                  {rule.link && (
                    <span className="ml-2 inline-block">
                      <a
                        href={rule.link.href}
                        className="font-medium text-[#044133] hover:text-[#d0a65b] underline underline-offset-2 transition-colors"
                      >
                        {rule.link.label}
                      </a>
                    </span>
                  )}
                </p>

                {/* Sub-bullets if any (e.g. Design changes in flat booking) */}
                {rule.subBullets && rule.subBullets.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-5 list-disc text-[#4a5851]">
                    {rule.subBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Declaration Card */}
        <div className="mt-14 sm:mt-16 bg-[#fdfbf7] border border-[#d0a65b]/50 rounded-lg p-6 sm:p-7 shadow-[0_2px_8px_rgba(208,166,91,0.06)]">
          <span className="block font-sans font-semibold text-xs sm:text-sm text-[#936c2a] tracking-wider uppercase mb-3">
            DECLARATION
          </span>
          <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
            I hereby declare that the information provided above by me is true to the
            best of my knowledge and belief. I also declare that I have read the terms
            and conditions as mentioned above attentively and agreed to comply with all
            of them in good faith. I agree to the terms of service.
          </p>
        </div>

        {/* Contact Us Section */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-[#e5dfd2]/80 space-y-4">
          <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
            Contact Us
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
            If you have any questions about {data.policyQuestionType}, you can contact
            us:
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
