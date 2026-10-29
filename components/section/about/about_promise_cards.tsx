"use client";

import { Appear, Counter } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";

const CARDS = [
  { title: "Affordable Premium", copy: "Better quality and planning without pushing ownership out of reach." },
  { title: "Transparent Buying", copy: "Clear details, payment plans, and decisions before commitment." },
  { title: "Delivery Focused", copy: "Progress, updates, and construction accountability as part of the brand." },
  { title: "Family First", copy: "Homes planned around everyday needs, not only showpiece luxury." },
];

/**
 * Figma "Premium without distance": a gold heading over four sage cards (346 × 420). The cards rise
 * in one after another, their numbers roll up on the odometer, and a card deepens to green on hover.
 */
export function AboutPromiseCards() {
  return (
    <section aria-label="Premium without distance, trust without confusion" className="bg-green-deep pb-[100px] pt-[clamp(64px,6.25vw,100px)]">
      <div className="shell flex flex-col items-center gap-[clamp(48px,6.25vw,100px)]">
        <Heading size={72} min={40} leading={1} mask className="max-w-[770px] text-center text-gold">
          Premium without distance. Trust without confusion.
        </Heading>
        <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[1.17vw]">
          {CARDS.map((c, i) => (
            <Appear
              key={c.title}
              as="li"
              preset="rise"
              delay={i * 0.1}
              className="group flex h-[clamp(320px,26.25vw,420px)] flex-col justify-between bg-sage px-9 py-6 text-white transition-colors duration-700 ease-out-expo hover:bg-green"
            >
              <div className="flex flex-col gap-6">
                {/* Figma sets every title on two lines, one word each. */}
                <h3 className="font-display font-medium leading-[1.2] text-[clamp(26px,2vw,32px)]">
                  {c.title.split(" ").map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
                <p className="text-[16px] capitalize leading-[1.4]">{c.copy}</p>
              </div>
              <Counter
                value={String(i + 1).padStart(2, "0")}
                className="font-display font-normal leading-none text-[clamp(56px,4.5vw,72px)] transition-colors duration-700 group-hover:text-gold"
              />
            </Appear>
          ))}
        </ul>
      </div>
    </section>
  );
}
