import React from "react";
import Image from "next/image";
import type { BlogDetail } from "@/lib/blogs";

interface BlogDetailContentProps {
  blog: BlogDetail;
}

export function BlogDetailContent({ blog }: BlogDetailContentProps) {
  const sections: { title?: string | null; content: string }[] = [];

  if (blog.excerpt) {
    sections.push({
      title: null,
      content: blog.excerpt,
    });
  }

  const pairs: [string | null | undefined, string | null | undefined][] = [
    [blog.title2, blog.excerpt2],
    [blog.title3, blog.excerpt3],
    [blog.title4, blog.excerpt4],
    [blog.title5, blog.excerpt5],
    [blog.title6, blog.excerpt6],
    [blog.title7, blog.excerpt7],
    [blog.title8, blog.excerpt8],
    [blog.title9, blog.excerpt9],
    [blog.title10, blog.excerpt10],
  ];

  for (const [t, ex] of pairs) {
    if (ex && ex.trim() !== "") {
      sections.push({
        title: t && t.trim() !== "" ? t.trim() : null,
        content: ex.trim(),
      });
    }
  }

  if (blog.description && !blog.excerpt && sections.length === 0) {
    sections.push({
      title: null,
      content: blog.description,
    });
  }

  const imageUrl =
    blog.image || "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg";

  return (
    <article className="w-full bg-white text-[#1f2723] py-10 sm:py-14 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#0d3b31] font-normal leading-snug mb-8 sm:mb-10">
          {blog.title}
        </h1>

        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100 mb-8 sm:mb-12 shadow-xs">
          <Image
            src={imageUrl}
            alt={blog.title || "Blog Image"}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
            className="object-cover object-center"
          />
        </div>

        <div className="prose prose-neutral max-w-none">
          {blog.content ? (
            <div
              className="space-y-6 text-neutral-700 text-base sm:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {section.title && (
                    <h2 className="font-heading text-xl sm:text-2xl text-[#0d3b31] font-medium pt-3">
                      {section.title}
                    </h2>
                  )}
                  <p className="text-neutral-700 text-base sm:text-[17px] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
