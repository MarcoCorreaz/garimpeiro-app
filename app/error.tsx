"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Garimpeiro ErrorBoundary]:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-md">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground">
          Ops! Ocorreu um erro inesperado
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Não conseguimos carregar as ofertas neste momento. Isso pode ser uma instabilidade temporária na conexão.
        </p>
      </div>

      <Button
        variant="default"
        onClick={() => reset()}
        className="rounded-xl font-bold flex items-center gap-2 mx-auto"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Tentar novamente</span>
      </Button>
    </div>
  );
}
