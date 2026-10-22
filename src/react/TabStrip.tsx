/** @jsxRuntime automatic */
import { createContext, useContext } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { X } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import { cx } from './cx.ts'
import { Tooltip } from './Tooltip.tsx'

export type TabStripOrientation = 'horizontal' | 'vertical'

// Navigation mode reaches the triggers without the caller threading it through each tab.
const NavContext = createContext(false)

export interface TabStripProps extends HTMLAttributes<HTMLDivElement> {
  /** `vertical`: a column down a sidebar; drop marks go above and below. */
  orientation?: TabStripOrientation
  /**
   * Tabs that are links to pages (a window's open sessions), not a tablist over panels: no tab
   * roles, the active trigger carries `aria-current="page"`, Tab walks every link. With a
   * `label` the strip is a named navigation landmark.
   */
  nav?: boolean
  /** Accessible name of the tab list (of the navigation, with `nav`). */
  label?: string
  ref?: Ref<HTMLDivElement>
}

/**
 * A strip of document tabs — open sessions, files, terminals — that close and reorder. The
 * look only: selection, keyboard roving, drag and drop stay with the caller, which reports them
 * through TabStripTab's `active`, `dragging` and `drop`.
 */
export function TabStrip({
  orientation = 'horizontal',
  nav = false,
  label,
  className,
  ref,
  ...props
}: TabStripProps) {
  const roles = nav
    ? { role: label ? 'navigation' : undefined }
    : { role: 'tablist', 'aria-orientation': orientation }
  return (
    <NavContext value={nav}>
      <div
        ref={ref}
        {...roles}
        aria-label={label}
        data-orientation={orientation}
        className={cx('ui-tab-strip', className)}
        {...props}
      />
    </NavContext>
  )
}

export interface TabStripTabProps extends HTMLAttributes<HTMLDivElement> {
  /** The open one: filled. */
  active?: boolean
  /** Being dragged: lifted off the strip. */
  dragging?: boolean
  /** Where a dragged tab would land against this one: a bar on that edge. */
  drop?: 'before' | 'after'
  /** Shows the close button (on hover, focus, or while active); it does not start a drag. */
  onClose?: () => void
  closeLabel?: string
  /**
   * More for the close button: `data-*` hooks, an `id`, a `ref`, handlers (they run after the
   * strip's own, which keep a press on it from opening or dragging the tab).
   */
  closeProps?: TabStripCloseProps
  /** A tooltip on the close button — its name and a keybind hint (`<Kbd>`). */
  closeTooltip?: ReactNode
  /** The wrapper — the sortable node of a drag-and-drop library. */
  ref?: Ref<HTMLDivElement>
}

export type TabStripCloseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  [data: `data-${string}`]: string | number | boolean | undefined
  ref?: Ref<HTMLButtonElement>
}

/** One tab: the caller's TabStripTrigger (or link) and an optional close button. */
export function TabStripTab({
  active = false,
  dragging = false,
  drop,
  onClose,
  closeLabel = 'Закрыть вкладку',
  closeProps,
  closeTooltip,
  className,
  children,
  ref,
  ...props
}: TabStripTabProps) {
  return (
    <div
      ref={ref}
      data-active={active || undefined}
      data-dragging={dragging || undefined}
      data-drop={drop}
      className={cx('ui-tab-strip__tab', className)}
      {...props}
    >
      {children}
      {onClose && (
        <TabStripClose
          label={closeLabel}
          tooltip={closeTooltip}
          onClose={onClose}
          {...closeProps}
        />
      )}
    </div>
  )
}

function TabStripClose({
  label,
  tooltip,
  onClose,
  className,
  onPointerDown,
  onMouseDown,
  onClick,
  ...props
}: TabStripCloseProps & { label: string; tooltip: ReactNode; onClose: () => void }) {
  const button = (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={cx('ui-btn ui-btn--icon ui-btn--ghost ui-btn--xs ui-tab-strip__close', className)}
      // Neither a drag nor the tab's own press-to-open starts from the close button.
      onPointerDown={(event) => {
        event.stopPropagation()
        onPointerDown?.(event)
      }}
      onMouseDown={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onMouseDown?.(event)
      }}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        onClick?.(event)
        onClose()
      }}
    >
      <X aria-hidden />
    </button>
  )
  if (tooltip === undefined || tooltip === null) return button
  return (
    <Tooltip content={tooltip} side="bottom">
      {button}
    </Tooltip>
  )
}

export interface TabStripTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  /** Before the label: a project avatar, a file icon, a spinner. */
  icon?: ReactNode
  /** Render the single child (a link) with the trigger's look; it then owns its content. */
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}

/**
 * The tab's pressable body: a role=tab button (or a link) holding an icon and a clipped label.
 * Inside a `nav` strip it has no tab role; `selected` becomes `aria-current="page"`.
 */
export function TabStripTrigger({
  selected = false,
  icon,
  asChild = false,
  className,
  children,
  ...props
}: TabStripTriggerProps) {
  const nav = useContext(NavContext)
  const roles = nav
    ? { 'aria-current': selected ? ('page' as const) : undefined }
    : { role: 'tab', 'aria-selected': selected, tabIndex: selected ? 0 : -1 }
  const shared = { ...roles, className: cx('ui-tab-strip__trigger', className) }
  if (asChild) {
    return (
      <Slot {...shared} {...props}>
        {children}
      </Slot>
    )
  }
  return (
    <button type="button" {...shared} {...props}>
      {icon}
      <span className="ui-tab-strip__label">{children}</span>
    </button>
  )
}
