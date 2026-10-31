import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowRight, RotateCcw, Send } from 'lucide-react'
import { generate } from '../vendor/ui-generation.js'
import { StatusPill } from '../components/ui'
import { Link } from '../lib/router'
import { verifyQuote, type Status } from '../lib/data'
import { BobyLine, QuoteEvidence, StudentLine, TRAP } from './Fragments'

type Choice = 'Setuju' | 'Tidak setuju'
const MIN = 20
const SAMPLE: Record<Choice, string> = {
  'Setuju': 'Setuju, karena yang pertama masuk ke stack juga yang pertama keluar.',
  'Tidak setuju': 'Tidak setuju. Di antrean yang datang duluan keluar duluan, di stack justru yang terakhir masuk keluar duluan.',
}

// shortcut: a keyword rule stands in for the AI analyst here; the product sends the transcript to the analyst (PRD §8.3).
function propose(choice: Choice, text: string): { status: Status; reason: string } {
  if (choice === 'Setuju') return { status: 'belum', reason: 'Menerima analogi antrean untuk stack.' }
  return /terakhir|akhir|atas|lifo|kebalikan|sebaliknya|belakang/i.test(text)
    ? { status: 'terpenuhi', reason: 'Menolak analogi dan menjelaskan elemen mana yang keluar lebih dulu.' }
    : { status: 'sebagian', reason: 'Menolak analogi, tetapi belum menjelaskan elemen mana yang keluar lebih dulu.' }
}
const firstSentence = (t: string) => (t.trim().match(/^[^.!?]+[.!?]?/)?.[0] ?? t).trim().slice(0, 110)

export type TryHandle = { choose: (c: Choice) => void }

const TryBoby = forwardRef<TryHandle>(function TryBoby(_, handle) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(handle, () => ({ choose: (c) => { setChoice(c); setTimeout(() => area.current?.focus({ preventScroll: true }), 500) } }))

  const proposal = choice ? propose(choice, text) : null
  const quote = firstSentence(text)
  const transcript = [TRAP, `${choice}. ${text}`].join('\n')

  useEffect(() => {
    if (!sent || !panel.current) return
    panel.current.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    let run: { cancel: () => void } | undefined
    const t = setTimeout(() => { document.fonts.ready.then(() => { if (panel.current) run = generate(panel.current, { mode: 'skeleton', duration: 2000, done: 'Usulan siap ditinjau' }) }) }, 450)
    return () => { clearTimeout(t); run?.cancel() }
  }, [sent])

  const reset = () => { setChoice(null); setText(''); setSent(false) }
  const field = choice === 'Setuju' ? 'bg-peach' : 'bg-lavender'

  return (
    <section id="coba" aria-labelledby="coba-h" className={`relative overflow-hidden ${field} transition-colors duration-[400ms] px-[var(--m)] pt-[clamp(80px,9vw,140px)] pb-[300px] sm:pb-[clamp(240px,24vw,380px)]`}>
      <div className="relative z-10 grid lg:grid-cols-12 gap-x-8">
        <div className="lg:col-span-6 xl:col-span-5">
          <h2 id="coba-h" data-r className="font-bold tracking-[-0.035em] leading-[1] text-[clamp(38px,4.6vw,72px)]">
            {choice ? 'Anda' : 'Giliran'} <span key={choice ?? 'x'} className="t-reveal inline-block">{choice === 'Setuju' ? 'setuju.' : choice === 'Tidak setuju' ? 'menolak.' : 'Anda.'}</span>
          </h2>
          <p data-r className="mt-6 text-[18px] leading-[1.55] max-w-[30rem]">Boby baru belajar stack dan sangat yakin dengan analoginya. Setuju atau tidak? Tulis alasannya seperti menjelaskan ke teman, lalu lihat apa yang sampai ke meja dosen.</p>

          <div data-r className="mt-10 flex flex-col gap-3 text-[16px] max-w-[30rem]">
            <BobyLine text={TRAP} trap />
            {choice && sent && <StudentLine choice={choice} text={text} />}
            {sent && <div className="t-reveal"><BobyLine text="Oke, aku catat penjelasanmu. Dosenmu nanti melihat kalimat ini sebagai bukti, bukan hanya pilihanmu." /></div>}
          </div>

          {choice && !sent && (
            <form className="t-reveal mt-6 max-w-[30rem]" onSubmit={(e) => { e.preventDefault(); if (text.trim().length >= MIN) setSent(true) }}>
              <label htmlFor="alasan" className="block font-semibold mb-2">Jelaskan ke Boby kenapa Anda {choice.toLowerCase()}</label>
              <textarea id="alasan" ref={area} rows={3} value={text} onChange={(e) => setText(e.target.value)} aria-describedby="alasan-hint"
                className="field bubble-right !bg-white text-[16px]" placeholder="Tulis dengan kata-kata sendiri…" />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p id="alasan-hint" className="text-[14px] text-[#4E4B5E] tnum">{Math.min(text.trim().length, MIN)}/{MIN} karakter minimum</p>
                <button type="button" className="text-[14px] font-semibold text-plum hover:underline" onClick={() => setText(SAMPLE[choice])}>Pakai contoh jawaban</button>
              </div>
              <button type="submit" className="btn btn-primary mt-4" disabled={text.trim().length < MIN}>Kirim ke Boby <Send size={16} aria-hidden="true" /></button>
            </form>
          )}
        </div>

        {!sent && (
          <div className="hidden lg:block lg:col-span-6 xl:col-start-7 mt-24">
            <div data-r className="bg-[rgba(255,255,255,.55)] drop-lg p-7 max-w-[34rem]">
              <p className="text-[13px] font-semibold text-muted">Yang dilihat dosen di ruang tinjauan</p>
              <div aria-hidden="true" className="mt-4 flex items-center justify-between gap-3"><span className="h-5 w-3/5 rounded-md bg-[rgba(30,28,39,.07)]" /><span className="h-7 w-28 rounded-full bg-[rgba(30,28,39,.07)]" /></div>
              <div aria-hidden="true" className="mt-4 h-16 rounded-lg bg-[rgba(30,28,39,.05)]" />
              <p className="mt-5 text-[15px] text-[#4E4B5E] leading-snug">Kosong sampai Anda menjawab. Pilih <b className="text-ink">Setuju</b> atau <b className="text-ink">Tidak setuju</b> di bawah, jelaskan alasannya, lalu lihat kalimat Anda muncul di sini sebagai bukti.</p>
            </div>
          </div>
        )}
        {sent && proposal && (
          <div className="lg:col-span-6 xl:col-start-7 mt-12 lg:mt-24">
            <div ref={panel} data-ui className="bg-white drop-lg p-6 sm:p-7 max-w-[34rem]">
              <p className="text-[13px] font-semibold text-muted">Yang dilihat dosen di ruang tinjauan</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-[18px] leading-tight">Menolak analogi antrean untuk stack</p>
                <StatusPill status={proposal.status}>Usulan AI: {proposal.status}</StatusPill>
              </div>
              <div className="mt-4 rounded-lg bg-mist p-4"><QuoteEvidence quote={quote} where="Reverse-Tutor" ok={verifyQuote(quote, transcript)} /></div>
              <p className="mt-3 text-[15px] text-[#4E4B5E]">{proposal.reason}</p>
              <div className="mt-5 grid grid-cols-3 gap-2" aria-label="Keputusan dosen (contoh)">
                <span className="btn btn-sm btn-primary">Terima</span><span className="btn btn-sm btn-secondary">Koreksi</span><span className="btn btn-sm btn-secondary">Tolak</span>
              </div>
              <p className="mt-5 text-[14px] text-[#4E4B5E] leading-snug">Di demo ini usulan dibuat aturan kata kunci sederhana. Di produk, analis AI yang mengusulkan, aturan memeriksa kutipannya, dan dosen selalu memutuskan.</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to="/dosen/tinjauan/operasi-stack" className="link-arrow">Buka ruang tinjauan <ArrowRight size={16} aria-hidden="true" /></Link>
                <button className="inline-flex items-center gap-1.5 font-semibold text-[#4E4B5E] hover:text-ink" onClick={reset}><RotateCcw size={15} aria-hidden="true" /> Ulangi</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* The control the whole product turns on, blown up to poster size and cropped by the section's right and bottom edges */}
      <div data-ui data-poster className="absolute z-0 left-[var(--m)] right-[var(--m)] sm:left-auto bottom-[-0.12em] sm:right-[-2.4vw] text-[clamp(52px,15vw,84px)] sm:text-[clamp(60px,7vw,116px)]">
        <div role="radiogroup" aria-label="Pernyataan Boby: setuju atau tidak setuju" className="flex flex-col sm:flex-row gap-[0.1em] p-[0.1em] bg-white rounded-[0.42em_0.1em_0.42em_0.42em] font-bold tracking-[-0.04em] leading-none">
          {(['Setuju', 'Tidak setuju'] as Choice[]).map((c) => (
            <button key={c} role="radio" aria-checked={choice === c} onClick={() => { if (!sent) { setChoice(c); setTimeout(() => area.current?.focus({ preventScroll: true }), 300) } }}
              disabled={sent}
              className={`px-[0.42em] py-[0.32em] rounded-[0.34em_0.08em_0.34em_0.34em] whitespace-nowrap transition-[background-color,color,transform] duration-[250ms] active:scale-[.98] ${choice === c ? 'bg-ink text-ivory' : 'text-ink hover:bg-mist'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
})
export default TryBoby
