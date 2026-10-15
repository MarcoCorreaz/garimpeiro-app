/**
 * Utilitários para parse e formatação de datas no fuso horário operacional
 * oficial do ecossistema: America/Cuiaba (GMT-4 / UTC-4).
 */

/**
 * Converte data e hora para Date UTC considerando o offset GMT-4 (Cuiabá).
 */
function createCuiabaDate(
  year: number,
  month: number, // 1-12
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): Date {
  // Offset Cuiabá = -04:00 (4 horas atrás de UTC)
  // Logo, UTC = Cuiabá + 4 horas
  const pad = (n: number) => n.toString().padStart(2, "0");
  const isoString = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}-04:00`;
  const parsed = new Date(isoString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Faz parse explícito de strings nos formatos usados na planilha:
 * 1. "dd/MM/yyyy HH:mm:ss" (comum em postado_em gerado pelo n8n/Sheets)
 * 2. "dd/MM/yyyy HH:mm"
 * 3. "yyyy-MM-dd HH:mm" (comum em verificado_em da IA)
 * 4. "yyyy-MM-dd" (coluna data)
 */
export function parseCuiabaDate(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) {
    return null;
  }

  const clean = dateStr.trim();

  // Formato 1 e 2: dd/MM/yyyy [HH:mm[:ss]]
  const brMatch = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (brMatch) {
    const [, d, m, y, h, min, s] = brMatch;
    return createCuiabaDate(
      parseInt(y, 10),
      parseInt(m, 10),
      parseInt(d, 10),
      h ? parseInt(h, 10) : 0,
      min ? parseInt(min, 10) : 0,
      s ? parseInt(s, 10) : 0
    );
  }

  // Formato 3: yyyy-MM-dd HH:mm[:ss]
  const isoDateTimeMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (isoDateTimeMatch) {
    const [, y, m, d, h, min, s] = isoDateTimeMatch;
    return createCuiabaDate(
      parseInt(y, 10),
      parseInt(m, 10),
      parseInt(d, 10),
      parseInt(h, 10),
      parseInt(min, 10),
      s ? parseInt(s, 10) : 0
    );
  }

  // Formato 4: yyyy-MM-dd
  const isoDateMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, y, m, d] = isoDateMatch;
    return createCuiabaDate(
      parseInt(y, 10),
      parseInt(m, 10),
      parseInt(d, 10),
      12, // Meio-dia para evitar viradas de dia
      0,
      0
    );
  }

  // Fallback padrão se for ISO já válido
  const fallback = new Date(clean);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Formata um timestamp para exibição relativa humanizada em português.
 * Exemplos: "há 5 min", "há 2h", "ontem", "há 3 dias".
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return "agora mesmo";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `há ${diffMin} min`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "ontem";
  }
  if (diffDays < 7) {
    return `há ${diffDays} dias`;
  }

  // Mais de 1 semana: data formatada curta
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}/${m}`;
}
