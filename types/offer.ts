import { z } from "zod";

/**
 * Plataformas / Lojas oficiais monitoradas pelo Garimpeiro do Precinho
 */
export const platformSchema = z.enum([
  "mercadolivre",
  "amazon",
  "shopee",
  "aliexpress",
]);
export type Platform = z.infer<typeof platformSchema>;

/**
 * 4 Categorias oficiais do ecossistema
 */
export const categorySlugSchema = z.enum([
  "tecnologia",
  "casa",
  "utilidades",
  "moda",
]);
export type CategorySlug = z.infer<typeof categorySlugSchema>;

/**
 * Metadados das categorias oficiais
 */
export const OFFICIAL_CATEGORIES: {
  slug: CategorySlug;
  label: string;
  examples: string;
}[] = [
  {
    slug: "tecnologia",
    label: "Tecnologia",
    examples: "Smart TVs, Notebooks, Fones Bluetooth, Smartwatches, Periféricos",
  },
  {
    slug: "casa",
    label: "Casa & Cozinha",
    examples: "Air Fryers, Panelas, Aspiradores Verticais, Eletroportáteis",
  },
  {
    slug: "utilidades",
    label: "Utilidades & Ferramentas",
    examples: "Robôs Aspiradores, Fechaduras Digitais, Mops, Ferramentas",
  },
  {
    slug: "moda",
    label: "Moda & Calçados",
    examples: "Tênis, Camisetas Dry Fit, Cuecas Lupo, Relógios, Carteiras",
  },
];

/**
 * Status operacionais possíveis na planilha Google Sheets (Coluna R)
 */
export const sheetStatusSchema = z.enum([
  "pendente",
  "aprovado",
  "postado",
  "repostar",
  "ignorar",
]);
export type SheetStatus = z.infer<typeof sheetStatusSchema>;

/**
 * Status visíveis permitidos no site público
 */
export const publicStatusSchema = z.enum(["postado", "aprovado", "repostar"]);
export type PublicStatus = z.infer<typeof publicStatusSchema>;

/**
 * Schema das 20 colunas brutas da planilha Google Sheets (Colunas A-T).
 * Aceita strings vazias e flexibilidade de tipagem para parse defensivo.
 */
export const rawSheetRowSchema = z.object({
  id: z.string().optional().default(""), // Coluna A
  data: z.string().optional().default(""), // Coluna B
  plataforma: z.string(), // Coluna C
  produto: z.string(), // Coluna D
  categoria: z.string(), // Coluna E
  preço_atual: z.union([z.string(), z.number()]), // Coluna F
  preço_pix: z.union([z.string(), z.number()]), // Coluna G
  preço_parcelado: z.string().optional().default(""), // Coluna H
  cupom: z.string().optional().default(""), // Coluna I
  preco_anterior: z.union([z.string(), z.number()]).optional().default(""), // Coluna J
  preço_original: z.union([z.string(), z.number()]), // Coluna K
  desconto_pct: z.string().optional().default(""), // Coluna L
  link_cru: z.string(), // Coluna M
  imagem_url: z.string(), // Coluna N
  link_afiliado: z.string().optional().default(""), // Coluna O
  fonte: z.string().optional().default(""), // Coluna P
  observação: z.string().optional().default(""), // Coluna Q
  status: z.string(), // Coluna R
  postado_em: z.string().optional().default(""), // Coluna S
  verificado_em: z.string().optional().default(""), // Coluna T
});

export type RawSheetRow = z.infer<typeof rawSheetRowSchema>;

/**
 * Modelo de dados sanitizado e validado da Oferta para uso na UI
 */
export const offerSchema = z.object({
  id: z.string().min(1), // Hash curto estável do link_cru normalizado
  slug: z.string(), // Slug legível do produto para URLs amigáveis
  title: z.string().min(1), // Nome do produto
  store: platformSchema, // Plataforma
  category: categorySlugSchema, // Categoria oficial
  pricePix: z.number().positive(), // Preço principal em destaque (no Pix)
  priceCurrent: z.number().positive(), // Menor preço vigente geral
  priceOriginal: z.number().positive(), // Preço de referência "De"
  priceInstallment: z.string(), // Texto da condição de parcelamento
  pricePrevious: z.number().positive().nullable(), // Preço anterior em caso de queda (repostar)
  discountPercent: z.number().int().min(0).max(100), // Percentual recalculado no front
  hasDiscount: z.boolean(), // true se preço_original > preço_pix
  couponCode: z.string().nullable(), // Código do cupom para copiar (ou null)
  affiliateUrl: z.string().url(), // Link monetizado obrigatório para conversão
  rawUrl: z.string().url(), // Link limpo original da loja
  imageUrl: z.string().url(), // Imagem oficial do produto
  notes: z.string(), // Observação / argumento de compra
  status: publicStatusSchema, // postado | aprovado | repostar
  isPriceDrop: z.boolean(), // true quando status === 'repostar'
  publishedAt: z.date(), // Data do disparo (ou verificado_em / data)
  verifiedAt: z.date(), // Data da última auditoria da IA
});

export type Offer = z.infer<typeof offerSchema>;
