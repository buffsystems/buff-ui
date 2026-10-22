// A tiny dependency-free toast store (#561): anyone calls `toast(...)` or `toast.show({...})`,
// one <Toaster/> at the app root renders the stack. A toast leaves after its time unless it is
// persistent; an action button runs and then dismisses it.

export type ToastKind = 'success' | 'error' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /** The main line. */
  title: string
  /** A second, quieter line under the title. */
  description?: string
  kind?: ToastKind
  /** Buttons under the text («Отменить», «Открыть»); each one dismisses the toast after running. */
  actions?: ToastAction[]
  /** Stays until closed or dismissed by id — for what must not slip by unseen. */
  persistent?: boolean
  /** How long a non-persistent toast stays, ms. */
  ttlMs?: number
}

export interface ToastItem {
  id: number
  kind: ToastKind
  title: string
  description?: string
  actions: ToastAction[]
}

let toasts: ToastItem[] = []
const listeners = new Set<() => void>()
let seq = 1

function emit(): void {
  listeners.forEach((listener) => listener())
}

/** Show a toast; returns its id for dismissToast. */
export function showToast({
  title,
  description,
  kind = 'info',
  actions = [],
  persistent = false,
  ttlMs = 5000,
}: ToastOptions): number {
  const id = seq++
  toasts = [...toasts, { id, kind, title, description, actions }]
  emit()
  if (!persistent) setTimeout(() => dismissToast(id), ttlMs)
  return id
}

export function dismissToast(id: number): void {
  if (!toasts.some((t) => t.id === id)) return
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

/**
 * `toast(message, kind, ttlMs)` — the one-line form; `toast.show({...})` — a title, a
 * description, actions, a persistent toast; `toast.dismiss(id)`.
 */
export const toast = Object.assign(
  (message: string, kind: ToastKind = 'info', ttlMs = 5000): number =>
    showToast({ title: message, kind, ttlMs }),
  { show: showToast, dismiss: dismissToast },
)

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function currentToasts(): ToastItem[] {
  return toasts
}
