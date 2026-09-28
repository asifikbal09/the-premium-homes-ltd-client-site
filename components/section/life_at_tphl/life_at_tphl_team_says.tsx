"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface TeamQuote {
  id: string;
  name: string;
  role: string;
  image: string;
  headline: string;
  quote: string;
  imagePosition?: string;
}

const TEAM_QUOTES: TeamQuote[] = [
  {
    id: "mehedi-h-jony",
    name: "Mehedi H. Jony",
    role: "Head of IT & Digital Marketing",
    image: "/image/team/MehediHJonyBoss.png",
    headline: "Here, Every Role Feels Connected To Something Bigger.",
    quote:
      "Working at TPHL has helped me grow professionally while contributing to projects that matter to real families.",
    imagePosition: "object-[center_28%]",
  },
  {
    id: "mahfuza-shikder-tanha",
    name: "Mahfuza Shikder Tanha",
    role: "Director",
    image: "/image/team/MahfuzaShikderTanha.png",
    headline: "Ambition Is Matched With Opportunity Here.",
    quote:
      "The company is growing fast, and that creates space for people to grow with it.",
    imagePosition: "object-[center_32%]",
  },
  {
    id: "md-golam-imran",
    name: "Md. Golam Imran",
    role: "Head of Client Experience",
    image: "/image/team/MdGolamImam.png",
    headline: "Ambition Is Matched With Opportunity Here.",
    quote:
      "The company is growing fast, and that creates space for people to grow with it.",
    imagePosition: "object-[center_28%]",
  },
  {
    id: "alfesani-shuvo",
    name: "Alfesani Shuvo",
    role: "Head of Operations & Control",
    image: "/image/team/AlfaaniShuvo.png",
    headline: "Collaboration Powers Everything We Build.",
    quote:
      "Working with cross-functional teams toward shared goals creates an environment where everyone thrives.",
    imagePosition: "object-[center_28%]",
  },
  {
    id: "mahbuba-reza-cpa",
    name: "Mahbuba Reza CPA",
    role: "Executive Director",
    image: "/image/team/MahbubaRezaCPA.png",
    headline: "Integrity And Long-Term Vision Guide Every Step.",
    quote:
      "Every milestone we reach is rooted in genuine transparency, sound ethics, and our shared commitment to excellence.",
    imagePosition: "object-[center_26%]",
  },
  {
    id: "md-rayhan-bhuiyan",
    name: "Md. Rayhan Bhuiyan",
    role: "General Manager, Sales",
    image: "/image/team/MdRayhanBhuiyan.png",
    headline: "Delivering Meaningful Journeys For Families.",
    quote:
      "Helping families find their dream homes brings purpose and joy to the work we do every single day.",
    imagePosition: "object-[center_28%]",
  },
];

export function LifeAtTphlTeamSays() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-team-card]");
    const cardWidth = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const scrollOffset = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  return (
    <section
      aria-label="What Our Team Says"
      className="relative w-full bg-white text-[#1f2723] py-14 sm:py-20 md:py-24 lg:py-28 overflow-hidden select-none"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Header: Title & Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12 md:mb-14">
          <h2 className="font-heading font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#054b3c] leading-[1.12] tracking-tight">
            What Our Team Says.
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous team testimonial"
              disabled={!canScrollLeft}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#054b3c] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? "text-[#054b3c] hover:bg-[#054b3c]/5 active:scale-95"
                  : "text-[#054b3c]/40 border-[#054b3c]/30 cursor-not-allowed"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next team testimonial"
              disabled={!canScrollRight}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#054b3c] text-white flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? "hover:bg-[#075947] active:scale-95 shadow-sm"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials Slider Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 md:gap-7 overflow-x-auto scroll-smooth no-scrollbar scrollbar-none  snap-x snap-mandatory pb-4 pt-1"
        >
          {TEAM_QUOTES.map((item) => (
            <article
              key={item.id}
              data-team-card
              className="w-[85vw] sm:w-[350px] md:w-[380px] lg:w-[calc(33.333%-19px)] shrink-0 snap-start bg-[#FAF7F2] p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-md"
            >
              {/* Card Top: Ribbon & Title */}
              <div className="relative">
                {/* Golden Bookmark Ribbon */}
                <div className="w-[18px] absolute top-[-32px] left-[-10px] h-[26px] text-[#c59247] shrink-0 mb-4 sm:mb-5">
                  <svg
                    viewBox="0 0 18 26"
                    fill="currentColor"
                    className="w-full h-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 18,0 18,26 9,20 0,26" />
                  </svg>
                </div>

                {/* Headline */}
                <h3 className="font-heading font-normal text-xl sm:text-2xl md:text-[25px] text-[#054b3c] leading-[1.2] tracking-tight min-h-[58px] mb-5 sm:mb-6">
                  {item.headline}
                </h3>

                {/* Photo Container */}
                <div className="relative w-full aspect-[16/10.5] overflow-hidden bg-[#c3b3a0] mb-5 sm:mb-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 380px, 420px"
                    className={`object-cover ${item.imagePosition || "object-[center_28%]"} transition-transform duration-500`}
                  />
                </div>

                {/* Quote Text */}
                <p className="font-sans text-xs sm:text-[13px] text-[#4a5550] leading-[1.65] font-normal mb-5 min-h-[42px]">
                  {item.quote}
                </p>

                {/* Member Name & Role */}
                <div className="mb-6 sm:mb-7">
                  <h4 className="font-heading text-base sm:text-[17px] font-medium text-[#054b3c] leading-tight">
                    {item.name}
                  </h4>
                  <p className="font-sans text-[11px] sm:text-xs text-[#718079] font-normal mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Card Footer: Team Member label & Logo */}
              <div className="pt-4 sm:pt-5 border-t border-[#ede6d8] flex items-center justify-between">
                <span className="font-heading text-sm sm:text-[15px] font-normal text-[#054b3c]">
                  Team Member
                </span>
                <div className="relative h-6 sm:h-6.5 w-24 sm:w-28">
                  <Image
                    src="/image/logo/LOGO-GREEN.png"
                    alt="Premium Homes"
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-contain object-right"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
