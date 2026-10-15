"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Clock, ShieldCheck, Tag, TrendingDown } from "lucide-react";
import { STORES_CONFIG } from "@/config/stores";
import { formatRelativeTime } from "@/lib/date-utils";
import type { Offer } from "@/types/offer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CouponChip } from "@/components/offers/coupon-chip";
import { SafeImage } from "@/components/offers/safe-image";

interface OfferDetailDrawerProps {
  initialOffers: Offer[];
}

export function OfferDetailDrawer({ initialOffers }: OfferDetailDrawerProps) {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Lê ?oferta=<id> da URL e escuta navegação/popstate
  useEffect(() => {
    const checkOfferParam = () => {
      const url = new URL(window.location.href);
      const id = url.searchParams.get("oferta");
      if (id) {
        setActiveOfferId(id);
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setActiveOfferId(null);
      }
    };

    checkOfferParam();
    window.addEventListener("popstate", checkOfferParam);
    return () => window.removeEventListener("popstate", checkOfferParam);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("oferta");
    window.history.pushState({}, "", url.toString());
  };

  const offer = initialOffers.find((o) => o.id === activeOfferId);
  const storeMeta = offer ? STORES_CONFIG[offer.store] || STORES_CONFIG.mercadolivre : null;

  const formattedPixPrice = offer
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        offer.pricePix
      )
    : "";

  const formattedOriginalPrice = offer
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        offer.priceOriginal
      )
    : "";

  const formattedPreviousPrice = offer?.pricePrevious
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        offer.pricePrevious
      )
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-border bg-card">
        <DialogTitle className="sr-only">
          {offer ? offer.title : "Detalhes da Oferta"}
        </DialogTitle>

        {offer && storeMeta ? (
          <div className="flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Topo com imagem grande */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-white/5 border-b border-border flex items-center justify-center p-6">
              <SafeImage src={offer.imageUrl} alt={offer.title} />

              <div className="absolute left-4 top-4 flex flex-col gap-1.5 z-10">
                <Badge
                  variant="outline"
                  className={`border px-2.5 py-1 text-xs font-semibold shadow-sm ${storeMeta.badgeBg} ${storeMeta.badgeText}`}
                >
                  {storeMeta.name}
                </Badge>

                {offer.hasDiscount && (
                  <Badge variant="discount" className="shadow-sm">
                    -{offer.discountPercent}% OFF
                  </Badge>
                )}

                {offer.isPriceDrop && (
                  <Badge variant="priceDrop" className="flex items-center gap-1 shadow-sm">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Preço caiu!
                  </Badge>
                )}
              </div>
            </div>

            {/* Conteúdo detalhado */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Postado {formatRelativeTime(offer.publishedAt)}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {offer.title}
                </h2>
              </div>

              {/* Bloco de observações da curadoria */}
              {offer.notes && (
                <div className="rounded-xl border border-border/80 bg-secondary/50 p-3.5 text-xs sm:text-sm text-foreground/90">
                  <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Auditoria do Garimpeiro
                  </p>
                  <p>{offer.notes}</p>
                </div>
              )}

              {/* Bloco de Preços */}
              <div className="rounded-2xl bg-secondary/40 p-4 border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Valor à vista</span>
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

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
                    {formattedPixPrice}
                  </span>
                  <span className="text-sm font-semibold text-emerald-500 dark:text-emerald-400">
                    no Pix
                  </span>
                </div>

                {offer.priceInstallment && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Condição a prazo:{" "}
                    <strong className="text-foreground">{offer.priceInstallment}</strong>
                  </p>
                )}

                {/* Cupom se houver */}
                {offer.couponCode && (
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Cupom de desconto:
                    </span>
                    <CouponChip code={offer.couponCode} size="md" />
                  </div>
                )}
              </div>

              {/* Botão de conversão */}
              <div className="pt-2">
                <a
                  href={offer.affiliateUrl}
                  target="_blank"
                  rel="noopener sponsored"
                  className="w-full inline-block"
                >
                  <Button
                    size="lg"
                    className="w-full text-sm sm:text-base font-bold bg-foreground text-background hover:bg-foreground/90 shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Ir para a Loja ({storeMeta.shortName})</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </a>
                <p className="text-[11px] text-muted-foreground text-center mt-2">
                  Você será redirecionado para o site oficial da loja parceira.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Estado de oferta inexistente ou expirada */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <Tag className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Oferta não está mais disponível
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta promoção expirou, esgotou no estoque ou o cupom foi desativado pela loja parceira.
              </p>
            </div>
            <Button variant="default" onClick={handleClose} className="rounded-xl">
              Ver outras ofertas ativas
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
