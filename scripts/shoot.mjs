// Screenshots every route at desktop and phone width, reports console errors.
// Usage: node scripts/shoot.mjs <baseUrl> <outDir> [--previews]
// --previews also writes 1440×900 WebP crops into src/assets/previews/ for the landing page's "Masuk ke ruangnya".
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)
const { chromium } = req(process.env.PLAYWRIGHT ?? 'playwright')

const [base = 'http://localhost:4173/', out = '.shots', flag] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const ROUTES = [
  ['landing', '/'], ['dashboard-belajar', '/mahasiswa'], ['ruang-asesmen', '/mahasiswa/sesi/antrean-queue'], ['sesi-belajar', '/mahasiswa/sesi'],
  ['ringkasan', '/mahasiswa/ringkasan/stack-vs-queue'], ['penguatan', '/mahasiswa/penguatan'],
  ['dashboard-kelas', '/dosen'], ['sesi-asesmen', '/dosen/sesi'], ['pengaturan-sesi', '/dosen/sesi/baru'], ['tinjauan', '/dosen/tinjauan/operasi-stack'],
  ['pendampingan', '/dosen/pendampingan'], ['tugaskan', '/dosen/pendampingan/tugaskan'], ['perkembangan', '/dosen/perkembangan'], ['bank-kegiatan', '/dosen/bank-kegiatan'],
]
const browser = await chromium.launch()
const errors = []
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'm' ? 2 : 1 })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${tag}] ${m.type()}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[${tag}] pageerror: ${e.message}`))
  for (const [name, route] of ROUTES) {
    await page.goto(base + '#' + route)
    await page.waitForTimeout(route === '/' ? 2200 : 700)
    if (route === '/' ) {
      // scroll through so every once-only entrance fires, then return to the top
      const H = await page.evaluate(() => document.body.scrollHeight)
      for (let y = 0; y < H; y += 500) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(140) }
      await page.waitForTimeout(1500)
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600)
      await page.screenshot({ path: `${out}/${tag}-${name}-full.png`, fullPage: true })
    }
    await page.screenshot({ path: `${out}/${tag}-${name}.png` })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    if (overflow > 1) errors.push(`[${tag}] ${name}: horizontal overflow ${overflow}px`)
  }
  await ctx.close()
}
if (flag === '--previews') {
  const sharp = req(process.env.SHARP ?? 'sharp')
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  mkdirSync('src/assets/previews', { recursive: true })
  for (const name of ['ruang-asesmen', 'tinjauan', 'pendampingan', 'perkembangan', 'dashboard-belajar', 'pengaturan-sesi']) {
    const route = ROUTES.find((r) => r[0] === name)[1]
    await page.goto(base + '#' + route); await page.waitForTimeout(900)
    const buf = await page.screenshot()
    await sharp(buf).webp({ quality: 78 }).toFile(`src/assets/previews/${name}.webp`)
  }
  await ctx.close()
}
await browser.close()
console.log(errors.length ? errors.join('\n') : 'no console errors, no overflow')
