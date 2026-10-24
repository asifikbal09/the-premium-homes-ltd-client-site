"use client";

import React from "react";
import { motion } from "framer-motion";

export function PrivacyHero() {
  return (
    <section
      aria-label="Policies and Guidelines Hero Section"
      className="relative w-full bg-[#061d16] bg-[radial-gradient(ellipse_100%_80%_at_50%_25%,#092e24_0%,#061d16_65%,#03130f_100%)] text-white overflow-hidden"
    >
      {/* Background Ambience Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(208, 166, 91, 0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-44 pb-20 sm:pb-24 md:pb-28 flex flex-col justify-center min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
        {/* Center Typography */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto px-2"
          >
            {/* Eyebrow Label */}
            <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.24em] uppercase mb-4 sm:mb-5">
              COMPANY POLICY
            </span>

            {/* Display Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal text-white leading-[1.12] sm:leading-[1.1] tracking-tight">
              Policies &amp; Guidelines 
              <span className="block mt-1 sm:mt-2">
                The Premium Homes Ltd
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-white/75 font-light leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
              Browse all official policies of The Premium Homes Ltd. Select any policy
              below to view its full terms and conditions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
