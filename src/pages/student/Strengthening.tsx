import { useState } from 'react'
import { CalendarClock, Clock3 } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { ProgressBar, SuccessCheck } from '../../components/ui'
import { activityById, myActivities } from '../../lib/data'
import { toast } from '../../lib/store'

export default function Strengthening({ path }: { path: string }) {
  const cur = myActivities[0]
  const a = activityById(cur.activity)
  const [done, setDone] = useState<boolean[]>(a.steps.map((_, i) => i < cur.progress))
  const [finished, setFinished] = useState(false)
  const n = done.filter(Boolean).length
  const past = myActivities.filter((x) => x.state === 'Selesai')
  return (
    <AppShell role="mahasiswa" path={path} crumbs={[{ label: 'Ruang Mahasiswa', to: '/mahasiswa' }, { label: 'Kegiatan Penguatan' }]}>
      <TitleRow title="Kegiatan Penguatan" finding="Kegiatan ini dipilih dosen dari hasil tinjauan sesimu. Selesaikan sebelum batas waktu, lalu pemeriksaan ulang akan terbuka." />
      <div className="grid xl:grid-cols-[1fr_360px] gap-4 items-start">
        <section className="card p-6" aria-labelledby="aktif-h">
          {finished ? (
            <div className="py-10 flex flex-col items-center text-center">
              <SuccessCheck size={60} />
              <h2 id="aktif-h" className="text-[25px] font-bold mt-5">Kegiatan selesai</h2>
              <p className="text-[15px] text-[#4E4B5E] mt-2 max-w-[46ch]">Dosen sudah diberi tahu. Pemeriksaan ulang tentang “{a.title}” sekarang terbuka di Sesi Belajar.</p>
            </div>
          ) : (
            <>
              <p className="text-[13px] font-semibold text-plum">{a.kind} · ditugaskan {cur.from}</p>
              <h2 id="aktif-h" className="text-[25px] font-bold tracking-[-0.02em] mt-1">{a.title}</h2>
              <p className="text-[15px] text-[#4E4B5E] mt-2 max-w-[64ch]">{a.goal}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted">
                <span className="inline-flex items-center gap-1.5"><Clock3 size={15} aria-hidden="true" />{a.minutes} menit · {a.level}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarClock size={15} aria-hidden="true" />Selesai sebelum {cur.due} · {cur.mode}</span>
              </div>
              <h3 className="mt-6 text-[15px] font-semibold">Langkah</h3>
              <ul className="mt-2 flex flex-col">
                {a.steps.map((s, i) => (
                  <li key={s} className="border-t border-line first:border-t-0">
                    <label className="flex items-center gap-3 py-3 cursor-pointer">
                      <input type="checkbox" className="check" checked={done[i]} onChange={() => setDone((d) => d.map((v, k) => (k === i ? !v : v)))} />
                      <span className={`text-[15px] ${done[i] ? 'text-muted line-through decoration-[#C9C2D6]' : ''}`}>{s}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-4"><ProgressBar value={n / a.steps.length} label="Kemajuan kegiatan" /></div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[15px] text-muted tnum">{n} dari {a.steps.length} langkah</p>
                <button className="btn btn-primary" disabled={n < a.steps.length} onClick={() => { setFinished(true); toast('Kegiatan selesai. Dosen sudah diberi tahu.') }}>Tandai selesai</button>
              </div>
            </>
          )}
        </section>
        <aside className="grid gap-4">
          <section className="card p-5" aria-labelledby="hasil-h">
            <h2 id="hasil-h" className="text-[15px] font-semibold">Hasil yang diharapkan</h2>
            <p className="text-[15px] mt-2">{a.outcome}</p>
          </section>
          <section className="card p-5" aria-labelledby="riwayat-h">
            <h2 id="riwayat-h" className="text-[15px] font-semibold mb-3">Riwayat</h2>
            <ul className="flex flex-col gap-3 text-[15px]">
              {past.map((p) => { const x = activityById(p.activity); return (
                <li key={p.activity} className="flex items-center justify-between gap-3"><div><p className="font-semibold">{x.title}</p><p className="text-muted text-[13px]">{x.kind} · {p.due.split(',')[0]}</p></div><span className="pill pill-ok">Selesai</span></li>
              ) })}
            </ul>
          </section>
        </aside>
      </div>
    </AppShell>
  )
}
