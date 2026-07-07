import { getFlagUrl } from "../lib/api/frankfurter"

const API = "https://api.frankfurter.dev/v1"

let compareLoaded = false
let allCompareRates: Record<string, number> = {}
let compareBase: string
let currencies: Record<string, string>

export function initTabs(config: {
  currencies: Record<string, string>
  initialFrom: string
}): void {
  currencies = config.currencies
  compareBase = config.initialFrom

  setupTabSwitching()
  setupCompareSearch()
  setupCompareBaseButton()
}

function setupTabSwitching(): void {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-tab")

      document.querySelectorAll("[id^='tab-panel-']").forEach((p) => p.classList.add("hidden"))
      document.getElementById(`tab-panel-${idx}`)?.classList.remove("hidden")

      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("border-b-2", "border-(--color-accent-lime)")
        const span = b.querySelector("span:first-child")
        if (span) {
          span.classList.replace("text-(--color-text-primary)", "text-(--color-text-muted)")
        }
      })

      btn.classList.add("border-b-2", "border-(--color-accent-lime)")
      const activeSpan = btn.querySelector("span:first-child")
      if (activeSpan) {
        activeSpan.classList.replace("text-(--color-text-muted)", "text-(--color-text-primary)")
      }

      if (idx === "1" && !compareLoaded) {
        compareLoaded = true
        loadCompareTable()
      }
    })
  })
}

function setupCompareSearch(): void {
  document.getElementById("compare-search")?.addEventListener("input", (e) => {
    renderCompareTable((e.target as HTMLInputElement).value)
  })
}

function setupCompareBaseButton(): void {
  document.getElementById("compare-base-btn")?.addEventListener("click", () => {
    document.getElementById("send-currency-btn")?.click()

    const handler = (e: Event) => {
      const opt = (e.target as HTMLElement).closest(".currency-option[data-panel='send']") as HTMLElement | null
      if (opt) {
        compareBase = opt.dataset.code ?? compareBase
        document.getElementById("compare-base-code")!.textContent = compareBase
        const flagImg = document.getElementById("compare-base-flag") as HTMLImageElement
        flagImg.src = opt.dataset.flag ?? ""
        loadCompareTable()
      }
      document.getElementById("send-options")?.removeEventListener("click", handler)
    }
    document.getElementById("send-options")?.addEventListener("click", handler, { once: true })
  })
}

async function loadCompareTable(): Promise<void> {
  const loading = document.getElementById("compare-loading")
  const tbody = document.getElementById("compare-tbody")
  loading?.classList.remove("hidden")

  try {
    const res = await fetch(`${API}/latest?from=${compareBase}`)
    const data = await res.json()
    allCompareRates = data.rates
    renderCompareTable()
  } catch (e) {
    console.error("Error fetching compare rates:", e)
  } finally {
    loading?.classList.add("hidden")
  }
}

function renderCompareTable(filter = ""): void {
  const tbody = document.getElementById("compare-tbody")
  if (!tbody) return
  tbody.innerHTML = ""
  const q = filter.toLowerCase()

  const entries = Object.entries(allCompareRates)
    .filter(([code]) => code !== compareBase)
    .filter(([code]) => {
      const name = (currencies[code] || "").toLowerCase()
      return code.toLowerCase().includes(q) || name.includes(q)
    })
    .sort(([a], [b]) => a.localeCompare(b))

  entries.forEach(([code, rate]) => {
    const tr = document.createElement("tr")
    tr.className = "border-b border-(--color-border) last:border-0 hover:bg-(--color-card-alt) transition-colors"
    tr.innerHTML = `
      <td class="px-4 py-2.5 flex items-center gap-2">
        <img src="${getFlagUrl(code)}" alt="${code}" class="size-5 rounded-full object-cover" />
        <span class="text-xs font-semibold text-(--color-text-primary)">${code}</span>
        <span class="text-xs text-(--color-text-muted) truncate hidden sm:inline">${currencies[code] ?? ""}</span>
      </td>
      <td class="px-4 py-2.5 text-xs font-semibold text-(--color-text-primary) text-right">${rate.toFixed(4)}</td>
      <td class="px-4 py-2.5 text-xs font-semibold text-(--color-accent-lime) text-right">${(rate * 1000).toFixed(2)}</td>
    `
    tbody.appendChild(tr)
  })

  if (tbody.children.length === 0) {
    const tr = document.createElement("tr")
    tr.innerHTML = `<td colspan="3" class="px-4 py-6 text-center text-xs text-(--color-text-muted)">No currencies match your search</td>`
    tbody.appendChild(tr)
  }
}
