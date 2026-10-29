import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getBlogBySlug } from "@/lib/blogs";
import { BlogDetailHero } from "@/components/section/blogs/blog_detail_hero";
import { BlogDetailContent } from "@/components/section/blogs/blog_detail_content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlogBySlug(decodedSlug);

  if (!blog) {
    return {
      title: "Blog Not Found | Premium Homes Ltd.",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} | Premium Homes Ltd.`,
    description:
      blog.metaDescription ||
      blog.excerpt?.slice(0, 160) ||
      `Read ${blog.title} on Premium Homes Ltd.`,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt?.slice(0, 160),
      images: blog.image ? [{ url: blog.image }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlogBySlug(decodedSlug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <BlogDetailHero title={blog.title} category={blog.category} />
        <BlogDetailContent blog={blog} />
      </main>
      <Footer reveal />
    </div>
  );
}
