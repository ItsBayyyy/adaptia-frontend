import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import AppShell, { TitleRow } from '../../components/AppShell'
import { Tabs } from '../../components/ui'
import { Link } from '../../lib/router'
import { myDone, mySessions } from '../../lib/data'

export function SessionTable({ headingId }: { headingId: string }) {
  const [tab, setTab] = useState<'todo' | 'done'>('todo')
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id={headingId} className="text-[17px] font-semibold">Sesi belajar</h2>
        <Tabs label="Saring sesi" value={tab} onChange={setTab} tabs={[{ id: 'todo', label: `Perlu dikerjakan · ${mySessions.length}` }, { id: 'done', label: `Selesai · ${myDone.length}` }]} />
      </div>
      <div key={tab} className="t-swap overflow-x-auto">
        {tab === 'todo' ? (
          <table className="w-full text-[15px] sm:min-w-[620px]">
            <thead><tr className="text-left text-[13px] text-muted"><th className="font-medium py-2">Sesi</th><th className="font-medium py-2 hidden md:table-cell">Format</th><th className="font-medium py-2 hidden sm:table-cell">Batas</th><th className="font-medium py-2 hidden sm:table-cell">Status</th><th className="py-2"><span className="sr-only">Aksi</span></th></tr></thead>
            <tbody>
              {mySessions.map((s) => (
                <tr key={s.id} className="border-t border-line row-hover">
                  <td className="py-3.5 pr-4"><p className="font-semibold">{s.title}</p><p className="text-[13px] text-muted">{s.className}</p><p className="sm:hidden text-[13px] text-muted tnum">Batas {s.due}</p></td>
                  <td className="py-3.5 pr-4 hidden md:table-cell">{s.format}</td>
                  <td className="py-3.5 pr-4 tnum hidden sm:table-cell">{s.due}</td>
                  <td className="py-3.5 pr-4 hidden sm:table-cell"><span className={`pill ${s.stage ? 'pill-ok' : 'pill-none'}`}>{s.state}</span></td>
                  <td className="py-3.5 text-right">
                    {s.id === 'antrean-queue'
                      ? <Link to={`/mahasiswa/sesi/${s.id}`} className="btn btn-sm btn-secondary">Lanjutkan <ArrowRight size={15} aria-hidden="true" /></Link>
                      : <span className="text-[13px] text-muted">Dibuka 1 Nov</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-[15px] sm:min-w-[620px]">
            <thead><tr className="text-left text-[13px] text-muted"><th className="font-medium py-2">Sesi</th><th className="font-medium py-2 hidden sm:table-cell">Dikirim</th><th className="font-medium py-2 hidden sm:table-cell">Status</th><th className="py-2"><span className="sr-only">Aksi</span></th></tr></thead>
            <tbody>
              {myDone.map((s) => (
                <tr key={s.id} className="border-t border-line row-hover">
                  <td className="py-3.5 pr-4"><p className="font-semibold">{s.title}</p><p className="text-[13px] text-muted">{s.className}</p></td>
                  <td className="py-3.5 pr-4 tnum hidden sm:table-cell">{s.submitted}</td>
                  <td className="py-3.5 pr-4 hidden sm:table-cell"><span className={`pill ${s.state === 'Sudah ditinjau' ? 'pill-ok' : 'pill-part'}`}>{s.state}</span></td>
                  <td className="py-3.5 text-right">
                    {s.id === 'stack-vs-queue'
                      ? <Link to="/mahasiswa/ringkasan/stack-vs-queue" className="btn btn-sm btn-secondary">Lihat ringkasan</Link>
                      : <span className="text-[13px] text-muted">{s.state === 'Sudah ditinjau' ? 'Ringkasan diarsipkan' : 'Umpan balik setelah ditinjau'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function StudentSessions({ path }: { path: string }) {
  return (
    <AppShell role="mahasiswa" path={path} crumbs={[{ label: 'Ruang Mahasiswa', to: '/mahasiswa' }, { label: 'Sesi Belajar' }]}>
      <TitleRow title="Sesi Belajar" finding="Umpan balik setiap sesi muncul setelah dosen meninjau buktimu. Skor tidak ditampilkan sebelum itu." />
      <div data-tour="daftar-sesi"><SessionTable headingId="sesi-list-h" /></div>
    </AppShell>
  )
}
