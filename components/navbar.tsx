"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useLenis } from "@/components/providers/smooth_scroll";
import { useIntro } from "@/components/providers/intro";
import { cn, SPRING } from "@/lib/utils";
import { Shutter } from "@/components/ui/motion";
import { RollingText } from "@/components/ui/rolling_text";
import { CONTACT, MENU_ITEMS, SOCIALS } from "@/lib/site";
import { clearClientSession, hasClientSession } from "@/lib/client-auth";
import { normalizeProject, type ProjectData } from "@/lib/projects";

/* Prestix menu timeline: the panel grows down in 0.6s, then items fade up 0.6s each, 0.08s apart. */
const PANEL = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };
const ITEM = { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const };
const LINK_START = 0.5;

// Module-level cache so the projects for the menu search and feature card load once per visit.
let cachedProjects: ProjectData[] | null = null;

function useMenuProjects(open: boolean) {
  const [projects, setProjects] = useState<ProjectData[]>(() => cachedProjects ?? []);

  useEffect(() => {
    if (!open || cachedProjects) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) return;
    fetch(`${baseUrl.replace(/\/+$/, "")}/projects`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const rawList = Array.isArray(data) ? data : data?.projects || data?.data || [];
        if (!Array.isArray(rawList)) return;
        cachedProjects = rawList.map((item) => normalizeProject(item));
        setProjects(cachedProjects);
      })
      .catch((err) => console.error("[Navbar] Projects fetch error:", err));
  }, [open]);

  return projects;
}

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function MenuLink({
  href,
  index,
  active,
  onClick,
  children,
}: {
  href: string;
  index: number;
  active?: boolean;
  onClick: () => void;
  children: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={{ opacity: 0.001, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={
        reduce ? { duration: 0 } : { ...ITEM, delay: LINK_START + index * 0.07 }
      }
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group relative flex items-baseline py-[0.28em] font-display text-[30px] leading-[1.1] sm:text-[34px] lg:text-[clamp(30px,4.4vh,40px)]",
          active ? "text-gold" : "text-warm",
        )}
      >
        <span className="relative">
          <RollingText text={children} />
          {/* Hairline grows under the label on hover; stays on the active item */}
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-[0.06em] left-0 h-px bg-gold transition-[width] duration-[450ms] ease-out-expo",
              active ? "w-full" : "w-0 group-hover:w-full",
            )}
          />
        </span>
      </Link>
    </motion.li>
  );
}

function MenuMeta({
  label,
  children,
  delay,
  className,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0.001, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={reduce ? { duration: 0 } : { ...ITEM, delay }}
      className={cn("flex flex-col gap-2", className)}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
        {label}
      </span>
      {children}
    </motion.div>
  );
}

/** Glass pill shared by the "All Project" link and the menu toggle. */
function navPillClass(tone: "neutral" | "warm", light: boolean) {
  return cn(
    "glass press group relative flex h-[42px] items-center overflow-hidden rounded-full text-[14px] font-medium uppercase tracking-[2px] backdrop-blur-[6px] hover:tracking-[2.6px]",
    // Figma: rgba(24,24,24,.15) or gold 12%, each under a plus-lighter #171717 (≈ +9% white).
    light
      ? "bg-green/10 text-green"
      : tone === "warm"
        ? "bg-[rgba(241,211,183,0.2)] text-white"
        : "bg-white/10 text-white",
  );
}

/** Arrow used by the menu's call-to-action links; nudges and turns gold with the label. */
function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-[translate,color] duration-[350ms] ease-out-expo group-hover:translate-x-[5px] group-hover:text-gold"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function AuthActions({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Read once the menu mounts; the session lives in localStorage, which the server cannot see.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(hasClientSession());
  }, []);

  const pill =
    "press group inline-flex h-[52px] items-center gap-4 rounded-full py-1 pl-7 pr-1.5 text-[14px] font-medium uppercase tracking-[2px] hover:tracking-[2.6px]";
  const disc = "grid size-10 place-items-center rounded-full";
  const icon = (d: string) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="nudge"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );

  if (!loggedIn) {
    return (
      <Link href="/login" onClick={onNavigate} className={cn(pill, "bg-gold text-green-deep")}>
        <span className="trim leading-[1.7]">Login</span>
        <span className={cn(disc, "bg-green-deep text-gold")}>
          {icon("M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3")}
        </span>
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/dashboard" onClick={onNavigate} className={cn(pill, "bg-gold text-green-deep")}>
        <span className="trim leading-[1.7]">Dashboard</span>
        <span className={cn(disc, "bg-green-deep text-gold")}>
          {icon("M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z")}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => {
          clearClientSession();
          setLoggedIn(false);
          onNavigate();
          router.push("/login");
        }}
        className={cn(pill, "border border-white/15 text-warm hover:border-gold")}
      >
        <span className="trim leading-[1.7]">Log out</span>
        <span className={cn(disc, "bg-white/10 text-warm")}>
          {icon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9")}
        </span>
      </button>
    </div>
  );
}

/** Live project search from the menu; Enter opens the full projects list filtered by the query. */
function MenuSearch({
  query,
  setQuery,
  onSubmit,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSubmit: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.form
      role="search"
      initial={{ opacity: 0.001, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={reduce ? { duration: 0 } : { ...ITEM, delay: LINK_START - 0.1 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-3 border-b border-white/15 py-2 transition-colors focus-within:border-gold"
    >
      <Image src="/home/icons/search.svg" alt="" width={20} height={20} className="size-5 opacity-60" />
      <label htmlFor="menu-search" className="sr-only">
        Search projects
      </label>
      <input
        id="menu-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects…"
        autoComplete="off"
        className="w-full bg-transparent text-[16px] text-warm placeholder:text-warm/40 focus:outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="text-[20px] leading-none text-warm/50 transition-colors hover:text-warm"
        >
          ×
        </button>
      )}
    </motion.form>
  );
}

export interface NavbarProps {
  /** "light" pages start with a bright hero: green logo and dark pills until the page scrolls. */
  theme?: "dark" | "light";
}

export function Navbar({ theme }: NavbarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const projects = useMenuProjects(open);
  const featured = projects[0];

  const lightTop = !solid && !open && (theme === "light" || pathname === "/about");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setSolid(y > 120);
  });

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  // Only touch scrolling when the menu actually opens or closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else if (wasOpen.current) {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    wasOpen.current = open;
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return projects
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, projects]);

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    close();
    router.push(`/projects?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Drops in from above once the intro lifts, and tucks away on scroll down. */}
      <motion.header
        initial={{ y: -80 }}
        animate={done ? { y: hidden && !open ? -110 : 0 } : undefined}
        transition={
          reduce ? { duration: 0 } : { ...SPRING, delay: hidden ? 0 : 0.15 }
        }
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(9,34,28,0.75)] to-transparent transition-opacity duration-700",
            solid && !open ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="shell relative flex items-center justify-between py-4 md:py-6">
          <Link
            href="/"
            onClick={close}
            aria-label="The Premium Homes — home"
            className="press relative block h-9 w-[160px] md:h-[52px] md:w-[231px]"
          >
            <Image
              src={lightTop ? "/image/logo/LOGO-GREEN.png" : "/image/logo/LOGO-WHITE.png"}
              alt="The Premium Homes"
              fill
              preload
              sizes="(min-width: 768px) 231px, 160px"
              className="object-contain object-left"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              onClick={close}
              className={cn(navPillClass("neutral", lightTop), "hidden px-4 sm:flex")}
            >
              <span className="trim leading-[1.7]">All Project</span>
            </Link>
            <button
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className={cn(navPillClass("warm", lightTop), "gap-2 px-6")}
            >
              {/* Two 32px bars; open: both move to the middle and cross at 45°, scaled to a 16px X */}
              <span className="relative block h-[10.5px] w-8">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full origin-center rounded bg-current transition-transform duration-500 ease-out-expo",
                    open && "translate-y-[4.5px] rotate-45 scale-x-50",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full origin-center rounded bg-current transition-transform duration-500 ease-out-expo",
                    open
                      ? "translate-y-[-4.5px] -rotate-45 scale-x-50"
                      : "group-hover:scale-x-75",
                  )}
                />
              </span>
              <span className="trim leading-[1.7]">
                {open ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            data-lenis-prevent
            initial={{ height: "0dvh" }}
            animate={{ height: "100dvh" }}
            exit={{
              height: "0dvh",
              transition: reduce
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
            }}
            transition={reduce ? { duration: 0 } : PANEL}
            className="fixed inset-x-0 top-0 z-40 overflow-hidden bg-green-deep"
          >
            {/* Fixed-height stage so content does not reflow while the panel grows down */}
            <div className="absolute inset-x-0 top-0 mx-auto flex h-[100dvh] w-full max-w-[1600px] flex-col pt-[72px] md:pt-[88px] lg:flex-row">
              {/* Photo column with a caption, so the menu doubles as a feature slot */}
              <motion.div
                initial={{ opacity: 0.001 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.35, delay: 0.05 }
                }
                className="relative hidden lg:flex lg:w-[34%] lg:flex-col lg:justify-center lg:py-[clamp(24px,3vh,40px)] lg:pl-[clamp(16px,5vw,80px)]"
              >
                <div className="relative aspect-[4/5] max-h-[calc(100dvh-88px-clamp(24px,3vh,40px)-120px)] w-full overflow-hidden rounded-[20px]">
                  {/* Opens with the same shutter as the page photos once the panel has mostly
                      unrolled; blades in the menu's deep green so nothing flashes. */}
                  <Shutter
                    play
                    delay={0.35}
                    tone="bg-green-deep"
                    className="absolute inset-0"
                  >
                    <div className="relative size-full">
                      <Image
                        src={featured?.image ?? "/home/img/project-studio.jpg"}
                        alt=""
                        fill
                        sizes="34vw"
                        className="object-cover"
                      />
                    </div>
                  </Shutter>
                  <div className="absolute inset-0 bg-gradient-to-t from-green-deep/90 via-green-deep/10 to-transparent" />
                  <motion.div
                    initial={{ opacity: 0.001, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduce ? { duration: 0 } : { ...ITEM, delay: 0.9 }
                    }
                    className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-[clamp(24px,2.5vw,40px)]"
                  >
                    <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-gold">
                      Featured project
                    </span>
                    <p className="font-display text-[clamp(26px,2.2vw,34px)] capitalize leading-[1.15] text-warm">
                      {featured?.name ?? "Our Developments"}
                    </p>
                    <p className="text-[14px] text-warm/70">
                      {featured?.location ?? "Dhaka, Bangladesh"}
                    </p>
                    <Link
                      href={featured ? `/projects/${featured.slug || featured.id}` : "/projects"}
                      onClick={close}
                      className="group mt-1 inline-flex w-fit items-center gap-2 text-[13px] font-medium uppercase leading-none tracking-[0.08em] text-warm"
                    >
                      <RollingText text="View project" tight />
                      <ArrowIcon />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="shell flex flex-1 flex-col justify-center gap-8 py-6 lg:gap-10 lg:px-[clamp(40px,4vw,72px)]">
                  <MenuSearch query={query} setQuery={setQuery} onSubmit={submitSearch} />

                  {query.trim() ? (
                    <div className="flex flex-col gap-3">
                      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
                        Projects ({results.length})
                      </span>
                      {results.length > 0 ? (
                        <ul className="grid gap-3 lg:grid-cols-2">
                          {results.map((p) => (
                            <li key={p.id}>
                              <Link
                                href={`/projects/${p.slug || p.id}`}
                                onClick={close}
                                className="group flex items-center gap-4 rounded-[14px] border border-white/10 p-2.5 transition-colors hover:border-gold/60 hover:bg-white/[0.04]"
                              >
                                <span className="zoom-frame relative size-14 shrink-0 rounded-[10px]">
                                  <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-display text-[20px] leading-[1.2] text-warm transition-colors group-hover:text-gold">
                                    {p.name}
                                  </span>
                                  <span className="block truncate text-[13px] text-warm/60">{p.location}</span>
                                </span>
                                <ArrowIcon />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-6 text-[15px] text-warm/60">
                          No projects matching &ldquo;{query}&rdquo;.{" "}
                          <Link href="/projects" onClick={close} className="text-gold hover:underline">
                            Explore all projects
                          </Link>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Ten links: one column on phones, two columns of five from the large breakpoint */
                    <nav aria-label="Menu">
                      <ul className="grid gap-x-[clamp(32px,4vw,72px)] lg:grid-cols-2 lg:grid-rows-5 lg:grid-flow-col">
                        {MENU_ITEMS.map((item, i) => (
                          <MenuLink
                            key={item.href}
                            href={item.href}
                            index={i}
                            active={isActivePath(pathname, item.href)}
                            onClick={close}
                          >
                            {item.name}
                          </MenuLink>
                        ))}
                      </ul>
                    </nav>
                  )}

                  {/* Login + contact facts on one baseline */}
                  <div className="flex flex-col gap-8 border-t border-white/10 pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                    <motion.div
                      initial={{ opacity: 0.001, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { ...ITEM, delay: LINK_START + MENU_ITEMS.length * 0.07 }
                      }
                    >
                      <AuthActions onNavigate={close} />
                    </motion.div>

                    <div className="grid grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-[auto_auto_1fr] md:gap-x-[clamp(32px,4vw,64px)]">
                      <MenuMeta
                        label="Hotline"
                        delay={LINK_START + (MENU_ITEMS.length + 1) * 0.07}
                      >
                        <a
                          href={CONTACT.hotline.href}
                          className="whitespace-nowrap text-[16px] font-medium text-gold transition-colors hover:text-warm"
                        >
                          {CONTACT.hotline.label}
                        </a>
                      </MenuMeta>
                      <MenuMeta
                        label="Inquiries"
                        delay={LINK_START + (MENU_ITEMS.length + 2) * 0.07}
                      >
                        <a
                          href={CONTACT.inquiries.href}
                          className="whitespace-nowrap text-[16px] text-warm transition-colors hover:text-gold"
                        >
                          {CONTACT.inquiries.label}
                        </a>
                      </MenuMeta>
                      <MenuMeta
                        label="Follow us"
                        delay={LINK_START + (MENU_ITEMS.length + 3) * 0.07}
                        className="col-span-2 md:col-span-1"
                      >
                        <ul className="flex items-center gap-2">
                          {SOCIALS.map((s) => (
                            <li key={s.label}>
                              <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="press grid size-9 place-items-center rounded-full border border-white/15 text-warm hover:border-gold hover:bg-gold hover:text-green-deep"
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden
                                >
                                  <path d={s.d} />
                                </svg>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </MenuMeta>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
