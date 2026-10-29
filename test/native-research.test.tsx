// @vitest-environment jsdom
// «Исследования» on the phone (#646): the list's «only mine» and project, and the research's typing.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  NativeProvider,
  ResearchListScreen,
  ResearchScreen,
  type IconSet,
  type Research,
  type ShellProps,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const shell: ShellProps = {
  install: { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'online' }, attention: 0 },
}

const research: Research = {
  id: 'r1',
  title: 'Кэш',
  author: 'ann',
  status: 'waiting',
  updated: 'сейчас',
  project: 'shop',
  document: '',
  dialog: [
    {
      id: 't1',
      role: 'clarify',
      body: '',
      when: '12:00',
      questions: [{ id: 'q1', text: 'Какой кэш?', options: [{ label: 'Redis' }] }],
    },
  ],
}

test('the list names its project and switches to «only mine»', () => {
  const mine: boolean[] = []
  render(
    wrap(
      <ResearchListScreen
        shell={shell}
        status={{ kind: 'online' }}
        items={[]}
        project={{ id: 'shop', name: 'shop' }}
        mine={false}
        onMine={(m) => mine.push(m)}
      />,
    ),
  )
  expect(screen.getByText(/^shop · /)).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'Мои' }))
  expect(mine).toEqual([true])
})

test('the research takes an own answer, a draft, and shows its cost and the ceiling', () => {
  const free: string[] = []
  const draft: string[] = []
  render(
    wrap(
      <ResearchScreen
        status={{ kind: 'online' }}
        research={research}
        cost="12 ₽"
        notice="Лимит расходов исчерпан"
        onFree={(id, text) => free.push(`${id}:${text}`)}
        onDraft={(text) => draft.push(text)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText('…или свой ответ'), {
    target: { value: 'Memcached' },
  })
  fireEvent.change(screen.getByPlaceholderText('Ответьте на вопрос аналитика…'), {
    target: { value: 'ещё' },
  })
  expect(free).toEqual(['q1:Memcached'])
  expect(draft).toEqual(['ещё'])
  expect(screen.getByText('Лимит расходов исчерпан')).toBeTruthy()
  expect(screen.getByText(/12 ₽/)).toBeTruthy()
})
