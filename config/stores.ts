import type { Platform } from "@/types/offer";

export interface StoreMeta {
  id: Platform;
  name: string;
  shortName: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  brandIconBg: string;
}

export const STORES_CONFIG: Record<Platform, StoreMeta> = {
  mercadolivre: {
    id: "mercadolivre",
    name: "Mercado Livre",
    shortName: "Mercado Livre",
    badgeBg: "bg-yellow-400/15 border-yellow-400/30",
    badgeText: "text-yellow-400 dark:text-yellow-300",
    accentColor: "#FFE600",
    brandIconBg: "bg-yellow-400 text-black",
  },
  amazon: {
    id: "amazon",
    name: "Amazon Brasil",
    shortName: "Amazon",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-500 dark:text-amber-400",
    accentColor: "#FF9900",
    brandIconBg: "bg-amber-500 text-black",
  },
  shopee: {
    id: "shopee",
    name: "Shopee",
    shortName: "Shopee",
    badgeBg: "bg-orange-500/15 border-orange-500/30",
    badgeText: "text-orange-500 dark:text-orange-400",
    accentColor: "#EE4D2D",
    brandIconBg: "bg-orange-500 text-white",
  },
  aliexpress: {
    id: "aliexpress",
    name: "AliExpress",
    shortName: "AliExpress",
    badgeBg: "bg-red-500/15 border-red-500/30",
    badgeText: "text-red-500 dark:text-red-400",
    accentColor: "#E62E04",
    brandIconBg: "bg-red-600 text-white",
  },
};
