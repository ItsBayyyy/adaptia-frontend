// A shot of one route at one width, optionally scrolled to a selector or after clicking one.
// usage: node scripts/spot.mjs <out.png> <hash> <width> <height> [scrollTo=selector] [click=selector]
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')

const [out, hash = '', w = '1440', h = '900', ...rest] = process.argv.slice(2)
const opt = Object.fromEntries(rest.map((r) => r.split(/=(.*)/).slice(0, 2)))

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: +w, height: +h } })
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
await p.goto('http://localhost:4173/' + hash)
await p.waitForTimeout(1400)
if (opt.click) { await p.click(opt.click); await p.waitForTimeout(900) }
if (opt.scrollTo) {
  await p.evaluate((s) => { const el = document.querySelector(s); if (el) scrollTo(0, scrollY + el.getBoundingClientRect().top - innerHeight * 0.18) }, opt.scrollTo)
  await p.waitForTimeout(1200)
}
await p.screenshot({ path: out })
console.log(errs.length ? 'ERROR: ' + errs.join(' | ') : 'ok')
await b.close()
