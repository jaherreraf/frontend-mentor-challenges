const LAST_PAIR_KEY = "fx-last-pair"

export function getLastPair(): { from: string; to: string } | null {
  const stored = localStorage.getItem(LAST_PAIR_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setLastPair(from: string, to: string): void {
  localStorage.setItem(LAST_PAIR_KEY, JSON.stringify({ from, to }))
}
