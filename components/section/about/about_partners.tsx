"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface PartnerItem {
  id: number | string;
  image_path?: string;
  logo?: string;
  name?: string;
  order?: number;
}

const INITIAL_PARTNERS: PartnerItem[] = [
  // Row 1 (6 items): BSRM, GPH ispat, Shah Cement, Crown Cement, KSRM, CSRM
  {
    id: 2,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1785398398_6a6b047e326fb.png",
    order: 2,
    name: "BSRM",
  },
  {
    id: 3,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1785398413_6a6b048d3e964.jfif",
    order: 3,
    name: "GPH Ispat",
  },
  {
    id: 4,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1785398413_6a6b048d3fc0c.webp",
    order: 4,
    name: "Shah Cement",
  },
  {
    id: 5,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1785398422_6a6b0496a2efd.webp",
    order: 5,
    name: "Crown Cement",
  },
  {
    id: 6,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789279544_6aa63d385486c.jpg",
    order: 6,
    name: "KSRM",
  },
  {
    id: 7,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789279768_6aa63e182c929.webp",
    order: 7,
    name: "CSRM",
  },

  // Row 2 (6 items): AKS, LafargeHolcim, Seven Rings Cement, Premier Cement, Fresh, Anwar
  {
    id: 8,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789279768_6aa63e182d5f8.jpg",
    order: 8,
    name: "AKS",
  },
  {
    id: 9,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789280774_6aa642065dc45.webp",
    order: 9,
    name: "LafargeHolcim",
  },
  {
    id: 10,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789280881_6aa642714aab5.png",
    order: 10,
    name: "Seven Rings Cement",
  },
  {
    id: 11,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789281563_6aa6451b88a02.png",
    order: 11,
    name: "Premier Cement",
  },
  {
    id: 12,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789281563_6aa6451b89973.jpg",
    order: 12,
    name: "Fresh Cement",
  },
  {
    id: 13,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789281563_6aa6451b8a8b3.jpg",
    order: 13,
    name: "Anwar Cement",
  },

  // Row 3 (3 items, Centered): ABC, Akij Ready Mix, Bashundhara Cement
  {
    id: 14,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789281848_6aa64638d63aa.jpg",
    order: 14,
    name: "ABC",
  },
  {
    id: 15,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789281910_6aa646769b5d3.png",
    order: 15,
    name: "Akij Ready Mix",
  },
  {
    id: 16,
    image_path:
      "https://api.dpremiumhomes.com/uploads/partners/1789282609_6aa649319eb6f.png",
    order: 16,
    name: "Bashundhara Cement",
  },
];

// Custom scale map to ensure every logo (even those with excessive white margins) appears large & bold
const PARTNER_CUSTOM_SCALES: Record<number, string> = {
  2: "scale-[1.65]", // BSRM
  3: "scale-[1.25]", // GPH ispat
  4: "scale-[1.65]", // Shah Cement
  5: "scale-[2.1]", // Crown Cement (small file canvas, 2.1x zoom)
  6: "scale-[1.35]", // KSRM
  7: "scale-[1.15]", // CSRM
  8: "scale-[1.3]", // AKS
  9: "scale-[1.25]", // LafargeHolcim
  10: "scale-[1.9]", // Seven Rings Cement (1.9x zoom)
  11: "scale-[1.8]", // Premier Cement (1.8x zoom)
  12: "scale-[1.5]", // Fresh Cement
  13: "scale-[1.5]", // Anwar Cement
  14: "scale-[1.65]", // ABC
  15: "scale-[2.1]", // Akij Ready Mix (small file canvas, 2.1x zoom)
  16: "scale-[1.9]", // Bashundhara Cement (1.9x zoom)
};

interface PartnerCardProps {
  partner: PartnerItem;
  index: number;
}

function PartnerCard({ partner, index }: PartnerCardProps) {
  const imgSrc = partner.image_path || partner.logo || "";
  if (!imgSrc) return null;

  // BSRM (id 2) and ABC (id 14) have yellow backgrounds in Figma
  const isBSRM =
    partner.id === 2 || partner.name?.toLowerCase().includes("bsrm");
  const isABC =
    partner.id === 14 || partner.name?.toLowerCase().includes("abc");

  let cardBg = "bg-white";
  if (isBSRM) cardBg = "bg-[#FFD500]";
  else if (isABC) cardBg = "bg-[#F5B800]";

  const partnerIdNum = Number(partner.id);
  const customScale =
    PARTNER_CUSTOM_SCALES[partnerIdNum] || "scale-125";

  return (
    <div
      className={`relative w-full h-[70px] sm:h-[78px] md:h-[84px] lg:h-[90px] ${cardBg} rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-center p-2 sm:p-2.5 overflow-hidden group`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={partner.name || `Partner ${index + 1}`}
          fill
          unoptimized
          sizes="240px"
          className={`object-contain p-1 ${customScale} transition-transform duration-300 group-hover:scale-[1.35]`}
        />
      </div>
    </div>
  );
}

export function AboutPartners() {
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api";
    const cleanBase = baseUrl.replace(/\/+$/, "");

    fetch(`${cleanBase}/about-settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load partner settings");
        return res.json();
      })
      .then((data) => {
        const partnerList =
          data?.partners || data?.settings?.partners || data?.data?.partners;
        if (Array.isArray(partnerList) && partnerList.length > 0) {
          const sorted = [...partnerList].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );
          setPartners(sorted);
        }
      })
      .catch((err) => {
        console.warn("AboutPartners: using initial fallback partners", err);
      });
  }, []);

  const row1 = partners.slice(0, 6);
  const row2 = partners.slice(6, 12);
  const row3 = partners.slice(12, 15);

  return (
    <section
      aria-label="Our Partners and Suppliers"
      className="relative w-full bg-[#FAF8F5] py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden text-[#1f2723]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-[1.12] tracking-tight">
            Our Partners/
            <br />
            Suppliers
          </h2>
        </div>

        {/* 6 + 6 + 3 Layout strictly matching Figma design */}
        <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4 max-w-[1260px] mx-auto w-full">
          {/* Row 1: Exactly 6 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-3.5 md:gap-4 w-full">
            {row1.map((partner, index) => (
              <PartnerCard
                key={partner.id || `row1-${index}`}
                partner={partner}
                index={index}
              />
            ))}
          </div>

          {/* Row 2: Exactly 6 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-3.5 md:gap-4 w-full">
            {row2.map((partner, index) => (
              <PartnerCard
                key={partner.id || `row2-${index}`}
                partner={partner}
                index={index + 6}
              />
            ))}
          </div>

          {/* Row 3: Exactly 3 columns centered */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 md:gap-4 w-full">
            {row3.map((partner, index) => (
              <div
                key={partner.id || `row3-${index}`}
                className="w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:w-[calc((100%-5*16px)/6)]"
              >
                <PartnerCard partner={partner} index={index + 12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
