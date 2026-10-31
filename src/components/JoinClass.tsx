import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { classes, openClasses } from '../lib/data'
import { store, toast, useStore } from '../lib/store'

const norm = (s: string) => s.toUpperCase().replace(/\s+/g, '')

/**
 * How a student gets into a class: the lecturer publishes a session and passes on the class code.
 * The code is matched against the classes this prototype knows, and every outcome says what happened.
 */
export default function JoinClass() {
  const { joined } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = norm(code)
    setDone(null)
    if (c.length < 4) return setErr('Kode kelas terlalu pendek. Contoh bentuknya SD-B26.')
    const mine = classes.find((k) => norm(k.joinCode) === c)
    if (mine) return setErr(`Anda sudah tergabung di ${mine.name} ${mine.group}.`)
    const found = openClasses.find((k) => norm(k.joinCode) === c)
    if (!found) return setErr('Kode kelas tidak ditemukan. Periksa lagi kode dari dosen Anda.')
    if (joined.includes(found.id)) return setErr(`Anda sudah tergabung di ${found.name} ${found.group}.`)
    store.set((s) => ({ joined: [...s.joined, found.id] }))
    setErr(null); setCode(''); setDone(`${found.name} ${found.group}`)
    toast(`Bergabung ke ${found.name} ${found.group}`)
  }

  return (
    <form onSubmit={submit} data-tour="gabung" className="rounded-[14px_3px_14px_14px] bg-mist p-4 sm:p-5">
      <label htmlFor="kode-kelas" className="label">Gabung kelas dengan kode</label>
      <div className="flex flex-wrap gap-2">
        <input id="kode-kelas" className="field !w-auto flex-1 min-w-[180px] tnum tracking-[0.08em] uppercase"
          value={code} onChange={(e) => { setCode(e.target.value); setErr(null) }}
          placeholder="SD-B26" autoComplete="off" spellCheck={false}
          aria-describedby={err ? 'kode-galat' : 'kode-bantu'} aria-invalid={!!err} />
        <button className="btn btn-primary" type="submit">Gabung <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
      {err
        ? <p id="kode-galat" role="alert" className="mt-2 text-[15px] text-warn">{err}</p>
        : done
          ? <p className="mt-2 text-[15px] text-plum inline-flex items-center gap-1.5"><Check size={16} aria-hidden="true" /> Bergabung ke {done}. Sesinya muncul di Sesi Belajar.</p>
          : <p id="kode-bantu" className="mt-2 text-[13px] text-muted">Kode diberikan dosen setelah sesi asesmen dipublikasikan.</p>}
    </form>
  )
}
