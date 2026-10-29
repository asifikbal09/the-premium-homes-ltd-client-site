import { DarkHero } from "@/components/section/shared/dark_hero";

export function FAQHero() {
  return (
    <DarkHero
      compact
      eyebrow="Homepage / FAQ"
      title={["Frequently Asked", "Questions"]}
      copy="Find answers to common questions about Premium Homes Ltd."
      copyWidth={672}
    />
  );
}
