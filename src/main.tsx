import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './vendor/ui-generation.css'
import './vendor/text-image-generation.css'
import './index.css'
import './vendor/charts.js'
import App from './App'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// Scroll positions depend on text metrics: recalc once the web fonts are in.
document.fonts?.ready.then(() => ScrollTrigger.refresh())
gsap.defaults({ ease: 'power3.out', duration: 0.6 })

createRoot(document.getElementById('root')!).render(<App />)
