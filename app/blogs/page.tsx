import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogsHero } from "@/components/section/blogs/blogs_hero";
import { BlogsGrid } from "@/components/section/blogs/blogs_grid";
import { getBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs, Insights | Premium Homes Ltd.",
  description:
    "Explore the latest insights, news, architectural stories, and community updates from Premium Homes Ltd.",
};

/** Sections in Figma "Blog" order. */
export default async function BlogsPage() {
  const posts = await getBlogs();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <BlogsHero />
        <BlogsGrid posts={posts} />
      </main>
      <Footer reveal />
    </div>
  );
}
