// Embeds the landing in a cross-origin, auto-height iframe (the parent scrolls, the frame never does)
// and checks that sections stay hidden until the parent scrolls them into view, then animate in.
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')
;(async () => {
  const b = await chromium.launch()
  for (const rm of ['no-preference', 'reduce']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: rm })
    await p.goto('http://localhost:4180/index.html')
    await p.waitForTimeout(2500)
    const f = p.frames().find((x) => x.url().includes('4173'))
    const op = (sel) => f.evaluate((s) => getComputedStyle(document.querySelector(s)).opacity, sel)
    const top = (sel) => f.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel)
    const before = { problem: await op('#masalah-h'), story: await op('#cerita-h') }
    const y = await top('#masalah-h')
    await p.evaluate((y) => scrollTo(0, y), y)
    await p.waitForTimeout(1600)
    const after = { problem: await op('#masalah-h'), story: await op('#cerita-h') }
    const storyStep = await f.evaluate(() => getComputedStyle(document.querySelector('[data-steps] > div')).minHeight + ' (auto = stepper fallback, px = scroll mode)')
    console.log(rm, { before, after, storyStep })
    await p.screenshot({ path: process.argv[2] + `iframe-${rm}.png` })
    await p.close()
  }
  await b.close()
})()
