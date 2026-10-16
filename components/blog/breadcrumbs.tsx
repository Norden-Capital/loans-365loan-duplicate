import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail in the 365loan style (same markup as components/loans/breadcrumbs).
 * Its structured data is rendered by the page through JsonLd, not here.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 mb-6 text-[12.5px]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-muted-foreground/50" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-semibold" : "text-muted-foreground"}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
