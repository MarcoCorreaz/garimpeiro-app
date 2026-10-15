"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Tag, Tv } from "lucide-react";
import { OFFICIAL_CATEGORIES } from "@/types/offer";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectCategory = (slug: string) => {
    setOpen(false);
    router.push(`/categorias/${slug}`);
  };

  const handleSelectStore = (store: string) => {
    setOpen(false);
    router.push(`/?loja=${store}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="flex h-9 w-full max-w-xs items-center justify-between rounded-xl border border-input bg-card px-3 text-xs text-muted-foreground shadow-sm transition-colors hover:border-amber-500/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 opacity-60 text-amber-500" />
          <span className="hidden sm:inline">Buscar produto, marca ou loja...</span>
          <span className="inline sm:hidden">Buscar ofertas...</span>
        </span>
        <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium opacity-80 sm:flex">
          /
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite o que procura (ex: fone, air fryer, jbl, tv)..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Categorias Oficiais">
            {OFFICIAL_CATEGORIES.map((cat) => (
              <CommandItem
                key={cat.slug}
                onSelect={() => handleSelectCategory(cat.slug)}
                className="flex items-center gap-2"
              >
                <Tv className="h-4 w-4 text-amber-500" />
                <span>{cat.label}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {cat.examples.split(",")[0]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Lojas Parceiras">
            <CommandItem
              onSelect={() => handleSelectStore("mercadolivre")}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 text-yellow-400" />
              <span>Mercado Livre</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectStore("amazon")}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 text-amber-500" />
              <span>Amazon Brasil</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectStore("shopee")}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 text-orange-500" />
              <span>Shopee</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectStore("aliexpress")}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4 text-red-500" />
              <span>AliExpress</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Seções Especiais">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/cupons");
              }}
              className="flex items-center gap-2"
            >
              <Tag className="h-4 w-4 text-amber-400" />
              <span>Ofertas com Cupom Ativo</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
