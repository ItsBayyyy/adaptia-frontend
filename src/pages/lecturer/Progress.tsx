import { useEffect, useRef, useState } from 'react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Avatar, Tabs } from '../../components/ui'
import { concepts, indicators, LEVELS, levelOf, roster, sessions, stackSummary, trend } from '../../lib/data'

const scored = roster.filter((r) => r.score != null)
const prevAvg = sessions.find((s) => s.id === 'stack-vs-queue')!.avg!
const VAL = { terpenuhi: 1, sebagian: 0.5, belum: 0, ambigu: null } as const

// Per-concept mastery for "Operasi Stack": mean of the indicator values, ambiguous findings left out.
const perConcept = indicators.map((ind) => {
  const vals = scored.map((r) => VAL[r.statuses[ind.id]]).filter((v): v is 0 | 0.5 | 1 => v != null)
  return { label: concepts[ind.concept], value: vals.reduce((a: number, b) => a + b, 0) / vals.length }
})
const dist = LEVELS.map((l) => ({ label: l.name, value: scored.filter((r) => levelOf(r.score!).id === l.id).length }))
console.assert(dist.reduce((a, d) => a + d.value, 0) === scored.length, 'distribution adds up to the scored students')
const improved = scored.filter((r) => r.prev != null && r.score! > r.prev).length
const needHelp = dist[3].value

function Chart({ draw, label }: { draw: (el: HTMLElement) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.Charts) return
    const render = () => { el.innerHTML = ''; draw(el) }
    document.fonts.ready.then(render)
    const ro = new ResizeObserver(render); ro.observe(el)
    return () => ro.disconnect()
  }, []) // eslint-disable-line
  return <div ref={ref} aria-label={label} className="w-full" />
}

export default function Progress({ path }: { path: string }) {
  const [view, setView] = useState<'mahasiswa' | 'konsep'>('mahasiswa')
  const [all, setAll] = useState(false)
  const rows = [...scored].sort((a, b) => a.score! - b.score!)
  const shown = all ? rows : rows.slice(0, 8)
  const delta = stackSummary.avg - prevAvg
  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Perkembangan' }]}>
      <TitleRow title="Perkembangan · Struktur Data B"
        finding={<>Rata-rata kelas naik ke <b className="font-semibold text-ink tnum">{stackSummary.avg}</b> di Operasi Stack ({delta >= 0 ? '+' : '−'}{Math.abs(delta)} dari “Stack atau Queue?”), tetapi konsep <b className="font-semibold text-ink">memilih stack atau queue</b> masih yang terlemah.</>}
        actions={<Tabs label="Tampilkan berdasarkan" value={view} onChange={setView} tabs={[{ id: 'mahasiswa', label: 'Mahasiswa' }, { id: 'konsep', label: 'Konsep' }]} />} />

      <section aria-label="Angka utama" className="card grid grid-cols-2 lg:grid-cols-4 divide-x divide-line [&>*:nth-child(3)]:max-lg:border-l-0 [&>*:nth-child(n+3)]:max-lg:border-t [&>*:nth-child(n+3)]:max-lg:border-line mb-4">
        {[
          ['Rata-rata pemahaman', `${stackSummary.avg}`, `${delta >= 0 ? '+' : '−'}${Math.abs(delta)} dari sesi 21 Okt · ${stackSummary.perlu} skor masih sementara`],
          ['Mahasiswa meningkat', `${improved}`, `dari ${scored.length} yang punya skor di dua sesi`],
          ['Perlu pendampingan', `${needHelp}`, 'skor di bawah 55'],
          ['Mengumpulkan', `${stackSummary.submitted}/35`, `${stackSummary.belum} belum mengumpulkan`],
        ].map(([l, v, sub]) => (
          <div key={l} className="p-5"><p className="text-[13px] text-muted">{l}</p><p className="text-[28px] font-semibold tnum leading-none mt-1">{v}</p><p className="text-[13px] text-muted mt-2">{sub}</p></div>
        ))}
      </section>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-4">
        <section className="card p-5" aria-labelledby="tren-h">
          <h2 id="tren-h" className="text-[17px] font-semibold">Rata-rata pemahaman per sesi</h2>
          <p className="text-[13px] text-muted mt-0.5 mb-3">Skala 0–100. Titik terakhir masih sementara sampai semua temuan diputuskan.</p>
          <Chart label="Grafik garis rata-rata pemahaman lima sesi" draw={(el) => window.Charts.line(el, { labels: trend.labels, series: [{ name: 'Rata-rata kelas', values: trend.values }], today: trend.labels.length - 2, todayLabel: 'Sementara setelah titik ini', endLabel: true, yTicks: [0, 25, 50, 75, 100], height: 240 })} />
        </section>
        <section className="card p-5" aria-labelledby="dist-h">
          <h2 id="dist-h" className="text-[17px] font-semibold">Sebaran tingkat pemahaman</h2>
          <p className="text-[13px] text-muted mt-0.5 mb-4">{scored.length} mahasiswa dengan skor di Operasi Stack</p>
          <Chart label="Sebaran tingkat pemahaman" draw={(el) => window.Charts.barList(el, dist, { format: (v: number) => `${v} mahasiswa` })} />
        </section>
      </div>

      <div key={view} className="t-swap mt-4">
        {view === 'konsep' ? (
          <section className="card p-5" aria-labelledby="konsep-h">
            <h2 id="konsep-h" className="text-[17px] font-semibold">Pemahaman per konsep · Operasi Stack</h2>
            <p className="text-[13px] text-muted mt-0.5 mb-4">Rata-rata status temuan: terpenuhi = 100%, sebagian = 50%, belum = 0%. Temuan ambigu tidak dihitung.</p>
            <div className="max-w-[760px]"><Chart label="Pemahaman per konsep" draw={(el) => window.Charts.barList(el, [...perConcept].sort((a, b) => a.value - b.value), { format: window.Charts.fmt.pct(0) })} /></div>
          </section>
        ) : (
          <section className="card p-5" aria-labelledby="mhs-h">
            <h2 id="mhs-h" className="text-[17px] font-semibold mb-2">Perkembangan mahasiswa</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[15px] min-w-[640px]">
                <thead><tr className="text-left text-[13px] text-muted"><th className="font-medium py-2">Mahasiswa</th><th className="font-medium py-2 text-right">21 Okt</th><th className="font-medium py-2 text-right">28 Okt</th><th className="font-medium py-2 text-right">Perubahan</th><th className="font-medium py-2 pl-8">Tingkat</th></tr></thead>
                <tbody>
                  {shown.map((r) => {
                    const d = r.score! - (r.prev ?? r.score!)
                    const lv = levelOf(r.score!)
                    return (
                      <tr key={r.id} className="border-t border-line row-hover">
                        <td className="py-2.5"><div className="flex items-center gap-2.5"><Avatar name={r.name} seed={r.idx} size={26} /><span className="font-medium">{r.name}</span>{r.state === 'perlu' && <span className="text-[13px] text-muted">sementara</span>}</div></td>
                        <td className="py-2.5 text-right tnum text-muted">{r.prev ?? '–'}</td>
                        <td className="py-2.5 text-right tnum font-semibold">{r.score}</td>
                        <td className={`py-2.5 text-right tnum ${d > 0 ? 'text-plum' : d < 0 ? 'text-warn' : 'text-muted'}`}>{d > 0 ? `+${d}` : d < 0 ? `−${-d}` : '0'}</td>
                        <td className="py-2.5 pl-8"><span className={`pill ${lv.id === 'perlu' ? 'pill-part' : lv.id === 'sangat' ? 'pill-ok' : 'pill-none'}`}>{lv.name}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button className="mt-3 text-[15px] font-semibold text-plum hover:underline" onClick={() => setAll((x) => !x)}>{all ? 'Tampilkan lebih sedikit' : `Lihat semua ${rows.length}`}</button>
          </section>
        )}
      </div>
    </AppShell>
  )
}
