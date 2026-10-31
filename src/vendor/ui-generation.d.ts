export function generate(el: Element, options?: Record<string, unknown>): { finished: Promise<void>; cancel: () => void; element: Element }
