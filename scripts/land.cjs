// Landing check: hero timeline frames, full page after scrolling, reduced motion, overflow, console errors.
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')
const out = process.argv[2] || './shots/'
;(async () => {
  const b = await chromium.launch()
  for (const [w, h, tag, rm] of [[1440, 900, 'd', 'no-preference'], [390, 844, 'm', 'no-preference'], [1440, 900, 'r', 'reduce']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: rm })
    const errs = []
    p.on('pageerror', (e) => errs.push(e.message))
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    await p.goto('http://localhost:4173/')
    await p.waitForTimeout(1200)
    if (tag !== 'r') for (const t of [2, 6, 10]) { await p.waitForTimeout(t === 2 ? 800 : 4000); await p.screenshot({ path: `${out}hero-${tag}-${t}.png` }) }
    const H = await p.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < H; y += 450) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120) }
    await p.waitForTimeout(1800)
    await p.screenshot({ path: `${out}full-${tag}.png`, fullPage: true })
    const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    console.log(tag, 'height', H, 'overflow', ow, 'errors', errs)
    await p.close()
  }
  await b.close()
})()
