"use client";

import React from "react";
import { ArrowUpRight, Clock, TrendingDown } from "lucide-react";
import { STORES_CONFIG } from "@/config/stores";
import { formatRelativeTime } from "@/lib/date-utils";
import type { Offer } from "@/types/offer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CouponChip } from "@/components/offers/coupon-chip";
import { SafeImage } from "@/components/offers/safe-image";

interface OfferCardProps {
  offer: Offer;
  onOpenDetail?: (offer: Offer) => void;
}

export function OfferCard({ offer, onOpenDetail }: OfferCardProps) {
  const storeMeta = STORES_CONFIG[offer.store] || STORES_CONFIG.mercadolivre;

  const handleCardClick = (e: React.MouseEvent) => {
    // Se o clique foi em um elemento interativo interno (link ou botão), não abre o drawer
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    if (onOpenDetail) {
      onOpenDetail(offer);
    } else {
      // Abre via query param na URL para permitir compartilhamento
      const url = new URL(window.location.href);
      url.searchParams.set("oferta", offer.id);
      window.history.pushState({}, "", url.toString());
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const formattedPixPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(offer.pricePix);

  const formattedOriginalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(offer.priceOriginal);

  const formattedPreviousPrice = offer.pricePrevious
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(offer.pricePrevious)
    : null;

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-zinc-600/80 hover:bg-card hover:shadow-lg hover:shadow-black/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`Oferta: ${offer.title}`}
    >
      <div>
        {/* Topo do card: Loja + Tempo relativo */}
        <div className="flex items-center justify-between gap-2 pb-2.5">
          <Badge
            variant="outline"
            className={`border px-2 py-0.5 text-[11px] font-medium ${storeMeta.badgeBg} ${storeMeta.badgeText}`}
          >
            {storeMeta.shortName}
          </Badge>

          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(offer.publishedAt)}</span>
          </span>
        </div>

        {/* Imagem do Produto com Badges de Desconto / Queda */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/[0.03] border border-border/40">
          <SafeImage src={offer.imageUrl} alt={offer.title} />

          {/* Badges flutuantes discretos sobre a imagem */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
            {offer.hasDiscount && (
              <Badge variant="discount" className="shadow-xs text-[11px]">
                -{offer.discountPercent}%
              </Badge>
            )}

            {offer.isPriceDrop && (
              <Badge variant="priceDrop" className="flex items-center gap-1 shadow-xs text-[11px]">
                <TrendingDown className="h-3 w-3" />
                Preço caiu
              </Badge>
            )}
          </div>
        </div>

        {/* Título do produto */}
        <div className="pt-3">
          <h2
            title={offer.title}
            className="line-clamp-2 text-sm font-semibold leading-snug text-foreground/95 transition-colors group-hover:text-foreground"
          >
            {offer.title}
          </h2>

          {/* Observação curta / prova social */}
          {offer.notes && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {offer.notes}
            </p>
          )}
        </div>
      </div>

      {/* Bloco de Preços e Ações */}
      <div className="pt-3 border-t border-border/40 mt-3">
        {/* Preço original riscado ou preço anterior */}
        <div className="flex items-center gap-2 h-4">
          {offer.isPriceDrop && formattedPreviousPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              era {formattedPreviousPrice}
            </span>
          ) : offer.hasDiscount ? (
            <span className="text-xs text-muted-foreground line-through">
              de {formattedOriginalPrice}
            </span>
          ) : null}
        </div>

        {/* Preço Pix em destaque limpo e nítido */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {formattedPixPrice}
          </span>
          <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
            no Pix
          </span>
        </div>

        {/* Parcelamento */}
        {offer.priceInstallment && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            ou {offer.priceInstallment}
          </p>
        )}

        {/* Cupom (se houver) */}
        {offer.couponCode && (
          <div className="mt-2.5">
            <CouponChip code={offer.couponCode} size="sm" />
          </div>
        )}

        {/* Botão de conversão monetizado clean */}
        <div className="mt-3">
          <a
            href={offer.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            onClick={(e) => e.stopPropagation()}
            className="w-full inline-block"
          >
            <Button
              variant="default"
              className="w-full justify-between bg-foreground text-background hover:bg-foreground/90 font-bold text-xs h-9 rounded-xl shadow-xs group/btn"
            >
              <span>Pegar Oferta</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
