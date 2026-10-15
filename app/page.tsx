import React from "react";
import { parseSearchParamsToFilters } from "@/lib/filters";
import {
  getActiveCoupons,
  getCategories,
  getOffers,
  getStats,
} from "@/lib/offers";
import { CategoryChips } from "@/components/home/category-chips";
import { CouponStrip } from "@/components/home/coupon-strip";
import { FilterBar } from "@/components/home/filter-bar";
import { Hero } from "@/components/home/hero";
import { StoreChips } from "@/components/home/store-chips";
import { TelegramBanner } from "@/components/home/telegram-banner";
import { OfferGrid } from "@/components/offers/offer-grid";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseSearchParamsToFilters(rawParams);

  const [offersData, stats, categories, activeCoupons] = await Promise.all([
    getOffers(filters),
    getStats(),
    getCategories(),
    getActiveCoupons(),
  ]);

  // Mapa de contagem por categoria para os chips
  const categoryCounts = categories.reduce(
    (acc, curr) => {
      acc[curr.slug] = curr.count;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-12">
      {/* 1. Hero Compacto com Métricas */}
      <Hero stats={stats} />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 space-y-6">
        {/* 2. Chips de Lojas */}
        <StoreChips />

        {/* 3. Chips de Categorias Oficiais */}
        <CategoryChips
          categoryCounts={categoryCounts}
          totalOffers={stats.activeOffers}
        />

        {/* 4. Barra de Filtros, Busca e Ordenação */}
        <FilterBar totalCount={offersData.total} />

        {/* 5. Grade de Ofertas */}
        <section aria-label="Vitrine de Ofertas">
          <OfferGrid initialOffers={offersData.items} />
        </section>

        {/* 6. Faixa de Cupons Ativos */}
        <CouponStrip coupons={activeCoupons} />

        {/* 7. Banner de Conversão Telegram com Marquee */}
        <TelegramBanner />
      </div>
    </div>
  );
}
