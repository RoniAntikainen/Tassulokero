export function formatDueDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("fi-FI", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
