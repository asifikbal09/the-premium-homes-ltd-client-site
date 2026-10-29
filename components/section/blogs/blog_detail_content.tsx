import Image from "next/image";
import { Appear, Shutter } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { blogSections, formatBlogDate, splitBlogTitle, type BlogDetail } from "@/lib/blogs";
import { BlogMeta } from "./blog_meta";

// Figma sets the body in 24px; it is eased to 22px with a looser leading so long posts stay readable.
const BODY = "text-[clamp(17px,1.375vw,22px)] leading-[1.7] text-sage";
// Rich `content` from the CMS, styled to match the plain sections.
const RICH =
  "flex flex-col gap-6 [&_a]:text-green [&_a]:underline [&_h2]:font-display [&_h2]:text-[clamp(28px,2.5vw,40px)] [&_h2]:leading-[1.2] [&_h2]:text-green [&_h3]:font-display [&_h3]:text-[clamp(24px,2vw,32px)] [&_h3]:text-green [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6";

function Paragraph({ children }: { children: string }) {
  return (
    <Appear as="p" preset="lift" className={BODY}>
      {children}
    </Appear>
  );
}

/**
 * Figma "Blog Details" body, fitted to the API: a 1062 column with the post's meta and its one photo
 * opening on the shutter, then the intro and each titled section. Headings rise out of a clip and
 * paragraphs fade up as they scroll in.
 */
export function BlogDetailContent({ blog }: { blog: BlogDetail }) {
  const { intro, sections } = blogSections(blog);

  return (
    <article className="bg-white py-[clamp(56px,7.5vw,120px)]">
      <div className="shell">
        <div className="relative mx-auto flex max-w-[1062px] flex-col gap-10">
          <Appear preset="lift">
            <BlogMeta items={[blog.category?.trim() || "News", formatBlogDate(blog.date || blog.created_at), blog.readTime]} />
          </Appear>

          {blog.image && (
            <Shutter className="relative aspect-[1062/693] bg-mist">
              <div className="absolute inset-0">
                <Image
                  src={blog.image}
                  alt={splitBlogTitle(blog.title).headline}
                  fill
                  priority
                  sizes="(min-width: 1200px) 1062px, 92vw"
                  className="object-cover"
                />
              </div>
            </Shutter>
          )}

          {blog.content ? (
            <Appear preset="lift">
              <div className={`${BODY} ${RICH}`} dangerouslySetInnerHTML={{ __html: blog.content }} />
            </Appear>
          ) : (
            <>
              {intro.map((p, i) => (
                <Paragraph key={i}>{p}</Paragraph>
              ))}
              {sections.map((section, i) => (
                <section key={i} className="relative flex flex-col gap-6">
                  {section.heading && (
                    <Heading size={40} min={28} leading={1.2} mask>
                      {section.heading}
                    </Heading>
                  )}
                  {section.paragraphs.map((p, j) => (
                    <Paragraph key={j}>{p}</Paragraph>
                  ))}
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
