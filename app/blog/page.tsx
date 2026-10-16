import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { PostGrid } from "@/components/blog/post-grid";
import { CtaSection } from "@/components/landing/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_DESCRIPTION, BLOG_SECTION, getAllPosts } from "@/lib/blog";
import { BASE_URL, breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";

const base = buildMetadata({
  title: BLOG_SECTION.label,
  description: BLOG_DESCRIPTION,
  path: BLOG_SECTION.path,
  keywords: [
    "personal loan blog canada",
    "loan tips canada",
    "borrowing news canada",
    "365loan blog",
  ],
});

export const metadata: Metadata = {
  ...base,
  alternates: {
    ...base.alternates,
    types: { "application/rss+xml": `${BASE_URL}${BLOG_SECTION.path}/feed.xml` },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: BLOG_SECTION.label, path: BLOG_SECTION.path },
          ]),
          ...(posts.length > 0 ? [itemListJsonLd(BLOG_SECTION, posts)] : []),
        ]}
      />

      {/* Page header */}
      <section className="relative pt-36 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[55vw] h-[55vh] bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--color-primary)_9%,transparent),transparent_65%)]" />
        </div>
        <div className="relative z-10 max-w-[720px] mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: BLOG_SECTION.label }]} />
          <div className="flex flex-col items-center gap-1.5 mb-5">
            <div className="w-7 h-px bg-foreground/40" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              Blog
            </span>
          </div>
          <h1 className="font-heading font-black text-[2.25rem] lg:text-[3rem] text-foreground leading-[1.1] tracking-tight mb-5">
            The 365loan <span className="text-primary">Blog</span>
          </h1>
          <p className="text-[0.95rem] text-muted-foreground max-w-[540px] leading-relaxed">
            Rate news, borrowing tips, and plain-English takes on the rules that shape
            personal lending in Canada.
          </p>
        </div>
      </section>

      {/* Posts */}
      <PostGrid
        posts={posts}
        section={BLOG_SECTION}
        empty={{
          title: (
            <>
              New posts <span className="text-primary">coming soon</span>
            </>
          ),
          text: "We're putting together fresh rate news, borrowing tips, and honest guides for Canadian borrowers. Check back shortly — new articles will be posted here soon.",
          link: { label: "In the meantime, explore our loan guides", href: "/resources/guides" },
        }}
      />

      <CtaSection />
    </>
  );
}
