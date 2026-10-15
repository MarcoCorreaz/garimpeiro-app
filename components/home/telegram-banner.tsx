import React from "react";
import { Bell, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { Button } from "@/components/ui/button";

const STORE_LOGOS = [
  { name: "Mercado Livre", color: "#FFE600" },
  { name: "Amazon Brasil", color: "#FF9900" },
  { name: "Shopee", color: "#EE4D2D" },
  { name: "AliExpress Choice", color: "#E62E04" },
];

export function TelegramBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8 shadow-xs">
      {/* Marquee Decorativo no Topo do Banner */}
      <div className="pb-5 border-b border-border/40">
        <Marquee repeat={5} pauseOnHover className="py-0 opacity-60">
          {STORE_LOGOS.map((store) => (
            <div
              key={store.name}
              className="flex items-center gap-2 px-4 py-1 text-xs font-medium text-muted-foreground"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: store.color }}
              />
              <span>{store.name}</span>
            </div>
          ))}
        </Marquee>
      </div>

      <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Bell className="h-3.5 w-3.5 text-[#229ED9]" />
            <span>Notificações Instantâneas no Celular</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Não perca nenhum erro de preço ou cupom relâmpago.
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            As melhores promoções duram poucos minutos e os cupons esgotam rápido. Quem está no grupo do Telegram recebe primeiro, de graça e sem spam.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-muted-foreground/80 pt-1">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> 3 auditorias diárias
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Links 100% seguros
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <a
            href="https://t.me/garimpeirodoprecinho"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="telegram"
              size="lg"
              className="h-11 px-6 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#229ED9]/15 flex items-center gap-2 hover:opacity-95 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Entrar no Grupo Grátis</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
