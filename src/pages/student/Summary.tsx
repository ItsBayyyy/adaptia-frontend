import { ArrowRight, Check, MessageSquareQuote } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Link } from '../../lib/router'
import { activityById, myReview as R } from '../../lib/data'

export default function Summary({ path }: { path: string }) {
  const a = activityById('lb-underflow')
  return (
    <AppShell role="mahasiswa" path={path} crumbs={[{ label: 'Ruang Mahasiswa', to: '/mahasiswa' }, { label: 'Sesi Belajar', to: '/mahasiswa/sesi' }, { label: 'Ringkasan' }]}>
      <TitleRow title={`Ringkasan: ${R.title}`} finding={<>Ditinjau {R.reviewedBy} pada {R.reviewedOn}. Dua konsep sudah kuat, satu perlu diperjelas.</>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="card p-6" aria-labelledby="kuat-h">
          <h2 id="kuat-h" className="text-[17px] font-semibold">Sudah kuat</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {R.strong.map((s) => (
              <li key={s.concept} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-ok-bg text-plum grid place-content-center shrink-0"><Check size={15} strokeWidth={2.5} aria-hidden="true" /></span>
                <div><p className="font-semibold">{s.concept}</p><p className="text-[15px] text-[#4E4B5E] mt-0.5">{s.note}</p></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6" aria-labelledby="jelas-h">
          <h2 id="jelas-h" className="text-[17px] font-semibold">Perlu diperjelas</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {R.clarify.map((s) => (
              <li key={s.concept} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-part-bg text-part-ink grid place-content-center shrink-0 font-bold text-[15px]" aria-hidden="true">?</span>
                <div><p className="font-semibold">{s.concept}</p><p className="text-[15px] text-[#4E4B5E] mt-0.5">{s.note}</p></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="mt-4 rounded-lg bg-mist p-6 grid lg:grid-cols-[1fr_auto] gap-6 items-center" aria-labelledby="catatan-h">
        <div className="flex gap-3">
          <MessageSquareQuote size={20} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
          <div><h2 id="catatan-h" className="font-semibold">Catatan dosen</h2><p className="mt-1 text-[17px] max-w-[64ch]">{R.lecturerNote}</p></div>
        </div>
        <div className="card p-4 min-w-[260px]">
          <p className="text-[13px] font-semibold text-plum">{a.kind}</p>
          <p className="font-semibold mt-0.5">{a.title}</p>
          <p className="text-[13px] text-muted mt-0.5">{a.minutes} menit · selesai sebelum 1 Nov</p>
          <Link to="/mahasiswa/penguatan" className="link-arrow text-[15px] mt-3">Buka kegiatan <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
      <p className="mt-6 text-[15px] text-muted max-w-[70ch]">Ringkasan ini ditulis dari temuan yang sudah diputuskan dosen. Tidak ada peringkat dan tidak ada angka yang dibandingkan dengan teman sekelas.</p>
    </AppShell>
  )
}
