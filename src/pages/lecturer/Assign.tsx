import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock3, Mail } from 'lucide-react'
import AppShell from '../../components/AppShell'
import { Avatar, SuccessCheck } from '../../components/ui'
import { Link } from '../../lib/router'
import { activities, concepts, type Activity, type ConceptId } from '../../lib/data'
import { store, toast } from '../../lib/store'
import { useRecommendations } from './Mentoring'

const STEPS = ['Pilih mahasiswa', 'Pilih kegiatan', 'Atur jadwal', 'Tinjau & konfirmasi']
const KINDS: Activity['kind'][] = ['Latihan bertahap', 'Studi kasus', 'Modul interaktif', 'Video pembelajaran']
const LEVELS: Activity['level'][] = ['Dasar', 'Menengah', 'Tantangan']
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Assign({ path }: { path: string }) {
  const recs = useRecommendations()
  const [pre] = useState(() => { const ids = store.get().preselect.filter((id) => recs.some((r) => r.id === id && !r.assigned)); store.set({ preselect: [] }); return ids })
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const [students, setStudents] = useState<string[]>(pre.length ? pre : recs.filter((r) => r.need.need === 'penguatan' && !r.assigned).slice(0, 3).map((r) => r.id))
  const chosen = recs.filter((r) => students.includes(r.id))
  const needed = [...new Set(chosen.flatMap((r) => r.need.concepts))] as ConceptId[]
  const [concept, setConcept] = useState<ConceptId | 'semua'>(needed[0] ?? 'semua')
  const [kinds, setKinds] = useState<string[]>([])
  const [levels, setLevels] = useState<string[]>([])
  const suggested = chosen[0] ? chosen[0].need.activity : 'lb-pilih'
  const [acts, setActs] = useState<string[]>([suggested])
  const [preview, setPreview] = useState(suggested)
  const [start, setStart] = useState('2026-10-31'); const [startT, setStartT] = useState('08:00')
  const [due, setDue] = useState('2026-11-03'); const [dueT, setDueT] = useState('23:59')
  const [mode, setMode] = useState<'Mandiri' | 'Terjadwal'>('Mandiri')
  const [note, setNote] = useState('')
  const [notify, setNotify] = useState([true, true, false])
  const [confirm, setConfirm] = useState([false, false, false, false])
  const [sentDone, setSentDone] = useState(false)

  const list = useMemo(() => activities.filter((a) => a.active && (concept === 'semua' || a.concepts.includes(concept)) && (!kinds.length || kinds.includes(a.kind)) && (!levels.length || levels.includes(a.level))), [concept, kinds, levels])
  const prev = activities.find((a) => a.id === preview)!
  const picked = activities.filter((a) => acts.includes(a.id))
  const valid = [students.length > 0, acts.length > 0, new Date(`${due}T${dueT}`) > new Date(`${start}T${startT}`), confirm.every(Boolean)]
  const to = (n: number) => { setDir(n > step ? 'fwd' : 'back'); setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const title = picked.map((a) => a.title).join(' + ')

  const send = () => {
    store.set((x) => ({ sent: [{ id: 'pd-new-' + Date.now(), title, students: chosen.map((c) => c.name), due: `${fmtDate(due)}, ${dueT.replace(':', '.')}`, mode }, ...x.sent] }))
    toast(`Tugas pendampingan terkirim ke ${chosen.length} mahasiswa`)
    setSentDone(true)
  }

  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Pendampingan', to: '/dosen/pendampingan' }, { label: 'Tugaskan' }]}>
      <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-tight">Tugaskan Pendampingan</h1>
      <p className="text-[15px] text-[#4E4B5E] mt-1 mb-6">Pilih mahasiswa, kegiatan penguatan, dan jadwalnya. Tidak ada yang terkirim sebelum Anda mengonfirmasi.</p>

      {!sentDone && (
        <ol className="grid grid-cols-4 gap-2 mb-6 max-w-[920px]" aria-label="Langkah">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined}>
              <button disabled={i > step && !valid.slice(0, i).every(Boolean)} onClick={() => to(i)} className="w-full text-left disabled:cursor-not-allowed">
                <span className={`block h-1.5 rounded-full transition-colors duration-[400ms] ${i < step ? 'bg-ink' : i === step ? 'bg-accent' : 'bg-line'}`} />
                <span className={`mt-2 flex items-center gap-1.5 text-[13px] sm:text-[15px] ${i === step ? 'font-semibold' : i < step ? '' : 'text-muted'}`}>{i < step ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <span className="tnum">{i + 1}.</span>}<span className="hidden sm:inline">{s}</span></span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {sentDone ? (
        <section className="card p-10 flex flex-col items-center text-center t-reveal">
          <SuccessCheck size={64} />
          <h2 className="mt-6 text-[25px] font-bold tracking-[-0.02em]">Tugas pendampingan terkirim</h2>
          <p className="mt-2 text-[15px] text-[#4E4B5E] max-w-[52ch]">“{title}” dikirim ke {chosen.map((c) => c.name).join(', ')}. Mereka bisa mengerjakannya mulai {fmtDate(start)}, {startT.replace(':', '.')}.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/dosen/pendampingan" className="btn btn-primary">Lihat pendampingan</Link><Link to="/dosen" className="btn btn-secondary">Ke Dashboard Kelas</Link></div>
        </section>
      ) : (
        <div key={step} className={dir === 'fwd' ? 't-step-fwd' : 't-step-back'}>
          {step === 0 && (
            <section className="card p-5" aria-labelledby="s1-h">
              <h2 id="s1-h" className="text-[17px] font-semibold">Pilih mahasiswa</h2>
              <p className="text-[15px] text-muted mt-1 mb-3">Dari temuan yang sudah Anda putuskan. Yang sedang menjalani pendampingan tidak bisa dipilih.</p>
              <ul className="flex flex-col divide-y divide-line">
                {recs.map((r) => (
                  <li key={r.id}>
                    <label className={`flex items-center gap-3 py-3 ${r.assigned ? 'opacity-50' : 'cursor-pointer'}`}>
                      <input type="checkbox" className="check" disabled={r.assigned} checked={students.includes(r.id)} onChange={() => toggle(students, setStudents, r.id)} />
                      <Avatar name={r.name} seed={r.idx} size={30} />
                      <span className="min-w-0 flex-1"><span className="block font-semibold">{r.name}</span><span className="block text-[13px] text-muted truncate">{r.ev!.summary}</span></span>
                      <span className="hidden md:flex flex-wrap gap-1 justify-end">{r.need.concepts.map((c) => <span key={c} className="pill pill-none">{concepts[c]}</span>)}</span>
                      {r.assigned && <span className="pill pill-ink">Sudah ditugaskan</span>}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {step === 1 && (
            <div className="grid xl:grid-cols-[220px_1fr_320px] gap-4 items-start">
              <section className="card p-5" aria-labelledby="filter-h">
                <h2 id="filter-h" className="text-[15px] font-semibold mb-3">Saring kegiatan</h2>
                <label htmlFor="konsep" className="label">Konsep</label>
                <select id="konsep" className="field !h-10 text-[15px]" value={concept} onChange={(e) => setConcept(e.target.value as ConceptId | 'semua')}>
                  <option value="semua">Semua konsep</option>
                  {Object.entries(concepts).map(([k, v]) => <option key={k} value={k}>{v}{needed.includes(k as ConceptId) ? ' · dibutuhkan' : ''}</option>)}
                </select>
                <fieldset className="mt-5"><legend className="label">Jenis</legend>{KINDS.map((k) => <label key={k} className="flex items-center gap-2.5 py-1.5 text-[15px] cursor-pointer"><input type="checkbox" className="check" checked={kinds.includes(k)} onChange={() => toggle(kinds, setKinds, k)} />{k}</label>)}</fieldset>
                <fieldset className="mt-4"><legend className="label">Tingkat</legend>{LEVELS.map((k) => <label key={k} className="flex items-center gap-2.5 py-1.5 text-[15px] cursor-pointer"><input type="checkbox" className="check" checked={levels.includes(k)} onChange={() => toggle(levels, setLevels, k)} />{k}</label>)}</fieldset>
                <button className="mt-3 text-[15px] font-semibold text-plum hover:underline" onClick={() => { setConcept('semua'); setKinds([]); setLevels([]) }}>Atur ulang</button>
              </section>
              <section className="card p-5 min-w-0" aria-labelledby="keg-h">
                <h2 id="keg-h" className="text-[17px] font-semibold mb-3">Bank kegiatan · <span className="tnum">{list.length}</span></h2>
                {list.length === 0 && <p className="py-10 text-center text-muted">Tidak ada kegiatan untuk saringan ini. <button className="text-plum font-semibold hover:underline" onClick={() => { setConcept('semua'); setKinds([]); setLevels([]) }}>Atur ulang saringan</button></p>}
                <ul className="flex flex-col gap-2">
                  {list.map((a) => (
                    <li key={a.id}>
                      <label onMouseEnter={() => setPreview(a.id)} className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition-colors duration-150 ${acts.includes(a.id) ? 'border-ink bg-[#FCFAFF]' : 'border-line hover:border-[#CFC3E0]'}`}>
                        <input type="checkbox" className="check mt-0.5" checked={acts.includes(a.id)} onChange={() => { toggle(acts, setActs, a.id); setPreview(a.id) }} onFocus={() => setPreview(a.id)} />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-semibold">{a.title}</span><span className="text-[13px] text-muted whitespace-nowrap">{a.kind}</span></span>
                          <span className="block text-[15px] text-[#4E4B5E] mt-0.5">{a.goal}</span>
                          <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted"><span className="inline-flex items-center gap-1"><Clock3 size={13} aria-hidden="true" />{a.minutes} menit</span><span>{a.level}</span><span>{a.concepts.map((c) => concepts[c]).join(', ')}</span>{a.id === suggested && <span className="font-semibold text-plum">Direkomendasikan aturan</span>}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
              <aside className="card p-5 xl:sticky xl:top-4" aria-labelledby="prev-h">
                <h2 id="prev-h" className="text-[15px] font-semibold">Pratinjau kegiatan</h2>
                <div key={prev.id} className="t-swap">
                  <p className="text-[13px] font-semibold text-plum mt-3">{prev.kind}</p>
                  <p className="text-[17px] font-semibold leading-snug">{prev.title}</p>
                  <p className="text-[13px] font-semibold text-muted mt-4">Tujuan belajar</p><p className="text-[15px] mt-0.5">{prev.goal}</p>
                  <p className="text-[13px] font-semibold text-muted mt-4">Isi kegiatan</p>
                  <ul className="mt-1 flex flex-col gap-1 text-[15px]">{prev.steps.map((s) => <li key={s} className="flex gap-2"><span className="dot-drop text-accent mt-[0.45em]" aria-hidden="true" />{s}</li>)}</ul>
                  <p className="text-[13px] font-semibold text-muted mt-4">Hasil yang diharapkan</p><p className="text-[15px] mt-0.5">{prev.outcome}</p>
                </div>
              </aside>
            </div>
          )}

          {step === 2 && (
            <div className="grid xl:grid-cols-[1fr_340px] gap-4 items-start">
              <section className="card p-5 sm:p-6" aria-labelledby="jadwal-h">
                <h2 id="jadwal-h" className="text-[17px] font-semibold">Jadwal pelaksanaan</h2>
                <div className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-4 max-w-[560px]">
                  <div><label htmlFor="mulai" className="label">Tanggal mulai</label><input id="mulai" type="date" className="field" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                  <div><label htmlFor="mulai-j" className="label">Jam mulai</label><input id="mulai-j" type="time" className="field" value={startT} onChange={(e) => setStartT(e.target.value)} /></div>
                  <div><label htmlFor="batas" className="label">Batas penyelesaian</label><input id="batas" type="date" className="field" value={due} min={start} onChange={(e) => setDue(e.target.value)} aria-describedby="batas-err" /></div>
                  <div><label htmlFor="batas-j" className="label">Jam batas</label><input id="batas-j" type="time" className="field" value={dueT} onChange={(e) => setDueT(e.target.value)} /></div>
                </div>
                {!valid[2] && <p id="batas-err" className="mt-2 text-[15px] text-warn">Batas penyelesaian harus setelah waktu mulai.</p>}
                <fieldset className="mt-6"><legend className="label">Mode pelaksanaan</legend>
                  <div className="grid sm:grid-cols-2 gap-2 max-w-[560px]">
                    {([['Mandiri', 'Dikerjakan mahasiswa kapan saja dalam rentang waktu'], ['Terjadwal', 'Dikerjakan bersama pada waktu mulai (sinkron)']] as const).map(([m, d]) => (
                      <label key={m} className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition-colors duration-150 ${mode === m ? 'border-ink' : 'border-line hover:border-[#CFC3E0]'}`}>
                        <input type="radio" name="mode" className="radio mt-0.5" checked={mode === m} onChange={() => setMode(m)} /><span><span className="block font-semibold">{m}</span><span className="block text-[13px] text-muted mt-0.5">{d}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label htmlFor="instruksi" className="label mt-6">Instruksi tambahan (opsional)</label>
                <textarea id="instruksi" className="field max-w-[560px]" rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Misalnya: fokus pada kasus antrean printer dari sesi Operasi Stack." />
              </section>
              <aside className="card p-5" aria-labelledby="notif-h">
                <h2 id="notif-h" className="text-[15px] font-semibold">Notifikasi ke mahasiswa</h2>
                {['Saat tugas dikirim', 'Pengingat 1 hari sebelum batas', 'Pengingat di hari batas'].map((n, i) => (
                  <label key={n} className="flex items-center gap-2.5 py-2 text-[15px] cursor-pointer"><input type="checkbox" className="check" checked={notify[i]} onChange={() => setNotify((x) => x.map((v, k) => (k === i ? !v : v)))} />{n}</label>
                ))}
              </aside>
            </div>
          )}

          {step === 3 && (
            <div className="grid xl:grid-cols-[1fr_380px] gap-4 items-start">
              <section className="card p-5 sm:p-6" aria-labelledby="ringkas-h">
                <h2 id="ringkas-h" className="text-[17px] font-semibold">Ringkasan pendampingan</h2>
                <dl className="mt-4 grid gap-5">
                  <div><dt className="label">Kegiatan</dt><dd>{picked.map((a) => <p key={a.id} className="font-semibold">{a.title} <span className="font-normal text-muted text-[15px]">· {a.kind} · {a.minutes} menit</span></p>)}</dd></div>
                  <div><dt className="label">Mahasiswa · {chosen.length}</dt><dd className="flex flex-col gap-2">{chosen.map((c) => <span key={c.id} className="flex items-center gap-2.5"><Avatar name={c.name} seed={c.idx} size={26} /><span className="font-medium">{c.name}</span><span className="text-[13px] text-muted">{c.need.concepts.map((x) => concepts[x]).join(', ')}</span></span>)}</dd></div>
                  <div><dt className="label">Jadwal</dt><dd className="tnum">{fmtDate(start)}, {startT.replace(':', '.')} sampai {fmtDate(due)}, {dueT.replace(':', '.')} · {mode}</dd></div>
                  <div><dt className="label">Instruksi tambahan</dt><dd className={note ? '' : 'text-muted'}>{note || 'Tidak ada'}</dd></div>
                </dl>
                <fieldset className="mt-6 border-t border-line pt-5"><legend className="sr-only">Konfirmasi</legend>
                  {['Kegiatan sudah sesuai dengan temuan', 'Daftar mahasiswa sudah benar', 'Jadwal pelaksanaan sudah tepat', 'Saya memahami tugas ini dikirim atas nama saya'].map((c, i) => (
                    <label key={c} className="flex items-center gap-2.5 py-1.5 text-[15px] cursor-pointer"><input type="checkbox" className="check" checked={confirm[i]} onChange={() => setConfirm((x) => x.map((v, k) => (k === i ? !v : v)))} />{c}</label>
                  ))}
                </fieldset>
              </section>
              <aside className="card p-5" aria-labelledby="pesan-h">
                <h2 id="pesan-h" className="text-[15px] font-semibold flex items-center gap-2"><Mail size={16} aria-hidden="true" /> Pratinjau notifikasi</h2>
                <div className="mt-3 rounded-md bg-mist p-4 text-[15px] leading-relaxed">
                  <p className="font-semibold">Tugas pendampingan: {title}</p>
                  <p className="mt-2">Halo, kamu mendapat kegiatan penguatan dari Dr. Rina Anggraini untuk memperkuat {needed.map((n) => concepts[n].toLowerCase()).join(' dan ') || 'materi sesi terakhir'}.</p>
                  <p className="mt-2">Mulai {fmtDate(start)}, {startT.replace(':', '.')} · selesai sebelum {fmtDate(due)}, {dueT.replace(':', '.')} · {mode}.</p>
                  {note && <p className="mt-2">Catatan: {note}</p>}
                </div>
                <p className="mt-2 text-[13px] text-muted">Dikirim ke {chosen.length} mahasiswa.</p>
              </aside>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button className="btn btn-ghost btn-sm" onClick={() => (step ? to(step - 1) : history.back())}><ArrowLeft size={15} aria-hidden="true" /> Kembali</button>
            {step < 3
              ? <button className="btn btn-primary" disabled={!valid[step]} onClick={() => to(step + 1)}>Lanjut ke {STEPS[step + 1].toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></button>
              : <button className="btn btn-primary" disabled={!valid.every(Boolean)} onClick={send}>Kirim tugas pendampingan <ArrowRight size={16} aria-hidden="true" /></button>}
          </div>
        </div>
      )}
    </AppShell>
  )
}
