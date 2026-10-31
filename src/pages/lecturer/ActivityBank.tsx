import { useState } from 'react'
import { Clock3, Plus, X } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Tabs } from '../../components/ui'
import { activities as seed, concepts, type Activity, type ConceptId } from '../../lib/data'
import { toast } from '../../lib/store'

const KINDS: Activity['kind'][] = ['Latihan bertahap', 'Studi kasus', 'Modul interaktif', 'Video pembelajaran']

export default function ActivityBank({ path }: { path: string }) {
  const [items, setItems] = useState(seed)
  const [mat, setMat] = useState<'stack' | 'peluang'>('stack')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ title: '', kind: KINDS[0], concept: 'pilih' as ConceptId, minutes: 15, goal: '' })
  const stackIds: ConceptId[] = ['lifo', 'pushpop', 'fifo', 'pilih', 'underflow']
  const inMat = (a: Activity) => a.concepts.some((c) => (mat === 'stack' ? stackIds.includes(c) : !stackIds.includes(c)))
  const list = items.filter(inMat)
  const valid = draft.title.trim().length >= 4 && draft.goal.trim().length >= 10

  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Bank Kegiatan' }]}>
      <TitleRow title="Bank Kegiatan Penguatan"
        finding={<><span className="tnum">{items.filter((a) => a.active).length}</span> kegiatan aktif. Rekomendasi pendampingan hanya memilih dari bank ini; AI tidak membuat kegiatan baru.</>}
        actions={<button data-tour="tambah-kegiatan" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Plus size={15} aria-hidden="true" /> Tambah kegiatan</button>} />
      <div className="mb-4"><Tabs label="Materi" value={mat} onChange={setMat} tabs={[{ id: 'stack', label: 'Stack & Queue' }, { id: 'peluang', label: 'Peluang' }]} /></div>

      <div className="grid xl:grid-cols-[1fr_380px] gap-4 items-start">
        <section key={mat} className="card t-swap" aria-label="Daftar kegiatan">
          <ul className="divide-y divide-line">
            {list.map((a) => (
              <li key={a.id} className="p-5 grid md:grid-cols-[1fr_auto] gap-4 items-start">
                <div className={a.active ? '' : 'opacity-55'}>
                  <p className="text-[13px] font-semibold text-plum">{a.kind}</p>
                  <p className="font-semibold text-[17px] mt-0.5">{a.title}</p>
                  <p className="text-[15px] text-[#4E4B5E] mt-1 max-w-[64ch]">{a.goal}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted"><span className="inline-flex items-center gap-1"><Clock3 size={13} aria-hidden="true" />{a.minutes} menit</span><span>{a.level}</span><span>{a.concepts.map((c) => concepts[c]).join(', ')}</span></p>
                </div>
                <label className="inline-flex items-center gap-2.5 text-[15px] cursor-pointer select-none">
                  <span className={a.active ? 'text-ink font-medium' : 'text-muted'}>{a.active ? 'Aktif' : 'Nonaktif'}</span>
                  <button role="switch" aria-checked={a.active} aria-label={`Aktifkan ${a.title}`} onClick={() => setItems((xs) => xs.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)))}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-[250ms] ${a.active ? 'bg-ink' : 'bg-[#D9D0E4]'}`}>
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]" style={{ transform: a.active ? 'translateX(20px)' : 'none' }} />
                  </button>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {adding ? (
          <section className="card p-5 xl:sticky xl:top-4 t-reveal" aria-labelledby="baru-h">
            <div className="flex items-center justify-between"><h2 id="baru-h" className="text-[17px] font-semibold">Kegiatan baru</h2><button className="p-1.5 rounded text-muted hover:text-ink hover:bg-mist" aria-label="Tutup formulir" onClick={() => setAdding(false)}><X size={16} /></button></div>
            <form className="mt-4 grid gap-4" onSubmit={(e) => {
              e.preventDefault(); if (!valid) return
              setItems((xs) => [{ id: 'baru-' + xs.length, title: draft.title.trim(), kind: draft.kind, concepts: [draft.concept], minutes: draft.minutes, level: 'Menengah', goal: draft.goal.trim(), steps: [], outcome: '', active: true }, ...xs])
              setMat(stackIds.includes(draft.concept) ? 'stack' : 'peluang'); setAdding(false); setDraft({ ...draft, title: '', goal: '' }); toast('Kegiatan ditambahkan ke bank')
            }}>
              <div><label htmlFor="judul" className="label">Judul</label><input id="judul" className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Misalnya: Antrean di loket akademik" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label htmlFor="jenis" className="label">Jenis</label><select id="jenis" className="field" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as Activity['kind'] })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></div>
                <div><label htmlFor="menit" className="label">Durasi (menit)</label><input id="menit" type="number" min={5} max={60} className="field tnum" value={draft.minutes} onChange={(e) => setDraft({ ...draft, minutes: +e.target.value })} /></div>
              </div>
              <div><label htmlFor="konsep-baru" className="label">Konsep</label><select id="konsep-baru" className="field" value={draft.concept} onChange={(e) => setDraft({ ...draft, concept: e.target.value as ConceptId })}>{Object.entries(concepts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label htmlFor="tujuan" className="label">Tujuan belajar</label><textarea id="tujuan" className="field" rows={3} value={draft.goal} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} aria-describedby="tujuan-hint" /><p id="tujuan-hint" className="text-[13px] text-muted mt-1">Minimal 10 karakter. Ditampilkan ke mahasiswa.</p></div>
              <button type="submit" className="btn btn-primary" disabled={!valid}>Simpan ke bank</button>
            </form>
          </section>
        ) : (
          <aside className="rounded-lg bg-mist p-5 text-[15px]" aria-labelledby="cara-h">
            <h2 id="cara-h" className="font-semibold">Bagaimana bank ini dipakai</h2>
            <p className="mt-2 text-[#4E4B5E]">Saat Anda menekan “Tentukan pendampingan”, aturan mencocokkan konsep yang belum atau sebagian terpenuhi dengan kegiatan aktif di sini, lalu mengurutkannya. Anda tetap memilih kegiatan akhirnya.</p>
            <p className="mt-2 text-[#4E4B5E]">Kegiatan nonaktif tidak muncul sebagai rekomendasi, tetapi riwayatnya tetap tersimpan.</p>
          </aside>
        )}
      </div>
    </AppShell>
  )
}
