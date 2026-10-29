import { Appear } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { IconCard, type IconCardItem } from "@/components/section/shared/icon_card";

const ICONS = "/image/career/icons";

const VALUES: IconCardItem[] = [
  {
    icon: `${ICONS}/value-integrity.svg`,
    title: "Integrity",
    body: "We prioritize integrity in all our actions, ensuring that we uphold ethical standards and take responsibility.",
  },
  {
    icon: `${ICONS}/value-excellence.svg`,
    title: "Excellence",
    body: "Striving for excellence means paying attention to every detail. It's about going beyond the ordinary and ensuring.",
  },
  {
    icon: `${ICONS}/value-innovation.svg`,
    title: "Innovation",
    body: "Innovation thrives on the smallest details. It's in the nuances where groundbreaking ideas are born.",
  },
  {
    icon: `${ICONS}/value-collaboration.svg`,
    title: "Collaboration",
    body: "Collaboration is key to success. When we work together, every detail contributes to a greater outcome.",
  },
];

/** Figma "Featured Project V.2": title left, copy right, then four value cards. */
export function CareerCulture() {
  return (
    <section aria-label="Our culture and values" className="bg-white py-[clamp(64px,7.5vw,120px)]">
      <div className="shell flex flex-col gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Heading size={64} min={36} leading={1.1} mask>
            Our Culture & Values
          </Heading>
          <Appear as="p" preset="lift" delay={0.3} className="max-w-[480px] text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-sage">
            We foster an environment where people can learn, grow, and create meaningful impact. Our values guide every
            decision and reflect who we are.
          </Appear>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item, i) => (
            <IconCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
