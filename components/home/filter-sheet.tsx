"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, SlidersHorizontal, Tag } from "lucide-react";
import { PRICE_RANGES_CONFIG, type PriceRange, type SortOption } from "@/types/filter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export function FilterSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentPriceRange = searchParams.get("preco") as PriceRange | null;
  const currentHasCoupon = searchParams.get("cupom") === "1";
  const currentSort = (searchParams.get("ordem") as SortOption) || "recentes";

  const handleSetPrice = (range: PriceRange) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPriceRange === range) {
      params.delete("preco");
    } else {
      params.set("preco", range);
    }
    params.delete("pagina");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleToggleCoupon = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("cupom", "1");
    } else {
      params.delete("cupom");
    }
    params.delete("pagina");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSetSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "recentes") {
      params.delete("ordem");
    } else {
      params.set("ordem", sort);
    }
    params.delete("pagina");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const activeFiltersCount =
    (currentPriceRange ? 1 : 0) +
    (currentHasCoupon ? 1 : 0) +
    (currentSort !== "recentes" ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative flex items-center gap-2 rounded-xl text-xs font-semibold h-9 border-border bg-card/60 hover:bg-secondary/60"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between p-6">
        <div className="space-y-6">
          <SheetHeader className="text-left">
            <SheetTitle className="text-lg font-bold flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span>Filtrar Ofertas</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Ajuste as opções para refinar as promoções em exibição.
            </SheetDescription>
          </SheetHeader>

          {/* Faixa de Preço */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Faixa de Preço
            </label>
            <div className="grid grid-cols-1 gap-2">
              {PRICE_RANGES_CONFIG.map((range) => {
                const isSelected = currentPriceRange === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => handleSetPrice(range.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-foreground/80 bg-secondary text-foreground shadow-xs"
                        : "border-border/70 bg-card/40 text-muted-foreground hover:bg-secondary/30"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {range.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {range.sublabel}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Switch Só com cupom */}
          <div className="rounded-xl border border-border/70 bg-card/40 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Apenas com cupom
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Exibir só ofertas com cupom para copiar
                </div>
              </div>
            </div>
            <Switch
              checked={currentHasCoupon}
              onCheckedChange={handleToggleCoupon}
            />
          </div>

          {/* Ordenação */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ordenar Por
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "recentes", label: "Mais Recentes" },
                { id: "maior-desconto", label: "Maior Desconto" },
                { id: "menor-preco", label: "Menor Preço" },
              ].map((opt) => {
                const isSelected = currentSort === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSetSort(opt.id as SortOption)}
                    className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                      isSelected
                        ? "border-foreground/80 bg-foreground text-background font-bold shadow-xs"
                        : "border-border/70 bg-card/40 text-muted-foreground hover:bg-secondary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé do Sheet */}
        <div className="pt-6 border-t border-border flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex-1 rounded-xl text-xs font-medium gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Limpar filtros</span>
          </Button>

          <Button
            variant="default"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl text-xs font-bold bg-foreground text-background"
          >
            <span>Ver resultados</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
