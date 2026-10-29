"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn, fluid, SETTLE } from "@/lib/utils";
import { Words } from "./motion";

/** Small gold all-caps label above section headings (Vazirmatn 16 / 500). */
export function Eyebrow({
  children,
  className,
  play,
}: {
  children: React.ReactNode;
  className?: string;
  /** Drive the reveal from a section trigger instead of the eyebrow's own visibility. */
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  const shown = { opacity: 1, y: 0 };
  const hidden = { opacity: 0.001, y: 24 };
  return (
    <motion.p
      initial={hidden}
      {...(play === undefined
        ? { whileInView: shown, viewport: { once: true, amount: 0.8 } }
        : { animate: play ? shown : hidden })}
      transition={{ duration: reduce ? 0 : 1, ease: SETTLE }}
      className={cn(
        "text-[14px] font-medium uppercase leading-[1.5] text-gold sm:text-[16px]",
        className,
      )}
    >
      {children}
    </motion.p>
  );
}

/**
 * Display-serif section heading whose words ink in. Figma sets section
 * headings in "K Victor Trial 50 Medium"; pass `weight="regular"` for the
 * "40 Regular" ones.
 */
export function Heading({
  children,
  size = 80,
  min = 40,
  leading = 1.2,
  className,
  as = "h2",
  delay = 0.1,
  weight = "medium",
  mask = false,
  by = "lines",
  play,
}: {
  children: string;
  /** Drive the reveal from a section trigger. */
  play?: boolean;
  size?: number;
  min?: number;
  leading?: number;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  weight?: "medium" | "regular";
  /** Lines rise out of a clip instead of fading in. */
  mask?: boolean;
  /** Reveal unit; "chars" runs letter by letter. */
  by?: "lines" | "words" | "chars";
}) {
  // Per-letter spans would make CSS `capitalize` uppercase every letter, so in chars mode the
  // title case is applied to the string instead.
  const chars = by === "chars";
  const text = chars
    ? children.replace(/(^|\s)(\S)/g, (_, sp, ch) => sp + ch.toUpperCase())
    : children;
  return (
    <Words
      as={as}
      text={text}
      delay={delay}
      mask={mask}
      by={by}
      play={play}
      className={cn(
        "font-display text-green",
        !chars && "capitalize",
        weight === "medium" ? "font-medium" : "font-normal!",
        className,
      )}
      style={{ fontSize: fluid(size, min), lineHeight: leading }}
    />
  );
}

type PillProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  size?: "md" | "lg";
  /** Curtain hover: a curved gold fill rises from the bottom and the label turns green. */
  arrow?: boolean;
  /** Renders a button instead of a link, for in-page actions like "load more". */
  onClick?: () => void;
  /** Renders a submit button, for the pill that sends a form. */
  type?: "submit";
  disabled?: boolean;
};

/** Link to `href`, or a plain button when the pill runs an action or submits a form. */
function PillTarget({
  href,
  onClick,
  type,
  disabled,
  className,
  children,
}: Pick<PillProps, "onClick" | "type" | "disabled"> & {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (onClick || type)
    return (
      <button
        type={type ?? "button"}
        onClick={onClick}
        disabled={disabled}
        className={cn(className, "disabled:opacity-70")}
      >
        {children}
      </button>
    );
  return (
    <Link
      href={href}
      {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
      className={className}
    >
      {children}
    </Link>
  );
}

/** All-caps label that rolls up as one line on hover, replaced by its green twin from below. */
function RollingLabel({ text }: { text: string }) {
  return (
    // A flex item of the pill itself (no inline wrapper), so the trimmed cap box is what gets centred: 15.5px from the top, as in Figma.
    <span
      aria-label={text}
      className="relative z-10 inline-flex overflow-hidden leading-none pb-[0.14em] -mb-[0.14em]"
    >
      <span
        aria-hidden
        // Same curve as the curtain, a beat behind it, so the green twin lands as the gold arrives under it.
        className="trim relative inline-block whitespace-nowrap transition-transform delay-[40ms] duration-[520ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-[calc(-100%-0.14em)]"
      >
        {text}
        <span className="trim absolute left-0 top-[calc(100%+0.14em)] whitespace-nowrap text-green">
          {text}
        </span>
      </span>
    </span>
  );
}

/** Solid green pill with gold label. Swells on hover, letters loosen a touch. */
export function GreenPill({
  children,
  className,
  href = "#",
  size = "md",
  arrow = false,
  onClick,
  type,
  disabled,
}: PillProps) {
  const target = { href, onClick, type, disabled };
  if (arrow) {
    // Figma pill. On hover a gold curtain with a curved top edge rises from the
    // bottom and fills the pill while the label rolls up into its green twin.
    const h = size === "md" ? "h-[42px]" : "h-[56px]";
    return (
      <PillTarget
        {...target}
        className={cn(
          "group relative inline-flex shrink-0 items-center overflow-hidden rounded-full bg-green px-6 text-[14px] font-medium uppercase tracking-[2px] text-gold",
          size === "lg" &&
            "whitespace-nowrap text-[12px] sm:px-8 sm:text-[14px]",
          h,
          className,
        )}
      >
        {typeof children === "string" ? (
          <RollingLabel text={children} />
        ) : (
          <span className="trim relative z-10 leading-[1.7]">{children}</span>
        )}
        {/* A wide ellipse, three pill-heights tall, parked below the pill; on hover it rises
            until it covers the pill, so only its convex top edge is ever seen moving. */}
        <span
          aria-hidden
          className={cn(
            "absolute -inset-x-[20%] top-[-100%] h-[300%] translate-y-[70%] rounded-[50%] bg-gold transition-[translate] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0",
          )}
        />
      </PillTarget>
    );
  }
  return (
    <PillTarget
      {...target}
      className={cn(
        "press inline-flex shrink-0 items-center rounded-full bg-green px-6 text-[14px] font-medium uppercase tracking-[2px] text-gold hover:tracking-[2.6px]",
        size === "md"
          ? "h-[42px]"
          : "h-[56px] whitespace-nowrap px-6 text-[12px] sm:px-8 sm:text-[14px]",
        className,
      )}
    >
      <span className="trim leading-[1.7]">{children}</span>
    </PillTarget>
  );
}

/** The long arrow from the design, drawn inline so it can take the button's colour. */
function LongArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14.8334 29.0807"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M7.41802 28.3334L7.41802 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.0834 21.6641C14.0834 21.6641 9.17346 28.3307 7.41666 28.3307C5.65987 28.3307 0.750049 21.6641 0.750049 21.6641"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Prev / next oval arrow pair used by testimonials and blogs. Both rest as a
 * white outline with a green arrow; the hovered one turns solid green with a
 * gold arrow that nudges along its direction.
 */
export function ArrowPair({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}) {
  const base =
    "group grid h-[42px] w-[72px] place-items-center rounded-[59px] border border-green bg-white text-green transition-colors duration-500 ease-out enabled:hover:bg-green enabled:hover:text-gold disabled:opacity-40";
  const arrow =
    "h-[29px] w-[14.83px] transition-[translate] duration-500 ease-out-expo";
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        disabled={!canPrev}
        className={base}
      >
        <LongArrow
          className={cn(
            arrow,
            "rotate-90 group-enabled:group-hover:-translate-x-[5px]",
          )}
        />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        disabled={!canNext}
        className={base}
      >
        <LongArrow
          className={cn(
            arrow,
            "-rotate-90 group-enabled:group-hover:translate-x-[5px]",
          )}
        />
      </button>
    </div>
  );
}

/** Two rows of the brand tile pattern, drifting as a slow, constant marquee. */
export function PatternStrip({ tone }: { tone: "light" | "dark" }) {
  const src =
    tone === "light" ? "/home/icons/pattern-light.svg" : "/home/icons/pattern-dark.svg";
  // 2 × 12 tiles so translating by -50% loops seamlessly.
  const row = (
    <div className="flex">
      {Array.from({ length: 24 }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          width={182}
          height={76.67}
          className="block h-[clamp(48px,4.79vw,76.67px)] w-auto shrink-0"
        />
      ))}
    </div>
  );
  return (
    <div aria-hidden className="w-full overflow-hidden">
      <div
        className="w-max will-change-transform"
        style={{ animation: "marquee 80s linear infinite" }}
      >
        <div className="-mb-px">{row}</div>
        {row}
      </div>
    </div>
  );
}

export { fluid };
