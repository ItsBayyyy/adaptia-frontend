# ADAPTIA — purwarupa statis

Landing page + Ruang Mahasiswa + Ruang Dosen, tanpa backend. Semua data contoh ada di `src/lib/data.ts` (nilai dihitung dari baris, dengan `console.assert`).

```bash
npm install
npm run dev            # pengembangan
npm run build          # dist/ untuk Vercel/Netlify (static)
npm run build:single   # dist-single/index.html, satu berkas berisi semua aset
```

## Rute (hash)
| Rute | Layar |
|---|---|
| `#` | Landing |
| `#mahasiswa` · `#mahasiswa--sesi--antrean-queue` · `#mahasiswa--penguatan` · `#mahasiswa--ringkasan--stack-vs-queue` | Ruang Mahasiswa |
| `#dosen` · `#dosen--sesi` · `#dosen--sesi--baru` · `#dosen--tinjauan--operasi-stack` · `#dosen--pendampingan` · `#dosen--pendampingan--tugaskan` · `#dosen--perkembangan` · `#dosen--bank-kegiatan` | Ruang Dosen |

## Yang palsu (ganti saat backend tersedia)
- Analis AI di demo landing = aturan kata kunci (`src/landing/TryBoby.tsx`, `propose()`).
- Dialog Boby di Ruang Asesmen = skrip (`queueTask.boby` di `data.ts`).
- Suara (STT) disimulasikan; OCR foto hanya ditampilkan sebagai tile.
- Semua state dosen (keputusan, pendampingan terkirim) hidup di memori (`src/lib/store.ts`) dan hilang saat dimuat ulang.

## Cek
`node scripts/flows.mjs http://localhost:4173/` menjalankan tiga alur utama dan gagal bila ada error konsol.
`node scripts/shoot.mjs <url> .shots --previews` mengambil screenshot semua rute (dan pratinjau WebP untuk landing).

Komponen gerak dari transitions.dev (lisensi di `src/vendor/ui-generation.LICENSE.txt`).
