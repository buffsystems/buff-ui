// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Accordion,
  AccordionItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

describe('Collapsible', () => {
  test('the trigger toggles the content and reports it', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Collapsible bordered onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Чтение файла</CollapsibleTrigger>
        <CollapsibleContent>src/app.ts</CollapsibleContent>
      </Collapsible>,
    )
    const trigger = screen.getByRole('button', { name: 'Чтение файла' })
    expect(trigger.className).toBe('ui-collapsible__trigger')
    expect(trigger.closest('.ui-collapsible')?.className).toContain('ui-collapsible--bordered')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('src/app.ts')).toBeNull()
    await user.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('src/app.ts').className).toBe('ui-collapsible__content')
  })

  test('asChild keeps your own trigger element, without the chevron', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <a href="#more">Ещё</a>
        </CollapsibleTrigger>
        <CollapsibleContent>…</CollapsibleContent>
      </Collapsible>,
    )
    const link = screen.getByRole('link', { name: 'Ещё' })
    expect(link.className).toBe('ui-collapsible__trigger')
    expect(link.querySelector('svg')).toBeNull()
  })
})

describe('Accordion', () => {
  function Sections() {
    return (
      <Accordion type="single" collapsible defaultValue="models">
        <AccordionItem value="models" title="Модели">
          Список моделей
        </AccordionItem>
        <AccordionItem value="keys" title="Ключи">
          Ключи провайдеров
        </AccordionItem>
        <AccordionItem value="off" title="Скоро" disabled>
          …
        </AccordionItem>
      </Accordion>
    )
  }

  test('each section is a heading with a button; one opens at a time', async () => {
    const user = userEvent.setup()
    render(<Sections />)
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual([
      'Модели',
      'Ключи',
      'Скоро',
    ])
    const models = screen.getByRole('button', { name: 'Модели' })
    expect(models.className).toBe('ui-accordion__trigger')
    expect(screen.getByText('Список моделей').className).toBe('ui-accordion__body')
    await user.click(screen.getByRole('button', { name: 'Ключи' }))
    expect(models.getAttribute('aria-expanded')).toBe('false')
    expect(screen.getByText('Ключи провайдеров')).toBeTruthy()
    expect(screen.queryByText('Список моделей')).toBeNull()
  })

  test('arrow keys move between headers and skip a disabled one', async () => {
    const user = userEvent.setup()
    render(<Sections />)
    screen.getByRole('button', { name: 'Ключи' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toBe('Модели')
  })
})
