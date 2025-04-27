export const a11y = {
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    // 创建或获取已存在的 live region
    let liveRegion = document.getElementById(`a11y-${priority}`)

    if (!liveRegion) {
      liveRegion = document.createElement("div")
      liveRegion.id = `a11y-${priority}`
      liveRegion.setAttribute("aria-live", priority)
      liveRegion.setAttribute("aria-relevant", "additions")
      liveRegion.className = "sr-only"
      document.body.appendChild(liveRegion)
    }

    // 清空并设置新消息
    liveRegion.textContent = ""

    // 使用 setTimeout 确保屏幕阅读器能够捕获变化
    setTimeout(() => {
      liveRegion!.textContent = message
    }, 100)
  },

  focusFirst: (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      return true
    }
    return false
  },

  trapFocus: (containerSelector: string) => {
    const container = document.querySelector(containerSelector)
    if (!container) return () => {}

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  },
}
