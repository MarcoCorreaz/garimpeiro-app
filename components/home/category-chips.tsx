"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICIAL_CATEGORIES, type CategorySlug } from "@/types/offer";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  categoryCounts: Record<CategorySlug, number>;
  totalOffers: number;
}

export function CategoryChips({
  categoryCounts,
  totalOffers,
}: CategoryChipsProps) {
  const pathname = usePathname();

  const isAll = pathname === "/" || pathname === "";

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 snap-x snap-mandatory">
        {/* Chip "Todas" */}
        <Link
          href="/"
          className={cn(
            "inline-flex shrink-0 snap-start items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95",
            isAll
              ? "border-foreground/80 bg-foreground text-background font-bold shadow-sm"
              : "border-border/80 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/40"
          )}
        >
          <span>Todas as Ofertas</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.2 text-[10px]",
              isAll
                ? "bg-background/20 text-background font-bold"
                : "bg-muted text-muted-foreground"
            )}
          >
            {totalOffers}
          </span>
        </Link>

        {/* Chips das 4 Categorias Oficiais */}
        {OFFICIAL_CATEGORIES.map((cat) => {
          const isActive = pathname === `/categorias/${cat.slug}`;
          const count = categoryCounts[cat.slug] || 0;

          return (
            <Link
              key={cat.slug}
              href={`/categorias/${cat.slug}`}
              className={cn(
                "inline-flex shrink-0 snap-start items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95",
                isActive
                  ? "border-foreground/80 bg-foreground text-background font-bold shadow-sm"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/40"
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive
                    ? "bg-background/20 text-background font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
