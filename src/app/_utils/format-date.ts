export function formatDate(date: Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}