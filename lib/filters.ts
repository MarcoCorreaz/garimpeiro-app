import type { OfferFilters, PriceRange, SortOption } from "@/types/filter";
import { categorySlugSchema, platformSchema, type Platform } from "@/types/offer";

/**
 * Converte searchParams da URL (em português e legíveis) para o objeto OfferFilters.
 * Parâmetros desconhecidos ou inválidos são ignorados defensivamente.
 */
export function parseSearchParamsToFilters(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams
): OfferFilters {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const filters: OfferFilters = {};

  // Busca textual
  const q = getParam("q");
  if (q && q.trim()) {
    filters.q = q.trim();
  }

  // Lojas (aceita separado por vírgula ou múltiplo)
  const lojasRaw = getParam("loja");
  if (lojasRaw) {
    const rawStores = lojasRaw.split(",").map((s) => s.trim().toLowerCase());
    const validStores: Platform[] = [];
    for (const s of rawStores) {
      const parsed = platformSchema.safeParse(s);
      if (parsed.success) validStores.push(parsed.data);
    }
    if (validStores.length > 0) {
      filters.stores = validStores;
    }
  }

  // Categoria
  const catRaw = getParam("categoria");
  if (catRaw) {
    const parsedCat = categorySlugSchema.safeParse(catRaw.toLowerCase().trim());
    if (parsedCat.success) {
      filters.category = parsedCat.data;
    }
  }

  // Faixa de Preço
  const precoRaw = getParam("preco");
  if (precoRaw && ["ate-50", "50-250", "acima-250"].includes(precoRaw)) {
    filters.priceRange = precoRaw as PriceRange;
  }

  // Só com Cupom
  const cupomRaw = getParam("cupom");
  if (cupomRaw === "1" || cupomRaw === "true" || cupomRaw === "sim") {
    filters.hasCoupon = true;
  }

  // Ordenação
  const ordemRaw = getParam("ordem");
  if (
    ordemRaw &&
    ["recentes", "maior-desconto", "menor-preco"].includes(ordemRaw)
  ) {
    filters.sort = ordemRaw as SortOption;
  } else {
    filters.sort = "recentes";
  }

  // Paginação
  const paginaRaw = getParam("pagina");
  if (paginaRaw) {
    const p = parseInt(paginaRaw, 10);
    if (!isNaN(p) && p > 0) {
      filters.page = p;
    }
  }

  return filters;
}

/**
 * Serializa OfferFilters para uma string de query URL amigável.
 */
export function filtersToSearchParams(filters: OfferFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.stores && filters.stores.length > 0) {
    params.set("loja", filters.stores.join(","));
  }
  if (filters.category) params.set("categoria", filters.category);
  if (filters.priceRange) params.set("preco", filters.priceRange);
  if (filters.hasCoupon) params.set("cupom", "1");
  if (filters.sort && filters.sort !== "recentes") {
    params.set("ordem", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("pagina", filters.page.toString());
  }

  return params;
}
