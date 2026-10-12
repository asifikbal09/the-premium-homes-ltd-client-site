import React from "react";
import Image from "next/image";

export function AboutFounderTrust() {
  return (
    <section
      aria-label="Founder-Led Trust"
      className="relative w-full overflow-hidden bg-[#0d0d0d] text-white py-12 sm:py-16 md:py-20 lg:py-28"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/about/DolonSir_section.png"
          alt="Mainul Hasan Dulon - Managing Director & CEO"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[right_top] md:object-right lg:object-[center_top] xl:object-center"
        />

        {/* Soft dark vignette on the left to ensure 100% crisp readability of white typography while retaining room ambiance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent md:w-[65%]" />
        <div className="absolute inset-0 bg-black/35 md:hidden" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col items-start text-left max-w-[656px]">
          {/* Main Title: 120px font in Figma, 500 Medium, 100% line height */}
          <h2
            className="font-heading font-medium text-white tracking-normal leading-[1.0] text-4xl sm:text-6xl md:text-7xl lg:text-[96px] xl:text-[120px] max-w-[656px] mb-6 sm:mb-8 md:mb-12 lg:mb-14"
            style={{ fontWeight: 500 }}
          >
            Founder-Led
            <br />
            Trust
          </h2>

          {/* Quote Paragraph: 48px font in Figma, 500 Medium, 120% line height */}
          <p
            className="font-heading font-medium text-white tracking-normal leading-[1.2] text-lg sm:text-2xl md:text-3xl lg:text-[40px] xl:text-[48px] max-w-[656px] mb-6 sm:mb-8 md:mb-10 lg:mb-12"
            style={{ fontWeight: 500 }}
          >
            At The Heart Of TPHL Is A Simple Commitment: Build Trust First, Then
            Build Everything Else Around It. When People Believe In The Process,
            They Believe In The Home.”
          </p>

          {/* Subtle Horizontal Divider */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] h-[1px] bg-white/40 mb-4 sm:mb-5 md:mb-6" />

          {/* Founder Signature: Seaweed Script */}
          <span className="font-signature font-[family-name:var(--font-seaweed-script)] text-white text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight select-none mb-1 sm:mb-1.5">
            Mainul Hasan Dulon
          </span>

          {/* Founder Designation: Vazirmatn / Sans-serif */}
          <span className="font-sans font-normal text-white/90 text-xs sm:text-sm md:text-base tracking-wide">
            Managing Director &amp; CEO
          </span>
        </div>
      </div>
    </section>
  );
}
