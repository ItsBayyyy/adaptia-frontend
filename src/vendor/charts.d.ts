export {}
declare global {
  interface Window {
    Charts: {
      line: (el: Element, o: Record<string, unknown>) => { legend?: Element }
      bars: (el: Element, o: Record<string, unknown>) => void
      barList: (el: Element, rows: { label: string; value: number }[], o?: Record<string, unknown>) => void
      ring: (el: Element, o: Record<string, unknown>) => void
      bullet: (el: Element, rows: { label: string; value: number; target: number }[], o?: Record<string, unknown>) => void
      fmt: Record<string, (...a: never[]) => unknown> & { int: (v: number) => string; pct: (d?: number) => (v: number) => string }
    }
  }
}
