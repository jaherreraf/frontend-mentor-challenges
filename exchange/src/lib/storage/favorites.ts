const STORAGE_KEY = "fx-favorites"

export function getFavorites(): string[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
}

export function setFavorites(favorites: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function toggleFavorite(favorites: string[], pair: string): string[] {
  return favorites.includes(pair)
    ? favorites.filter((f) => f !== pair)
    : [...favorites, pair]
}
