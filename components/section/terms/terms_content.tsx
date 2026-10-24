"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface TermSection {
  title: string;
  paragraphs: string[];
}

const TERM_SECTIONS: TermSection[] = [
  {
    title: "About These Terms",
    paragraphs: [
      "These Terms & Conditions (“Terms”) explain the general rules for accessing and using the website of The Premium Homes Ltd. (“TPHL”, “we”, “us” or “our”). By browsing this website or using its features, you agree to use it in accordance with these Terms. If you do not agree, please stop using the website. These Terms cover website use; a specific property purchase, booking, registration, refund, or service may also be governed by its own policy, application, agreement, or signed contract.",
    ],
  },
  {
    title: "Using Our Website",
    paragraphs: [
      "You may use this website to learn about TPHL, explore property projects, and contact our team for information. You agree not to misuse the website, attempt unauthorised access, interfere with its operation, introduce malicious code, submit misleading information, or use the website in a way that violates applicable law or another person’s rights. We may restrict access where reasonably necessary to protect the website, users, or our business.",
    ],
  },
  {
    title: "Property Information and Availability",
    paragraphs: [
      "Property descriptions, images, layouts, prices, availability, plans, specifications, amenities, timelines, and other project details are provided for general information and may change. Website content is not, by itself, an offer, allotment, reservation, or guarantee that a particular property is available on stated terms. Please confirm current details with TPHL and review the relevant official documents before making a decision or payment.",
    ],
  },
  {
    title: "Enquiries and Communications",
    paragraphs: [
      "If you send an inquiry or request a callback, meeting, or site visit, please provide accurate and current contact information. Submitting an inquiry does not create a purchase contract, reserve a property, or guarantee a response within a particular time. We may contact you using the details you provide to respond to your request or share relevant information, subject to our Privacy Policy and applicable law.",
    ],
  },
  {
    title: "Bookings, Payments and Refunds",
    paragraphs: [
      "A booking, allocation, payment schedule, cancellation, refund, late-payment charge, registration, transfer, or handover is subject to the applicable written booking policy, refund policy, project terms, and signed agreement. Do not rely on this website’s general Terms as a substitute for those documents. Before paying, please review the relevant policy and confirm the amount, due dates, applicable charges, and refund conditions with TPHL. Where documents differ, the applicable signed agreement and relevant project-specific policy should be reviewed together, and any conflict should be clarified with TPHL in writing before you proceed.",
    ],
  },
  {
    title: "Project-Specific Policies and Agreements",
    paragraphs: [
      "TPHL publishes separate policies for matters including shop booking, flat booking, refunds after booking, refunds after registration, privacy, and services covered under service charge. These documents form important additional guidance for the relevant transaction. The policy index is available at https://dpremiumhomes.com/policies. Only the policy and agreement applicable to your project and transaction should be relied upon; terms for one type of property or transaction may not apply to another.",
    ],
  },
  {
    title: "Your Responsibilities",
    paragraphs: [
      "You are responsible for reviewing information and documents before making a booking or payment, keeping copies of receipts and agreements, providing truthful information, and meeting the obligations in any applicable signed agreement. You should not rely on informal messages or unofficial communication groups as a substitute for formal notices or documents issued through TPHL’s designated channels. If any term, payment instruction, or project detail is unclear, ask TPHL for written clarification before acting.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "Unless stated otherwise, website text, graphics, branding, photographs, layouts, and other content are owned by or used with permission by TPHL and may be protected by intellectual property laws. You may view and use the content for personal, non-commercial information purposes. You must not copy, republish, modify, distribute, or commercially exploit website content without prior written permission, except where applicable law permits it.",
    ],
  },
  {
    title: "Third-Party Websites And Services",
    paragraphs: [
      "This website may include links to third-party websites or services for convenience. TPHL does not control those services and is not responsible for their content, availability, security, or policies. Visiting a third-party website is at your own discretion; review its terms and privacy notice before sharing information or making a transaction.",
    ],
  },
  {
    title: "Disclaimers",
    paragraphs: [
      "The website and its content are provided for general information and on an “as available” basis. To the extent permitted by law, TPHL does not guarantee that the website will always be uninterrupted, error-free, or fully up to date. Nothing in these Terms excludes a representation or obligation that cannot lawfully be excluded. Official project documents and signed agreements should be consulted for transaction-specific details.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, TPHL will not be responsible for indirect or consequential loss arising solely from general website use, temporary unavailability, or reliance on information that has not been confirmed for a specific transaction. This clause does not limit liability that cannot lawfully be limited, nor does it replace any rights or obligations expressly set out in an applicable signed agreement or mandatory law.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these Terms when our website, services, or operational requirements change. The revised version will be published on this page with an updated date where appropriate. Your continued use of the website after the revised Terms are published indicates acceptance of the updated website-use terms to the extent permitted by law. Changes to a signed property agreement must be handled under that agreement and applicable law.",
    ],
  },
];

export function TermsContent() {
  return (
    <section className="w-full bg-[#f8faf9] py-16 sm:py-20 md:py-24 text-[#1f2723]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10 sm:space-y-12">
          {TERM_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
                {section.title}
              </h2>
              {section.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed text-justify sm:text-left"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}

          {/* Contact Us Section */}
          <div className="space-y-4 pt-4 border-t border-[#e5dfd2]/80">
            <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
              Contact Us
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#4a5851] font-light leading-relaxed">
              These Terms are intended to be read consistently with applicable laws of
              Bangladesh. Any dispute relating to a specific booking, payment, registration,
              refund, or property transaction should also be considered under the applicable
              policy and signed agreement. Nothing in these general website Terms is
              intended to override mandatory legal rights. For questions about these Terms,
              contact The Premium Homes Ltd.
            </p>

            <div className="mt-6 pt-2 space-y-2.5 font-sans text-xs sm:text-sm text-[#384640]">
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

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#044133] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#1f2723]">Office:</span>{" "}
                  <span>
                    Land View Commercial Center, 9th Floor, 28 Gulshan North C/A,
                    Gulshan Circle-2, Dhaka, Bangladesh
                  </span>
                </div>
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
      </div>
    </section>
  );
}
