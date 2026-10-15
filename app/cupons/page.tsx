import React from "react";
import type { Metadata } from "next";
import { Tag } from "lucide-react";
import { parseSearchParamsToFilters } from "@/lib/filters";
import { getOffers } from "@/lib/offers";
import { FilterBar } from "@/components/home/filter-bar";
import { StoreChips } from "@/components/home/store-chips";
import { TelegramBanner } from "@/components/home/telegram-banner";
import { OfferGrid } from "@/components/offers/offer-grid";

export const metadata: Metadata = {
  title: "Cupons de Desconto Ativos",
  description:
    "Lista de ofertas e produtos com cupons de desconto válidos no Mercado Livre, Amazon, Shopee e AliExpress.",
};

interface CouponsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CouponsPage({ searchParams }: CouponsPageProps) {
  const rawParams = await searchParams;
  const filters = parseSearchParamsToFilters(rawParams);
  // Trava para apenas itens com cupom
  filters.hasCoupon = true;

  const offersData = await getOffers(filters);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-6 pb-12">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 space-y-6">
        {/* Cabeçalho da Seção de Cupons */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground mb-2">
            <Tag className="h-3.5 w-3.5" />
            <span>Descontos Adicionais com Código</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Cupons de Desconto Ativos
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Aqui estão reunidas todas as promoções que exigem um código promocional. Clique no cupom para copiar automaticamente e cole na finalização da compra na loja.
          </p>
        </div>

        {/* Chips de Lojas */}
        <StoreChips />

        {/* Barra de Filtros */}
        <FilterBar totalCount={offersData.total} />

        {/* Grade de Ofertas com Cupom */}
        <section aria-label="Ofertas com Cupom">
          <OfferGrid initialOffers={offersData.items} />
        </section>

        {/* Banner Telegram */}
        <TelegramBanner />
      </div>
    </div>
  );
}
