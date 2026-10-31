// Proves the kinetic strip: it moves on its own, it moves to the RIGHT, scrolling speeds it up,
// it eases back to the resting speed, and it stands still under reduced motion.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT || '/home/claude/.npm-global/lib/node_modules/playwright')

const x = (p) => p.evaluate(() => {
  const el = document.querySelector('.rm-kinetic-track')
  return new DOMMatrixReadOnly(getComputedStyle(el).transform).m41
})

const b = await chromium.launch()
const out = []

// ── normal motion ──
const p = await b.newPage({ viewport: { width: 1280, height: 860 } })
await p.goto('http://localhost:4173/')
await p.evaluate(() => document.querySelector('.rm-kinetic').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(900)

const a0 = await x(p); await p.waitForTimeout(700); const a1 = await x(p)
const restSpeed = (a1 - a0) / 0.7
out.push(`diam  : ${restSpeed.toFixed(1)} px/d  ${restSpeed > 2 ? '✓ bergerak' : '✗ TIDAK bergerak'}  ${restSpeed > 0 ? '✓ ke kanan' : '✗ arah salah'}`)

// scroll hard, then measure straight away
await p.evaluate(() => { for (let i = 0; i < 26; i++) setTimeout(() => scrollBy(0, 150), i * 16) })
await p.waitForTimeout(420)
const b0 = await x(p); await p.waitForTimeout(260); const b1 = await x(p)
const fast = Math.abs(b1 - b0) / 0.26
out.push(`digulir: ${fast.toFixed(1)} px/d  ${fast > restSpeed * 1.6 ? '✓ lebih cepat' : '✗ tidak mempercepat'}  (${(fast / restSpeed).toFixed(1)}×)`)

// let it settle
await p.waitForTimeout(2600)
const c0 = await x(p); await p.waitForTimeout(700); const c1 = await x(p)
const back = Math.abs(c1 - c0) / 0.7
out.push(`tenang : ${back.toFixed(1)} px/d  ${back < restSpeed * 1.35 ? '✓ kembali tenang' : '✗ masih cepat'}`)
await p.close()

// ── reduced motion ──
const q = await b.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' })
await q.goto('http://localhost:4173/')
await q.evaluate(() => document.querySelector('.rm-kinetic').scrollIntoView({ block: 'center' }))
await q.waitForTimeout(900)
const r0 = await x(q); await q.waitForTimeout(700); const r1 = await x(q)
out.push(`kurangi gerak: ${Math.abs(r1 - r0) < 1 ? '✓ diam' : '✗ masih bergerak'}`)
await q.close()

await b.close()
console.log(out.join('\n'))
