"use client";

import React, { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CouponChipProps {
  code: string;
  className?: string;
  size?: "sm" | "md";
}

export function CouponChip({ code, className, size = "sm" }: CouponChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`Cupom "${code}" copiado!`, {
        description: "Cole no carrinho ou na finalização do pedido.",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o cupom automaticamente.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copiar cupom de desconto ${code}`}
      className={cn(
        "group/coupon inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border/80 bg-secondary/70 font-mono font-medium text-foreground transition-all hover:bg-secondary hover:border-border active:scale-95",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className
      )}
    >
      <Tag className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", "opacity-75")} />
      <span className="tracking-wider">{code}</span>
      <span className="ml-1 flex items-center text-muted-foreground transition-transform">
        {copied ? (
          <Check className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", "text-emerald-500")} />
        ) : (
          <Copy className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", "opacity-70 group-hover/coupon:opacity-100 group-hover/coupon:text-foreground")} />
        )}
      </span>
    </button>
  );
}
