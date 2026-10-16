import type { Metadata } from "next";

import type { ArticleSection, FaqItem, PostMeta } from "@/lib/content";

// ── Site details: the only part of this file that differs between sites ──

export const SITE_NAME = "365loan";
export const BASE_URL = "https://365loan.ca";

/** Publisher logo in article structured data, or null if the site has none. */
export const LOGO_URL: string | null = `${BASE_URL}/logo.svg`;

/** Social image for pages without their own opengraph-image, or null. */
export const DEFAULT_OG_IMAGE: { url: string; alt: string } | null = {
  url: "/opengraph-image.png",
  alt: "365loan — Compare personal loans in Canada and find your best rate.",
};

/**
 * Site-specific: metadata for the non-blog pages (about, contact, application form,
 * loans/*, resources/*). Those pages pass their FULL title, e.g. "About 365loan | …",
 * and the root layout's title template is "%s", so the title is used as-is. Every
 * page gets the site-wide share image.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: { images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "365loan — Compare personal loans in Canada and find your best rate." }],
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
    },
    twitter: { images: ["/opengraph-image.png"],
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── Shared helpers: identical on every site ──

/**
 * Page metadata with an absolute canonical URL. Pass a short `title`: the brand
 * is appended here ("Title | Brand") as an absolute title, so the result is the
 * same whether or not the site's root layout has a title template.
 *
 * Pass `defaultImage: false` on pages that have their own opengraph-image file
 * (blog and news posts): an image set here would replace the generated one.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  defaultImage = true,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  defaultImage?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const image = defaultImage ? DEFAULT_OG_IMAGE : null;

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...(image ? { images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }] } : {}),
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      ...(image ? { images: [image.url] } : {}),
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${BASE_URL}${path}`,
    })),
  };
}

export function itemListJsonLd(section: ArticleSection, posts: PostMeta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `${BASE_URL}${section.path}/${post.slug}`,
    })),
  };
}

export function articleJsonLd(meta: PostMeta, section: ArticleSection) {
  const url = `${BASE_URL}${section.path}/${meta.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": section.schemaType,
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated,
    ...(meta.image ? { image: meta.image } : {}),
    author: { "@type": "Organization", name: meta.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      ...(LOGO_URL ? { logo: { "@type": "ImageObject", url: LOGO_URL } } : {}),
    },
    mainEntityOfPage: url,
    url,
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
