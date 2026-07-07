export const FROM = "USD"
export const TO = "EUR"
export const INITIAL_RANGE = "1M"
export const TIME_RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"] as const

export const TABS: { title: string; amount: number | null }[] = [
  { title: "History",   amount: null },
  { title: "Compare",   amount: null },
  { title: "Favorites", amount: 0    },
  { title: "Log",       amount: 0    },
]
