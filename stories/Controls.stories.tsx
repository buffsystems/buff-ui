import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bot, ClipboardList, GitBranch, ShieldCheck } from 'lucide-react'
import {
  Avatar,
  avatarColor,
  avatarColors,
  Combobox,
  Label,
  nameColor,
  Switch,
  TabPanel,
  Tabs,
} from '../src/react/index.ts'

const meta = { title: 'Inputs/Controls', component: Tabs } satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { id: 'tasks', label: 'Задачи', icon: ClipboardList, count: 12 },
  { id: 'branches', label: 'Ветки', icon: GitBranch },
  { id: 'audit', label: 'Аудит', icon: ShieldCheck, count: 2 },
]

function TabsDemo() {
  const [tab, setTab] = useState('tasks')
  return (
    <div className="sb-stack">
      <Tabs label="Разделы" items={items} value={tab} onValueChange={setTab} />
      <Tabs label="Вид" variant="pill" items={items} value={tab} onValueChange={setTab} />
    </div>
  )
}

export const TabBars: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => <TabsDemo />,
}

const manyItems = [
  { id: 'overview', label: 'Обзор' },
  { id: 'tasks', label: 'Задачи', count: 12 },
  { id: 'branches', label: 'Ветки' },
  { id: 'audit', label: 'Аудит', count: 2 },
  { id: 'knowledge', label: 'Знания' },
  { id: 'members', label: 'Участники' },
  { id: 'billing', label: 'Оплата' },
  { id: 'settings', label: 'Настройки' },
]

function ManyTabsDemo({ start }: { start: string }) {
  const [tab, setTab] = useState(start)
  return <Tabs label="Разделы" items={manyItems} value={tab} onValueChange={setTab} />
}

// More tabs than a phone holds: the bar scrolls sideways, each edge that hides tabs fades, and
// the active tab is scrolled into view — here one near the end, so both edges fade on a phone.
export const ScrollingTabs: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => (
    <div className="sb-stack">
      <ManyTabsDemo start="overview" />
      <ManyTabsDemo start="billing" />
    </div>
  ),
}

function VerticalTabsDemo() {
  const [tab, setTab] = useState('tasks')
  const panels = items.map((item) => (
    <TabPanel key={item.id} value={item.id}>
      <p className="ui-note">Раздел «{item.label}»: содержимое вкладки.</p>
    </TabPanel>
  ))
  return (
    <div className="sb-stack">
      <Tabs label="Разделы" items={items} value={tab} onValueChange={setTab}>
        {panels}
      </Tabs>
      <Tabs
        label="Разделы сбоку"
        orientation="vertical"
        items={items}
        value={tab}
        onValueChange={setTab}
      >
        {panels}
      </Tabs>
      <Tabs
        label="Вид сбоку"
        orientation="vertical"
        variant="pill"
        items={items}
        value={tab}
        onValueChange={setTab}
      >
        {panels}
      </Tabs>
    </div>
  )
}

export const TabPanels: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => <VerticalTabsDemo />,
}

export const Switches: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => (
    <div className="sb-stack">
      <Label>
        <Switch defaultChecked aria-label="Уведомления" /> Уведомления
      </Label>
      <Label>
        <Switch aria-label="Тёмная тема" /> Тёмная тема
      </Label>
      <Label>
        <Switch disabled aria-label="Недоступно" /> Недоступно
      </Label>
    </div>
  ),
}

const projects = ['web-app', 'mobile', 'api', 'site', 'admin', 'billing']

export const Avatars: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => (
    <div className="sb-stack">
      <div className="sb-row">
        <Avatar initials="АЛ" color={avatarColor('blue')} />
        <Avatar initials="ИП" size={32} color={avatarColor('green')} />
        <Avatar icon={Bot} size={40} square color="linear-gradient(135deg, #5b8bff, #7c3aed)" />
        <Avatar initials="?" size={40} />
      </div>
      <p className="sb-caption">Палитра проектов: avatarColor(name)</p>
      <div className="sb-row">
        {avatarColors.map((color) => (
          <Avatar key={color} initials={color} size={32} square color={avatarColor(color)} />
        ))}
      </div>
      <p className="sb-caption">Цвет по имени: nameColor(name)</p>
      <div className="sb-row">
        {projects.map((name) => (
          <Avatar key={name} name={name} size={32} square color={nameColor(name)} />
        ))}
      </div>
    </div>
  ),
}

function ComboboxDemo() {
  const [value, setValue] = useState('')
  return (
    <div style={{ maxWidth: 280, height: 260 }}>
      <Combobox
        aria-label="Ветка"
        placeholder="Ветка или новое имя"
        value={value}
        onChange={setValue}
        options={[
          { value: 'main', hint: 'по умолчанию' },
          { value: 'develop' },
          { value: 'feature/561-design-system' },
        ]}
      />
    </div>
  )
}

export const ComboboxField: Story = {
  args: { items: [], value: '', onValueChange: () => {} },
  render: () => <ComboboxDemo />,
}
