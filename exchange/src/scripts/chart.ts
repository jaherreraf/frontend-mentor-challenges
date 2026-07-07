import { getDateRangeForPeriod } from "../lib/api/frankfurter"
import type { ChartPoint } from "../lib/api/frankfurter"

const API = "https://api.frankfurter.dev/v1"
const CHART_LINE = "#b4df24"
const CHART_ACCENT_RGBA = "rgba(180,223,36,0.25)"
const CHART_ACCENT_RGBA_SOFT = "rgba(180,223,36,0.3)"

let areaSeries: any = null
let chart: any = null
let container: HTMLElement | null = null
let endDateRef: string = ""
let getPairFn: () => { from: string; to: string; rate: number }

export async function initChart(config: {
  chartData: ChartPoint[]
  endDate: string
  getPair: () => { from: string; to: string; rate: number }
}): Promise<void> {
  endDateRef = config.endDate
  getPairFn = config.getPair

  const { createChart, ColorType } = await import("https://esm.sh/lightweight-charts@4.2.0")

  container = document.getElementById("chart-container")
  if (!container) return

  chart = createChart(container, {
    width: container.clientWidth,
    height: container.clientHeight,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: "#8b9099",
      attributionLogo: false,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { color: "rgba(255,255,255,0.05)" },
    },
    rightPriceScale: { visible: false },
    leftPriceScale: { visible: true, borderVisible: false },
    timeScale: {
      borderVisible: false,
      tickMarkFormatter: (time: number) => {
        const d = new Date(time)
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      },
    },
    crosshair: {
      vertLine: { color: CHART_ACCENT_RGBA_SOFT, width: 1, style: 1 },
      horzLine: { color: CHART_ACCENT_RGBA_SOFT, width: 1 },
    },
    handleScroll: false,
    handleScale: false,
  })

  areaSeries = chart.addAreaSeries({
    lineColor: CHART_LINE,
    topColor: CHART_ACCENT_RGBA,
    bottomColor: "rgba(180,223,36,0.00)",
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 4,
    crosshairMarkerBorderColor: CHART_LINE,
    crosshairMarkerBackgroundColor: CHART_LINE,
  })

  areaSeries.setData(config.chartData)
  chart.timeScale().fitContent()

  const priceLabel = document.getElementById("chart-price-label")
  chart.subscribeCrosshairMove((param: any) => {
    if (!priceLabel) return
    if (!param.time || !param.seriesData.size) {
      priceLabel.textContent = `${config.chartData.at(-1)?.value?.toFixed(4)} · ${endDateRef}`
      return
    }
    const point = param.seriesData.get(areaSeries)
    if (point && "value" in point) {
      priceLabel.textContent = `${point.value.toFixed(4)} · ${param.time}`
    }
  })

  window.addEventListener("resize", () => {
    if (container) {
      chart.applyOptions({ width: container.clientWidth, height: container.clientHeight })
    }
  })

  setupRangeButtons()
}

function setupRangeButtons(): void {
  document.querySelectorAll(".range-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".range-btn").forEach((b) => {
        b.classList.remove("bg-(--color-card-alt)", "text-(--color-text-primary)")
        b.classList.add("text-(--color-text-muted)")
      })
      btn.classList.add("bg-(--color-card-alt)", "text-(--color-text-primary)")
      btn.classList.remove("text-(--color-text-muted)")

      const range = btn.getAttribute("data-range") ?? "1M"
      const { startDate, endDate } = getDateRangeForPeriod(range)
      const { from, to } = getPairFn()

      try {
        const res = await fetch(`${API}/${startDate}..${endDate}?from=${from}&to=${to}`)
        const data = await res.json()
        const points = Object.entries(data.rates)
          .map(([date, rates]: [string, any]) => ({ time: date, value: rates[to] }))
          .sort((a, b) => a.time.localeCompare(b.time))

        areaSeries.setData(points)
        chart.timeScale().fitContent()

        const open = points[0]?.value ?? 0
        const last = points.at(-1)?.value ?? 0
        const change = last - open
        const changePercent = open !== 0 ? (change / open) * 100 : 0

        document.getElementById("stat-open")!.textContent = open.toFixed(4)
        document.getElementById("stat-last")!.textContent = last.toFixed(4)
        const changeEl = document.getElementById("stat-change")!
        const pctEl = document.getElementById("stat-pct-change")!
        changeEl.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(4)}`
        pctEl.textContent = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`
        changeEl.className = `text-sm font-semibold whitespace-nowrap ${change >= 0 ? "text-(--color-market-up)" : "text-(--color-market-down)"}`
        pctEl.className = `text-sm font-semibold whitespace-nowrap ${changePercent >= 0 ? "text-(--color-market-up)" : "text-(--color-market-down)"}`
      } catch (e) {
        console.error("Error fetching range:", e)
      }
    })
  })
}
