import React from "react";
import Image from "next/image";
import Link from "next/link";

export function PropertyPredictionSection() {
  return (
    <section
      aria-label="Property Price Predictor Section"
      className="relative w-full overflow-hidden py-16 sm:py-24 md:py-32 lg:py-36 flex items-center justify-center min-h-[600px] sm:min-h-[700px] md:min-h-[780px]"
    >
      {/* Background Architectural Photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/prediction/predictionBg.png"
          alt="Modern luxury residence at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Floating Center Card */}
      <div className="relative z-10 w-full max-w-[560px] mx-4 sm:mx-6 px-2">
        <div className="bg-white shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden transition-transform duration-300 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          {/* Top Architectural Building Image */}
          <div className="relative w-full aspect-[594/468] overflow-hidden bg-white">
            <Image
              src="/image/prediction/predictionCard.png"
              alt="Luxury residential high-rise architecture"
              fill
              sizes="(max-width: 640px) 90vw, 560px"
              className="object-cover object-center p-2  transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>

          {/* Bottom Card Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 md:py-12 text-center flex flex-col items-center justify-center">
            {/* Eyebrow */}
            <span className="text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b]">
              START YOUR JOURNEY
            </span>

            {/* Display Headline */}
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal text-[#044133] leading-[1.18] sm:leading-[1.15] tracking-tight mt-2.5 sm:mt-3">
              Find Your Next Address
              <br />
              With TPH
            </h2>

            {/* CTA Button */}
            <Link
              href="/#contact"
              className="group relative inline-flex items-center justify-center rounded-full px-7 sm:px-9 py-3 sm:py-3.5 text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-[#d0a65b] bg-[#044133] hover:bg-[#065b4b] border border-[#d0a65b]/30 shadow-md transition-all duration-300 mt-6 sm:mt-8 active:scale-95 cursor-pointer"
            >
              <span className="relative z-10 transition-transform duration-200 group-hover:scale-[1.02]">
                TRY PROPERTY PRICE PREDICTOR
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
