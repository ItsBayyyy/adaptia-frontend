// ADAPTIA sample data. Every figure on screen is computed from these rows; replace with the API in production.
// All names are fictional sample data.

export type Status = 'terpenuhi' | 'sebagian' | 'belum' | 'ambigu'
export type Stage = 'praktik' | 'reverse_tutor' | 'penerapan'
export const STATUS_LABEL: Record<Status, string> = { terpenuhi: 'Terpenuhi', sebagian: 'Sebagian', belum: 'Belum', ambigu: 'Ambigu' }
export const STATUS_PILL: Record<Status, string> = { terpenuhi: 'pill-ok', sebagian: 'pill-part', belum: 'pill-none', ambigu: 'pill-amb' }
export const STAGE_LABEL: Record<Stage, string> = { praktik: 'Praktik', reverse_tutor: 'Reverse-Tutor', penerapan: 'Penerapan' }
const VALUE: Record<Status, number | null> = { terpenuhi: 1, sebagian: 0.5, belum: 0, ambigu: null }

export const TODAY = '30 Okt 2026'
export const lecturer = { name: 'Dr. Rina Anggraini', initials: 'RA', role: 'Dosen · Informatika' }
export const me = { id: 'nadia', name: 'Nadia Rahmawati', nim: '2410512031', initials: 'NR' }

export const concepts = {
  lifo: 'Prinsip LIFO',
  pushpop: 'Operasi push & pop',
  fifo: 'Prinsip FIFO',
  pilih: 'Memilih stack atau queue',
  underflow: 'Stack kosong (underflow)',
  ruang: 'Ruang sampel',
  sederhana: 'Peluang sederhana',
  bebas: 'Kejadian saling bebas',
  fallacy: "Gambler's fallacy",
  komplemen: 'Peluang komplemen',
} as const
export type ConceptId = keyof typeof concepts

export const classes = [
  { id: 'if203b', code: 'IF203', name: 'Struktur Data', group: 'Kelas B', joinCode: 'SD-B26', material: 'Stack & Queue', enrolled: 35 },
  { id: 'st101a', code: 'ST101', name: 'Statistika Dasar', group: 'Kelas A', joinCode: 'ST-A26', material: 'Peluang', enrolled: 32 },
]

// ── The rubric of "Operasi Stack" (weights sum to 100) ──
export const indicators = [
  { id: 'i1', name: 'Menjelaskan urutan LIFO', concept: 'lifo' as ConceptId, weight: 30 },
  { id: 'i2', name: 'Menelusuri push dan pop', concept: 'pushpop' as ConceptId, weight: 25 },
  { id: 'i3', name: 'Menolak analogi antrean untuk stack', concept: 'fifo' as ConceptId, weight: 25 },
  { id: 'i4', name: 'Menerapkan stack atau queue di kasus baru', concept: 'pilih' as ConceptId, weight: 20 },
]
console.assert(indicators.reduce((s, i) => s + i.weight, 0) === 100, 'rubric weights must sum to 100')

export const stackTask = {
  title: 'Operasi Stack',
  instruction: 'Simulasikan operasi berikut pada stack kosong: push(3), push(7), pop(), push(5), push(9), pop(). Tulis kodenya dengan list Python, lalu sebutkan elemen yang keluar dan isi akhir stack.',
  goal: 'Menjelaskan urutan keluar-masuk elemen pada stack dan memilih struktur yang tepat untuk sebuah kasus.',
  penerapan: [
    'Printer laboratorium menerima dokumen dari 30 mahasiswa. Struktur apa yang kamu pakai untuk dokumen yang menunggu dicetak? Jelaskan alasanmu.',
    'Fitur Undo di editor teks membatalkan perubahan terakhir lebih dulu. Struktur apa yang cocok, dan apa yang terjadi saat Undo ditekan dua kali?',
  ],
}
export const TRAP = 'Oh, berarti stack itu seperti antrean kantin, ya? Yang datang duluan, dilayani duluan.'

type Turn = { who: 'boby' | 'mhs'; text: string; trap?: boolean; choice?: 'Setuju' | 'Tidak setuju'; time: string }
type Finding = { indicator: string; status: Status; stage: Stage; quote: string; reason: string }
type Evidence = { code: string; explain: string; dialog: Turn[]; answers: string[]; findings: Finding[]; misconception?: string; summary: string }

const codeOk = `stack = []
stack.append(3)
stack.append(7)
stack.pop()        # 7 keluar
stack.append(5)
stack.append(9)
stack.pop()        # 9 keluar
print(stack)       # [3, 5]`

const q1 = 'Aku lihat 7 keluar duluan, padahal 3 masuk lebih dulu. Kenapa bukan 3 yang keluar?'
const q3 = 'Kalau begitu, setelah pop yang kedua, isinya apa dan kenapa?'

// Five answer archetypes. Quotes are matched against the transcript by the verifier below, so they must be copied exactly.
const evidence: Record<'terapan' | 'bingung' | 'ambigu' | 'cukup' | 'kuat', Evidence> = {
  terapan: {
    code: codeOk,
    explain: 'Isi akhirnya [3, 5]. Yang keluar 7 lalu 9, karena pop selalu mengambil elemen yang terakhir masuk.',
    dialog: [
      { who: 'boby', text: q1, time: '10.14' },
      { who: 'mhs', text: 'Karena 7 ada di paling atas. Stack cuma bisa diambil dari atas, jadi yang terakhir masuk keluar duluan.', time: '10.15' },
      { who: 'boby', text: TRAP, trap: true, time: '10.16' },
      { who: 'mhs', choice: 'Tidak setuju', text: 'Antrean kantin itu yang datang duluan dilayani duluan, stack kebalikannya.', time: '10.17' },
      { who: 'boby', text: q3, time: '10.17' },
      { who: 'mhs', text: 'Setelah pop yang kedua isinya tinggal [3, 5], soalnya 9 baru saja masuk paling atas.', time: '10.18' },
    ],
    answers: [
      'Saya pakai stack supaya dokumen terbaru dicetak dulu, jadi yang baru mengirim tidak perlu menunggu lama.',
      'Stack. Undo dua kali membatalkan perubahan terakhir, lalu perubahan sebelumnya.',
    ],
    findings: [
      { indicator: 'i1', status: 'terpenuhi', stage: 'praktik', quote: 'pop selalu mengambil elemen yang terakhir masuk', reason: 'Menyebut urutan LIFO dengan kata-katanya sendiri.' },
      { indicator: 'i2', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'Setelah pop yang kedua isinya tinggal [3, 5]', reason: 'Menelusuri isi stack setelah tiap pop dengan benar.' },
      { indicator: 'i3', status: 'sebagian', stage: 'reverse_tutor', quote: 'stack kebalikannya', reason: 'Menolak analogi antrean, tetapi belum menjelaskan elemen mana yang keluar lebih dulu.' },
      { indicator: 'i4', status: 'belum', stage: 'penerapan', quote: 'Saya pakai stack supaya dokumen terbaru dicetak dulu', reason: 'Memilih stack untuk antrean cetak; dokumen yang dikirim lebih dulu bisa tertunda terus.' },
    ],
    misconception: 'Memilih struktur dari siapa yang cepat dilayani, bukan dari urutan layanan yang adil.',
    summary: 'Menelusuri push dan pop dengan benar, tetapi memilih stack untuk antrean cetak.',
  },
  bingung: {
    code: `stack = []
stack.append(3)
stack.append(7)
stack.pop(0)       # 3 keluar
stack.append(5)
stack.append(9)
stack.pop(0)       # 7 keluar
print(stack)       # [5, 9]`,
    explain: 'Yang keluar 3 lalu 7, karena yang masuk pertama keluar pertama. Isi akhirnya [5, 9].',
    dialog: [
      { who: 'boby', text: 'Kamu pakai pop(0). Itu mengambil elemen yang pertama masuk atau yang terakhir masuk?', time: '09.40' },
      { who: 'mhs', text: 'Yang pertama masuk, karena di stack yang pertama masuk harus keluar dulu biar adil.', time: '09.42' },
      { who: 'boby', text: TRAP, trap: true, time: '09.42' },
      { who: 'mhs', choice: 'Setuju', text: 'Setuju, stack itu seperti antrean, yang pertama datang dilayani dulu.', time: '09.43' },
      { who: 'boby', text: 'Kalau tumpukan piring di kantin, piring mana yang kamu ambil duluan?', time: '09.44' },
      { who: 'mhs', text: 'Piring paling atas. Mungkin itu beda dengan stack di program.', time: '09.45' },
    ],
    answers: ['Stack, karena dokumen pertama dicetak duluan.', 'Queue, supaya perubahan pertama dibatalkan dulu.'],
    findings: [
      { indicator: 'i1', status: 'sebagian', stage: 'reverse_tutor', quote: 'Piring paling atas. Mungkin itu beda dengan stack di program.', reason: 'Mengenali ambil-dari-atas pada piring, tetapi belum menghubungkannya ke stack.' },
      { indicator: 'i2', status: 'belum', stage: 'praktik', quote: 'Yang keluar 3 lalu 7', reason: 'Penelusuran memakai urutan FIFO, sehingga isi akhir keliru.' },
      { indicator: 'i3', status: 'belum', stage: 'reverse_tutor', quote: 'Setuju, stack itu seperti antrean', reason: 'Menerima analogi antrean untuk stack.' },
      { indicator: 'i4', status: 'sebagian', stage: 'penerapan', quote: 'Stack, karena dokumen pertama dicetak duluan.', reason: 'Alasannya tepat untuk antrean cetak, tetapi nama strukturnya tertukar.' },
    ],
    misconception: 'Menganggap stack melayani elemen yang pertama masuk.',
    summary: 'Masih menganggap elemen pertama yang masuk keluar lebih dulu.',
  },
  ambigu: {
    code: codeOk,
    explain: 'Yang keluar 7 dan 9. Isi akhirnya [3, 5].',
    dialog: [
      { who: 'boby', text: q1, time: '13.05' },
      { who: 'mhs', text: 'Karena yang diambil selalu yang paling atas, yaitu yang terakhir dimasukkan.', time: '13.06' },
      { who: 'boby', text: TRAP, trap: true, time: '13.07' },
      { who: 'mhs', choice: 'Tidak setuju', text: 'Antrean itu FIFO sedangkan stack LIFO, jadi urutan keluarnya terbalik.', time: '13.08' },
      { who: 'boby', text: q3, time: '13.08' },
      { who: 'mhs', text: 'Isinya [3, 5].', time: '13.09' },
    ],
    answers: ['Queue, supaya dokumen dicetak sesuai urutan kirim.', 'Queue juga, biar urut.'],
    findings: [
      { indicator: 'i1', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'yang diambil selalu yang paling atas, yaitu yang terakhir dimasukkan', reason: 'Menjelaskan LIFO dengan benar.' },
      { indicator: 'i2', status: 'sebagian', stage: 'reverse_tutor', quote: 'stack menyimpan data berurutan dari bawah', reason: 'Penelusuran hanya berupa jawaban akhir tanpa langkah.' },
      { indicator: 'i3', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'Antrean itu FIFO sedangkan stack LIFO', reason: 'Menolak analogi dan menyebut perbedaan urutannya.' },
      { indicator: 'i4', status: 'sebagian', stage: 'penerapan', quote: 'Queue juga, biar urut.', reason: 'Tepat untuk printer, keliru untuk Undo.' },
    ],
    summary: 'Konsep LIFO kuat; penelusuran langkah perlu bukti tambahan.',
  },
  cukup: {
    code: codeOk,
    explain: 'Yang keluar 7 dan 9 karena keduanya terakhir masuk. Isi akhirnya [3, 5].',
    dialog: [
      { who: 'boby', text: q1, time: '15.20' },
      { who: 'mhs', text: 'Karena 7 yang terakhir di-push sebelum pop.', time: '15.21' },
      { who: 'boby', text: TRAP, trap: true, time: '15.22' },
      { who: 'mhs', choice: 'Tidak setuju', text: 'Di antrean yang datang duluan dilayani duluan, di stack yang terakhir masuk justru keluar duluan.', time: '15.23' },
      { who: 'boby', text: q3, time: '15.24' },
      { who: 'mhs', text: '[3, 5].', time: '15.24' },
    ],
    answers: ['Queue, karena yang mengirim duluan harus dicetak duluan.', 'Stack, undo pertama membatalkan ketikan terakhir.'],
    findings: [
      { indicator: 'i1', status: 'terpenuhi', stage: 'praktik', quote: 'keduanya terakhir masuk', reason: 'Menyebut LIFO dengan benar.' },
      { indicator: 'i2', status: 'sebagian', stage: 'reverse_tutor', quote: 'Karena 7 yang terakhir di-push sebelum pop.', reason: 'Benar untuk pop pertama; isi setelah pop kedua hanya disebut tanpa langkah.' },
      { indicator: 'i3', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'di stack yang terakhir masuk justru keluar duluan', reason: 'Menolak analogi dan menjelaskan urutan keluarnya.' },
      { indicator: 'i4', status: 'sebagian', stage: 'penerapan', quote: 'undo pertama membatalkan ketikan terakhir', reason: 'Memilih struktur dengan tepat, tetapi tidak menjelaskan Undo yang kedua.' },
    ],
    summary: 'Paham LIFO; penjelasan langkah pop masih melompat.',
  },
  kuat: {
    code: codeOk,
    explain: 'Yang keluar 7 lalu 9, isi akhirnya [3, 5]. Setiap pop mengambil elemen paling atas, yaitu yang terakhir di-push.',
    dialog: [
      { who: 'boby', text: q1, time: '08.30' },
      { who: 'mhs', text: 'Karena stack itu LIFO. Saat pop, 7 ada di atas 3, jadi 7 yang keluar.', time: '08.31' },
      { who: 'boby', text: TRAP, trap: true, time: '08.32' },
      { who: 'mhs', choice: 'Tidak setuju', text: 'Antrean kantin itu queue: yang datang duluan keluar duluan. Stack sebaliknya, yang terakhir datang keluar duluan.', time: '08.33' },
      { who: 'boby', text: q3, time: '08.33' },
      { who: 'mhs', text: 'Setelah push 5 dan push 9 isinya [3, 5, 9]; pop mengambil 9, jadi tersisa [3, 5].', time: '08.35' },
    ],
    answers: ['Queue. Dokumen dicetak sesuai urutan kirim supaya tidak ada yang tertunda terus.', 'Stack. Undo pertama membatalkan perubahan terakhir, Undo kedua membatalkan perubahan sebelumnya.'],
    findings: [
      { indicator: 'i1', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'Karena stack itu LIFO', reason: 'Menyebut dan menjelaskan LIFO.' },
      { indicator: 'i2', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'pop mengambil 9, jadi tersisa [3, 5]', reason: 'Menelusuri setiap langkah.' },
      { indicator: 'i3', status: 'terpenuhi', stage: 'reverse_tutor', quote: 'Stack sebaliknya, yang terakhir datang keluar duluan', reason: 'Menolak analogi dengan alasan.' },
      { indicator: 'i4', status: 'terpenuhi', stage: 'penerapan', quote: 'Dokumen dicetak sesuai urutan kirim', reason: 'Memilih queue dan stack dengan tepat.' },
    ],
    summary: 'Konsep dan penerapan sudah kuat.',
  },
}

// ── Verifier (PRD §8.5): a quote counts only if it exists in the combined transcript. It never judges truth. ──
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').trim()
export function transcriptOf(e: Evidence) {
  return [e.code, e.explain, ...e.dialog.map((t) => t.text), ...e.answers].join('\n')
}
export function verifyQuote(quote: string, transcript: string) {
  return norm(transcript).includes(norm(quote))
}
export function shownStatus(f: Finding, transcript: string): Status {
  return verifyQuote(f.quote, transcript) ? f.status : 'ambigu'
}
/** Provisional score: weighted mean of counted indicators (ambigu is left out). */
export function scoreOf(statuses: Record<string, Status>) {
  let sum = 0, w = 0
  for (const i of indicators) {
    const v = VALUE[statuses[i.id]]
    if (v == null) continue
    sum += v * i.weight; w += i.weight
  }
  return w ? Math.round((sum / w) * 100) : 0
}

// ── Roster of IF203 Kelas B for "Operasi Stack" (35 enrolled) ──
type RosterState = 'perlu' | 'selesai' | 'kurang' | 'belum'
type Arche = keyof typeof evidence
const R = (name: string, nim: string, state: RosterState, arche: Arche | null, prev: number | null) => ({ name, nim, state, arche, prev })
const raw = [
  R('Nadia Rahmawati', '2410512031', 'perlu', 'terapan', 70),
  R('Bagas Pratama', '2410512004', 'perlu', 'ambigu', 74),
  R('Citra Maharani', '2410512008', 'perlu', 'bingung', 41),
  R('Dimas Aryasatya', '2410512011', 'perlu', 'terapan', 63),
  R('Eka Wulandari', '2410512013', 'perlu', 'cukup', 72),
  R('Fajar Nugroho', '2410512015', 'perlu', 'bingung', 38),
  R('Gita Lestari', '2410512017', 'perlu', 'terapan', 66),
  R('Hendra Wijaya', '2410512019', 'perlu', 'cukup', 70),
  R('Indah Permatasari', '2410512021', 'kurang', null, 58),
  R('Joko Santoso', '2410512022', 'kurang', null, 52),
  R('Kirana Putri', '2410512023', 'selesai', 'kuat', 88),
  R('Lukman Hakim', '2410512024', 'selesai', 'terapan', 61),
  R('Maya Anggraeni', '2410512025', 'selesai', 'cukup', 75),
  R('Naufal Ramadhan', '2410512026', 'selesai', 'kuat', 92),
  R('Oktaviani Sari', '2410512027', 'selesai', 'cukup', 69),
  R('Putu Ardana', '2410512028', 'selesai', 'kuat', 85),
  R('Qori Amalia', '2410512029', 'selesai', 'bingung', 35),
  R('Rizky Kurniawan', '2410512030', 'selesai', 'cukup', 71),
  R('Salsabila Azzahra', '2410512032', 'selesai', 'kuat', 90),
  R('Taufik Hidayat', '2410512033', 'selesai', 'terapan', 60),
  R('Ulfa Nuraini', '2410512034', 'selesai', 'cukup', 76),
  R('Vino Saputra', '2410512035', 'selesai', 'bingung', 44),
  R('Wahyu Setiawan', '2410512036', 'selesai', 'terapan', 59),
  R('Yasmin Haura', '2410512037', 'selesai', 'kuat', 81),
  R('Zaki Firmansyah', '2410512038', 'selesai', 'cukup', 73),
  R('Ayu Kartika', '2410512001', 'selesai', 'terapan', 64),
  R('Bima Prasetyo', '2410512005', 'selesai', 'cukup', 68),
  R('Clara Simanjuntak', '2410512007', 'selesai', 'kuat', 86),
  R('Dewa Surya', '2410512010', 'selesai', 'bingung', 47),
  R('Elisa Manurung', '2410512012', 'selesai', 'cukup', 74),
  R('Farhan Maulana', '2410512014', 'belum', null, 55),
  R('Galih Pamungkas', '2410512016', 'belum', null, 62),
  R('Hana Safitri', '2410512018', 'belum', null, 70),
  R('Ilham Saputro', '2410512020', 'belum', null, 49),
  R('Jessica Tanuwijaya', '2410512002', 'belum', null, 77),
]
export const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

export const roster = raw.map((r, idx) => {
  const ev = r.arche ? evidence[r.arche] : null
  const transcript = ev ? transcriptOf(ev) : ''
  const statuses: Record<string, Status> = {}
  ev?.findings.forEach((f) => { statuses[f.indicator] = shownStatus(f, transcript) })
  const score = ev ? scoreOf(statuses) : null
  return { ...r, id: r.name.split(' ')[0].toLowerCase(), idx, ev, transcript, statuses, score, initials: initials(r.name) }
})
export type Student = (typeof roster)[number]
console.assert(roster.length === 35, 'IF203 B has 35 students')

export const stackSummary = (() => {
  const by = (s: RosterState) => roster.filter((r) => r.state === s).length
  const submitted = roster.filter((r) => r.state !== 'belum')
  const scored = submitted.filter((r) => r.score != null)
  const pendingFindings = roster.filter((r) => r.state === 'perlu').reduce((n, r) => n + (r.ev?.findings.length ?? 0), 0)
  const avg = Math.round(scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length)
  return { perlu: by('perlu'), selesai: by('selesai'), kurang: by('kurang'), belum: by('belum'), submitted: submitted.length, pendingFindings, avg, scoredCount: scored.length }
})()
console.assert(stackSummary.perlu + stackSummary.selesai + stackSummary.kurang + stackSummary.belum === 35, 'roster states add up')

// ── Sessions of both classes ──
export type SessionRow = { id: string; title: string; classId: string; type: string; format: string; due: string; submitted: number; enrolled: number; state: 'perlu' | 'berlangsung' | 'selesai'; avg: number | null; pending: number }
export const sessions: SessionRow[] = [
  { id: 'operasi-stack', title: 'Operasi Stack', classId: 'if203b', type: 'Asesmen awal', format: 'Teks / Kode', due: '28 Okt 2026', submitted: stackSummary.submitted, enrolled: 35, state: 'perlu', avg: stackSummary.avg, pending: stackSummary.pendingFindings },
  { id: 'antrean-queue', title: 'Antrean dengan Queue', classId: 'if203b', type: 'Formatif', format: 'Teks / Kode', due: '6 Nov 2026', submitted: 12, enrolled: 35, state: 'berlangsung', avg: null, pending: 0 },
  { id: 'saling-bebas', title: 'Kejadian Saling Bebas', classId: 'st101a', type: 'Asesmen awal', format: 'Foto + Teks', due: '24 Okt 2026', submitted: 32, enrolled: 32, state: 'selesai', avg: 71, pending: 0 },
  { id: 'stack-vs-queue', title: 'Stack atau Queue?', classId: 'if203b', type: 'Formatif', format: 'Teks / Kode', due: '21 Okt 2026', submitted: 34, enrolled: 35, state: 'selesai', avg: 67, pending: 0 },
  { id: 'konsep-queue', title: 'Konsep Queue', classId: 'if203b', type: 'Asesmen awal', format: 'Teks / Kode', due: '7 Okt 2026', submitted: 33, enrolled: 35, state: 'selesai', avg: 61, pending: 0 },
  { id: 'peluang-sederhana', title: 'Peluang Sederhana', classId: 'st101a', type: 'Formatif', format: 'Foto + Teks', due: '30 Sep 2026', submitted: 31, enrolled: 32, state: 'selesai', avg: 69, pending: 0 },
  { id: 'stack-list', title: 'Stack dengan List Python', classId: 'if203b', type: 'Formatif', format: 'Teks / Kode', due: '23 Sep 2026', submitted: 35, enrolled: 35, state: 'selesai', avg: 63, pending: 0 },
  { id: 'ruang-sampel', title: 'Ruang Sampel', classId: 'st101a', type: 'Asesmen awal', format: 'Foto + Teks', due: '16 Sep 2026', submitted: 32, enrolled: 32, state: 'selesai', avg: 64, pending: 0 },
  { id: 'konsep-stack', title: 'Konsep Stack', classId: 'if203b', type: 'Asesmen awal', format: 'Teks / Kode', due: '9 Sep 2026', submitted: 35, enrolled: 35, state: 'selesai', avg: 58, pending: 0 },
]
export const classPending = (classId: string) => sessions.filter((s) => s.classId === classId).reduce((n, s) => n + s.pending, 0)

// Class trend for IF203 B: reviewed sessions, then the provisional one (shown dashed).
export const trend = {
  labels: ['9 Sep', '23 Sep', '7 Okt', '21 Okt', '28 Okt'],
  values: ['konsep-stack', 'stack-list', 'konsep-queue', 'stack-vs-queue', 'operasi-stack'].map((id) => sessions.find((s) => s.id === id)!.avg!),
}

export const LEVELS = [
  { id: 'sangat', name: 'Sangat baik', min: 85 },
  { id: 'baik', name: 'Baik', min: 70 },
  { id: 'cukup', name: 'Cukup', min: 55 },
  { id: 'perlu', name: 'Perlu pendampingan', min: 0 },
] as const
export const levelOf = (score: number) => LEVELS.find((l) => score >= l.min)!

// ── Bank Kegiatan Penguatan ──
export type Activity = { id: string; title: string; kind: 'Latihan bertahap' | 'Studi kasus' | 'Modul interaktif' | 'Video pembelajaran'; concepts: ConceptId[]; minutes: number; level: 'Dasar' | 'Menengah' | 'Tantangan'; goal: string; steps: string[]; outcome: string; active: boolean }
export const activities: Activity[] = [
  { id: 'lb-pilih', title: 'Stack atau Queue?', kind: 'Latihan bertahap', concepts: ['pilih', 'fifo'], minutes: 15, level: 'Menengah', goal: 'Memilih struktur dari urutan layanan yang diminta sebuah kasus.', steps: ['Lima kasus sehari-hari, dari yang mudah ke yang sulit', 'Umpan balik langsung di tiap kasus', 'Satu kasus terbuka untuk dijelaskan ke Boby'], outcome: 'Memilih queue untuk layanan berurutan dan stack untuk membatalkan langkah.', active: true },
  { id: 'sk-printer', title: 'Antrean printer laboratorium', kind: 'Studi kasus', concepts: ['pilih', 'fifo'], minutes: 20, level: 'Menengah', goal: 'Menganalisis akibat memilih struktur yang keliru pada antrean cetak.', steps: ['Membaca log 30 pengiriman dokumen', 'Membandingkan urutan cetak dengan stack dan queue', 'Menulis rekomendasi untuk admin lab'], outcome: 'Menjelaskan mengapa stack membuat dokumen lama tertunda terus.', active: true },
  { id: 'mi-telusur', title: 'Telusuri push dan pop', kind: 'Modul interaktif', concepts: ['pushpop', 'lifo'], minutes: 15, level: 'Dasar', goal: 'Menelusuri isi stack setelah setiap operasi.', steps: ['Tumpukan visual yang bisa di-push dan di-pop', 'Delapan soal tebak isi stack', 'Ringkasan langkah yang keliru'], outcome: 'Menuliskan isi stack yang benar setelah rangkaian operasi.', active: true },
  { id: 'vid-lifo', title: 'LIFO dalam enam menit', kind: 'Video pembelajaran', concepts: ['lifo'], minutes: 8, level: 'Dasar', goal: 'Memahami urutan LIFO lewat contoh tumpukan piring dan riwayat peramban.', steps: ['Video 6 menit', 'Dua pertanyaan cek pemahaman'], outcome: 'Menyebut contoh LIFO di luar pemrograman.', active: true },
  { id: 'lb-underflow', title: 'Saat stack kosong', kind: 'Latihan bertahap', concepts: ['underflow', 'pushpop'], minutes: 12, level: 'Menengah', goal: 'Menangani pop pada stack kosong tanpa program berhenti.', steps: ['Tiga potongan kode dengan pop berlebih', 'Menulis pengecekan sebelum pop', 'Menjelaskan pilihan ke Boby'], outcome: 'Menulis pop yang aman dari underflow.', active: true },
  { id: 'tt-kurung', title: 'Cek tanda kurung', kind: 'Latihan bertahap', concepts: ['lifo', 'pushpop'], minutes: 25, level: 'Tantangan', goal: 'Memakai stack untuk memeriksa pasangan tanda kurung.', steps: ['Lima ekspresi bertingkat', 'Menulis fungsi cek_kurung()', 'Menguji dengan kasus kosong dan tak seimbang'], outcome: 'Fungsi yang benar untuk ekspresi bertingkat.', active: true },
  { id: 'lb-bebas', title: 'Apakah kejadian ini saling bebas?', kind: 'Latihan bertahap', concepts: ['bebas'], minutes: 15, level: 'Menengah', goal: 'Membedakan kejadian saling bebas dan bergantung.', steps: ['Enam pasang kejadian', 'Menghitung P(A dan B) dua cara', 'Menjelaskan satu pasang ke Boby'], outcome: 'Menguji kebebasan dengan P(A dan B) = P(A) × P(B).', active: true },
  { id: 'sk-koin', title: 'Lima kali angka berturut-turut', kind: 'Studi kasus', concepts: ['fallacy', 'bebas'], minutes: 20, level: 'Menengah', goal: 'Menyadari gambler’s fallacy pada lemparan koin.', steps: ['Simulasi 1.000 lemparan', 'Membandingkan tebakan dengan hasil', 'Menulis kesimpulan'], outcome: 'Menjelaskan mengapa peluang lemparan berikutnya tetap 1/2.', active: true },
  { id: 'mi-ruang', title: 'Menyusun ruang sampel', kind: 'Modul interaktif', concepts: ['ruang', 'sederhana'], minutes: 15, level: 'Dasar', goal: 'Mendaftar ruang sampel dengan diagram pohon.', steps: ['Diagram pohon dua dadu', 'Menghitung titik sampel', 'Lima soal peluang sederhana'], outcome: 'Ruang sampel lengkap tanpa titik ganda.', active: true },
  { id: 'vid-komplemen', title: 'Peluang komplemen', kind: 'Video pembelajaran', concepts: ['komplemen'], minutes: 7, level: 'Dasar', goal: 'Memakai 1 − P(A) untuk soal “paling sedikit satu”.', steps: ['Video 5 menit', 'Tiga soal latihan'], outcome: 'Menyelesaikan soal “paling sedikit satu” dengan komplemen.', active: false },
]

// Which concept each archetype needs, and which activity the rule recommends (PRD §8.7: deterministic, from the bank).
export const NEED: Record<Arche, { need: 'penguatan' | 'pemantauan' | 'tidak'; concepts: ConceptId[]; activity: string }> = {
  terapan: { need: 'penguatan', concepts: ['pilih', 'fifo'], activity: 'lb-pilih' },
  bingung: { need: 'penguatan', concepts: ['lifo', 'pushpop'], activity: 'mi-telusur' },
  cukup: { need: 'pemantauan', concepts: ['pushpop'], activity: 'mi-telusur' },
  ambigu: { need: 'pemantauan', concepts: ['pushpop'], activity: 'mi-telusur' },
  kuat: { need: 'tidak', concepts: [], activity: 'tt-kurung' },
}

// Earlier mentoring assignments (sample history)
export const assignments = [
  { id: 'pd-12', title: 'Telusuri push dan pop', activity: 'mi-telusur', students: ['Lukman Hakim', 'Qori Amalia', 'Vino Saputra'], start: '22 Okt 2026, 08.00', due: '25 Okt 2026, 23.59', mode: 'Mandiri', done: 2, state: 'pelaksanaan' as const },
  { id: 'pd-11', title: 'Saat stack kosong', activity: 'lb-underflow', students: ['Nadia Rahmawati', 'Dimas Aryasatya'], start: '27 Okt 2026, 08.00', due: '1 Nov 2026, 23.59', mode: 'Mandiri', done: 0, state: 'pelaksanaan' as const },
  { id: 'pd-09', title: 'LIFO dalam enam menit', activity: 'vid-lifo', students: ['Taufik Hidayat', 'Wahyu Setiawan'], start: '14 Okt 2026, 08.00', due: '17 Okt 2026, 23.59', mode: 'Mandiri', done: 2, state: 'riwayat' as const },
]

// ── Student side (Nadia) ──
export const queueTask = {
  id: 'antrean-queue',
  title: 'Antrean dengan Queue',
  className: 'Struktur Data · Kelas B',
  type: 'Formatif',
  due: '6 Nov 2026, 23.59 WIB',
  instruction: 'Simulasikan antrean loket: enqueue("Ani"), enqueue("Budi"), dequeue(), enqueue("Cici"), dequeue(). Tulis kodenya dengan collections.deque, lalu sebutkan siapa yang dilayani dan siapa yang tersisa.',
  goal: 'Menjelaskan urutan FIFO dan membedakan kapan memakai queue atau stack.',
  code: `from collections import deque

antrean = deque()
antrean.append("Ani")
antrean.append("Budi")
antrean.popleft()      # Ani dilayani
antrean.append("Cici")
antrean.popleft()      # Budi dilayani
print(antrean)         # deque(['Cici'])`,
  explain: 'Yang dilayani Ani lalu Budi, dan tersisa Cici, karena queue melayani yang datang lebih dulu.',
  focus: [
    { concept: 'Prinsip FIFO', state: 'Sudah jelas' },
    { concept: 'Operasi enqueue & dequeue', state: 'Sedang ditinjau' },
    { concept: 'Memilih stack atau queue', state: 'Berikutnya' },
  ],
  // Boby's scripted turns. The second is a test statement (pernyataan uji) placed by the scheduler, not chosen by the model.
  boby: [
    'Aku lihat kamu pakai popleft(), bukan pop(). Kenapa harus dari kiri? Kalau pakai pop() biasa, siapa yang keluar duluan?',
    'Oh, berarti queue dan stack sebenarnya sama saja ya, cuma beda nama fungsi. Dua-duanya mengeluarkan elemen yang paling akhir masuk.',
    'Kalau begitu, untuk tombol Undo di aplikasi catatan, kamu pakai queue juga? Kenapa?',
  ],
  sample: [
    'popleft() mengambil dari kiri, yaitu Ani yang datang pertama. Kalau pop() biasa, yang keluar Budi karena dia yang terakhir masuk, dan itu bukan antrean.',
    'Queue mengeluarkan yang paling awal masuk, stack yang paling akhir masuk. Jadi urutan keluarnya berlawanan, bukan cuma beda nama.',
    'Tidak, Undo pakai stack, karena yang dibatalkan dulu perubahan terakhir.',
  ],
  penerapan: [
    'Pusat panggilan kampus menerima telepon dari 40 mahasiswa. Struktur apa yang kamu pakai untuk telepon yang menunggu dijawab? Jelaskan alasanmu.',
    'Tombol Kembali di peramban membuka halaman terakhir yang kamu kunjungi. Struktur apa yang cocok, dan apa yang terjadi saat Kembali ditekan dua kali?',
  ],
}

export const mySessions = [
  { id: 'antrean-queue', title: 'Antrean dengan Queue', className: 'Struktur Data · Kelas B', format: 'Kode + Teks', due: '6 Nov 2026', state: 'Sedang dikerjakan', stage: 0 },
  { id: 'saling-bebas-remed', title: 'Peluang Kejadian Saling Bebas', className: 'Statistika Dasar · Kelas A', format: 'Foto + Teks', due: '8 Nov 2026', state: 'Belum dimulai', stage: 0 },
]
export const myDone = [
  { id: 'operasi-stack', title: 'Operasi Stack', className: 'Struktur Data · Kelas B', submitted: '28 Okt 2026', state: 'Menunggu tinjauan dosen' },
  { id: 'stack-vs-queue', title: 'Stack atau Queue?', className: 'Struktur Data · Kelas B', submitted: '21 Okt 2026', state: 'Sudah ditinjau' },
  { id: 'peluang-sederhana', title: 'Peluang Sederhana', className: 'Statistika Dasar · Kelas A', submitted: '30 Sep 2026', state: 'Sudah ditinjau' },
]
export const myReview = {
  title: 'Stack atau Queue?',
  reviewedBy: 'Dr. Rina Anggraini',
  reviewedOn: '24 Okt 2026',
  strong: [
    { concept: 'Prinsip LIFO', note: 'Kamu menjelaskan bahwa elemen yang terakhir masuk keluar lebih dulu, dengan kata-katamu sendiri.' },
    { concept: 'Operasi push & pop', note: 'Penelusuran isi stack setelah setiap operasi sudah runtut.' },
  ],
  clarify: [
    { concept: 'Stack kosong (underflow)', note: 'Saat Boby bertanya apa yang terjadi bila pop dipanggil pada stack kosong, jawabanmu belum menyebut pengecekan sebelum pop.' },
  ],
  lecturerNote: 'Bagus di penelusuran. Coba latihan “Saat stack kosong” sebelum asesmen berikutnya, terutama bagian pengecekan sebelum pop.',
}
export const myActivities = [
  { activity: 'lb-underflow', from: 'Dr. Rina Anggraini', due: '1 Nov 2026, 23.59', mode: 'Mandiri', state: 'Sedang dikerjakan', progress: 2, total: 3 },
  { activity: 'vid-lifo', from: 'Dr. Rina Anggraini', due: '12 Okt 2026, 23.59', mode: 'Mandiri', state: 'Selesai', progress: 2, total: 2 },
]
export const activityById = (id: string) => activities.find((a) => a.id === id)!

// ── Banks the lecturer's setup screen draws suggestions from ──
// These are prepared per material and chosen by a rule, not by a model: the screen labels them as
// suggestions and the lecturer decides. Nothing here is generated at runtime.
export type QKind = 'praktik' | 'klarifikasi' | 'penerapan'
export const QKIND_LABEL: Record<QKind, string> = { praktik: 'Praktik', klarifikasi: 'Klarifikasi Boby', penerapan: 'Penerapan' }
export type Question = { id: string; kind: QKind; text: string }

export const questionBank: Record<string, { kind: QKind; text: string }[]> = {
  'Stack & Queue': [
    { kind: 'praktik', text: 'Simulasikan operasi berikut pada stack kosong: push(3), push(7), pop(), push(5), push(9), pop(). Tulis kodenya dengan list Python, lalu sebutkan elemen yang keluar dan isi akhir stack.' },
    { kind: 'praktik', text: 'Tulis fungsi cek_kurung(teks) yang memeriksa pasangan tanda kurung memakai stack. Uji dengan "(()" dan "(())".' },
    { kind: 'klarifikasi', text: 'Kalau pop dipanggil pada stack yang sudah kosong, apa yang terjadi pada programmu dan bagaimana kamu mencegahnya?' },
    { kind: 'klarifikasi', text: 'Kamu memakai pop() tanpa indeks. Elemen mana yang diambil, dan kenapa bukan yang lain?' },
    { kind: 'penerapan', text: 'Printer laboratorium menerima dokumen dari 30 mahasiswa. Struktur apa yang kamu pakai untuk dokumen yang menunggu dicetak? Jelaskan alasanmu.' },
    { kind: 'penerapan', text: 'Fitur Undo di editor teks membatalkan perubahan terakhir lebih dulu. Struktur apa yang cocok, dan apa yang terjadi saat Undo ditekan dua kali?' },
    { kind: 'penerapan', text: 'Tombol Kembali di peramban membuka halaman terakhir yang dikunjungi. Struktur apa yang cocok, dan apa bedanya dengan antrean loket?' },
  ],
  Peluang: [
    { kind: 'praktik', text: 'Sebuah dadu dilempar dua kali. Tuliskan ruang sampelnya, lalu hitung peluang jumlah kedua mata dadu sama dengan 8.' },
    { kind: 'praktik', text: 'Dari satu kantong berisi 4 bola merah dan 6 bola putih diambil dua bola tanpa pengembalian. Hitung peluang keduanya merah, dan tuliskan langkahnya.' },
    { kind: 'klarifikasi', text: 'Kamu menjumlahkan dua peluang. Apa syarat agar P(A atau B) boleh ditulis sebagai P(A) + P(B)?' },
    { kind: 'klarifikasi', text: 'Hasil sebelumnya sudah muncul lima kali berturut-turut. Apakah itu mengubah peluang lemparan berikutnya? Jelaskan alasanmu.' },
    { kind: 'penerapan', text: 'Aplikasi cuaca menyebut peluang hujan 70% hari ini. Apa arti angka itu, dan apa yang bukan artinya?' },
    { kind: 'penerapan', text: 'Sebuah tes penyakit disebut akurat 95%. Mengapa hasil positif belum tentu berarti peluang sakit 95%?' },
  ],
}

export const indicatorBank: Record<string, { name: string; concept: ConceptId; weight: number }[]> = {
  'Stack & Queue': [
    { name: 'Menjelaskan urutan LIFO', concept: 'lifo', weight: 30 },
    { name: 'Menelusuri push dan pop', concept: 'pushpop', weight: 25 },
    { name: 'Menolak analogi antrean untuk stack', concept: 'fifo', weight: 25 },
    { name: 'Menerapkan stack atau queue di kasus baru', concept: 'pilih', weight: 20 },
    { name: 'Menangani stack kosong', concept: 'underflow', weight: 15 },
  ],
  Peluang: [
    { name: 'Menyusun ruang sampel', concept: 'ruang', weight: 25 },
    { name: 'Menghitung peluang sederhana', concept: 'sederhana', weight: 25 },
    { name: 'Menguji kebebasan kejadian', concept: 'bebas', weight: 25 },
    { name: 'Menolak gambler’s fallacy', concept: 'fallacy', weight: 25 },
    { name: 'Memakai peluang komplemen', concept: 'komplemen', weight: 20 },
  ],
}

/** Classes a student can join with a code. The codes are the ones printed on each class card. */
export const joinable = classes.map((c) => ({ id: c.id, code: c.joinCode, name: `${c.name} · ${c.group}`, material: c.material, lecturer: lecturer.name }))

/** A class the demo student has not joined yet, so entering a code has something real to find. */
export const openClasses = [
  { id: 'ap101c', code: 'AP101', name: 'Algoritma Pemrograman', group: 'Kelas C', joinCode: 'AP-C26', material: 'Stack & Queue', enrolled: 38 },
]
