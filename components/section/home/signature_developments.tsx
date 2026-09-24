"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Ruler, Eye, MapPin } from "lucide-react";

export interface ProjectData {
  id: number;
  name: string;
  slug?: string;
  location?: string;
  community?: {
    name?: string;
  };
  price?: string;
  price_range?: string;
  beds?: number;
  size?: string;
  image?: string;
  tag?: string | null;
  description?: string;
  hover_text?: string;
  brochure_link?: string;
  view?: string;
}

const FEATURED_IDS = [55, 61, 62, 66];

const CATEGORIES = [
  "ALL",
  "ASHULIA MODEL TOWN COMMUNITY",
  "BASHUNDHARA R/A",
  "THE PREMIUM ROYAL CITY",
  "THE PREMIUM SMART CITY",
];

// Fallback high-fidelity data matching backend exactly
const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: 55,
    name: "The Premium Canvas of Happiness",
    slug: "the-premium-canvas-of-happiness",
    location: "Bashundhara Residential Area",
    community: {
      name: "Bashundhara Residential Area",
    },
    price: "1 Crore - 2 Crore BDT",
    price_range: "1 Crore - 2 Crore BDT",
    beds: 4,
    size: "2705 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a93cc43c0b37.jpeg",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Garden view",
  },
  {
    id: 61,
    name: "The Premium Serenity",
    slug: "the-premium-serenity",
    location: "Jolshiri Abashon",
    community: {
      name: "Jolshiri Abashon",
    },
    price: "2 Crore - 5 Crore BDT",
    price_range: "2 Crore - 5 Crore BDT",
    beds: 1,
    size: "2850 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a9fb48bbe252.png",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Sea view",
  },
  {
    id: 62,
    name: "TPSC Commercial",
    slug: "tpsc-commercial",
    location: "The Premium Smart City",
    community: {
      name: "The Premium Smart City",
    },
    price: "Above 5 Crore BDT",
    price_range: "Above 5 Crore BDT",
    beds: 1,
    size: "1565 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a4f2d4393793.png",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Sea view",
  },
  {
    id: 66,
    name: "TPRC Commercial",
    slug: "tprc-commercial",
    location: "ATI Model Society",
    community: {
      name: "The Premium Royal City",
    },
    price: "2 Crore - 5 Crore BDT",
    price_range: "2 Crore - 5 Crore BDT",
    beds: 1,
    size: "1565 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6aa145a8cb2a7.jpeg",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Sea view",
  },
];

export function SignatureDevelopments() {
  const [projects, setProjects] = useState<ProjectData[]>(FALLBACK_PROJECTS);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api/";
    const cleanBase = baseUrl.replace(/\/+$/, "");

    // Fetch projects endpoint
    const fetchEndpoint = async () => {
      try {
        let res = await fetch(`${cleanBase}/projects`);
        if (!res.ok) {
          res = await fetch(`${cleanBase}/project`);
        }
        if (!res.ok) return;

        const data = await res.json();
        const rawList: ProjectData[] = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];

        if (Array.isArray(rawList) && rawList.length > 0) {
          const filtered = rawList.filter((p) =>
            FEATURED_IDS.includes(Number(p.id)),
          );

          if (filtered.length > 0) {
            // Sort to ensure [55, 61, 62, 66] order
            filtered.sort(
              (a, b) =>
                FEATURED_IDS.indexOf(Number(a.id)) -
                FEATURED_IDS.indexOf(Number(b.id)),
            );

            // Merge with fallback meta details (e.g. view)
            const enriched = filtered.map((p) => {
              const fallback = FALLBACK_PROJECTS.find(
                (f) => Number(f.id) === Number(p.id),
              );
              return {
                ...p,
                view: p.view || fallback?.view || "Garden view",
                description:
                  p.description && p.description.length < 90
                    ? p.description
                    : fallback?.description ||
                      "Sustainable living in Dhaka's most popular area.",
              };
            });

            setProjects(enriched);
          }
        }
      } catch (err) {
        console.warn("Failed to load featured projects, using fallback:", err);
      }
    };

    fetchEndpoint();
  }, []);

  // Filter based on selected tab
  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "ALL") return true;

    const cat = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
    const community = (p.community?.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const location = (p.location || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const name = (p.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    if (
      cat.includes("bashundhara") &&
      (community.includes("bashundhara") || location.includes("bashundhara"))
    ) {
      return true;
    }
    if (
      cat.includes("royalcity") &&
      (community.includes("royalcity") ||
        location.includes("royalcity") ||
        name.includes("tprc"))
    ) {
      return true;
    }
    if (
      cat.includes("smartcity") &&
      (community.includes("smartcity") ||
        location.includes("smartcity") ||
        name.includes("tpsc"))
    ) {
      return true;
    }
    if (
      cat.includes("ashulia") &&
      (community.includes("ashulia") ||
        location.includes("ashulia") ||
        name.includes("ashulia"))
    ) {
      return true;
    }

    return community.includes(cat) || location.includes(cat);
  });

  return (
    <section
      id="featured-developments"
      aria-label="Signature Developments Shaping"
      className="w-full bg-white py-12 sm:py-16 lg:py-24 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <span className="text-[#C49C57] font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase mb-2 sm:mb-3">
            FEATURED PROJECT
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal text-[#083A30] leading-[1.12] tracking-tight">
            Signature Developments
            <br />
            Shaping
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#044133] text-white border border-[#044133] shadow-xs"
                    : "bg-white text-[#526058] border border-[#E3DFD7] hover:border-[#044133] hover:text-[#044133]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2x2 Grid of Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-9 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const displayPrice =
                project.price_range || project.price || "Contact for price";
              const displayLocation =
                project.location ||
                project.community?.name ||
                "Ashulia Model Town, DHAKA";
              const displaySize = project.size || "119 m²";
              const displayBeds = project.beds
                ? `${project.beds} BHK`
                : "1 BHK";
              const displayView = project.view || "Garden view";
              const isHovered = hoveredId === project.id;
              const projectLink = project.slug
                ? `/projects/${project.slug}`
                : project.brochure_link || "#";

              return (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group flex flex-col"
                >
                  {/* Card Image Container */}
                  <div className="relative w-full aspect-[16/10.5] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#F4F1EB] mb-4 sm:mb-5 shadow-xs">
                    {/* Project Image */}
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8E2D7] flex items-center justify-center text-[#8E9792]">
                        No image available
                      </div>
                    )}

                    {/* Dark gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

                    {/* Top-Left Badge: LUXURY COLLECTION */}
                    <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-white uppercase select-none">
                      {project.tag || "LUXURY COLLECTION"}
                    </div>

                    {/* Circular PROJECT DETAILS Button */}
                    <Link
                      href={projectLink}
                      aria-label={`View details of ${project.name}`}
                      className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-white text-center shadow-xl transition-all duration-300 hover:scale-108 active:scale-95 z-20 ${
                        isHovered ? "scale-105 opacity-100" : "opacity-90"
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase leading-tight">
                        PROJECT
                        <br />
                        DETAILS
                      </span>
                    </Link>
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-col">
                    {/* Header Row: Title & Price */}
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-heading text-xl sm:text-2xl lg:text-[26px] font-normal text-[#083A30] leading-snug group-hover:text-[#044133] transition-colors">
                        <Link href={projectLink}>{project.name}</Link>
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="block text-[11px] text-[#8E9792] font-normal leading-none mb-1">
                          Starting from
                        </span>
                        <span className="block text-sm sm:text-base font-semibold text-[#1F2723] font-sans">
                          {displayPrice}
                        </span>
                      </div>
                    </div>

                    {/* Tagline / Subtitle */}
                    <p className="font-sans text-xs sm:text-[13px] text-[#6B7280] font-normal mb-3 sm:mb-4 line-clamp-1">
                      {project.description ||
                        "Sustainable living in Dhaka's most popular area."}
                    </p>

                    {/* Meta Info Row with Icons */}
                    <div className="flex items-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs text-[#526058] font-normal pt-2.5 sm:pt-3 border-t border-[#F0EDE6]">
                      {/* Bed info */}
                      <div className="inline-flex items-center gap-1.5">
                        <Home
                          className="w-3.5 h-3.5 text-[#8E9792]"
                          strokeWidth={1.5}
                        />
                        <span>{displayBeds}</span>
                      </div>

                      {/* Size info */}
                      <div className="inline-flex items-center gap-1.5">
                        <Ruler
                          className="w-3.5 h-3.5 text-[#8E9792]"
                          strokeWidth={1.5}
                        />
                        <span>{displaySize}</span>
                      </div>

                      {/* View info */}
                      <div className="inline-flex items-center gap-1.5">
                        <Eye
                          className="w-3.5 h-3.5 text-[#8E9792]"
                          strokeWidth={1.5}
                        />
                        <span>{displayView}</span>
                      </div>

                      {/* Location info */}
                      <div className="inline-flex items-center gap-1.5">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#8E9792]"
                          strokeWidth={1.5}
                        />
                        <span className="truncate max-w-[160px] sm:max-w-[220px]">
                          {displayLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state if category has no matches */}
        {filteredProjects.length === 0 && (
          <div className="w-full py-16 text-center text-[#8E9792] text-sm">
            No featured projects found in this community.
          </div>
        )}

        {/* Bottom CTA: EXPLORE 40+ PROJECTS */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center px-8 sm:px-11 py-3.5 sm:py-4 rounded-full bg-[#044133] hover:bg-[#032F25] text-white text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            EXPLORE 40+ PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
}
