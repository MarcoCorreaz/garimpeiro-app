import { createHash } from "node:crypto";

/**
 * Normaliza a URL do link_cru para garantir deduplicação e chave estável:
 * - minúsculo
 * - protocolo e host padronizados
 * - remoção de query strings (?utm_..., tracking, etc.)
 * - remoção de fragmentos (#...)
 * - remoção de barra final
 */
export function normalizeRawUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let pathname = url.pathname.toLowerCase();
    // remove barra final redundante, exceto se for raiz
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    return `${host}${pathname}`;
  } catch {
    // Fallback caso a string não seja uma URL válida completa
    return rawUrl
      .trim()
      .toLowerCase()
      .split("?")[0]
      .split("#")[0]
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/+$/, "");
  }
}

/**
 * Gera um hash curto de 8 caracteres a partir do link_cru normalizado.
 * Serve como ID estável para rotas, drawer (?oferta=id) e chaves React.
 */
export function generateShortHash(normalizedUrl: string): string {
  if (!normalizedUrl) return "";
  return createHash("sha256").update(normalizedUrl).digest("hex").slice(0, 8);
}

/**
 * Gera um slug amigável e legível a partir do título do produto.
 * Usado apenas esteticamente, sem interferir na busca ou chave única.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-") // substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, "") // remove hífens do início e fim
    .slice(0, 60); // limite seguro de caracteres
}
