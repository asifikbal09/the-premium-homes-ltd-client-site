import React from "react";
import Image from "next/image";

export function AboutFounderTrust() {
  return (
    <section
      aria-label="Founder-Led Trust"
      className="relative w-full overflow-hidden bg-[#0d0d0d] text-white"
    >
      {/* 1. Only the outer side edges get the ambient blur backdrop (NO blur on face) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/image/about/DolonSir.png"
          alt=""
          fill
          priority
          className="object-cover blur-3xl scale-125 opacity-75"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Main 1600 x 1189 Frame Container adhering strictly to Figma box model */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto aspect-[1600/1189] overflow-hidden flex items-center">
        {/* Exact Crisp Unblurred Image Box */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              top: "-19%",
              left: "-8.375%",
              width: "134.75%",
              height: "123.05%",
            }}
          >
            <Image
              src="/image/about/DolonSir.png"
              alt="Mainul Hasan Dulon - Managing Director & CEO"
              fill
              priority
              sizes="(max-width: 1600px) 135vw, 2156px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Subtle dark gradient strictly on text area (NO blur on image/face) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-black/20 to-transparent w-full max-w-[500px] pointer-events-none" />

        {/* Text Content Overlay adhering strictly to Figma Typography */}
        <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 py-8 sm:py-12">
          <div className="flex flex-col items-start text-left max-w-[660px]">
            {/* 1. Title: K Victor Trial, 120px, 500, 100% Line Height */}
            <h2
              className="font-heading text-white font-medium capitalize text-3xl sm:text-5xl md:text-7xl lg:text-[90px] xl:text-[110px] 2xl:text-[120px] leading-[1.0] tracking-normal mb-5 sm:mb-7 md:mb-9 lg:mb-11"
              style={{ fontWeight: 500 }}
            >
              Founder-Led
              <br />
              Trust
            </h2>

            {/* 2. Quote: K Victor Trial, 48px, 500, 120% Line Height */}
            <p
              className="font-heading text-white font-medium capitalize text-base sm:text-xl md:text-2xl lg:text-[36px] xl:text-[44px] 2xl:text-[48px] leading-[1.2] tracking-normal mb-6 sm:mb-8 md:mb-10 lg:mb-12"
              style={{ fontWeight: 500 }}
            >
              At the heart of TPHL is a simple commitment: build trust first, then build everything else around <br /> it. When people <br /> believe in the <br /> process, they <br /> believe in <br /> the home.”
            </p>

            {/* 3. Divider Line */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] h-[1px] bg-white/40 mb-3 sm:mb-4 md:mb-5" />

            {/* 4. Signature: Seaweed Script, 40px, 400, 120% Line Height */}
            <span className="font-signature font-[family-name:var(--font-seaweed-script)] text-white text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-[1.2] select-none mb-1">
              Mainul Hasan Dulon
            </span>

            {/* 5. Designation: Vazirmatn, 20px, 400, 160% Line Height */}
            <span className="font-sans font-normal text-white text-xs sm:text-sm md:text-base lg:text-[20px] leading-[1.6]">
              Managing Director &amp; CEO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
