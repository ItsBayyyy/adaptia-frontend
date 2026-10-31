import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

/** `prep` is a control the tour clicks first, so a step can point at something behind a tab or a toggle. */
export type TourStep = { sel: string; title: string; body: string; prep?: string }

const PAD = 10
const R = 14
/** A rounded rectangle, written so every step produces the same command sequence and the browser can tween between them. */
const roundRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`

const canCut = () => typeof CSS !== 'undefined' && CSS.supports?.('clip-path', 'path("M0,0 Z")')
const BLUR = 'blur(5px) saturate(0.92)'

/**
 * The guided spotlight. One fixed sheet blurs and dims the whole screen, and a hole cut out of it with
 * `clip-path` leaves exactly one feature sharp while a card explains it.
 *
 * Only the sheet's own clip-path and the ring's box move between steps, so nothing in the app behind it
 * is re-laid out. Where `clip-path: path()` is unavailable the sheet falls back to a light dim with no
 * hole, which still reads.
 */
export default function Tour({ steps, open, onClose }: { steps: TourStep[]; open: boolean; onClose: () => void }) {
  const [i, setI] = useState(0)
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const card = useRef<HTMLDivElement>(null)
  const step = steps[i]

  const measure = useCallback(() => {
    const el = document.querySelector(steps[i]?.sel ?? '')
    if (!el) return setBox(null)
    const r = el.getBoundingClientRect()
    setBox({
      x: Math.max(6, r.left - PAD),
      y: Math.max(6, r.top - PAD),
      w: Math.min(innerWidth - 12, r.width + PAD * 2),
      h: Math.min(innerHeight - 12, r.height + PAD * 2),
    })
  }, [i, steps])

  // Bring the step's feature into view, then measure it — and keep measuring while the page moves.
  useEffect(() => {
    if (!open) return
    const step = steps[i]
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    // Open whatever hides this step's feature first; the element only exists after that render.
    if (step?.prep && !document.querySelector(step.sel)) document.querySelector<HTMLElement>(step.prep)?.click()
    const ts = [
      setTimeout(() => document.querySelector(step?.sel ?? '')?.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' }), step?.prep ? 90 : 0),
      setTimeout(measure, calm ? 90 : 520),
      setTimeout(measure, 950),
    ]
    addEventListener('resize', measure)
    addEventListener('scroll', measure, { passive: true })
    return () => { ts.forEach(clearTimeout); removeEventListener('resize', measure); removeEventListener('scroll', measure) }
  }, [open, i, measure, steps])

  useEffect(() => { if (open) setI(0) }, [open])
  useEffect(() => { if (open) card.current?.focus() }, [open, i])

  // Escape closes; Tab stays inside the card so the tour cannot be walked out of by keyboard.
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const f = card.current?.querySelectorAll<HTMLElement>('button')
      if (!f?.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    addEventListener('keydown', on)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', on); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open || !step) return null

  const cut = canCut()
  const clip = box && cut
    ? `path(evenodd, "M0,0 H${innerWidth} V${innerHeight} H0 Z ${roundRect(box.x, box.y, box.w, box.h, R)}")`
    : undefined

  // The card goes under the hole, or over it, and when a tall feature leaves room for neither it sits
  // at the foot of the screen so the top of what is highlighted stays readable.
  const CARD = 228
  const top = !box ? innerHeight / 2 - CARD / 2
    : innerHeight - (box.y + box.h) >= CARD + 18 ? box.y + box.h + 14
    : box.y >= CARD + 18 ? box.y - CARD - 14
    : innerHeight - CARD - 14
  const left = box ? Math.min(Math.max(14, box.x), Math.max(14, innerWidth - 374)) : innerWidth / 2 - 180

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <button className="tour-catch" aria-label="Tutup panduan" onClick={onClose} tabIndex={-1} />
      {/* the blur is set here, not in the stylesheet: the CSS minifier drops the unprefixed property */}
      <div className={`tour-sheet ${cut ? '' : 'tour-sheet-plain'}`}
        style={cut ? { clipPath: clip, backdropFilter: BLUR, WebkitBackdropFilter: BLUR } : undefined} />
      {box && <div className="tour-ring" style={{ top: box.y, left: box.x, width: box.w, height: box.h }} />}

      <div ref={card} className="tour-card" style={{ top, left }} tabIndex={-1}>
        <div className="tour-card-top">
          <span className="tour-count">Langkah {i + 1} dari {steps.length}</span>
          <button onClick={onClose} aria-label="Tutup panduan"><X size={17} /></button>
        </div>
        <h2 id="tour-title">{step.title}</h2>
        <p>{step.body}</p>
        <div className="tour-nav">
          <button className="tour-back" onClick={() => setI(i - 1)} disabled={i === 0}><ArrowLeft size={16} aria-hidden="true" /> Sebelumnya</button>
          {i === steps.length - 1
            ? <button className="tour-next" onClick={onClose}>Selesai</button>
            : <button className="tour-next" onClick={() => setI(i + 1)}>Berikutnya <ArrowRight size={16} aria-hidden="true" /></button>}
        </div>
      </div>
    </div>
  )
}
