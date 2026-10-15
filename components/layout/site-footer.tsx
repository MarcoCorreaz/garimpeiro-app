"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Pickaxe, ShieldCheck } from "lucide-react";
import { OFFICIAL_CATEGORIES } from "@/types/offer";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-card/60 pt-12 pb-8 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border/60">
          {/* Coluna 1: Sobre o Garimpeiro */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border/80 text-foreground">
                <Pickaxe className="h-4 w-4 text-amber-400 stroke-[2.2]" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground">
                Garimpeiro <span className="text-muted-foreground font-semibold">do Precinho</span>
              </span>
            </Link>

            <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Curadoria e auditoria diária de promoções com descontos reais no Mercado Livre, Amazon, Shopee e AliExpress. Nosso robô caça-erros monitora preços para você nunca cair em promoção falsa.
            </p>

            <div className="pt-1">
              <a
                href="https://t.me/garimpeirodoprecinho"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="telegram"
                  size="sm"
                  className="rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#229ED9]/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Participar do Canal no Telegram</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Coluna 2: Categorias */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {OFFICIAL_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorias/${cat.slug}`}
                    className="text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Links Úteis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/cupons"
                  className="text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  Cupons de Desconto
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  Como Funciona o Grupo
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/garimpeirodoprecinho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-amber-400 transition-colors"
                >
                  Canal Oficial no Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Aviso Legal de Afiliados Obrigatório */}
        <div className="pt-6 pb-2 space-y-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Aviso de transparência:</strong> Os preços e estoques podem sofrer alterações a qualquer momento pelas lojas parceiras. Comprando pelos links do Garimpeiro do Precinho podemos receber uma comissão sem custo adicional para você.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground pt-3">
            <p>© 2026 Garimpeiro do Precinho. Todos os direitos reservados.</p>
            <p className="mt-1 sm:mt-0">Fuso horário operacional: America/Cuiaba (GMT-4)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
