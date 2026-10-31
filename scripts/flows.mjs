// End-to-end smoke test of the three demo flows. Fails loudly on any console error.
// Usage: PLAYWRIGHT=<path to playwright> node scripts/flows.mjs http://localhost:4173/
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT ?? 'playwright')
const base = process.argv[2] ?? 'http://localhost:4173/'
mkdirSync('.shots', { recursive: true })
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
p.on('pageerror', (e) => errors.push(e.message))
const step = async (name, fn) => { try { await fn(); console.log('ok  ', name) } catch (e) { errors.push(`${name}: ${e.message.split('\n')[0]}`); console.log('FAIL', name) } }

// 1. Landing: the kinetic strip runs, the demo takes a reason and shows what the lecturer sees, and Masuk leads to the login screen
await p.goto(base); await p.waitForTimeout(1800)
await step('kinetic strip runs', async () => {
  const x = () => p.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.rm-kinetic-track')).transform).m41)
  const a = await x(); await p.waitForTimeout(600); const c = await x()
  if (!(c > a)) throw new Error(`strip did not travel right (${a} → ${c})`)
})
await step('demo: reason → lecturer view', async () => {
  await p.locator('#coba').getByRole('button', { name: 'Tidak setuju' }).click()
  await p.locator('#rm-reason').fill('Setiap lemparan independen, jadi peluang gambar tetap 1/2.')
  await p.getByRole('button', { name: /Lihat bahan tinjauan/ }).click()
  await p.locator('.rm-review').getByText('Perlu ditinjau dosen').waitFor()
  await p.locator('.rm-review').getByRole('button', { name: 'Terima' }).click()
})
await step('nav Masuk → login page', async () => {
  await p.locator('.rm-nav').getByRole('link', { name: /Masuk/ }).click()
  await p.waitForTimeout(900)
  await p.getByRole('heading', { name: /Masuk untuk/ }).waitFor()
})

// 1b. Login: Boby states something wrong, disagreeing is rewarded, and both demo doors open
await step('login: Boby speaks', async () => { await p.locator('.lg-say').waitFor({ timeout: 5000 }) })
await step('login: disagree', async () => {
  await p.locator('.lg-answers').getByRole('button', { name: 'Tidak setuju' }).click()
  await p.getByText('Itu yang dicari ADAPTIA.').waitFor()
  await p.getByRole('button', { name: /Pernyataan berikutnya/ }).click()
})
await step('login: sign-in is honest', async () => {
  await p.locator('#lg-email').fill('nadia@kampus.ac.id'); await p.locator('#lg-pass').fill('rahasia-contoh')
  await p.locator('.lg-primary').click()
  await p.getByText(/akun kampus belum terhubung/).waitFor()
})
await step('login: register form', async () => {
  await p.locator('.lg-switch').getByRole('button', { name: 'Daftar' }).click()
  await p.locator('#lg-nama').fill('Nadia Rahmawati')
  await p.locator('#lg-peran').selectOption('dosen')
  await p.locator('#lg-email').fill('nadia@kampus.ac.id')
  await p.locator('#lg-pass').fill('katasandi123'); await p.locator('#lg-pass2').fill('katasandi123')
  await p.locator('.lg-primary').click()
  await p.getByText(/pendaftaran belum terhubung/).waitFor()
  await p.locator('.lg-swap button').click()           // back to sign-in
  await p.locator('.lg-switch button[aria-pressed="true"]').getByText('Masuk').waitFor()
})
await step('login: demo doors', async () => {
  await p.getByRole('button', { name: /Demo sebagai dosen/ }).click(); await p.waitForTimeout(800)
  await p.getByRole('heading', { name: 'Dashboard Kelas' }).waitFor()
  await p.goto(base + '#masuk'); await p.waitForTimeout(900)
  await p.getByRole('button', { name: /Demo sebagai mahasiswa/ }).click(); await p.waitForTimeout(800)
  await p.getByRole('heading', { name: 'Dashboard Belajar' }).waitFor()
})

// 1c. The guided spotlight: the button opens it, it walks and it closes on Escape
await step('spotlight walks and closes', async () => {
  await p.getByRole('button', { name: 'Panduan' }).click()
  await p.locator('.tour-ring').waitFor()
  await p.getByText(/Langkah 1 dari \d+/).waitFor()
  await p.locator('.tour-next').click(); await p.waitForTimeout(700)
  await p.getByText(/Langkah 2 dari \d+/).waitFor()
  await p.keyboard.press('Escape'); await p.waitForTimeout(400)
  if (await p.locator('.tour-ring').count()) throw new Error('Escape did not close the spotlight')
})

await p.keyboard.press('Escape')   // make sure no sheet is left over a failed step

// 1d. The student joins a class with the code the lecturer hands out
await p.goto(base + '#mahasiswa'); await p.waitForTimeout(900)
await step('join class: wrong code is explained', async () => {
  await p.locator('#kode-kelas').fill('XX-000')
  await p.getByRole('button', { name: /Gabung/ }).click()
  await p.getByText(/Kode kelas tidak ditemukan/).waitFor()
})
await step('join class: already a member', async () => {
  await p.locator('#kode-kelas').fill('SD-B26')
  await p.getByRole('button', { name: /Gabung/ }).click()
  await p.getByText(/sudah tergabung/).waitFor()
})
await step('join class: a real code joins', async () => {
  await p.locator('#kode-kelas').fill('AP-C26')
  await p.getByRole('button', { name: /Gabung/ }).click()
  await p.getByText('Algoritma Pemrograman · Kelas C').waitFor()
})

// 1e. The lecturer builds a quiz and a rubric, then publishes and gets the class code
await p.goto(base + '#dosen--sesi--baru'); await p.waitForTimeout(900)
await step('setup: questions can be added and suggested', async () => {
  await p.getByRole('tab', { name: /Pertanyaan/ }).click(); await p.waitForTimeout(400)
  const before = await p.locator('[data-tour="daftar-soal"] > li').count()
  await p.getByRole('button', { name: /Usulkan pertanyaan/ }).click(); await p.waitForTimeout(400)
  await p.getByRole('button', { name: /Tambah pertanyaan/ }).click(); await p.waitForTimeout(300)
  const after = await p.locator('[data-tour="daftar-soal"] > li').count()
  if (after !== before + 2) throw new Error(`questions went ${before} → ${after}, expected +2`)
  await p.locator('[data-tour="daftar-soal"] > li').last().locator('textarea')
    .fill('Antrean loket kampus melayani 40 mahasiswa. Struktur apa yang kamu pakai, dan kenapa bukan yang satunya?')
})
await step('setup: rubric is editable and balances to 100', async () => {
  await p.getByRole('tab', { name: /Rubrik/ }).click(); await p.waitForTimeout(400)
  await p.getByRole('button', { name: /Usulkan indikator/ }).click(); await p.waitForTimeout(300)
  await p.getByRole('button', { name: /Seimbangkan/ }).click(); await p.waitForTimeout(300)
  await p.getByText('Jumlah bobot: 100').waitFor()
})
await step('setup: publish shows the class code', async () => {
  await p.getByRole('checkbox', { name: /Rubrik sudah saya konfirmasi/ }).check()
  await p.getByRole('button', { name: 'Publikasikan' }).click(); await p.waitForTimeout(800)
  await p.locator('[data-tour="kode"]').getByText('SD-B26').waitFor()
  await p.getByRole('button', { name: /Salin kode/ }).click()
})

// 2. Student: practice → Boby (with the test statement) → application → sent
await p.goto(base + '#/mahasiswa/sesi/antrean-queue'); await p.waitForTimeout(600)
await step('student practice', async () => { await p.getByRole('button', { name: /Kirim dan lanjut ke Boby/ }).click() })
for (let k = 0; k < 3; k++) await step(`boby turn ${k + 1}`, async () => {
  await p.getByRole('button', { name: 'Pakai contoh jawaban' }).click()
  await p.getByRole('button', { name: 'Kirim', exact: true }).click()
  await p.waitForTimeout(1500)
})
await step('to penerapan', async () => { await p.getByRole('button', { name: /Lanjut ke Penerapan/ }).click() })
await step('send all', async () => { await p.getByRole('button', { name: 'Pakai contoh jawaban' }).click(); await p.getByRole('button', { name: /Kirim semua jawaban/ }).click(); await p.getByText('Jawabanmu terkirim').waitFor() })

// 3. Lecturer: decide Nadia's four findings → mentoring wizard → send
await p.goto(base + '#/dosen/tinjauan/operasi-stack'); await p.waitForTimeout(700)
await step('decide findings', async () => {
  const groups = p.locator('[role="group"][aria-label^="Keputusan untuk"]')
  const n = await groups.count()
  for (let i = 0; i < n; i++) await groups.nth(i).getByRole('button', { name: i === 3 ? 'Koreksi' : 'Terima' }).click()
  await p.getByRole('group', { name: 'Ubah status menjadi' }).getByRole('button', { name: 'Belum' }).click()
  await p.screenshot({ path: '.shots/flow-review.png' })
})
await step('tentukan pendampingan', async () => { await p.getByRole('button', { name: /tentukan pendampingan/ }).click(); await p.getByRole('heading', { name: 'Tugaskan Pendampingan' }).waitFor() })
await step('wizard steps', async () => {
  await p.getByRole('button', { name: /Lanjut ke pilih kegiatan/ }).click()
  await p.getByRole('button', { name: /Lanjut ke atur jadwal/ }).click()
  await p.getByRole('button', { name: /Lanjut ke tinjau/ }).click()
  for (const c of await p.locator('fieldset input[type=checkbox]').all()) await c.check()
  await p.getByRole('button', { name: 'Kirim tugas pendampingan' }).click()
  await p.getByText('Tugas pendampingan terkirim').first().waitFor()
})
await step('dashboard reflects it', async () => { await p.goto(base + '#/dosen'); await p.getByText(/dikirim/).first().waitFor() })
await step('setup publish', async () => {
  await p.goto(base + '#/dosen/sesi/baru'); await p.waitForTimeout(500)
  await p.getByText('Rubrik sudah saya konfirmasi').click()
  await p.getByRole('button', { name: 'Publikasikan' }).click(); await p.getByText(/dipublikasikan/).waitFor()
})
await b.close()
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'all flows pass, no console errors')
process.exit(errors.length ? 1 : 0)
