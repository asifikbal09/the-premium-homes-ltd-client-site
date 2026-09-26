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
    .replace(/[\u2013\u2014]/g, " - ")
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

export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  if (!slug) return null;

  const rawSlug = slug.trim();
  const encodedSlug = encodeURIComponent(rawSlug);

  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api";
  const cleanBase = baseUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${cleanBase}/blogs/${encodedSlug}`, {
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
