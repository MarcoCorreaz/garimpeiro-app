import React from "react";
import type { Metadata } from "next";
import {
  CheckCircle2,
  MessageCircle,
  Pickaxe,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre o Garimpeiro do Precinho | Como Funciona e Aviso Legal",
  description:
    "Conheça o Garimpeiro do Precinho: como funciona o pipeline de curadoria, auditoria de preços e nossa política de transparência de afiliados.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Topo / Apresentação */}
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground border border-border/80 shadow-xs">
          <Pickaxe className="h-6 w-6" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Sobre o Garimpeiro do Precinho
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Nascemos com um objetivo simples: acabar com as promoções falsas da internet e entregar achados reais onde você realmente economiza o seu dinheiro.
        </p>
      </div>

      {/* Como Funciona em 3 Passos */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center sm:text-left">
          Como funciona a nossa curadoria?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-foreground text-base">
              Garimpo Contínuo (3x ao dia)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Nossa tecnologia monitora Mercado Livre, Amazon, Shopee e AliExpress nos turnos das 08:30, 13:30 e 19:30 (horário de Cuiabá) capturando quedas de preço e cupons de abertura.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-foreground text-base">
              Auditoria Caça-Erros
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Verificamos se o desconto é genuíno em relação ao histórico dos últimos 7 dias. Não postamos itens com frete abusivo, falsos descontos ou vendedores sem reputação positiva.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-foreground text-base">
              Publicação Imediata
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              As ofertas aprovadas são postadas instantaneamente no canal do Telegram e disponibilizadas em tempo real nesta vitrine web com o link direto da loja.
            </p>
          </div>
        </div>
      </div>

      {/* Regras e Compromisso de Qualidade */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Nosso Compromisso de Qualidade
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Preço no Pix transparente:</strong> O valor em destaque no card é sempre o preço final à vista já considerando o Pix e cupons aplicados.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Fotos oficiais em alta resolução:</strong> Proibimos miniaturas e exigimos imagens oficiais do catálogo das lojas para você ver exatamente o que está comprando.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Alerta de queda de preço:</strong> Quando uma oferta monitorada sofre nova redução relevante de preço (≥10%), reativamos o alerta como &quot;Preço caiu&quot;.
            </span>
          </li>
        </ul>
      </div>

      {/* Aviso Legal de Afiliados Obrigatório */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-base sm:text-lg">
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          <span>Aviso Legal e Transparência de Afiliados</span>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
          &quot;Os preços e estoques podem sofrer alterações a qualquer momento pelas lojas parceiras. Comprando pelos links do Garimpeiro do Precinho podemos receber uma comissão sem custo adicional para você.&quot;
        </p>

        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          O Garimpeiro do Precinho não é uma loja virtual e não comercializa produtos diretamente. Somos um canal independente de curadoria e divulgação de oportunidades. Toda a transação, pagamento, entrega e garantia são de responsabilidade exclusiva da loja parceira (Mercado Livre, Amazon, Shopee ou AliExpress).
        </p>
      </div>

      {/* CTA Telegram */}
      <div className="text-center pt-4">
        <h3 className="text-lg font-bold text-foreground mb-3">
          Quer receber tudo antes de esgotar?
        </h3>
        <a
          href="https://t.me/garimpeirodoprecinho"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="telegram"
            size="lg"
            className="rounded-xl font-bold text-sm sm:text-base px-8 shadow-md shadow-[#229ED9]/15"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>Entrar no Canal do Telegram</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
