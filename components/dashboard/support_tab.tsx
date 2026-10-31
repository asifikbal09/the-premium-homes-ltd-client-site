"use client";

import React, { useState } from "react";
import { X, Sparkles, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function SupportTab() {
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[32px] w-full"
    >
      {/* Header (Figma node 8293:22514) */}
      <motion.div variants={itemVariants} className="flex flex-col gap-[12px] items-start">
        <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px] sm:text-[32px]">
          Support
        </h1>
        <p className="font-sans font-normal leading-none text-[#546360] text-[15px] sm:text-[16px]">
          We&apos;re here to help. Get the support you need, Whenever you need it.
        </p>
      </motion.div>

      {/* Support Options Card (Figma node 8293:22518) */}
      <motion.div
        variants={itemVariants}
        className="bg-white flex flex-col gap-[24px] items-start p-[24px] rounded-[12px] w-full"
      >
        {/* Row 1: Call (Figma node 8293:22519) */}
        <motion.a
          href="tel:+8801958253300"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.995 }}
          className="group flex gap-[16px] items-center justify-between w-full cursor-pointer"
        >
          <div className="flex flex-1 gap-[16px] items-start min-w-0">
            {/* 56x56 #005d4d circle with 28x28 WhatsApp icon (Figma node 8293:22521) */}
            <div className="bg-[#005d4d] flex items-center justify-center p-[14px] rounded-full shrink-0 size-[56px] group-hover:scale-105 transition-transform duration-200">
              <svg
                className="size-[28px] text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0 pt-0.5">
              <h2 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[22px] sm:text-[24px] group-hover:text-[#005d4d] transition-colors">
                Call
              </h2>
              <p className="font-sans font-normal leading-snug sm:leading-none text-[#546360] text-[15px] sm:text-[16px]">
                Talk to an expert and get your questions answered.
              </p>
            </div>
          </div>

          {/* 20x20 top-right arrow icon (Figma node 8293:22526) */}
          <div className="relative shrink-0 size-[20px] text-[#3b3e40] group-hover:text-[#054b3c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <svg viewBox="0 0 20 20" fill="none" className="size-full">
              <path
                d="M5.83333 14.1667L14.1667 5.83334M14.1667 5.83334H6.66667M14.1667 5.83334V13.3333"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.a>

        {/* Divider Line (Figma node 8293:22530) */}
        <div className="bg-[#f1f2f6] h-px shrink-0 w-full" />

        {/* Row 2: Chat with AI (Figma node 8293:22531) */}
        <motion.button
          type="button"
          onClick={() => setShowAiModal(true)}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.995 }}
          className="group flex gap-[16px] items-center justify-between w-full text-left cursor-pointer"
        >
          <div className="flex flex-1 gap-[16px] items-start min-w-0">
            {/* 56x56 #ccb8fc circle with 28x28 message-02 icon (Figma node 8293:22533) */}
            <div className="bg-[#ccb8fc] flex items-center justify-center p-[14px] rounded-full shrink-0 size-[56px] group-hover:scale-105 transition-transform duration-200">
              <svg
                className="size-[28px] text-[#232f43]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M8 11h.01" />
                <path d="M12 11h.01" />
                <path d="M16 11h.01" />
              </svg>
            </div>

            <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0 pt-0.5">
              <h2 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[22px] sm:text-[24px] group-hover:text-[#005d4d] transition-colors">
                Chat with AI
              </h2>
              <p className="font-sans font-normal leading-snug sm:leading-none text-[#546360] text-[15px] sm:text-[16px]">
                Get instant answers about properties
              </p>
            </div>
          </div>

          {/* 20x20 top-right arrow icon (Figma node 8293:22538) */}
          <div className="relative shrink-0 size-[20px] text-[#3b3e40] group-hover:text-[#054b3c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <svg viewBox="0 0 20 20" fill="none" className="size-full">
              <path
                d="M5.83333 14.1667L14.1667 5.83334M14.1667 5.83334H6.66667M14.1667 5.83334V13.3333"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.button>
      </motion.div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowAiModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative"
            >
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#ccb8fc]/30 text-[#6d28d9] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#054b3c]">
                TPHL AI Property Assistant
              </h3>
              <p className="text-xs sm:text-sm text-[#546360] mt-2.5 leading-relaxed">
                Our AI Concierge is currently being integrated to assist you 24/7 with real-time property details, installment updates, and site visit schedules.
              </p>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#054b3c] bg-[#054b3c]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Coming Soon
                </span>
                <a
                  href="tel:+8801958253300"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#054b3c] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us Direct</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
