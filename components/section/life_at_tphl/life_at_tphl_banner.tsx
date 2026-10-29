"use client";

import Image from "next/image";
import { Drift } from "@/components/ui/motion";

/**
 * Figma: a full-bleed 1600 × 910 window onto a 1200-tall photo, so the photo drifts against the
 * scroll by the 145px it overhangs on each side.
 */
export function LifeAtTphlBanner() {
  return (
    <Drift amount={145} className="aspect-[1600/910] max-h-[910px] w-full bg-green-deep max-md:aspect-[4/3]">
      <Image
        src="/image/life-at-tphl/tplt-team02.png"
        alt="TPHL project team gathered around a building scale model"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </Drift>
  );
}
