"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { STORES_CONFIG } from "@/config/stores";
import type { Platform } from "@/types/offer";
import { cn } from "@/lib/utils";

const STORES_LIST: { id: Platform; label: string }[] = [
  { id: "mercadolivre", label: "Mercado Livre" },
  { id: "amazon", label: "Amazon" },
  { id: "shopee", label: "Shopee" },
  { id: "aliexpress", label: "AliExpress" },
];

export function StoreChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStore = searchParams.get("loja");

  const handleToggleStore = (storeId: Platform) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedStore === storeId) {
      params.delete("loja");
    } else {
      params.set("loja", storeId);
    }
    params.delete("pagina");
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <span className="text-xs font-medium text-muted-foreground mr-1 shrink-0">
        Lojas:
      </span>

      {STORES_LIST.map((store) => {
        const isSelected = selectedStore === store.id;
        const meta = STORES_CONFIG[store.id];

        return (
          <button
            key={store.id}
            type="button"
            onClick={() => handleToggleStore(store.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95",
              isSelected
                ? "border-foreground/80 bg-secondary text-foreground font-semibold shadow-xs"
                : "border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/40"
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: meta.accentColor }}
            />
            <span>{store.label}</span>
          </button>
        );
      })}
    </div>
  );
}
