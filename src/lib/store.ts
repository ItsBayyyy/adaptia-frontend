import { useSyncExternalStore } from 'react'

// In-memory demo state shared by the lecturer screens (resets on reload: there is no backend).
export type Decision = 'accept' | 'correct' | 'reject'
type State = {
  decisions: Record<string, Record<string, Decision>>   // studentId → indicatorId → decision
  corrections: Record<string, import('./data').Status>   // `${studentId}:${indicatorId}` → status set by the lecturer
  notes: Record<string, string>
  reviewed: string[]                                     // studentIds whose review was saved
  sent: { id: string; title: string; students: string[]; due: string; mode: string }[]
  toast: string | null
  preselect: string[]                                    // students handed to the mentoring wizard
  joined: string[]                                       // classes the student joined with a code
}
let state: State = { decisions: {}, corrections: {}, notes: {}, reviewed: [], sent: [], toast: null, preselect: [], joined: [] }
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export const store = {
  get: () => state,
  set(patch: Partial<State> | ((s: State) => Partial<State>)) {
    state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
    emit()
  },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f) } },
}
export const useStore = () => useSyncExternalStore(store.subscribe, store.get)

let toastTimer: number | undefined
export function toast(message: string) {
  store.set({ toast: message })
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => store.set({ toast: null }), 3600)
}
