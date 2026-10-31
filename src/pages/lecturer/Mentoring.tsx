import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Avatar, ProgressBar, Tabs } from '../../components/ui'
import { go, Link } from '../../lib/router'
import { activityById, assignments, concepts, NEED, roster } from '../../lib/data'
import { store, useStore } from '../../lib/store'

export function useRecommendations() {
  const { reviewed, sent } = useStore()
  const sentNames = new Set(sent.flatMap((x) => x.students))
  const busy = new Set(assignments.filter((a) => a.state === 'pelaksanaan').flatMap((a) => a.students))
  return roster
    .filter((r) => r.ev && (r.state === 'selesai' || reviewed.includes(r.id)))
    .map((r) => ({ ...r, need: NEED[r.arche!], assigned: sentNames.has(r.name) || busy.has(r.name) }))
}
const NEED_LABEL = { penguatan: ['Perlu penguatan', 'pill-part'], pemantauan: ['Perlu pemantauan', 'pill-ok'], tidak: ['Tidak perlu', 'pill-none'] } as const

export default function Mentoring({ path }: { path: string }) {
  const { sent } = useStore()
  const [tab, setTab] = useState<'rekomendasi' | 'penugasan' | 'pelaksanaan' | 'riwayat'>('rekomendasi')
  const recs = useRecommendations()
  const order = { penguatan: 0, pemantauan: 1, tidak: 2 }
  const rows = [...recs].sort((a, b) => order[a.need.need] - order[b.need.need] || (a.score ?? 0) - (b.score ?? 0))
  const [picked, setPicked] = useState<string[]>(() => rows.filter((r) => r.need.need === 'penguatan' && !r.assigned).slice(0, 3).map((r) => r.id))
  const [focus, setFocus] = useState(rows[0]?.id)
  const f = rows.find((r) => r.id === focus) ?? rows[0]
  const count = (n: keyof typeof order) => recs.filter((r) => r.need.need === n).length
  const running = [...sent.map((x) => ({ id: x.id, title: x.title, students: x.students, start: 'Hari ini', due: x.due, mode: x.mode, done: 0, state: 'pelaksanaan' as const })), ...assignments]

  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Pendampingan' }]}>
      <TitleRow title="Pendampingan"
        finding={<><b className="font-semibold text-ink tnum">{count('penguatan')}</b> mahasiswa perlu penguatan berdasarkan temuan yang sudah Anda putuskan. Rekomendasi dipilih aturan dari bank kegiatan; Anda yang mengirim.</>}
        actions={<button className="btn btn-primary btn-sm" disabled={!picked.length} onClick={() => { store.set({ preselect: picked }); go('/dosen/pendampingan/tugaskan') }}>Tugaskan pendampingan · {picked.length} <ArrowRight size={15} aria-hidden="true" /></button>} />
      <div className="mb-4"><Tabs label="Bagian pendampingan" value={tab} onChange={setTab} tabs={[{ id: 'rekomendasi', label: 'Rekomendasi' }, { id: 'penugasan', label: 'Penugasan' }, { id: 'pelaksanaan', label: 'Pelaksanaan' }, { id: 'riwayat', label: 'Riwayat' }]} /></div>

      <div key={tab} className="t-swap">
        {tab === 'rekomendasi' && (
          <>
            <section aria-label="Ringkasan kebutuhan" className="card grid grid-cols-2 lg:grid-cols-4 divide-x divide-line [&>*:nth-child(3)]:max-lg:border-l-0 [&>*:nth-child(n+3)]:max-lg:border-t [&>*:nth-child(n+3)]:max-lg:border-line mb-4">
              {[['Perlu penguatan', count('penguatan'), 'konsep belum atau sebagian'], ['Perlu pemantauan', count('pemantauan'), 'temuan sebagian'], ['Tidak perlu pendampingan', count('tidak'), 'semua temuan terpenuhi'], ['Sudah diputuskan', recs.length, 'dari 30 yang mengumpulkan']].map(([l, v, sub]) => (
                <div key={l as string} className="p-5"><p className="text-[13px] text-muted">{l}</p><p className="text-[28px] font-semibold tnum leading-none mt-1">{v}</p><p className="text-[13px] text-muted mt-2">{sub}</p></div>
              ))}
            </section>
            <div className="grid 2xl:grid-cols-[1fr_340px] gap-4 items-start">
              <section className="card p-5 min-w-0" aria-labelledby="saran-h">
                <h2 id="saran-h" className="text-[17px] font-semibold mb-2">Mahasiswa yang disarankan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-[15px] min-w-[760px]">
                    <thead><tr className="text-left text-[13px] text-muted"><th className="w-8 py-2"><span className="sr-only">Pilih</span></th><th className="font-medium py-2">Mahasiswa</th><th className="font-medium py-2">Konsep yang perlu dikuatkan</th><th className="font-medium py-2">Ringkasan temuan</th><th className="font-medium py-2">Rekomendasi</th><th className="font-medium py-2">Status</th></tr></thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} className={`border-t border-line row-hover ${focus === r.id ? 'bg-mist' : ''}`} onClick={() => setFocus(r.id)}>
                          <td className="py-3"><input type="checkbox" className="check" aria-label={`Pilih ${r.name}`} disabled={r.assigned} checked={picked.includes(r.id)} onChange={() => setPicked((p) => (p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id]))} onClick={(e) => e.stopPropagation()} /></td>
                          <td className="py-3 pr-3"><div className="flex items-center gap-2.5"><Avatar name={r.name} seed={r.idx} size={28} /><span><span className="block font-semibold whitespace-nowrap">{r.name}</span><span className="block text-[13px] text-muted tnum">{r.nim}</span></span></div></td>
                          <td className="py-3 pr-3"><div className="flex flex-wrap gap-1">{r.need.concepts.length ? r.need.concepts.map((c) => <span key={c} className="pill pill-none !h-6">{concepts[c]}</span>) : <span className="text-muted">–</span>}</div></td>
                          <td className="py-3 pr-3 text-[#4E4B5E] max-w-[260px]">{r.ev!.summary}</td>
                          <td className="py-3 pr-3 whitespace-nowrap">{r.need.need === 'tidak' ? <span className="text-muted">Tantangan opsional</span> : activityById(r.need.activity).title}</td>
                          <td className="py-3"><span className={`pill ${r.assigned ? 'pill-ink' : NEED_LABEL[r.need.need][1]}`}>{r.assigned ? 'Sudah ditugaskan' : NEED_LABEL[r.need.need][0]}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              {f && (
                <aside className="card p-5 2xl:sticky 2xl:top-4" aria-labelledby="detail-h">
                  <h2 id="detail-h" className="text-[15px] font-semibold">Detail rekomendasi</h2>
                  <div className="flex items-center gap-2.5 mt-3"><Avatar name={f.name} seed={f.idx} size={36} /><div><p className="font-semibold">{f.name}</p><p className="text-[13px] text-muted">Skor Operasi Stack <span className="tnum">{f.score}</span></p></div></div>
                  <p className="text-[13px] font-semibold text-muted mt-4">Temuan utama</p>
                  <p className="mt-1 text-[15px] rounded-md bg-mist p-3">“{f.ev!.findings.find((x) => x.status !== 'terpenuhi')?.quote ?? f.ev!.findings[0].quote}”</p>
                  <p className="text-[13px] font-semibold text-muted mt-4">Kegiatan yang disarankan</p>
                  {(() => { const a = activityById(f.need.activity); return (
                    <div className="mt-1.5 rounded-md border border-line p-3"><p className="text-[13px] font-semibold text-plum">{a.kind}</p><p className="font-semibold">{a.title}</p><p className="text-[13px] text-muted mt-0.5">{a.minutes} menit · {a.level}</p></div>
                  ) })()}
                  <p className="text-[13px] text-muted mt-3">Rekomendasi dicocokkan dari konsep temuan ke bank kegiatan. Anda bisa memilih kegiatan lain di langkah berikutnya.</p>
                </aside>
              )}
            </div>
          </>
        )}

        {(tab === 'penugasan' || tab === 'pelaksanaan' || tab === 'riwayat') && (
          <section className="card p-5" aria-label={tab}>
            {(() => {
              const list = tab === 'riwayat' ? running.filter((a) => a.state === 'riwayat') : tab === 'penugasan' ? running.filter((a) => sent.some((x) => x.id === a.id)) : running.filter((a) => a.state === 'pelaksanaan')
              if (!list.length) return <p className="py-10 text-center text-muted">{tab === 'penugasan' ? 'Belum ada penugasan baru. Pilih mahasiswa di tab Rekomendasi.' : 'Belum ada pendampingan di sini.'}</p>
              return (
                <ul className="flex flex-col divide-y divide-line">
                  {list.map((a) => (
                    <li key={a.id} className="py-4 grid md:grid-cols-[1fr_220px_auto] gap-x-6 gap-y-3 items-center">
                      <div><p className="font-semibold">{a.title}</p><p className="text-[13px] text-muted mt-0.5">{a.students.join(', ')}</p></div>
                      <div><ProgressBar value={a.done / a.students.length} label={`Kemajuan ${a.title}`} /><p className="text-[13px] text-muted mt-1.5 tnum">{a.done} dari {a.students.length} selesai · {a.mode}</p></div>
                      <p className="text-[13px] text-muted md:text-right tnum">{tab === 'riwayat' ? 'Selesai' : 'Batas'} {a.due}</p>
                    </li>
                  ))}
                </ul>
              )
            })()}
            {tab === 'penugasan' && <Link to="/dosen/pendampingan/tugaskan" className="btn btn-secondary btn-sm mt-3">Buat penugasan baru</Link>}
          </section>
        )}
      </div>
    </AppShell>
  )
}
