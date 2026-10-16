import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";

import { formatDate, type ArticleSection, type PostMeta } from "@/lib/content";

/** Card grid for the blog and news listing pages, with an empty state. */
export function PostGrid({
  posts,
  section,
  empty,
}: {
  posts: PostMeta[];
  section: ArticleSection;
  empty: { title: ReactNode; text: string; link: { label: string; href: string } };
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
        {posts.length === 0 ? (
          <div className="max-w-[520px] mx-auto text-center flex flex-col items-center py-8 lg:py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Newspaper size={26} className="text-primary" strokeWidth={1.75} />
            </div>
            <h2 className="font-heading font-black text-[1.6rem] lg:text-[2rem] text-foreground leading-tight mb-3">
              {empty.title}
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-8">{empty.text}</p>
            <Link
              href={empty.link.href}
              className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-foreground underline underline-offset-4 decoration-foreground/25 hover:decoration-foreground transition-all"
            >
              {empty.link.label}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`${section.path}/${post.slug}`}
                className="group flex flex-col bg-card border border-border hover:border-primary/30 rounded-2xl overflow-hidden transition-colors"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                  )}
                  <span className="absolute top-3 left-3 bg-background/85 backdrop-blur-sm text-[10px] font-bold tracking-[0.1em] uppercase text-primary px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="font-heading font-black text-[1.1rem] text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[0.85rem] text-muted-foreground leading-relaxed mb-5 flex-1">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wide text-muted-foreground/70">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                    <ArrowUpRight
                      size={13}
                      className="ml-auto text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
