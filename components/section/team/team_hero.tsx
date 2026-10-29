import { DarkHero } from "@/components/section/shared/dark_hero";

export function TeamHero() {
  return (
    <DarkHero
      eyebrow="Meet the Team"
      title={["The People Behind", "Every Premium Home."]}
      copy="Our Philosophy is simple, hire great people and give them the resources and support to do their best work"
      copyWidth={672}
    />
  );
}
