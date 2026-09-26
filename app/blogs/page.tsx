import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogsHero } from "@/components/section/blogs/blogs_hero";
import { BlogsGrid } from "@/components/section/blogs/blogs_grid";

export const metadata: Metadata = {
  title: "Blogs, Insights | Premium Homes Ltd.",
  description:
    "Explore the latest insights, news, architectural stories, and community updates from Premium Homes Ltd.",
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BlogsHero />
        <BlogsGrid />
      </main>
      <Footer />
    </div>
  );
}
