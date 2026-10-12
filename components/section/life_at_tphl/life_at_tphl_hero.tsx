"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LifeAtTphlHero() {
  return (
    <section
      aria-label="Life At TPHL Hero"
      className="relative w-full bg-[#546360] text-white flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 lg:pt-28"
    >

      {/* Hero Center & Lower Content */}
      <div className="relative z-10 w-full flex flex-col justify-between pt-8 sm:pt-12 md:pt-14">
        {/* 
          Polaroid Photo Strip (clipped cleanly along the bottom baseline):
          Preserves the exact overlapping order, rotations, and positions from design
        */}
        <div className="w-full overflow-hidden h-[180px] sm:h-[220px] md:h-[260px] lg:h-[290px] xl:h-[310px]">
          <div className="w-full max-w-[1440px] mx-auto h-full px-2 sm:px-4">
            <div className="relative w-full h-full min-w-[760px] sm:min-w-0 origin-bottom sm:scale-100 scale-[0.82] -translate-x-[9%] sm:translate-x-0">
              {/* Card 1 (Festive - Front Left): overlaps bottom of Card 2 */}
              <div
                style={{ transform: "rotate(-4deg)" }}
                className="absolute left-[3.5%] md:left-[4.5%] bottom-[-15px] sm:bottom-[-20px] w-[17.5%] sm:w-[17%] max-w-[240px] aspect-[4/3] z-20 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/25">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team06.png"
                      alt="Team festive celebration in traditional attire"
                      fill
                      sizes="(max-width: 768px) 160px, 240px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 (Architecture board - Back Left): tall portrait, sits behind Card 1 & Card 3 */}
              <div
                style={{ transform: "rotate(4deg)" }}
                className="absolute left-[8%] md:left-[9%] bottom-0 w-[17.5%] sm:w-[17%] max-w-[240px] aspect-[3/4] z-10 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/20">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team05.png"
                      alt="Architectural development and planning board review"
                      fill
                      sizes="(max-width: 768px) 160px, 240px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 (Quote Card): White card with solid gold border and deep forest green text */}
              <div
                style={{ transform: "rotate(8deg)" }}
                className="absolute left-[24%] md:left-[25%] bottom-[-10px] sm:bottom-[-16px] w-[20%] sm:w-[19%] max-w-[270px] aspect-[1/1] z-30 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white border-[2.5px] sm:border-[3px] md:border-[3.5px] border-[#b89461] p-2.5 sm:p-3.5 md:p-5 flex flex-col justify-center shadow-xl shadow-black/20">
                  <p className="font-heading text-[#0c382c] text-[10px] sm:text-xs md:text-sm lg:text-[15px] xl:text-[17px] font-normal leading-[1.28] tracking-tight">
                    A culture built
                    <br />
                    around people,
                    <br />
                    stories, ambition, and
                    <br />
                    the human side of
                    <br />
                    building homes.
                  </p>
                </div>
              </div>

              {/* Card 4 (TV Screen Presentation - Center Left): sits behind Card 3 and Card 5 */}
              <div
                style={{ transform: "rotate(-3deg)" }}
                className="absolute left-[41.5%] md:left-[42.5%] bottom-[-5px] sm:bottom-[-8px] w-[18.5%] sm:w-[18%] max-w-[260px] aspect-[16/11] z-10 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/20">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team04.png"
                      alt="Executive team presentation with skyscraper model render"
                      fill
                      sizes="(max-width: 768px) 170px, 260px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Card 5 (TPHL Women Team - Center Right): sits in front of Card 4 and Card 6 */}
              <div
                style={{ transform: "rotate(-4deg)" }}
                className="absolute left-[56.5%] md:left-[57.5%] bottom-[-10px] sm:bottom-[-14px] w-[18.5%] sm:w-[18%] max-w-[260px] aspect-[4/3] z-25 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/25">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team03.png"
                      alt="TPHL team collaborating at conference table"
                      fill
                      sizes="(max-width: 768px) 170px, 260px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Card 6 (Blueprints & Model - Back Right): tall portrait, sits behind Card 5 & Card 7 */}
              <div
                style={{ transform: "rotate(-4deg)" }}
                className="absolute left-[68.5%] md:left-[69.5%] bottom-0 w-[17%] sm:w-[16.5%] max-w-[235px] aspect-[3/4] z-10 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/20">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team02.png"
                      alt="Architecture and engineering team reviewing scale models"
                      fill
                      sizes="(max-width: 768px) 160px, 235px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Card 7 (Lounge Discussion - Far Right): sits in front of Card 6 */}
              <div
                style={{ transform: "rotate(6deg)" }}
                className="absolute left-[80%] md:left-[81%] bottom-[-5px] sm:bottom-[-10px] w-[17%] sm:w-[16%] max-w-[230px] aspect-[3/4] z-20 transition-transform duration-300 hover:scale-105 hover:z-40"
              >
                <div className="w-full h-full bg-white p-1 sm:p-1.5 md:p-2 pb-3 sm:pb-4 shadow-xl shadow-black/25">
                  <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                    <Image
                      src="/image/life-at-tphl/tplt-team1.png"
                      alt="Team members enjoying conversation in lounge"
                      fill
                      sizes="(max-width: 768px) 150px, 230px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 
          Main Headline:
          "Life At"
          "TPHL"
          Rendered in luxury serif (Cormorant Garamond) exactly matching the design
        */}
        <div className="w-full text-center px-4 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-14 sm:pb-20 md:pb-28 lg:pb-32 select-none">
          <h1 className="font-heading font-normal text-white text-center leading-[0.88] sm:leading-[0.86] tracking-tight">
            <span className="block text-[64px] sm:text-[96px] md:text-[128px] lg:text-[154px] xl:text-[180px] font-normal">
              Life At
            </span>
            <span className="block text-[64px] sm:text-[98px] md:text-[132px] lg:text-[160px] xl:text-[188px] font-normal tracking-[0.04em] uppercase mt-1 sm:mt-2 md:mt-3">
              TPHL
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
