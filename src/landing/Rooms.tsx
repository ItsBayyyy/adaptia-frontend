import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from '../lib/router'

// Screenshots of this build's own screens (scripts/shoot-previews.mjs), so every preview is the real interface.
const shots = import.meta.glob('../assets/previews/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const shot = (name: string) => shots[`../assets/previews/${name}.webp`]

const ROOMS = [
  { name: 'Ruang Asesmen', who: 'Mahasiswa', line: 'Praktik, dialog dengan Boby, lalu soal penerapan.', to: '/mahasiswa/sesi/antrean-queue', img: 'ruang-asesmen' },
  { name: 'Tinjauan Hasil', who: 'Dosen', line: 'Bukti terkutip dan keputusan dosen untuk setiap temuan.', to: '/dosen/tinjauan/operasi-stack', img: 'tinjauan' },
  { name: 'Pendampingan', who: 'Dosen', line: 'Dari temuan ke kegiatan penguatan, dalam empat langkah.', to: '/dosen/pendampingan', img: 'pendampingan' },
  { name: 'Perkembangan', who: 'Dosen', line: 'Pemahaman kelas per konsep, dari sesi ke sesi.', to: '/dosen/perkembangan', img: 'perkembangan' },
  { name: 'Dashboard Belajar', who: 'Mahasiswa', line: 'Sesi yang perlu dikerjakan dan kegiatan dari dosen.', to: '/mahasiswa', img: 'dashboard-belajar' },
  { name: 'Pengaturan Sesi', who: 'Dosen', line: 'Tugas, format jawaban, dan rubrik sebelum dipublikasikan.', to: '/dosen/sesi/baru', img: 'pengaturan-sesi' },
]

export default function Rooms() {
  const [cur, setCur] = useState(0)
  return (
    <section aria-labelledby="ruang-h" className="px-[var(--m)] pb-[clamp(96px,12vw,180px)]">
      <div className="grid lg:grid-cols-12 gap-x-8 gap-y-10">
        <div className="lg:col-span-5">
          <h2 id="ruang-h" data-r className="font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.6vw,72px)]">Semua layarnya bisa dicoba.</h2>
          <p data-r className="mt-6 text-[18px] leading-[1.55] max-w-[28rem]">Ruang mahasiswa dan ruang dosen terbuka penuh. Datanya contoh, alurnya sama dengan produk yang akan diuji coba.</p>
          <ul className="mt-10">
            {ROOMS.map((r, i) => (
              <li key={r.name} data-r>
                <Link to={r.to} onMouseEnter={() => setCur(i)} onFocus={() => setCur(i)}
                  className={`group grid grid-cols-[1fr_auto] items-center gap-x-4 py-4 transition-opacity duration-[240ms] ${cur === i ? 'opacity-100' : 'lg:opacity-45 hover:opacity-100'}`}>
                  <span className="font-bold tracking-[-0.025em] text-[clamp(26px,2.6vw,40px)] leading-[1.1]">{r.name}</span>
                  <ArrowUpRight className="transition-transform duration-[250ms] group-hover:translate-x-1 group-hover:-translate-y-1" size={26} aria-hidden="true" />
                  <span className="text-[16px] text-[#4E4B5E] mt-1 col-span-2">{r.who} · {r.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <div className="relative lg:sticky lg:top-[110px] aspect-[16/10] drop-lg overflow-hidden bg-lavender">
            {ROOMS.map((r, i) => shot(r.img) && (
              <img key={r.img} src={shot(r.img)} alt={i === cur ? `Tampilan ${r.name}` : ''} aria-hidden={i !== cur} width={1440} height={900} loading={i ? 'lazy' : undefined}
                className="absolute inset-0 w-full h-full object-cover object-left-top transition-[opacity,transform] duration-[240ms] ease-[var(--ease-smooth-out)]"
                style={{ opacity: i === cur ? 1 : 0, transform: i === cur ? 'scale(1)' : 'scale(1.015)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
