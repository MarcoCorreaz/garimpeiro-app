"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Pickaxe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "@/components/layout/search-command";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/cupons", label: "Cupons", badge: "Ativos" },
    { href: "/sobre", label: "Sobre o Grupo" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6">
        {/* Logo e Nome */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary border border-border/80 text-foreground transition-transform group-hover:scale-105">
              <Pickaxe className="h-4.5 w-4.5 text-amber-400 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-foreground leading-none flex items-center gap-1">
                Garimpeiro <span className="text-muted-foreground font-semibold">do Precinho</span>
              </span>
              <span className="hidden sm:inline text-[10px] text-muted-foreground font-medium">
                Achados & Promoções Auditadas
              </span>
            </div>
          </Link>

          {/* Links de navegação desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-foreground bg-secondary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Barra de busca e ações da direita */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-40 sm:w-60 md:w-64">
            <SearchCommand />
          </div>

          <ThemeToggle />

          {/* Botão Telegram sempre visível (inclusive no mobile) */}
          <a
            href="https://t.me/garimpeirodoprecinho"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Entrar no canal do Telegram"
          >
            <Button
              variant="telegram"
              size="sm"
              className="h-9 px-2.5 sm:px-3.5 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md shadow-[#229ED9]/20"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Entrar no Canal</span>
              <span className="inline sm:hidden">Canal</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
