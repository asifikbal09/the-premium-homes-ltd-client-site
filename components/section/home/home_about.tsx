import React from "react";
import Image from "next/image";
import Link from "next/link";

interface StatItem {
  id: string;
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    id: "partnerships",
    value: "12+",
    label: "INTERNATIONAL\nPARTNERSHIPS",
  },
  {
    id: "years",
    value: "10+",
    label: "YEARS OF DEVELOPMENT\nEXCELLENCE",
  },
  {
    id: "projects",
    value: "75+",
    label: "OUTSTANDING\nPROJECTS",
  },
  {
    id: "countries",
    value: "02",
    label: "COUNTRIES OF\nOPERATION",
  },
];

export function HomeAbout() {
  return (
    <section
      aria-labelledby="about-heading"
      className="w-full bg-white pb-20 sm:pb-24 lg:pb-32 pt-6 sm:pt-10 lg:pt-12 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Main Content: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Isometric Brownstone Illustration */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[500px] xl:max-w-[560px] aspect-[1000/920]">
              <Image
                src="/image/home_about_image.png"
                alt="A Development House Built On Trust And Detail"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Column: Narrative & Call to Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-[#C49C57] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">
              ABOUT
            </span>

            <h2
              id="about-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-normal text-[#044133] leading-[1.12] tracking-tight mb-6"
            >
              A Development House
              <br className="hidden sm:inline" /> Built On Trust And Detail
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#526058] leading-relaxed max-w-xl mb-8">
              Every part of this project is shaped around how people truly live.
              From open spaces and shared moments to private comfort and daily
              convenience, the community is designed to make everyday life feel
              easier, warmer, and more connected.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#044133] text-[#FDFDF8] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:bg-[#055b4b] hover:shadow-lg hover:-translate-y-0.5"
            >
              MORE ABOUT US
            </Link>
          </div>
        </div>

        {/* Subtle Horizontal Divider Line */}
        <div className="w-full h-px bg-[#E8E2D2] my-14 sm:my-18 lg:my-24" />

        {/* Bottom Metrics / Stats Grid: 4 columns across all devices */}
        <div className="grid grid-cols-4 gap-y-4 sm:gap-y-8">
          {STATS.map((stat, idx) => {
            const borderClasses = idx < 3 ? "border-r border-[#E8E2D2]" : "";

            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center justify-center text-center px-1.5 sm:px-4 md:px-6 ${borderClasses}`}
              >
                <span className="font-heading text-xl sm:text-4xl md:text-5xl lg:text-[68px] font-normal text-[#044133] leading-none mb-1.5 sm:mb-3 md:mb-4">
                  {stat.value}
                </span>
                <span className="font-sans text-[8px] sm:text-[10px] md:text-xs lg:text-[13px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#526058] leading-tight whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
