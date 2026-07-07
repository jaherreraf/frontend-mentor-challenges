export interface DropdownConfig {
  btnId: string
  dropdownId: string
  codeElId: string
  flagElId: string
  chevronId: string
  panel: string
  onSelect: (code: string) => void
}

export function setupCurrencyDropdown(config: DropdownConfig): void {
  const { btnId, dropdownId, codeElId, flagElId, chevronId, panel, onSelect } = config
  const btn = document.getElementById(btnId) as HTMLButtonElement | null
  const dropdown = document.getElementById(dropdownId)
  const chevron = document.getElementById(chevronId) as HTMLImageElement | null
  const searchEl = dropdown?.querySelector(`[data-search="${panel}"]`) as HTMLInputElement | null

  btn?.addEventListener("click", (e) => {
    e.stopPropagation()
    const isOpen = !dropdown?.classList.contains("hidden")

    document.querySelectorAll("#send-dropdown, #receive-dropdown").forEach((d) => d.classList.add("hidden"))
    document.querySelectorAll("#send-chevron, #receive-chevron").forEach((c) => c.classList.remove("rotate-180"))
    document.querySelectorAll("#send-currency-btn, #receive-currency-btn").forEach((b) => b.setAttribute("aria-expanded", "false"))

    if (!isOpen) {
      dropdown?.classList.remove("left-0", "right-0")
      dropdown?.classList.remove("hidden")
      if (dropdown) dropdown.style.visibility = "hidden"

      const btnRect = btn.getBoundingClientRect()
      const dropWidth = dropdown?.offsetWidth ?? 0
      const spaceRight = window.innerWidth - btnRect.left

      dropdown?.classList.add(spaceRight >= dropWidth ? "left-0" : "right-0")
      if (dropdown) dropdown.style.visibility = ""

      chevron?.classList.add("rotate-180")
      btn.setAttribute("aria-expanded", "true")
      setTimeout(() => searchEl?.focus(), 50)
    }
  })

  document.addEventListener("click", (e) => {
    const target = e.target as Node
    if (!dropdown?.contains(target) && target !== btn) {
      dropdown?.classList.add("hidden")
      chevron?.classList.remove("rotate-180")
      btn?.setAttribute("aria-expanded", "false")
    }
  })

  searchEl?.addEventListener("input", () => {
    const q = searchEl.value.toLowerCase()
    dropdown?.querySelectorAll(`.currency-option[data-panel="${panel}"]`).forEach((opt) => {
      const el = opt as HTMLElement
      const code = el.dataset.code?.toLowerCase() ?? ""
      const name = el.querySelector("span:last-child")?.textContent?.toLowerCase() ?? ""
      el.style.display = code.includes(q) || name.includes(q) ? "" : "none"
    })
  })

  dropdown?.querySelectorAll(`.currency-option[data-panel="${panel}"]`).forEach((opt) => {
    opt.addEventListener("click", () => {
      const el = opt as HTMLElement
      const code = el.dataset.code ?? ""
      const flagUrl = el.dataset.flag ?? ""
      document.getElementById(codeElId)!.textContent = code
      const flagImg = document.getElementById(flagElId) as HTMLImageElement
      flagImg.src = flagUrl
      flagImg.alt = code
      dropdown?.classList.add("hidden")
      chevron?.classList.remove("rotate-180")
      btn?.setAttribute("aria-expanded", "false")
      if (searchEl) {
        searchEl.value = ""
        dropdown?.querySelectorAll(".currency-option").forEach((o) => (o.style.display = ""))
      }
      onSelect(code)
    })
  })
}
