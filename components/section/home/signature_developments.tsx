"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/section/projects/project_card";
import type { ProjectData } from "@/lib/projects";

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
  // 1. Initial Card 1
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
  // 2. Initial Card 2
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
  // 3. Initial Card 3
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
  // 4. Initial Card 4
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
  // Ashulia community fallbacks
  {
    id: 71,
    name: "The Premium Green Valley",
    slug: "the-premium-green-valley",
    location: "Ashulia Model Town, Dhaka",
    community: {
      name: "Ashulia Model Town Community",
    },
    price: "1.5 Crore - 3 Crore BDT",
    price_range: "1.5 Crore - 3 Crore BDT",
    beds: 3,
    size: "1850 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a93cc43c0b37.jpeg",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Lake view",
  },
  {
    id: 72,
    name: "TPHL Lakeview Residences",
    slug: "tphl-lakeview-residences",
    location: "Ashulia Model Town, Dhaka",
    community: {
      name: "Ashulia Model Town Community",
    },
    price: "2 Crore - 4 Crore BDT",
    price_range: "2 Crore - 4 Crore BDT",
    beds: 4,
    size: "2200 sft",
    image:
      "https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/projects_6a9fb48bbe252.png",
    description: "Sustainable living in Dhaka's most popular area.",
    view: "Garden view",
  },
];

interface SignatureDevelopmentsProps {
  initialProjects?: ProjectData[];
}

export function SignatureDevelopments({
  initialProjects = [],
}: SignatureDevelopmentsProps) {
  // Merge initialProjects with FALLBACK_PROJECTS ensuring initial 4 exist
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    if (initialProjects && initialProjects.length > 0) {
      const merged = [...initialProjects];
      FALLBACK_PROJECTS.forEach((fb) => {
        if (!merged.some((p) => Number(p.id) === Number(fb.id))) {
          merged.push(fb);
        }
      });
      return merged;
    }
    return FALLBACK_PROJECTS;
  });

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api/";
    const cleanBase = baseUrl.replace(/\/+$/, "");

    // Fetch all projects for filtering
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
          // Normalize and enrich each project from API
          const enriched = rawList.map((p) => {
            const fallback = FALLBACK_PROJECTS.find(
              (f) => Number(f.id) === Number(p.id),
            );
            return {
              ...p,
              image:
                p.image && !p.image.startsWith("http")
                  ? `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${p.image.replace(/^\/+/, "")}`
                  : p.image || fallback?.image || "/image/projects/projectsHero.png",
              view: p.view || fallback?.view || "Garden view",
              description:
                p.description && p.description.length < 90
                  ? p.description
                  : fallback?.description ||
                    "Sustainable living in Dhaka's most popular area.",
            };
          });

          // Ensure our initial 4 featured cards exist
          const combined: ProjectData[] = [...enriched];
          FALLBACK_PROJECTS.forEach((fallback) => {
            if (!combined.some((p) => Number(p.id) === Number(fallback.id))) {
              combined.push(fallback);
            }
          });

          setProjects(combined);
        }
      } catch (err) {
        console.warn("Failed to load featured projects, using fallback:", err);
      }
    };

    fetchEndpoint();
  }, []);

  // Filter based on selected tab: ALWAYS at most 4 cards (never more than 4)
  const filteredProjects = React.useMemo(() => {
    if (activeCategory === "ALL") {
      // 1. Initially show these exact 4 cards matching the design
      const initialFour: ProjectData[] = [];
      FEATURED_IDS.forEach((id) => {
        const found =
          projects.find((p) => Number(p.id) === id) ||
          FALLBACK_PROJECTS.find((f) => Number(f.id) === id);
        if (found && !initialFour.some((item) => Number(item.id) === Number(found.id))) {
          initialFour.push(found);
        }
      });

      // If fewer than 4 matched, pad with remaining projects up to 4
      if (initialFour.length < 4) {
        for (const p of projects) {
          if (!initialFour.some((item) => Number(item.id) === Number(p.id))) {
            initialFour.push(p);
            if (initialFour.length >= 4) break;
          }
        }
      }

      return initialFour.slice(0, 4);
    }

    // 2. Filter by category and show at most 4 cards
    const cat = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, "");

    const matched = projects.filter((p) => {
      const community = (p.community?.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const location = (p.location || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
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
          name.includes("tprc") ||
          name.includes("royal"))
      ) {
        return true;
      }
      if (
        cat.includes("smartcity") &&
        (community.includes("smartcity") ||
          location.includes("smartcity") ||
          name.includes("tpsc") ||
          name.includes("smart"))
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

      return (
        community.includes(cat) || location.includes(cat) || name.includes(cat)
      );
    });

    // Never show more than 4 cards
    return matched.slice(0, 4);
  }, [activeCategory, projects]);

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

        {/* 2x2 Grid of Featured Projects using reusable ProjectCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-9 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
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
