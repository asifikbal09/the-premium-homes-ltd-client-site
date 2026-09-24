"use client";

import React from "react";
import { motion } from "framer-motion";

function WaterfrontIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#044133]"
      aria-hidden="true"
    >
      {/* Tree 1 */}
      <path d="M10 6L6 13h2.5l-3 6h7l-3-6H12L10 6z" />
      <line x1="10" y1="19" x2="10" y2="23" />
      {/* Tree 2 */}
      <path d="M22 6l-4 7h2.5l-3 6h7l-3-6H24l-2-7z" />
      <line x1="22" y1="19" x2="22" y2="23" />
      {/* Tree 3 */}
      <path d="M34 6l-4 7h2.5l-3 6h7l-3-6H36l-2-7z" />
      <line x1="34" y1="19" x2="34" y2="23" />
      {/* Waves */}
      <path d="M4 27c2.5-1.8 5-1.8 7.5 0s5 1.8 7.5 0 5-1.8 7.5 0 5 1.8 7.5 0 5-1.8 7.5 0" />
      <path d="M4 33c2.5-1.8 5-1.8 7.5 0s5 1.8 7.5 0 5-1.8 7.5 0 5 1.8 7.5 0 5-1.8 7.5 0" />
    </svg>
  );
}

function RetailDiningIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#044133]"
      aria-hidden="true"
    >
      {/* Bag Handle */}
      <path d="M16 14V10a6 6 0 0 1 12 0v4" />
      {/* Bag Outline */}
      <path d="M10 14h24l-2 24H12L10 14z" />
      {/* Shopping Trolley / Cart inside */}
      <path d="M17 21h2l1.8 7h7l1.4-5h-8.8" />
      <circle cx="21.5" cy="31" r="1.1" fill="currentColor" />
      <circle cx="26.5" cy="31" r="1.1" fill="currentColor" />
    </svg>
  );
}

function CityAccessIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#044133]"
      aria-hidden="true"
    >
      {/* Antenna */}
      <line x1="28" y1="5" x2="28" y2="9" />
      {/* Center Main High-rise */}
      <path d="M22 9h12v29H22z" />
      {/* Left Tower */}
      <path d="M10 18h12v20H10z" />
      {/* Windows Left */}
      <line x1="14" y1="22" x2="14" y2="22.01" strokeWidth="2.4" />
      <line x1="18" y1="22" x2="18" y2="22.01" strokeWidth="2.4" />
      <line x1="14" y1="27" x2="14" y2="27.01" strokeWidth="2.4" />
      <line x1="18" y1="27" x2="18" y2="27.01" strokeWidth="2.4" />
      {/* Windows Center */}
      <line x1="26" y1="14" x2="26" y2="14.01" strokeWidth="2.4" />
      <line x1="30" y1="14" x2="30" y2="14.01" strokeWidth="2.4" />
      <line x1="26" y1="19" x2="26" y2="19.01" strokeWidth="2.4" />
      <line x1="30" y1="19" x2="30" y2="19.01" strokeWidth="2.4" />
      <line x1="26" y1="24" x2="26" y2="24.01" strokeWidth="2.4" />
      <line x1="30" y1="24" x2="30" y2="24.01" strokeWidth="2.4" />
      <line x1="26" y1="29" x2="26" y2="29.01" strokeWidth="2.4" />
      <line x1="30" y1="29" x2="30" y2="29.01" strokeWidth="2.4" />
      {/* Ground Line */}
      <line x1="8" y1="38" x2="36" y2="38" />
    </svg>
  );
}

function LifestyleIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 sm:w-9 sm:h-9 text-[#044133]"
      aria-hidden="true"
    >
      {/* Diagonal Barbell */}
      <line x1="13" y1="13" x2="31" y2="31" strokeWidth="2.2" />
      {/* Top Left Weight Plates */}
      <line x1="10" y1="19" x2="19" y2="10" strokeWidth="2.2" />
      <line x1="7" y1="16" x2="16" y2="7" strokeWidth="2.2" />
      {/* Bottom Right Weight Plates */}
      <line x1="25" y1="34" x2="34" y2="25" strokeWidth="2.2" />
      <line x1="28" y1="37" x2="37" y2="28" strokeWidth="2.2" />
      {/* Collar End Caps */}
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="36" cy="36" r="1.5" fill="currentColor" />
    </svg>
  );
}

interface BenefitItem {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const BENEFITS_LIST: BenefitItem[] = [
  {
    id: "benefit-1",
    title: "Waterfront Setting",
    icon: <WaterfrontIcon />,
  },
  {
    id: "benefit-2",
    title: "Retail & Dining Close",
    icon: <RetailDiningIcon />,
  },
  {
    id: "benefit-3",
    title: "Easy City Access",
    icon: <CityAccessIcon />,
  },
  {
    id: "benefit-4",
    title: "Lifestyle Amenities Nearby",
    icon: <LifestyleIcon />,
  },
  {
    id: "benefit-5",
    title: "Waterfront Setting",
    icon: <WaterfrontIcon />,
  },
  {
    id: "benefit-6",
    title: "Retail & Dining Close",
    icon: <RetailDiningIcon />,
  },
  {
    id: "benefit-7",
    title: "Easy City Access",
    icon: <CityAccessIcon />,
  },
  {
    id: "benefit-8",
    title: "Lifestyle Amenities Nearby",
    icon: <LifestyleIcon />,
  },
];

export function CareerBenefits() {
  return (
    <section
      aria-label="Benefits Designed For You"
      className="w-full bg-[#ffffff] text-[#1f2723] py-16 sm:py-24 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Image 2 */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[#d0a65b] font-semibold text-xs sm:text-[13px] tracking-[0.2em] uppercase">
            BENEFITS &amp; PARKS
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-[#044133] leading-tight tracking-tight mt-2.5 sm:mt-3">
            Benefits Designed For You
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#526058] font-light leading-relaxed mt-3 sm:mt-4 max-w-xl mx-auto">
            We believe great work happens when people feel supported. Our
            benefits package is designed to help you thrive personally and
            professionally.
          </p>
        </div>

        {/* 2x4 Benefit Cards Grid matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {BENEFITS_LIST.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -3,
                transition: { duration: 0.2 },
              }}
              className="group border border-neutral-200/80 hover:border-[#044133]/40 bg-white p-6 sm:p-7 md:p-8 flex flex-col justify-between min-h-[125px] sm:min-h-[100px] transition-all duration-300 shadow-xs hover:shadow-md"
            >
              {/* Top: Icon */}
              <div className="flex items-start transition-transform duration-300 group-hover:scale-105">
                {benefit.icon}
              </div>

              {/* Bottom: Title in Serif */}
              <div className="mt-6">
                <h3 className="font-heading text-lg sm:text-xl md:text-[21px] font-normal text-[#1f2723] group-hover:text-[#044133] transition-colors leading-snug">
                  {benefit.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
