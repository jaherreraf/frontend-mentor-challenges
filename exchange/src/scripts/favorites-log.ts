import { getFlagUrl } from "../lib/api/frankfurter"
import { getFavorites, setFavorites, toggleFavorite } from "../lib/storage/favorites"
import { getLog, setLog, addLogEntry } from "../lib/storage/log"
import type { ConversionLogEntry } from "../lib/type"

let favorites: string[] = []
let conversionLog: ConversionLogEntry[] = []

export function initFavoritesLog(): void {
  favorites = getFavorites()
  conversionLog = getLog()

  document.getElementById("favorite-btn")?.addEventListener("click", handleFavoriteToggle)
  document.getElementById("log-btn")?.addEventListener("click", handleLogConversion)

  renderFavorites()
  renderLog()
  updateFavoriteBtn()
}

export function updateFavoriteBtn(): void {
  const { fromCurrency, toCurrency } = getCurrentPairFromDOM()
  const key = `${fromCurrency}/${toCurrency}`
  const isFav = favorites.includes(key)
  const btn = document.getElementById("favorite-btn")
  const label = document.getElementById("favorite-label")
  if (!btn || !label) return
  label.textContent = isFav ? "Favorited" : "Favorite"
  btn.classList.toggle("bg-(--color-accent-lime)", isFav)
  btn.classList.toggle("text-(--color-main)", isFav)
  btn.classList.toggle("border", !isFav)
  btn.classList.toggle("border-(--color-border)", !isFav)
  btn.classList.toggle("text-(--color-text-muted)", !isFav)
}

function getCurrentPairFromDOM(): { fromCurrency: string; toCurrency: string } {
  return {
    fromCurrency: document.getElementById("send-code")?.textContent ?? "USD",
    toCurrency: document.getElementById("receive-code")?.textContent ?? "EUR",
  }
}

function handleFavoriteToggle(): void {
  const { fromCurrency, toCurrency } = getCurrentPairFromDOM()
  const key = `${fromCurrency}/${toCurrency}`
  favorites = toggleFavorite(favorites, key)
  setFavorites(favorites)
  renderFavorites()
  updateFavoriteBtn()
}

function handleLogConversion(): void {
  const { fromCurrency, toCurrency } = getCurrentPairFromDOM()
  const amountInput = document.getElementById("send-amount") as HTMLInputElement
  const amount = parseFloat(amountInput?.value) || 0
  const currentRate = parseFloat(document.getElementById("receive-amount")?.textContent ?? "0") / (amount || 1)
  const result = (amount * currentRate).toFixed(2)

  const entry: ConversionLogEntry = {
    from: fromCurrency,
    to: toCurrency,
    fromCode: fromCurrency,
    toCode: toCurrency,
    amount: amount.toLocaleString(),
    result: `${result} ${toCurrency}`,
    rate: currentRate.toFixed(4),
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }

  conversionLog = addLogEntry(conversionLog, entry)
  setLog(conversionLog)
  renderLog()

  const btn = document.getElementById("log-btn")
  if (btn) {
    btn.textContent = "✓ Logged!"
    setTimeout(() => { btn.textContent = "Log conversion" }, 1500)
  }
}

function renderFavorites(): void {
  const empty = document.getElementById("favorites-empty")
  const list = document.getElementById("favorites-list")
  const count = document.getElementById("tab-count-2")
  if (!list || !count) return
  list.innerHTML = ""
  count.textContent = String(favorites.length)

  if (favorites.length === 0) {
    empty?.classList.remove("hidden")
    return
  }
  empty?.classList.add("hidden")

  favorites.forEach((pair) => {
    const [fc, tc] = pair.split("/")
    const li = document.createElement("li")
    li.className = "flex items-center justify-between px-4 py-3 bg-(--color-card-alt) rounded-lg border border-(--color-border)"
    li.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${getFlagUrl(fc)}" alt="${fc}" class="size-5 rounded-full object-cover" />
        <span class="text-xs font-semibold text-(--color-text-primary)">${fc}</span>
        <span class="text-xs text-(--color-text-muted)">→</span>
        <img src="${getFlagUrl(tc)}" alt="${tc}" class="size-5 rounded-full object-cover" />
        <span class="text-xs font-semibold text-(--color-text-primary)">${tc}</span>
      </div>
      <button data-pair="${pair}" class="fav-remove text-xs text-(--color-text-muted) hover:text-(--color-market-down) transition-colors">Remove</button>
    `
    list.appendChild(li)
  })

  list.querySelectorAll(".fav-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pair = (btn as HTMLElement).getAttribute("data-pair") ?? ""
      favorites = favorites.filter((f) => f !== pair)
      setFavorites(favorites)
      renderFavorites()
      updateFavoriteBtn()
    })
  })
}

function renderLog(): void {
  const empty = document.getElementById("log-empty")
  const list = document.getElementById("log-list")
  const count = document.getElementById("tab-count-3")
  if (!list || !count) return
  list.innerHTML = ""
  count.textContent = String(conversionLog.length)

  if (conversionLog.length === 0) {
    empty?.classList.remove("hidden")
    return
  }
  empty?.classList.add("hidden")

  ;[...conversionLog].reverse().forEach((entry) => {
    const li = document.createElement("li")
    li.className = "flex items-center justify-between px-4 py-3 bg-(--color-card-alt) rounded-lg border border-(--color-border)"
    li.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${getFlagUrl(entry.fromCode)}" alt="${entry.fromCode}" class="size-5 rounded-full object-cover" />
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-semibold text-(--color-text-primary)">${entry.from} → ${entry.to}</span>
          <span class="text-xs text-(--color-text-muted)">${entry.date}</span>
        </div>
      </div>
      <div class="flex flex-col items-end gap-0.5">
        <span class="text-sm font-semibold text-(--color-accent-lime)">${entry.result}</span>
        <span class="text-xs text-(--color-text-muted)">${entry.amount} ${entry.fromCode} @ ${entry.rate}</span>
      </div>
    `
    list.appendChild(li)
  })
}
