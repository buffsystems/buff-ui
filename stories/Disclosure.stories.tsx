import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../src/react/index.ts'

const meta = {
  title: 'Layout/Disclosure',
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsibles: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 460 }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Ещё настройки</CollapsibleTrigger>
        <CollapsibleContent>
          <p className="ui-note" style={{ margin: '0.25rem 0 0 1.375rem' }}>
            Лимит шагов, таймаут команд, переменные окружения.
          </p>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Свёрнутая секция</CollapsibleTrigger>
        <CollapsibleContent>скрыто</CollapsibleContent>
      </Collapsible>
      <Collapsible bordered defaultOpen>
        <CollapsibleTrigger>Чтение src/session/screen.tsx</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ui-collapsible__body">Прочитано 612 строк.</div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible bordered>
        <CollapsibleTrigger>Запуск make ci</CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ui-collapsible__body">…</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const Accordions: Story = {
  render: () => (
    <div style={{ maxWidth: 460 }}>
      <Accordion type="single" collapsible defaultValue="models">
        <AccordionItem value="models" title="Модели">
          Какие модели видны в выборе и какая стоит по умолчанию.
        </AccordionItem>
        <AccordionItem value="keys" title="Ключи провайдеров">
          …
        </AccordionItem>
        <AccordionItem value="mcp" title="MCP-серверы">
          …
        </AccordionItem>
        <AccordionItem value="soon" title="Скоро" disabled>
          …
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
