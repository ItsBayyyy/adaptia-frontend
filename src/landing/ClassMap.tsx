import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import { indicators, roster, STATUS_LABEL, type Status } from '../lib/data'
import { Link } from '../lib/router'
import { onceInView, prefersReduced } from '../lib/motion'

export type Cell = Status | 'kosong'
export const COLOR: Record<Cell, string> = { terpenuhi: '#9E61FD', sebagian: '#7A6A9C', belum: '#FBC9BB', ambigu: '#FEF8F5', kosong: '#3B3542' }
const LEGEND: [Cell, string][] = [['terpenuhi', 'Terpenuhi'], ['sebagian', 'Sebagian'], ['belum', 'Belum'], ['ambigu', 'Ambigu, diperiksa manual'], ['kosong', 'Belum mengumpulkan']]
const SHORT: Record<string, string> = { i1: 'Urutan LIFO', i2: 'Push & pop', i3: 'Analogi antrean', i4: 'Kasus baru' }
const COLS = 7
const submitted = roster.filter((r) => r.ev)
const gapOf = (id: string) => submitted.filter((r) => r.statuses[id] === 'belum' || r.statuses[id] === 'sebagian').length
const weakest = [...indicators].sort((a, b) => gapOf(b.id) - gapOf(a.id))[0]
console.assert(roster.length === COLS * 5, 'the map seats 35 students in 5 rows of 7')

/** Peta Kelas: the seating plan of IF203 B. One desk per student, four cells per desk, one per rubric indicator. */
export default function ClassMap() {
  const sec = useRef<HTMLElement>(null)
  const [lit, setLit] = useState(false)
  const [filter, setFilter] = useState<string>('semua')
  const [sel, setSel] = useState(0)
  const touched = useRef(false)
  const [count, setCount] = useState(0)

  useGSAP(() => {
    const q = gsap.utils.selector(sec)
    const calm = prefersReduced()
    gsap.set(q('[data-seat]'), calm ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 0.55, y: 10 })
    return onceInView(q('[data-map]')[0], () => {
      gsap.to(q('[data-seat]'), { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: { grid: [5, COLS], from: 'start', amount: 0.7 } })
      setTimeout(() => setLit(true), 450)
      const n = { v: 0 }
      gsap.to(n, { v: gapOf(weakest.id), duration: 1.2, delay: 0.9, ease: 'power2.out', onUpdate: () => setCount(Math.round(n.v)) })
    }, 0.25)
  }, { scope: sec })

  // Once lit, the map walks through each indicator a single time to show what the filter does; any click stops it.
  useEffect(() => {
    if (!lit || prefersReduced()) return
    const order = ['i1', 'i2', 'i3', 'i4', 'semua']
    const ts = order.map((id, k) => setTimeout(() => { if (!touched.current) setFilter(id) }, 2200 + k * 1900))
    return () => ts.forEach(clearTimeout)
  }, [lit])

  const pickFilter = (id: string) => { touched.current = true; setFilter(id) }
  const pickSeat = (i: number) => { touched.current = true; setSel(i) }
  const s = roster[sel]
  const focusFinding = s.ev?.findings.find((f) => s.statuses[f.indicator] !== 'terpenuhi') ?? s.ev?.findings[0]
  const shownGap = filter === 'semua' ? null : gapOf(filter)

  return (
    <section ref={sec} id="peta" aria-labelledby="peta-h" className="bg-charcoal text-ivory px-[var(--m)] py-[clamp(96px,11vw,170px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 items-end">
        <h2 id="peta-h" data-r className="lg:col-span-7 font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.6vw,72px)] text-[#FBF4FF] max-w-[14ch]">Seluruh kelas, dalam satu peta.</h2>
        <p data-r className="lg:col-span-5 text-[18px] leading-[1.55] text-[#E2DCEC] max-w-[32rem]">Setiap meja adalah satu mahasiswa. Empat petaknya adalah empat indikator rubrik. Sebelum ujian, dosen sudah tahu konsep mana yang bolong dan siapa yang perlu didampingi lebih dulu.</p>
      </div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 items-start">
        <div className="lg:col-span-7 min-w-0">
          <div role="radiogroup" aria-label="Tampilkan indikator" className="flex flex-wrap gap-2">
            {[{ id: 'semua', label: 'Semua indikator' }, ...indicators.map((i) => ({ id: i.id, label: SHORT[i.id] }))].map((f) => (
              <button key={f.id} role="radio" aria-checked={filter === f.id} onClick={() => pickFilter(f.id)}
                className={`h-10 px-4 rounded-full text-[14.5px] font-semibold transition-colors duration-150 ${filter === f.id ? 'bg-ivory text-ink' : 'bg-[#3B3542] text-[#E2DCEC] hover:bg-[#4A4352]'}`}>{f.label}</button>
            ))}
          </div>
          <p className="mt-4 text-[15px] text-[#CFC6DC] min-h-[1.6em] tnum" aria-live="polite">
            {shownGap === null
              ? <>Paling lemah: <b className="text-ivory font-semibold">{weakest.name}</b>. <b className="text-[#FBC9BB] font-semibold">{count}</b> dari {submitted.length} mahasiswa belum atau baru sebagian.</>
              : <><b className="text-ivory font-semibold">{indicators.find((i) => i.id === filter)!.name}</b>: <b className="text-[#FBC9BB] font-semibold">{shownGap}</b> dari {submitted.length} belum atau baru sebagian.</>}
          </p>

          <div data-map className="mt-6 rounded-[28px_8px_28px_28px] bg-[#232027] p-4 sm:p-7">
            <p className="mx-auto mb-6 w-1/2 min-w-[180px] h-7 rounded-md bg-[#3B3542] grid place-content-center text-[12.5px] font-semibold text-[#BDB5CC]">Papan tulis</p>
            <ul className="grid grid-cols-7 gap-x-[clamp(6px,1.6vw,18px)] gap-y-[clamp(10px,1.8vw,20px)]">
              {roster.map((r, i) => {
                const d = (Math.floor(i / COLS) + (i % COLS)) * 35
                return (
                  <li key={r.id} data-seat>
                    <button onMouseEnter={() => pickSeat(i)} onFocus={() => pickSeat(i)} onClick={() => pickSeat(i)} aria-pressed={sel === i}
                      aria-label={`${r.name}: ${r.ev ? indicators.map((ind) => `${SHORT[ind.id]} ${STATUS_LABEL[r.statuses[ind.id]].toLowerCase()}`).join(', ') : 'belum mengumpulkan'}`}
                      className="group w-full flex flex-col items-center gap-1.5 outline-none">
                      <span className={`seat w-full aspect-square transition-transform duration-[250ms] ease-[var(--ease-smooth-out)] group-hover:-translate-y-0.5 ${sel === i ? 'outline-2 outline-offset-2 outline-ivory' : 'outline-0'} group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent`}>
                        {indicators.map((ind) => {
                          const st: Cell = r.ev ? r.statuses[filter === 'semua' ? ind.id : filter] : 'kosong'
                          return <span key={ind.id} className="seat-cell" style={{ background: lit ? COLOR[st] : COLOR.kosong, ['--d' as string]: `${d}ms` }} />
                        })}
                      </span>
                      <span className={`text-[13px] font-semibold tnum transition-colors ${sel === i ? 'text-ivory' : 'text-[#9F97AE] group-hover:text-ivory'}`}>{r.initials}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-[#CFC6DC]" aria-label="Keterangan warna">
            {LEGEND.map(([k, l]) => <li key={k} className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-[5px_1px_5px_5px]" style={{ background: COLOR[k] }} />{l}</li>)}
          </ul>
        </div>

        <aside className="min-w-0 lg:col-span-5 lg:sticky lg:top-24" aria-live="polite" aria-label="Detail mahasiswa terpilih">
          <div key={s.id} className="t-swap bg-[#35313A] drop-lg p-6 sm:p-8">
            <p className="text-[13px] font-semibold text-[#BDB5CC]">Meja {Math.floor(sel / COLS) + 1}.{(sel % COLS) + 1}</p>
            <p className="mt-1 text-[24px] font-bold tracking-[-0.02em] leading-tight">{s.name}</p>
            <p className="mt-1 text-[15px] text-[#CFC6DC] tnum">{s.score !== null ? <>Skor sementara <b className="text-ivory">{s.score}</b> · menunggu tinjauan dosen</> : 'Belum mengumpulkan sesi ini'}</p>
            {s.ev && (
              <>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {indicators.map((ind) => (
                    <li key={ind.id} className="flex items-center justify-between gap-4 text-[15px]">
                      <span className="flex items-center gap-2.5 min-w-0"><span className="w-3 h-3 rounded-[4px_1px_4px_4px] shrink-0" style={{ background: COLOR[s.statuses[ind.id]] }} /><span className="truncate">{ind.name}</span></span>
                      <span className="text-[#CFC6DC] shrink-0">{STATUS_LABEL[s.statuses[ind.id]]}</span>
                    </li>
                  ))}
                </ul>
                {focusFinding && (
                  <blockquote className="mt-6 rounded-[14px_4px_14px_14px] bg-[#2A272D] p-4 text-[16px] leading-snug">
                    <p className="text-[13px] font-semibold text-[#BDB5CC] mb-1.5">Kutipan yang menjadi bukti</p>
                    “{focusFinding.quote}”
                  </blockquote>
                )}
              </>
            )}
            <Link to="/dosen/tinjauan/operasi-stack" className="btn btn-light mt-7">Buka ruang tinjauan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <p className="mt-4 text-[13.5px] text-[#9F97AE] leading-snug">Data contoh: IF203 Struktur Data B, sesi Operasi Stack. Warna adalah usulan AI sebelum ditinjau dosen.</p>
        </aside>
      </div>
    </section>
  )
}
