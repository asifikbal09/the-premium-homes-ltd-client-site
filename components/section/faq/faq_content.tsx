"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  label: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    id: "general",
    label: "GENERAL",
    items: [
      {
        question: "What kind of properties does Premium Homes Ltd. develop?",
        answer: "We develop residential apartments and land-based projects.",
      },
      {
        question: "Where are your current projects located?",
        answer:
          "Our current projects are located in prime locations across Dhaka, including Ashulia, Bashundhara, Gulshan, and Uttara areas.",
      },
      {
        question: "How long has Premium Homes been in business?",
        answer:
          "Premium Homes Ltd. has been serving clients for over 15 years, delivering quality real estate solutions.",
      },
    ],
  },
  {
    id: "booking",
    label: "BOOKING & PAYMENT",
    items: [
      {
        question: "What is the booking process?",
        answer:
          "The booking process involves selecting your preferred property, submitting required documents, and making an initial payment.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bank transfers, cheques, and flexible installment plans tailored to your needs.",
      },
      {
        question: "Can I get a payment plan customized to my budget?",
        answer:
          "Absolutely! We offer flexible payment plans that can be tailored to match your financial requirements and timeline",
      },
    ],
  },
  {
    id: "legal",
    label: "LEGAL & DOCUMENTATION",
    items: [
      {
        question: "What documents are required for booking?",
        answer:
          "You will need a valid national ID, passport-sized photographs, and proof of address.",
      },
      {
        question: "Is the land legally registered?",
        answer:
          "Yes, all our properties are legally registered with proper documentation and clear titles.",
      },
      {
        question: "How long does the documentation process take?",
        answer:
          "The documentation process typically takes 7-10 business days, depending on the verification requirements.",
      },
    ],
  },
];

export function FAQContent() {
  const [activeTab, setActiveTab] = useState<string>(faqData[0].id);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeCategoryIndex = faqData.findIndex((c) => c.id === activeTab);
  const activeCategory = faqData[activeCategoryIndex];

  return (
    <section className="py-20 md:py-32 bg-[#f4f4f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column: Heading and Contact info */}
          <div className="w-full lg:w-[45%] flex flex-col items-start">
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-[#061d16] font-normal leading-[1.1] mb-6">
              Answers To Your
              <br />
              Questions About
              <br />
              Premium Homes
            </h2>
            <p className="text-[#5a6a62] font-sans text-sm md:text-base leading-relaxed mb-10 max-w-sm">
              Don&apos;t see your question answered? Our team can provide
              personalized answers and guidance
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white bg-[#044133] hover:bg-[#033125] transition-colors shadow-sm"
              >
                CONTACT US
              </Link>
              <Link
                href="tel:+8801958253300"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#044133] bg-transparent border border-[#044133] hover:bg-[#044133]/5 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                +8801958253300
              </Link>
            </div>
          </div>

          {/* Right Column: Tabs and Accordion */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {faqData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 border",
                    activeTab === category.id
                      ? "bg-[#044133] text-white border-[#044133]"
                      : "bg-transparent text-[#7a8a81] border-[#d4d4d4] hover:border-[#044133] hover:text-[#044133]",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {activeCategory?.items.map((item, idx) => {
                  const key = `${activeCategoryIndex}-${idx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg px-6 py-5 shadow-sm border border-black/5"
                    >
                      <button
                        onClick={() => toggleItem(activeCategoryIndex, idx)}
                        className="w-full flex items-center justify-between text-left gap-6 group"
                      >
                        <span className="font-sans text-[15px] text-[#2b3a32] font-medium leading-tight">
                          {item.question}
                        </span>
                        <span
                          className={cn(
                            "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-colors",
                            isOpen
                              ? "border-[#044133] text-[#044133] bg-[#044133]/5"
                              : "border-[#d4d4d4] text-[#7a8a81] group-hover:border-[#044133] group-hover:text-[#044133]",
                          )}
                        >
                          {isOpen ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 pb-2">
                              <p className="text-[14px] text-[#5a6a62] leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
