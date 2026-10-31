import { useEffect, useRef } from 'react'

/**
 * Boby, the AI learner: a droplet whose one sharp point (top-right) is the motif of the whole system.
 * Flat two-tone, white pill eyes. `look` makes the pupils follow the pointer (off for reduced motion).
 */
export const BOBY_PATH = 'M160 8 C182 60 196 100 196 136 C196 186 154 216 100 216 C46 216 4 186 4 136 C4 74 60 30 160 8 Z'

export default function Boby({ className = '', look = false, title = 'Boby, murid AI' }: { className?: string; look?: boolean; title?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!look || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const svg = ref.current
    if (!svg) return
    const pupils = svg.querySelectorAll<SVGGElement>('[data-pupil]')
    let raf = 0
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect()
        const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.55
        const dx = e.clientX - cx, dy = e.clientY - cy
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 600)
        pupils.forEach((p) => p.setAttribute('transform', `translate(${((dx / d) * 5 * k).toFixed(2)} ${((dy / d) * 7 * k).toFixed(2)})`))
      })
    }
    addEventListener('pointermove', on)
    return () => { removeEventListener('pointermove', on); cancelAnimationFrame(raf) }
  }, [look])

  return (
    <svg ref={ref} viewBox="0 0 200 220" className={className} role="img" aria-label={title}>
      <path d={BOBY_PATH} fill="#A770FC" />
      <path d="M160 8 C182 60 196 100 196 136 C196 186 154 216 100 216 C142 204 170 172 172 130 C174 88 168 48 160 8 Z" fill="#9E61FD" />
      {[78, 124].map((x) => (
        <g key={x} className="boby-eye">
          <rect x={x - 11} y={102} width={22} height={40} rx={11} fill="#FFFFFF" />
          <g data-pupil="">
            <rect x={x - 6} y={114} width={12} height={20} rx={6} fill="#1E1C27" />
            <circle cx={x - 2} cy={119} r={2.4} fill="#FFFFFF" />
          </g>
        </g>
      ))}
    </svg>
  )
}

/** Small mark for the wordmark and avatars: the droplet alone. */
export function BobyMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <path d={BOBY_PATH} fill="#A770FC" />
      <rect x={67} y={102} width={22} height={40} rx={11} fill="#fff" />
      <rect x={113} y={102} width={22} height={40} rx={11} fill="#fff" />
    </svg>
  )
}
