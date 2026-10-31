import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { STATUS_LABEL, STATUS_PILL, type Status } from '../lib/data'
import { useStore } from '../lib/store'

export function StatusPill({ status, children }: { status: Status; children?: ReactNode }) {
  return <span className={`pill ${STATUS_PILL[status]}`}>{children ?? STATUS_LABEL[status]}</span>
}

/** Initial disc with a stable pale tint per person (identity, not data). */
export function Avatar({ name, seed, size = 32 }: { name: string; seed: number; size?: number }) {
  const h = (seed * 137 + 280) % 360
  const ini = name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return (
    <span aria-hidden="true" className="inline-grid place-content-center rounded-full font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${h} 70% 93%)`, color: `hsl(${h} 42% 30%)` }}>
      {ini}
    </span>
  )
}

/** transitions.dev 16: tabs sliding. Pill position written without transition on first paint and resize. */
export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  const bar = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const first = useRef(true)
  const place = (instant: boolean) => {
    const b = bar.current, p = pill.current
    const el = b?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!b || !p || !el) return
    if (instant) p.style.transition = 'none'
    p.style.width = el.offsetWidth + 'px'
    p.style.transform = `translateX(${el.offsetLeft}px)`
    if (instant) { void p.offsetWidth; p.style.transition = '' }
  }
  useLayoutEffect(() => { place(first.current); first.current = false }, [value])
  useEffect(() => {
    const on = () => place(true)
    addEventListener('resize', on)
    document.fonts?.ready.then(on)
    return () => removeEventListener('resize', on)
  }, [])
  return (
    <div ref={bar} className="t-tabs max-w-full overflow-x-auto" role="tablist" aria-label={label}>
      <span ref={pill} className="t-tabs-pill" aria-hidden="true" />
      {tabs.map((t) => (
        <button key={t.id} role="tab" className="t-tab" aria-selected={t.id === value} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  )
}

/** transitions.dev 10: success check. */
export function SuccessCheck({ size = 56 }: { size?: number }) {
  const [state, setState] = useState<'idle' | 'in'>('idle')
  useEffect(() => { const r = requestAnimationFrame(() => setState('in')); return () => cancelAnimationFrame(r) }, [])
  return (
    <span className="t-success-check" data-state={state} style={{ width: size, height: size }}>
      <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
        <circle cx="28" cy="28" r="28" fill="#1E1C27" />
        <path d="M18 29 L25 36 L38 21" fill="none" stroke="#FEF8F5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** transitions.dev 28: thinking states — a shimmering status line that swaps on a hold. */
export function Thinking({ lines, hold = 1400, onDone }: { lines: string[]; hold?: number; onDone?: () => void }) {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<'' | 'is-exit' | 'is-enter-start'>('')
  useEffect(() => {
    if (i >= lines.length - 1) { const t = setTimeout(() => onDone?.(), hold); return () => clearTimeout(t) }
    const t = setTimeout(() => {
      setPhase('is-exit')
      setTimeout(() => { setI((n) => n + 1); setPhase('is-enter-start'); requestAnimationFrame(() => requestAnimationFrame(() => setPhase(''))) }, 200)
    }, hold)
    return () => clearTimeout(t)
  }, [i]) // eslint-disable-line
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), '')
  return (
    <span className="t-think" aria-live="polite">
      <span className="t-think-sizer">{longest}</span>
      <span className={`t-think-text ${phase}`} data-text={lines[i]}>{lines[i]}</span>
    </span>
  )
}

/** transitions.dev 22: one toast host, fed by store.toast */
export function ToastHost() {
  const { toast } = useStore()
  const [text, setText] = useState('')
  useEffect(() => { if (toast) setText(toast) }, [toast])
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-md" aria-live="polite">
      <div className={`t-toast ${toast ? 'is-open' : ''} drop bg-charcoal text-ivory px-5 py-3.5 text-[15px] font-medium shadow-[0_12px_32px_rgba(30,28,39,.22)]` /* taste-skill-ignore: toast overlay */}>
        {text}
      </div>
    </div>
  )
}

/** transitions.dev 05: origin-aware dropdown with an asymmetric close. */
export function useDropdown() {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)   // set a frame after mount so the open transition runs
  const [closing, setClosing] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const close = () => { if (!open) return; setOpen(false); setClosing(true); setTimeout(() => setClosing(false), 150) }
  useEffect(() => {
    if (!open) { setEntered(false); return }
    let r2 = 0
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setEntered(true)) })
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2) }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) close() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    addEventListener('pointerdown', onDown); addEventListener('keydown', onKey)
    return () => { removeEventListener('pointerdown', onDown); removeEventListener('keydown', onKey) }
  })
  return { open, mounted: open || closing, root, toggle: () => (open ? close() : setOpen(true)), close, cls: `t-dropdown ${open && entered ? 'is-open' : ''} ${closing ? 'is-closing' : ''}` }
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="h-1.5 rounded-full bg-line overflow-hidden" role="progressbar" aria-label={label} aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-accent rounded-full" style={{ width: `${value * 100}%`, transition: 'width 400ms var(--ease-smooth-out)' }} />
    </div>
  )
}
