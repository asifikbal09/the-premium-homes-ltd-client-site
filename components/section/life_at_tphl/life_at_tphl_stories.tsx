"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function LifeAtTphlStories() {
  return (
    <section
      aria-label="Stories From The Team"
      className="relative w-full bg-white text-[#1f2723] pt-14 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-24 md:pb-28 overflow-hidden select-none"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <h2 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#054b3c] leading-[1.08] tracking-tight">
            Stories From
            <br />
            The Team.
          </h2>
        </div>

        {/* 
          Journey Cards with Dashed Wave Line & Red Pushpins
        */}
        <div className="relative w-full max-w-[1180px] mx-auto min-h-[340px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center">
          {/* Dashed Wave SVG Path across the cards */}
          <div className="absolute inset-x-0 top-[10%] sm:top-[12%] md:top-[14%] w-full h-[120px] pointer-events-none z-0 overflow-visible">
            <svg
              viewBox="0 0 1200 120"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full stroke-neutral-500/70"
            >
              <path
                d="M -50 70 Q 70 10, 160 35 T 350 45 T 520 20 T 720 40 T 920 15 T 1120 45 T 1250 20"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                fill="none"
              />
            </svg>
          </div>

          {/* Cards Flex/Position Container */}
          <div className="relative z-10 w-full flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto sm:overflow-visible pb-4 pt-6 no-scrollbar">
            {/* Card 1: Recognition Award (Grayscale) */}
            <div
              style={{ transform: "rotate(-6deg)" }}
              className="relative shrink-0 w-[125px] sm:w-[155px] md:w-[185px] lg:w-[210px] aspect-[3/4] z-10 -mr-2 sm:-mr-4 transition-transform duration-300 hover:scale-105 hover:z-30"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 pb-3.5 sm:pb-5 shadow-lg shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/stories-team-award.png"
                    alt="Team member recognition and award ceremony"
                    fill
                    sizes="(max-width: 768px) 150px, 210px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
              {/* Red Pushpin */}
              <div className="absolute top-1 right-2 sm:top-1.5 sm:right-3 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>

            {/* Card 2: Sofa Conversation (Grayscale, tplt-team1) */}
            <div
              style={{ transform: "rotate(4deg)" }}
              className="relative shrink-0 w-[115px] sm:w-[145px] md:w-[175px] lg:w-[195px] aspect-[3/4] z-5 -mr-3 sm:-mr-6 transition-transform duration-300 hover:scale-105 hover:z-30"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 pb-3.5 sm:pb-5 shadow-lg shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/tplt-team1.png"
                    alt="Colleagues discussing plans in the lounge"
                    fill
                    sizes="(max-width: 768px) 140px, 195px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Big Centerpiece - Jenga Team Game (Full Color) */}
            <div
              style={{ transform: "rotate(6deg)" }}
              className="relative shrink-0 w-[180px] sm:w-[240px] md:w-[290px] lg:w-[335px] aspect-[3/4] z-20 shadow-2xl transition-transform duration-300 hover:scale-105 hover:z-30"
            >
              <div className="w-full h-full bg-white p-2 sm:p-2.5 md:p-3 pb-5 sm:pb-7 md:pb-8 shadow-2xl shadow-black/25">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                  <Image
                    src="/image/life-at-tphl/stories-team-center.png"
                    alt="TPHL team members bonding over games at the office"
                    fill
                    priority
                    sizes="(max-width: 768px) 240px, 335px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
              {/* Red Pushpin on top left */}
              <div className="absolute top-1.5 left-4 sm:top-2 sm:left-5 md:top-2.5 md:left-6 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>

            {/* Card 4: TV Presentation (Grayscale, tplt-team04) */}
            <div
              style={{ transform: "rotate(-5deg)" }}
              className="relative shrink-0 w-[120px] sm:w-[150px] md:w-[180px] lg:w-[205px] aspect-[4/3] z-10 -ml-2 sm:-ml-4 transition-transform duration-300 hover:scale-105 hover:z-30"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 pb-3.5 sm:pb-5 shadow-lg shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/tplt-team04.png"
                    alt="Team presentation and project review"
                    fill
                    sizes="(max-width: 768px) 150px, 205px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
              {/* Red Pushpin */}
              <div className="absolute top-1 right-6 sm:top-1.5 sm:right-8 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>

            {/* Card 5: Cultural Celebration (Grayscale, tplt-team06) */}
            <div
              style={{ transform: "rotate(6deg)" }}
              className="relative shrink-0 w-[110px] sm:w-[140px] md:w-[165px] lg:w-[185px] aspect-[3/4] z-5 -ml-3 sm:-ml-5 transition-transform duration-300 hover:scale-105 hover:z-30"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 pb-3.5 sm:pb-5 shadow-lg shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/tplt-team06.png"
                    alt="Traditional cultural festival celebration at TPHL"
                    fill
                    sizes="(max-width: 768px) 140px, 185px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              {/* Red Pushpin */}
              <div className="absolute top-1 right-2 sm:top-1.5 sm:right-3 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>
          </div>
        </div>

        {/* Bottom Description & CTA */}
        <div className="text-center max-w-xl mx-auto mt-10 sm:mt-14 md:mt-16">
          <p className="font-sans text-xs sm:text-sm md:text-[14.5px] text-[#526058] font-normal leading-relaxed mb-6 sm:mb-8">
            TPHL Gives Me The Space To Grow And Contribute To Real Impact. Hear
            From The People Shaping TPHL’s Growth, Culture, And Customer
            Experience.
          </p>

          <Link
            href="/career"
            className="group inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#054b3c] hover:bg-[#075947] transition-all duration-300 shadow-sm active:scale-95"
          >
            <span>JOIN OUR TEAM</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
