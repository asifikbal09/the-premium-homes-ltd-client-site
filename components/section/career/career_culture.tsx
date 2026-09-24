"use client";

import React from "react";
import { motion } from "framer-motion";

function IntegrityIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 sm:w-10 sm:h-10 text-[#044133]"
      aria-hidden="true"
    >
      {/* Outer target rings */}
      <circle cx="20" cy="24" r="14" />
      <circle cx="20" cy="24" r="8" />
      <circle cx="20" cy="24" r="2.5" fill="currentColor" />
      {/* Dart hitting bullseye from top right */}
      <path d="M26 18l11-11" strokeWidth="1.8" />
      <path d="M33 7l5 5" />
      <path d="M37 6l3 3" />
      <path d="M31 12l3 3" />
    </svg>
  );
}

function ExcellenceIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 sm:w-10 sm:h-10 text-[#044133]"
      aria-hidden="true"
    >
      {/* Crest Shield */}
      <path d="M22 6c6.5 0 13-2 13 8 0 12-8.5 19-13 22-4.5-3-13-10-13-22 0-10 6.5-8 13-8z" />
      {/* Checkmark inside */}
      <path d="M16 22l4 4 8-8" strokeWidth="1.8" />
    </svg>
  );
}

function InnovationIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 sm:w-10 sm:h-10 text-[#044133]"
      aria-hidden="true"
    >
      {/* Lightbulb glass outline */}
      <path d="M16 25c-3-2.5-4.5-6-4.5-10a10.5 10.5 0 0 1 21 0c0 4-1.5 7.5-4.5 10" />
      {/* Base contacts */}
      <path d="M18 29h8" />
      <path d="M19 33h6" />
      {/* Filament */}
      <path d="M19 16a3 3 0 0 1 6 0c0 2-3 2-3 5" />
      {/* Spark rays */}
      <line x1="22" y1="2" x2="22" y2="5" />
      <line x1="8" y1="10" x2="10.5" y2="12.5" />
      <line x1="36" y1="10" x2="33.5" y2="12.5" />
      <line x1="6" y1="20" x2="9" y2="20" />
      <line x1="38" y1="20" x2="35" y2="20" />
    </svg>
  );
}

function CollaborationIcon() {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 sm:w-10 sm:h-10 text-[#044133]"
      aria-hidden="true"
    >
      {/* Left arm sleeve */}
      <path d="M6 14v10h4" />
      <path d="M6 18h4" />
      <path d="M10 16h3v7h-3" />
      {/* Right arm sleeve */}
      <path d="M38 30v-10h-4" />
      <path d="M38 26h-4" />
      <path d="M34 28h-3v-7h3" />
      {/* Left puzzle piece */}
      <path d="M13 15h6a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2h-6v-12z" />
      {/* Right puzzle piece */}
      <path d="M21 17a2 2 0 0 0 0 4v8h10v-6a2 2 0 0 1 2-2 2 2 0 0 1-2-2v-2h-6a2 2 0 0 1-2-2 2 2 0 0 1-2 2z" />
      {/* Energy sparks */}
      <line x1="22" y1="10" x2="22" y2="8" />
      <line x1="17" y1="11" x2="16" y2="9" />
      <line x1="27" y1="11" x2="28" y2="9" />
    </svg>
  );
}

interface ValueItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const VALUES_LIST: ValueItem[] = [
  {
    id: "value-integrity",
    title: "Integrity",
    description:
      "We prioritize integrity in all our actions, ensuring that we uphold ethical standards and take responsibility.",
    icon: <IntegrityIcon />,
  },
  {
    id: "value-excellence",
    title: "Excellence",
    description:
      "Striving for excellence means paying attention to every detail. It's about going beyond the ordinary and ensuring.",
    icon: <ExcellenceIcon />,
  },
  {
    id: "value-innovation",
    title: "Innovation",
    description:
      "Innovation thrives on the smallest details. It's in the nuances where groundbreaking ideas are born.",
    icon: <InnovationIcon />,
  },
  {
    id: "value-collaboration",
    title: "Collaboration",
    description:
      "Collaboration is key to success. When we work together, every detail contributes to a greater outcome.",
    icon: <CollaborationIcon />,
  },
];

export function CareerCulture() {
  return (
    <section
      aria-label="Our Culture and Values"
      className="w-full bg-[#ffffff] text-[#1f2723] py-16 sm:py-24 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Image 1: Left Title, Right Description */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-tight tracking-tight">
              Our Culture &amp; Values
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md lg:text-left"
          >
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#526058] font-light leading-relaxed">
              We foster an environment where people can learn, grow, and create
              meaningful impact. Our values guide every decision and reflect who
              we are.
            </p>
          </motion.div>
        </div>

        {/* 4 Cards Grid matching Image 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {VALUES_LIST.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className="border border-neutral-200/80 hover:border-[#044133]/40 bg-white p-6 sm:p-7 md:p-8 flex flex-col justify-start min-h-[220px] sm:min-h-[240px] shadow-xs hover:shadow-md transition-all duration-300"
            >
              {/* Icon at top */}
              <div className="mb-7 sm:mb-9">{item.icon}</div>

              {/* Title in Serif */}
              <h3 className="font-heading text-xl sm:text-2xl text-[#044133] font-normal mb-2.5 sm:mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs sm:text-[13px] text-[#526058] font-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
