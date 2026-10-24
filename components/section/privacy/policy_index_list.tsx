"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
}

interface PolicyCategory {
  category: string;
  items: PolicyItem[];
}

const POLICY_CATEGORIES: PolicyCategory[] = [
  {
    category: "Booking Policies",
    items: [
      {
        id: "shop-booking-policy",
        title: "Shop Booking Policy",
        description: "Rules for booking a shop with land and the related purchase process.",
        badge: "BOOKING",
        href: "#shop-booking-policy",
      },
      {
        id: "flat-booking-policy",
        title: "Flat Booking Policy",
        description: "Important information for flat booking and buyer commitments.",
        badge: "BOOKING",
        href: "#flat-booking-policy",
      },
    ],
  },
  {
    category: "Refund Policies",
    items: [
      {
        id: "refund-policy-after-booking",
        title: "Refund Policy – After Booking",
        description: "Refund terms and conditions that apply after a booking is made.",
        badge: "REFUND",
        href: "#refund-policy-after-booking",
      },
      {
        id: "refund-policy-after-registration",
        title: "Refund Policy – After Registration",
        description: "Refund guidance for the post-registration stage.",
        badge: "REFUND",
        href: "#refund-policy-after-registration",
      },
    ],
  },
  {
    category: "Legal & Privacy",
    items: [
      {
        id: "privacy-policy",
        title: "Privacy Policy",
        description: "How personal information is handled and protected.",
        badge: "LEGAL",
        href: "#privacy-policy",
      },
      {
        id: "terms-conditions",
        title: "Terms & Conditions",
        description: "The terms governing use of our services and website.",
        badge: "LEGAL",
        href: "#terms-conditions",
      },
    ],
  },
  {
    category: "Service Policies",
    items: [
      {
        id: "services-covered-under-service-charge",
        title: "Services Covered Under Service Charge",
        description: "A guide to services covered under the applicable service charge.",
        badge: "SERVICE",
        href: "#services-covered-under-service-charge",
      },
    ],
  },
];

export function PolicyIndexList() {
  return (
    <section className="w-full bg-[#f8faf9] py-16 sm:py-20 md:py-24 text-[#1f2723]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] tracking-tight">
            All Policies
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#526058] font-light leading-relaxed max-w-2xl mt-4">
            The following is a complete index of policies issued by The Premium Homes Ltd.
            Each link will direct you to the full policy document. Please read all
            relevant policies carefully before proceeding with any booking or registration.
          </p>
        </div>

        {/* Categories and List Items */}
        <div className="space-y-10 sm:space-y-12">
          {POLICY_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              {/* Category Heading */}
              <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#044133] tracking-tight">
                {cat.category}
              </h3>

              {/* Items in Category */}
              <div className="space-y-3 sm:space-y-3.5">
                {cat.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: catIdx * 0.1 + idx * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href || `#${item.id}`}
                      className="group block bg-white rounded-lg p-5 sm:p-6 border border-[#e8ecea] hover:border-[#044133]/30 hover:shadow-[0_4px_16px_rgba(4,65,51,0.06)] transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-semibold text-sm sm:text-[15px] text-[#044133] group-hover:text-[#065b49] transition-colors">
                            {item.title}
                          </h4>
                          <p className="font-sans text-xs sm:text-[13px] text-[#526058] font-light mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Category Badge */}
                        <div className="flex-shrink-0 self-start sm:self-center">
                          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#044133] bg-[#edf3f0] px-3.5 py-1.5 rounded-full uppercase">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
