import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Check, X } from 'lucide-react'
import { onceInView, prefersReduced } from '../lib/motion'
import { roster, stackTask } from '../lib/data'

const nadia = roster[0]

export function Problem() {
  const fig = useRef<HTMLElement>(null)
  useGSAP(() => {
    const q = gsap.utils.selector(fig)
    const calm = prefersReduced()
    gsap.set(q('[data-p]'), { autoAlpha: 0, y: calm ? 0 : 18 })
    gsap.set(q('[data-squiggle]'), { strokeDashoffset: 1 })
    return onceInView(fig.current, () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to(q('[data-p="a"]'), { autoAlpha: 1, y: 0, duration: 0.6 })
        .to(q('[data-p="a-stamp"]'), { autoAlpha: 1, y: 0, duration: 0.4 }, '+=0.1')
        .to(q('[data-p="b"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '+=0.5')
        .to(q('[data-squiggle]'), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '+=0.1')
        .to(q('[data-p="b-stamp"]'), { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3')
        .to(q('[data-p="foot"]'), { autoAlpha: 1, y: 0, duration: 0.6 }, '+=0.3')
    }, 0.3)
  }, { scope: fig })

  const ans = nadia.ev!.answers[0]
  const hit = 'stack supaya dokumen terbaru dicetak dulu'
  const k = ans.indexOf(hit)
  console.assert(k >= 0, 'problem quote must contain the highlighted phrase')

  return (
    <section id="masalah" aria-labelledby="masalah-h" className="bg-peach px-[var(--m)] py-[clamp(96px,11vw,170px)]">
      <div className="grid lg:grid-cols-12 gap-x-8 gap-y-12 items-start">
        <div className="lg:col-span-6">
          <h2 id="masalah-h" data-r className="font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.4vw,68px)]">Jawabannya benar.<br />Pahamnya belum.</h2>
          <div className="mt-8 flex flex-col gap-4 text-[18px] leading-[1.55] max-w-[34rem]">
            <p data-r>Nadia menulis isi akhir stack dengan benar. Lalu, di soal penerapan, ia memilih stack untuk antrean printer agar dokumen terbaru dicetak lebih dulu. Konsepnya tertukar, dan nilai tugas tidak akan menunjukkannya.</p>
            <p data-r>Jawaban akhir kini bisa didapat dari AI dalam hitungan detik. Yang lebih sulit disalin adalah penjelasan langsung, saat ditanya balik.</p>
            <p data-r>Di kelas berisi 35 mahasiswa, dosen tidak sempat menanyai satu per satu. ADAPTIA menanyai lewat Boby, lalu menyerahkan buktinya kepada dosen.</p>
          </div>
        </div>
        <figure ref={fig} data-ui className="lg:col-span-6 bg-white drop-lg p-6 sm:p-9">
          <figcaption className="text-[14px] text-muted mb-6">Contoh jawaban pada sesi “{stackTask.title}”. Nama dan jawaban fiktif.</figcaption>
          <div data-p="a" className="flex gap-4 items-start">
            <span className="w-10 h-10 rounded-full bg-ok-bg text-plum grid place-content-center shrink-0"><Check size={19} strokeWidth={2.6} aria-label="Benar" /></span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-muted">Tahap praktik</p>
              <p className="font-semibold text-[18px] mt-0.5">Isi akhir stack: [3, 5]</p>
              <p className="text-[15px] text-[#4E4B5E] mt-1 leading-snug">“{nadia.ev!.explain}”</p>
              <span data-p="a-stamp" className="pill pill-ok mt-3">Jawaban benar</span>
            </div>
          </div>
          <div data-p="b" className="flex gap-4 items-start mt-7 pt-7 border-t border-line">
            <span className="w-10 h-10 rounded-full bg-part-bg text-part-ink grid place-content-center shrink-0"><X size={19} strokeWidth={2.6} aria-label="Keliru" /></span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-muted">Tahap penerapan</p>
              <p className="font-semibold text-[18px] mt-0.5">Antrean printer laboratorium</p>
              <p className="text-[15px] text-[#4E4B5E] mt-1 leading-[1.7]">“{ans.slice(0, k)}<span className="relative inline-block text-ink font-medium">{hit}
                <svg aria-hidden="true" viewBox="0 0 300 10" preserveAspectRatio="none" className="absolute left-0 -bottom-[5px] w-full h-[9px] overflow-visible">
                  <path data-squiggle d="M1 6 Q 9 1 17 6 T 33 6 T 49 6 T 65 6 T 81 6 T 97 6 T 113 6 T 129 6 T 145 6 T 161 6 T 177 6 T 193 6 T 209 6 T 225 6 T 241 6 T 257 6 T 273 6 T 289 6 T 299 5" pathLength={1} strokeDasharray="1" fill="none" stroke="#B5452E" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                </svg></span>{ans.slice(k + hit.length)}”</p>
              <span data-p="b-stamp" className="pill pill-part mt-3">Keliru: memilih stack untuk antrean</span>
            </div>
          </div>
          <p data-p="foot" className="mt-8 pt-6 border-t border-line font-semibold text-[17px] leading-snug">Nilai tugas mencatat jawaban pertama. Hanya penjelasan yang memperlihatkan celah kedua.</p>
        </figure>
      </div>
    </section>
  )
}
