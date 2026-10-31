import { Check, CircleAlert, Quote } from 'lucide-react'
import { BobyMark } from '../components/Boby'
import { TRAP } from '../lib/data'

// Real interface pieces of ADAPTIA, built from the same data as the app (data-ui marks them as product UI).

export function CodeLines({ code, highlight = [] as number[] }: { code: string; highlight?: number[] }) {
  return (
    <pre className="font-mono text-[13px] leading-[1.7] bg-ink text-[#EDE7F6] rounded-lg p-4 overflow-x-auto"><code>
      {code.split('\n').map((l, i) => (
        <span key={i} className={`block ${highlight.includes(i) ? 'bg-[#3A3248] -mx-4 px-4' : ''}`}>
          <span className="inline-block w-5 text-[#8E88A3] select-none">{i + 1}</span>
          {l.split(/(#.*$)/).map((part, j) => part.startsWith('#') ? <span key={j} className="text-[#B9A6E8]">{part}</span> : <span key={j}>{part}</span>)}
        </span>
      ))}
    </code></pre>
  )
}

export function BobyLine({ text, trap }: { text: string; trap?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <BobyMark className="w-8 h-8 shrink-0 mt-0.5" />
      <div className={`bubble-left bg-lavender px-3.5 py-2.5 leading-snug ${trap ? 'outline-2 outline-accent -outline-offset-2' : ''}`}>
        {trap && <span className="block text-[13px] font-semibold text-plum mb-0.5">Pernyataan uji</span>}
        {text}
      </div>
    </div>
  )
}
export function StudentLine({ text, choice }: { text: string; choice?: string }) {
  return (
    <div className="flex justify-end">
      <div className="bubble-right bg-charcoal text-ivory px-3.5 py-2.5 leading-snug max-w-[85%]">
        {choice && <span className="block text-[13px] font-semibold text-[#CBB6FF] mb-0.5">{choice}</span>}
        {text}
      </div>
    </div>
  )
}

export function QuoteEvidence({ quote, where, ok = true }: { quote: string; where: string; ok?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="leading-snug"><Quote size={16} className="inline -mt-1 mr-1 text-accent" aria-hidden="true" /><mark className="bg-[#EFE3FF] text-ink rounded px-1 box-decoration-clone">{quote}</mark></p>
      <p className={`flex items-center gap-1.5 text-[13px] font-semibold ${ok ? 'text-plum' : 'text-warn'}`}>
        {ok ? <Check size={15} strokeWidth={2.5} aria-hidden="true" /> : <CircleAlert size={15} aria-hidden="true" />}
        {ok ? `Ditemukan di transkrip · ${where}` : 'Tidak ditemukan di transkrip · periksa manual'}
      </p>
    </div>
  )
}

export { TRAP }
