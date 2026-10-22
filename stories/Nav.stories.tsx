import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClipboardList, GitBranch, Plug, Search, ShieldCheck, Sparkles } from 'lucide-react'
import {
  ActionRow,
  Badge,
  Count,
  IconTile,
  Input,
  Nav,
  NavGroup,
  NavItem,
  Panel,
  Segmented,
} from '../src/react/index.ts'

const meta = { title: 'Layout/Navigation & second pass', component: Nav } satisfies Meta<typeof Nav>

export default meta
type Story = StoryObj<typeof meta>

export const SideNav: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: 260, background: 'var(--muted)', padding: 8, borderRadius: 12 }}>
      <Nav label="Разделы">
        <NavItem icon={ClipboardList} current end={<Count>12</Count>}>
          Разработка
        </NavItem>
        <NavItem icon={ShieldCheck}>Аудиты</NavItem>
        <NavGroup>Организация</NavGroup>
        <NavItem icon={GitBranch}>Репозитории</NavItem>
        <NavItem icon={Plug} aria-disabled="true">
          Коннекторы
        </NavItem>
      </Nav>
    </div>
  ),
}

export const Pieces: Story = {
  args: { children: null },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 520 }}>
      <div className="sb-row">
        <IconTile icon={Sparkles} size="sm" />
        <IconTile icon={Sparkles} tone="info" />
        <IconTile icon={Sparkles} tone="ok" size="lg" />
        <IconTile icon={Sparkles} tone="warn" size="xl" />
        <IconTile icon={Sparkles} tone="crit" size="lg" />
      </div>
      <ActionRow
        icon={<IconTile icon={GitBranch} tone="info" />}
        title="Подключить репозиторий"
        hint="GitLab, GitHub, Gitea, Bitbucket"
      />
      <ActionRow
        icon={<IconTile icon={GitBranch} tone="info" size="sm" />}
        title="Другой дистрибутив"
        hint="Поставить из каталога"
        chevron
      />
      <ActionRow
        icon={<IconTile icon={GitBranch} size="sm" />}
        title="Обновление готово"
        trailing={<Badge tone="info">v0.13</Badge>}
      />
      <ActionRow
        asChild
        icon={<IconTile icon={GitBranch} tone="ok" size="sm" />}
        title="Ссылка: открыть задачи"
        hint="asChild — строка рендерится ссылкой (a или Link роутера)"
        chevron
      >
        <a href="#tasks" />
      </ActionRow>
      <Panel tone="info" style={{ padding: 16 }}>
        Панель, которая ждёт действия.
        <Panel inset style={{ padding: 10, marginTop: 8 }}>
          Вложенный блок — вопрос модели.
        </Panel>
      </Panel>
      <Input leadingIcon={Search} placeholder="Поиск по знаниям" />
      <div className="sb-row">
        <Input compact placeholder="хост" style={{ width: 140 }} />
        <Segmented
          size="sm"
          label="Вид"
          value="md"
          onChange={() => {}}
          options={[
            { id: 'md', label: 'Разметка' },
            { id: 'txt', label: 'Текст' },
          ]}
        />
        <Badge onRemove={() => {}} removeLabel="Убрать main">
          main
        </Badge>
      </div>
      <p className="ui-title ui-title--sm">Заголовок 14px</p>
      <p className="ui-error">Неверный логин или пароль</p>
      <pre className="ui-code-block">{'{\n  "event": "login",\n  "ok": false\n}'}</pre>
      <p>
        Файл <code className="ui-code">pom.xml</code> в корне.
      </p>
    </div>
  ),
}
