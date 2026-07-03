/**
 * Formata uma data ISO (ex: "2026-07-01T09:30:00Z") para o padrão
 * brasileiro de exibição: "01/07/2026 09:30".
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
