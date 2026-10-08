"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface JourneyImageItem {
  id: string;
  src: string;
  alt: string;
}

const JOURNEY_IMAGES: JourneyImageItem[] = [
  {
    id: "journey-01",
    src: "/image/about/journy/journy03.png",
    alt: "TPHL consultation lounge",
  },
  {
    id: "journey-02",
    src: "/image/about/journy/journy07.png",
    alt: "TPHL corporate team discussion",
  },
  {
    id: "journey-03",
    src: "/image/about/journy/journy09.png",
    alt: "TPHL 3D architectural showcase",
  },
  {
    id: "journey-04",
    src: "/image/about/journy/journy04.png",
    alt: "TPHL architectural planning",
  },
  {
    id: "journey-05",
    src: "/image/about/journy/journy10.png",
    alt: "TPHL architectural consultation",
  },
  {
    id: "journey-06",
    src: "/image/about/journy/journy12.png",
    alt: "TPHL community celebration",
  },
  {
    id: "journey-07",
    src: "/image/about/journy/journy08.png",
    alt: "TPHL tree planting initiative",
  },
  {
    id: "journey-08",
    src: "/image/about/journy/journy11.png",
    alt: "TPHL team milestone celebration",
  },
  {
    id: "journey-09",
    src: "/image/about/journy/journy02.png",
    alt: "TPHL milestone recognition",
  },
  {
    id: "journey-10",
    src: "/image/about/journy/journy05.png",
    alt: "TPHL family gathering",
  },
  {
    id: "journey-11",
    src: "/image/about/journy/journy01.png",
    alt: "TPHL architectural blueprints",
  },
  {
    id: "journey-12",
    src: "/image/about/journy/journy06.png",
    alt: "TPHL official ceremony",
  },
];

export function AboutBuildingJourney() {
  const [dimensions, setDimensions] = useState({
    radius: 380,
    cardW: 120,
    cardH: 152,
    offset: 90,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 420) {
        setDimensions({ radius: 150, cardW: 46, cardH: 58, offset: 25 });
      } else if (w < 640) {
        setDimensions({ radius: 180, cardW: 54, cardH: 68, offset: 30 });
      } else if (w < 768) {
        setDimensions({ radius: 240, cardW: 72, cardH: 92, offset: 40 });
      } else if (w < 1024) {
        setDimensions({ radius: 300, cardW: 92, cardH: 118, offset: 55 });
      } else if (w < 1280) {
        setDimensions({ radius: 340, cardW: 106, cardH: 135, offset: 70 });
      } else {
        setDimensions({ radius: 380, cardW: 120, cardH: 152, offset: 90 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] xl:min-h-[760px] flex items-center justify-center select-none py-8 sm:py-10">
      {/* Inline Keyframes for smooth GPU rotation */}
      <style>{`
        @keyframes spinLeftWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinRightWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* ========================================================= */}
      {/* CENTERPIECE TITLE: "The Building Journey" (3 lines)        */}
      {/* Matches user design reference perfectly                    */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 max-w-xl">
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[90px] font-normal text-[#044133] leading-[1.02] tracking-tight">
          <span className="block">The</span>
          <span className="block">Building</span>
          <span className="block">Journey</span>
        </h2>
      </div>

      {/* ========================================================= */}
      {/* LEFT WHEEL: Pushed outward beyond left border             */}
      {/* ========================================================= */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-auto"
        style={{ left: `-${dimensions.offset}px` }}
      >
        <div
          className="relative flex items-center justify-center hover:[animation-play-state:paused]"
          style={{
            width: 0,
            height: 0,
            animation: "spinLeftWheel 85s linear infinite",
            transformOrigin: "0 0",
          }}
        >
          {JOURNEY_IMAGES.map((item, index) => {
            const angle = index * (360 / JOURNEY_IMAGES.length);
            const radians = (angle * Math.PI) / 180;
            const x = Math.round(dimensions.radius * Math.sin(radians));
            const y = Math.round(-dimensions.radius * Math.cos(radians));

            return (
              <div
                key={`left-${item.id}`}
                className="absolute top-0 left-0 transition-transform duration-300"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`,
                  width: `${dimensions.cardW}px`,
                  height: `${dimensions.cardH}px`,
                }}
              >
                {/* Sharp corner card (rounded-none) */}
                <div className="relative w-full h-full rounded-none overflow-hidden bg-neutral-100 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-black/5 hover:scale-108 transition-transform duration-300 cursor-pointer">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90px, (max-width: 1024px) 140px, 180px"
                    className="object-cover rounded-none"
                    priority={index < 4}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT WHEEL: Pushed outward beyond right border           */}
      {/* ========================================================= */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-auto"
        style={{ right: `-${dimensions.offset}px` }}
      >
        <div
          className="relative flex items-center justify-center hover:[animation-play-state:paused]"
          style={{
            width: 0,
            height: 0,
            animation: "spinRightWheel 85s linear infinite",
            transformOrigin: "0 0",
          }}
        >
          {JOURNEY_IMAGES.map((item, index) => {
            // Offset by 180deg so the first cards start visible inside the viewport
            const angle = index * (360 / JOURNEY_IMAGES.length) + 180;
            const radians = (angle * Math.PI) / 180;
            const x = Math.round(dimensions.radius * Math.sin(radians));
            const y = Math.round(-dimensions.radius * Math.cos(radians));

            return (
              <div
                key={`right-${item.id}`}
                className="absolute top-0 left-0 transition-transform duration-300"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`,
                  width: `${dimensions.cardW}px`,
                  height: `${dimensions.cardH}px`,
                }}
              >
                {/* Sharp corner card (rounded-none) */}
                <div className="relative w-full h-full rounded-none overflow-hidden bg-neutral-100 shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-black/5 hover:scale-108 transition-transform duration-300 cursor-pointer">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 90px, (max-width: 1024px) 140px, 180px"
                    className="object-cover rounded-none"
                    priority={index < 4}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
