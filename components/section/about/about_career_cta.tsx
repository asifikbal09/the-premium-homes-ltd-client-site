import React from "react";
import Image from "next/image";
import Link from "next/link";

export function AboutCareerCta() {
  return (
    <section
      aria-label="Start Your Career Journey With Us"
      className="relative w-full py-16 sm:py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden"
    >
      {/* Full-bleed Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/image/life-at-tphl/tphl-team07.png"
          alt="TPHL executives discussing career plans"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
      </div>

      {/* Center White Card Container */}
      <div className="relative z-10 w-full max-w-[480px] sm:max-w-[520px] px-4 sm:px-6">
        <div className="bg-white rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden">
          {/* Top Image Preview Box */}
          <div className="relative w-full aspect-[16/11] overflow-hidden bg-neutral-100">
            <Image
              src="/image/life-at-tphl/tphl-team07.png"
              alt="TPHL career collaboration"
              fill
              priority
              sizes="520px"
              className="object-cover object-[center_42%]"
            />
          </div>

          {/* Bottom Content Area */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 text-center flex flex-col items-center justify-center">
            <span className="text-[#c69a59] font-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase mb-2 select-none">
              CAREER
            </span>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-[34px] font-normal text-[#044133] leading-[1.18] tracking-tight mb-6 sm:mb-7">
              Start Your Career
              <br />
              Journey With Us
            </h2>

            <Link
              href="/careers"
              className="inline-flex items-center justify-center px-7 sm:px-8 py-3 rounded-full bg-[#044133] text-[#d0a65b] hover:bg-[#065b49] text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              JOIN THE TEAM
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
