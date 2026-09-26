"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function AboutProvenTrust() {
  return (
    <section
      aria-label="Built On Trust, Proven By Delivery"
      className="relative w-full bg-[#ffffff] text-[#1f2723] overflow-hidden py-16 sm:py-20 lg:py-28 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* ========================================================= */}
        {/* DESKTOP LAYOUT (lg and above): Matches the exact visual   */}
        {/* composition from the design reference                     */}
        {/* ========================================================= */}
        <div className="hidden lg:block relative w-full">
          {/* Top Row: Title flanked by Image 3 (left) and Image 2 (right) */}
          <div className="grid grid-cols-12 gap-8 items-start mb-12 xl:mb-16">
            {/* Top-Left Image: Timber screen & daybed overlooking sea */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="col-span-3 pt-6"
            >
              <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_45px_rgba(4,65,51,0.15)] border border-black/[0.05] transition-shadow duration-300">
                <Image
                  src="/image/about/second_section03.png"
                  alt="Architectural terrace and daybed overlooking panoramic ocean views"
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Center Heading */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-6 flex flex-col items-center text-center pt-2"
            >
              <h2 className="font-heading text-5xl xl:text-[68px] 2xl:text-[76px] font-normal text-[#044133] leading-[1.06] tracking-tight">
                Built On Trust
                <br />
                Proven By Delivery
              </h2>
            </motion.div>

            {/* Top-Right Image: Grand vaulted ceiling hotel lobby */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="col-span-3 flex justify-end pt-12 xl:pt-16"
            >
              <div className="relative w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_45px_rgba(4,65,51,0.15)] border border-black/[0.05] transition-shadow duration-300">
                <Image
                  src="/image/about/second_section02.png"
                  alt="Grand architectural lobby with vaulted ceiling and crystal chandeliers"
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          {/* Lower Grid: Narrative & CTA (Left) + Stats & Bottom-Right Image */}
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Narrative Copy & Explore Projects Button */}
            <div className="col-span-5 flex flex-col justify-between min-h-[380px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="max-w-[360px]"
              >
                {/* Decorative horizontal accent indicator */}
                <div className="relative w-full mb-5">
                  <div className="w-10 h-[3px] bg-[#1f2723]" />
                  <div className="w-full h-[1px] bg-[#E8E2D2] -mt-[1px]" />
                </div>

                <p className="font-sans text-[13px] xl:text-[14px] leading-relaxed text-[#526058] mb-7">
                  At TPHL (The Premium Homes Ltd.), Trust Is Not A Claim, It&apos;s
                  Our Foundation. From Transparent Dealings To On-Time Delivery,
                  Every Decision We Make Is Guided By Our Commitment To Quality,
                  Integrity, And The Confidence Of Our Customers.
                </p>

                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#044133] hover:bg-[#055b4b] text-[#fdfdf8] text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  EXPLORE PROJECTS
                </Link>
              </motion.div>

              {/* Bottom Stat 1: 52+ Ongoing Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-14"
              >
                <span className="block font-heading text-6xl xl:text-7xl 2xl:text-[84px] font-normal text-[#044133] leading-none mb-2">
                  52+
                </span>
                <span className="block font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#526058]">
                  ONGOING PROJECTS
                </span>
              </motion.div>
            </div>

            {/* Middle Column: Bottom Stat 2: 98% Satisfaction Rate */}
            <div className="col-span-3 flex flex-col justify-end min-h-[380px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <span className="block font-heading text-6xl xl:text-7xl 2xl:text-[84px] font-normal text-[#044133] leading-none mb-2">
                  98%
                </span>
                <span className="block font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#526058]">
                  SATISFACTION RATE
                </span>
              </motion.div>
            </div>

            {/* Right Column: Upper Stats (1200+, 4.9/5) + Bottom-Right Team Lounge Image */}
            <div className="col-span-4 flex flex-col gap-10">
              {/* Stat 3: 1200+ Happy Clients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <span className="block font-heading text-6xl xl:text-7xl 2xl:text-[84px] font-normal text-[#044133] leading-none mb-2">
                  1200+
                </span>
                <span className="block font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#526058]">
                  HAPPY CLIENTS
                </span>
              </motion.div>

              {/* Stat 4: 4.9/5 Average Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <span className="block font-heading text-6xl xl:text-7xl 2xl:text-[84px] font-normal text-[#044133] leading-none mb-2">
                  4.9/5
                </span>
                <span className="block font-sans text-xs font-semibold tracking-[0.18em] uppercase text-[#526058]">
                  AVERAGE RATING
                </span>
              </motion.div>

              {/* Bottom-Right Image: Team conversation in lounge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="mt-4"
              >
                <div className="relative w-full max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_45px_rgba(4,65,51,0.15)] border border-black/[0.05] transition-shadow duration-300">
                  <Image
                    src="/image/about/second_section01.png"
                    alt="TPHL executives and team members discussing in comfortable lounge"
                    fill
                    sizes="340px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE & TABLET LAYOUT (< lg): Fluid, structured & clean   */}
        {/* ========================================================= */}
        <div className="lg:hidden flex flex-col gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] leading-tight">
              Built On Trust
              <br />
              Proven By Delivery
            </h2>
          </motion.div>

          {/* Image Reel / Gallery */}
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 sm:-mx-8 sm:px-8">
            <div className="shrink-0 snap-center w-[220px] sm:w-[260px] aspect-[3/4]  overflow-hidden relative shadow-md bg-neutral-100">
              <Image
                src="/image/about/second_section03.png"
                alt="Architectural terrace"
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
            <div className="shrink-0 snap-center w-[220px] sm:w-[260px] aspect-[3/4]  overflow-hidden relative shadow-md bg-neutral-100">
              <Image
                src="/image/about/second_section02.png"
                alt="Grand lobby"
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
            <div className="shrink-0 snap-center w-[220px] sm:w-[260px] aspect-[3/4]  overflow-hidden relative shadow-md bg-neutral-100">
              <Image
                src="/image/about/second_section01.png"
                alt="TPHL lounge discussion"
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Narrative & Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start gap-5 max-w-lg"
          >
            <div className="relative w-full max-w-[280px]">
              <div className="w-10 h-[3px] bg-[#1f2723]" />
              <div className="w-full h-[1px] bg-[#E8E2D2] -mt-[1px]" />
            </div>

            <p className="font-sans text-sm leading-relaxed text-[#526058]">
              At TPHL (The Premium Homes Ltd.), Trust Is Not A Claim, It&apos;s
              Our Foundation. From Transparent Dealings To On-Time Delivery,
              Every Decision We Make Is Guided By Our Commitment To Quality,
              Integrity, And The Confidence Of Our Customers.
            </p>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#044133] hover:bg-[#055b4b] text-[#fdfdf8] text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-md active:scale-95"
            >
              EXPLORE PROJECTS
            </Link>
          </motion.div>

          {/* 4 Stats Grid on Mobile */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E8E2D2]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="block font-heading text-4xl sm:text-5xl font-normal text-[#044133] leading-none mb-1.5">
                1200+
              </span>
              <span className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#526058]">
                HAPPY CLIENTS
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block font-heading text-4xl sm:text-5xl font-normal text-[#044133] leading-none mb-1.5">
                4.9/5
              </span>
              <span className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#526058]">
                AVERAGE RATING
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="block font-heading text-4xl sm:text-5xl font-normal text-[#044133] leading-none mb-1.5">
                52+
              </span>
              <span className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#526058]">
                ONGOING PROJECTS
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="block font-heading text-4xl sm:text-5xl font-normal text-[#044133] leading-none mb-1.5">
                98%
              </span>
              <span className="block font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#526058]">
                SATISFACTION RATE
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
