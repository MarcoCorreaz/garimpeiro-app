"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Plus } from "lucide-react";
import type { Offer } from "@/types/offer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/offers/empty-state";
import { OfferCard } from "@/components/offers/offer-card";

interface OfferGridProps {
  initialOffers: Offer[];
  onResetFilters?: () => void;
}

export function OfferGrid({
  initialOffers,
  onResetFilters,
}: OfferGridProps) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const displayedOffers = initialOffers.slice(0, visibleCount);
  const hasMore = visibleCount < initialOffers.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 300);
  };

  if (initialOffers.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="space-y-8">
      {/* Grade de Ofertas */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {displayedOffers.map((offer, index) => {
            // Anima apenas os primeiros 12 com stagger suave; o restante renderiza sem delay
            const shouldStagger = index < 12;
            return (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.25,
                  delay: shouldStagger ? index * 0.03 : 0,
                  ease: "easeOut",
                }}
              >
                <OfferCard offer={offer} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Botão Carregar Mais */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 rounded-xl border-border px-8 font-semibold hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Carregando ofertas...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Carregar mais ofertas</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
