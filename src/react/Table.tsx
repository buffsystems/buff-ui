/** @jsxRuntime automatic */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TableHTMLAttributes,
} from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from './cx.ts'
import { useWords } from './words.ts'

/** Whether a horizontal scroller still hides content on its right (2px slack for fractions). */
function hidesMore(el: HTMLElement): boolean {
  return el.scrollWidth - el.clientWidth - el.scrollLeft > 2
}

/**
 * A data table. Write thead/tbody/tr/th/td as usual — they are styled by the table. Mark a
 * figure cell `className="ui-table__num"`, a quiet one `ui-table__muted`, a picked row
 * `data-selected`. A wide table scrolls sideways inside its wrapper, never the page — and
 * while columns hide on the right, a fade and an arrow say so (a hidden scroll is no better
 * than clipped columns).
 */
export function Table({
  framed = false,
  compact = false,
  moreLabel: moreLabelProp,
  className,
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & {
  /** Its own bordered panel; leave off inside a Card or a Panel. */
  framed?: boolean
  compact?: boolean
  moreLabel?: string
  children: ReactNode
}) {
  const words = useWords()
  const moreLabel = moreLabelProp ?? words.scrollTable
  const box = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)
  const measure = useCallback(() => {
    if (box.current) setMore(hidesMore(box.current))
  }, [])
  useEffect(() => {
    measure()
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, children])
  return (
    <div className={cx('ui-table-frame', framed && 'ui-table-frame--framed')}>
      <div ref={box} onScroll={measure} className="ui-table-wrap">
        <table className={cx('ui-table', compact && 'ui-table--compact', className)} {...props}>
          {children}
        </table>
      </div>
      {more && (
        <>
          <div aria-hidden className="ui-table-frame__fade" />
          <button
            type="button"
            onClick={() => box.current?.scrollBy({ left: 280, behavior: 'smooth' })}
            aria-label={moreLabel}
            title={moreLabel}
            className="ui-table-frame__more"
          >
            <ChevronRight aria-hidden />
          </button>
        </>
      )}
    </div>
  )
}
