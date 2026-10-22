/** @jsxRuntime automatic */
import type { ComponentProps, ReactNode } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cx } from './cx.ts'

/**
 * A stack of folding sections. `type="single"` keeps one open (add `collapsible` to let it
 * close); `type="multiple"` opens any. Arrow keys move between the headers (Radix).
 */
export function Accordion({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cx('ui-accordion', className)} {...props} />
}

/** One section: its title is the header button, the children are the body. */
export function AccordionItem({
  title,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof AccordionPrimitive.Item>, 'title'> & {
  title: ReactNode
}) {
  return (
    <AccordionPrimitive.Item className={cx('ui-accordion__item', className)} {...props}>
      <AccordionPrimitive.Header className="ui-accordion__header">
        <AccordionPrimitive.Trigger className="ui-accordion__trigger">
          {title}
          <ChevronDown aria-hidden className="ui-accordion__chevron" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="ui-accordion__content">
        <div className="ui-accordion__body">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
