"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Appear } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";

type Partner = { id: number; name: string; src: string; local: boolean };

/**
 * Figma's tiles, keyed by the partner id the API uses. Each is the whole 223 × 100 tile as drawn in
 * Figma (backdrop colour and trimmed logo), so the logos sit at the designed size.
 */
const ARTWORK: Record<number, string> = {
  2: "bsrm",
  3: "gph-ispat",
  4: "shah-cement",
  5: "crown-cement",
  6: "ksrm",
  7: "csrm",
  8: "aks",
  9: "lafargeholcim",
  10: "seven-rings-cement",
  11: "premier-cement",
  12: "fresh-cement",
  13: "anwar-cement",
  14: "abc",
  15: "akij-ready-mix",
  16: "bashundhara-cement",
};

const NAMES: Record<number, string> = {
  2: "BSRM",
  3: "GPH Ispat",
  4: "Shah Cement",
  5: "Crown Cement",
  6: "KSRM",
  7: "CSRM",
  8: "AKS",
  9: "LafargeHolcim",
  10: "Seven Rings Cement",
  11: "Premier Cement",
  12: "Fresh Cement",
  13: "Anwar Cement",
  14: "ABC",
  15: "Akij Ready Mix",
  16: "Bashundhara Cement",
};

const tile = (id: number): Partner => ({
  id,
  name: NAMES[id],
  src: `/image/about/partners/${ARTWORK[id]}.png`,
  local: true,
});

const INITIAL_PARTNERS = Object.keys(ARTWORK).map((id) => tile(Number(id)));

type ApiPartner = { id: number | string; image_path?: string; logo?: string; name?: string; order?: number };

/** Known partners keep Figma's artwork; anything added later in the admin shows its uploaded logo. */
function fromApi(list: ApiPartner[]): Partner[] {
  return [...list]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .flatMap((p) => {
      const id = Number(p.id);
      if (ARTWORK[id]) return [tile(id)];
      const src = p.image_path || p.logo;
      return src ? [{ id, name: p.name || "Partner", src, local: false }] : [];
    });
}

function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <div className="group relative aspect-[223/100] w-full overflow-hidden bg-white">
      <Image
        src={partner.src}
        alt={partner.name}
        fill
        unoptimized={!partner.local}
        sizes="(min-width: 768px) 14vw, 50vw"
        className={`transition-transform duration-500 ease-out-expo group-hover:scale-[1.06] ${
          partner.local ? "object-cover" : "object-contain p-4"
        }`}
      />
    </div>
  );
}

export function AboutPartners() {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);

  useEffect(() => {
    const base = (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");

    fetch(`${base}/about-settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load partner settings");
        return res.json();
      })
      .then((data) => {
        const list = data?.partners || data?.settings?.partners || data?.data?.partners;
        if (Array.isArray(list) && list.length > 0) setPartners(fromApi(list));
      })
      .catch((err) => {
        console.warn("AboutPartners: using initial fallback partners", err);
      });
  }, []);

  return (
    <section aria-label="Our partners and suppliers" className="relative w-full overflow-hidden bg-warm py-[clamp(64px,6.25vw,100px)]">
      <div className="shell flex flex-col items-center gap-[clamp(40px,4.5vw,72px)]">
        <Heading size={72} min={40} leading={1} mask className="max-w-[680px] text-center">
          Our partners/ suppliers
        </Heading>

        {/* Figma: six 223 × 100 tiles a row at 20px gaps, a short last row centred. Tiles rise in row by row. */}
        <ul className="flex w-full flex-wrap justify-center gap-3 md:gap-5">
          {partners.map((partner, index) => (
            <Appear
              key={partner.id}
              as="li"
              preset="lift"
              delay={Math.floor(index / 6) * 0.12 + (index % 6) * 0.06}
              className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] md:w-[calc((100%-100px)/6)]"
            >
              <PartnerTile partner={partner} />
            </Appear>
          ))}
        </ul>
      </div>
    </section>
  );
}
