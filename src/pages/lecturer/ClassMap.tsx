import { useState } from 'react'
import { ArrowRight, Filter } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Link } from '../../lib/router'
import { Avatar } from '../../components/ui'
import { classes, indicators, roster, stackSummary, STATUS_LABEL, STATUS_PILL, type Student } from '../../lib/data'

type Cell = 'terpenuhi' | 'sebagian' | 'belum' | 'ambigu' | 'kosong'
const COLOR: Record<Cell, string> = { terpenuhi: '#9E61FD', sebagian: '#7A6A9C', belum: '#FBC9BB', ambigu: '#FEF8F5', kosong: '#E8E3EE' }
const LEGEND: [Cell, string][] = [['terpenuhi', 'Terpenuhi'], ['sebagian', 'Sebagian'], ['belum', 'Belum'], ['ambigu', 'Ambigu'], ['kosong', 'Belum mengumpulkan']]
const SHORT: Record<string, string> = { i1: 'Urutan LIFO', i2: 'Push & pop', i3: 'Analogi antrean', i4: 'Kasus baru' }
const COLS = 7
const submitted = roster.filter((r) => r.ev)
const gapOf = (id: string) => submitted.filter((r) => r.statuses[id] === 'belum' || r.statuses[id] === 'sebagian').length
const weakest = [...indicators].sort((a, b) => gapOf(b.id) - gapOf(a.id))[0]

export default function ClassMap({ path }: { path: string }) {
  const [filter, setFilter] = useState<string>('semua')
  const [sel, setSel] = useState<number>(0)
  const [kelas, setKelas] = useState(classes[0].id)

  const s = roster[sel]
  const focusFinding = s.ev?.findings.find((f) => s.statuses[f.indicator] !== 'terpenuhi') ?? s.ev?.findings[0]
  const shownGap = filter === 'semua' ? null : gapOf(filter)

  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Peta Kelas' }]}>
      <TitleRow title="Peta Kelas"
        finding={<>Seluruh kelas dalam satu pandangan. Setiap kotak adalah satu mahasiswa, empat petaknya adalah empat indikator rubrik. <b className="text-ink font-semibold">{weakest.name}</b> adalah indikator paling lemah.</>}
        actions={<Link to="/dosen/tinjauan/operasi-stack" className="btn btn-primary btn-sm">Buka tinjauan <ArrowRight size={15} aria-hidden="true" /></Link>} />

      {/* Class selector */}
      <div className="flex items-center gap-3 mb-5">
        <label htmlFor="pilih-kelas" className="text-[15px] font-semibold text-muted flex items-center gap-1.5"><Filter size={15} /> Kelas</label>
        <select id="pilih-kelas" value={kelas} onChange={(e) => setKelas(e.target.value)}
          className="h-9 px-3 rounded-lg border border-line bg-white text-[15px] font-medium">
          {classes.map((c) => <option key={c.id} value={c.id}>{c.code} {c.group} — {c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left: map */}
        <div className="min-w-0">
          {/* Indicator filter */}
          <div role="radiogroup" aria-label="Tampilkan indikator" className="flex flex-wrap gap-2 mb-4" data-tour="filter-indikator">
            {[{ id: 'semua', label: 'Semua indikator' }, ...indicators.map((i) => ({ id: i.id, label: SHORT[i.id] }))].map((f) => (
              <button key={f.id} role="radio" aria-checked={filter === f.id} onClick={() => setFilter(f.id)}
                className={`h-9 px-4 rounded-full text-[14px] font-semibold transition-colors duration-150 ${filter === f.id ? 'bg-ink text-white' : 'bg-mist text-[#4E4B5E] hover:bg-[#E2DCEC]'}`}>{f.label}</button>
            ))}
          </div>

          {/* Summary line */}
          <p className="text-[15px] text-muted mb-4 min-h-[1.5em] tnum" aria-live="polite">
            {shownGap === null
              ? <>Paling lemah: <b className="text-ink font-semibold">{weakest.name}</b>. <b className="text-accent font-semibold">{gapOf(weakest.id)}</b> dari {submitted.length} mahasiswa belum atau baru sebagian.</>
              : <><b className="text-ink font-semibold">{indicators.find((i) => i.id === filter)!.name}</b>: <b className="text-accent font-semibold">{shownGap}</b> dari {submitted.length} belum atau baru sebagian.</>}
          </p>

          {/* Grid */}
          <div className="card p-5 sm:p-7" data-tour="peta-grid">
            <p className="mx-auto mb-5 w-1/2 min-w-[160px] h-7 rounded-md bg-mist grid place-content-center text-[12.5px] font-semibold text-muted">Papan tulis</p>
            <ul className="grid grid-cols-7 gap-x-[clamp(6px,1.6vw,16px)] gap-y-[clamp(10px,1.8vw,18px)]" aria-label="Peta kelas">
              {roster.map((r, i) => (
                <li key={r.id}>
                  <button onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} aria-pressed={sel === i}
                    aria-label={`${r.name}: ${r.ev ? indicators.map((ind) => `${SHORT[ind.id]} ${STATUS_LABEL[r.statuses[ind.id]].toLowerCase()}`).join(', ') : 'belum mengumpulkan'}`}
                    className="group w-full flex flex-col items-center gap-1.5 outline-none">
                    <span className={`w-full aspect-square grid grid-cols-2 grid-rows-2 gap-[2px] rounded-[8px_2px_8px_8px] overflow-hidden transition-transform duration-[200ms] group-hover:-translate-y-0.5 ${sel === i ? 'ring-2 ring-offset-2 ring-plum' : ''}`}>
                      {indicators.map((ind) => {
                        const st: Cell = r.ev ? r.statuses[filter === 'semua' ? ind.id : filter] : 'kosong'
                        return <span key={ind.id} className="transition-colors duration-300" style={{ background: COLOR[st] }} />
                      })}
                    </span>
                    <span className={`text-[12px] font-semibold tnum transition-colors ${sel === i ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>{r.initials}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Legend */}
            <ul className="mt-5 pt-4 border-t border-line flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted" aria-label="Keterangan warna">
              {LEGEND.map(([k, l]) => <li key={k} className="flex items-center gap-2"><span className="w-3 h-3 rounded-[4px_1px_4px_4px]" style={{ background: COLOR[k] }} />{l}</li>)}
            </ul>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3" data-tour="ringkasan-angka">
            {[
              { label: 'Mahasiswa', value: roster.length },
              { label: 'Mengumpulkan', value: submitted.length },
              { label: 'Perlu tinjauan', value: stackSummary.perlu },
              { label: 'Rata-rata sementara', value: stackSummary.avg },
            ].map((f) => (
              <div key={f.label} className="card p-4 text-center">
                <p className="text-[13px] text-muted">{f.label}</p>
                <p className="text-[24px] font-bold tnum mt-1">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: student detail sidebar */}
        <aside className="xl:sticky xl:top-20" aria-live="polite" aria-label="Detail mahasiswa terpilih" data-tour="detail-mhs">
          <StudentDetail student={s} sel={sel} focusFinding={focusFinding} filter={filter} />
        </aside>
      </div>
    </AppShell>
  )
}

function StudentDetail({ student: s, sel, focusFinding, filter }: { student: Student; sel: number; focusFinding?: { indicator: string; quote: string; reason: string; status: string }; filter: string }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={s.name} seed={s.idx} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted tnum">Meja {Math.floor(sel / COLS) + 1}.{(sel % COLS) + 1}</p>
          <p className="text-[18px] font-bold tracking-[-0.01em] truncate">{s.name}</p>
        </div>
      </div>
      <p className="text-[15px] text-muted tnum">{s.score !== null ? <>Skor sementara <b className="text-ink font-semibold">{s.score}</b> · menunggu tinjauan dosen</> : 'Belum mengumpulkan sesi ini'}</p>

      {s.ev && (
        <>
          {/* Per-indicator status */}
          <ul className="mt-5 flex flex-col gap-2">
            {indicators.map((ind) => (
              <li key={ind.id} className={`flex items-center justify-between gap-3 text-[15px] py-1.5 px-3 rounded-lg transition-colors ${filter === ind.id ? 'bg-mist' : ''}`}>
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-[4px_1px_4px_4px] shrink-0" style={{ background: COLOR[s.statuses[ind.id] as Cell] }} />
                  <span className="truncate">{ind.name}</span>
                </span>
                <span className={`shrink-0 text-[13px] font-medium px-2 py-0.5 rounded-full ${STATUS_PILL[s.statuses[ind.id]]}`}>{STATUS_LABEL[s.statuses[ind.id]]}</span>
              </li>
            ))}
          </ul>

          {/* Focus finding quote */}
          {focusFinding && (
            <div className="mt-5 rounded-[12px_3px_12px_12px] bg-mist p-4">
              <p className="text-[13px] font-semibold text-muted mb-1.5">Kutipan bukti</p>
              <p className="text-[15px] leading-snug">"{focusFinding.quote}"</p>
              <p className="text-[13px] text-muted mt-2">{focusFinding.reason}</p>
            </div>
          )}

          <Link to="/dosen/tinjauan/operasi-stack" className="btn btn-primary w-full mt-5 justify-center">Buka tinjauan <ArrowRight size={15} aria-hidden="true" /></Link>
        </>
      )}
      {!s.ev && (
        <p className="mt-4 text-[14px] text-muted bg-mist p-4 rounded-lg">Mahasiswa ini belum mengumpulkan jawaban untuk sesi Operasi Stack.</p>
      )}
    </div>
  )
}
