import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Check } from 'lucide-react'
import Boby, { BobyMark } from '../components/Boby'
import { indicators, roster, TRAP, verifyQuote } from '../lib/data'
import { prefersReduced, watchInView } from '../lib/motion'
import { COLOR } from './ClassMap'

/**
 * Scrollytelling: follow one student's sentence from a routine task to the lecturer's decision, then pull back to the whole class.
 * Scroll mode (desktop): the stage sticks while seven steps scroll past, and the scene timeline is scrubbed by scroll (ScrollTrigger).
 * Auto mode (phones and tablets, reduced motion, or an embedded frame that never scrolls itself): the same scenes, stepped by clicks and a slow autoplay.
 */
const STEPS = [
  { t: 'Semua berawal dari tugas biasa.', b: 'Mahasiswa mengerjakan tugas praktik seperti biasa. Jawaban akhirnya benar, dan di titik ini kebanyakan asesmen berhenti.' },
  { t: 'Lalu Boby bertanya, dan sengaja keliru.', b: 'Boby, murid AI, meminta penjelasan. Di tengah percakapan ia menyisipkan pernyataan yang salah, dengan sangat yakin.' },
  { t: 'Mahasiswa harus membetulkannya.', b: 'Setuju berarti miskonsepsinya ikut terbawa. Menolak dengan alasan yang tepat berarti paham. Boby menanggapi kalimat yang baru saja ditulis, jadi jawaban salinan tidak banyak menolong.' },
  { t: 'Kalimatnya menjadi bukti.', b: 'Analis AI mengusulkan status indikator dan mengutip kalimat mahasiswa sendiri sebagai dasarnya.' },
  { t: 'Aturan memeriksa kutipannya.', b: 'Kutipan dicocokkan dengan transkrip asli. Jika tidak ditemukan, temuan ditandai ambigu dan tidak dihitung ke skor.' },
  { t: 'Dosen yang memutuskan.', b: 'Dosen menerima, mengoreksi, atau menolak. Sebelum itu, skor selalu berlabel sementara.' },
  { t: 'Satu kalimat, satu petak. Satu kelas, satu peta.', b: 'Ulangi untuk 35 mahasiswa, dan dosen melihat konsep mana yang bolong sebelum ujian, bukan sesudahnya.' },
]
const N = STEPS.length
const W = 640, H = 520
const REPLY = 'Tidak setuju. Di stack, yang terakhir masuk justru keluar duluan.'
const QUOTE = 'Di stack, yang terakhir masuk justru keluar duluan.'
const LINES = [
  ['Boby', 'Aku lihat 7 keluar duluan, padahal 3 masuk lebih dulu. Kenapa?'],
  ['Mhs', 'Karena pop mengambil elemen yang paling atas.'],
  ['Boby', TRAP],
  ['Mhs', REPLY],
]
console.assert(verifyQuote(QUOTE, LINES.map((l) => l[1]).join('\n')), 'the story quote must really be in its transcript')
const ME = roster.findIndex((r) => r.arche === 'kuat')
const meRow = Math.floor(ME / 7), meCol = ME % 7
// Desk grid geometry on the 640×520 stage: 7 desks of 64px with 12px gaps, rows 80px apart, from (60, 64).
const deskCX = 60 + meCol * 76 + 32, deskCY = 64 + meRow * 80 + 32

export default function Story() {
  const sec = useRef<HTMLElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const steps = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [mode, setMode] = useState<'scroll' | 'auto'>('scroll')
  const [active, setActive] = useState(0)
  const [scale, setScale] = useState(1)
  const touched = useRef(false)
  const [seen, setSeen] = useState(false)

  // The stage is drawn at 640×520 and scaled to its column, so every scene keeps its composition at any width.
  useLayoutEffect(() => {
    const el = fit.current!
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1.05, e.contentRect.width / W)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Scroll mode only where the page really scrolls itself; an auto-height embed never does.
  useEffect(() => {
    // Phones and tablets get the stepper: a sticky stage would cover the text passing under it on a narrow screen.
    const decide = () => setMode(!prefersReduced() && matchMedia('(min-width: 1024px)').matches && document.documentElement.scrollHeight - innerHeight > 600 ? 'scroll' : 'auto')
    decide()
    const t = setTimeout(decide, 900)
    addEventListener('resize', decide)
    return () => { clearTimeout(t); removeEventListener('resize', decide) }
  }, [])

  useGSAP(() => {
    const q = gsap.utils.selector(sec)
    const v = (k: string) => q(`[data-v="${k}"]`)
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut', duration: 0.5 } })
    tl.set(q('[data-v]'), { autoAlpha: 0 }, 0)
      .set([v('practice'), v('bar'), v('terima'), v('temp')], { autoAlpha: 1 }, 0)
      .fromTo(v('bar'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: N }, 0)
    // 1 · Boby arrives with a confident mistake
    tl.to(v('practice'), { scale: 0.6, x: -150, y: -46, autoAlpha: 0.35 }, 1)
      .fromTo(v('boby'), { autoAlpha: 0, y: 110, rotation: 12 }, { autoAlpha: 1, y: 0, rotation: 0, ease: 'power3.out' }, 1)
      .fromTo(v('trap'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0 }, 1.1)
      .fromTo(v('tag'), { autoAlpha: 0, scale: 0.5, rotation: 0 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.3, ease: 'back.out(2.4)' }, 1.45)
    // 2 · the student corrects him
    tl.to(v('practice'), { autoAlpha: 0, duration: 0.3 }, 2)
      .to(v('trap'), { y: -78, duration: 0.5 }, 2)
      .fromTo(v('reply'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0 }, 2.1)
      .fromTo(v('rmark'), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.35 }, 2.55)
    // 3 · that sentence lifts out and lands in the lecturer's finding
    tl.fromTo(v('chip'), { autoAlpha: 0, x: 0, y: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.15 }, 3)
      .to([...v('trap'), ...v('reply'), ...v('boby')], { autoAlpha: 0, y: '+=44', duration: 0.35 }, 3.05)
      .to(v('chip'), { x: -128, y: -262, duration: 0.42, ease: 'power3.inOut' }, 3.12)
      .fromTo(v('finding'), { autoAlpha: 0, y: -22 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 3.15)
      .fromTo(v('slot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 3.52)
      .to(v('chip'), { autoAlpha: 0, duration: 0.08 }, 3.54)
      .fromTo(v('fmark'), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.3 }, 3.6)
    // 4 · the rule scans the transcript for that exact sentence
    tl.fromTo(v('transcript'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 4)
      .fromTo(v('scan'), { autoAlpha: 1, y: 0 }, { y: 114, ease: 'none', duration: 0.4 }, 4.25)
      .to(v('scan'), { autoAlpha: 0, duration: 0.05 }, 4.66)
      .fromTo(v('match'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 4.6)
      .fromTo(v('verify'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 4.66)
      .fromTo(v('pill'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 4.72)
    // 5 · the lecturer decides
    tl.fromTo(v('terima'), { backgroundColor: '#F1EAF6', color: '#1E1C27' }, { backgroundColor: '#2A272D', color: '#FEF8F5', duration: 0.15 }, 5.1)
      .to(v('pill'), { autoAlpha: 0, duration: 0.1 }, 5.2)
      .fromTo([...v('pill2'), ...v('final')], { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.08 }, 5.25)
      .to(v('temp'), { autoAlpha: 0, duration: 0.1 }, 5.25)
    // 6 · pull back: the finding shrinks into one desk, and the whole class appears around it
    tl.to(v('transcript'), { autoAlpha: 0, y: 44, duration: 0.3 }, 6)
      .to(v('finding'), { scale: 64 / 500, transformOrigin: `${deskCX - 70}px ${deskCY - 36}px`, duration: 0.55, ease: 'power3.inOut' }, 6.05)
      .to(v('finding'), { autoAlpha: 0, duration: 0.08 }, 6.55)
      .set(v('grid'), { autoAlpha: 1 }, 6.3)
      .fromTo(q('[data-desk]'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)', stagger: { grid: [5, 7], from: ME, amount: 0.32 } }, 6.35)
      .fromTo(v('gridcap'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 6.75)
    tl.set({}, {}, N)
    tlRef.current = tl

    if (mode === 'scroll') {
      const stepH = () => (steps.current?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0
      ScrollTrigger.create({
        // Shifted a quarter step early, so each scene has finished forming by the time its text reaches the reading line.
        trigger: steps.current,
        start: () => `top+=${-0.25 * stepH()} 55%`,
        end: () => `bottom+=${-0.25 * stepH()} 55%`,
        scrub: 0.7, animation: tl,
        onUpdate: (self) => setActive(Math.min(N - 1, Math.max(0, Math.floor(self.progress * N - 0.25)))),
      })
    } else {
      tl.seek(0.75)
    }
  }, { scope: sec, dependencies: [mode], revertOnUpdate: true })

  // Auto mode: tween to the chosen scene (instant for reduced motion), and step on slowly while in view.
  useEffect(() => {
    if (mode !== 'auto' || !tlRef.current) return
    const at = active + 0.75
    if (prefersReduced()) tlRef.current.seek(at)
    else tlRef.current.tweenTo(at, { duration: Math.min(1.4, 0.5 + Math.abs(tlRef.current.time() - at) * 0.25), ease: 'power2.inOut' })
  }, [active, mode])
  useEffect(() => watchInView(sec.current, setSeen, 0.3), [])
  useEffect(() => {
    if (mode !== 'auto' || !seen || touched.current || prefersReduced()) return
    const t = setTimeout(() => setActive((a) => (a + 1) % N), 3400)
    return () => clearTimeout(t)
  }, [mode, seen, active])

  const go = (i: number) => {
    touched.current = true
    if (mode === 'scroll') steps.current?.children[i]?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'center' })
    else setActive(i)
  }
  const scroll = mode === 'scroll'
  const panelH = H * scale + 112

  return (
    <section ref={sec} id="cara-kerja" aria-labelledby="cerita-h" className="px-[var(--m)] py-[clamp(96px,11vw,170px)]">
      <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 items-end">
        <h2 id="cerita-h" data-r className="lg:col-span-6 font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.6vw,72px)]">Ikuti satu kalimat.</h2>
        <p data-r className="lg:col-span-5 lg:col-start-8 text-[18px] leading-[1.55] max-w-[32rem]">Dari jawaban seorang mahasiswa sampai keputusan dosen, lalu ke seluruh kelas. {scroll ? 'Gulir pelan-pelan.' : 'Pilih langkahnya, atau biarkan berjalan sendiri.'}</p>
      </div>

      <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-10">
        {/* steps */}
        <div ref={steps} data-steps className={`min-w-0 lg:col-span-5 order-2 lg:order-1 ${scroll ? '' : 'mt-6 lg:mt-0 flex flex-col gap-1'}`}>
          {STEPS.map((s, i) => (
            <div key={s.t} className={scroll ? 'min-h-[clamp(340px,54svh,540px)] flex items-center' : ''}>
              <button onClick={() => go(i)} aria-current={active === i ? 'step' : undefined}
                className={`text-left w-full transition-[opacity,background-color] duration-[350ms] ease-[var(--ease-smooth-out)] ${scroll ? `py-6 ${active === i ? 'opacity-100' : 'opacity-30 hover:opacity-60'}` : `rounded-[18px_5px_18px_18px] p-4 sm:p-5 ${active === i ? 'bg-white' : 'opacity-60 hover:opacity-100'}`}`}>
                <span className={`block font-bold tracking-[-0.025em] leading-[1.1] ${scroll ? 'text-[clamp(26px,2.4vw,36px)]' : 'text-[20px]'}`}>{s.t}</span>
                <span className={`block mt-3 text-[17px] leading-[1.55] text-[#4E4B5E] max-w-[30rem] ${scroll || active === i ? '' : 'hidden'}`}>{s.b}</span>
              </button>
            </div>
          ))}
        </div>

        {/* stage */}
        <div className="lg:col-span-7 order-1 lg:order-2 min-w-0">
          <div className={scroll ? 'lg:sticky' : ''} style={scroll ? { top: `max(88px, calc(50vh - ${Math.round(panelH / 2)}px))` } : undefined}>
            <div className="bg-lavender drop-lg px-4 sm:px-8 pt-5 sm:pt-6 pb-5">
              <div className="flex items-baseline justify-between gap-4 text-[14px]">
                <p key={active} className="t-swap font-semibold truncate" aria-live={scroll ? 'off' : 'polite'}><span className="text-plum">Langkah {active + 1} dari {N}</span> · {STEPS[active].t}</p>
              </div>
              <div ref={fit} className="relative mt-4 w-full overflow-hidden" style={{ height: H * scale }}>
                <div className="absolute left-1/2 top-0 origin-top" style={{ width: W, height: H, transform: `translateX(-50%) scale(${scale})` }} aria-hidden="true">
                  <Stage />
                </div>
              </div>
              <div className="mt-4 h-[3px] rounded-full bg-[rgba(30,28,39,.1)] overflow-hidden"><div data-v="bar" className="h-full bg-ink origin-left" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The seven scenes share one 640×520 stage; every piece is placed once and moved by the timeline. */
function Stage() {
  return (
    <div className="relative w-full h-full text-ink">
      {/* 0 · practice */}
      <div data-v="practice" className="absolute left-[120px] top-[60px] w-[400px] bg-white drop p-5">
        <div className="flex items-center justify-between"><p className="text-[14px] font-semibold">Tugas praktik · Operasi Stack</p><span className="pill pill-ok">Benar</span></div>
        <pre className="mt-3 font-mono text-[13px] leading-[1.65] bg-ink text-[#EDE7F6] rounded-lg p-4">{'stack.append(3)\nstack.append(7)\nstack.pop()      # 7 keluar\nstack.append(5)\nprint(stack)     # [3, 5]'}</pre>
        <p className="mt-3 text-[14px] text-[#4E4B5E]">Jawaban akhir: <b className="text-ink">[3, 5]</b></p>
      </div>

      {/* 1 · Boby and his trap */}
      <div data-v="boby" className="absolute left-[408px] top-[236px] w-[260px]"><Boby title="" className="w-full h-auto" /></div>
      <div data-v="trap" className="absolute left-[30px] top-[150px] w-[372px] bg-white bubble-right p-5">
        <p className="text-[13px] font-semibold text-plum mb-1.5 flex items-center gap-2"><BobyMark className="w-4 h-4" /> Boby</p>
        <p className="text-[18px] leading-snug">{TRAP}</p>
        <span data-v="tag" className="absolute -top-3 right-5 bg-charcoal text-ivory text-[13px] font-semibold px-2.5 py-1 drop-sm">Sengaja keliru</span>
      </div>

      {/* 2 · the student's reply; its second sentence is the evidence */}
      <div data-v="reply" className="absolute left-[150px] top-[318px] w-[350px] bg-charcoal text-ivory bubble-right p-5">
        <p className="text-[13px] font-semibold text-[#CDBBF0] mb-1.5">Mahasiswa · Tidak setuju</p>
        <p className="text-[17px] leading-snug">Tidak setuju. <span className="relative"><span data-v="rmark" className="absolute inset-x-0 bottom-0 h-[42%] bg-[#6A39BF] origin-left" /><span className="relative">{QUOTE}</span></span></p>
      </div>
      <span data-v="chip" className="absolute left-[220px] top-[384px] whitespace-nowrap rounded-md bg-ok-bg text-plum text-[15px] font-semibold px-2 py-1">“{QUOTE}”</span>

      {/* 3–5 · the lecturer's finding */}
      <div data-v="finding" className="absolute left-[70px] top-[36px] w-[500px] h-[252px] bg-white drop p-[22px]">
        <div className="flex items-center justify-between gap-3 h-7">
          <p className="text-[13px] font-semibold text-muted">Yang dilihat dosen</p>
          <span className="relative h-7 w-[170px]">
            <span data-v="pill" className="absolute right-0 pill pill-ok">Usulan AI: terpenuhi</span>
            <span data-v="pill2" className="absolute right-0 pill pill-ink">Diterima dosen</span>
          </span>
        </div>
        <p className="mt-1.5 font-semibold text-[16px]">{indicators[2].name}</p>
        <p data-v="slot" className="mt-2.5 text-[15px] leading-snug">“<span className="relative"><span data-v="fmark" className="absolute inset-x-0 bottom-0 h-[45%] bg-ok-bg origin-left" /><span className="relative">{QUOTE}</span></span>”</p>
        <p data-v="verify" className="mt-2 text-[13px] text-plum font-semibold flex items-center gap-1.5"><Check size={14} strokeWidth={2.6} /> Kutipan ditemukan di transkrip</p>
        <div className="absolute left-[22px] right-[22px] bottom-[20px] flex items-center gap-2">
          <span data-v="terima" className="btn btn-sm btn-secondary">Terima</span><span className="btn btn-sm btn-secondary">Koreksi</span><span className="btn btn-sm btn-secondary">Tolak</span>
          <span className="ml-auto relative text-[14px] text-muted tnum w-[140px] text-right h-5">
            <span data-v="temp" className="absolute right-0">Skor {roster[ME].score} · sementara</span>
            <span data-v="final" className="absolute right-0 text-ink font-semibold">Skor {roster[ME].score} · final</span>
          </span>
        </div>
      </div>

      {/* 4 · the transcript the rule checks */}
      <div data-v="transcript" className="absolute left-[70px] top-[306px] w-[500px] bg-white drop p-[22px]">
        <p className="text-[13px] font-semibold text-muted mb-2">Transkrip</p>
        <div className="relative flex flex-col gap-1">
          <span data-v="scan" className="absolute left-0 right-0 top-0 h-[3px] rounded-full bg-accent" />
          {LINES.map(([who, t], i) => (
            <p key={i} className="relative text-[13px] leading-snug truncate px-1.5 py-[5px] rounded">
              {i === LINES.length - 1 && <span data-v="match" className="absolute inset-0 rounded bg-ok-bg" />}
              <span className="relative"><b className="font-semibold">{who}:</b> {t}</span>
            </p>
          ))}
        </div>
      </div>

      {/* 6 · the whole class */}
      <div data-v="grid" className="absolute inset-0">
        <div className="absolute left-[60px] top-[64px] w-[520px] grid grid-cols-7 gap-x-[12px] gap-y-[16px]">
          {roster.map((r, i) => (
            <span key={r.id} data-desk className={`seat w-[64px] h-[64px] ${i === ME ? 'outline-2 outline-offset-2 outline-ink' : ''}`}>
              {indicators.map((ind) => <span key={ind.id} style={{ background: r.ev ? COLOR[r.statuses[ind.id]] : COLOR.kosong }} />)}
            </span>
          ))}
        </div>
        <p data-v="gridcap" className="absolute left-0 right-0 top-[470px] text-center text-[15px] font-semibold">35 mahasiswa · 4 indikator · satu peta kelas</p>
      </div>
    </div>
  )
}
