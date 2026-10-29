"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SectionIntro } from "@/components/section/shared/section_intro";
import { FilterChips } from "@/components/ui/filter_chips";
import { Shutter } from "@/components/ui/motion";
import { cn, SETTLE } from "@/lib/utils";

type Office = {
  /** Chip label. */
  label: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string[];
  /** Google Maps share link, opened from the map. */
  mapUrl: string;
  /** What the embedded map searches for. */
  mapQuery: string;
};

const HOURS = ["Saturday - Thursday: 9:30 AM - 6:30 PM", "Friday: Closed"];
const EMAIL = "info@dpremiumhomes.com";

const OFFICES: Office[] = [
  {
    label: "Corporate Office",
    title: "Corporate Office",
    address: "Land View Commercial Center, 9th Floor 28 Gulshan North C/A, Gulshan Circle-2, Dhaka",
    phone: "+8801958253300",
    email: EMAIL,
    hours: HOURS,
    mapUrl: "https://maps.app.goo.gl/xBbvpKMiqFs8rruS8",
    mapQuery: "Land View Commercial Center, 28 Gulshan North C/A, Dhaka 1212",
  },
  {
    label: "Site Office",
    title: "Site Office",
    address: "1st & 2nd Floor, Tokyo Plaza, Ashulia Model Town Khagan Bazar, Dhaka",
    phone: "+8801958253301",
    email: EMAIL,
    hours: HOURS,
    mapUrl: "https://maps.app.goo.gl/Q4ubP1mdP5GsBaM18",
    mapQuery: "Tokyo Plaza, Ashulia Model Town, Khagan Bazar, Dhaka",
  },
  {
    label: "Ati Society (Site Office 2)",
    title: "Ati Society Office",
    address: "House 04 (Upazila Settlement Office Building), 2nd floor, Avenue Road-1, Ati Model Society, Dhaka",
    phone: "+8801958253302",
    email: EMAIL,
    hours: HOURS,
    mapUrl: "https://maps.app.goo.gl/pH17jAvwexAkWHau7",
    mapQuery: "Ati Model Society, Dhaka",
  },
  {
    label: "Zonal Office",
    title: "Zonal Office",
    address: "23/2, SEL HUQ Skypark 4th floor, Opposite of Wonderland (Shishumela), Dhaka",
    phone: "+8801799673358",
    email: EMAIL,
    hours: HOURS,
    mapUrl: "https://maps.app.goo.gl/nEJXsLqDnAeFygrw8",
    mapQuery: "SEL HUQ Skypark, Dhaka",
  },
];

const LINK = "transition-colors duration-300 hover:text-green";

/** Label and value rows of the details list, each under a hairline, as in Figma. */
function officeRows(office: Office): [string, React.ReactNode][] {
  return [
    ["Visit Us", office.address],
    ["Phone", <a key="phone" href={`tel:${office.phone}`} className={LINK}>{office.phone}</a>],
    ["Email", <a key="email" href={`mailto:${office.email}`} className={LINK}>{office.email}</a>],
    ["Business Hours", office.hours.map((h) => <span key={h} className="block">{h}</span>)],
  ];
}

/**
 * Figma "Contact Our Teams": office chips over a map and the office's details. The map opens on the
 * shutter; choosing an office fades its map in and slides the old details out before the new ones
 * arrive.
 */
export function ContactOffices() {
  const [active, setActive] = useState(OFFICES[0].label);
  const office = OFFICES.find((o) => o.label === active) ?? OFFICES[0];

  return (
    <section aria-label="Our offices" className="bg-warm py-[clamp(56px,5vw,80px)]">
      <div className="shell flex flex-col gap-[clamp(40px,5vw,80px)]">
        <div className="flex flex-col items-center gap-10">
          <SectionIntro eyebrow="Our offices" title="Contact our teams" />
          {/* Scrolls sideways on phones, where the four chips cannot share one row. */}
          <div className="no-scrollbar -mx-[clamp(16px,5vw,80px)] max-w-[100vw] overflow-x-auto">
            <FilterChips
              options={OFFICES.map((o) => o.label)}
              value={active}
              onChange={setActive}
              tall
              className="w-max px-[clamp(16px,5vw,80px)]"
            />
          </div>
        </div>

        <div className="relative grid items-start gap-10 lg:grid-cols-[704fr_645fr] lg:gap-[clamp(40px,5.69vw,91px)]">
          <Shutter tone="bg-warm" className="relative aspect-[704/539] bg-mist">
            <AnimatePresence initial={false}>
              <motion.iframe
                key={office.label}
                title={`Map of ${office.title}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&z=15&output=embed`}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: SETTLE }}
                className="absolute inset-0 size-full border-0"
              />
            </AnimatePresence>
            <a
              href={office.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="press absolute bottom-4 right-4 inline-flex h-[34px] items-center rounded-full bg-green px-4 text-[12px] font-medium uppercase tracking-[1.5px] text-gold"
            >
              <span className="trim leading-[1.7]">Open in Google Maps</span>
            </a>
          </Shutter>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={office.label}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: SETTLE }}
              className="flex flex-col gap-10"
            >
              <h3 className="font-display text-[28px] font-medium capitalize leading-[1.1] text-green">{office.title}</h3>
              <dl className="flex flex-col text-[clamp(16px,1.125vw,18px)] leading-[1.5]">
                {officeRows(office).map(([term, value], i, rows) => (
                  <div
                    key={term}
                    className={cn("grid gap-2 border-t border-chip pt-8 sm:grid-cols-[minmax(0,222px)_1fr] sm:gap-6", i < rows.length - 1 && "pb-8")}
                  >
                    <dt className="text-green">{term}</dt>
                    <dd className="text-sage">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
