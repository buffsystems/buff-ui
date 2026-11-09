/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'
import { cx } from '../cx.ts'

/**
 * A service row of a dialogue (#831): the AI mode was changed — who, to what, from the next
 * answer on. Quiet and centred, like a context compaction's line, never mistaken for a turn.
 */
export function AiModeNote({
  when,
  children,
  className,
}: {
  when?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div role="note" className={cx('ui-ai-note', className)}>
      <Brain aria-hidden className="ui-ai-note__icon" />
      <span className="ui-ai-note__text">{children}</span>
      {when && <span className="ui-ai-note__when">{when}</span>}
    </div>
  )
}
