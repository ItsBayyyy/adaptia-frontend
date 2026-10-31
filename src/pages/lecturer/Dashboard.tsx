import { ArrowRight, Copy, Plus } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Link } from '../../lib/router'
import { assignments, classes, classPending, roster, sessions, stackSummary } from '../../lib/data'
import { toast, useStore } from '../../lib/store'
import { SessionRows } from './SessionList'

const prevAvg = sessions.find((s) => s.id === 'stack-vs-queue')!.avg!
export const fmtDelta = (d: number) => (d > 0 ? `naik ${d} poin` : d < 0 ? `turun ${-d} poin` : 'sama')

export default function LecturerDashboard({ path }: { path: string }) {
  const { reviewed, sent } = useStore()
  const waiting = stackSummary.perlu - reviewed.filter((id) => roster.find((r) => r.id === id)?.state === 'perlu').length
  const pendingFindings = waiting * 4
  const running = assignments.filter((a) => a.state === 'pelaksanaan').length + sent.length
  const students = classes.reduce((n, c) => n + c.enrolled, 0)
  const figures = [
    { label: 'Kelas aktif', value: classes.length, sub: 'semester ganjil 2026/2027' },
    { label: 'Mahasiswa', value: students, sub: 'di dua kelas' },
    { label: 'Temuan menunggu keputusan', value: pendingFindings, sub: `${waiting} mahasiswa · Operasi Stack` },
    { label: 'Pendampingan berjalan', value: running, sub: 'kegiatan penguatan aktif' },
  ]
  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen' }, { label: 'Dashboard Kelas' }]}>
      <TitleRow title="Dashboard Kelas"
        finding={waiting > 0 ? <><b className="font-semibold text-ink">{waiting} mahasiswa</b> di Operasi Stack menunggu tinjauan. Rata-rata sementara {stackSummary.avg}, {fmtDelta(stackSummary.avg - prevAvg)} dari “Stack atau Queue?” ({prevAvg}).</> : <>Semua temuan Operasi Stack sudah diputuskan. Lanjutkan ke pendampingan.</>}
        actions={<>
          <Link to="/dosen/sesi/baru" className="btn btn-secondary btn-sm"><Plus size={15} aria-hidden="true" /> Buat sesi asesmen</Link>
          <Link to={waiting > 0 ? '/dosen/tinjauan/operasi-stack' : '/dosen/pendampingan'} data-tour="aksi" className="btn btn-primary btn-sm">{waiting > 0 ? 'Tinjau Operasi Stack' : 'Buka pendampingan'} <ArrowRight size={15} aria-hidden="true" /></Link>
        </>} />

      <section aria-label="Ringkasan angka" data-tour="angka" className="card grid grid-cols-2 lg:grid-cols-4 divide-x divide-line [&>*:nth-child(3)]:max-lg:border-l-0 [&>*:nth-child(n+3)]:max-lg:border-t [&>*:nth-child(n+3)]:max-lg:border-line">
        {figures.map((f) => (
          <div key={f.label} className="p-5">
            <p className="text-[13px] text-muted">{f.label}</p>
            <p className="text-[28px] font-semibold tnum mt-1 leading-none">{f.value}</p>
            <p className="text-[13px] text-muted mt-2">{f.sub}</p>
          </div>
        ))}
      </section>

      <div className="mt-4 grid xl:grid-cols-[1fr_360px] gap-4 items-start">
        <div className="grid gap-4 min-w-0">
          <section aria-labelledby="kelas-h" className="grid sm:grid-cols-2 gap-4">
            <h2 id="kelas-h" className="sr-only">Kelas Anda</h2>
            {classes.map((c) => {
              const pending = c.id === 'if203b' ? pendingFindings : classPending(c.id)
              return (
                <div key={c.id} className="card p-5">
                  <p className="text-[13px] text-muted">{c.code} · {c.group}</p>
                  <p className="text-[20px] font-semibold mt-0.5">{c.name}</p>
                  <p className="text-[15px] text-[#4E4B5E] mt-1">Materi {c.material} · <span className="tnum">{c.enrolled}</span> mahasiswa</p>
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-mist px-3 py-2">
                    <span className="text-[13px] text-muted">Kode kelas <b className="text-ink font-semibold tnum ml-1">{c.joinCode}</b></span>
                    <button className="p-1.5 rounded text-muted hover:text-ink hover:bg-white transition-colors" aria-label={`Salin kode kelas ${c.joinCode}`} onClick={() => { navigator.clipboard?.writeText(c.joinCode); toast(`Kode kelas ${c.joinCode} disalin`) }}><Copy size={15} /></button>
                  </div>
                  <p className={`mt-3 text-[15px] ${pending ? 'text-ink' : 'text-muted'}`}>{pending ? <><b className="font-semibold tnum">{pending}</b> temuan menunggu keputusan</> : 'Tidak ada temuan yang menunggu'}</p>
                </div>
              )
            })}
          </section>

          <section aria-labelledby="sesi-h" className="card p-5 min-w-0">
            <div className="flex items-center justify-between mb-2"><h2 id="sesi-h" className="text-[17px] font-semibold">Sesi asesmen terbaru</h2><Link to="/dosen/sesi" className="text-[15px] font-semibold text-plum hover:underline">Lihat semua {sessions.length}</Link></div>
            <SessionRows rows={sessions.slice(0, 5)} />
          </section>
        </div>

        <section aria-labelledby="lanjut-h" data-tour="tindak" className="card p-5">
          <h2 id="lanjut-h" className="text-[17px] font-semibold">Tindak lanjut</h2>
          <ul className="mt-3 flex flex-col divide-y divide-line">
            {waiting > 0 && (
              <li className="py-3.5">
                <p className="font-semibold">Putuskan temuan Operasi Stack</p>
                <p className="text-[15px] text-muted mt-0.5">{waiting} mahasiswa · {pendingFindings} temuan · terkumpul 28 Okt</p>
                <Link to="/dosen/tinjauan/operasi-stack" className="link-arrow text-[15px] mt-2">Buka tinjauan <ArrowRight size={15} aria-hidden="true" /></Link>
              </li>
            )}
            <li className="py-3.5">
              <p className="font-semibold">“Telusuri push dan pop” lewat batas</p>
              <p className="text-[15px] text-muted mt-0.5">2 dari 3 selesai · Vino Saputra belum, batas 25 Okt</p>
              <Link to="/dosen/pendampingan" className="link-arrow text-[15px] mt-2">Lihat pelaksanaan <ArrowRight size={15} aria-hidden="true" /></Link>
            </li>
            <li className="py-3.5">
              <p className="font-semibold">“Saat stack kosong” berjalan</p>
              <p className="text-[15px] text-muted mt-0.5">0 dari 2 selesai · batas 1 Nov, 23.59</p>
            </li>
            {sent.map((s) => (
              <li key={s.id} className="py-3.5 t-reveal"><p className="font-semibold">“{s.title}” dikirim</p><p className="text-[15px] text-muted mt-0.5">{s.students.length} mahasiswa · batas {s.due}</p></li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-muted">Setiap pendampingan dikirim oleh dosen. Tidak ada penugasan otomatis.</p>
        </section>
      </div>
    </AppShell>
  )
}
