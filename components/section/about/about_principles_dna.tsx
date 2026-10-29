"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Appear } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Figma "Principles" frame: 1600 × 961. */
const W = 1600;
const H = 961;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Badge boxes (60px circle + label) on the Figma frame. */
const STEPS = [
  { name: "Discover", x: 80, y: 480 },
  { name: "Decide", x: 259, y: 727 },
  { name: "Book", x: 734, y: 480 },
  { name: "Track", x: 1049, y: 754 },
  { name: "Belong", x: 1288, y: 546 },
];

/** The dotted helix band: Figma draws it from y 573 to 728, bleeding past both edges. */
const WAVE = { center: 650 / H, amplitude: 77 / H };
const RUNG_SPACING = 46;
const PERIODS = 1.25;
const STEP_MS = 2600;

const COPY =
  "The TPHL relationship does not end at booking. It continues through construction progress, handover, support, and long-term community value.";

/**
 * Double helix of dots joined by fine rungs, turning slowly. Rungs near the active step read a
 * little darker so the highlight travels along the strand with the step.
 */
function useHelix(canvasRef: React.RefObject<HTMLCanvasElement | null>, activeX: number, running: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const turn = running ? ((now - start) / 1000) * 0.6 : 0;
      const cy = height * WAVE.center;
      const amp = height * WAVE.amplitude;
      const n = Math.ceil(width / RUNG_SPACING) + 1;
      const glowX = activeX * width;
      for (let i = 0; i < n; i++) {
        const x = i * RUNG_SPACING;
        const phase = (x / width) * Math.PI * 2 * PERIODS + turn;
        const y1 = cy + amp * Math.sin(phase);
        const y2 = cy - amp * Math.sin(phase);
        const z = Math.cos(phase); // which strand is in front
        const near = Math.max(0, 1 - Math.abs(x - glowX) / (width * 0.12));
        // Figma's rungs lean with the twist, so the far end of each sits a little to one side.
        const x2 = x + amp * 0.45 * z;

        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(5, 75, 60, ${0.28 + near * 0.35})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        for (const [dx, y, depth] of [[x, y1, z], [x2, y2, -z]] as const) {
          ctx.beginPath();
          ctx.arc(dx, y, 2.6 + depth * 0.6 + near * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(5, 75, 60, ${0.75 + depth * 0.25})`;
          ctx.fill();
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef, activeX, running]);
}

function Step({
  index,
  name,
  active,
  onSelect,
  delay,
}: {
  index: number;
  name: string;
  active: boolean;
  onSelect: () => void;
  delay: number;
}) {
  return (
    <Appear preset="lift" delay={delay}>
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={onSelect}
        aria-pressed={active}
        className="group flex items-center gap-[17px]"
      >
        <span
          className={cn(
            "grid size-[clamp(44px,3.75vw,60px)] shrink-0 place-items-center rounded-full font-display font-medium leading-none transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:scale-110",
            active ? "bg-green text-white" : "bg-white text-green",
          )}
          style={{ fontSize: "clamp(22px,2vw,32px)" }}
        >
          {index + 1}
        </span>
        <span className="whitespace-nowrap font-display font-medium leading-none text-green" style={{ fontSize: "clamp(22px,2vw,32px)" }}>
          {name}
        </span>
      </button>
    </Appear>
  );
}

/**
 * Heading and copy mask in, the helix starts turning once the section is in view, and the five steps
 * fade up along it. The active step walks forward on its own; hovering or clicking a step takes it.
 */
export function AboutPrinciplesDna() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!inView || held || reduce) return;
    const t = setInterval(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, [inView, held, reduce]);

  const activeX = (STEPS[active].x + 30) / W;
  useHelix(canvasRef, activeX, inView && !reduce);

  return (
    <section
      ref={sectionRef}
      aria-label="The principles behind every promise"
      className="relative overflow-hidden bg-[#e0d1b6]"
      onMouseLeave={() => setHeld(false)}
    >
      <div className="shell flex flex-col items-center gap-8 pt-16 text-center lg:absolute lg:inset-x-0 lg:top-[100px] lg:z-10 lg:pt-0">
        <Heading size={72} min={40} leading={1} mask className="max-w-[770px]">
          The principles behind every promise
        </Heading>
        <Appear as="p" preset="lift" delay={0.2} className="max-w-[522px] text-[clamp(15px,1.125vw,18px)] capitalize leading-[1.4] text-sage">
          {COPY}
        </Appear>
      </div>

      {/* Desktop: the Figma frame with the helix across it and the steps placed on the wave. */}
      <div className="relative mx-auto hidden aspect-[1600/961] w-full max-w-[1600px] lg:block" onMouseEnter={() => setHeld(true)}>
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        {STEPS.map((s, i) => (
          <div key={s.name} className="absolute z-10" style={{ left: pct(s.x, W), top: pct(s.y, H) }}>
            <Step index={i} name={s.name} active={i === active} onSelect={() => setActive(i)} delay={0.3 + i * 0.1} />
          </div>
        ))}
      </div>

      {/* Phones and tablets: the steps as a list. */}
      <ol className="shell flex flex-col gap-5 pb-16 pt-10 lg:hidden">
        {STEPS.map((s, i) => (
          <li key={s.name}>
            <Step index={i} name={s.name} active={i === active} onSelect={() => setActive(i)} delay={i * 0.08} />
          </li>
        ))}
      </ol>
    </section>
  );
}
