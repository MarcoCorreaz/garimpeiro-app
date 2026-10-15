"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Search, X } from "lucide-react";
import type { SortOption } from "@/types/filter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSheet } from "@/components/home/filter-sheet";

interface FilterBarProps {
  totalCount: number;
}

export function FilterBar({ totalCount }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentSort = (searchParams.get("ordem") as SortOption) || "recentes";

  const [searchValue, setSearchValue] = useState(currentQ);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set("q", searchValue.trim());
    } else {
      params.delete("q");
    }
    params.delete("pagina");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "recentes") {
      params.delete("ordem");
    } else {
      params.set("ordem", newSort);
    }
    params.delete("pagina");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/60 p-2.5 shadow-xs">
      {/* Formulário de Busca por Texto */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          type="search"
          placeholder="Filtrar por nome do produto ou marca..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs sm:text-sm rounded-xl border-border/60 bg-background/60 focus-visible:ring-foreground"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Ações: Contador, Ordenação no Desktop e Sheet de Filtros */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <span className="text-xs font-medium text-muted-foreground sm:mr-2">
          <strong className="text-foreground">{totalCount}</strong> ofertas
        </span>

        {/* Select Ordenação Desktop */}
        <div className="hidden md:block w-44">
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="h-9 text-xs rounded-xl border-border/60 bg-background/60">
              <div className="flex items-center gap-1.5 truncate">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="recentes">Mais Recentes</SelectItem>
              <SelectItem value="maior-desconto">Maior Desconto (%)</SelectItem>
              <SelectItem value="menor-preco">Menor Preço (Pix)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sheet de Filtros (Mobile + Opções avançadas) */}
        <FilterSheet />
      </div>
    </div>
  );
}
