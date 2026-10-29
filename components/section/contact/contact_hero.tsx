import { DarkHero } from "@/components/section/shared/dark_hero";

export function ContactHero() {
  return (
    <DarkHero
      compact
      eyebrow="Homepage / Contact Us"
      title={["Contact Us"]}
      copy="We're here to help you find your dream home. Reach out to us anytime!"
      copyWidth={672}
    />
  );
}
