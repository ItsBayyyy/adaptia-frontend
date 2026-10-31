import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Boby, { BobyMark } from '../components/Boby'
import { useDropdown } from '../components/ui'
import { Link, scrollToId } from '../lib/router'
import { prefersReduced } from '../lib/motion'
import { TRAP } from './Fragments'

const LINKS = [
  { id: 'masalah', label: 'Masalah' },
  { id: 'cara-kerja', label: 'Cara kerja' },
  { id: 'coba', label: 'Coba' },
  { id: 'peta', label: 'Peta kelas' },
  { id: 'pertanyaan', label: 'Pertanyaan' },
]

export function Nav() {
  const dd = useDropdown()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(scrollY > 24)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-colors duration-[250ms] ${solid ? 'bg-ivory' : 'bg-transparent'}`}>
      <div className="h-16 sm:h-[72px] px-[var(--m)] flex items-center gap-6">
        <a href="#/" onClick={(e) => { e.preventDefault(); scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }) }} className="flex items-center gap-2.5 group" aria-label="ADAPTIA, ke atas">
          <BobyMark className="w-7 h-7 transition-transform duration-[250ms] group-hover:-rotate-6" />
          <span className="font-bold tracking-[-0.02em] text-[19px]">ADAPTIA</span>
        </a>
        <nav aria-label="Bagian halaman" className="hidden md:flex items-center gap-1 ml-auto">
          {LINKS.map((l) => (
            <a key={l.id} href="#/" onClick={(e) => { e.preventDefault(); scrollToId(l.id) }} className="px-3 h-10 inline-flex items-center rounded-lg text-[15px] font-medium text-[#4E4B5E] hover:text-ink hover:bg-[rgba(30,28,39,.05)] transition-colors duration-150">{l.label}</a>
          ))}
        </nav>
        <div ref={dd.root} className="relative ml-auto md:ml-2">
          <button className="btn btn-primary btn-sm" aria-haspopup="menu" aria-expanded={dd.open} onClick={dd.toggle}>
            Masuk <ChevronDown size={15} className={`transition-transform duration-[250ms] ${dd.open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {dd.mounted && (
          <div role="menu" className={`${dd.cls} absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl p-1.5 shadow-[0_16px_40px_rgba(30,28,39,.16)]` /* taste-skill-ignore: menu overlay */} data-origin="top-right">
            <Link to="/mahasiswa" role="menuitem" className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-mist transition-colors" onClick={dd.close}>
              <span className="font-semibold text-[15px]">Ruang mahasiswa</span><span className="text-[13px] text-muted">Kerjakan sesi dan kegiatan penguatan</span>
            </Link>
            <Link to="/dosen" role="menuitem" className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-mist transition-colors" onClick={dd.close}>
              <span className="font-semibold text-[15px]">Ruang dosen</span><span className="text-[13px] text-muted">Tinjau bukti dan tentukan pendampingan</span>
            </Link>
          </div>
          )}
        </div>
      </div>
    </header>
  )
}

type Choice = 'Setuju' | 'Tidak setuju'

/**
 * The first screen is one moment, not a feature list: Boby states something wrong with confidence and waits for you.
 * Boby reacts while you hover an answer; choosing one takes you to the live demo with that choice made.
 */
export default function Hero({ onAnswer }: { onAnswer: (c: Choice) => void }) {
  const root = useRef<HTMLElement>(null)
  const mood = useRef<gsap.core.Tween | null>(null)
  const react = (c: Choice | null) => {
    if (prefersReduced()) return
    mood.current?.kill()
    const to = c === 'Setuju' ? { rotation: 5, y: -18, scale: 1.03 } : c === 'Tidak setuju' ? { rotation: -8, y: 6, scale: 0.98 } : { rotation: 0, y: 0, scale: 1 }
    mood.current = gsap.to(root.current!.querySelector('[data-mood]'), { ...to, duration: 0.6, ease: c ? 'back.out(2)' : 'power3.out' })
  }

  // Scroll-linked: Boby sinks behind the trap strip and leans away as the first screen leaves (only where the page itself scrolls).
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
      gsap.to('[data-hero="drift"]', { yPercent: 14, rotation: -4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      gsap.to('[data-hero="text"]', { yPercent: -10, autoAlpha: 0.3, ease: 'none', scrollTrigger: { trigger: root.current, start: '30% top', end: 'bottom top', scrub: 0.6 } })
    })
  }, { scope: root })

  return (
    <section ref={root} id="atas" aria-labelledby="hero-h" className="relative overflow-hidden pt-[108px] sm:pt-[136px] lg:pt-[128px] pb-14 lg:pb-0 lg:min-h-[780px]">
      <div data-hero="text" className="relative z-20">
        <h1 id="hero-h" className="px-[var(--m)] font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(37px,6.9vw,104px)]">
          <span className="block overflow-hidden pb-[0.08em]"><span className="block" data-line>Jawaban bisa disalin.</span></span>
          <span className="block overflow-hidden pb-[0.08em]"><span className="block" data-line>Pemahaman <span className="text-plum">tidak.</span></span></span>
        </h1>
      </div>
      <div className="px-[var(--m)] mt-8 sm:mt-10 lg:mt-10 grid lg:grid-cols-12 gap-x-8 gap-y-6 items-start">
        <div className="lg:col-span-5 relative z-20">
          <p data-hero="lede" className="text-[18px] sm:text-[20px] leading-[1.5] max-w-[29rem]">
            ADAPTIA meminta mahasiswa mengajari Boby, murid AI yang sengaja keliru. Cara mereka membetulkan Boby menjadi bukti pemahaman yang bisa dibaca dosen, kalimat demi kalimat.
          </p>
          <div data-hero="cta" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button className="btn btn-primary h-[52px] px-6 text-[16px]" onClick={() => scrollToId('cara-kerja')}>Lihat cara kerjanya <ArrowRight size={17} aria-hidden="true" /></button>
            <Link to="/dosen" className="link-arrow text-[16px]">Masuk ruang dosen <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <p data-hero="meta" className="mt-8 text-[14px] text-[#56536A]">Asesmen formatif untuk kelas kampus. Uji coba pertama: Stack &amp; Queue dan Peluang.</p>
        </div>

        <div className="lg:col-span-7 relative pt-[176px] sm:pt-[220px] lg:pt-0 lg:min-h-[420px]">
          {/* Boby at his largest, face fully in view; the bubble sits at his left, never over his eyes */}
          <div aria-hidden="true" className="absolute z-0 right-[-8vw] top-0 w-[58vw] max-w-[300px] sm:max-w-[360px] lg:max-w-none lg:right-auto lg:left-[33%] lg:top-[-150px] lg:w-[min(540px,42vw)]">
            <div data-hero="drift"><div data-hero="boby"><div data-mood><div className="boby-float"><Boby look title="" className="w-full h-auto" /></div></div></div></div>
          </div>
          <div data-hero="bubble" className="relative z-10 w-full max-w-[400px] lg:w-[min(380px,34vw)] lg:mt-10 bubble-right bg-white p-5 sm:p-6">
            <p className="text-[13px] font-semibold text-plum mb-2 flex items-center gap-2"><BobyMark className="w-4 h-4" /> Boby · baru belajar stack</p>
            <p className="text-[19px] leading-snug font-medium">{TRAP}</p>
            <div className="mt-5 grid grid-cols-2 gap-2" onMouseLeave={() => react(null)}>
              {(['Setuju', 'Tidak setuju'] as Choice[]).map((c) => (
                <button key={c} className="btn btn-secondary" onMouseEnter={() => react(c)} onFocus={() => react(c)} onBlur={() => react(null)} onClick={() => onAnswer(c)}>{c}</button>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-muted">Pilih satu, lalu jelaskan alasannya ke Boby.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const TRAPS: [string, string][] = [
  ['Stack & Queue', 'Stack itu seperti antrean kantin: yang datang duluan, dilayani duluan.'],
  ['Peluang', 'Koin sudah lima kali angka, jadi lemparan berikutnya pasti gambar.'],
  ['Stack & Queue', 'Fitur Undo paling cocok memakai queue.'],
  ['Peluang', 'Peluang 0,5 artinya kejadian itu pasti muncul sekali tiap dua percobaan.'],
  ['Stack & Queue', 'Queue mengeluarkan elemen yang terakhir masuk.'],
  ['Peluang', 'P(A atau B) selalu sama dengan P(A) + P(B).'],
]

/** A running strip of the statements Boby is built to get wrong. Pauses on hover; static and scrollable for reduced motion. */
export function TrapStrip() {
  const items = (hidden: boolean) => TRAPS.map(([topic, t], i) => (
    <li key={(hidden ? 'h' : 'v') + i} aria-hidden={hidden || undefined} className="flex items-center gap-3 whitespace-nowrap text-[16px]">
      <span className="pill !h-6 bg-[#3B3542] text-[#D9C9F7]">{topic}</span>
      <span>“{t}”</span>
      <span className="text-[#FBC9BB] font-semibold">keliru</span>
    </li>
  ))
  return (
    <section aria-label="Contoh pernyataan jebakan Boby" className="bg-charcoal text-ivory">
      <div className="flex items-center h-[68px]">
        <p className="shrink-0 h-full flex items-center pl-[var(--m)] pr-5 font-semibold text-[14px] text-[#D9C9F7] bg-charcoal relative z-10">Bank jebakan Boby</p>
        <div className="marquee flex-1 min-w-0 h-full flex items-center">
          <ul className="marquee-track flex w-max gap-12 pr-12">{items(false)}{items(true)}</ul>
        </div>
      </div>
    </section>
  )
}
