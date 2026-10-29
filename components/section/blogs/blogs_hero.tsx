import { DarkHero } from "@/components/section/shared/dark_hero";

export function BlogsHero() {
  return (
    <DarkHero
      compact
      eyebrow="Homepage / News"
      title={["Blogs, Insights"]}
      copy="Our Philosophy is simple, hire great people and give them the resources and support to do their best work"
      copyWidth={672}
    />
  );
}
