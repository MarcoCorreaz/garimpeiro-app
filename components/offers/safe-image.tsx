"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

// Lista de hosts atualmente liberados no next.config.ts
const ALLOWED_NEXT_IMAGE_HOSTS = ["http2.mlstatic.com"];

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  fill = true,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o hostname está na lista de permitidos do next/image
  let isNextImageAllowed = false;
  try {
    const url = new URL(src);
    isNextImageAllowed = ALLOWED_NEXT_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    isNextImageAllowed = false;
  }

  // Fallback quando a imagem estiver com erro ou link vazio
  if (hasError || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/40 p-4 text-muted-foreground/50">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Tag className="h-8 w-8 stroke-[1.5]" />
          <span className="text-[11px] font-medium">Foto ilustrativa</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-white/5">
      {/* Skeleton enquanto a imagem carrega */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted/60" />
      )}

      {isNextImageAllowed ? (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-contain p-2 transition-transform duration-300 group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            // Em caso de falha no next/image, tenta com <img> nativo
            setHasError(true);
          }}
        />
      ) : (
        /* Fallback nativo <img> para hosts não homologados no next.config */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
