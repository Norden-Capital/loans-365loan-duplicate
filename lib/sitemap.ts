import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { LOAN_AMOUNTS } from "@/lib/loans/amounts";
import { LOAN_PURPOSES } from "@/lib/loans/purposes";
import { CREDIT_SCORE_RANGES } from "@/lib/loans/credit-scores";
import { LOAN_TYPES } from "@/lib/loans/types";
import { PROVINCES } from "@/lib/loans/locations";
import { REPAYMENT_TERMS } from "@/lib/loans/terms";
import { COMPARISONS } from "@/lib/loans/comparisons";
import { GUIDES } from "@/lib/guides";
import { getAllPosts } from "@/lib/blog";
import { getAllNews } from "@/lib/news";

// Each section is served at /sitemap/<section>.xml and listed by the index at /sitemap.xml
export const sitemapSections = ["pages", "loans", "resources", "blog", "news"] as const;

export type SitemapSection = (typeof sitemapSections)[number];

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFreq = SitemapEntry["changeFrequency"];

// Last real content change of each page group (YYYY-MM-DD), taken from git history.
// Update a date ONLY when that group's visible content changes: text, data (amounts,
// rates, FAQs, tables, lists), body links, sections added or removed. Do NOT update it
// for metadata/JSON-LD, analytics, styling or code-only changes, so search engines can
// keep trusting these dates. /blog, /news and their posts are dated from the posts.
const pageLastModified = {
  home: "2026-07-08", // the home URL also takes the date of its newest listed blog post (see getSitemapEntries)
  aboutus: "2026-07-07",
  contact: "2026-08-15",
  applicationForm: "2026-08-07",
  privacyPolicy: "2026-07-07",
  termsOfUse: "2026-07-07",
  loans: "2026-07-07", // /loans hub only
  byAmount: "2026-07-07", // hub + /loans/by-amount/<amount>
  byPurpose: "2026-07-07", // hub + /loans/by-purpose/<purpose>
  byCreditScore: "2026-07-07", // hub + /loans/by-credit-score/<range>
  byType: "2026-07-07", // hub + /loans/by-type/<type>
  byLocation: "2026-07-07", // hub + /loans/by-location/<province>
  byTerm: "2026-07-07", // hub + /loans/by-term/<term>
  resources: "2026-07-07", // /resources hub only
  guides: "2026-07-07", // hub + /resources/guides/<guide>
  comparisons: "2026-07-07", // hub + /resources/comparisons/<comparison>
  faq: "2026-07-07",
  loanCalculator: "2026-07-07",
};

type PageGroup = keyof typeof pageLastModified;

function toDate(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

// Listing pages (and the home page) change whenever their newest post does.
function newestDate(days: string[]): Date | undefined {
  if (days.length === 0) return undefined;
  return toDate(days.reduce((latest, day) => (day > latest ? day : latest)));
}

function page(path: string, group: PageGroup, priority: number, changeFrequency: ChangeFreq): SitemapEntry {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: toDate(pageLastModified[group]),
    changeFrequency,
    priority,
  };
}

export function isSitemapSection(value: string): value is SitemapSection {
  return (sitemapSections as readonly string[]).includes(value);
}

export function getSitemapEntries(section: SitemapSection): MetadataRoute.Sitemap {
  if (section === "blog") {
    const posts = getAllPosts();
    return [
      {
        url: `${BASE_URL}/blog`,
        lastModified: newestDate(posts.map((post) => post.updated)),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...posts.map((post): SitemapEntry => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: toDate(post.updated),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    ];
  }

  if (section === "news") {
    const news = getAllNews();
    return [
      {
        url: `${BASE_URL}/news`,
        lastModified: newestDate(news.map((item) => item.updated)),
        changeFrequency: "daily",
        priority: 0.8,
      },
      ...news.map((item): SitemapEntry => ({
        url: `${BASE_URL}/news/${item.slug}`,
        lastModified: toDate(item.updated),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    ];
  }

  if (section === "loans") {
    return [
      page("/loans",                 "loans",         0.9, "weekly"),
      page("/loans/by-amount",       "byAmount",      0.8, "monthly"),
      page("/loans/by-purpose",      "byPurpose",     0.8, "monthly"),
      page("/loans/by-credit-score", "byCreditScore", 0.8, "monthly"),
      page("/loans/by-type",         "byType",        0.8, "monthly"),
      page("/loans/by-location",     "byLocation",    0.8, "monthly"),
      page("/loans/by-term",         "byTerm",        0.8, "monthly"),
      ...LOAN_AMOUNTS.map((a) => page(`/loans/by-amount/${a.slug}`, "byAmount", 0.7, "monthly")),
      ...LOAN_PURPOSES.map((p) => page(`/loans/by-purpose/${p.slug}`, "byPurpose", 0.7, "monthly")),
      ...CREDIT_SCORE_RANGES.map((r) => page(`/loans/by-credit-score/${r.slug}`, "byCreditScore", 0.7, "monthly")),
      ...LOAN_TYPES.map((t) => page(`/loans/by-type/${t.slug}`, "byType", 0.7, "monthly")),
      ...PROVINCES.map((p) => page(`/loans/by-location/${p.slug}`, "byLocation", 0.7, "monthly")),
      ...REPAYMENT_TERMS.map((t) => page(`/loans/by-term/${t.slug}`, "byTerm", 0.7, "monthly")),
    ];
  }

  if (section === "resources") {
    return [
      page("/resources",                       "resources",      0.8, "weekly"),
      page("/resources/guides",                "guides",         0.7, "weekly"),
      page("/resources/comparisons",           "comparisons",    0.7, "monthly"),
      page("/resources/faq",                   "faq",            0.7, "monthly"),
      page("/resources/tools/loan-calculator", "loanCalculator", 0.7, "monthly"),
      ...COMPARISONS.map((c) => page(`/resources/comparisons/${c.slug}`, "comparisons", 0.6, "monthly")),
      ...GUIDES.map((g) => page(`/resources/guides/${g.slug}`, "guides", 0.6, "monthly")),
    ];
  }

  // The home page lists the 3 newest blog posts (components/landing/blog-section.tsx —
  // keep the count in sync), so it also changes whenever one of those posts does.
  const homePosts = getAllPosts().slice(0, 3);

  return [
    {
      url: `${BASE_URL}`,
      lastModified: newestDate([pageLastModified.home, ...homePosts.map((post) => post.updated)]),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    page("/application-form", "applicationForm", 0.9, "monthly"),
    page("/aboutus",          "aboutus",         0.6, "monthly"),
    page("/contact",          "contact",         0.6, "monthly"),
    page("/privacy-policy",   "privacyPolicy",   0.3, "yearly"),
    page("/terms-of-use",     "termsOfUse",      0.3, "yearly"),
  ];
}

// Same markup Next.js generates for a built-in app/sitemap.ts, which can't be
// used here because it would take over /sitemap.xml from the index.
export function toUrlsetXml(entries: MetadataRoute.Sitemap): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += "<url>\n";
    xml += `<loc>${entry.url}</loc>\n`;
    if (entry.lastModified) {
      const lastModified =
        entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
      xml += `<lastmod>${lastModified}</lastmod>\n`;
    }
    if (entry.changeFrequency) {
      xml += `<changefreq>${entry.changeFrequency}</changefreq>\n`;
    }
    if (typeof entry.priority === "number") {
      xml += `<priority>${entry.priority}</priority>\n`;
    }
    xml += "</url>\n";
  }

  xml += "</urlset>\n";
  return xml;
}

export function toSitemapIndexXml(): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const section of sitemapSections) {
    xml += "<sitemap>\n";
    xml += `<loc>${BASE_URL}/sitemap/${section}.xml</loc>\n`;
    xml += "</sitemap>\n";
  }

  xml += "</sitemapindex>\n";
  return xml;
}
