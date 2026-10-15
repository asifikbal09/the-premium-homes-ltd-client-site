"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectData } from "@/lib/projects";

export interface ProjectItem {
  id: string;
  category: string;
  title: string;
  location: string;
  description: string;
  cardImage: string;
  bgImage: string;
  cardAlt: string;
  bgAlt: string;
  href: string;
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: "symphony",
    category: "RESIDENTIAL",
    title: "The Premium Symphony of Life",
    location: "Bashundhara Residential Area",
    description:
      "A residential vision where architectural elegance harmonizes with contemporary living, offering exceptional serenity.",
    cardImage: "/image/lumina.png",
    bgImage: "/image/studio6.png",
    cardAlt: "The Premium Symphony of Life",
    bgAlt: "Architectural facade backdrop",
    href: "/projects/the-premium-symphony-of-life",
  },
  {
    id: "novera",
    category: "RESIDENTIAL",
    title: "The Premium Novera Heights",
    location: "Bashundhara Residential Area",
    description:
      "An elevated lifestyle with thoughtfully designed residences, modern amenities, and refined architectural details.",
    cardImage: "/image/studio6.png",
    bgImage: "/image/lumina.png",
    cardAlt: "The Premium Novera Heights",
    bgAlt: "Architectural facade backdrop",
    href: "/projects/the-premium-novera-heights",
  },
  {
    id: "phoenix",
    category: "RESIDENTIAL",
    title: "The Premium Phoenix",
    location: "Bashundhara Residential Area",
    description:
      "Sophisticated design, superior craftsmanship, and modern comforts create an exceptional residential experience.",
    cardImage: "/image/lumina.png",
    bgImage: "/image/studio6.png",
    cardAlt: "The Premium Phoenix",
    bgAlt: "Architectural facade backdrop",
    href: "/projects/the-premium-phoenix",
  },
];

interface FeaturedProjectsProps {
  initialProjects?: ProjectData[];
}

export function FeaturedProjects({ initialProjects }: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    return initialProjects && initialProjects.length > 0
      ? initialProjects.slice(0, 3)
      : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects.slice(0, 3));
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api/";
    const cleanBase = baseUrl.replace(/\/+$/, "");

    fetch(`${cleanBase}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const rawList = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          const list = rawList.slice(0, 3).map((item) => ({
            id: Number(item.id) || Date.now(),
            name: item.name || "Prestige Residence",
            slug:
              item.slug ||
              (item.name
                ? item.name.toLowerCase().replace(/\s+/g, "-")
                : "project"),
            location:
              item.location || item.community?.name || "Dhaka, Bangladesh",
            description:
              item.description ||
              "An exquisite address designed for modern luxury living.",
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${item.image.replace(/^\/+/, "")}`
              : "/image/projects/projectsHero.png",
            image2: item.image2
              ? item.image2.startsWith("http")
                ? item.image2
                : `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${item.image2.replace(/^\/+/, "")}`
              : undefined,
            type: item.type || item.building_type || "RESIDENTIAL",
            tag: item.tag || null,
          }));
          setProjects(list as ProjectData[]);
        }
      })
      .catch((err) => {
        console.error("Error fetching featured projects:", err);
      });
  }, [initialProjects]);

  const displayList: ProjectItem[] =
    projects.length > 0
      ? projects.slice(0, 3).map((p) => {
          const cat = (p.tag || p.type || "RESIDENTIAL").toUpperCase();
          const slug = p.slug || String(p.id);
          const cardImg =
            p.image2 || p.image || "/image/projects/projectsHero.png";
          const bgImg =
            p.image || cardImg || "/image/projects/projectsHero.png";

          return {
            id: String(p.id),
            category: cat,
            title: p.name,
            location: p.location || "Dhaka, Bangladesh",
            description:
              p.description ||
              "An exquisite address designed for modern luxury living.",
            cardImage: cardImg,
            bgImage: bgImg,
            cardAlt: `${p.name} luxury architecture render`,
            bgAlt: `${p.name} backdrop view`,
            href: `/projects/${slug}`,
          };
        })
      : FALLBACK_PROJECTS;

  const safeIndex = currentIndex < displayList.length ? currentIndex : 0;
  const currentProject = displayList[safeIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayList.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayList.length - 1 ? 0 : prev + 1,
    );
  };

  const setSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      id="projects"
      aria-label="Featured Projects Showcase"
      className="w-full bg-[#ffffff] py-8 sm:py-16 lg:py-20 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Main Showcase Container with Contained Aspect Ratio Frame */}
        <div className="relative w-full min-h-0 sm:min-h-[620px] md:min-h-[680px] lg:min-h-[740px] rounded-xs overflow-hidden shadow-2xl bg-[#041713] flex items-center justify-center lg:justify-end p-3 py-6 sm:p-8 md:p-12 lg:p-16 transition-all">
          {/* Background Architectural Image with Crossfade */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentProject.bgImage}
                  alt={currentProject.bgAlt}
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover object-center lg:object-[35%_center]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle atmospheric vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/30 pointer-events-none" />
          </div>

          {/* Floating Spotlight White Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] md:max-w-[450px] bg-white rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/60 p-4 sm:p-7 md:p-9 flex flex-col items-center text-center transition-all"
          >
            {/* Project Category Tag */}
            <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#055B4B] mb-1 sm:mb-2">
              {currentProject.category}
            </span>

            {/* Project Title */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${currentProject.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="font-heading text-lg sm:text-2xl md:text-[32px] font-normal text-[#1A231F] leading-[1.15] tracking-tight mb-1 sm:mb-1.5"
              >
                {currentProject.title}
              </motion.h2>
            </AnimatePresence>

            {/* Project Location */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`loc-${currentProject.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[11px] sm:text-[13px] text-[#6B7280] font-normal tracking-wide mb-3 sm:mb-5"
              >
                {currentProject.location}
              </motion.p>
            </AnimatePresence>

            {/* Inner Project Render Image */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xs bg-[#F4F1EB] mb-3 sm:mb-5 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${currentProject.id}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentProject.cardImage}
                    alt={currentProject.cardAlt}
                    fill
                    sizes="(max-width: 640px) 320px, 420px"
                    className="object-cover object-center"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation & Progress Controls */}
            <div className="w-full flex items-center justify-center gap-2 sm:gap-3 mb-2.5 sm:mb-4 select-none">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project slide"
                className="inline-flex items-center p-1 text-[#8E9792] hover:text-[#044133] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {displayList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`text-xs sm:text-sm font-medium cursor-pointer transition-all px-1.5 py-0.5 rounded-sm ${
                      safeIndex === idx
                        ? "text-[#044133] font-bold scale-110"
                        : "text-[#8E9792] hover:text-[#044133]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Progress Track Indicator */}
              <div
                role="progressbar"
                aria-valuenow={safeIndex + 1}
                aria-valuemin={1}
                aria-valuemax={displayList.length}
                aria-label="Project slide indicator"
                onClick={handleNext}
                className="relative w-16 sm:w-20 h-[2.5px] bg-[#E3DFD7] rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute top-0 bottom-0 bg-[#044133] rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${100 / displayList.length}%`,
                    left: `${(safeIndex / displayList.length) * 100}%`,
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project slide"
                className="inline-flex items-center p-1 text-[#8E9792] hover:text-[#044133] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Editorial Description Text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentProject.id}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[11px] sm:text-[13px] text-[#526058] leading-relaxed max-w-[290px] sm:max-w-[330px] font-normal mb-4 sm:mb-6 line-clamp-3"
              >
                {currentProject.description}
              </motion.p>
            </AnimatePresence>

            {/* VIEW PROJECT CTA Button */}
            <Link
              href={currentProject.href}
              className="inline-flex items-center justify-center px-6 sm:px-10 py-2 sm:py-3 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#2A231A] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #EFE7DA 0%, #D8CDBC 100%)",
                border: "1px solid rgba(200, 186, 168, 0.45)",
              }}
            >
              VIEW PROJECT
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
