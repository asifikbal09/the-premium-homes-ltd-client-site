"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Transition,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react";
import { cn, SETTLE, SPRING, SPRING_SLOW } from "@/lib/utils";

/*
 * Appear presets. Big travel, no bounce, little or no fade: the block arrives
 * rather than materialises.
 */
export type Preset =
  | "rise"
  | "drop"
  | "grow"
  | "left"
  | "right"
  | "fade"
  | "slide"
  | "lift"
  | "pop";

const HIDDEN: Record<Preset, Record<string, number>> = {
  rise: { opacity: 0.001, y: 120 },
  drop: { opacity: 0.001, y: -120 },
  grow: { opacity: 0.001, scale: 0.86 },
  left: { opacity: 0.001, x: -72 },
  right: { opacity: 0.001, x: 96 },
  fade: { opacity: 0.001 },
  slide: { opacity: 1, y: 220 },
  lift: { opacity: 0.001, y: 20 }, // a small fade-up for secondary elements like buttons
  pop: { opacity: 0.001, scale: 0.55 }, // scales up in place, for photos in a collage
};
const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1 };

type AppearProps = HTMLMotionProps<"div"> & {
  preset?: Preset;
  delay?: number;
  /** Kept for call-site readability; entry is judged at the element's slot, see below. */
  amount?: number;
  /** Drive the animation by hand (intro choreography) instead of by scroll. */
  play?: boolean;
  slow?: boolean;
  as?: "div" | "section" | "article" | "li" | "span" | "p";
};

/**
 * Inside a flex or grid container an absolute box's static position is the container's start,
 * and an absolutely placed element is not at its in-flow slot at all, so a sentinel is pinned to
 * the element's layout top (offsetTop ignores the hidden transform). Re-pinned on layout changes.
 */
function usePinnedSentinel(
  sentinelRef: React.RefObject<HTMLElement | null>,
  elRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const sentinel = sentinelRef.current;
    const el = elRef.current;
    if (!sentinel || !el) return;
    const pin = () => {
      if (el.offsetParent === sentinel.offsetParent)
        sentinel.style.top = `${el.offsetTop}px`;
    };
    pin();
    const ro = new ResizeObserver(pin);
    if (el.offsetParent) ro.observe(el.offsetParent);
    return () => ro.disconnect();
  }, [enabled, sentinelRef, elRef]);
}

/**
 * Entry is observed on a zero-size sentinel at the element's slot, never on
 * the element itself: while hidden it sits well below its slot, and inside a
 * clipped card that puts it out of view for good, so it would never fire.
 */
export function Appear({
  preset = "rise",
  delay = 0,
  amount: _amount,
  play,
  slow,
  as = "div",
  transition,
  children,
  ...rest
}: AppearProps) {
  void _amount;
  const ref = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();
  const Tag = (motion as unknown as Record<string, typeof motion.div>)[as];

  usePinnedSentinel(ref, tagRef, play === undefined);
  const t: Transition = reduce
    ? { duration: 0 }
    : { ...(slow ? SPRING_SLOW : SPRING), delay, ...transition };
  const show = play ?? inView;
  return (
    <>
      {/* Spans the slot horizontally so a slot that starts off-screen still registers. */}
      {play === undefined && (
        <span
          ref={ref}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-0"
        />
      )}
      <Tag
        ref={tagRef}
        initial={HIDDEN[preset]}
        animate={show ? SHOWN : HIDDEN[preset]}
        transition={t}
        {...rest}
      >
        {children}
      </Tag>
    </>
  );
}

/**
 * Text reveal in the Domio manner. Each unit starts invisible and a little
 * low, then fades and rises in 0.45s. `by="lines"` moves every word on a line
 * together and lets the next line follow; `by="chars"` runs letter by letter.
 * `mask` makes units rise from behind a clip instead of fading, the way a
 * wordmark is revealed. In `chars` mode do not pair it with `capitalize`:
 * every letter span counts as a word start and would be uppercased.
 */
export function Words({
  text,
  as: Tag = "p",
  className,
  style,
  delay = 0,
  play,
  amount = 0.4,
  by = "lines",
  mask = false,
  stagger,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  play?: boolean;
  amount?: number;
  by?: "lines" | "words" | "chars";
  mask?: boolean;
  /** Seconds between units; defaults per mode. */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const show = play ?? inView;
  const words = text.split(" ");
  const [lines, setLines] = useState<number[]>([]);

  // Group words into visual lines after layout so a line can move as one.
  useLayoutEffect(() => {
    if (by !== "lines" || !ref.current) return;
    const el = ref.current;
    const measure = () => {
      const spans = el.querySelectorAll<HTMLElement>("[data-word]");
      let line = -1;
      let lastTop = Number.NaN;
      const idx: number[] = [];
      spans.forEach((sp) => {
        const top = sp.offsetTop;
        if (top !== lastTop) {
          line += 1;
          lastTop = top;
        }
        idx.push(line);
      });
      setLines((prev) =>
        prev.length === idx.length && prev.every((v, i) => v === idx[i])
          ? prev
          : idx,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [by, text]);

  const step =
    stagger ??
    (by === "chars" ? (mask ? 0.035 : 0.014) : by === "words" ? 0.05 : 0.09);
  const duration = mask ? 0.9 : 0.45;
  const hidden = mask ? { y: "110%" } : { opacity: 0.001, y: "0.3em" };
  const shown = mask ? { y: "0%" } : { opacity: 1, y: "0em" };
  let charCount = 0;

  const unit = (content: string, wordIdx: number, charIdx: number) => {
    const order =
      by === "lines"
        ? (lines[wordIdx] ?? 0)
        : by === "words"
          ? wordIdx
          : charIdx;
    const t = reduce
      ? { duration: 0 }
      : { duration, ease: SETTLE, delay: delay + order * step };
    const inner = (
      <motion.span
        aria-hidden
        className="inline-block"
        initial={hidden}
        animate={show ? shown : hidden}
        transition={t}
      >
        {content}
      </motion.span>
    );
    return mask ? (
      <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
        {inner}
      </span>
    ) : (
      inner
    );
  };

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span data-word className="inline-block whitespace-nowrap">
            {by === "chars"
              ? [...word].map((ch, c) => (
                  <Fragment key={c}>{unit(ch, w, charCount++)}</Fragment>
                ))
              : unit(word, w, 0)}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

/** Paragraph whose words ink in as it scrolls through the viewport. A "\n" in `text` forces a line break. */
export function InkScrub({
  text,
  className,
  style,
  indent,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  indent?: React.ReactNode;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} style={style} aria-label={text.replace(/\n/g, " ")}>
      {indent}
      {words.map((w, i) => (
        <Fragment key={i}>
          {w.split("\n").map((part, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              <InkWord word={part} i={i} total={words.length} progress={scrollYProgress} />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </p>
  );
}

function InkWord({
  word,
  i,
  total,
  progress,
}: {
  word: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each word inks over a window slightly longer than its share, so neighbours overlap;
  // the window is clamped so the last word still reaches full ink.
  const start = (i / total) * 0.92;
  const opacity = useTransform(
    progress,
    [start, Math.min(1, start + 1.3 / total)],
    [0.16, 1],
  );
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/** Rolls a number up to `value` once in view, preserving a suffix like "+". */
const WHEEL_FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // trailing 0 so 9 → 0 wraps without a jump

/**
 * One odometer wheel: a strip of digit faces slid by a continuous index. The wheel is as wide as
 * the digit it lands on, so proportional figures keep their natural spacing ("1200", not "1 200").
 */
function Wheel({ index, digit }: { index: MotionValue<number>; digit: number }) {
  const y = useTransform(index, (v) => `${-v}em`);
  return (
    <span className="relative inline-block h-[1em] leading-none [overflow-y:clip]">
      <span className="invisible">{digit}</span>
      <motion.span style={{ y }} className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
        {WHEEL_FACES.map((n, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Odometer. `value` like "75+" or "02": once in view every digit wheel rolls
 * from 0 through one full turn to its own digit, all on one eased progress, so
 * the wheels move at a readable speed and settle together. Suffix is static.
 */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const digits = match ? match[1].length : 0;
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 1, {
      duration: reduce ? 0 : 2.4,
      ease: SETTLE,
    });
    return () => controls.stop();
  }, [inView, progress, reduce]);

  return (
    <span
      ref={ref}
      className={cn("inline-flex", className)}
      role="img"
      aria-label={value}
    >
      {Array.from({ length: digits }, (_, i) => digits - 1 - i).map((place) => (
        <OdometerWheel
          key={place}
          progress={progress}
          digit={Math.floor(target / 10 ** place) % 10}
        />
      ))}
      <span className="inline-block h-[1em] leading-none">{suffix}</span>
    </span>
  );
}

/** Wheel that travels one full turn plus `digit` faces as progress runs 0 → 1. */
function OdometerWheel({
  progress,
  digit,
}: {
  progress: MotionValue<number>;
  digit: number;
}) {
  const index = useTransform(
    progress,
    (p) => (Math.min(Math.max(p, 0), 1) * (10 + digit)) % 10,
  );
  return <Wheel index={index} digit={digit} />;
}

/**
 * Shutter reveal: the photo sits in place behind a stack of page-coloured
 * blades, one per horizontal band. On reveal each band grows downward from a
 * thin line at its top (its blade shrinks toward the band's bottom), the top
 * bands first, the whole thing in about 0.7s, while the photo settles from a
 * slight zoom. The frame's shadow fades in once the blades are gone, so no
 * empty frame is ever seen.
 */
export function Shutter({
  children,
  className,
  delay = 0,
  play,
  blades = 8,
  shadow,
  tone = "bg-white",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  play?: boolean;
  blades?: number;
  /** CSS box-shadow to fade in after the reveal. */
  shadow?: string;
  /** Blade colour, the page background behind the frame. */
  tone?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  usePinnedSentinel(ref, frameRef, play === undefined);
  const reduce = useReducedMotion();
  const show = play ?? inView;
  const none = "0 0 0 0 rgba(0,0,0,0)";
  const step = 100 / blades;
  return (
    <>
      {play === undefined && (
        <span
          ref={ref}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-0"
        />
      )}
      <motion.div
        ref={frameRef}
        initial={{ boxShadow: none }}
        animate={{ boxShadow: show && shadow ? shadow : none }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.6, ease: "easeOut", delay: delay + 0.75 }
        }
        className={cn("overflow-hidden", className)}
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: show ? 1 : 1.08 }}
          transition={
            reduce ? { duration: 0 } : { duration: 1.2, ease: SETTLE, delay }
          }
          className="size-full"
        >
          {children}
        </motion.div>
        {Array.from({ length: blades }, (_, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: show ? 0 : 1, opacity: show ? 0 : 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    scaleY: {
                      duration: 0.45,
                      ease: SETTLE,
                      delay: delay + i * 0.05,
                    },
                    // The blade fades at the end of its travel so no hairline lingers on the seam.
                    opacity: { duration: 0.12, delay: delay + i * 0.05 + 0.3 },
                  }
            }
            style={{ top: `${i * step}%`, height: `calc(${step}% + 1px)` }}
            className={cn("absolute inset-x-0 origin-bottom", tone)}
          />
        ))}
      </motion.div>
    </>
  );
}

/**
 * Shutter for cut-outs and anything over a busy background: instead of painting blades over the
 * picture, the picture itself is masked into 8 horizontal bands, and each band grows downward
 * from its top edge, top band first. Nothing is drawn on top, so it works over gradients and
 * transparent PNGs. The mask is removed once open so it costs nothing afterwards.
 */
export function ShutterMask({
  children,
  className,
  play,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  play: boolean;
  delay?: number;
}) {
  const [done, setDone] = useState(false);
  const bands = 8;
  const step = 100 / bands;
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(
      () => setDone(true),
      (delay + 0.45 + bands * 0.05) * 1000 + 100,
    );
    return () => clearTimeout(t);
  }, [play, delay]);
  if (done) return <div className={className}>{children}</div>;
  const layers = Array.from({ length: bands }, (_, i) => {
    const s = (i * step).toFixed(3);
    return `linear-gradient(to bottom, transparent ${s}%, #000 ${s}%, #000 calc(${s}% + var(--sb${i})), transparent calc(${s}% + var(--sb${i})))`;
  }).join(", ");
  const style: Record<string, string> = {
    maskImage: layers,
    WebkitMaskImage: layers,
    transition: Array.from(
      { length: bands },
      (_, i) =>
        `--sb${i} 450ms cubic-bezier(0.22, 1, 0.36, 1) ${Math.round((delay + i * 0.05) * 1000)}ms`,
    ).join(", "),
  };
  // A hair of overlap so neighbouring bands never leave a seam.
  for (let i = 0; i < bands; i++)
    style[`--sb${i}`] = play ? `${step + 0.4}%` : "0%";
  // Reduced motion is handled in CSS: the server cannot know the setting, and branching on it here
  // left the server's closed mask in place after hydration.
  return (
    <div
      className={cn(
        className,
        "motion-reduce:![-webkit-mask-image:none] motion-reduce:![mask-image:none]",
      )}
      style={style}
    >
      {children}
    </div>
  );
}

/** Image that drifts against the scroll inside a clipped frame. */
export function Drift({
  children,
  className,
  amount = 60,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y, top: -amount, bottom: -amount }}
        className="absolute inset-x-0 will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
