import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferCardSkeleton } from "@/components/offers/offer-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-10 text-center space-y-4">
        <Skeleton className="h-6 w-48 mx-auto rounded-full" />
        <Skeleton className="h-10 w-3/4 mx-auto rounded-xl" />
        <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
        <Skeleton className="h-11 w-52 mx-auto rounded-xl mt-4" />
      </div>

      {/* Chips Skeleton */}
      <div className="flex gap-2 overflow-hidden py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-xl" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-card p-3">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <OfferCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
