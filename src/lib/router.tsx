import { useEffect, useState, type AnchorHTMLAttributes } from 'react'

// Hash routing keeps the build a single static file. Paths are written as plain hash names
// ('/dosen/tinjauan/operasi-stack' ↔ '#dosen--tinjauan--operasi-stack') so links survive hosts that only pass plain #names.
export const toHash = (path: string) => (path === '/' ? '' : path.replace(/^\//, '').split('/').join('--'))
const fromHash = (h: string) => (!h ? '/' : h.startsWith('/') ? h : '/' + h.split('--').join('/'))
const read = () => fromHash(decodeURIComponent(location.hash.slice(1)))

export function useRoute() {
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => { setPath(read()); window.scrollTo({ top: 0 }) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return path
}

export const go = (to: string) => { location.hash = toHash(to) }

export function Link({ to, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={'#' + toHash(to)} {...rest} />
}

/** Scroll to a landing section without touching the hash route. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !!document.querySelector('.rm-paused')
  // A pinned element carries its end transform off-screen. Navigate to the
  // spacer's natural start so the story begins at step one, not step four.
  const target = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: reduce ? 'auto' : 'smooth' })
}
