import { useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Check, CircleAlert, Search } from 'lucide-react'
import AppShell from '../../components/AppShell'
import { BobyMark } from '../../components/Boby'
import { Avatar, StatusPill, Tabs } from '../../components/ui'
import { CodeLines } from '../../landing/Fragments'
import { go } from '../../lib/router'
import { concepts, indicators, roster, scoreOf, stackTask, STAGE_LABEL, STATUS_LABEL, verifyQuote, type Status, type Student } from '../../lib/data'
import { store, toast, useStore, type Decision } from '../../lib/store'

const submitted = roster.filter((r) => r.state !== 'belum')
const ROW_STATE = { perlu: ['Perlu ditinjau', 'pill-part'], selesai: ['Selesai ditinjau', 'pill-none'], kurang: ['Bukti kurang', 'pill-amb'], belum: ['Belum mengumpulkan', 'pill-none'] } as const

/** Marks the active finding's quote wherever it appears in a piece of evidence. */
function Hl({ text, quote }: { text: string; quote: string | null }): ReactNode {
  if (!quote) return text
  const at = text.toLowerCase().indexOf(quote.toLowerCase().replace(/[.!?]+$/, ''))
  if (at < 0) return text
  const q = quote.replace(/[.!?]+$/, '')
  return <>{text.slice(0, at)}<mark className="bg-[#E6D6FF] text-ink rounded px-0.5 box-decoration-clone">{text.slice(at, at + q.length)}</mark>{text.slice(at + q.length)}</>
}

export default function Review({ path }: { path: string }) {
  const s = useStore()
  const [filter, setFilter] = useState<'perlu' | 'semua'>('perlu')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<string>('nadia')
  const [hover, setHover] = useState<string | null>(null)
  const [correcting, setCorrecting] = useState<string | null>(null)

  const rowState = (r: Student) => (s.reviewed.includes(r.id) ? 'selesai' : r.state)
  const list = submitted.filter((r) => (filter === 'semua' || rowState(r) === 'perlu') && r.name.toLowerCase().includes(q.toLowerCase()))
  const st = roster.find((r) => r.id === sel)!
  const ev = st.ev
  const decided = s.decisions[st.id] ?? {}
  const savedOrDone = st.state === 'selesai' || s.reviewed.includes(st.id)

  const finalStatus = (ind: string): Status | null => {
    const d = savedOrDone && st.state === 'selesai' ? 'accept' : decided[ind]
    if (d === 'reject') return null
    if (d === 'correct') return s.corrections[`${st.id}:${ind}`] ?? st.statuses[ind]
    return st.statuses[ind]
  }
  const score = useMemo(() => {
    const m: Record<string, Status> = {}
    indicators.forEach((i) => { const f = finalStatus(i.id); m[i.id] = f ?? 'ambigu' })
    return scoreOf(m)
  }, [st.id, s.decisions, s.corrections, s.reviewed]) // eslint-disable-line
  const allDecided = indicators.every((i) => decided[i.id])
  const activeQuote = hover ? ev?.findings.find((f) => f.indicator === hover)?.quote ?? null : null

  const decide = (ind: string, d: Decision) => {
    store.set((x) => ({ decisions: { ...x.decisions, [st.id]: { ...(x.decisions[st.id] ?? {}), [ind]: d } } }))
    setCorrecting(d === 'correct' ? ind : null)
  }
  const correctTo = (ind: string, status: Status) => {
    store.set((x) => ({ corrections: { ...x.corrections, [`${st.id}:${ind}`]: status } }))
    setCorrecting(null)
  }
  const save = () => {
    store.set((x) => ({ reviewed: x.reviewed.includes(st.id) ? x.reviewed : [...x.reviewed, st.id] }))
    toast(`Tinjauan ${st.name} disimpan. Skor ${score} sekarang final.`)
    const next = submitted.find((r) => r.state === 'perlu' && r.id !== st.id && !s.reviewed.includes(r.id))
    if (next) setTimeout(() => setSel(next.id), 600)
  }
  const waitingCount = submitted.filter((r) => rowState(r) === 'perlu').length

  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Sesi Asesmen', to: '/dosen/sesi' }, { label: 'Tinjauan Hasil' }]}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-tight">Tinjauan Hasil Asesmen</h1>
          <p className="text-[15px] text-[#4E4B5E] mt-1">{stackTask.title} · Struktur Data B · <span className="tnum">{waitingCount}</span> mahasiswa menunggu keputusan. Temuan AI hanya usulan sampai Anda memutuskan.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_380px] 2xl:grid-cols-[260px_minmax(0,1fr)_420px] items-start">
        {/* Daftar mahasiswa */}
        <section className="card p-3 lg:sticky lg:top-4" aria-labelledby="daftar-h">
          <h2 id="daftar-h" className="sr-only">Daftar mahasiswa</h2>
          <div className="px-1 pb-2">
            <Tabs label="Saring mahasiswa" value={filter} onChange={setFilter} tabs={[{ id: 'perlu', label: `Perlu · ${waitingCount}` }, { id: 'semua', label: `Semua · ${submitted.length}` }]} />
            <label className="relative block mt-3"><span className="sr-only">Cari mahasiswa</span>
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input className="field !h-10 pl-9 text-[15px]" placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          </div>
          <ul className="max-h-[300px] lg:max-h-[calc(100svh-260px)] overflow-y-auto flex flex-col gap-0.5">
            {list.length === 0 && <li className="px-3 py-6 text-[15px] text-muted">Tidak ada mahasiswa yang cocok.</li>}
            {list.map((r) => {
              const rs = rowState(r)
              return (
                <li key={r.id}>
                  <button onClick={() => { setSel(r.id); setHover(null); setCorrecting(null) }} aria-current={r.id === sel}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors duration-150 ${r.id === sel ? 'bg-[#EFE8F4]' : 'hover:bg-mist'}`}>
                    <Avatar name={r.name} seed={r.idx} size={30} />
                    <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold truncate">{r.name}</span><span className="block text-[13px] text-muted tnum">{r.nim}</span></span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${rs === 'perlu' ? 'bg-[#E59A7F]' : rs === 'kurang' ? 'bg-ink' : 'bg-[#CFC6DC]'}`} aria-label={ROW_STATE[rs][0]} />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Bukti mahasiswa */}
        <section key={st.id} className="card p-5 sm:p-6 min-w-0 t-swap" aria-labelledby="bukti-h">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={st.name} seed={st.idx} size={40} />
              <div><h2 id="bukti-h" className="text-[20px] font-semibold leading-tight">{st.name}</h2><p className="text-[13px] text-muted tnum">{st.nim} · dikirim 28 Okt 2026</p></div>
            </div>
            <span className={`pill ${ROW_STATE[rowState(st)][1]}`}>{ROW_STATE[rowState(st)][0]}</span>
          </div>

          {!ev ? (
            <div className="mt-6 rounded-lg bg-mist p-5">
              <p className="font-semibold flex items-center gap-2"><CircleAlert size={17} className="text-warn" aria-hidden="true" /> Analisis tidak dijalankan</p>
              <p className="text-[15px] text-[#4E4B5E] mt-1.5 max-w-[60ch]">Jawaban praktik dan klarifikasi terlalu singkat (kurang dari 20 karakter di dua tahap), jadi analis tidak membuat usulan. Anda bisa meminta mahasiswa mengulang sesi atau menilai manual.</p>
              <div className="mt-4 flex gap-2"><button className="btn btn-sm btn-primary" onClick={() => toast(`Permintaan ulang dikirim ke ${st.name}`)}>Minta ulang sesi</button><button className="btn btn-sm btn-secondary" onClick={() => toast('Penilaian manual tersedia di versi produksi')}>Nilai manual</button></div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-7">
              <div>
                <h3 className="text-[15px] font-semibold text-muted mb-2">1 · Praktik</h3>
                <p className="text-[15px] text-[#4E4B5E] mb-3 max-w-[72ch]">{stackTask.instruction}</p>
                <CodeLines code={ev.code} />
                <p className="mt-3 text-[15px]"><span className="font-semibold">Penjelasan awal: </span><Hl text={ev.explain} quote={activeQuote} /></p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-muted mb-3">2 · Klarifikasi dengan Boby</h3>
                <ol className="flex flex-col gap-3 text-[15px]">
                  {ev.dialog.map((t, i) => t.who === 'boby' ? (
                    <li key={i} className="flex items-start gap-2.5 max-w-[88%]">
                      <BobyMark className="w-7 h-7 shrink-0 mt-0.5" />
                      <div className={`bubble-left bg-lavender px-3.5 py-2.5 leading-snug ${t.trap ? 'outline-2 outline-accent -outline-offset-2' : ''}`}>{t.trap && <span className="block text-[13px] font-semibold text-plum mb-0.5">Pernyataan uji</span>}{t.text}<span className="block text-[13px] text-muted mt-1 tnum">{t.time}</span></div>
                    </li>
                  ) : (
                    <li key={i} className="flex justify-end">
                      <div className="bubble-right bg-white border border-line px-3.5 py-2.5 leading-snug max-w-[82%]">{t.choice && <span className={`block text-[13px] font-semibold mb-0.5 ${t.choice === 'Setuju' ? 'text-part-ink' : 'text-plum'}`}>{t.choice}</span>}<Hl text={t.text} quote={activeQuote} /><span className="block text-[13px] text-muted mt-1 tnum">{t.time}</span></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-muted mb-3">3 · Penerapan</h3>
                <ol className="flex flex-col gap-4">
                  {stackTask.penerapan.map((pq, i) => (
                    <li key={i}><p className="text-[15px] text-[#4E4B5E]">{pq}</p><p className="mt-1.5 rounded-md bg-ivory border border-line p-3 text-[15px]"><Hl text={ev.answers[i]} quote={activeQuote} /></p></li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>

        {/* Ringkasan temuan + keputusan */}
        {ev && (
          <section key={'f' + st.id} className="card p-5 sm:p-6 lg:col-start-2 xl:col-start-auto xl:sticky xl:top-4 xl:max-h-[calc(100svh-32px)] xl:overflow-y-auto t-swap" aria-labelledby="temuan-h">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="temuan-h" className="text-[17px] font-semibold">Ringkasan temuan</h2>
              <p className="text-[15px] text-muted">Skor <b className="text-ink text-[25px] font-semibold tnum ml-1">{score}</b> {savedOrDone ? 'final' : 'sementara'}</p>
            </div>
            <p className="text-[13px] text-muted mt-1">Arahkan kursor ke temuan untuk menandai kutipannya di bukti.</p>
            <ul className="mt-4 flex flex-col gap-3">
              {ev.findings.map((f) => {
                const ind = indicators.find((i) => i.id === f.indicator)!
                const shown = st.statuses[f.indicator]
                const ok = verifyQuote(f.quote, st.transcript)
                const d = st.state === 'selesai' ? 'accept' : decided[f.indicator]
                const corrected = s.corrections[`${st.id}:${f.indicator}`]
                return (
                  <li key={f.indicator} onMouseEnter={() => setHover(f.indicator)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(f.indicator)}
                    className={`rounded-lg border p-4 transition-colors duration-150 ${hover === f.indicator ? 'border-accent bg-[#FCFAFF]' : 'border-line'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold leading-tight">{ind.name}</p><p className="text-[13px] text-muted mt-0.5">{concepts[ind.concept]} · bobot <span className="tnum">{ind.weight}</span> · {STAGE_LABEL[f.stage]}</p></div>
                      <StatusPill status={d === 'correct' && corrected ? corrected : shown}>{d === 'correct' && corrected ? `${STATUS_LABEL[corrected]} (dikoreksi)` : STATUS_LABEL[shown]}</StatusPill>
                    </div>
                    <p className="mt-2.5 text-[15px] leading-snug">“{f.quote}”</p>
                    <p className={`mt-1.5 text-[13px] font-semibold flex items-center gap-1 ${ok ? 'text-plum' : 'text-warn'}`}>{ok ? <><Check size={13} strokeWidth={3} aria-hidden="true" /> Kutipan ditemukan di transkrip</> : <><CircleAlert size={13} aria-hidden="true" /> Kutipan tidak ditemukan · usulan AI “{STATUS_LABEL[f.status]}” diturunkan ke ambigu</>}</p>
                    <p className="mt-1.5 text-[15px] text-[#4E4B5E] leading-snug">{f.reason}</p>
                    {st.state === 'selesai' ? (
                      <p className="mt-3 text-[13px] text-muted">Diterima dosen pada 26 Okt 2026</p>
                    ) : (
                      <>
                        <div className="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label={`Keputusan untuk ${ind.name}`}>
                          {([['accept', 'Terima'], ['correct', 'Koreksi'], ['reject', 'Tolak']] as const).map(([k, l]) => (
                            <button key={k} aria-pressed={d === k} onClick={() => decide(f.indicator, k)} className={`btn btn-sm !h-8 !text-[13px] ${d === k ? 'btn-primary' : 'btn-secondary'}`}>{l}</button>
                          ))}
                        </div>
                        {correcting === f.indicator && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5 t-reveal" role="group" aria-label="Ubah status menjadi">
                            {(['terpenuhi', 'sebagian', 'belum'] as Status[]).map((x) => <button key={x} onClick={() => correctTo(f.indicator, x)} className="pill pill-amb hover:!shadow-[inset_0_0_0_1px_#9E61FD] cursor-pointer">{STATUS_LABEL[x]}</button>)}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
            {ev.misconception && <p className="mt-4 rounded-md bg-mist p-3 text-[15px]"><span className="font-semibold">Miskonsepsi yang terlihat: </span>{ev.misconception}</p>}
            {st.state !== 'selesai' && (
              <>
                <label htmlFor="catatan" className="label mt-5">Catatan dosen untuk mahasiswa</label>
                <textarea id="catatan" className="field text-[15px]" rows={3} maxLength={500} value={s.notes[st.id] ?? ''} placeholder="Opsional. Muncul di ringkasan mahasiswa."
                  onChange={(e) => store.set((x) => ({ notes: { ...x.notes, [st.id]: e.target.value } }))} />
                <div className="mt-4 flex flex-col gap-2">
                  <button className="btn btn-primary btn-sm w-full" disabled={!allDecided} onClick={() => { if (!s.reviewed.includes(st.id)) save(); store.set({ preselect: [st.id] }); go('/dosen/pendampingan/tugaskan') }}>Simpan & tentukan pendampingan <ArrowRight size={14} aria-hidden="true" /></button>
                  <button className="btn btn-secondary btn-sm w-full" disabled={!allDecided || s.reviewed.includes(st.id)} onClick={save}>{s.reviewed.includes(st.id) ? 'Tinjauan tersimpan' : 'Simpan tinjauan saja'}</button>
                </div>
                {!allDecided && <p className="mt-2 text-[13px] text-muted">Putuskan keempat temuan untuk menyimpan.</p>}
              </>
            )}
          </section>
        )}
      </div>
    </AppShell>
  )
}
