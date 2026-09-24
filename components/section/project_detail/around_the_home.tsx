"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Building2,
  GraduationCap,
  ShoppingBag,
  Trees,
  Navigation,
} from "lucide-react";
import type { ProjectDetail } from "@/lib/projects";

interface AroundTheHomeProps {
  project: ProjectDetail;
}

export function AroundTheHome({ project }: AroundTheHomeProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: "All Surroundings", icon: MapPin },
    { id: "SHOPPING", label: "Shopping & Retail", icon: ShoppingBag },
    { id: "EDUCATION", label: "Schools & Colleges", icon: GraduationCap },
    { id: "RECREATION", label: "Parks & Leisure", icon: Trees },
    { id: "TRANSIT", label: "Transit & Corridors", icon: Navigation },
  ];

  const amenities = project.amenities || [];

  // Filter amenities according to active category
  const filteredAmenities = amenities.filter((item) => {
    if (activeCategory === "ALL") return true;
    const name = item.name.toLowerCase();
    if (activeCategory === "SHOPPING") {
      return (
        name.includes("mall") ||
        name.includes("park") ||
        name.includes("market") ||
        name.includes("shopping")
      );
    }
    if (activeCategory === "EDUCATION") {
      return (
        name.includes("school") ||
        name.includes("college") ||
        name.includes("university")
      );
    }
    if (activeCategory === "RECREATION") {
      return (
        name.includes("entertainment") ||
        name.includes("park") ||
        name.includes("lake")
      );
    }
    if (activeCategory === "TRANSIT") {
      return (
        name.includes("feet") ||
        name.includes("road") ||
        name.includes("avenue") ||
        name.includes("highway")
      );
    }
    return true;
  });

  return (
    <section
      aria-label="Neighborhood and Connectivity"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 border-b border-[#ede7dc] pb-5">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            LOCATION & CONNECTIVITY
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1 tracking-tight">
            See What&apos;s Around The Home
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
            {project.project_map_location ||
              project.location ||
              "Bashundhara Residential Area, Dhaka"}
          </p>
        </div>

        {/* Map Display Container */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[460px] rounded-3xl overflow-hidden bg-[#eef1ec] border border-[#ede7dc] shadow-inner mb-8 sm:mb-10 flex items-center justify-center">
          {project.map_image ? (
            <Image
              src={project.map_image}
              alt={`${project.name} Location Map`}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          ) : (
            /* Stylized Minimal Vector Map Graphic matching design reference */
            <div className="relative w-full h-full bg-[#f6f7f3] flex items-center justify-center overflow-hidden">
              {/* Subtle background route roads */}
              <svg
                className="absolute inset-0 w-full h-full text-[#d6dfd7]"
                viewBox="0 0 1000 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 250 Q 250 180 500 280 T 1000 200"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M150 0 Q 300 200 450 500"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="8 8"
                />
                <path
                  d="M600 0 Q 750 300 900 500"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="8 8"
                />
                {/* River water body curve */}
                <path
                  d="M100 500 C 350 400 400 200 650 150 C 850 110 950 0 1000 0"
                  stroke="#c3d5cb"
                  strokeWidth="28"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>

              {/* Central Project Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                <div className="w-12 h-12 rounded-full bg-[#044133] text-white flex items-center justify-center shadow-2xl ring-4 ring-[#d0a65b]/50">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="mt-2 px-3 py-1 rounded-full bg-white text-[#044133] text-[11px] font-semibold tracking-wider uppercase shadow-md border border-[#ede7dc]">
                  {project.name}
                </div>
              </div>

              {/* Surrounding Landmark Pins */}
              <div className="absolute top-[28%] left-[22%] flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-700 shadow-sm border border-gray-200">
                <MapPin className="w-3 h-3 text-[#d0a65b]" />
                <span>Jamuna Future Park (5 min)</span>
              </div>

              <div className="absolute bottom-[30%] right-[24%] flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-700 shadow-sm border border-gray-200">
                <MapPin className="w-3 h-3 text-[#d0a65b]" />
                <span>Bashundhara School (3 min)</span>
              </div>

              <div className="absolute top-[35%] right-[15%] flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-700 shadow-sm border border-gray-200">
                <MapPin className="w-3 h-3 text-[#d0a65b]" />
                <span>300 Feet Expressway (4 min)</span>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Pills (matching the design) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#044133] text-white shadow-md active:scale-95"
                    : "bg-[#fbf9f5] text-gray-600 hover:text-[#044133] border border-[#ede7dc]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Amenity Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {(filteredAmenities.length > 0 ? filteredAmenities : amenities).map(
            (amenity) => (
              <div
                key={amenity.id}
                className="bg-[#fbf9f5] border border-[#ede7dc] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200 shadow-2xs"
              >
                {amenity.image ? (
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shrink-0 bg-white border border-[#ede7dc] p-1">
                    <Image
                      src={amenity.image}
                      alt={amenity.name}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#d0a65b]" />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-[#14261f] leading-snug">
                  {amenity.name}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
