"use client";

import React from "react";
import Image from "next/image";

interface CulturePillar {
  number: string;
  title: string;
  description: string;
}

const PILLARS: CulturePillar[] = [
  {
    number: "01",
    title: "Trust In Every\nDecision",
    description: "We Work With Clarity, Honesty,\nAnd Shared Responsibility.",
  },
  {
    number: "02",
    title: "Ownership In\nEvery Role",
    description:
      "Everyone Has Space To Take\nResponsibility And Make An Impact.",
  },
  {
    number: "03",
    title: "Growth Through\nLearning",
    description: "We Support People Who Want To\nImprove, Lead, And Grow.",
  },
  {
    number: "04",
    title: "Collaboration\nAcross Teams",
    description:
      "Sales, Engineering, Operations,\nSupport Work Together On One Goal.",
  },
];

export function LifeAtTphlCulture() {
  return (
    <section
      aria-label="A Culture Of Trust, Growth, And Ownership"
      className="relative w-full bg-[#546360] text-white overflow-hidden"
    >
      {/* Top Banner Image: Team Collaboration with Building Scale Model */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.4/1] max-h-[980px] overflow-hidden bg-neutral-900">
        <Image
          src="/image/life-at-tphl/tplt-team02.png"
          alt="TPHL architecture and project team collaborating around blueprints and building scale models"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Bottom Content Area */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-14 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-24 md:pb-28 lg:pb-32">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <h2 className="font-heading font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] text-white leading-[1.12] sm:leading-[1.1] tracking-tight">
              A Culture Of Trust,
              <br />
              Growth, And Ownership.
            </h2>
          </div>

          {/* 4 Pillars Grid with Thin Vertical Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-white/20">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="border-r border-b lg:border-b-0 border-white/20 p-6 sm:p-7 md:p-8 lg:p-9 xl:p-10 flex flex-col justify-between min-h-[250px] sm:min-h-[280px] md:min-h-[310px] transition-colors duration-300 hover:bg-white/[0.04]"
              >
                {/* Large Display Number */}
                <span className="font-heading text-4xl sm:text-5xl md:text-[54px] font-light text-white select-none leading-none">
                  {pillar.number}
                </span>

                {/* Title & Description */}
                <div className="mt-8 sm:mt-12 md:mt-16">
                  <h3 className="font-heading text-lg sm:text-xl md:text-[22px] text-white font-normal leading-snug mb-2.5 sm:mb-3 whitespace-pre-line">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-white/75 font-light leading-relaxed whitespace-pre-line">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
