import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseSearchParamsToFilters } from "@/lib/filters";
import { getCategories, getOffers, getStats } from "@/lib/offers";
import {
  categorySlugSchema,
  OFFICIAL_CATEGORIES,
} from "@/types/offer";
import { CategoryChips } from "@/components/home/category-chips";
import { FilterBar } from "@/components/home/filter-bar";
import { StoreChips } from "@/components/home/store-chips";
import { TelegramBanner } from "@/components/home/telegram-banner";
import { OfferGrid } from "@/components/offers/offer-grid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  return OFFICIAL_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = OFFICIAL_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.label} em Promoção`,
    description: `Ofertas garimpadas e auditadas em ${category.label}. ${category.examples}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;

  // Validação estrita da categoria
  const slugCheck = categorySlugSchema.safeParse(slug);
  if (!slugCheck.success) {
    notFound();
  }

  const categorySlug = slugCheck.data;
  const categoryMeta = OFFICIAL_CATEGORIES.find((c) => c.slug === categorySlug)!;

  const rawParams = await searchParams;
  const filters = parseSearchParamsToFilters(rawParams);
  // Trava a categoria no filtro
  filters.category = categorySlug;

  const [offersData, stats, categories] = await Promise.all([
    getOffers(filters),
    getStats(),
    getCategories(),
  ]);

  const categoryCounts = categories.reduce(
    (acc, curr) => {
      acc[curr.slug] = curr.count;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-6 pb-12">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 space-y-6">
        {/* Cabeçalho da Categoria */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categoria Oficial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            {categoryMeta.label}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            {categoryMeta.examples}
          </p>
        </div>

        {/* Chips de Lojas */}
        <StoreChips />

        {/* Chips das Categorias */}
        <CategoryChips
          categoryCounts={categoryCounts}
          totalOffers={stats.activeOffers}
        />

        {/* Barra de Filtros */}
        <FilterBar totalCount={offersData.total} />

        {/* Grade de Ofertas */}
        <section aria-label={`Ofertas de ${categoryMeta.label}`}>
          <OfferGrid initialOffers={offersData.items} />
        </section>

        {/* Banner Telegram */}
        <TelegramBanner />
      </div>
    </div>
  );
}
