import { useState } from 'react'
import { Plus } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Tabs } from '../../components/ui'
import { Link } from '../../lib/router'
import { classes, sessions, type SessionRow } from '../../lib/data'

const STATE = { perlu: ['Perlu ditinjau', 'pill-part'], berlangsung: ['Berlangsung', 'pill-ok'], selesai: ['Selesai ditinjau', 'pill-none'] } as const

export function SessionRows({ rows }: { rows: SessionRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[15px] sm:min-w-[620px]">
        <thead><tr className="text-left text-[13px] text-muted">
          <th className="font-medium py-2">Sesi</th><th className="font-medium py-2 hidden 2xl:table-cell">Kelas</th><th className="font-medium py-2 text-right hidden sm:table-cell">Terkumpul</th><th className="font-medium py-2 text-right hidden md:table-cell">Rata-rata</th><th className="font-medium py-2 pl-6 hidden sm:table-cell">Status</th><th className="py-2"><span className="sr-only">Aksi</span></th>
        </tr></thead>
        <tbody>
          {rows.map((s) => {
            const c = classes.find((k) => k.id === s.classId)!
            return (
              <tr key={s.id} className="border-t border-line row-hover">
                <td className="py-3 pr-4 min-w-[220px]"><p className="font-semibold">{s.title}</p><p className="text-[13px] text-muted"><span className="2xl:hidden">{c.name} {c.group.replace('Kelas ', '')} · </span>{s.type} · {s.format} · batas {s.due}</p><span className={`sm:hidden mt-1.5 pill ${STATE[s.state][1]}`}>{STATE[s.state][0]} · {s.submitted}/{s.enrolled}</span></td>
                <td className="py-3 pr-4 whitespace-nowrap hidden 2xl:table-cell">{c.name} {c.group.replace('Kelas ', '')}</td>
                <td className="py-3 pr-4 text-right tnum whitespace-nowrap hidden sm:table-cell">{s.submitted}<span className="text-muted">/{s.enrolled}</span></td>
                <td className="py-3 pr-4 text-right tnum whitespace-nowrap hidden md:table-cell">{s.avg == null ? <span className="text-muted">–</span> : <>{s.avg}{s.state === 'perlu' && <span className="text-muted text-[13px] ml-1">sementara</span>}</>}</td>
                <td className="py-3 pl-6 pr-4 hidden sm:table-cell"><span className={`pill ${STATE[s.state][1]}`}>{STATE[s.state][0]}</span></td>
                <td className="py-3 text-right whitespace-nowrap">
                  {s.id === 'operasi-stack'
                    ? <Link to="/dosen/tinjauan/operasi-stack" className="btn btn-sm btn-primary">Tinjau bukti</Link>
                    : <span className="text-[15px] text-muted">{s.state === 'berlangsung' ? 'Menunggu pengumpulan' : 'Arsip'}</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function SessionList({ path }: { path: string }) {
  const [cls, setCls] = useState<'semua' | 'if203b' | 'st101a'>('semua')
  const rows = sessions.filter((s) => cls === 'semua' || s.classId === cls)
  return (
    <AppShell role="dosen" path={path} crumbs={[{ label: 'Ruang Dosen', to: '/dosen' }, { label: 'Sesi Asesmen' }]}>
      <TitleRow title="Sesi Asesmen" finding="Satu sesi menunggu keputusan Anda dan satu sesi masih menerima jawaban sampai 6 Nov."
        actions={<Link to="/dosen/sesi/baru" data-tour="buat" className="btn btn-primary btn-sm"><Plus size={15} aria-hidden="true" /> Buat sesi asesmen</Link>} />
      <section className="card p-5" aria-label="Daftar sesi">
        <div className="mb-3"><Tabs label="Saring kelas" value={cls} onChange={setCls} tabs={[{ id: 'semua', label: 'Semua kelas' }, { id: 'if203b', label: 'Struktur Data B' }, { id: 'st101a', label: 'Statistika Dasar A' }]} /></div>
        <div key={cls} className="t-swap"><SessionRows rows={rows} /></div>
        <p className="mt-3 text-[13px] text-muted tnum">{rows.length} sesi</p>
      </section>
    </AppShell>
  )
}
