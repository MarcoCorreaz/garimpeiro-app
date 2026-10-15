import { RAW_SHEET_ROWS_MOCK } from "@/data/offers.mock";
import { formatRelativeTime, parseCuiabaDate } from "@/lib/date-utils";
import { generateShortHash, normalizeRawUrl, slugify } from "@/lib/hash";
import type { OfferFilters } from "@/types/filter";
import {
  OFFICIAL_CATEGORIES,
  offerSchema,
  publicStatusSchema,
  type CategorySlug,
  type Offer,
  type Platform,
  type RawSheetRow,
} from "@/types/offer";

/**
 * Converte valores brutos (string, number, com vírgula ou ponto) em float seguro.
 * Suporta formatos: "229.00", "229,00", "1.999,00", "1999.00", etc.
 */
export function parseNumber(value: unknown): number {
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (!value || typeof value !== "string") return 0;
  let cleaned = value.replace(/[R$\s]/g, "").trim();
  if (!cleaned) return 0;

  // Se contiver ponto E vírgula (ex.: "1.999,00"): ponto é milhar, vírgula é decimal
  if (cleaned.includes(".") && cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    // Apenas vírgula (ex.: "229,00"): vírgula é decimal
    cleaned = cleaned.replace(",", ".");
  }
  // Se contiver apenas ponto (ex.: "229.00" do JSON/Google Sheets), parseFloat já interpreta corretamente

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Mapeia uma linha bruta da planilha (objeto ou array de 20 colunas A-T)
 * para o modelo de dados validado Offer.
 *
 * ESTE É O PONTO CENTRAL DE TRADUÇÃO DE DADOS DO ECOSSISTEMA.
 * Se a fonte mudar (Apps Script JSON, CSV gviz ou Banco), apenas esta função
 * e o fetcher em getRawOffers() precisam ser adaptados.
 */
export function mapRowToOffer(
  row: RawSheetRow | Record<string, unknown> | unknown[]
): Offer | null {
  // Se for array indexado [0..19] (retorno bruto do Google Sheets API)
  let raw: RawSheetRow;
  if (Array.isArray(row)) {
    raw = {
      id: String(row[0] || ""),
      data: String(row[1] || ""),
      plataforma: String(row[2] || "").toLowerCase().trim(),
      produto: String(row[3] || "").trim(),
      categoria: String(row[4] || "").toLowerCase().trim(),
      preço_atual: row[5] as string | number,
      preço_pix: row[6] as string | number,
      preço_parcelado: String(row[7] || "").trim(),
      cupom: String(row[8] || "").trim(),
      preco_anterior: row[9] as string | number,
      preço_original: row[10] as string | number,
      desconto_pct: String(row[11] || "").trim(),
      link_cru: String(row[12] || "").trim(),
      imagem_url: String(row[13] || "").trim(),
      link_afiliado: String(row[14] || "").trim(),
      fonte: String(row[15] || "").trim(),
      observação: String(row[16] || "").trim(),
      status: String(row[17] || "").toLowerCase().trim(),
      postado_em: String(row[18] || "").trim(),
      verificado_em: String(row[19] || "").trim(),
    };
  } else {
    raw = row as RawSheetRow;
  }

  // =========================================================================
  // REGRA DE SEGURANÇA 1: link_afiliado é obrigatório no portal público
  // =========================================================================
  const affiliateUrl = (raw.link_afiliado || "").trim();
  if (!affiliateUrl) {
    return null; // Nunca exibe oferta sem link monetizado de afiliado
  }

  // =========================================================================
  // REGRA DE SEGURANÇA 2: Apenas status postado, aprovado ou repostar
  // =========================================================================
  const statusClean = (raw.status || "").toLowerCase().trim();
  const statusCheck = publicStatusSchema.safeParse(statusClean);
  if (!statusCheck.success) {
    return null; // Ignora 'pendente', 'ignorar' e valores inválidos
  }
  const status = statusCheck.data;

  // =========================================================================
  // CHAVE ÚNICA & ID: Hash curto do link_cru normalizado
  // =========================================================================
  const rawUrl = (raw.link_cru || "").trim();
  if (!rawUrl) return null;

  const normalizedUrl = normalizeRawUrl(rawUrl);
  const stableHash = generateShortHash(normalizedUrl);
  // Se a coluna A já possuir ID, usa como primário; caso contrário, usa o hash estável
  const id = raw.id && raw.id.trim() ? raw.id.trim() : stableHash;
  const slug = slugify(raw.produto || "oferta");

  // =========================================================================
  // PARSE DE PREÇOS E RECALCULO DE DESCONTO
  // =========================================================================
  const pricePix = parseNumber(raw.preço_pix);
  const priceCurrent = parseNumber(raw.preço_atual) || pricePix;
  const priceOriginal = parseNumber(raw.preço_original);
  const pricePreviousRaw = parseNumber(raw.preco_anterior);
  const pricePrevious = pricePreviousRaw > 0 ? pricePreviousRaw : null;

  if (pricePix <= 0) return null; // Preço inválido

  // Regra de negócio: se preço_original <= preço_pix, oculta riscado e badge
  let hasDiscount = false;
  let discountPercent = 0;

  if (priceOriginal > pricePix) {
    hasDiscount = true;
    discountPercent = Math.round(((priceOriginal - pricePix) / priceOriginal) * 100);

    // Auditoria de divergência em desenvolvimento
    if (process.env.NODE_ENV === "development" && raw.desconto_pct) {
      const match = raw.desconto_pct.match(/(\d+)/);
      if (match) {
        const sheetPct = parseInt(match[1], 10);
        if (Math.abs(discountPercent - sheetPct) > 2) {
          console.warn(
            `[Garimpeiro Dev] Divergência de desconto > 2 p.p. no produto "${raw.produto}": ` +
              `Planilha=${sheetPct}%, Calculado(Pix)=${discountPercent}%`
          );
        }
      }
    }
  }

  // =========================================================================
  // PARSE DE DATAS COM FALLBACK (fuso Cuiabá GMT-4)
  // =========================================================================
  const publishedAt =
    parseCuiabaDate(raw.postado_em) ||
    parseCuiabaDate(raw.verificado_em) ||
    parseCuiabaDate(raw.data) ||
    new Date();

  const verifiedAt = parseCuiabaDate(raw.verificado_em) || publishedAt;

  // =========================================================================
  // CUPOM E QUEDA DE PREÇO
  // =========================================================================
  const couponCode =
    raw.cupom && raw.cupom.trim() ? raw.cupom.trim().toUpperCase() : null;

  const isPriceDrop = status === "repostar";

  // Montagem e validação final contra o schema estrito
  const candidate = {
    id,
    slug,
    title: raw.produto.trim(),
    store: raw.plataforma.toLowerCase().trim() as Platform,
    category: raw.categoria.toLowerCase().trim() as CategorySlug,
    pricePix,
    priceCurrent,
    priceOriginal: priceOriginal > 0 ? priceOriginal : pricePix,
    priceInstallment: raw.preço_parcelado || "",
    pricePrevious,
    discountPercent,
    hasDiscount,
    couponCode,
    affiliateUrl,
    rawUrl,
    imageUrl: raw.imagem_url.trim(),
    notes: raw.observação.trim(),
    status,
    isPriceDrop,
    publishedAt,
    verifiedAt,
  };

  const parsed = offerSchema.safeParse(candidate);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Garimpeiro Dev] Falha na validação da oferta "${raw.produto}":`,
        parsed.error.format()
      );
    }
    return null;
  }

  return parsed.data;
}

/**
 * Obtém os dados brutos da fonte.
 * Atualmente usa a fixture RAW_SHEET_ROWS_MOCK.
 * No futuro, basta alternar para:
 *   const res = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL!, { next: { revalidate: 60 } });
 *   const data = await res.json();
 */
async function fetchRawOffers(): Promise<RawSheetRow[]> {
  // Simulação de latência de rede/leitura em milissegundos para exercitar os skeletons
  return RAW_SHEET_ROWS_MOCK;
}

/**
 * Retorna todas as ofertas ativas e válidas para o site, já deduplicadas por link_cru.
 */
async function getAllValidOffers(): Promise<Offer[]> {
  const rawRows = await fetchRawOffers();
  const seenUrls = new Set<string>();
  const offers: Offer[] = [];

  for (const row of rawRows) {
    const offer = mapRowToOffer(row);
    if (!offer) continue;

    const normalizedKey = normalizeRawUrl(offer.rawUrl);
    if (seenUrls.has(normalizedKey)) {
      continue; // Deduplicação estrita por link_cru
    }

    seenUrls.add(normalizedKey);
    offers.push(offer);
  }

  return offers;
}

/**
 * Busca ofertas aplicando filtros, busca textual, ordenação e paginação.
 */
export async function getOffers(filters: OfferFilters = {}): Promise<{
  items: Offer[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}> {
  const allOffers = await getAllValidOffers();
  let filtered = [...allOffers];

  // 1. Filtro por Categoria
  if (filters.category) {
    filtered = filtered.filter((o) => o.category === filters.category);
  }

  // 2. Filtro por Lojas
  if (filters.stores && filters.stores.length > 0) {
    filtered = filtered.filter((o) => filters.stores!.includes(o.store));
  }

  // 3. Filtro "Só com cupom"
  if (filters.hasCoupon) {
    filtered = filtered.filter((o) => o.couponCode !== null);
  }

  // 4. Filtro por Faixa de Preço
  if (filters.priceRange) {
    if (filters.priceRange === "ate-50") {
      filtered = filtered.filter((o) => o.pricePix <= 50);
    } else if (filters.priceRange === "50-250") {
      filtered = filtered.filter((o) => o.pricePix > 50 && o.pricePix <= 250);
    } else if (filters.priceRange === "acima-250") {
      filtered = filtered.filter((o) => o.pricePix > 250);
    }
  }

  // 5. Busca por texto (título, loja, observação)
  if (filters.q && filters.q.trim()) {
    const query = filters.q.toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        o.notes.toLowerCase().includes(query) ||
        o.store.toLowerCase().includes(query)
    );
  }

  // 6. Ordenação
  const sort = filters.sort || "recentes";
  if (sort === "recentes") {
    filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  } else if (sort === "maior-desconto") {
    filtered.sort((a, b) => b.discountPercent - a.discountPercent);
  } else if (sort === "menor-preco") {
    filtered.sort((a, b) => a.pricePix - b.pricePix);
  }

  // 7. Paginação
  const page = Math.max(1, filters.page || 1);
  const pageSize = 12;
  const start = 0;
  const end = page * pageSize; // No padrão "Carregar mais", acumulamos até page * pageSize
  const paginatedItems = filtered.slice(start, end);

  return {
    items: paginatedItems,
    total: filtered.length,
    hasMore: end < filtered.length,
    page,
    pageSize,
  };
}

/**
 * Busca uma oferta pelo ID estável (hash do link_cru).
 */
export async function getOfferById(id: string): Promise<Offer | null> {
  const allOffers = await getAllValidOffers();
  return allOffers.find((o) => o.id === id) || null;
}

/**
 * Retorna as 4 categorias oficiais com contagem de ofertas ativas em cada uma.
 */
export async function getCategories(): Promise<
  { slug: CategorySlug; label: string; count: number }[]
> {
  const allOffers = await getAllValidOffers();
  return OFFICIAL_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    count: allOffers.filter((o) => o.category === cat.slug).length,
  }));
}

/**
 * Retorna a lista de ofertas que possuem cupom ativo para a faixa horizontal de cupons.
 */
export async function getActiveCoupons(): Promise<Offer[]> {
  const allOffers = await getAllValidOffers();
  return allOffers.filter((o) => o.couponCode !== null);
}

/**
 * Retorna as estatísticas consolidadas para os contadores animados do Hero.
 */
export async function getStats(): Promise<{
  activeOffers: number;
  activeCoupons: number;
  storesCount: number;
}> {
  const allOffers = await getAllValidOffers();
  const stores = new Set(allOffers.map((o) => o.store));
  const coupons = allOffers.filter((o) => o.couponCode !== null);

  return {
    activeOffers: allOffers.length,
    activeCoupons: coupons.length,
    storesCount: stores.size,
  };
}

export { formatRelativeTime };
