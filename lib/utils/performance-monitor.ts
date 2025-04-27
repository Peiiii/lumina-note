export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Record<string, { start: number; duration?: number }> = {}
  private marks: Record<string, number> = {}
  private enabled: boolean = process.env.NODE_ENV === "development"

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  public startMeasure(name: string): void {
    if (!this.enabled) return
    this.metrics[name] = { start: performance.now() }
    console.log(`⏱️ Started measuring: ${name}`)
  }

  public endMeasure(name: string): number | undefined {
    if (!this.enabled) return
    const metric = this.metrics[name]
    if (metric) {
      metric.duration = performance.now() - metric.start
      console.log(`⏱️ ${name}: ${metric.duration.toFixed(2)}ms`)
      return metric.duration
    }
    console.warn(`No measurement started for: ${name}`)
    return undefined
  }

  public mark(name: string): void {
    if (!this.enabled) return
    this.marks[name] = performance.now()
    console.log(`🔖 Marked: ${name}`)
  }

  public measure(from: string, to: string, label?: string): number | undefined {
    if (!this.enabled) return
    const fromMark = this.marks[from]
    const toMark = this.marks[to]

    if (fromMark && toMark) {
      const duration = toMark - fromMark
      const measureName = label || `${from} to ${to}`
      console.log(`📏 ${measureName}: ${duration.toFixed(2)}ms`)
      return duration
    }

    console.warn(`Cannot measure: missing marks for ${from} and/or ${to}`)
    return undefined
  }

  public getMetrics(): Record<string, number | undefined> {
    return Object.entries(this.metrics).reduce(
      (acc, [key, value]) => {
        acc[key] = value.duration
        return acc
      },
      {} as Record<string, number | undefined>,
    )
  }

  public clearMetrics(): void {
    this.metrics = {}
    this.marks = {}
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
