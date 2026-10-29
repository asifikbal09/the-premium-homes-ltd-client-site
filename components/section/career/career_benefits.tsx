import { IconCard, type IconCardItem } from "@/components/section/shared/icon_card";
import { SectionIntro } from "@/components/section/shared/section_intro";

const ICONS = "/image/career/icons";

const BENEFITS: IconCardItem[] = [
  { icon: `${ICONS}/benefit-waterfront.svg`, title: "Waterfront Setting" },
  { icon: `${ICONS}/benefit-retail.svg`, title: "Retail & dining close" },
  { icon: `${ICONS}/benefit-city.svg`, title: "Easy city access" },
  { icon: `${ICONS}/benefit-amenities.svg`, title: "Lifestyle amenities Nearby" },
];

/** Figma shows the four benefits twice, as two rows of the same grid. */
const GRID = [...BENEFITS, ...BENEFITS];

export function CareerBenefits() {
  return (
    <section aria-label="Benefits designed for you" className="bg-white py-[clamp(64px,5vw,80px)]">
      <div className="shell flex flex-col gap-10">
        <SectionIntro
          eyebrow="Benefits & Perks"
          title="Benefits Designed for You"
          copy="We believe great work happens when people feel supported. Our benefits package is designed to help you thrive personally and professionally."
          copyWidth={752}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {GRID.map((item, i) => (
            <IconCard key={i} item={item} index={i % 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
