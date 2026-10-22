import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardContent, Chip, ChipRow, Segmented } from '../src/react/index.ts'

const meta = { title: 'Inputs/Chip & Segmented', component: ChipRow } satisfies Meta<typeof ChipRow>

export default meta
type Story = StoryObj<typeof meta>

function Filters() {
  const [active, setActive] = useState('all')
  const items = [
    { id: 'all', label: 'Все', count: 9 },
    { id: 'review', label: 'На ревью', count: 2 },
    { id: 'done', label: 'Готово', count: 7 },
  ]
  return (
    <ChipRow label="Фильтр задач">
      {items.map((item) => (
        <Chip
          key={item.id}
          pressed={active === item.id}
          count={item.count}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </Chip>
      ))}
    </ChipRow>
  )
}

export const Chips: Story = { args: { label: '', children: null }, render: () => <Filters /> }

// Without `pressed`: plain actions in the chip's look (prompt suggestions), never toggles.
export const ActionChips: Story = {
  args: { label: '', children: null },
  render: () => (
    <ChipRow label="Подсказки">
      <Chip size="sm" onClick={() => {}}>
        Почини падающие тесты
      </Chip>
      <Chip size="sm" onClick={() => {}}>
        Объясни этот модуль
      </Chip>
    </ChipRow>
  ),
}

function Segments({ count }: { count: 2 | 3 | 4 }) {
  const options = [
    { id: 'all', label: 'Все', count: 12 },
    { id: 'open', label: 'Открытые', count: 5 },
    { id: 'fixed', label: 'Исправленные' },
    { id: 'skipped', label: 'Пропущенные' },
  ].slice(0, count)
  const [value, setValue] = useState('all')
  return <Segmented label="Замечания" value={value} onChange={setValue} options={options} />
}

export const SegmentedControl: Story = {
  args: { label: '', children: null },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 560 }}>
      <Segments count={2} />
      <Segments count={3} />
      <Segments count={4} />
    </div>
  ),
}

function LongSegments() {
  const [bump, setBump] = useState('patch')
  const [key, setKey] = useState('other')
  return (
    <>
      <Segmented
        label="Подъём версии"
        value={bump}
        onChange={setBump}
        options={[
          { id: 'patch', label: 'patch — исправления' },
          { id: 'minor', label: 'minor — новое' },
          { id: 'major', label: 'major — несовместимое' },
        ]}
      />
      <Segmented
        label="Какой ключ добавить"
        value={key}
        onChange={setKey}
        options={[
          { id: 'config', label: 'ключ конфигурации' },
          { id: 'other', label: 'другой публичный ключ' },
        ]}
      />
    </>
  )
}

// Labels longer than a cell wrap inside it; a cell whose word still does not fit takes a row of
// its own — nothing is clipped on a 390px phone. In a card, as the deploy wizard shows them.
export const SegmentedLongLabels: Story = {
  args: { label: '', children: null },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 560 }}>
      <Card>
        <CardContent className="sb-stack">
          <LongSegments />
        </CardContent>
      </Card>
      <div className="sb-stack" style={{ maxWidth: 240 }}>
        <p className="sb-caption">240px: a word wider than its cell</p>
        <LongSegments />
      </div>
    </div>
  ),
}
