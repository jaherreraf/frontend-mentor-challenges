export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatTickDate(time: string): string {
  const d = new Date(time)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
