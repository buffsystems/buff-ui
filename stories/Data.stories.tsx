import type { Meta, StoryObj } from '@storybook/react-vite'
import { Coins, FileCode2, GitPullRequest, MoreHorizontal, ShieldCheck } from 'lucide-react'
import {
  Badge,
  Button,
  Callout,
  IconButton,
  PageHeader,
  SectionHeader,
  StatGrid,
  StatTile,
  Table,
  ThemeToggle,
} from '../src/react/index.ts'

const meta = { title: 'Data/Screen pieces', component: Table } satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { login: 'ada', status: 'активен', tone: 'ok' as const, tasks: 14, spent: '1 240,50' },
  { login: 'linus', status: 'отключён', tone: 'neutral' as const, tasks: 3, spent: '96,00' },
  { login: 'grace', status: 'ждёт входа', tone: 'warn' as const, tasks: 0, spent: '0,00' },
]

export const DataTable: Story = {
  args: { children: null },
  render: () => (
    <Table framed aria-label="Участники">
      <thead>
        <tr>
          <th>Логин</th>
          <th>Статус</th>
          <th className="ui-table__num">Задачи</th>
          <th className="ui-table__num">Потрачено, ₽</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.login} data-selected={i === 0 || undefined}>
            <td>{r.login}</td>
            <td>
              <Badge tone={r.tone}>{r.status}</Badge>
            </td>
            <td className="ui-table__num">{r.tasks}</td>
            <td className="ui-table__num">{r.spent}</td>
            <td className="ui-table__num">
              <IconButton icon={MoreHorizontal} aria-label="Действия" size="sm" />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}

export const Screen: Story = {
  args: { children: null },
  render: () => (
    <div className="sb-stack">
      <PageHeader
        eyebrow="stocks-bot · проект"
        id="#561"
        title="Собрать единую дизайн-систему"
        subtitle="8 репозиториев · обновлено сегодня"
        status={
          <>
            <Badge tone="info" dot>
              В работе
            </Badge>
            идёт ревью второго слайса
          </>
        }
        actions={
          <>
            <ThemeToggle />
            <Button>Поделиться</Button>
            <Button variant="primary">Одобрить</Button>
          </>
        }
      />
      <StatGrid label="Сводка">
        <StatTile
          icon={ShieldCheck}
          label="Аудит"
          value="10"
          unit="из 10"
          tone="ok"
          note="все разделы"
        />
        <StatTile
          icon={GitPullRequest}
          label="Изменения"
          value="31"
          note="файл"
          onClick={() => {}}
        />
        <StatTile icon={FileCode2} label="Покрытие" value="72%" tone="warn" note="ниже цели 80%" />
        <StatTile
          icon={Coins}
          label="Расход"
          value="1 240"
          unit="₽"
          action={
            <a className="ui-link" href="#">
              детали
            </a>
          }
        />
      </StatGrid>
      <div>
        <p className="ui-title">Заголовок блока</p>
        <p className="ui-note">Примечание — вторичное предложение под заголовком.</p>
        <p className="ui-hint">Подсказка мелким шрифтом.</p>
      </div>
      <SectionHeader
        title="Замечания"
        note="3 открыто"
        action={
          <a className="ui-link" href="#">
            Экспорт
          </a>
        }
      />
      <Callout tone="info" title="Подсказка">
        Слайсы мерджатся только после проверки на стенде.
      </Callout>
      <Callout tone="ok">Все проверки прошли.</Callout>
      <Callout tone="warn" title="Нет доступа" action={<Button size="sm">Запросить</Button>}>
        к репозиторию deploy
      </Callout>
      <Callout tone="crit" role="alert">
        Сборка упала на шаге typecheck.
      </Callout>
      <Callout tone="neutral" icon={null}>
        Нейтральная заметка без иконки.
      </Callout>
    </div>
  ),
}

export const WideTable: Story = {
  args: { children: null },
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Table framed aria-label="Расход по дням">
        <thead>
          <tr>
            {['День', 'Модель', 'Вход', 'Выход', 'Кэш', 'Стоимость', 'Задача', 'Организация'].map(
              (h) => (
                <th key={h}>{h}</th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((d) => (
            <tr key={d}>
              <td>1{d} окт</td>
              <td>claude-sonnet</td>
              <td className="ui-table__num">120 000</td>
              <td className="ui-table__num">8 400</td>
              <td className="ui-table__num">90 000</td>
              <td className="ui-table__num">1,24 $</td>
              <td>#42</td>
              <td>acme</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ),
}
