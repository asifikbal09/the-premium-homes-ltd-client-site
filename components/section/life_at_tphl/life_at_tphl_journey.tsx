"use client";

import React from "react";
import Image from "next/image";

interface JourneyItem {
  id: string;
  title: string;
  watermark: string;
  image: string;
  alt: string;
  bgColor: string;
  imagePosition?: string;
}

const JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: "festival-celebrations",
    title: "Festival Celebrations",
    watermark: "Festive",
    image: "/image/life-at-tphl/journey/tphl-journey02.png",
    alt: "TPHL team celebrating traditional festive occasions together in festive attire",
    bgColor: "#973225",
    imagePosition: "object-[center_24%]",
  },
  {
    id: "team-outings",
    title: "Team Outings",
    watermark: "Outdoor",
    image: "/image/life-at-tphl/journey/tphl-journey03.png",
    alt: "TPHL team participating in greener community tree planting outing",
    bgColor: "#546360",
    imagePosition: "object-[center_35%]",
  },
  {
    id: "special-days",
    title: "Special Days",
    watermark: "Special",
    image: "/image/life-at-tphl/journey/tphl-journey04.png",
    alt: "TPHL team celebrating birthdays and special milestones with cake cutting ceremony",
    bgColor: "#89553f",
    imagePosition: "object-center",
  },
  {
    id: "team-lunches",
    title: "Team Lunches",
    watermark: "Lunches",
    image: "/image/life-at-tphl/journey/tphl-journey05.png",
    alt: "TPHL team sharing lunch and conversation in company dining space",
    bgColor: "#635454",
    imagePosition: "object-center",
  },
  {
    id: "project-milestones",
    title: "Project Milestones",
    watermark: "Project",
    image: "/image/life-at-tphl/journey/tphl-journey01.png",
    alt: "TPHL architecture and project team collaborating around building scale models and blueprints",
    bgColor: "#4c4d27",
    imagePosition: "object-center",
  },
];

export function LifeAtTphlJourney() {
  return (
    <section
      aria-label="More Than Work, A Shared Journey"
      className="relative w-full bg-white text-[#1f2723] py-14 sm:py-20 md:py-24 lg:py-28 overflow-hidden select-none"
    >
      <div className="max-w-[1360] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14 lg:mb-16">
          <h2 className="font-heading font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] text-[#054b3c] leading-[1.12] sm:leading-[1.1] tracking-tight">
            More Than Work,
            <br />
            A Shared Journey.
          </h2>
        </div>

        {/* Stack of 5 Journey Cards */}
        <div className="flex flex-col gap-3.5 sm:gap-4 md:gap-5">
          {JOURNEY_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group relative w-full grid grid-cols-2 aspect-[2.26/1] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* Left Side: Photo */}
              <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 420px, 460px"
                  className={`object-cover ${item.imagePosition || "object-center"} transition-transform duration-700 ease-out group-hover:scale-105`}
                />
              </div>

              {/* Right Side: Colored Panel with Title and Subtle Watermark */}
              <div
                className="relative w-full h-full p-3.5 sm:p-5 md:p-7 lg:p-8 flex flex-col justify-between overflow-hidden"
                style={{ backgroundColor: item.bgColor }}
              >
                {/* Top Label */}
                <h3 className="font-heading font-normal text-xs sm:text-base md:text-lg lg:text-xl text-[#FAF7F2] leading-tight tracking-normal">
                  {item.title}
                </h3>

                {/* Bottom Watermark */}
                <span className="font-heading font-light text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[80px] text-white/20 leading-none select-none tracking-tight transition-colors duration-300 group-hover:text-white/25">
                  {item.watermark}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
