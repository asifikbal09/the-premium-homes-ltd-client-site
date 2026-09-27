"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Sparkles, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
}

const LEFT_JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: "journey-01",
    src: "/image/about/journy/journy01.png",
    alt: "TPHL architectural planning and project team consultation",
    title: "Architectural Vision",
    caption: "Meticulous structural masterplanning & blueprint refinement.",
  },
  {
    id: "journey-02",
    src: "/image/about/journy/journy02.png",
    alt: "TPHL leadership and milestone recognition ceremony",
    title: "Leadership & Trust",
    caption: "Celebrating corporate leadership & enduring integrity.",
  },
  {
    id: "journey-03",
    src: "/image/about/journy/journy03.png",
    alt: "TPHL client family discovery and consultation lounge",
    title: "Family First",
    caption: "Thoughtful consultations tailored for generational living.",
  },
  {
    id: "journey-04",
    src: "/image/about/journy/journy04.png",
    alt: "Site engineering, structural modeling and technical evaluation",
    title: "Engineering Precision",
    caption: "Quality-first engineering standards verified at every phase.",
  },
  {
    id: "journey-05",
    src: "/image/about/journy/journy05.png",
    alt: "Senior executives reviewing blueprints and floorplans",
    title: "Collaborative Design",
    caption: "Where modern aesthetics meet sustainable living spaces.",
  },
  {
    id: "journey-06",
    src: "/image/about/journy/journy06.png",
    alt: "Client contract handover and official documentation exchange",
    title: "Legal Assurance",
    caption: "Clear documentation, transparent agreements & complete peace.",
  },
];

const RIGHT_JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: "journey-07",
    src: "/image/about/journy/journy07.png",
    alt: "Corporate team discussion and strategic milestone alignment",
    title: "Shared Purpose",
    caption: "A dedicated team passionate about reshaping modern skylines.",
  },
  {
    id: "journey-08",
    src: "/image/about/journy/journy08.png",
    alt: "Milestone award ceremony and project stage achievement",
    title: "Milestone Honors",
    caption: "Recognized industry achievements and on-time delivery track.",
  },
  {
    id: "journey-09",
    src: "/image/about/journy/journy09.png",
    alt: "Architectural 3D model showcase and investor presentation",
    title: "Masterplanned Communities",
    caption: "Translating innovative scale models into landmark residences.",
  },
  {
    id: "journey-10",
    src: "/image/about/journy/journy10.png",
    alt: "Client family smiling during home tour inspection",
    title: "The Heart of Home",
    caption: "Creating vibrant spaces where joyful family memories flourish.",
  },
  {
    id: "journey-11",
    src: "/image/about/journy/journy11.png",
    alt: "Interior finishes, material selection and luxury textures",
    title: "Artisanal Craft",
    caption: "Superior materials, premium finishes, and enduring detail.",
  },
  {
    id: "journey-12",
    src: "/image/about/journy/journy12.png",
    alt: "Official keys handover celebration with happy homeowner family",
    title: "The Handover Moment",
    caption: "Welcoming each proud family to their new sanctuary.",
  },
];

export function AboutBuildingJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Circular rotation state (in radians)
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<JourneyItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<JourneyItem | null>(null);

  // Responsive dimensions for dynamic elliptical positioning
  const [dimensions, setDimensions] = useState({ width: 1400, height: 860 });

  // Update dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || window.innerWidth,
          height: rect.height || 860,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Continuous smooth orbital rotation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Only advance rotation when not paused or hovered
      if (!isPaused && !hoveredItem) {
        // Subtle, elegant rotation speed (~0.075 rad/sec)
        setRotationAngle((prev) => (prev + delta * 0.075) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, hoveredItem]);

  // Scroll-linked rotation interaction: scrolling through the section propels the circular movement
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Propel circular wheels according to scroll direction & velocity
        setRotationAngle((prev) => (prev + scrollDelta * 0.0018) % (Math.PI * 2));
      } else {
        lastScrollY = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute position & tilt for each card
  const getCardStyle = useCallback(
    (side: "left" | "right", index: number, total: number) => {
      const { width, height } = dimensions;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      // Equal angular distribution along the circle
      const baseAngle = (index / total) * Math.PI * 2;
      // Left side rotates clockwise, right side rotates counter-clockwise for harmonious mirror motion
      const currentAngle =
        side === "left"
          ? (baseAngle + rotationAngle) % (Math.PI * 2)
          : (baseAngle - rotationAngle) % (Math.PI * 2);

      // Radii and focal centers based on screen width
      let cx = 0;
      let cy = height * 0.5;
      let rx = 0;
      let ry = 0;

      if (isMobile) {
        // Mobile configuration: cards orbit slightly off center to maintain clearance for title
        cx = side === "left" ? width * 0.12 : width * 0.88;
        rx = Math.min(width * 0.28, 120);
        ry = Math.min(height * 0.32, 180);
      } else if (isTablet) {
        // Tablet configuration
        cx = side === "left" ? width * 0.14 : width * 0.86;
        rx = Math.min(width * 0.22, 190);
        ry = Math.min(height * 0.36, 260);
      } else {
        // Desktop configuration (matches reference layout)
        cx = side === "left" ? width * 0.14 : width * 0.86;
        rx = Math.min(width * 0.23, 310);
        ry = Math.min(height * 0.4, 350);
      }

      // Elliptical coordinate calculation
      const x = cx + rx * Math.cos(currentAngle);
      const y = cy + ry * Math.sin(currentAngle);

      // Tangential tilt calculation with natural organic feel matching reference screenshot
      // Tangent angle is perpendicular to radial vector
      const rawTangent =
        Math.atan2(ry * Math.cos(currentAngle), -rx * Math.sin(currentAngle)) *
        (180 / Math.PI);

      // Scale tangent down for pleasing editorial tilt (-38deg to +38deg)
      let tilt = rawTangent * 0.34;
      if (side === "left") {
        tilt = tilt - 12;
      } else {
        tilt = tilt + 12;
      }
      tilt = Math.max(-42, Math.min(42, tilt));

      // Calculate depth scale & opacity: items closer to screen edges stay subtle, items facing center are prominent
      const facingCenter =
        side === "left" ? Math.cos(currentAngle) : -Math.cos(currentAngle);
      const depthScale = 0.94 + Math.max(0, facingCenter) * 0.1;
      const depthOpacity = 0.82 + Math.max(0, facingCenter) * 0.18;

      return {
        x,
        y,
        tilt,
        depthScale,
        depthOpacity,
      };
    },
    [dimensions, rotationAngle]
  );

  return (
    <section
      ref={containerRef}
      aria-label="The Building Journey"
      className="relative w-full min-h-[760px] sm:min-h-[840px] lg:min-h-[920px] xl:min-h-[980px] bg-[#FAF8F5] text-[#044133] overflow-hidden py-16 sm:py-20 lg:py-24 select-none flex items-center justify-center transition-colors duration-500"
    >
      {/* Subtle Luxury Architectural Ambient Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(208,166,91,0.08)_0%,transparent_70%)]" />

      {/* Decorative Subtle Corner Accent Lines */}
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12 pointer-events-none opacity-20">
        <div className="w-12 h-[1px] bg-[#044133]" />
        <div className="w-[1px] h-12 bg-[#044133]" />
      </div>
      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 pointer-events-none opacity-20">
        <div className="w-12 h-[1px] bg-[#044133] ml-auto" />
        <div className="w-[1px] h-12 bg-[#044133] ml-auto" />
      </div>

      {/* ========================================================= */}
      {/* CENTERPIECE TITLE: "The Building Journey"                  */}
      {/* Staggered entrance animation slowly descending from above */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -110 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Subtle Decorative Kicker */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
            className="flex items-center gap-2 mb-3 text-[#d0a65b] font-sans text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Milestones</span>
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>

          {/* Majestic 3-Line Heading matching design reference */}
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[98px] 2xl:text-[108px] font-normal text-[#044133] leading-[1.04] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              The
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Building
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Journey
            </motion.span>
          </h2>

          {/* Understated narrative tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 max-w-md font-sans text-xs sm:text-sm text-[#526058] leading-relaxed tracking-wide"
          >
            A perpetual orbit of genuine moments, architectural craftsmanship,
            and shared milestones shaping Bangladesh&apos;s finest living communities.
          </motion.p>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* CIRCULAR MOVING IMAGES - LEFT WHEEL (6 Images)            */}
      {/* Moves along a smooth circular arc on the left side        */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-auto">
        {LEFT_JOURNEY_ITEMS.map((item, index) => {
          const { x, y, tilt, depthScale, depthOpacity } = getCardStyle(
            "left",
            index,
            LEFT_JOURNEY_ITEMS.length
          );
          const isHovered = hoveredItem?.id === item.id;

          return (
            <div
              key={item.id}
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${
                  isHovered ? 0 : tilt
                }deg) scale(${isHovered ? 1.14 : depthScale})`,
                opacity: depthOpacity,
                zIndex: isHovered ? 40 : 20,
                transition:
                  "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, box-shadow 0.35s ease",
              }}
              className="absolute top-0 left-0 cursor-pointer group"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedItem(item)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-white border border-black/8 transition-all duration-300",
                  "w-[140px] h-[105px] sm:w-[190px] sm:h-[142px] md:w-[220px] md:h-[165px] lg:w-[250px] lg:h-[188px] xl:w-[270px] xl:h-[202px]",
                  isHovered
                    ? "shadow-[0_24px_50px_rgba(4,65,51,0.22)] ring-2 ring-[#d0a65b]"
                    : "shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_40px_rgba(4,65,51,0.15)]"
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 220px, 300px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle dark gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 text-white",
                    isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <p className="font-heading text-xs sm:text-sm font-medium leading-tight text-white line-clamp-1">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-[#f7e7cb] flex items-center gap-1 mt-0.5">
                    <Maximize2 className="w-2.5 h-2.5" /> View Photo
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ========================================================= */}
        {/* CIRCULAR MOVING IMAGES - RIGHT WHEEL (6 Images)           */}
        {/* Moves along a smooth circular arc on the right side       */}
        {/* ========================================================= */}
        {RIGHT_JOURNEY_ITEMS.map((item, index) => {
          const { x, y, tilt, depthScale, depthOpacity } = getCardStyle(
            "right",
            index,
            RIGHT_JOURNEY_ITEMS.length
          );
          const isHovered = hoveredItem?.id === item.id;

          return (
            <div
              key={item.id}
              style={{
                transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${
                  isHovered ? 0 : tilt
                }deg) scale(${isHovered ? 1.14 : depthScale})`,
                opacity: depthOpacity,
                zIndex: isHovered ? 40 : 20,
                transition:
                  "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, box-shadow 0.35s ease",
              }}
              className="absolute top-0 left-0 cursor-pointer group"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setSelectedItem(item)}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-white border border-black/8 transition-all duration-300",
                  "w-[140px] h-[105px] sm:w-[190px] sm:h-[142px] md:w-[220px] md:h-[165px] lg:w-[250px] lg:h-[188px] xl:w-[270px] xl:h-[202px]",
                  isHovered
                    ? "shadow-[0_24px_50px_rgba(4,65,51,0.22)] ring-2 ring-[#d0a65b]"
                    : "shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_40px_rgba(4,65,51,0.15)]"
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 220px, 300px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle dark gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 text-white",
                    isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <p className="font-heading text-xs sm:text-sm font-medium leading-tight text-white line-clamp-1">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-[#f7e7cb] flex items-center gap-1 mt-0.5">
                    <Maximize2 className="w-2.5 h-2.5" /> View Photo
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE CONTROLS BAR (Bottom Center)                  */}
      {/* Allows pausing orbit & shows helpful hint                 */}
      {/* ========================================================= */}
      <div className="absolute bottom-6 sm:bottom-8 z-30 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 shadow-xs">
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#044133] hover:text-[#055b4b] transition-colors cursor-pointer"
          aria-label={isPaused ? "Play orbit animation" : "Pause orbit animation"}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Motion</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Motion</span>
            </>
          )}
        </button>

        <span className="w-1 h-1 rounded-full bg-[#d0a65b]" />

        <span className="text-[11px] text-[#526058] tracking-wide hidden sm:inline">
          Scroll or hover to explore moments
        </span>
      </div>

      {/* ========================================================= */}
      {/* HIGH RESOLUTION LIGHTBOX MODAL                            */}
      {/* Opens when an image card is clicked                       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* High-res Image Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-neutral-900">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 1000px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Caption & Metadata */}
              <div className="p-6 sm:p-8 flex flex-col gap-1 bg-[#FAF8F5] text-[#044133]">
                <div className="flex items-center gap-2 text-[#d0a65b] text-xs font-semibold uppercase tracking-[0.16em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Premium Homes Ltd. Journey</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#044133]">
                  {selectedItem.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#526058] mt-1 leading-relaxed">
                  {selectedItem.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
