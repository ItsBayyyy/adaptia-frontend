# ADAPTIA FRONTEND

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


