// Screenshots of every route that matters, at the widths the inspector checks.
// usage: node scripts/snap.mjs <outDir> [full]
import { createRequire } from 'module'
import { mkdirSync } from 'fs'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')

const out = process.argv[2] || './shots/'
const full = process.argv[3] === 'full'
mkdirSync(out, { recursive: true })

const ROUTES = [
  ['landing', ''],
  ['masuk', '#masuk'],
  ['mhs', '#mahasiswa'],
  ['mhs-sesi', '#mahasiswa--sesi--antrean-queue'],
  ['mhs-ringkasan', '#mahasiswa--ringkasan'],
  ['dsn', '#dosen'],
  ['dsn-tinjauan', '#dosen--tinjauan'],
  ['dsn-perkembangan', '#dosen--perkembangan'],
]
const SIZES = [[1440, 900, 'd'], [768, 1024, 't'], [390, 844, 'm']]

const b = await chromium.launch()
const errs = []
for (const [w, h, tag] of SIZES) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  p.on('pageerror', (e) => errs.push(`${tag} ${e.message}`))
  p.on('console', (m) => m.type() === 'error' && errs.push(`${tag} console: ${m.text()}`))
  for (const [name, hash] of ROUTES) {
    await p.goto('http://localhost:4173/' + hash)
    await p.waitForTimeout(1500)
    await p.screenshot({ path: `${out}${tag}-${name}.png`, fullPage: full })
    const over = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    if (over) errs.push(`${tag} ${name}: overflow horizontal`)
  }
  await p.close()
}
await b.close()
console.log(errs.length ? 'MASALAH:\n' + errs.join('\n') : 'bersih, tanpa error')
