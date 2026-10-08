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
      {/* Section Heading */}
      <div className="w-full text-center max-w-3xl mx-auto px-4 mb-8 sm:mb-12 md:mb-14">
        <h2 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#054b3c] leading-[1.08] tracking-tight">
          Stories From
          <br />
          The Team.
        </h2>
      </div>

      {/* 
        Full-Width Photo Stage (100% width edge-to-edge dashed line)
      */}
      <div className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[440px] md:min-h-[500px] lg:min-h-[540px]">
        {/* 
          Continuous Dashed Wave SVG spanning edge-to-edge (2560px centered)
          Mathematically touches all 4 red pins at exact troughs:
          Pin 1: (930, 46)
          Pin 2: (1200, 40)
          Pin 3: (1612, 38)
          Pin 4: (1835, 44)
        */}
        <div className="absolute top-[17px] left-1/2 -translate-x-1/2 w-[2560px] h-[100px] pointer-events-none z-0 overflow-visible">
          <svg
            viewBox="0 0 2560 100"
            className="w-full h-full stroke-[#4a5550]/75"
            fill="none"
          >
            <path
              d="M 0 56 Q 465 14, 930 46 Q 1065 8, 1200 40 Q 1406 6, 1612 38 Q 1723 12, 1835 44 Q 2195 16, 2560 52"
              strokeWidth="1.8"
              strokeDasharray="7 7"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* 
          Centered Unified Photo Cluster (5 Photos matching reference composition)
          Centered horizontally at the exact center of the wave
        */}
        <div className="relative z-10 w-full max-w-[1140px] mx-auto flex items-start justify-center px-4 sm:px-6">
          {/* GROUP 1: Left Pair (Card 1 & Card 2) */}
          <div className="relative z-10 flex items-start shrink-0 mr-3 sm:mr-5 md:mr-6 lg:mr-7 pt-1 sm:pt-2">
            {/* Card 1: Recognition Award Ceremony */}
            <div
              style={{ transform: "rotate(-8deg)" }}
              className="relative z-20 w-[115px] sm:w-[155px] md:w-[190px] lg:w-[205px] aspect-[3/4] transition-transform duration-300 hover:scale-105 hover:z-40"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 md:p-2.5 shadow-xl shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/stories-team-award.png"
                    alt="Team member recognition and award ceremony"
                    fill
                    sizes="(max-width: 768px) 155px, 205px"
                    className="object-cover object-top scale-[1.8] origin-top"
                  />
                </div>
              </div>
              {/* Red Pushpin 1 (Top-right corner, aligns with Wave Dip 1) */}
              <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>

            {/* Card 2: Lounge Conversation (Tucked behind Card 1) */}
            <div
              style={{ transform: "rotate(5deg)" }}
              className="relative z-10 w-[105px] sm:w-[145px] md:w-[175px] lg:w-[190px] aspect-[3/4] -ml-5 sm:-ml-8 md:-ml-10 lg:-ml-12 mt-1 sm:mt-2 transition-transform duration-300 hover:scale-105 hover:z-40"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 md:p-2.5 shadow-xl shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/tplt-team1.png"
                    alt="Colleagues discussing plans in the lounge"
                    fill
                    sizes="(max-width: 768px) 145px, 190px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP 2: Center Hero Card (Card 3: Jenga Team Game) */}
          <div className="relative z-20 shrink-0">
            <div
              style={{ transform: "rotate(4deg)" }}
              className="relative w-[175px] sm:w-[245px] md:w-[295px] lg:w-[325px] aspect-[3/4] transition-transform duration-300 hover:scale-105 hover:z-40"
            >
              <div className="w-full h-full bg-white p-2 sm:p-2.5 md:p-3.5 shadow-2xl shadow-black/25">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                  <Image
                    src="/image/life-at-tphl/stories-team-center.png"
                    alt="TPHL team members bonding over games at the office"
                    fill
                    priority
                    sizes="(max-width: 768px) 245px, 325px"
                    className="object-cover object-center scale-[1.12]"
                  />
                </div>
              </div>
              {/* Red Pushpin 2 (Top edge ~25% from left, aligns with Wave Dip 2) */}
              <div className="absolute -top-1.5 sm:-top-2 left-[25%] w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>
          </div>

          {/* GROUP 3: Right Pair (Card 4 & Card 5) */}
          <div className="relative z-10 flex items-start shrink-0 ml-3 sm:ml-5 md:ml-6 lg:ml-7 pt-1 sm:pt-2">
            {/* Card 4: TV Presentation (Portrait aspect ratio matching reference) */}
            <div
              style={{ transform: "rotate(-6deg)" }}
              className="relative z-20 w-[115px] sm:w-[150px] md:w-[190px] lg:w-[205px] aspect-[3/4] transition-transform duration-300 hover:scale-105 hover:z-40"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 md:p-2.5 shadow-xl shadow-black/15">
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
              {/* Red Pushpin 3 (Top edge ~72% from left, aligns with Wave Dip 3) */}
              <div className="absolute -top-1.5 sm:-top-2 right-[24%] w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>

            {/* Card 5: Cultural Celebration (Tucked behind Card 4) */}
            <div
              style={{ transform: "rotate(7deg)" }}
              className="relative z-10 w-[105px] sm:w-[140px] md:w-[175px] lg:w-[190px] aspect-[3/4] -ml-5 sm:-ml-8 md:-ml-10 lg:-ml-12 mt-1 sm:mt-2 transition-transform duration-300 hover:scale-105 hover:z-40"
            >
              <div className="w-full h-full bg-white p-1.5 sm:p-2 md:p-2.5 shadow-xl shadow-black/15">
                <div className="relative w-full h-full overflow-hidden bg-neutral-100 grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src="/image/life-at-tphl/tplt-team06.png"
                    alt="Traditional cultural festival celebration at TPHL"
                    fill
                    sizes="(max-width: 768px) 140px, 190px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              {/* Red Pushpin 4 (Top-right corner, aligns with Wave Dip 4) */}
              <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] rounded-full bg-[#dc2626] border-2 border-white shadow-md z-30" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Description & CTA */}
      <div className="text-center max-w-2xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4">
        <p className="font-sans text-xs sm:text-sm md:text-[14.5px] text-[#4a5550] font-normal leading-relaxed mb-6 sm:mb-8">
          TPHL Gives Me The Space To Grow And Contribute To Real
          <br className="hidden sm:inline" /> Impact. Hear From The People
          Shaping TPHL’s Growth,
          <br className="hidden sm:inline" /> Culture, And Customer Experience.
        </p>

        <Link
          href="/career"
          className="group inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#054b3c] hover:bg-[#075947] transition-all duration-300 shadow-sm active:scale-95"
        >
          <span>JOIN OUR TEAM</span>
        </Link>
      </div>
    </section>
  );
}
