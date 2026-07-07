export interface Tab {
  title: string
  amount: number | null
}

export interface StatsDisplayItem {
  label: string
  value: string
  isPositive: boolean
}

export interface ConversionLogEntry {
  from: string
  to: string
  fromCode: string
  toCode: string
  amount: string
  result: string
  rate: string
  date: string
}
