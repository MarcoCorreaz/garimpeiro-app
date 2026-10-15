import { z } from "zod";
import type { CategorySlug, Platform } from "./offer";

export const priceRangeSchema = z.enum(["ate-50", "50-250", "acima-250"]);
export type PriceRange = z.infer<typeof priceRangeSchema>;

export const sortOptionSchema = z.enum([
  "recentes",
  "maior-desconto",
  "menor-preco",
]);
export type SortOption = z.infer<typeof sortOptionSchema>;

export interface OfferFilters {
  q?: string;
  stores?: Platform[];
  category?: CategorySlug;
  priceRange?: PriceRange;
  hasCoupon?: boolean;
  sort?: SortOption;
  page?: number;
}

export const PRICE_RANGES_CONFIG: {
  id: PriceRange;
  label: string;
  sublabel: string;
  min: number;
  max: number | null;
}[] = [
  {
    id: "ate-50",
    label: "Até R$ 50",
    sublabel: "Achados de Impulso",
    min: 0,
    max: 50,
  },
  {
    id: "50-250",
    label: "R$ 50 a R$ 250",
    sublabel: "Intermediários",
    min: 50,
    max: 250,
  },
  {
    id: "acima-250",
    label: "Acima de R$ 250",
    sublabel: "Itens de Desejo",
    min: 250,
    max: null,
  },
];
