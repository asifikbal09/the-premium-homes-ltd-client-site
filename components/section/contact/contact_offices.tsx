"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Office {
  id: string;
  tabLabel: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  businessHours: {
    days: string;
    friday: string;
  };
  mapUrl: string;
  embedQuery: string;
}

const OFFICES: Office[] = [
  {
    id: "corporate",
    tabLabel: "CORPORATE OFFICE",
    title: "Corporate Office",
    address: "Land View Commercial Center, 9th Floor 28 Gulshan North C/A, Gulshan Circle-2, Dhaka",
    phone: "+8801958253300",
    email: "info@dpremiumhomes.com",
    businessHours: {
      days: "Saturday - Thursday: 9:30 AM - 6:30 PM",
      friday: "Friday: Closed",
    },
    mapUrl: "https://maps.app.goo.gl/xBbvpKMiqFs8rruS8",
    embedQuery: "Land View Commercial Center, 28 Gulshan North C/A, Dhaka 1212",
  },
  {
    id: "site",
    tabLabel: "SITE OFFICE",
    title: "Site Office",
    address: "1st & 2nd Floor, Tokyo Plaza, Ashulia Model Town Khagan Bazar, Dhaka",
    phone: "+8801958253301",
    email: "info@dpremiumhomes.com",
    businessHours: {
      days: "Saturday - Thursday: 9:30 AM - 6:30 PM",
      friday: "Friday: Closed",
    },
    mapUrl: "https://maps.app.goo.gl/Q4ubP1mdP5GsBaM18",
    embedQuery: "Tokyo Plaza, Ashulia Model Town, Khagan Bazar, Dhaka",
  },
  {
    id: "ati",
    tabLabel: "ATI SOCIETY (SITE OFFICE 2)",
    title: "Ati Society Office",
    address: "House 04 (Upazila Settlement Office Building), 2nd floor, Avenue Road-1, Ati Model Society, Dhaka",
    phone: "+8801958253302",
    email: "info@dpremiumhomes.com",
    businessHours: {
      days: "Saturday - Thursday: 9:30 AM - 6:30 PM",
      friday: "Friday: Closed",
    },
    mapUrl: "https://maps.app.goo.gl/pH17jAvwexAkWHau7",
    embedQuery: "Ati Model Society, Dhaka",
  },
  {
    id: "zonal",
    tabLabel: "ZONAL OFFICE",
    title: "Zonal Office",
    address: "23/2 ,SEL HUQ Skypark 4th floor,Opposite of Wonderland (Shishumela), Dhaka",
    phone: "+8801799673358",
    email: "info@dpremiumhomes.com",
    businessHours: {
      days: "Saturday - Thursday: 9:30 AM - 6:30 PM",
      friday: "Friday: Closed",
    },
    mapUrl: "https://maps.app.goo.gl/nEJXsLqDnAeFygrw8",
    embedQuery: "SEL HUQ Skypark, Dhaka",
  },
];

export function ContactOffices() {
  const [activeTab, setActiveTab] = useState<string>("corporate");
  const selectedOffice = OFFICES.find((o) => o.id === activeTab) || OFFICES[0];

  return (
    <section
      aria-label="Our Offices"
      className="w-full bg-[#f6f2ea] pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#e9e2d5]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block text-[#d0a65b] font-medium text-xs sm:text-[13px] tracking-[0.22em] uppercase mb-3">
            OUR OFFICES
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-normal text-[#083327] tracking-tight">
            Contact Our Teams
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-12 sm:mb-16">
          {OFFICES.map((office) => {
            const isActive = office.id === activeTab;
            return (
              <button
                key={office.id}
                type="button"
                onClick={() => setActiveTab(office.id)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer ${isActive ? "bg-[#083c2f] text-white" : "bg-white text-[#083327] hover:bg-[#f0e8d9]"}`}
              >
                {office.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Content: Map on Left, Office Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Map Column */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e2dacb] aspect-[4/3] sm:aspect-[16/11] bg-[#e8e2d4]">
              <iframe
                title={`Map of ${selectedOffice.title}`}
                src={`https://maps.google.com/maps?q=${selectedOffice.address}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Quick Google Map Link Badge */}
              <div className="absolute bottom-3 right-3 z-10">
                <Link
                  href={selectedOffice.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#083c2f]/90 hover:bg-[#083c2f] text-white text-[11px] sm:text-xs font-medium tracking-wide shadow-md backdrop-blur-sm transition-all"
                >
                  <span>Open in Maps</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOffice.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col"
              >
                <h3 className="font-heading text-3xl sm:text-4xl text-[#083327] font-normal tracking-tight mb-6 sm:mb-8">
                  {selectedOffice.title}
                </h3>

                <div className="divide-y divide-[#e2dcd0] border-t border-[#e2dcd0]">
                  {/* Visit Us */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#083327] w-36 shrink-0">
                      Visit Us
                    </span>
                    <span className="text-xs sm:text-sm text-[#44524b] leading-relaxed">
                      {selectedOffice.address}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#083327] w-36 shrink-0">
                      Phone
                    </span>
                    <Link
                      href={`tel:${selectedOffice.phone}`}
                      className="text-xs sm:text-sm text-[#44524b] hover:text-[#083327] transition-colors leading-relaxed underline-offset-2 hover:underline"
                    >
                      {selectedOffice.phone}
                    </Link>
                  </div>

                  {/* Email */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#083327] w-36 shrink-0">
                      Email
                    </span>
                    <Link
                      href={`mailto:${selectedOffice.email}`}
                      className="text-xs sm:text-sm text-[#44524b] hover:text-[#083327] transition-colors leading-relaxed underline-offset-2 hover:underline"
                    >
                      {selectedOffice.email}
                    </Link>
                  </div>

                  {/* Business Hours */}
                  <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#083327] w-36 shrink-0">
                      Business Hours
                    </span>
                    <div className="text-xs sm:text-sm text-[#44524b] leading-relaxed flex flex-col gap-0.5">
                      <span>{selectedOffice.businessHours.days}</span>
                      <span className="text-[#84928b]">{selectedOffice.businessHours.friday}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
