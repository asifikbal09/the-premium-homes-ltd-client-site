"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Appear, Words } from "@/components/ui/motion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, SETTLE, fluid } from "@/lib/utils";
import { useIntro } from "@/components/providers/intro";

type FilterKey = "status" | "location";
type Filters = Record<FilterKey, { label: string; options: string[] }>;

/** shadcn Combobox: a Popover holding a searchable Command list, styled to the theme. */
function Dropdown({
  label,
  options,
  value,
  open,
  onOpenChange,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center justify-between gap-1.5 py-1.5 text-left text-[12px] uppercase text-white sm:gap-2.5 sm:text-[13px] md:w-auto md:flex-none md:gap-12 md:py-2 md:text-[16px]"
        >
          <span className="trim truncate leading-[1.7]">{value ?? label}</span>
          <Image
            src="/home/icons/chevron-white.svg"
            alt=""
            width={24}
            height={24}
            className={cn("size-4 shrink-0 rotate-90 transition-transform duration-500 ease-out-expo sm:size-5 md:size-6", open && "-rotate-90")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={22}
        alignOffset={-16}
        collisionPadding={16}
        // Radix would focus the field before the popper is placed and scroll the page to it.
        // Focus it ourselves without scrolling, and only where there is no on-screen keyboard.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          if (!window.matchMedia("(pointer: fine)").matches) return;
          requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
        }}
      >
        <Command>
          <CommandInput ref={inputRef} placeholder={`Search ${label.toLowerCase()}…`} />
          <CommandList>
            <CommandEmpty>No match</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onSelect(opt === value ? null : opt);
                    onOpenChange(false);
                  }}
                >
                  {opt}
                  {value === opt && <span className="size-1.5 shrink-0 rounded-full bg-gold" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Status + location filters; Search opens the projects page filtered by both. */
function SearchBar({ filters }: { filters: Filters }) {
  const router = useRouter();
  const [open, setOpen] = useState<FilterKey | null>(null);
  const [values, setValues] = useState<Record<FilterKey, string | null>>({ status: null, location: null });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(null);
        const params = new URLSearchParams();
        if (values.status) params.set("status", values.status);
        if (values.location) params.set("location", values.location);
        const query = params.toString();
        router.push(`/projects${query ? `?${query}` : ""}`);
      }}
      className="glass relative flex w-full max-w-[520px] items-center justify-between gap-2 rounded-full bg-white/[0.115] py-1.5 pl-4 pr-1.5 backdrop-blur-[12px] sm:gap-4 sm:py-2 sm:pl-7 sm:pr-2 md:w-auto md:max-w-none md:gap-16 md:py-3 md:pl-12 md:pr-4"
    >
      {(Object.keys(filters) as FilterKey[]).map((key) => (
        <Dropdown
          key={key}
          label={filters[key].label}
          options={filters[key].options}
          value={values[key]}
          open={open === key}
          onOpenChange={(isOpen) => setOpen(isOpen ? key : null)}
          onSelect={(v) => setValues((s) => ({ ...s, [key]: v }))}
        />
      ))}
      <button
        type="submit"
        className="glass press flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[rgba(157,139,123,0.72)] px-4 py-2.5 text-[12px] font-medium uppercase text-white backdrop-blur-[6px] sm:px-7 sm:py-3 sm:text-[13px] md:gap-3 md:px-12 md:py-[15px] md:text-[14px]"
      >
        <Image src="/home/icons/search.svg" alt="" width={24} height={24} className="size-4 sm:size-5 md:size-6" />
        <span className="trim leading-[1.7]">Search</span>
      </button>
    </form>
  );
}

/**
 * Intro choreography once the first screen slides away: the photo settles
 * from a slow zoom while the label, title, search bar and widgets each arrive
 * from well below on their own spring, a beat apart.
 */
// Used only when the projects API returns nothing to build the filters from.
const FALLBACK_STATUSES = ["Ongoing", "Upcoming", "Ready to move", "Completed"];
const FALLBACK_LOCATIONS = ["Bashundhara R/A", "Ashulia Model Town", "Uttara", "Gulshan", "Mirpur DOHS"];

export interface HomeHeroProps {
  initialLocations?: string[];
  initialStatuses?: string[];
}

export function HomeHero({ initialLocations = [], initialStatuses = [] }: HomeHeroProps) {
  const filters: Filters = {
    status: { label: "Status", options: initialStatuses.length ? initialStatuses : FALLBACK_STATUSES },
    location: { label: "Location", options: initialLocations.length ? initialLocations : FALLBACK_LOCATIONS },
  };
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

 const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-green-deep text-white lg:max-h-[1080px]"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 1.14 }}
          animate={done ? { scale: 1 } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 2.6, ease: SETTLE }}
          className="absolute inset-[-31px_-9px_0]"
        >
          <Image
            src="/home/img/hero-bg.jpg"
            alt="Premium Homes residential towers lit at night"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(88.54deg, rgba(0,0,0,0.65) 22.651%, rgba(11,11,11,0) 71.69%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
      </motion.div>

      {/* Headline — Figma: x 80, y 325 of a 900 tall frame */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell absolute inset-x-0 bottom-[148px] md:bottom-[235px] lg:bottom-auto lg:top-[36.1%]"
      >
        <div className="flex flex-col gap-4">
          <Appear as="p" preset="rise" play={done} delay={0.1} className="text-[13px] font-medium uppercase leading-[1.5] tracking-[0.5px] sm:text-[16px] sm:tracking-normal">
            Real Estate Development Agency
          </Appear>
          <Words
            as="h1"
            play={done}
            delay={0.2}
            by="chars"
            mask
            text="Shaping Tomorrow’s Lifestyle."
            // No `capitalize` here: with one inline-block span per letter the browser would uppercase every letter.
            className="max-w-[6.22em] font-display font-medium leading-none"
            style={{ fontSize: fluid(100, 52) }}
          />
        </div>
      </motion.div>

      {/* Search */}
      <Appear
        preset="slide"
        play={done}
        delay={0.5}
        slow
        className="shell absolute inset-x-0 bottom-[76px] z-10 flex justify-center md:bottom-[18px]"
      >
        <SearchBar filters={filters} />
      </Appear>

      {/* Scroll cue */}
      <Appear
        preset="fade"
        play={done}
        delay={1.6}
        className="pointer-events-none absolute bottom-10 left-[clamp(16px,5vw,80px)] hidden items-center gap-3 text-[12px] uppercase tracking-[2px] text-white/60 lg:flex"
      >
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Scroll
      </Appear>
    </section>
  );
}
