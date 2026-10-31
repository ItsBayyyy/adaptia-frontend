import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, ArrowDown, Plus, Minus, Check, RotateCcw, Play, Pause, Menu, X, Quote, Eye, BookOpen, MessageCircle } from 'lucide-react'
import Boby, { BobyMark } from '../components/Boby'
import Kinetic from './Kinetic'
import { Link, scrollToId } from '../lib/router'
import './remake.css'

const fields = [
  { name: 'Ekonomi', topic: 'Omzet & laba', claim: 'Kalau omzet naik, laba pasti ikut naik, kan?', response: 'Belum tentu. Laba juga dipengaruhi biaya. Omzet bisa naik, tetapi laba turun jika biaya meningkat lebih besar.', indicator: 'Membedakan pendapatan dan laba', status: 'Ilustrasi pengembangan' },
  { name: 'Metode penelitian', topic: 'Korelasi & kausalitas', claim: 'Dua hal saling berkorelasi. Berarti yang satu menyebabkan yang lain?', response: 'Korelasi saja belum membuktikan sebab-akibat. Bisa ada faktor lain yang memengaruhi keduanya.', indicator: 'Membedakan hubungan dan sebab-akibat', status: 'Ilustrasi pengembangan' },
  { name: 'Fisika', topic: 'Gerak & gaya', claim: 'Benda sedang bergerak. Berarti resultan gayanya pasti searah gerak?', response: 'Tidak selalu. Benda dapat bergerak dengan kecepatan tetap saat resultan gayanya nol. Resultan gaya menentukan percepatan.', indicator: 'Menghubungkan gaya dan percepatan', status: 'Ilustrasi pengembangan' },
  { name: 'Informatika', topic: 'Stack & queue', claim: 'Stack seperti antrean: yang datang duluan, keluar duluan?', response: 'Pada stack, elemen yang terakhir masuk keluar lebih dahulu. Antrean menggunakan urutan yang berbeda.', indicator: 'Membedakan LIFO dan FIFO', status: 'Materi contoh purwarupa' },
]
const faqs = [
  ['Apakah ADAPTIA hanya untuk dosen Informatika?', 'Tidak. ADAPTIA dirancang untuk dosen pengampu mata kuliah berbasis konsep lintas bidang. Materi contoh purwarupa saat ini adalah Stack & Queue dan Peluang. Materi lain memerlukan indikator dan pernyataan uji yang ditinjau pengampu.'],
  ['Mengapa mahasiswa justru mengajari AI?', 'Saat menjelaskan, mahasiswa perlu mengeluarkan alasan di balik jawabannya. Boby berperan sebagai murid yang bertanya dan menyampaikan pernyataan uji. Penjelasan mahasiswa menjadi bahan tinjauan dosen.'],
  ['Bagaimana jika AI salah menafsirkan jawaban?', 'Dosen meninjau usulan temuan bersama kutipan dan konteksnya, lalu menerima, mengoreksi, atau menolak temuan. Keberadaan kutipan tidak menjamin interpretasi AI benar.'],
  ['Apakah hasilnya otomatis menjadi nilai akhir?', 'Tidak. ADAPTIA ditujukan untuk asesmen formatif. Temuan bersifat sementara sampai ditinjau dosen dan digunakan sebagai bahan menentukan kebutuhan pendampingan.'],
  ['Apakah sudah bisa digunakan untuk kelas nyata?', 'Versi ini merupakan purwarupa interaktif dengan data contoh. Backend dan analisis AI langsung belum terhubung. Penggunaan pada kelas nyata memerlukan integrasi dan pengujian lanjutan.'],
  ['Apakah ADAPTIA mendeteksi penggunaan ChatGPT?', 'Tidak. ADAPTIA menggali alasan melalui penjelasan dan pertanyaan lanjutan. ADAPTIA tidak menjamin mahasiswa bebas bantuan AI eksternal.'],
]
function Jump({ id, children, secondary = false }: { id: string; children: React.ReactNode; secondary?: boolean }) {
  return <button className={`rm-button ${secondary ? 'secondary' : ''}`} onClick={() => scrollToId(id)}>{children}<ArrowRight size={18} /></button>
}

function Demo() {
  const [choice, setChoice] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [decision, setDecision] = useState('')
  const [note, setNote] = useState('')
  return <section id="coba" className="rm-demo rm-section">
    <div className="rm-section-heading" data-reveal><h2>Sekarang,<br /><em>ajari Boby.</em></h2><div><p>Coba satu pertanyaan tentang peluang. Lihat bagaimana alasan Anda menjadi bahan tinjauan dosen.</p><span className="rm-caption">Simulasi lokal · Tidak mengirim atau menyimpan jawaban</span></div></div>
    <div className="rm-demo-grid">
      <div className="rm-conversation" data-ui>
        <div className="rm-panel-top"><span><BobyMark className="rm-mark" /> Ruang mahasiswa</span><span>Peluang</span></div>
        <div className="rm-boby-question"><div className="rm-mini-boby"><Boby /></div><p>“Koin sudah lima kali muncul angka. Berarti lemparan berikutnya pasti gambar?”</p></div>
        <p className="rm-caption">Anggap koin adil dan setiap lemparan independen.</p>
        {!submitted ? <form onSubmit={e => { e.preventDefault(); if (choice && text.trim().length >= 20) setSubmitted(true) }}>
          <div className="rm-choices" role="group" aria-label="Tanggapan untuk Boby">{['Setuju', 'Tidak setuju'].map(c => <button key={c} type="button" aria-pressed={choice === c} className={choice === c ? 'selected' : ''} onClick={() => setChoice(c)}>{c}{choice === c && <Check size={16} />}</button>)}</div>
          <label htmlFor="rm-reason">Jelaskan alasan Anda</label><textarea id="rm-reason" rows={4} value={text} maxLength={1500} onChange={e => setText(e.target.value)} placeholder="Menurut saya, hasil lemparan sebelumnya…" aria-describedby="rm-hint" />
          <div className="rm-form-help"><span id="rm-hint">Minimal 20 karakter</span><button type="button" onClick={() => { setChoice('Tidak setuju'); setText('Tidak setuju. Setiap lemparan independen. Peluang gambar tetap 1/2, meskipun sebelumnya muncul angka lima kali.') }}>Gunakan contoh</button></div>
          <button className="rm-button" disabled={!choice || text.trim().length < 20}>Lihat bahan tinjauan <ArrowRight size={17} /></button>
        </form> : <div className="rm-sent"><span>Penjelasan Anda · {choice}</span><p>{text}</p><button onClick={() => { setSubmitted(false); setDecision(''); setNote('') }}><RotateCcw size={16} /> Ubah jawaban</button></div>}
      </div>
      <div className="rm-review" data-ui aria-live="polite"><div className="rm-panel-top"><span><Eye size={17} /> Ruang tinjauan dosen</span><span>Simulasi</span></div>
        <h3>Alasannya yang<br />ingin kita lihat.</h3>
        {!submitted ? <div className="rm-empty"><Quote size={32} /><p>Kutipan penjelasan Anda akan muncul di sini.</p><span>Dosen membaca alasan, lalu meninjau pemahaman berdasarkan indikator.</span></div> : <div className="rm-result"><span className="rm-status">Perlu ditinjau dosen</span><h4>Memahami independensi kejadian</h4><blockquote>“{text}”</blockquote><p>Pilihan Anda: <b>{choice}</b>. Demo ini menampilkan kutipan tanpa menilai ketepatan penalarannya secara otomatis.</p><div className="rm-review-actions">{['Terima', 'Koreksi', 'Tolak'].map(d => <button key={d} aria-pressed={decision === d} className={decision === d ? 'selected' : ''} onClick={() => setDecision(d)}>{d}</button>)}</div>{decision === 'Koreksi' && <label className="rm-note">Catatan koreksi<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Tuliskan bagian yang perlu diperbaiki…" rows={2} /></label>}{decision && <p className="rm-feedback">{decision === 'Koreksi' ? 'Mode koreksi dipilih. Catatan hanya untuk simulasi ini.' : `Keputusan simulasi: ${decision === 'Terima' ? 'diterima' : 'ditolak'}.`}</p>}</div>}
        <p className="rm-caption rm-review-foot">Pada produk yang direncanakan, AI mengusulkan temuan. Dosen tetap memutuskan.</p>
      </div>
    </div>
  </section>
}
export default function Landing() {
  const root = useRef<HTMLDivElement>(null)
  // Pinned scenes need a page that scrolls. Inside a frame sized to its own content there is none,
  // so the page checks once the layout has settled and lays those sections out flat instead.
  const [canPin, setCanPin] = useState<boolean | null>(null)
  const [field, setField] = useState(0)
  const [menu, setMenu] = useState(false)
  const [paused, setPaused] = useState(false)
  const [faq, setFaq] = useState<number | null>(0)
  const f = fields[field]
  useEffect(() => {
    const check = () => setCanPin(document.documentElement.scrollHeight - innerHeight > 600)
    check()
    const t = setTimeout(check, 900)
    addEventListener('resize', check)
    return () => { clearTimeout(t); removeEventListener('resize', check) }
  }, [])
  useGSAP(() => {
    const mm = gsap.matchMedia()
    // Scroll and idle movement use different wrappers so neither overwrites the other.
    mm.add('(min-width: 0px)', () => {
      if (paused) return
      gsap.from('.rm-hero h1 span', { yPercent: 115, stagger: .13, duration: 1.25, ease: 'expo.out' })
      gsap.from('.rm-hero-bottom', { y: 45, opacity: 0, delay: .3, duration: 1 })
      gsap.from('.rm-boby-entrance', { y: 140, rotation: -28, scale: .5, opacity: 0, duration: 1.6, ease: 'back.out(1.5)' })
      gsap.to('.rm-orbit', { rotation: 360, duration: 24, repeat: -1, ease: 'none' })
      gsap.from('.rm-manifesto-word', { opacity: .12, y: 30, rotation: 3, stagger: .08, ease: 'none', scrollTrigger: { trigger: '.rm-manifesto', start: 'top 78%', end: 'bottom 68%', scrub: .5 } })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } }))
      gsap.from('.rm-fields-stage', { scale: .88, y: 90, rotation: -2, ease: 'none', scrollTrigger: { trigger: '.rm-fields-stage', start: 'top 95%', end: 'top 30%', scrub: .7 } })
      gsap.fromTo('.rm-field-art', { y: 60, rotation: -15 }, { y: -30, rotation: 12, scrollTrigger: { trigger: '.rm-fields-stage', start: 'top bottom', end: 'bottom top', scrub: .8 } })
      gsap.from('.rm-conversation', { xPercent: -12, opacity: .2, scrollTrigger: { trigger: '.rm-demo-grid', start: 'top 95%', end: 'top 45%', scrub: .7 } })
      gsap.from('.rm-review', { xPercent: 12, opacity: .2, scrollTrigger: { trigger: '.rm-demo-grid', start: 'top 95%', end: 'top 45%', scrub: .7 } })
      gsap.fromTo('.rm-end-boby', { y: 170, rotation: -32, scale: .7 }, { y: -70, rotation: 14, scale: 1.12, scrollTrigger: { trigger: '.rm-ending', start: 'top 95%', end: 'bottom bottom', scrub: .7 } })
      gsap.from('.rm-ending-copy', { y: 80, scrollTrigger: { trigger: '.rm-ending', start: 'top bottom', end: 'top 25%', scrub: .6 } })
      gsap.to('.rm-scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } })
    })
    mm.add('(min-width: 1000px)', () => {
      if (paused || canPin === false) return
      const hero = gsap.timeline({ scrollTrigger: { trigger: '.rm-hero', start: 'top top', end: '+=1050', pin: true, scrub: .7, anticipatePin: 1, invalidateOnRefresh: true } })
      hero.to('.rm-hero h1>div', { xPercent: (i: number) => i % 2 ? 22 : -22, opacity: 0, stagger: .05, duration: .6, ease: 'power1.in' }, .05)
        .to('.rm-hero-bottom, .rm-hero-top, .rm-hero-foot, .rm-art-note', { y: -55, opacity: 0, duration: .4 }, .05)
        .to('.rm-hero-art', { x: () => -window.innerWidth * .265, y: -100, scale: .88, duration: .95, ease: 'power2.inOut' }, .15)
        .to('.rm-hero-boby', { rotation: -18, duration: .4 }, .15)
        .to('.rm-hero-boby', { rotation: 9, duration: .55 }, .55)
        .to('.rm-hero-speech', { x: 155, y: -35, rotation: 7, scale: 1.1, duration: .8 }, .2)
        .fromTo('.rm-hero-finale', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: .55 }, .7)
        .to({}, { duration: .3 })
      const cards = gsap.utils.toArray<HTMLElement>('.rm-story-card')
      gsap.set(cards.slice(1), { yPercent: 115, xPercent: 20, rotation: 12, scale: .88 })
      gsap.set('.rm-story-step:first-child', { backgroundColor: '#6A39BF', color: '#ffffff' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.rm-story', start: 'top top', end: '+=2100', pin: true, scrub: .65, anticipatePin: 1 } })
      cards.slice(1).forEach((card, i) => {
        const at = i * 1.5 + .45
        tl.to(cards[i], { yPercent: -15, xPercent: -12, scale: .85, opacity: .35, rotation: -10, duration: 1, ease: 'power2.inOut' }, at)
          .to(card, { yPercent: 0, xPercent: 0, rotation: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, at)
          .to('.rm-story-guide', { x: (i + 1) * 66, rotation: (i % 2 ? -12 : 12), duration: 1, ease: 'power2.inOut' }, at)
          .to('.rm-story-line-fill', { scaleX: (i + 1) / 3, duration: 1 }, at)
          .to(`.rm-story-step:nth-child(${i + 2})`, { backgroundColor: '#6A39BF', color: '#ffffff', duration: .3 }, at + .6)
      })
      tl.to({}, { duration: .55 })
    })
    mm.add('(max-width: 999px)', () => {
      if (paused) return
      gsap.to('.rm-hero-boby', { y: 65, x: -28, rotation: -18, scrollTrigger: { trigger: '.rm-hero-art', start: 'top 35%', end: 'bottom top', scrub: .6 } })
      gsap.to('.rm-hero-speech', { y: -55, rotation: 7, scrollTrigger: { trigger: '.rm-hero-art', start: 'top 65%', end: 'bottom top', scrub: .6 } })
      gsap.utils.toArray<HTMLElement>('.rm-story-card').forEach((card, i) => gsap.from(card, { x: i % 2 ? 22 : -22, y: 50, rotation: i % 2 ? 4 : -4, opacity: .2, scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: .5 } }))
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [paused, canPin], revertOnUpdate: true })
  const nudge = (el: HTMLButtonElement) => {
    if (paused) return
    gsap.fromTo(el.querySelector('.rm-boby-touch'), { scaleX: 1.12, scaleY: .88, rotation: -9 }, { scaleX: 1, scaleY: 1, rotation: 0, duration: .8, ease: 'elastic.out(1,.45)', overwrite: 'auto' })
  }
  return <div ref={root} className={`rm-page ${paused ? 'rm-paused' : ''} ${canPin === false ? 'rm-nopin' : ''}`}>
    <a className="rm-skip" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); scrollToId('main-content') }}>Lewati navigasi</a>
    <div className="rm-scroll-progress" />
    <header className="rm-nav"><Link to="/" className="rm-logo"><BobyMark className="rm-mark" />ADAPTIA<span className="rm-logo-dot">.</span></Link><nav aria-label="Navigasi utama" className={menu ? 'open' : ''}>{[['cara-kerja', 'Cara kerja'], ['bidang', 'Lintas bidang'], ['untuk-anda', 'Untuk Anda']].map(([id, label]) => <button key={id} onClick={() => { scrollToId(id); setMenu(false) }}>{label}</button>)}</nav><div className="rm-nav-actions"><button className="rm-motion-toggle" title={paused ? 'Aktifkan animasi' : 'Jeda animasi'} aria-label={paused ? 'Aktifkan animasi' : 'Jeda animasi'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={16} /> : <Pause size={16} />}<span>{paused ? 'Motion jeda' : 'Motion aktif'}</span></button><Link to="/masuk" className="rm-button">Masuk<ArrowRight size={18} /></Link><button className="rm-menu" aria-expanded={menu} aria-label="Menu navigasi" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div></header>
    <main id="main-content" tabIndex={-1}>
      <section className="rm-hero">
        <div className="rm-hero-top"><p>Ruang untuk menjelaskan.<br />Kesempatan untuk memahami.</p><span>Asesmen formatif<br />untuk perguruan tinggi</span></div>
        <h1><div><span>Mahasiswa mengajar AI.</span></div><div><span>Dosen meninjau</span></div><div><span className="rm-purple">penalarannya.</span></div></h1>
        <div className="rm-hero-art"><div className="rm-orbit"><i /><i /><i /></div><button className="rm-hero-boby" aria-label="Sapa Boby" onClick={e => nudge(e.currentTarget)}><div className="rm-boby-entrance"><div className="rm-boby-float"><div className="rm-boby-touch"><Boby look={!paused} /></div></div></div></button><div className="rm-hero-speech"><span>Boby, murid AI Anda</span><p>“Boleh jelaskan<br />kenapa begitu?”</p><MessageCircle size={18} /></div><span className="rm-art-note">Penasaran. Siap diajari.</span></div>
        <div className="rm-hero-finale" aria-hidden="true"><span>Kenali Boby.</span><p>AI yang ingin diajari.<br /><em>Alasan Anda yang dicari.</em></p></div>
        <div className="rm-hero-bottom"><p>Mahasiswa menjelaskan konsep kepada Boby.<br className="rm-desktop" /> Dosen meninjau alasan di balik jawabannya,<br className="rm-desktop" /> lalu menentukan bagian yang perlu didampingi.</p><Jump id="coba">Coba alur ADAPTIA</Jump></div>
        <div className="rm-hero-foot"><span>Dirancang untuk pembelajaran konsep lintas bidang.</span><button onClick={() => scrollToId('mengapa')}>Kenali lebih dekat <ArrowDown size={15} /></button></div>
      </section>
      <Kinetic paused={paused} />
      <section id="mengapa" className="rm-manifesto rm-section"><div className="rm-manifesto-label"><BookOpen size={24} /></div><h2>{'Ada alasan yang perlu didengar. Ada konsep yang perlu diperjelas.'.split(' ').map((word, i) => <span className="rm-manifesto-word" key={i}>{word} </span>)}</h2><div className="rm-manifesto-bottom"><span className="rm-line" /><p>Nilai tugas belum selalu memperlihatkan cara berpikir. ADAPTIA memberi mahasiswa ruang untuk menjelaskan, termasuk mereka yang jarang mengangkat tangan di kelas.</p></div></section>
      <section id="cara-kerja" className="rm-story"><div className="rm-story-intro"><h2>Satu penjelasan.<br /><em>Lebih banyak<br />yang terlihat.</em></h2><p>Ikuti perjalanan dari konsep yang dipelajari sampai keputusan pendampingan.</p><div className="rm-story-route" aria-hidden="true"><div className="rm-story-guide"><Boby /></div><div className="rm-story-line"><i className="rm-story-line-fill" /></div><div className="rm-story-steps">{['Konsep','Mengajari','Bukti','Keputusan'].map(n=><span className="rm-story-step" key={n}>{n}</span>)}</div></div><span className="rm-scroll-hint"><ArrowDown size={16} /> Gulir untuk mengikuti alurnya</span></div><div className="rm-story-stack">
        <article className="rm-story-card rm-card-1"><div className="rm-story-index"><BookOpen size={22} /></div><h3>Mulai dari<br />konsep yang jelas.</h3><p>Indikator dari dosen menjadi acuan. Boby punya tujuan belajar yang perlu dijelaskan mahasiswa.</p><div className="rm-concept" data-ui><span>Contoh materi · Peluang</span><strong>Apakah hasil sebelumnya<br />mengubah peluang berikutnya?</strong><div><Check size={16} /> Memahami independensi kejadian</div></div><small>Pada purwarupa, materi sudah disiapkan.</small></article>
        <article className="rm-story-card rm-card-2"><div className="rm-story-index"><MessageCircle size={22} /></div><h3>Mahasiswa<br />mengajari Boby.</h3><p>Boby bertanya dan menyampaikan pernyataan uji. Mahasiswa menanggapi dengan alasannya.</p><div className="rm-story-chat" data-ui><Boby className="rm-chat-boby" /><blockquote>“Lima kali angka.<br />Berikutnya pasti gambar?”</blockquote></div><div className="rm-student-reply">“Tidak. Setiap lemparan independen. Peluang gambar tetap 1/2.”</div></article>
        <article className="rm-story-card rm-card-3"><div className="rm-story-index"><Quote size={22} /></div><h3>Alasan menjadi<br />bahan tinjauan.</h3><p>Usulan temuan disertai kutipan. Dosen dapat melihat apa yang mendasari indikasi pemahaman.</p><div className="rm-evidence" data-ui><span>Kutipan penjelasan mahasiswa</span><blockquote>“<mark>Setiap lemparan independen.</mark> Peluang gambar tetap 1/2.”</blockquote><div><Check size={16} /> Kutipan tersedia untuk diperiksa</div></div><small>Ilustrasi hasil. Interpretasi tetap perlu ditinjau.</small></article>
        <article className="rm-story-card rm-card-4"><div className="rm-story-index"><Eye size={22} /></div><h3>Dosen memegang<br />keputusan.</h3><p>Periksa konteks, terima, koreksi, atau tolak temuan. Tentukan konsep yang perlu didampingi.</p><div className="rm-decision-preview" data-ui><span>Indikator: independensi kejadian</span><strong>Penjelasan siap ditinjau.</strong><div><span>Terima</span><span>Koreksi</span><span>Tolak</span></div></div><small>Formatif. Tidak otomatis menjadi nilai akhir.</small></article>
      </div></section>
      <section id="bidang" className="rm-fields rm-section"><div className="rm-section-heading" data-reveal><h2>Bidangnya berbeda.<br /><em>Alasannya tetap penting.</em></h2><p>Untuk mata kuliah berbasis konsep, pertanyaan yang tepat membuka cara berpikir. Mulai dari konsep yang dekat dengan kelas Anda.</p></div><div className="rm-field-tabs" role="tablist" aria-label="Contoh bidang">{fields.map((x, i) => <button key={x.name} role="tab" tabIndex={field === i ? 0 : -1} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % fields.length : e.key === 'ArrowLeft' ? (i + fields.length - 1) % fields.length : e.key === 'Home' ? 0 : e.key === 'End' ? fields.length - 1 : null; if (next !== null) { e.preventDefault(); setField(next); document.getElementById(`field-tab-${next}`)?.focus() } }} aria-selected={field === i} aria-controls="field-panel" id={`field-tab-${i}`} onClick={() => setField(i)}>{x.name}<ArrowRight size={16} /></button>)}</div><div className="rm-fields-stage" id="field-panel" role="tabpanel" aria-labelledby={`field-tab-${field}`}><div className="rm-field-copy" key={field}><span className="rm-caption">{f.topic} · {f.status}</span><h3>“{f.claim}”</h3><div className="rm-field-answer"><span>Penjelasan yang ingin digali</span><p>{f.response}</p></div><span className="rm-field-indicator"><Eye size={17} /> {f.indicator}</span></div><div className="rm-field-art" aria-hidden="true"><div className="rm-field-react" key={field}><div className="rm-field-orbit" /><Boby look={!paused} /><span>Aku ingin tahu<br />alasannya.</span></div></div></div><p className="rm-caption rm-field-note">Contoh lintas bidang merupakan ilustrasi. Materi baru membutuhkan indikator dan tinjauan pengampu. Materi purwarupa: Stack & Queue dan Peluang.</p></section>
      <Demo />
      <section id="untuk-anda" className="rm-benefits rm-section"><div className="rm-section-heading" data-reveal><h2>Ruang untuk belajar.<br /><em>Dasar untuk mendampingi.</em></h2></div><div className="rm-benefit-grid"><article data-reveal><span>Untuk mahasiswa</span><h3>Berani menjelaskan.<br />Siap mempertanyakan.</h3><p>Latih penjelasan dengan kata sendiri. Periksa alasan di balik jawaban dan temukan bagian yang perlu diperbaiki.</p><Link to="/mahasiswa">Jelajahi ruang mahasiswa <ArrowRight size={18} /></Link></article><article data-reveal><span>Untuk dosen</span><h3>Baca alasannya.<br />Tentukan tindak lanjutnya.</h3><p>Tinjau indikasi kesulitan per konsep, baca kutipannya, dan tentukan bagian yang perlu dijelaskan ulang.</p><Link to="/dosen">Jelajahi ruang dosen <ArrowRight size={18} /></Link></article></div><div className="rm-principle" data-reveal><Eye size={27} /><h3>Temuan bisa diperiksa.<br />Keputusan tetap pada dosen.</h3><p>AI dapat keliru menafsirkan penjelasan. Setiap usulan perlu dibaca bersama kutipan dan konteksnya.</p></div></section>
      <section className="rm-faq rm-section"><div data-reveal><h2>Masih<br /><em>penasaran?</em></h2><Boby className="rm-faq-boby" /></div><div>{faqs.map(([q,a],i)=><article key={q} className={faq===i?'open':''}><h3><button aria-expanded={faq===i} aria-controls={`faq-answer-${i}`} onClick={()=>setFaq(faq===i?null:i)}>{q}{faq===i?<Minus size={19}/>:<Plus size={19}/>}</button></h3><div id={`faq-answer-${i}`} hidden={faq!==i}><p>{a}</p></div></article>)}</div></section>
      <section className="rm-ending"><div className="rm-ending-copy" data-reveal><h2>Agar tak ada<br />yang tertinggal<br /><em>diam-diam.</em></h2><p>Mulai dari satu konsep yang sering disalahpahami.</p><Jump id="coba">Mulai dengan Boby</Jump></div><div className="rm-end-boby"><Boby look={!paused} /></div><div className="rm-ending-circle" /></section>
    </main><footer className="rm-footer"><Link to="/" className="rm-logo"><BobyMark className="rm-mark" />ADAPTIA.</Link><p>Mahasiswa mengajar AI.<br />Dosen meninjau penalarannya.</p><div><span>Purwarupa interaktif · 2026</span><small>Seluruh nama dan hasil adalah data contoh.<br />Backend dan analisis AI langsung belum terhubung.</small></div><button aria-label="Kembali ke atas" onClick={()=>window.scrollTo({top:0,behavior:paused||matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}><ArrowDown className="rotate-180" size={20}/></button></footer>
  </div>
}
