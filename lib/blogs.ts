import { API_BASE } from "./api";

export interface BlogDetail {
  id: number | string;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  category?: string | null;
  author?: string | null;
  date?: string | null;
  image?: string | null;
  excerpt?: string | null;
  comments?: number | null;
  readTime?: string | null;
  description?: string | null;
  content?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  title2?: string | null;
  excerpt2?: string | null;
  title3?: string | null;
  excerpt3?: string | null;
  title4?: string | null;
  excerpt4?: string | null;
  title5?: string | null;
  excerpt5?: string | null;
  title6?: string | null;
  excerpt6?: string | null;
  title7?: string | null;
  excerpt7?: string | null;
  title8?: string | null;
  excerpt8?: string | null;
  title9?: string | null;
  excerpt9?: string | null;
  title10?: string | null;
  excerpt10?: string | null;
}

export const FALLBACK_BLOG: BlogDetail = {
  id: 1,
  title: "Building Better Communities: The Future Of Modern Living",
  slug: "top-real-estate-company-in-bangladesh",
  category: "NEWS",
  author: "The Premium Homes Ltd.",
  date: "2026-03-12",
  image: "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg",
  excerpt:
    "Modern Living Is No Longer Only About Owning An Apartment. It Is About Belonging To A Place That Supports Everyday Life, Family Growth, Comfort, Safety, And Long-Term Value. For Today's Homebuyers, A Home Is More Than Four Walls. It Is The Community Around It, The Convenience It Creates, And The Confidence It Gives For The Future.",
  excerpt2:
    "At The Premium Homes Ltd. (TPHL), We Believe Better Communities Are Built Through Thoughtful Planning, Trusted Development, And A Deep Understanding Of How People Actually Live. As Bangladesh Continues To Grow Rapidly, The Need For Accessible, Well-Planned, And Premium Living Environments Is Becoming Stronger Than Ever.",
};

export function cleanBlogTitle(title?: string | null): string {
  if (!title) return "";
  return title
    // Dashes, including the API's mis-encoded ones ("\u00e2\u20ac" plus one more character).
    .replace(/\s*(?:\u00e2\u20ac.|[\u2013\u2014])\s*/g, " - ")
    .replace(/\s*\?["']\s*/g, " - ")
    .replace(/\s*\?"\s*/g, " - ")
    .replace(/[\uFFFD]/g, "")
    .trim();
}

export function sanitizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg";
  }
  if (url.startsWith("http://api.dpremiumhomes.com")) {
    return url.replace(
      "http://api.dpremiumhomes.com",
      "https://api.dpremiumhomes.com"
    );
  }
  return url;
}

/** What a blog card needs, trimmed from the full post so the listing page ships little data. */
export interface BlogSummary {
  id: number | string;
  slug: string | null;
  title: string;
  /** "News" when the post has none. */
  category: string;
  /** Like "Mar 12, 2026"; empty when the post has no valid date. */
  date: string;
  image: string;
  excerpt: string;
}

/** "Mar 12, 2026", formatted on the server so the client renders the same text. */
export function formatBlogDate(raw?: string | null): string {
  const d = raw ? new Date(raw) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Splits an SEO title like "Luxury Flats | The Premium Homes Ltd." at its first bar: the headline
 * before it, the tagline (possibly empty) after it.
 */
export function splitBlogTitle(title: string) {
  const [headline, ...rest] = title.split(/\s+\|\s+/);
  return { headline: headline.trim(), tagline: rest.join(" | ").trim() };
}

/**
 * Paragraphs of an API text field: split at its <br> tags, any other markup dropped, and a space
 * restored where the CMS ran two sentences together ("living.When" → "living. When").
 */
function toParagraphs(text?: string | null): string[] {
  return (text ?? "")
    .split(/<br\s*\/?>/i)
    .map((p) =>
      p
        .replace(/<[^>]*>/g, "")
        .replace(/([a-z])\.([A-Z][a-z])/g, "$1. $2")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export interface BlogSection {
  heading: string | null;
  paragraphs: string[];
}

/**
 * The post body as the API stores it: `excerpt` (or `description`) is the intro, then up to nine
 * `titleN` / `excerptN` pairs; a pair without text is skipped.
 */
export function blogSections(blog: BlogDetail): { intro: string[]; sections: BlogSection[] } {
  const sections = ([2, 3, 4, 5, 6, 7, 8, 9, 10] as const)
    .map((n) => ({
      heading: cleanBlogTitle(blog[`title${n}`]) || null,
      paragraphs: toParagraphs(blog[`excerpt${n}`]),
    }))
    .filter((s) => s.paragraphs.length > 0);
  return { intro: toParagraphs(blog.excerpt || blog.description), sections };
}

/** Every post from GET /blogs as card data, in the API's order. */
export async function getBlogs(): Promise<BlogSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/blogs`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[getBlogs] API responded with ${res.status}.`);
      return [];
    }

    const data = await res.json();
    const list: BlogDetail[] = Array.isArray(data) ? data : data?.blogs || data?.data || [];

    return list
      .filter((b) => b?.title)
      .map((b) => ({
        id: b.id,
        slug: b.slug || null,
        title: cleanBlogTitle(b.title),
        category: b.category?.trim() || "News",
        date: formatBlogDate(b.date || b.created_at),
        image: sanitizeImageUrl(b.image),
        excerpt: b.excerpt ?? "",
      }));
  } catch (error) {
    console.error("[getBlogs] Fetch error from API:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  if (!slug) return null;

  const rawSlug = slug.trim();
  const encodedSlug = encodeURIComponent(rawSlug);

  try {
    const res = await fetch(`${API_BASE}/blogs/${encodedSlug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (
        rawSlug === "top-real-estate-company-in-bangladesh" ||
        rawSlug === "building-better-communities-the-future-of-modern-living"
      ) {
        return FALLBACK_BLOG;
      }
      return null;
    }

    const data = await res.json();
    const blogData: BlogDetail | undefined = data?.blog || data?.data;

    if (!blogData || !blogData.title) {
      if (
        rawSlug === "top-real-estate-company-in-bangladesh" ||
        rawSlug === "building-better-communities-the-future-of-modern-living"
      ) {
        return FALLBACK_BLOG;
      }
      return null;
    }

    return {
      ...blogData,
      title: cleanBlogTitle(blogData.title),
      image: sanitizeImageUrl(blogData.image),
    };
  } catch (error) {
    console.warn(`[getBlogBySlug] Fetch error for slug ${slug}:`, error);
    if (
      rawSlug === "top-real-estate-company-in-bangladesh" ||
      rawSlug === "building-better-communities-the-future-of-modern-living"
    ) {
      return FALLBACK_BLOG;
    }
    return null;
  }
}
