"use client";

import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";

interface HeroProps {
  stats: {
    activeOffers: number;
    activeCoupons: number;
    storesCount: number;
  };
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-8 sm:pb-10 border-b border-border/40 bg-gradient-to-b from-card/30 via-background to-background">
      {/* Luz radial sutil neutra no fundo */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-amber-500/[0.04] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
          {/* Badge superior clean */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-400/90" />
            <span>Garimpadas 3x ao dia com auditoria caça-erros</span>
          </div>

          {/* Título Clean e Moderno */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            As melhores ofertas e cupons,{" "}
            <span className="bg-gradient-to-r from-amber-400/90 to-amber-200/90 bg-clip-text text-transparent">
              sempre no preço real.
            </span>
          </h1>

          {/* Frase de valor */}
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
            Vitrine oficial do grupo de promoções. Monitoramos Mercado Livre, Amazon, Shopee e AliExpress para você nunca cair em desconto falso.
          </p>

          {/* CTA Telegram com visual refinado */}
          <div className="pt-2">
            <a
              href="https://t.me/garimpeirodoprecinho"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Entrar no grupo VIP de ofertas no Telegram"
            >
              <Button
                variant="telegram"
                size="lg"
                className="h-11 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-[#229ED9]/15 flex items-center gap-2 hover:opacity-95 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Entrar no Grupo Grátis do Telegram</span>
              </Button>
            </a>
          </div>

          {/* Contadores com estética minimalista */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 w-full max-w-md">
            <div className="rounded-xl border border-border/60 bg-card/40 p-2.5 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                <NumberTicker value={stats.activeOffers} />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                Ofertas Ativas
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/40 p-2.5 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                <NumberTicker value={stats.activeCoupons} />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                Cupons Válidos
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/40 p-2.5 sm:p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                <NumberTicker value={stats.storesCount} />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                Lojas Oficiais
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
