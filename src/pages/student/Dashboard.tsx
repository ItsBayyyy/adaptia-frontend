import { ArrowRight, CalendarClock } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { ProgressBar } from '../../components/ui'
import { Link } from '../../lib/router'
import JoinClass from '../../components/JoinClass'
import { activityById, classes, myActivities, mySessions, openClasses, queueTask } from '../../lib/data'
import { useStore } from '../../lib/store'
import { SessionTable } from './Sessions'

export function StageDots({ stage }: { stage: number }) {
  const names = ['Praktik', 'Reverse-Tutor', 'Penerapan']
  return (
    <ol className="flex items-center gap-2 text-[13px]" aria-label="Tahap sesi">
      {names.map((n, i) => (
        <li key={n} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className={`w-6 h-px ${i <= stage ? 'bg-ink' : 'bg-[#D9D0E4]'}`} />}
          <span className={`inline-flex items-center gap-1.5 ${i === stage ? 'font-semibold text-ink' : i < stage ? 'text-ink' : 'text-muted'}`} aria-current={i === stage ? 'step' : undefined}>
            <span aria-hidden="true" className={`w-2 h-2 rounded-full ${i < stage ? 'bg-ink' : i === stage ? 'bg-accent' : 'bg-[#D9D0E4]'}`} />{n}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function StudentDashboard({ path }: { path: string }) {
  const { joined } = useStore()
  const cur = mySessions[0]
  const act = myActivities.find((a) => a.state !== 'Selesai')!
  const a = activityById(act.activity)
  return (
    <AppShell role="mahasiswa" path={path} crumbs={[{ label: 'Ruang Mahasiswa' }, { label: 'Dashboard Belajar' }]}>
      <TitleRow title="Dashboard Belajar"
        finding={<>Satu sesi sedang kamu kerjakan, batasnya <b className="font-semibold text-ink">{cur.due}</b>. Kegiatan penguatan dari dosen harus selesai <b className="font-semibold text-ink">1 Nov</b>.</>} />

      <div className="grid xl:grid-cols-[1fr_380px] gap-4">
        <section aria-labelledby="lanjut-h" data-tour="sesi" className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[15px] text-muted">{cur.className} · {queueTask.type}</p>
              <h2 id="lanjut-h" className="text-[25px] font-bold tracking-[-0.02em] mt-1">{cur.title}</h2>
            </div>
            <span className="pill pill-ok">{cur.state}</span>
          </div>
          <div className="mt-5" data-tour="tahap"><StageDots stage={cur.stage} /></div>
          <p className="mt-5 text-[15px] text-[#4E4B5E] max-w-[60ch]">Jawaban praktikmu tersimpan sebagai draf. Kirim, lalu jelaskan jawabanmu kepada Boby. Dia akan bertanya “kenapa?” dan kadang sengaja keliru; kamu bisa menjawab dengan teks atau suara.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to={`/mahasiswa/sesi/${cur.id}`} className="btn btn-primary">Lanjutkan sesi <ArrowRight size={16} aria-hidden="true" /></Link>
            <span className="inline-flex items-center gap-1.5 text-[15px] text-muted"><CalendarClock size={16} aria-hidden="true" /> Batas {queueTask.due}</span>
          </div>
        </section>

        <section aria-labelledby="penguatan-h" data-tour="penguatan" className="card p-6 flex flex-col">
          <div className="flex items-center justify-between"><h2 id="penguatan-h" className="text-[17px] font-semibold">Kegiatan penguatan</h2><Link to="/mahasiswa/penguatan" className="text-[15px] font-semibold text-plum hover:underline">Lihat semua</Link></div>
          <p className="text-[13px] font-semibold text-plum mt-4">{a.kind} · ditugaskan {act.from}</p>
          <p className="text-[20px] font-semibold mt-1 leading-snug">{a.title}</p>
          <p className="text-[15px] text-[#4E4B5E] mt-1.5">{a.goal}</p>
          <div className="mt-4"><ProgressBar value={act.progress / act.total} label="Kemajuan kegiatan" /></div>
          <p className="text-[13px] text-muted mt-2 tnum">{act.progress} dari {act.total} langkah · selesai sebelum {act.due}</p>
          <Link to="/mahasiswa/penguatan" className="btn btn-secondary btn-sm mt-auto self-start">Buka kegiatan</Link>
        </section>
      </div>

      <section aria-labelledby="sesi-h" className="mt-4">
        <SessionTable headingId="sesi-h" />
      </section>

      <section aria-labelledby="kelas-h" className="mt-4 card p-6" data-tour="kelas">
        <h2 id="kelas-h" className="text-[17px] font-semibold mb-4">Kelas saya</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {[...classes, ...openClasses.filter((o) => joined.includes(o.id))].map((c) => (
            <li key={c.id} className="rounded-lg bg-mist p-4 flex items-center justify-between gap-4">
              <div><p className="font-semibold">{c.name} · {c.group}</p><p className="text-[15px] text-muted">{c.code} · materi {c.material} · Dr. Rina Anggraini</p></div>
              <span className="kbd tnum">{c.joinCode}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4"><JoinClass /></div>
      </section>
    </AppShell>
  )
}
