# Design Spec — ADAPTIA

Dokumen ini adalah sumber kebenaran visual untuk ADAPTIA. Mengambil arah tata letak dan ritme dari Takara (takara-frontend.vercel.app) — bersih, berpusat pada narasi, kartu-kartu berjeda luas — lalu mengganti bahasa warnanya dengan palet ivory–lavender–ungu ADAPTIA.

Catatan arah: Takara menjual *percakapan AI yang terasa manusiawi*. ADAPTIA menjual *bukti pemahaman mahasiswa*. Keduanya butuh nada tenang dan satu aksen kuat. Kita memakai ungu `#9E61FD` sebagai aksen itu, dengan `#6A39BF` untuk teks ungu agar kontras di atas putih tetap aman.

---

## 1. Prinsip Desain

1. **Tenang di latar, tegas di aksen.** Mayoritas layar adalah ivory dan putih. Ungu muncul hanya di titik keputusan: CTA, progres, grafik, maskot Boby.
2. **Bukti sebelum klaim.** Setiap angka (skor, κ, durasi) harus terbaca utuh tanpa kursor melayang. Tooltip untuk pelengkap, bukan untuk konten utama.
3. **Satu aksi utama per layar.** Takara meletakkan satu CTA charcoal di hero; ADAPTIA mengikuti pola ini — tombol primer charcoal `#2A272D`, tombol sekunder berbingkai `#ECE5F3`.
4. **Human-in-the-loop terasa di UI.** Temuan AI selalu memakai label "Usulan AI" dan pil status; tidak pernah ditulis seolah-olah vonis final.
5. **Formatif, bukan pengawasan.** Tidak ada warna merah bahaya di dashboard dosen. Status "belum" memakai lavender pucat, bukan merah.

---

## 2. Palet Warna

### 2.1 Token dasar

| Token | Hex | Peran |
|---|---|---|
| `--bg-ivory` | `#FEF8F5` | Latar dasar halaman |
| `--bg-peach` | `#FEE6E0` | Gradasi atas hero, pita penekanan |
| `--bg-lavender` | `#F5E1F8` | Gradasi bawah hero, kartu persona |
| `--surface` | `#FFFFFF` | Panel, kartu, modal |
| `--accent` | `#9E61FD` | Elemen visual: progres, waveform, ikon aksen |
| `--accent-mascot` | `#A770FC` | Warna maskot Boby, variasi aksen |
| `--accent-text` | `#6A39BF` | Teks ungu di atas putih, tautan |
| `--text-primary` | `#1E1C27` | Judul, body utama |
| `--text-secondary` | `#6D6B80` | Keterangan, meta, label kecil |
| `--button-primary` | `#2A272D` | Latar tombol utama (charcoal) |
| `--border` | `#ECE5F3` | Garis pembatas, bingkai kartu, divider |

### 2.2 Aturan pemakaian warna

- **Teks ungu di atas putih WAJIB `#6A39BF`.** `#9E61FD` tidak lulus WCAG AA sebagai body text di `#FFFFFF`.
- **`#9E61FD` hanya untuk elemen visual non-teks:** garis progres, titik grafik, ikon, waveform, highlight bagan.
- **`#A770FC` disimpan untuk ilustrasi Boby.** Jangan dipakai untuk UI; ini warna karakter.
- **Charcoal `#2A272D` adalah tombol utama,** bukan heading. Heading tetap `#1E1C27`.
- **Garis pembatas `#ECE5F3` adalah default.** Jangan menambahkan border abu-abu lain.

### 2.3 Status pil (badge)

| Status temuan | Latar | Teks | Keterangan |
|---|---|---|---|
| Terpenuhi | `#EEE4FD` | `#6A39BF` | Lavender terang + ungu teks |
| Sebagian | `#FEE6E0` | `#8A3F2C` | Peach + coklat-oranye (dihitung dari peach) |
| Belum | `#F3EEF8` | `#6D6B80` | Lavender pucat + abu sekunder — bukan merah |
| Ambigu | `#FFFFFF` | `#1E1C27` | Putih + border `#ECE5F3` + ikon tanda tanya |

Tidak ada warna merah di dashboard dosen. Prinsip formatif.

### 2.4 Gradien

- **Hero gradient:** `linear-gradient(180deg, #FEE6E0 0%, #FEF8F5 55%, #F5E1F8 100%)` — peach atas, ivory tengah, lavender bawah. Dipakai sekali di landing hero dan satu CTA penutup.
- **Panel aksen:** `linear-gradient(135deg, #FFFFFF 0%, #F5E1F8 100%)` untuk kartu persona/material agar beda dari kartu putih biasa.

### 2.5 Dark mode

Tidak ada dark mode di v1. Palet ini light-oriented. Dokumentasikan sebagai keputusan sadar: fokus desain adalah ruang kelas dan tinjauan dosen, bukan koding malam.

---

## 3. Tipografi

### 3.1 Keluarga font

- **Display & body:** Plus Jakarta Sans (variable, dirancang di Indonesia). Fallback: `ui-sans-serif, system-ui, sans-serif`. *(v1.1: menggantikan Inter, yang terbaca sebagai font bawaan template.)*
- **Monospace (hanya kode asli dan editor):** JetBrains Mono. Fallback: `ui-monospace, "SF Mono", monospace`.

Takara memakai sans-serif netral tanpa serif. Kita ikut. Tidak ada serif, tidak ada display font bergaya.

### 3.2 Skala

| Nama | Ukuran | Line-height | Weight | Pakai |
|---|---|---|---|---|
| `display-1` | 56 / 64 | 1.05 | 600 | H1 hero landing |
| `display-2` | 40 / 48 | 1.1 | 600 | H1 halaman dalam, CTA penutup |
| `h2` | 32 | 1.2 | 600 | Judul section |
| `h3` | 22 | 1.3 | 600 | Judul kartu, judul material |
| `h4` | 18 | 1.4 | 600 | Sub-judul |
| `body-lg` | 18 | 1.55 | 400 | Deskripsi hero |
| `body` | 16 | 1.6 | 400 | Body default |
| `body-sm` | 14 | 1.5 | 400 | Meta, caption |
| `label` | 12 | 1.4 | 500 / uppercase / tracking 0.08em | Label kategori ("Material", "Dosen") |
| `code` | 14 | 1.55 | 400 (mono) | Transkrip, kutipan, snippet |
| `score` | 48 | 1 | 600 (tabular-nums) | Angka skor pada kartu laporan |

Semua ukuran responsif via `clamp()` di breakpoint < 768px: `display-1` turun ke 40, `display-2` ke 32.

### 3.3 Aturan

- Hierarki per halaman: satu H1. Section pakai H2.
- Teks sekunder (`#6D6B80`) hanya untuk kalimat pelengkap, tidak lebih panjang dari satu baris di layar normal.
- Angka skor dan metrik WAJIB `font-variant-numeric: tabular-nums`.
- Hindari italic untuk penekanan — pakai weight 600 atau pil berwarna.

---

## 4. Spacing, Layout, Radius, Shadow

### 4.1 Spacing scale

Kelipatan 4px: `4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 128`. Jangan menyimpang.

### 4.2 Layout

- **Container utama:** `max-width: 1120px`, padding horizontal 24px (mobile) / 48px (desktop).
- **Hero padding atas:** 96–128px desktop, 56px mobile.
- **Jarak antar section:** 96px desktop, 56px mobile.
- **Grid kartu fitur:** 3 kolom desktop (gap 24px), 2 kolom tablet, 1 kolom mobile.
- **Grid kartu material/persona:** 2 kolom desktop (gap 32px), 1 kolom mobile.
- **Breakpoints:** `sm 640`, `md 768`, `lg 1024`, `xl 1280`.

### 4.3 Radius

| Token | Nilai | Pakai |
|---|---|---|
| `radius-sm` | 8px | Pil, badge |
| `radius-md` | 12px | Input, tombol kecil |
| `radius-lg` | 16px | Tombol utama, kartu kecil |
| `radius-xl` | 24px | Kartu fitur, kartu laporan |
| `radius-2xl` | 32px | Hero panel, modal besar |
| `radius-full` | 999px | Avatar, floating action |

Takara memakai radius generous. Kita juga.

### 4.4 Shadow / elevasi

Shadow lembut, warna lavender tipis — bukan abu-abu netral.

| Token | Nilai |
|---|---|
| `shadow-xs` | `0 1px 2px rgba(30, 28, 39, 0.04)` |
| `shadow-sm` | `0 2px 8px rgba(106, 57, 191, 0.06)` |
| `shadow-md` | `0 8px 24px rgba(106, 57, 191, 0.08)` |
| `shadow-lg` | `0 16px 48px rgba(106, 57, 191, 0.10)` |
| `shadow-focus` | `0 0 0 3px rgba(158, 97, 253, 0.35)` |

Kartu default pakai `shadow-sm`. Hover naik ke `shadow-md`. Modal `shadow-lg`.

---

## 5. Komponen UI

### 5.1 Tombol

**Primer (charcoal)**
- Latar `#2A272D`, teks `#FEF8F5`.
- Padding 14/24 (sm), 16/28 (md), 20/32 (lg).
- Radius `radius-lg`, weight 600, 15px.
- Hover: latar `#1E1C27`. Active: shadow dalam 1px.
- Fokus: `shadow-focus`.
- Pakai untuk aksi utama: "Mulai sesi dengan Boby", "Simpan tinjauan".

**Sekunder (bingkai)**
- Latar `#FFFFFF`, border `1px solid #ECE5F3`, teks `#1E1C27`.
- Hover: latar `#FEF8F5`, border `#9E61FD`.
- Pakai untuk aksi pendamping: "Lihat contoh laporan".

**Tersier (teks ungu)**
- Tanpa latar, teks `#6A39BF`, underline on hover.
- Pakai untuk tautan dalam paragraf, "Lihat semua".

**Ikon (ghost)**
- 40×40, radius `radius-md`, ikon `#6D6B80`.
- Hover: latar `#F5E1F8`, ikon `#6A39BF`.

Satu CTA primer per layar. Jika ada dua, yang satu wajib sekunder.

### 5.2 Kartu

**Kartu fitur / use case**
- Latar `#FFFFFF`, border `1px solid #ECE5F3`, radius `radius-xl`, padding 32.
- Judul `h3` + body + ikon kecil `#9E61FD` di pojok kiri atas (24×24 dalam kotak lavender `#F5E1F8` radius `radius-md`).
- Shadow default: `none`. Hover: `shadow-md`, border `#9E61FD`.

**Kartu material (persona-equivalent Takara)**
- Latar gradien panel aksen (2.4), radius `radius-xl`, padding 32.
- Label kecil di atas (`label`, warna `#6A39BF`): "Struktur Data" / "Statistika Dasar".
- Judul `h3`: "Stack & Queue" / "Peluang".
- Daftar sub-topik sebagai pil kecil.
- Tombol tersier "Mulai sesi →" di bawah.

**Kartu laporan Boby (sample report)**
- Latar `#FFFFFF`, radius `radius-2xl`, padding 40, `shadow-sm`.
- Header: nama mahasiswa anonim + material + durasi.
- Skor besar di tengah: `score` 48px dengan ring progres SVG ungu `#9E61FD` di belakangnya (lingkaran 120×120, stroke 8, track `#ECE5F3`).
- Grid 2×2 sub-skor di bawah: Artikulasi, Akurasi kutipan, Deteksi jebakan, Konsistensi.
- Footer kartu: pil status + tombol "Tinjau transkrip".

### 5.3 Navigasi

- **Nav atas:** tinggi 64px, logo kiri (wordmark + maskot kecil), nav tengah/kanan.
- Latar awal: transparan di hero, isi menjadi `rgba(254, 248, 245, 0.85)` dengan `backdrop-filter: blur(12px)` setelah scroll > 24px.
- Border bawah muncul setelah scroll: `1px solid #ECE5F3`.
- Item nav: 15px, weight 500, `#1E1C27`. Hover: `#6A39BF`.
- CTA kanan: tombol primer charcoal "Masuk".

**Side nav (dashboard dosen)**
- Lebar 256px, latar `#FFFFFF`, border kanan `#ECE5F3`.
- Item: tinggi 44px, radius `radius-md`, padding 12.
- Aktif: latar `#F5E1F8`, teks `#6A39BF`, garis kiri 3px `#9E61FD`.
- Hover: latar `#FEF8F5`.

### 5.4 Input & form

- Tinggi 48px, radius `radius-md`, border `1px solid #ECE5F3`, padding horizontal 16.
- Fokus: border `#9E61FD`, `shadow-focus`.
- Error: border `#B5452E` (turunan peach gelap), pesan di bawah `body-sm` warna sama.
- Label di atas input: `label` warna `#6D6B80`.

### 5.5 Boby chat bubble

**Pesan mahasiswa**
- Latar `#2A272D`, teks `#FEF8F5`, radius `radius-xl` dengan sudut kanan-bawah `radius-sm`.
- Align kanan, max-width 70%.

**Pesan Boby**
- Latar `#F5E1F8`, teks `#1E1C27`, radius `radius-xl` dengan sudut kiri-bawah `radius-sm`.
- Avatar Boby 32×32 di kiri, warna `#A770FC`.
- Jebakan ditandai dengan garis kiri 3px `#9E61FD` dan label kecil "⚠ Jebakan — tandai jika kamu tidak setuju".

**Komposer**
- Textarea radius `radius-xl`, padding 16, border `#ECE5F3`.
- Tombol kirim bulat charcoal 44×44 di kanan dalam.
- Toggle "Setuju / Tidak setuju" muncul sebagai dua pil besar di atas komposer saat pernyataan uji dilempar.

### 5.6 Ring skor & meter

- Lingkaran SVG, stroke 8, track `#ECE5F3`, isi `#9E61FD`.
- Angka di tengah: `score`, warna `#1E1C27`.
- Animasi stroke: 600ms `cubic-bezier(0.22, 1, 0.36, 1)` saat pertama muncul.

### 5.7 Pil status & kategori

- Padding 4/10, radius `radius-full`, `label` 12px.
- Lihat §2.3 untuk warna status.
- Pil kategori (netral): latar `#F5E1F8`, teks `#6A39BF`.

### 5.8 Transkrip & kutipan

- Latar `#FEF8F5`, border kiri 3px `#9E61FD`, padding 16, radius `radius-md`.
- Teks `code` (mono) 14px.
- Kutipan yang diverifikasi: highlight kuning sangat pucat `#FFF4E6` pada potongan yang cocok dengan transkrip; tooltip "Terverifikasi ada di transkrip".
- Kutipan yang gagal verifikasi: coretan tipis + label "Tidak ditemukan di transkrip".

### 5.9 Editor kode (code tasks)

- Latar `#1E1C27`, teks `#FEF8F5`.
- Syntax highlight pakai palet ungu/peach: keyword `#A770FC`, string `#FEE6E0`, comment `#6D6B80`.
- Panel runner di bawah editor, latar `#2A272D`, output mono.
- Tombol run: primer charcoal dengan ikon play ungu `#9E61FD`.

### 5.10 Modal, toast, tooltip

- **Modal:** latar `#FFFFFF`, radius `radius-2xl`, `shadow-lg`, max-width 560. Overlay `rgba(30, 28, 39, 0.4)`.
- **Toast:** radius `radius-lg`, padding 16/20, `shadow-md`, muncul kanan-bawah. Sukses: latar `#EEE4FD`, teks `#6A39BF`. Info netral: putih + border.
- **Tooltip:** latar `#1E1C27`, teks `#FEF8F5`, radius `radius-sm`, 12px.

---

## 6. Pola Halaman

### 6.1 Landing (publik)

Mengikuti struktur Takara:

1. **Nav** transparan → solid setelah scroll.
2. **Hero** (gradien 2.4): label `AI teachable agent` → H1 "Ajari Boby. Buktikan paham." → body 1 kalimat → dua CTA (primer "Mulai sesi dengan Boby", sekunder "Lihat contoh laporan") → baris 3 statistik: `≥ κ 0.6`, `8–12 menit`, `2 materi`.
3. **Fitur** (6 kartu, 3×2): Dialog pernyataan uji, Jebakan terkurasi, Verifikator kutipan, Analis AI, Dashboard dosen, Bank jebakan.
4. **Cara kerja** (3 langkah bernomor 01–03): Pilih material → Ajari Boby → Dosen tinjau temuan.
5. **Material** (2 kartu persona-equivalent): Stack & Queue, Peluang.
6. **Contoh laporan**: satu kartu laporan Boby (§5.2) + ring skor + 4 sub-skor.
7. **Use cases** (6 item list): kelas besar, kuis formatif, sebelum UTS, remedial, kelas asinkron, flipped classroom.
8. **CTA penutup** (gradien ulang): H2 "Mulai dengan satu sesi 10 menit." + tombol primer.
9. **Footer**: logo + © 2026 + nav + email tim.

### 6.2 Dashboard dosen

- Side nav kiri (§5.3) + konten.
- Header halaman: judul kelas + filter (material, rentang tanggal).
- Baris 4 KPI atas: Jumlah sesi, Rata-rata skor, Miskonsepsi teratas, Mahasiswa butuh perhatian.
- Tabel transkrip: nama (anonim/terbuka — toggle), material, durasi, skor sementara, status tinjauan (pil).
- Baris baris diklik → drawer kanan dengan transkrip + usulan AI per indikator rubrik + tombol Terima / Koreksi / Tolak.

### 6.3 Sesi Boby (mahasiswa)

- Fullscreen, latar `#FEF8F5`.
- Header tipis: nama material + progres bar ungu + timer.
- Area chat (§5.5) di tengah, max-width 760.
- Panel kanan opsional (toggle): rubrik indikator — mahasiswa boleh lihat bahwa Boby sedang menguji konsep "LIFO vs FIFO" misalnya.
- Setelah sesi: layar transisi "Boby sedang menyusun ringkasan…" dengan waveform ungu `#9E61FD` sebagai loader.
- Hasil: kartu laporan (§5.2) + CTA "Simpan" / "Ulangi sesi".

### 6.4 Setup Kelas (dosen)

- Wizard 3 langkah: pilih material → atur rubrik → undang mahasiswa.
- Progress steps di atas memakai lingkaran ungu untuk langkah aktif, lavender pucat untuk langkah mendatang.

---

## 7. Motion & Micro-interactions

Durasi default: 200ms. Easing default: `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint).

| Interaksi | Properti | Durasi |
|---|---|---|
| Hover kartu | `transform: translateY(-2px)`, shadow sm→md | 200ms |
| Hover tombol primer | background darken | 160ms |
| Fokus input | border + shadow-focus | 120ms |
| Pergantian halaman | fade + translateY 8px | 240ms |
| Ring skor pertama muncul | stroke-dashoffset 0 | 600ms |
| Pil status berubah | background crossfade | 180ms |
| Toast masuk/keluar | translateX 24px + fade | 220ms |
| Modal buka | scale 0.96→1 + fade | 200ms |
| Boby mengetik | 3 titik bouncing (loop) | 1200ms per siklus |
| Waveform loader | gelombang berdenyut `#9E61FD` | 1600ms per siklus |

**Reduced motion:** semua transform diganti fade saja. Waveform jadi bar statis. Hormati `prefers-reduced-motion: reduce`.

---

## 8. Ilustrasi & Maskot Boby

- Gaya: flat, garis bundar, 2 warna (`#A770FC` + aksen `#FEE6E0`).
- Boby tidak pernah digambar "sedih" atau "bingung negatif" — ekspresi defaultnya penasaran. Prinsip formatif.
- Ukuran avatar chat 32px; ilustrasi hero 180–240px.
- Jangan letakkan Boby di dashboard dosen; itu area kerja, bukan onboarding.

---

## 9. Ikonografi

- Set: Lucide (open source, sans). Weight stroke 1.75px.
- Ukuran default 20px, kecil 16px, besar 24px.
- Warna default `#6D6B80`. Aksen `#9E61FD` hanya untuk ikon di dalam kotak lavender (lihat kartu fitur §5.2).

---

## 10. Aksesibilitas

- Rasio kontras minimum WCAG AA (4.5:1 untuk body, 3:1 untuk teks besar). Palet sudah mengarahkan ini: `#6A39BF` di atas `#FFFFFF` ≈ 7.4:1; `#1E1C27` di atas `#FEF8F5` ≈ 15:1.
- Fokus terlihat di SEMUA interaktif — gunakan `shadow-focus`.
- Semua ikon aksi punya `aria-label`.
- Status tidak boleh dibedakan dengan warna saja — selalu pasangkan dengan ikon atau label teks.
- Target sentuh minimum 44×44 di mobile.
- Transkrip: `<article>` dengan heading tiap turn; nama pembicara di `<strong>`.

---

## 11. Token CSS (siap tempel)

```css
:root {
  /* color */
  --bg-ivory: #FEF8F5;
  --bg-peach: #FEE6E0;
  --bg-lavender: #F5E1F8;
  --surface: #FFFFFF;
  --accent: #9E61FD;
  --accent-mascot: #A770FC;
  --accent-text: #6A39BF;
  --text-primary: #1E1C27;
  --text-secondary: #6D6B80;
  --button-primary: #2A272D;
  --border: #ECE5F3;

  /* radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 999px;

  /* shadow */
  --shadow-xs: 0 1px 2px rgba(30, 28, 39, 0.04);
  --shadow-sm: 0 2px 8px rgba(106, 57, 191, 0.06);
  --shadow-md: 0 8px 24px rgba(106, 57, 191, 0.08);
  --shadow-lg: 0 16px 48px rgba(106, 57, 191, 0.10);
  --shadow-focus: 0 0 0 3px rgba(158, 97, 253, 0.35);

  /* motion */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 160ms;
  --dur: 200ms;
  --dur-slow: 400ms;
}

body {
  background: var(--bg-ivory);
  color: var(--text-primary);
  font-family: Inter, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Yang BOLEH & TIDAK BOLEH

**BOLEH**
- Gradien peach→ivory→lavender di hero dan CTA penutup.
- Satu kartu laporan Boby di landing sebagai bukti produk nyata.
- Pil status dengan ikon kecil di sebelah teks.
- Ring skor SVG dengan animasi stroke.

**TIDAK BOLEH**
- Warna merah di dashboard dosen (prinsip formatif).
- `#9E61FD` sebagai body text di atas `#FFFFFF` (gagal kontras).
- Lebih dari satu tombol primer per layar.
- Boby muncul di area kerja dosen.
- Shadow abu-abu netral — kita pakai bayangan ungu lembut.
- Serif font. Font display bergaya.
- Dark mode di v1.

---

## 13. Keputusan implementasi (v1.1, purwarupa statis)

- **Motif tunggal:** satu sudut runcing milik Boby (ujung tetesannya, ekor balon bicaranya). Tombol, bingkai antarmuka, gelembung chat, bullet, dan tab FAQ memakai bentuk ini: tiga sudut membulat, satu sudut runcing.
- **Gradien dihapus.** Hero dan CTA memakai bidang warna datar (ivory, peach, lavender). Gradien hero di §2.4 tidak dipakai.
- **Bayangan hanya untuk yang melayang** (menu, toast). Kartu dipisah dengan satu langkah nada atau garis 1px di ruang aplikasi.
- **Tombol sekunder** berupa isian lavender datar `#F1EAF6`, bukan garis tepi.
- **Ruang aplikasi** memakai gaya *achromatic ledger*: chrome tanpa warna, ungu `#9E61FD` hanya pada data utama (garis tren, batang konsep), tombol utama charcoal.
- **Token gerak** mengikuti skala transitions.dev (`--duration-fast` 250ms, `--ease-smooth-out`, dst.). Semua gerak punya cadangan `prefers-reduced-motion`.

## 14. Changelog

- **v1.1 (30 Okt 2026)** — Font diganti Plus Jakarta Sans; gradien dan bayangan istirahat dihapus; motif sudut runcing Boby; aturan ruang aplikasi. Palet tidak berubah.

- **v1.0 (30 Okt 2026)** — Spesifikasi awal berdasarkan referensi Takara dan palet warna ADAPTIA yang disetujui tim.

## Landing remake — November 2026
Preserve v1.1 identity: Jakarta, ivory/peach/lavender, flat surfaces, Boby's original droplet and sharp corner. Hero communicates student-teaches-AI and teacher-reviews-reasoning. Landing is persuasion, app routes remain operational. GSAP desktop pin + sequential story-card stack; word scrub on manifesto; Boby float, blink, pointer gaze and click squash. Mobile story uses natural document flow. Reduced motion and a page animation pause are provided. Source tokens remain index.css; landing geometry is scoped in landing/remake.css. All demos are local simulations, no unsupported AI analysis or claims of measured impact.

### Landing motion choreography
The landing uses layered transforms: entrance, scroll travel, continuous Boby swimming, and click response have separate wrappers. Desktop hero pins for 1,050 scroll pixels, moves Boby to center, and introduces the teaching relationship. The four-card story pins for 2,100 pixels with a Boby progress guide. Mobile uses unpinned scroll reveals. Kinetic typography, word reveals, split demo panels, and the final Boby entrance follow natural scrolling. No scroll interception is used. Reduced-motion and the persistent pause control remove motion and show every story card in document flow. Anchor navigation targets pin spacers so stories begin at their first step.
