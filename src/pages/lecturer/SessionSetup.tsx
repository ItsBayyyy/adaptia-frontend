import { useState } from 'react'
import { ArrowDown, ArrowUp, Check, Clock3, Code2, Copy, Eye, Image, Lightbulb, ListChecks, Plus, Scale, Trash2, Users } from 'lucide-react'
import AppShell from '../../components/AppShell'
import { SuccessCheck, Tabs } from '../../components/ui'
import { Link } from '../../lib/router'
import { classes, concepts, indicatorBank, indicators, questionBank, QKIND_LABEL, stackTask, type ConceptId, type QKind, type Question } from '../../lib/data'
import { toast } from '../../lib/store'

type Row = { id: string; name: string; concept: ConceptId; weight: number; on: boolean }
const uid = () => Math.random().toString(36).slice(2, 9)

export default function SessionSetup({ path }: { path: string }) {
  const [tab, setTab] = useState<'info' | 'tugas' | 'rubrik'>('info')
  const [name, setName] = useState('Operasi Stack · ulang')
  const [cls, setCls] = useState('if203b')
  const [type, setType] = useState('Asesmen awal')
  const [due, setDue] = useState('2026-11-10')
  const [fmt, setFmt] = useState({ kode: true, foto: false })
  const [qs, setQs] = useState<Question[]>([{ id: uid(), kind: 'praktik', text: stackTask.instruction }])
  const [cap, setCap] = useState(3)
  const [rows, setRows] = useState<Row[]>(indicators.map((i) => ({ id: i.id, name: i.name, concept: i.concept, weight: i.weight, on: true })))
  const [checks, setChecks] = useState([true, true, false])
  const [published, setPublished] = useState(false)
  const [copied, setCopied] = useState(false)

  const c = classes.find((k) => k.id === cls)!
  const sum = rows.reduce((a, r) => a + (r.on ? r.weight : 0), 0)
  const praktik = qs.filter((q) => q.kind === 'praktik').length
  const terap = qs.filter((q) => q.kind === 'penerapan').length
  const filled = qs.every((q) => q.text.trim().length > 20)
  const ok = [name.trim().length > 2, fmt.kode || fmt.foto, praktik >= 1 && filled, sum === 100 && rows.some((r) => r.on), checks.every(Boolean)]

  const setQ = (id: string, patch: Partial<Question>) => setQs((x) => x.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  const move = (i: number, d: number) => setQs((x) => { const n = [...x]; const [q] = n.splice(i, 1); n.splice(i + d, 0, q); return n })
  const setRow = (id: string, patch: Partial<Row>) => setRows((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  /** Suggestions come from the material's reviewed bank by a rule: the first entry not already used. */
  const suggestQuestion = (kind: QKind) => {
    const bank = questionBank[c.material] ?? []
    const next = bank.find((b) => b.kind === kind && !qs.some((q) => q.text.trim() === b.text))
    if (!next) return toast(`Bank ${c.material} sudah habis untuk ${QKIND_LABEL[kind].toLowerCase()}`)
    setQs((x) => [...x, { id: uid(), kind, text: next.text }])
    toast('Usulan ditambahkan · tinjau sebelum dipublikasikan')
  }
  const suggestIndicator = () => {
    const bank = indicatorBank[c.material] ?? []
    const next = bank.find((b) => !rows.some((r) => r.name.trim() === b.name))
    if (!next) return toast(`Bank indikator ${c.material} sudah habis`)
    setRows((x) => [...x, { id: uid(), name: next.name, concept: next.concept, weight: next.weight, on: true }])
    toast('Indikator usulan ditambahkan · periksa bobotnya')
  }
  /** Spreads 100 across the active indicators, so a lecturer never has to do the arithmetic by hand. */
  const balance = () => setRows((x) => {
    const act = x.filter((r) => r.on)
    if (!act.length) return x
    const base = Math.floor(100 / act.length)
    let left = 100 - base * act.length
    return x.map((r) => (r.on ? { ...r, weight: base + (left-- > 0 ? 1 : 0) } : r))
  })

  const crumbs = [{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Sesi Asesmen', to: '/dosen/sesi' }, { label: 'Pengaturan Sesi' }]
  const dueText = new Date(due + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  // ── After publishing: the class code is the thing the lecturer now has to pass on ──
  if (published) return (
    <AppShell role="dosen" path={path} crumbs={crumbs}>
      <section className="card p-6 sm:p-10 t-reveal" aria-labelledby="terbit-h">
        <div className="flex flex-col items-center text-center">
          <SuccessCheck size={64} />
          <h1 id="terbit-h" className="mt-6 text-[25px] font-bold tracking-[-0.02em]">Sesi “{name}” dipublikasikan</h1>
          <p className="mt-2 text-[15px] text-[#4E4B5E] max-w-[54ch]">{c.enrolled} mahasiswa {c.name} {c.group} bisa mengerjakannya sampai {dueText}, 23.59 WIB. {qs.length} pertanyaan · {rows.filter((r) => r.on).length} indikator.</p>
        </div>

        <div className="mt-8 mx-auto max-w-[540px] rounded-[20px_3px_20px_20px] bg-mist p-6 text-center" data-tour="kode">
          <p className="text-[15px] text-muted">Kode kelas untuk mahasiswa</p>
          <p className="mt-2 text-[44px] font-bold tracking-[0.06em] tnum leading-none">{c.joinCode}</p>
          <button className="btn btn-secondary btn-sm mt-4" onClick={() => { navigator.clipboard?.writeText(c.joinCode).catch(() => {}); setCopied(true); toast('Kode kelas disalin'); setTimeout(() => setCopied(false), 2200) }}>
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />} {copied ? 'Tersalin' : 'Salin kode'}
          </button>
          <ol className="mt-5 text-left text-[15px] text-[#4E4B5E] flex flex-col gap-1.5">
            {['Bagikan kode ini ke mahasiswa kelas Anda.', 'Mahasiswa membukanya di Ruang Mahasiswa, lalu memasukkan kode di “Gabung kelas”.', 'Sesi langsung muncul di daftar sesi mereka.'].map((s, i) => (
              <li key={s} className="flex gap-2.5"><span className="tnum text-muted">{i + 1}.</span>{s}</li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/dosen/sesi" className="btn btn-primary">Ke Sesi Asesmen</Link>
          <Link to="/mahasiswa" className="btn btn-secondary">Lihat sebagai mahasiswa</Link>
        </div>
      </section>
    </AppShell>
  )

  return (
    <AppShell role="dosen" path={path} crumbs={crumbs}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div><h1 className="text-[28px] font-bold tracking-[-0.02em] leading-tight">Pengaturan Sesi</h1><p className="text-[15px] text-[#4E4B5E] mt-1">Susun pertanyaan dan rubrik. Mahasiswa melihat sesi ini setelah dipublikasikan.</p></div>
        <Link to="/mahasiswa/sesi/antrean-queue" className="btn btn-secondary btn-sm"><Eye size={15} aria-hidden="true" /> Pratinjau sebagai mahasiswa</Link>
      </div>
      <div className="mb-4" data-tour="bagian"><Tabs label="Bagian pengaturan" value={tab} onChange={setTab} tabs={[{ id: 'info', label: 'Informasi sesi' }, { id: 'tugas', label: <>Pertanyaan · {qs.length}</> }, { id: 'rubrik', label: <>Rubrik {sum !== 100 && <span className="text-warn">·</span>}</> }]} /></div>

      <div className="grid xl:grid-cols-[1fr_360px] gap-4 items-start">
        <section key={tab} className="card p-5 sm:p-6 t-swap" aria-label="Isian pengaturan">
          {tab === 'info' && (
            <div className="grid gap-5 max-w-[720px]">
              <div><label htmlFor="nama" className="label">Nama sesi</label><input id="nama" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label htmlFor="kelas" className="label">Kelas</label><select id="kelas" className="field" value={cls} onChange={(e) => setCls(e.target.value)}>{classes.map((k) => <option key={k.id} value={k.id}>{k.name} · {k.group}</option>)}</select></div>
                <div><label htmlFor="jenis" className="label">Jenis asesmen</label><select id="jenis" className="field" value={type} onChange={(e) => setType(e.target.value)}>{['Asesmen awal', 'Formatif', 'Praktikum'].map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label htmlFor="paket" className="label">Paket materi</label><input id="paket" className="field" readOnly value={`${c.material} · ditinjau ahli materi`} /></div>
                <div><label htmlFor="batas" className="label">Batas pengumpulan</label><input id="batas" type="date" className="field" value={due} onChange={(e) => setDue(e.target.value)} /></div>
              </div>
              <div className="rounded-lg bg-mist p-4 flex items-center justify-between gap-4 flex-wrap">
                <div><p className="text-[15px] font-semibold">Kode kelas {c.joinCode}</p><p className="text-[13px] text-muted">Mahasiswa memakai kode ini untuk bergabung. Kode tampil lagi setelah sesi dipublikasikan.</p></div>
                <span className="kbd tnum">{c.joinCode}</span>
              </div>
              <fieldset><legend className="label">Format jawaban</legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {([['kode', 'Teks / Kode', 'Jawaban tertulis atau potongan kode', Code2], ['foto', 'Foto pengerjaan', 'Foto langkah di kertas, dibaca lalu dikonfirmasi mahasiswa', Image]] as const).map(([k, l, d, Icon]) => (
                    <label key={k} className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition-colors duration-150 ${fmt[k] ? 'border-ink' : 'border-line hover:border-[#CFC3E0]'}`}>
                      <input type="checkbox" className="check mt-0.5" checked={fmt[k]} onChange={() => setFmt((f) => ({ ...f, [k]: !f[k] }))} />
                      <span><span className="flex items-center gap-1.5 font-semibold"><Icon size={16} aria-hidden="true" />{l}</span><span className="block text-[13px] text-muted mt-0.5">{d}</span></span>
                    </label>
                  ))}
                </div>
                {!ok[1] && <p className="mt-2 text-[15px] text-warn">Pilih minimal satu format jawaban.</p>}
              </fieldset>
            </div>
          )}

          {/* ── The quiz: as many questions as the session needs, in the order students meet them ── */}
          {tab === 'tugas' && (
            <div className="max-w-[760px]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-[15px] text-[#4E4B5E] max-w-[52ch]">Pertanyaan dikerjakan berurutan. Minimal satu pertanyaan praktik; klarifikasi dan penerapan boleh beberapa.</p>
                <button className="btn btn-secondary btn-sm" data-tour="usul" onClick={() => suggestQuestion(qs.length % 2 ? 'penerapan' : 'praktik')}><Lightbulb size={15} aria-hidden="true" /> Usulkan pertanyaan</button>
              </div>
              <p className="text-[13px] text-muted mt-1.5">Usulan diambil dari bank materi {c.material} yang sudah ditinjau. Pada purwarupa ini belum ada model yang menuliskannya sendiri, dan setiap usulan tetap Anda putuskan.</p>

              <ol className="mt-5 flex flex-col gap-3" data-tour="daftar-soal">
                {qs.map((q, i) => (
                  <li key={q.id} className="rounded-[14px_3px_14px_14px] border border-line p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="tnum text-[15px] font-semibold text-muted w-6">{i + 1}.</span>
                      <select className="field !h-9 !w-auto text-[15px]" value={q.kind} onChange={(e) => setQ(q.id, { kind: e.target.value as QKind })} aria-label={`Jenis pertanyaan ${i + 1}`}>
                        {(Object.keys(QKIND_LABEL) as QKind[]).map((k) => <option key={k} value={k}>{QKIND_LABEL[k]}</option>)}
                      </select>
                      <div className="ml-auto flex items-center gap-1">
                        <button className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Naikkan pertanyaan ${i + 1}`}><ArrowUp size={16} /></button>
                        <button className="icon-btn" disabled={i === qs.length - 1} onClick={() => move(i, 1)} aria-label={`Turunkan pertanyaan ${i + 1}`}><ArrowDown size={16} /></button>
                        <button className="icon-btn" disabled={qs.length === 1} onClick={() => setQs((x) => x.filter((y) => y.id !== q.id))} aria-label={`Hapus pertanyaan ${i + 1}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <textarea className="field" rows={3} value={q.text} placeholder="Tulis pertanyaannya dengan kalimat yang mahasiswa baca…" onChange={(e) => setQ(q.id, { text: e.target.value })} aria-label={`Isi pertanyaan ${i + 1}`} />
                    {q.text.trim().length <= 20 && <p className="mt-1.5 text-[13px] text-warn">Pertanyaan ini masih terlalu pendek.</p>}
                  </li>
                ))}
              </ol>

              <button className="btn btn-secondary btn-sm mt-4" onClick={() => setQs((x) => [...x, { id: uid(), kind: 'penerapan', text: '' }])}><Plus size={15} aria-hidden="true" /> Tambah pertanyaan</button>

              <div className="mt-6 pt-5 border-t border-line">
                <label htmlFor="cap" className="label">Klarifikasi Boby: maksimal <span className="tnum text-ink">{cap}</span> pertanyaan lanjutan</label>
                <input id="cap" type="range" min={1} max={5} value={cap} onChange={(e) => setCap(+e.target.value)} className="stage-range w-full max-w-[420px]" style={{ ['--p' as string]: `${((cap - 1) / 4) * 100}%` }} />
                <p className="text-[13px] text-muted">Setidaknya satu pertanyaan lanjutan berisi pernyataan uji dari bank jebakan, disisipkan oleh aturan.</p>
              </div>
            </div>
          )}

          {/* ── The rubric: the lecturer's own indicators, not a fixed list ── */}
          {tab === 'rubrik' && (
            <div className="max-w-[760px]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-[15px] text-[#4E4B5E] max-w-[52ch]">Penilaian berfokus pada konsep, bukan panjang penjelasan. Bobot indikator aktif harus berjumlah 100.</p>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={balance}><Scale size={15} aria-hidden="true" /> Seimbangkan</button>
                  <button className="btn btn-secondary btn-sm" onClick={suggestIndicator}><Lightbulb size={15} aria-hidden="true" /> Usulkan indikator</button>
                </div>
              </div>

              <ul className="mt-5 flex flex-col gap-3" data-tour="daftar-rubrik">
                {rows.map((r, i) => (
                  <li key={r.id} className={`rounded-[14px_3px_14px_14px] border p-4 ${r.on ? 'border-line' : 'border-line opacity-60'}`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-[15px] cursor-pointer">
                        <input type="checkbox" className="check" checked={r.on} onChange={() => setRow(r.id, { on: !r.on })} aria-label={`Aktifkan indikator ${i + 1}`} /> Aktif
                      </label>
                      <div className="ml-auto flex items-center gap-2">
                        <label className="flex items-center gap-2 text-[15px]"><span className="text-muted">Bobot</span>
                          <input type="number" min={0} max={100} disabled={!r.on} className="field !h-9 !w-20 text-right tnum" value={r.weight} onChange={(e) => setRow(r.id, { weight: Math.max(0, Math.min(100, +e.target.value || 0)) })} aria-label={`Bobot indikator ${i + 1}`} />
                        </label>
                        <button className="icon-btn" disabled={rows.length === 1} onClick={() => setRows((x) => x.filter((y) => y.id !== r.id))} aria-label={`Hapus indikator ${i + 1}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="mt-3 grid sm:grid-cols-[1fr_minmax(0,240px)] gap-2.5">
                      <input className="field" value={r.name} placeholder="Nama indikator, misalnya “Menjelaskan urutan LIFO”" onChange={(e) => setRow(r.id, { name: e.target.value })} aria-label={`Nama indikator ${i + 1}`} />
                      <label><span className="sr-only">Konsep indikator {i + 1}</span>
                        <select className="field text-[15px]" value={r.concept} onChange={(e) => setRow(r.id, { concept: e.target.value as ConceptId })}>
                          {(Object.keys(concepts) as ConceptId[]).map((k) => <option key={k} value={k}>{concepts[k]}</option>)}
                        </select>
                      </label>
                    </div>
                    {!r.name.trim() && <p className="mt-1.5 text-[13px] text-warn">Indikator ini belum diberi nama.</p>}
                  </li>
                ))}
              </ul>

              <button className="btn btn-secondary btn-sm mt-4" onClick={() => setRows((x) => [...x, { id: uid(), name: '', concept: 'lifo', weight: 0, on: true }])}><Plus size={15} aria-hidden="true" /> Tambah indikator</button>
              <p className={`mt-4 text-[15px] font-semibold tnum ${sum === 100 ? 'text-plum' : 'text-warn'}`}>Jumlah bobot: {sum}{sum < 100 ? ` · kurang ${100 - sum}` : sum > 100 ? ` · lebih ${sum - 100}` : ''}</p>
            </div>
          )}
        </section>

        <aside className="grid gap-4 xl:sticky xl:top-4">
          <section className="card p-5" aria-labelledby="ringkas-h">
            <h2 id="ringkas-h" className="text-[15px] font-semibold mb-3">Ringkasan sesi</h2>
            <dl className="grid gap-2.5 text-[15px]">
              {[[Users, 'Peserta', `${c.enrolled} mahasiswa`], [ListChecks, 'Pertanyaan', `${qs.length} · ${praktik} praktik, ${terap} penerapan`], [Code2, 'Format', [fmt.kode && 'Teks / Kode', fmt.foto && 'Foto'].filter(Boolean).join(' + ') || '–'], [Clock3, 'Estimasi', `${6 + qs.length * 4 + cap * 2} menit`]].map(([I, l, v]) => {
                const Icon = I as typeof Users
                return <div key={l as string} className="flex items-start gap-2.5"><Icon size={15} className="text-muted mt-1" aria-hidden="true" /><dt className="text-muted w-20 shrink-0">{l as string}</dt><dd className="font-medium">{v as string}</dd></div>
              })}
            </dl>
            <p className="text-[13px] font-semibold text-muted mt-4 mb-2">Alur mahasiswa</p>
            <ol className="text-[15px] flex flex-col gap-1.5">{['Masukkan kode kelas', `Kerjakan ${qs.length} pertanyaan`, `Jawab maksimal ${cap} pertanyaan Boby`].map((s, i) => <li key={s} className="flex gap-2"><span className="tnum text-muted">{i + 1}.</span>{s}</li>)}</ol>
          </section>
          <section className="card p-5" aria-labelledby="cek-h">
            <h2 id="cek-h" className="text-[15px] font-semibold mb-2">Sebelum dipublikasikan</h2>
            {['Tujuan belajar sudah sesuai', 'Pertanyaan sudah saya tinjau', 'Rubrik sudah saya konfirmasi'].map((t, i) => (
              <label key={t} className="flex items-center gap-2.5 py-1.5 text-[15px] cursor-pointer"><input type="checkbox" className="check" checked={checks[i]} onChange={() => setChecks((x) => x.map((v, k) => (k === i ? !v : v)))} />{t}</label>
            ))}
            <p className="text-[13px] text-muted mt-2">Temuan AI tetap ditinjau dosen sebelum pendampingan.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => toast('Draf tersimpan')}><Check size={14} aria-hidden="true" /> Simpan draf</button>
              <button className="btn btn-primary btn-sm" disabled={!ok.every(Boolean)} onClick={() => setPublished(true)}>Publikasikan</button>
            </div>
            {!ok.every(Boolean) && <p className="mt-2 text-[13px] text-muted">{!ok[2] ? 'Lengkapi pertanyaannya dulu.' : !ok[3] ? 'Bobot rubrik aktif harus 100.' : !ok[4] ? 'Centang ketiga konfirmasi.' : 'Lengkapi isian yang ditandai.'}</p>}
          </section>
        </aside>
      </div>
    </AppShell>
  )
}
