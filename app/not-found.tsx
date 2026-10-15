import React from "react";
import Link from "next/link";
import { ArrowLeft, Pickaxe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-md">
        <Pickaxe className="h-8 w-8 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Erro 404
        </span>
        <h1 className="text-3xl font-extrabold text-foreground">
          Página não encontrada
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O link que você acessou pode ter expirado ou a categoria não existe mais. Que tal garimpar as ofertas ativas?
        </p>
      </div>

      <div>
        <Link href="/">
          <Button variant="default" className="rounded-xl font-bold flex items-center gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Catálogo de Ofertas</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
