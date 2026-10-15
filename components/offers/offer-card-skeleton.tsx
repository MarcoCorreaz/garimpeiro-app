import { Skeleton } from "@/components/ui/skeleton";

export function OfferCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <div>
        {/* Topo: Loja + Tempo */}
        <div className="flex items-center justify-between pb-2.5">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-4 w-14 rounded-md" />
        </div>

        {/* Imagem 1:1 */}
        <Skeleton className="aspect-square w-full rounded-xl" />

        {/* Título e observação */}
        <div className="pt-3 space-y-1.5">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md mt-1" />
        </div>
      </div>

      {/* Bloco de preços */}
      <div className="pt-3 border-t border-border/40 mt-3 space-y-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-3 w-36 rounded-md" />
        <Skeleton className="h-9 w-full rounded-xl mt-3" />
      </div>
    </div>
  );
}
