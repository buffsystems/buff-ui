/** @jsxRuntime automatic */
import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react'
import { Button } from './Button.tsx'
import { currentToasts, dismissToast, subscribeToasts, type ToastKind } from './toast.ts'

const ICON: Record<ToastKind, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

/** The stack of toasts. Mount it once at the app root. */
export function Toaster({ closeLabel = 'Закрыть' }: { closeLabel?: string }) {
  const items = useSyncExternalStore(subscribeToasts, currentToasts, currentToasts)
  if (!items.length) return null
  return createPortal(
    <div className="ui-toaster" role="status" aria-live="polite">
      {items.map((t) => {
        const Icon = ICON[t.kind]
        return (
          <div key={t.id} className={`ui-toast ui-toast--${t.kind}`}>
            <Icon aria-hidden className="ui-toast__icon" />
            <div className="ui-toast__message">
              <span className="ui-toast__title">{t.title}</span>
              {t.description && <span className="ui-toast__description">{t.description}</span>}
              {t.actions.length > 0 && (
                <div className="ui-toast__actions">
                  {t.actions.map((action, i) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant={i === 0 ? 'primary' : 'outline'}
                      onClick={() => {
                        action.onClick()
                        dismissToast(t.id)
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label={closeLabel}
              title={closeLabel}
              className="ui-toast__close"
            >
              <X aria-hidden />
            </button>
          </div>
        )
      })}
    </div>,
    document.body,
  )
}
