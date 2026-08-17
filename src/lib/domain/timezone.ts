export const defaultTimeZone = "America/Sao_Paulo";

export function detectBrowserTimeZone(): string {
  if (typeof Intl === "undefined") return defaultTimeZone;
  return Intl.DateTimeFormat().resolvedOptions().timeZone || defaultTimeZone;
}

export function formatDateLabel(dateKey: string, timeZone: string): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
