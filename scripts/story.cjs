// Scrollytelling check: hero, then one viewport shot per story step (scroll mode), plus the auto-mode fallback.
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')
const out = process.argv[2] || './shots/'
;(async () => {
  const b = await chromium.launch()
  for (const [w, h, tag, rm] of [[1365, 838, 'd', 'no-preference'], [390, 844, 'm', 'no-preference'], [1440, 900, 'r', 'reduce']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: rm })
    const errs = []
    p.on('pageerror', (e) => errs.push(e.message))
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
    await p.goto('http://localhost:4173/')
    await p.waitForTimeout(2200)
    await p.screenshot({ path: `${out}${tag}-hero.png` })
    const n = await p.locator('[data-steps] > div').count()
    for (let i = 0; i < n; i++) {
      if (rm === 'reduce') { await p.locator('[data-steps] button').nth(i).click(); await p.locator('#cara-kerja').scrollIntoViewIfNeeded() }
      else await p.evaluate(([i, f]) => { const el = document.querySelectorAll('[data-steps] > div')[i]; const r = el.getBoundingClientRect(); scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight * f) }, [i, w < 1024 ? 0.75 : 0.55])
      await p.waitForTimeout(1300)
      await p.screenshot({ path: `${out}${tag}-s${i}.png` })
    }
    console.log(tag, 'steps', n, 'errors', errs)
    await p.close()
  }
  await b.close()
})()
