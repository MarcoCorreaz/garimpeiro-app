"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { STORES_CONFIG } from "@/config/stores";
import type { Offer } from "@/types/offer";
import { CouponChip } from "@/components/offers/coupon-chip";

interface CouponStripProps {
  coupons: Offer[];
}

export function CouponStrip({ coupons }: CouponStripProps) {
  if (coupons.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-foreground">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Cupons Ativos & Testados
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Copie o código com 1 clique e aplique no carrinho da loja parceira
            </p>
          </div>
        </div>

        <Link
          href="/cupons"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Ver todos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Faixa com rolagem horizontal */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-3 snap-x">
        {coupons.map((offer) => {
          const storeMeta = STORES_CONFIG[offer.store] || STORES_CONFIG.mercadolivre;
          if (!offer.couponCode) return null;

          return (
            <div
              key={offer.id}
              className="flex shrink-0 snap-start items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-2.5 sm:p-3 shadow-xs min-w-[260px] max-w-[300px]"
            >
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  {storeMeta.shortName}
                </span>
                <span className="text-xs font-semibold text-foreground truncate" title={offer.title}>
                  {offer.title}
                </span>
              </div>

              <CouponChip code={offer.couponCode} size="sm" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
