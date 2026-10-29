"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/ui/empty_state";
import { FilterChips } from "@/components/ui/filter_chips";
import { Appear } from "@/components/ui/motion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GreenPill } from "@/components/ui/primitives";
import { SearchField } from "@/components/ui/search_field";
import type { ProjectData } from "@/lib/projects";
import { useDebounced } from "@/lib/use-debounced";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project_card";

const ALL = "All";
const PAGE_SIZE = 9;

/** Distinct non-empty values of one field, in the order the API lists them. */
function distinct(projects: ProjectData[], pick: (p: ProjectData) => string | undefined) {
  return Array.from(new Set(projects.map((p) => pick(p)?.trim()).filter(Boolean) as string[]));
}

/** Case-insensitive match of a URL param against the API's own values. */
function fromParam(param: string | null, options: string[]) {
  const wanted = param?.trim().toLowerCase();
  return options.find((o) => o.toLowerCase() === wanted) ?? null;
}

/** shadcn Combobox for the location: a Popover holding a searchable Command list. */
function LocationSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "flex h-12 min-w-0 items-center gap-6 rounded-full border px-6 transition-colors duration-300",
            value || open ? "border-green" : "border-chip hover:border-green/50",
          )}
        >
          <span className="flex min-w-0 items-center gap-1">
            <Image src="/projects/icons/location.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
            <span className="trim truncate text-[14px] font-medium uppercase leading-[1.7] tracking-[2px] text-sage">
              {value ?? "Location"}
            </span>
          </span>
          <Image
            src="/projects/icons/chevron.svg"
            alt=""
            width={20}
            height={20}
            className={cn("size-5 shrink-0 rotate-90 transition-transform duration-500 ease-out-expo", open && "-rotate-90")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
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
          <CommandInput ref={inputRef} placeholder="Search location…" />
          <CommandList>
            <CommandEmpty>No match</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt === value ? null : opt);
                    setOpen(false);
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

/**
 * Status chips, search and location over a 3-column grid. Statuses and locations are the values the
 * projects API returns, so a new status or location shows up without a code change. The home
 * search bar links here with `?status=` and `?location=`.
 */
export function ProjectsFilterGrid({ initialProjects }: { initialProjects: ProjectData[] }) {
  const searchParams = useSearchParams();
  const statuses = useMemo(() => distinct(initialProjects, (p) => p.status), [initialProjects]);
  const locations = useMemo(() => distinct(initialProjects, (p) => p.location), [initialProjects]);

  const statusFromUrl = () => fromParam(searchParams.get("status"), statuses) ?? ALL;
  const locationFromUrl = () => fromParam(searchParams.get("location"), locations);
  const [status, setStatus] = useState(statusFromUrl);
  const [location, setLocation] = useState(locationFromUrl);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query.trim().toLowerCase());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Hover photos mount the first time a mouse enters the grid (never on touch screens).
  const [armed, setArmed] = useState(false);

  // Follow the URL, e.g. a search from the home hero (adjusted during render, as React recommends).
  const urlKey = searchParams.toString();
  const [prevUrlKey, setPrevUrlKey] = useState(urlKey);
  if (prevUrlKey !== urlKey) {
    setPrevUrlKey(urlKey);
    setStatus(statusFromUrl());
    setLocation(locationFromUrl());
  }

  // A new filter starts again from the first page (adjusted during render, as React recommends).
  const filterKey = `${status}|${location}|${debouncedQuery}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(
    () =>
      initialProjects.filter(
        (p) =>
          (status === ALL || p.status === status) &&
          (!location || p.location === location) &&
          (!debouncedQuery ||
            [p.name, p.location, p.description].some((f) => f?.toLowerCase().includes(debouncedQuery))),
      ),
    [initialProjects, status, location, debouncedQuery],
  );
  const shown = filtered.slice(0, visibleCount);

  const clearFilters = () => {
    setStatus(ALL);
    setLocation(null);
    setQuery("");
  };

  return (
    <div onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)}>
      {/* Controls — Figma: status chips on the left, search and location on the right. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-[clamp(16px,5vw,80px)] overflow-x-auto lg:mx-0 lg:overflow-visible">
          <FilterChips
            options={[ALL, ...statuses]}
            value={status}
            onChange={setStatus}
            tall
            className="w-max px-[clamp(16px,5vw,80px)] lg:px-0"
          />
        </div>
        <Appear preset="lift" delay={0.55} className="relative flex gap-3">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search project"
            className="flex-1 lg:w-[240px] lg:flex-none"
          />
          <LocationSelect options={locations} value={location} onChange={setLocation} />
        </Appear>
      </div>

      {shown.length > 0 ? (
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-x-5 gap-y-14 md:mt-20 md:grid-cols-2 md:gap-y-20 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} armed={armed} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          title="No projects found"
          copy="No projects match these filters. Try another status, location or search."
          onClear={clearFilters}
          className="mt-12 md:mt-20"
        />
      )}

      {visibleCount < filtered.length && (
        // Block wrapper so the reveal sentinel sits at the button's own slot.
        <div className="relative mt-14 flex justify-center md:mt-20">
          <Appear preset="lift">
            <GreenPill onClick={() => setVisibleCount((n) => n + PAGE_SIZE)} arrow>
              Load more projects
            </GreenPill>
          </Appear>
        </div>
      )}
    </div>
  );
}
