import { DarkHero } from "@/components/section/shared/dark_hero";
import { splitBlogTitle } from "@/lib/blogs";

/**
 * Figma "Blog Details" hero. API titles are SEO titles ("Headline | Tagline"), so the headline is
 * the 48px title and the tagline, when there is one, becomes the line of copy beneath it.
 */
export function BlogDetailHero({ title, category }: { title: string; category?: string | null }) {
  const { headline, tagline } = splitBlogTitle(title);
  return (
    <DarkHero
      compact
      eyebrow={`${category?.trim() || "News"} / Details`}
      title={[headline]}
      titleSize={[48, 30]}
      titleWidth={760}
      copy={tagline}
      copyWidth={672}
    />
  );
}
