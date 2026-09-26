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
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="flex-1 w-full">
        <BlogDetailHero title={blog.title} category={blog.category} />
        <BlogDetailContent blog={blog} />
      </main>
      <Footer />
    </div>
  );
}
