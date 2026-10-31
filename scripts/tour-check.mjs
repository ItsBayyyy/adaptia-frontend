// Every step of every screen's walkthrough must find a real element. A step whose target is missing
// shows a card with no spotlight, which is worse than no walkthrough at all.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')

const ROUTES = [
  '#mahasiswa', '#mahasiswa--sesi', '#mahasiswa--sesi--antrean-queue', '#mahasiswa--ringkasan', '#mahasiswa--penguatan',
  '#dosen', '#dosen--sesi', '#dosen--sesi--baru', '#dosen--tinjauan', '#dosen--pendampingan',
  '#dosen--pendampingan--tugaskan', '#dosen--perkembangan', '#dosen--bank-kegiatan',
]

const b = await chromium.launch()
const bad = []
let steps = 0
for (const r of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  p.on('pageerror', (e) => bad.push(`${r}: ${e.message}`))
  await p.goto('http://localhost:4173/' + r)
  await p.waitForTimeout(1200)
  const btn = p.getByRole('button', { name: 'Panduan' })
  if (!(await btn.count())) { bad.push(`${r}: tombol Panduan tidak ada`); await p.close(); continue }
  await btn.click()
  await p.waitForTimeout(700)
  const total = +(await p.locator('.tour-count').innerText()).match(/dari (\d+)/)[1]
  for (let i = 1; i <= total; i++) {
    steps++
    const title = await p.locator('#tour-title').innerText()
    if (!(await p.locator('.tour-ring').count())) bad.push(`${r} langkah ${i} ("${title}"): sasaran tidak ditemukan`)
    if (i < total) { await p.locator('.tour-next').click(); await p.waitForTimeout(650) }
  }
  await p.keyboard.press('Escape')
  await p.waitForTimeout(250)
  if (await p.locator('.tour-ring').count()) bad.push(`${r}: Escape tidak menutup panduan`)
  await p.close()
}
await b.close()
console.log(bad.length ? `MASALAH (${bad.length}):\n` + bad.join('\n') : `semua ${steps} langkah di ${ROUTES.length} layar menemukan sasarannya`)
process.exit(bad.length ? 1 : 0)
