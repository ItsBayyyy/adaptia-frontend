import type { TourStep } from './Tour'

/**
 * A walkthrough per screen, not per room: every sidebar destination explains itself, so a first-time
 * user can ask "what am I looking at" wherever they happen to be.
 *
 * Each step points at something really on that screen. Anchors reuse the landmarks the markup already
 * has (`aria-labelledby`, `aria-label`) where one exists, and `data-tour` where none did.
 */
const nav = (body: string): TourStep => ({ sel: '[data-tour="nav"]', title: 'Menu ruang Anda', body })
const help: TourStep = { sel: '[data-tour="bantuan"]', title: 'Panduan ini selalu ada', body: 'Tombol Panduan membuka penjelasan layar yang sedang Anda buka. Isinya berbeda di tiap menu. Tekan Escape untuk menutup.' }

export function routeKey(path: string) {
  const [, area, a, b] = path.split('/')
  if (area === 'mahasiswa') {
    if (!a) return 'mhs-home'
    if (a === 'sesi' && b) return 'mhs-kerja'
    if (a === 'sesi') return 'mhs-sesi'
    if (a === 'ringkasan') return 'mhs-ringkasan'
    if (a === 'penguatan') return 'mhs-penguatan'
    return 'mhs-home'
  }
  if (!a) return 'dsn-home'
  if (a === 'sesi' && b === 'baru') return 'dsn-baru'
  if (a === 'sesi') return 'dsn-sesi'
  if (a === 'tinjauan') return 'dsn-tinjauan'
  if (a === 'pendampingan' && b === 'tugaskan') return 'dsn-tugaskan'
  if (a === 'pendampingan') return 'dsn-dampingi'
  if (a === 'perkembangan') return 'dsn-kembang'
  if (a === 'peta-kelas') return 'dsn-peta'
  if (a === 'bank-kegiatan') return 'dsn-bank'
  return 'dsn-home'
}

export const TOURS: Record<string, TourStep[]> = {
  // ── Ruang mahasiswa ──
  'mhs-home': [
    nav('Sesi yang harus dikerjakan, riwayat belajar, dan kegiatan penguatan dari dosen. Semua pekerjaan Anda ada di tiga tautan ini.'),
    { sel: '[data-tour="sesi"]', title: 'Sesi yang sedang berjalan', body: 'Kartu ini menampilkan satu sesi yang menunggu Anda beserta batas waktunya. Tombolnya membawa Anda ke tempat Anda berhenti.' },
    { sel: '[data-tour="tahap"]', title: 'Setiap sesi melewati tiga tahap', body: 'Praktik untuk menjawab, Reverse-Tutor untuk mengajari Boby, dan Penerapan untuk kasus baru. Titik ungu menandai tahap Anda sekarang.' },
    { sel: '[data-tour="penguatan"]', title: 'Kegiatan dari dosen', body: 'Ketika dosen melihat konsep yang belum kuat, kegiatan penguatan muncul di sini lengkap dengan kemajuan dan batas waktunya.' },
    { sel: '[data-tour="gabung"]', title: 'Masuk kelas dengan kode', body: 'Dosen memberi kode kelas setelah sesi dipublikasikan. Ketik kodenya di sini, lalu kelas dan sesinya muncul di daftar Anda.' },
    help,
  ],
  'mhs-sesi': [
    nav('Anda sedang di Sesi Belajar: semua sesi dari kelas yang Anda ikuti.'),
    { sel: '[data-tour="daftar-sesi"]', title: 'Semua sesi Anda', body: 'Sesi yang perlu dikerjakan dan yang sudah selesai dipisahkan. Setiap baris memuat format jawaban, batas waktu, dan statusnya.' },
    help,
  ],
  'mhs-kerja': [
    nav('Anda sedang mengerjakan satu sesi. Menu tetap bisa dibuka kapan saja.'),
    { sel: '[aria-label="Tahap sesi"]', title: 'Tiga tahap, berurutan', body: 'Kerjakan praktik dulu, lalu jelaskan jawaban Anda ke Boby, lalu selesaikan soal penerapan. Kemajuannya terlihat di sini.' },
    { sel: '[aria-labelledby="cara-h"]', title: 'Yang dinilai adalah alasannya', body: 'Jelaskan alasan, bukan hanya jawaban akhir. Kalimat Anda yang dibaca dosen, bukan skor otomatis.' },
    help,
  ],
  'mhs-ringkasan': [
    nav('Anda sedang membaca hasil tinjauan dosen atas satu sesi.'),
    { sel: '[aria-labelledby="kuat-h"]', title: 'Yang sudah kuat', body: 'Bagian yang menurut dosen sudah Anda jelaskan dengan baik, beserta kalimat Anda sendiri sebagai buktinya.' },
    { sel: '[aria-labelledby="jelas-h"]', title: 'Yang perlu diperjelas', body: 'Konsep yang belum terlihat jelas dari penjelasan Anda. Di sinilah kegiatan penguatan biasanya menyusul.' },
    { sel: '[aria-labelledby="catatan-h"]', title: 'Catatan dosen', body: 'Pesan dari dosen untuk sesi ini. Keputusan akhir selalu di tangan dosen, bukan AI.' },
    help,
  ],
  'mhs-penguatan': [
    nav('Anda sedang di Kegiatan Penguatan: latihan yang ditugaskan dosen.'),
    { sel: '[aria-labelledby="aktif-h"]', title: 'Kegiatan yang berjalan', body: 'Kegiatan yang belum selesai beserta langkah dan batas waktunya. Kerjakan dari sini.' },
    { sel: '[aria-labelledby="riwayat-h"]', title: 'Riwayat kegiatan', body: 'Kegiatan yang sudah Anda selesaikan, supaya terlihat apa saja yang sudah dilatih.' },
    help,
  ],

  // ── Ruang dosen ──
  'dsn-home': [
    nav('Dari sesi asesmen, ke tinjauan bukti, ke pendampingan, lalu perkembangan kelas. Urutan menu mengikuti urutan pekerjaan.'),
    { sel: '[data-tour="angka"]', title: 'Yang menunggu keputusan Anda', body: 'Angka ketiga adalah temuan yang diusulkan AI dan belum Anda putuskan. Itu satu-satunya angka di layar ini yang menuntut tindakan.' },
    { sel: '[data-tour="aksi"]', title: 'Satu klik ke pekerjaan utama', body: 'Tombol ini membuka antrean tinjauan: kutipan mahasiswa, usulan AI, dan tombol Terima, Koreksi, atau Tolak.' },
    { sel: '[data-tour="tindak"]', title: 'Tindak lanjut yang berjalan', body: 'Pendampingan yang sedang berlangsung beserta progresnya. ADAPTIA tidak pernah menugaskan sendiri; semuanya dikirim oleh Anda.' },
    help,
  ],
  'dsn-sesi': [
    nav('Anda sedang di Sesi Asesmen: semua sesi yang Anda buat.'),
    { sel: '[aria-label="Daftar sesi"]', title: 'Semua sesi kelas Anda', body: 'Terkumpul, rata-rata sementara, dan status tiap sesi. Sesi yang perlu ditinjau selalu berada di atas.' },
    { sel: '[data-tour="buat"]', title: 'Membuat sesi baru', body: 'Dari sini Anda menyusun pertanyaan dan rubrik, lalu mendapat kode kelas untuk dibagikan ke mahasiswa.' },
    help,
  ],
  'dsn-baru': [
    nav('Anda sedang menyusun satu sesi asesmen baru.'),
    { sel: '[data-tour="bagian"]', title: 'Tiga bagian pengaturan', body: 'Informasi sesi, daftar pertanyaan, dan rubrik penilaian. Sesi baru bisa dipublikasikan setelah ketiganya lengkap.' },
    { sel: '[data-tour="usul"]', prep: '[data-tour="bagian"] [role="tab"]:nth-of-type(2)', title: 'Usulan pertanyaan', body: 'Di bagian Pertanyaan, tombol ini menambahkan soal dari bank materi yang sudah ditinjau. Usulan tetap Anda baca dan ubah sebelum dipakai.' },
    { sel: '[aria-labelledby="ringkas-h"]', title: 'Ringkasan sebelum publikasi', body: 'Jumlah pertanyaan, format jawaban, dan perkiraan waktu pengerjaan mahasiswa. Setelah dipublikasikan, kode kelas muncul untuk dibagikan.' },
    help,
  ],
  'dsn-tinjauan': [
    nav('Anda sedang meninjau bukti satu sesi asesmen.'),
    { sel: '[aria-labelledby="daftar-h"]', title: 'Antrean mahasiswa', body: 'Mahasiswa yang menunggu keputusan Anda. Titik di sebelah nama menandai temuan yang belum diputuskan.' },
    { sel: '[aria-labelledby="bukti-h"]', title: 'Bukti lengkapnya', body: 'Kode, penjelasan, dan percakapan dengan Boby. Inilah yang menjadi dasar setiap usulan temuan.' },
    { sel: '[aria-labelledby="temuan-h"]', title: 'Usulan AI, keputusan Anda', body: 'Tiap temuan disertai kutipan persis dari transkrip. Terima, Koreksi, atau Tolak; skor hanya berubah setelah Anda memutuskan.' },
    help,
  ],
  'dsn-dampingi': [
    nav('Anda sedang di Pendampingan: menindaklanjuti temuan yang sudah diputuskan.'),
    { sel: '[aria-label="Ringkasan kebutuhan"]', title: 'Siapa yang perlu didampingi', body: 'Ringkasan kebutuhan kelas berdasarkan temuan yang sudah Anda putuskan, bukan dugaan AI.' },
    { sel: '[aria-labelledby="saran-h"]', title: 'Saran kegiatan', body: 'Kegiatan dari bank yang cocok dengan konsep yang lemah. Pemetaannya memakai aturan tetap, bukan model.' },
    help,
  ],
  'dsn-tugaskan': [
    nav('Anda sedang menugaskan kegiatan penguatan ke sejumlah mahasiswa.'),
    { sel: '[aria-label="Langkah"]', title: 'Empat langkah', body: 'Pilih mahasiswa, pilih kegiatan, atur jadwal, lalu tinjau pesannya sebelum dikirim.' },
    { sel: '[aria-labelledby="s1-h"]', title: 'Mulai dari mahasiswanya', body: 'Hanya mahasiswa dengan temuan yang sudah Anda putuskan yang bisa dipilih. Yang sedang menjalani pendampingan tidak muncul.' },
    help,
  ],
  'dsn-kembang': [
    nav('Anda sedang di Perkembangan: bagaimana kelas bergerak antar sesi.'),
    { sel: '[aria-label="Angka utama"]', title: 'Angka utama kelas', body: 'Rata-rata dan perubahannya dibanding sesi sebelumnya. Angka ini berasal dari temuan yang sudah Anda putuskan.' },
    { sel: '[aria-labelledby="tren-h"]', title: 'Tren antar sesi', body: 'Garis putus-putus menandai sesi yang masih sementara karena belum semua temuan diputuskan.' },
    { sel: '[aria-labelledby="konsep-h"]', prep: '[role="tablist"] [role="tab"]:nth-of-type(2)', title: 'Konsep yang paling lemah', body: 'Beralih ke tampilan Konsep untuk melihat konsep yang paling sering belum terpenuhi di kelas ini.' },
    help,
  ],
  'dsn-peta': [
    nav('Peta Kelas menampilkan seluruh mahasiswa dalam denah duduk. Setiap kotak terbagi empat: satu petak per indikator rubrik.'),
    { sel: '[data-tour="filter-indikator"]', title: 'Filter per indikator', body: 'Tombol ini menyaring warna kotak berdasarkan satu indikator. Gunakan untuk melihat konsep mana yang paling banyak belum terpenuhi.' },
    { sel: '[data-tour="peta-grid"]', title: 'Denah kelas', body: 'Arahkan kursor ke kotak mana pun untuk melihat detail mahasiswa di panel samping. Warna mengikuti status indikator: ungu berarti terpenuhi, krem berarti belum.' },
    { sel: '[data-tour="detail-mhs"]', title: 'Detail mahasiswa', body: 'Panel ini menampilkan status tiap indikator, kutipan bukti, dan tautan ke halaman tinjauan untuk mahasiswa yang sedang dipilih.' },
    { sel: '[data-tour="ringkasan-angka"]', title: 'Ringkasan angka', body: 'Jumlah mahasiswa, yang sudah mengumpulkan, yang perlu ditinjau, dan rata-rata sementara kelas.' },
    help,
  ],
  'dsn-bank': [
    nav('Anda sedang di Bank Kegiatan: kumpulan kegiatan penguatan yang bisa ditugaskan.'),
    { sel: '[aria-label="Daftar kegiatan"]', title: 'Kegiatan yang tersedia', body: 'Tiap kegiatan punya konsep sasaran, tingkat, dan perkiraan durasi. Yang nonaktif tidak muncul sebagai saran.' },
    { sel: '[aria-labelledby="baru-h"]', prep: '[data-tour="tambah-kegiatan"]', title: 'Menambah kegiatan sendiri', body: 'Tombol Tambah kegiatan membuka formulir ini: nama, konsep yang disasar, tingkat, dan langkah-langkahnya.' },
    help,
  ],
}

export const tourFor = (path: string) => TOURS[routeKey(path)] ?? TOURS['mhs-home']
