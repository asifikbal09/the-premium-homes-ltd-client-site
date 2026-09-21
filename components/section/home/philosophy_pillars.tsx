import React from "react";

interface PillarItem {
  id: string;
  title: string | React.ReactNode;
  icon: React.ReactNode;
}

const PILLARS: PillarItem[] = [
  {
    id: "transparency",
    title: "Transparency",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#d0a65b]"
        aria-hidden="true"
      >
        {/* Left bracket framing */}
        <path d="M22 10 H10 V54 H22" />
        {/* Right bracket framing */}
        <path d="M42 10 H54 V54 H42" />
        {/* Central angled diamond */}
        <polygon points="32,20 44,32 32,44 20,32" />
      </svg>
    ),
  },
  {
    id: "growth",
    title: "Growth",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#d0a65b]"
        aria-hidden="true"
      >
        {/* Outer chamfered polygon */}
        <polygon points="24,8 56,8 56,56 8,56 8,24" />
        {/* Middle nested chamfered polygon */}
        <polygon points="24,16 48,16 48,48 16,48 16,24" />
        {/* Inner concentric square */}
        <rect x="24" y="24" width="16" height="16" />
      </svg>
    ),
  },
  {
    id: "client-experience",
    title: (
      <>
        Client
        <br />
        Experience
      </>
    ),
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#d0a65b]"
        aria-hidden="true"
      >
        {/* Outer boundary circle */}
        <circle cx="32" cy="32" r="24" />
        {/* Bottom concentric resonance wave arcs */}
        <path d="M 37.85 39.49 A 9.5 9.5 0 0 1 26.15 39.49" />
        <path d="M 42.47 45.40 A 17 17 0 0 1 21.53 45.40" />
        {/* Top-left concentric resonance wave arcs */}
        <path d="M 22.59 33.32 A 9.5 9.5 0 0 1 28.44 23.19" />
        <path d="M 15.17 34.37 A 17 17 0 0 1 25.63 16.24" />
        {/* Top-right concentric resonance wave arcs */}
        <path d="M 35.56 23.19 A 9.5 9.5 0 0 1 41.41 33.32" />
        <path d="M 38.37 16.24 A 17 17 0 0 1 48.83 34.37" />
      </svg>
    ),
  },
  {
    id: "trust",
    title: "Trust",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-[#d0a65b]"
        aria-hidden="true"
      >
        {/* Outer circle */}
        <circle cx="32" cy="32" r="24" />
        {/* Central hexagon */}
        <polygon points="32,20 42.4,26 42.4,38 32,44 21.6,38 21.6,26" />
        {/* Top connecting vertical line */}
        <line x1="32" y1="8" x2="32" y2="20" strokeLinecap="round" />
        {/* Bottom connecting vertical line */}
        <line x1="32" y1="44" x2="32" y2="56" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function PhilosophyPillars() {
  return (
    <section
      aria-labelledby="philosophy-heading"
      className="w-full bg-white py-8 sm:py-16 lg:py-24 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12">
        {/* Section Heading matching Figma specs */}
        <h2
          id="philosophy-heading"
          className="font-heading text-xl sm:text-3xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-[115%] tracking-tight mb-4 sm:mb-8 lg:mb-14"
        >
          The Pillars Of Our Philosophy
        </h2>

        {/* 4 Pillars Responsive Grid: 4 columns across all screens */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-5 lg:gap-6">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="group relative aspect-[3/4] p-2.5 sm:p-5 md:p-7 lg:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(4,65,51,0.06)] cursor-default"
              style={{
                background: "linear-gradient(180deg, #FEF8ED 0%, #FFFFFF 100%)",
              }}
            >
              {/* Pillar Icon Header */}
              <div className="flex items-start justify-start">
                <div className="transition-transform duration-300 group-hover:scale-105">
                  {pillar.icon}
                </div>
              </div>

              {/* Pillar Title Footer */}
              <h3 className="font-heading text-[10px] sm:text-base md:text-2xl lg:text-[32px] font-normal text-[#044133] leading-[112%] tracking-normal">
                {pillar.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
