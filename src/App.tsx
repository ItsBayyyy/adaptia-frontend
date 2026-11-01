import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRoute } from './lib/router'
import Landing from './landing/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/student/Dashboard'
import StudentSessions from './pages/student/Sessions'
import Assessment from './pages/student/Assessment'
import Summary from './pages/student/Summary'
import Strengthening from './pages/student/Strengthening'
import LecturerDashboard from './pages/lecturer/Dashboard'
import SessionList from './pages/lecturer/SessionList'
import SessionSetup from './pages/lecturer/SessionSetup'
import Review from './pages/lecturer/Review'
import Mentoring from './pages/lecturer/Mentoring'
import Assign from './pages/lecturer/Assign'
import Progress from './pages/lecturer/Progress'
import ActivityBank from './pages/lecturer/ActivityBank'
import ClassMap from './pages/lecturer/ClassMap'

function page(path: string) {
  const [, area, a, b] = path.split('/')
  if (area === 'masuk') return <Login />
  if (area === 'mahasiswa') {
    if (!a) return <StudentDashboard path={path} />
    if (a === 'sesi' && b) return <Assessment path={path} id={b} />
    if (a === 'sesi') return <StudentSessions path={path} />
    if (a === 'ringkasan') return <Summary path={path} />
    if (a === 'penguatan') return <Strengthening path={path} />
  }
  if (area === 'dosen') {
    if (!a) return <LecturerDashboard path={path} />
    if (a === 'sesi' && b === 'baru') return <SessionSetup path={path} />
    if (a === 'sesi') return <SessionList path={path} />
    if (a === 'tinjauan') return <Review path={path} />
    if (a === 'pendampingan' && b === 'tugaskan') return <Assign path={path} />
    if (a === 'pendampingan') return <Mentoring path={path} />
    if (a === 'perkembangan') return <Progress path={path} />
    if (a === 'bank-kegiatan') return <ActivityBank path={path} />
    if (a === 'peta-kelas') return <ClassMap path={path} />
  }
  return <Landing />
}

export default function App() {
  const path = useRoute()
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 60)
    document.title = path === '/' ? 'ADAPTIA · Mahasiswa mengajar AI'
      : path === '/masuk' ? 'ADAPTIA · Masuk'
      : `ADAPTIA · ${path.startsWith('/dosen') ? 'Ruang Dosen' : 'Ruang Mahasiswa'}`
    return () => clearTimeout(t)
  }, [path])
  // Keyed wrapper: every route change replays the page-in transition (8px, 3px blur, 250ms).
  return <div key={path} className="t-page-in">{page(path)}</div>
}
