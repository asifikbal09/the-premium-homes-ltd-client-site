"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function PrivacyPolicyHero() {
  return (
    <section
      aria-label="Privacy Policy Hero Section"
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
            {/* Eyebrow Breadcrumb */}
            <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] tracking-[0.24em] uppercase mb-4 sm:mb-5 font-medium">
              <Link
                href="/company-policy"
                className="text-[#d0a65b] hover:text-[#f3d99c] hover:underline underline-offset-4 transition-colors"
              >
                COMPANY POLICY
              </Link>
              <span className="text-[#d0a65b]/50">/</span>
              <span className="text-[#d0a65b]">PRIVACY POLICY</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-white leading-[1.08] sm:leading-[1.05] tracking-tight">
              Privacy Policy
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-white/75 font-light leading-relaxed max-w-2xl mx-auto mt-5 sm:mt-6">
              Your privacy matters to us. This policy explains how The Premium Homes
              Ltd. may collect, use, store, and protect your information when you visit our
              website, enquire about a property, or communicate with our team.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
