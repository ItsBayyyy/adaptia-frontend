import { useState } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { Link, scrollToId } from '../lib/router'

const shots = import.meta.glob('../assets/previews/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const shot = (name: string) => shots[`../assets/previews/${name}.webp`]

const FAQ = [
  { tab: 'Bedanya', q: 'Apa bedanya dengan ChatGPT atau AI tutor?', a: 'AI tutor menjelaskan materi kepada mahasiswa. ADAPTIA membalik arahnya: mahasiswa yang menjelaskan, Boby yang bertanya dan sengaja keliru. Hasilnya tidak berhenti di layar mahasiswa, tetapi sampai ke dosen sebagai kalimat yang bisa diperiksa.' },
  { tab: 'Kecurangan', q: 'Apakah ADAPTIA mendeteksi kecurangan?', a: 'Tidak. ADAPTIA adalah alat asesmen formatif: tujuannya menemukan konsep yang perlu didampingi, bukan menghukum. Jika mahasiswa menempel teks panjang sekaligus, sistem hanya mencatatnya sebagai informasi untuk dosen, tidak pernah sebagai tuduhan.' },
  { tab: 'Nilai', q: 'Apakah skornya masuk nilai akhir?', a: 'Tidak otomatis. Skor berlabel sementara sampai dosen meninjau setiap temuan, dan dosen yang memutuskan apakah serta bagaimana hasilnya dipakai.' },
  { tab: 'AI keliru', q: 'Bagaimana kalau AI salah menilai?', a: 'Setiap temuan hanyalah usulan. Dosen bisa menerima, mengoreksi, atau menolaknya. Koreksi itu dipakai untuk mengukur kesepakatan AI dengan dosen, dengan target Cohen’s kappa minimal 0,6 sebelum materi baru dibuka.' },
  { tab: 'Data', q: 'Siapa yang bisa melihat transkrip mahasiswa?', a: 'Hanya mahasiswa yang bersangkutan dan dosen kelasnya. Transkrip tidak dipakai untuk melatih model pihak ketiga, dan tidak ada peringkat antarmahasiswa.' },
  { tab: 'Materi', q: 'Materi apa yang sudah tersedia?', a: 'Uji coba dimulai dengan dua materi: Stack & Queue (Struktur Data) dan Peluang (Statistika Dasar). Materi lain menyusul setelah rubrik dan bank jebakannya disusun bersama ahli materi.' },
]
const TONES = ['bg-lavender', 'bg-peach', 'bg-white']

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="pertanyaan" aria-labelledby="faq-h" className="px-[var(--m)] pb-[clamp(72px,8vw,128px)]">
      <div className="lg:mx-[16.66%]">
        <h2 id="faq-h" data-r className="font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.6vw,72px)] mb-20">Pertanyaan yang wajar.</h2>
        <div className="faq-stack">
          {FAQ.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.tab} data-r className={`faq-card relative ${TONES[i % 3]} mt-2`} style={{ ['--i' as string]: i, zIndex: i + 1 }}>
                <span aria-hidden="true" className={`faq-tab ${TONES[i % 3]}`}>{f.tab}</span>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full text-left px-6 sm:px-8 pt-6 pb-10 text-[20px] font-semibold leading-snug flex justify-between gap-6 hover:text-plum transition-colors duration-150">
                    {f.q}<span aria-hidden="true" className={`dot-drop text-accent mt-2 transition-transform duration-[250ms] ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className="grid transition-[grid-template-rows] duration-[250ms] ease-[var(--ease-smooth-out)]" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden"><p className="px-6 sm:px-8 pb-12 text-[17px] leading-[1.6] max-w-[50ch]">{f.a}</p></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section aria-labelledby="cta-h" className="pb-[clamp(72px,8vw,120px)] overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 lg:-mx-[6vw]">
        <div className="hidden lg:block lg:col-span-2 h-[360px] rounded-[10px] overflow-hidden bg-lavender">
          {shot('ruang-asesmen') && <img src={shot('ruang-asesmen')} alt="" width={1440} height={900} loading="lazy" className="w-full h-full object-cover object-[62%_30%]" />}
        </div>
        <div data-r className="col-span-2 lg:col-span-8 bg-accent rounded-[10px] min-h-[300px] lg:h-[360px] p-8 sm:p-10 grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <h2 id="cta-h" className="font-bold tracking-[-0.03em] leading-[1.05] text-[clamp(30px,2.9vw,44px)]">Mulai dari satu kelas, satu topik.</h2>
            <p className="mt-3 text-[17px] leading-[1.55] max-w-[30rem]">Buat sesi asesmen, bagikan kode kelas, dan baca bukti pemahaman mahasiswa sebelum ujian, bukan sesudahnya.</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/dosen/sesi/baru" className="btn btn-primary">Buat sesi asesmen <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link to="/mahasiswa" className="font-semibold underline decoration-2 underline-offset-4 hover:no-underline">atau masuk sebagai mahasiswa</Link>
            </div>
          </div>
          <ol data-ui className="hidden md:flex flex-col gap-2 w-[300px] text-[15px]">
            {[['Buat sesi', 'Operasi Stack · Asesmen awal'], ['Bagikan kode kelas', 'SD-B26 · 35 mahasiswa'], ['Tinjau bukti', '8 mahasiswa menunggu']].map(([t, d], i) => (
              <li key={t} className="bg-white drop px-4 py-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-lavender text-plum grid place-content-center font-semibold tnum shrink-0">{i + 1}</span>
                <span><span className="block font-semibold leading-tight">{t}</span><span className="block text-[13px] text-muted">{d}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-2 h-[120px] lg:h-[360px] rounded-[10px] bg-peach" />
        <div className="lg:hidden h-[120px] rounded-[10px] overflow-hidden bg-lavender">
          {shot('ruang-asesmen') && <img src={shot('ruang-asesmen')} alt="" width={1440} height={900} loading="lazy" className="w-full h-full object-cover object-[62%_30%]" />}
        </div>
      </div>
    </section>
  )
}

const BLOCKS = [
  { l: 'A', c: '#6A39BF', h: 100 }, { l: 'D', c: '#9E61FD', h: 74 }, { l: 'A', c: '#2A272D', h: 88 },
  { l: 'P', c: '#A770FC', h: 62 }, { l: 'T', c: '#1E1C27', h: 94 }, { l: 'I', c: '#9E61FD', h: 70 }, { l: 'A', c: '#6A39BF', h: 84 },
]

export function Footer() {
  return (
    <footer className="bg-lavender px-[var(--m)] pt-[clamp(56px,6vw,96px)] pb-8">
      <p className="text-[20px] font-semibold mb-10">Jawaban bisa disalin. Pemahaman tidak.</p>
      <div role="img" aria-label="ADAPTIA" className="footer-mark flex items-end gap-1 h-[clamp(150px,24vw,340px)]">
        {BLOCKS.map((b, i) => (
          <span key={i} data-block className="flex-1 flex items-end justify-center overflow-hidden rounded-[8px_2px_8px_8px]" style={{ background: b.c, height: `${b.h}%` }}>
            <span className="font-extrabold text-ivory leading-[0.8] tracking-[-0.04em] text-[clamp(44px,11vw,190px)] translate-y-[0.06em]">{b.l}</span>
          </span>
        ))}
      </div>
      <div className="mt-14 grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 text-[15px]">
        <nav aria-label="Bagian halaman" className="lg:col-span-2 flex flex-col gap-2">
          <p className="font-semibold mb-1">Produk</p>
          {[['masalah', 'Masalah'], ['cara-kerja', 'Cara kerja'], ['coba', 'Coba betulkan Boby'], ['peta', 'Peta kelas'], ['pertanyaan', 'Pertanyaan']].map(([id, l]) => (
            <a key={id} href="#/" onClick={(e) => { e.preventDefault(); scrollToId(id) }} className="hover:text-plum transition-colors">{l}</a>
          ))}
        </nav>
        <nav aria-label="Ruang" className="lg:col-span-2 flex flex-col gap-2">
          <p className="font-semibold mb-1">Ruang</p>
          <Link to="/mahasiswa" className="hover:text-plum transition-colors">Ruang mahasiswa</Link>
          <Link to="/dosen" className="hover:text-plum transition-colors">Ruang dosen</Link>
          <Link to="/dosen/tinjauan/operasi-stack" className="hover:text-plum transition-colors">Tinjauan hasil</Link>
          <Link to="/dosen/pendampingan" className="hover:text-plum transition-colors">Pendampingan</Link>
        </nav>
        <div className="lg:col-span-2 flex flex-col gap-2">
          <p className="font-semibold mb-1">Materi uji coba</p>
          <span>Stack & Queue</span><span>Peluang</span>
        </div>
        <div className="lg:col-span-2" />
        <div className="col-span-2 lg:col-span-4 flex flex-col gap-2 lg:text-right">
          <p>Asesmen formatif untuk kelas kampus di Indonesia: mahasiswa mengajari Boby, dosen membaca buktinya.</p>
          <p className="text-[#4E4B5E]">Purwarupa statis. Semua nama dan angka adalah data contoh.</p>
        </div>
      </div>
      <div className="mt-14 flex items-center justify-between gap-4 text-[14px]">
        <p>© 2026 ADAPTIA</p>
        <button className="btn btn-sm btn-primary" onClick={() => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Kembali ke atas <ArrowUp size={15} aria-hidden="true" /></button>
      </div>
    </footer>
  )
}
