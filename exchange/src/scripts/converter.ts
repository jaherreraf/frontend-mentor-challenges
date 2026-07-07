import { getFlagUrl } from "../lib/api/frankfurter"
import { setupCurrencyDropdown } from "./currency-picker"

const API = "https://api.frankfurter.dev/v1"

let fromCurrency: string
let toCurrency: string
let currentRate: number

let onRateChange: (() => void) | null = null

export function initConverter(config: {
  initialFrom: string
  initialTo: string
  chartData: { value: number }[]
  onRateChange?: () => void
}): void {
  fromCurrency = config.initialFrom
  toCurrency = config.initialTo
  currentRate = config.chartData.at(-1)?.value ?? 1
  onRateChange = config.onRateChange ?? null

  setupCurrencyDropdown({
    btnId: "send-currency-btn",
    dropdownId: "send-dropdown",
    codeElId: "send-code",
    flagElId: "send-flag",
    chevronId: "send-chevron",
    panel: "send",
    onSelect: (code) => { fromCurrency = code; updateConverter() },
  })

  setupCurrencyDropdown({
    btnId: "receive-currency-btn",
    dropdownId: "receive-dropdown",
    codeElId: "receive-code",
    flagElId: "receive-flag",
    chevronId: "receive-chevron",
    panel: "receive",
    onSelect: (code) => { toCurrency = code; updateConverter() },
  })

  document.getElementById("send-amount")?.addEventListener("input", updateReceive)

  document.getElementById("swap-btn")?.addEventListener("click", swapCurrencies)

  updateReceive()
  updateRateLabel()
}

export function getPair(): { from: string; to: string; rate: number } {
  return { from: fromCurrency, to: toCurrency, rate: currentRate }
}

async function fetchRate(from: string, to: string): Promise<number> {
  const res = await fetch(`${API}/latest?from=${from}&to=${to}`)
  const data = await res.json()
  return data.rates[to]
}

export async function updateConverter(): Promise<void> {
  try {
    currentRate = await fetchRate(fromCurrency, toCurrency)
    updateReceive()
    updateRateLabel()
    document.getElementById("chart-pair-label")!.textContent = `${fromCurrency}/${toCurrency}`
    onRateChange?.()
  } catch (e) {
    console.error("Error fetching rate:", e)
  }
}

function updateReceive(): void {
  const amount = parseFloat((document.getElementById("send-amount") as HTMLInputElement)?.value) || 0
  document.getElementById("receive-amount")!.textContent = (amount * currentRate).toFixed(2)
}

function updateRateLabel(): void {
  document.getElementById("rate-label")!.textContent =
    `1 ${fromCurrency} = ${currentRate.toFixed(4)} ${toCurrency}`
}

async function swapCurrencies(): Promise<void> {
  ;[fromCurrency, toCurrency] = [toCurrency, fromCurrency]
  const sendFlag = document.getElementById("send-flag") as HTMLImageElement
  const receiveFlag = document.getElementById("receive-flag") as HTMLImageElement
  sendFlag.src = getFlagUrl(fromCurrency)
  sendFlag.alt = fromCurrency
  receiveFlag.src = getFlagUrl(toCurrency)
  receiveFlag.alt = toCurrency
  document.getElementById("send-code")!.textContent = fromCurrency
  document.getElementById("receive-code")!.textContent = toCurrency
  await updateConverter()
}
