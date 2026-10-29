"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useLoopCarousel } from "@/components/ui/carousel";
import { Appear } from "@/components/ui/motion";
import { ArrowPair, Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SPRING_SLOW, SPRING_SOFT, fluid } from "@/lib/utils";

type TeamQuote = {
  name: string;
  role: string;
  image: string;
  headline: string;
  quote: string;
};

const TEAM_QUOTES: TeamQuote[] = [
  {
    name: "Mehedi H. Jony",
    role: "Head of IT & Digital Marketing",
    image: "/image/team/MehediHJonyBoss.png",
    headline: "Here, every role feels connected to something bigger.",
    quote: "Working at TPHL has helped me grow professionally while contributing to projects that matter to real families.",
  },
  {
    name: "Mahfuza Shikder Tanha",
    role: "Director",
    image: "/image/team/MahfuzaShikderTanha.png",
    headline: "Ambition is matched with opportunity here.",
    quote: "The company is growing fast, and that creates space for people to grow with it.",
  },
  {
    name: "Md. Golam Imran",
    role: "Head of Client Experience",
    image: "/image/team/MdGolamImam.png",
    headline: "Ambition is matched with opportunity here.",
    quote: "The company is growing fast, and that creates space for people to grow with it.",
  },
  {
    name: "Alfesani Shuvo",
    role: "Head of Operations & Control",
    image: "/image/team/AlfaaniShuvo.png",
    headline: "Collaboration powers everything we build.",
    quote: "Working with cross-functional teams toward shared goals creates an environment where everyone thrives.",
  },
  {
    name: "Mahbuba Reza CPA",
    role: "Executive Director",
    image: "/image/team/MahbubaRezaCPA.png",
    headline: "Integrity and long-term vision guide every step.",
    quote: "Every milestone we reach is rooted in genuine transparency, sound ethics, and our shared commitment to excellence.",
  },
  {
    name: "Md. Rayhan Bhuiyan",
    role: "General Manager, Sales",
    image: "/image/team/MdRayhanBhuiyan.png",
    headline: "Delivering meaningful journeys for families.",
    quote: "Helping families find their dream homes brings purpose and joy to the work we do every single day.",
  },
];

/** Figma card: 500 wide, warm fill, gold ribbon on the top edge, 316px portrait. */
function QuoteCard({ q, play, delay }: { q: TeamQuote; play: boolean; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="group flex h-full flex-col gap-8 bg-warm px-6 pb-8 transition-shadow duration-500 hover:shadow-[0_24px_48px_-24px_rgba(5,75,60,0.35)]">
      <div className="flex flex-col gap-5">
        {/* The ribbon drops in from above the card once the slider is in view. */}
        <motion.span
          aria-hidden
          initial={{ y: -32 }}
          animate={{ y: play ? 0 : -32 }}
          transition={reduce ? { duration: 0 } : { ...SPRING_SOFT, delay: delay + 0.35 }}
          className="relative block h-8 w-[30.17px] transition-[height] duration-500 ease-out-expo group-hover:h-11"
        >
          <Image src="/image/life-at-tphl/ribbon.svg" alt="" fill sizes="31px" />
        </motion.span>
        <p className="font-display font-medium capitalize leading-[1.2] text-green" style={{ fontSize: fluid(32, 24) }}>
          {q.headline}
        </p>
      </div>

      <div className="zoom-frame relative h-[clamp(240px,19.75vw,316px)] w-full bg-[#c3b3a0]">
        <div className="absolute inset-0">
          <Image src={q.image} alt={q.name} fill draggable={false} sizes="(min-width: 768px) 452px, 78vw" className="pointer-events-none object-cover object-[center_28%]" />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <p className="text-[16px] leading-[1.4] text-ink">{q.quote}</p>
        <div className="flex flex-col gap-2">
          <p className="font-display text-[20px] font-medium leading-[1.5] text-green">{q.name}</p>
          <p className="text-[14px] leading-[1.2] text-sage">{q.role}</p>
        </div>
        <span aria-hidden className="h-px w-full bg-[#e0d1b6]" />
        <div className="flex items-center justify-between">
          <p className="whitespace-nowrap font-display text-[clamp(16px,1.25vw,20px)] font-medium leading-[1.5] tracking-[-0.2px] text-green">Team Member</p>
          <Image src="/image/logo/LOGO-GREEN.png" alt="Premium Homes" width={142} height={32} className="h-8 w-[142px]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Figma "What our team says": heading with the arrow pair, then a row of quote cards running off
 * the right edge. Endless both ways, draggable; cards slide in one after another on entry.
 */
export function LifeAtTphlTeamSays() {
  const N = TEAM_QUOTES.length;
  const LOOP = [...TEAM_QUOTES, ...TEAM_QUOTES, ...TEAM_QUOTES];
  const { trackRef, x, prev, next, onDragEnd, isClone } = useLoopCarousel(N);
  // The copies left of the first card stay hidden until the slider is used, so the gutter is empty.
  const [touched, setTouched] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInView(sectionRef, { once: true, amount: 0.15 });
  const touch = (go: () => void) => () => {
    setTouched(true);
    go();
  };

  return (
    <section ref={sectionRef} aria-label="What our team says" className="bg-white pb-10 pt-[clamp(56px,5vw,80px)]">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Heading size={64} min={36} leading={1} mask play={seen}>
          What Our Team Says.
        </Heading>
        <Appear preset="lift" play={seen} delay={0.35}>
          <ArrowPair onPrev={touch(prev)} onNext={touch(next)} />
        </Appear>
      </div>

      <div className="mt-10 w-full overflow-hidden md:mt-16">
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => setTouched(true)}
          onDragEnd={onDragEnd}
          className="flex w-max cursor-grab touch-pan-y gap-4 px-[clamp(16px,5vw,80px)] active:cursor-grabbing md:gap-6 3xl:pl-[calc((100vw-1600px)/2+80px)]"
        >
          {LOOP.map((q, i) => (
            <motion.article
              key={i}
              aria-hidden={isClone(i) ? true : undefined}
              style={i < N && !touched ? { visibility: "hidden" } : undefined}
              initial={{ opacity: 0.001, x: 160 }}
              animate={seen ? { opacity: 1, x: 0 } : { opacity: 0.001, x: 160 }}
              transition={{ ...SPRING_SLOW, delay: 0.4 + (i % N) * 0.12 }}
              className="w-[min(82vw,clamp(300px,31.25vw,500px))] shrink-0 select-none"
            >
              <QuoteCard q={q} play={seen} delay={0.4 + (i % N) * 0.12} />
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="shell mt-12">
        <div className="h-px bg-stone-2/40" />
      </div>
    </section>
  );
}
