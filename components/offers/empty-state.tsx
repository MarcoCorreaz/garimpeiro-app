"use client";

import { PackageSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "Nenhuma oferta encontrada",
  description = "Tente remover alguns filtros ou buscar por outro termo para encontrar o seu precinho.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
        <PackageSearch className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {onReset && (
        <Button
          variant="outline"
          onClick={onReset}
          className="mt-6 flex items-center gap-2 rounded-xl border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Limpar todos os filtros</span>
        </Button>
      )}
    </div>
  );
}
