/**
 * Scroll-free motion triggers.
 * The artifact viewer embeds the page in an iframe that may never scroll itself, so ScrollTrigger
 * would fire everything on load. IntersectionObserver with the implicit root measures against the
 * top-level viewport, so these fire when the visitor actually sees the element, in or out of an iframe.
 */
export const prefersReduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Calls `play` with every element that has just come into view, batched, once per element. */
export function revealBatch(items: Element[], play: (els: Element[]) => void, threshold = 0.12) {
  if (!items.length) return () => {}
  const io = new IntersectionObserver((entries) => {
    const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target)
    if (!hit.length) return
    hit.forEach((t) => io.unobserve(t))
    play(hit)
  }, { threshold })
  items.forEach((i) => io.observe(i))
  return () => io.disconnect()
}

/** Calls `cb` once, the first time `el` is in view. */
export function onceInView(el: Element | null, cb: () => void, threshold = 0.2) {
  if (!el) return () => {}
  return revealBatch([el], () => cb(), threshold)
}

/** Reports visibility changes (for loops that should pause off screen). */
export function watchInView(el: Element | null, cb: (visible: boolean) => void, threshold = 0.05) {
  if (!el) return () => {}
  const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold })
  io.observe(el)
  return () => io.disconnect()
}
