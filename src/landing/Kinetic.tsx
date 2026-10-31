import { Fragment, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const WORDS = ['Jelaskan.', 'Pertanyakan.', 'Pahami.']

/** The separator, drawn rather than typed: a glyph here reads as an emoji to anything scanning the page. */
const Spark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
  </svg>
)

/**
 * The kinetic strip. One seamless loop that always travels left to right: the track holds the words
 * twice, so sliding it from -50% to 0% and starting over lands on an identical frame.
 *
 * Scrolling adds speed on top of the resting speed. The boost drains back on its own and the change
 * itself is eased, so the strip accelerates and settles smoothly instead of snapping between speeds.
 * Only `timeScale` is touched per frame, so the cost is a couple of multiplications, not a re-layout.
 */
export default function Kinetic({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = root.current!.querySelector('.rm-kinetic-track')
    if (!track) return

    const loop = gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 26, ease: 'none', repeat: -1 })

    let want = 1
    let speed = 1
    const st = ScrollTrigger.create({
      onUpdate: (self) => { want = 1 + Math.min(Math.abs(self.getVelocity()) / 230, 7) },
    })
    const tick = () => {
      if (want < 1.002 && Math.abs(speed - 1) < 0.002) {
        if (speed !== 1) { speed = 1; loop.timeScale(1) }
        return
      }
      want += (1 - want) * 0.045        // the boost drains back toward the resting speed
      speed += (want - speed) * 0.11    // and the change is eased, so nothing jumps
      loop.timeScale(speed)
    }
    gsap.ticker.add(tick)
    return () => { gsap.ticker.remove(tick); st.kill(); loop.kill() }
  }, { scope: root, dependencies: [paused], revertOnUpdate: true })

  const group = (key: string) => (
    <div className="rm-kinetic-group" key={key}>
      {WORDS.map((w) => <Fragment key={w}><span>{w}</span><i aria-hidden="true"><Spark /></i></Fragment>)}
    </div>
  )

  return (
    <div ref={root} className="rm-kinetic" aria-hidden="true">
      <div className="rm-kinetic-track">{group('a')}{group('b')}</div>
    </div>
  )
}
