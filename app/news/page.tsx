import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { PostGrid } from "@/components/blog/post-grid";
import { CtaSection } from "@/components/landing/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllNews, NEWS_DESCRIPTION, NEWS_SECTION } from "@/lib/news";
import { BASE_URL, breadcrumbJsonLd, buildMetadata, itemListJsonLd } from "@/lib/seo";

const base = buildMetadata({
  title: NEWS_SECTION.label,
  description: NEWS_DESCRIPTION,
  path: NEWS_SECTION.path,
  keywords: [
    "canada loan news",
    "interest rate news canada",
    "consumer debt news canada",
    "365loan news",
  ],
});

export const metadata: Metadata = {
  ...base,
  alternates: {
    ...base.alternates,
    types: { "application/rss+xml": `${BASE_URL}${NEWS_SECTION.path}/feed.xml` },
  },
};

export default function NewsPage() {
  const news = getAllNews();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: NEWS_SECTION.label, path: NEWS_SECTION.path },
          ]),
          ...(news.length > 0 ? [itemListJsonLd(NEWS_SECTION, news)] : []),
        ]}
      />

      {/* Page header */}
      <section className="relative pt-36 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[55vw] h-[55vh] bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--color-primary)_9%,transparent),transparent_65%)]" />
        </div>
        <div className="relative z-10 max-w-[720px] mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: NEWS_SECTION.label }]} />
          <div className="flex flex-col items-center gap-1.5 mb-5">
            <div className="w-7 h-px bg-foreground/40" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              News
            </span>
          </div>
          <h1 className="font-heading font-black text-[2.25rem] lg:text-[3rem] text-foreground leading-[1.1] tracking-tight mb-5">
            Loan &amp; Rate <span className="text-primary">News</span>
          </h1>
          <p className="text-[0.95rem] text-muted-foreground max-w-[540px] leading-relaxed">
            Bank of Canada decisions, lending data, and rule changes that affect what you
            pay to borrow — reported in plain English.
          </p>
        </div>
      </section>

      {/* Items */}
      <PostGrid
        posts={news}
        section={NEWS_SECTION}
        empty={{
          title: (
            <>
              News <span className="text-primary">coming soon</span>
            </>
          ),
          text: "We're tracking Bank of Canada decisions, lending data, and rule changes that affect Canadian borrowers. Check back shortly — the latest updates will be posted here.",
          link: { label: "In the meantime, read the blog", href: "/blog" },
        }}
      />

      <CtaSection />
    </>
  );
}
