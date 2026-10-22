/** @jsxRuntime automatic */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react'
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cx } from './cx.ts'
import { hiddenSides, revealScrollLeft } from './scroll.ts'

/** How far from a faded edge the active tab is kept, so the fade never covers it (px). */
const FADE_CLEAR = 40

/**
 * A horizontal tab bar that scrolls: which edges hide tabs (for the fade), and the active tab
 * scrolled into view whenever it changes. Keyboard focus is Radix's, untouched.
 */
function useTabScroll(enabled: boolean, value: string, items: TabItem[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [sides, setSides] = useState({ start: false, end: false })
  const measure = useCallback(() => {
    const list = ref.current
    if (!list || !enabled) return
    const next = hiddenSides(list)
    setSides((prev) => (prev.start === next.start && prev.end === next.end ? prev : next))
  }, [enabled])
  useEffect(() => {
    measure()
    const list = ref.current
    if (!list || !enabled || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure, enabled, items])
  useEffect(() => {
    const list = ref.current
    const tab = list?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
    if (!list || !tab || !enabled) return
    const left = tab.getBoundingClientRect().left - list.getBoundingClientRect().left
    const item = { left: left + list.scrollLeft, width: tab.getBoundingClientRect().width }
    list.scrollLeft = revealScrollLeft(list, item, FADE_CLEAR)
    measure()
  }, [value, enabled, measure])
  return { ref, sides, measure }
}

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  count?: number
  disabled?: boolean
}

/**
 * A tab bar driven by the caller's state: `underline` for navigation between views, `pill` for
 * a compact switch inside a panel. `vertical` stacks the tabs (arrows go up and down) and puts
 * the panels beside them. The panels are the caller's: pass `TabPanel`s as children (linked to
 * their tab for assistive tech), or render the active view yourself next to the bar.
 * A horizontal underline bar too wide for its place scrolls sideways: each edge that hides tabs
 * fades under a chevron, and the active tab is scrolled into view.
 */
export function Tabs({
  items,
  value,
  onValueChange,
  variant = 'underline',
  orientation = 'horizontal',
  label,
  className,
  children,
}: {
  items: TabItem[]
  value: string
  onValueChange: (id: string) => void
  variant?: 'underline' | 'pill'
  orientation?: 'horizontal' | 'vertical'
  /** Accessible name of the tab list. */
  label?: string
  /** On the tab list. */
  className?: string
  /** The `TabPanel`s. */
  children?: ReactNode
}) {
  const scrolls = variant === 'underline' && orientation === 'horizontal'
  const { ref, sides, measure } = useTabScroll(scrolls, value, items)
  const list = (
    <TabsPrimitive.List
      ref={ref}
      aria-label={label}
      onScroll={scrolls ? measure : undefined}
      data-more-start={sides.start || undefined}
      data-more-end={sides.end || undefined}
      className={cx('ui-tabs', `ui-tabs--${variant}`, className)}
    >
      {items.map(({ id, label: text, icon: Icon, count, disabled }) => (
        <TabsPrimitive.Trigger key={id} value={id} disabled={disabled} className="ui-tabs__tab">
          {Icon && <Icon aria-hidden />}
          {text}
          {count !== undefined && <span className="ui-tabs__count">{count}</span>}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
  )
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cx('ui-tabs-root', orientation === 'vertical' && 'ui-tabs-root--vertical')}
    >
      {scrolls ? (
        <div className="ui-tabs-frame">
          {list}
          {sides.start && <MoreTabs side="start" list={ref} />}
          {sides.end && <MoreTabs side="end" list={ref} />}
        </div>
      ) : (
        list
      )}
      {children}
    </TabsPrimitive.Root>
  )
}

/**
 * The mark on an edge that hides tabs: a chevron over the fade. A pointer can click it to page
 * the bar on; it is out of the tab order and hidden from assistive tech — the arrow keys already
 * reach every tab, and the focused one scrolls into view.
 */
function MoreTabs({
  side,
  list,
}: {
  side: 'start' | 'end'
  list: RefObject<HTMLDivElement | null>
}) {
  const Icon = side === 'start' ? ChevronLeft : ChevronRight
  const page = () => {
    const el = list.current
    if (el)
      el.scrollBy({ left: (side === 'start' ? -0.8 : 0.8) * el.clientWidth, behavior: 'smooth' })
  }
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={page}
      className={cx('ui-tabs-frame__more', `ui-tabs-frame__more--${side}`)}
    >
      <Icon />
    </button>
  )
}

/** The view of one tab, shown while its tab is active. `value` is the tab's `id`. */
export function TabPanel({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cx('ui-tabs__panel', className)} {...props} />
}
