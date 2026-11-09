// @vitest-environment jsdom
// «Исследования» on the phone (#646): the list's «only mine» and project, and the research's typing.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  NativeProvider,
  ResearchFailureSheet,
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

// #767: a failed research said only «Ошибка». It now says why and offers «Продолжить».
const failed: Research = {
  ...research,
  status: 'error',
  document: '# Кэш\n\nЧерновик.',
  dialog: [],
  failure: {
    kind: 'provider',
    step: 'analyst_first',
    attempts: 5,
    detail: '{"code":504,"message":"error code: 524"}',
  },
}

test('a failed research explains the reason, hides the raw text behind a toggle and continues', () => {
  const calls: string[] = []
  render(
    wrap(
      <ResearchScreen
        status={{ kind: 'online' }}
        research={failed}
        onContinue={() => calls.push('continue')}
        onFailure={() => calls.push('failure')}
      />,
    ),
  )
  expect(screen.getByText('Исследование остановилось с ошибкой')).toBeTruthy()
  expect(
    screen.getByText('Провайдер модели не отвечал или обрывал связь. Попыток: 5.'),
  ).toBeTruthy()
  expect(screen.getByText('Этап: аналитик')).toBeTruthy()
  expect(screen.queryByText(/error code: 524/)).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Технические детали' }))
  expect(screen.getByText(/error code: 524/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
  fireEvent.click(screen.getByRole('button', { name: 'Ошибка' }))
  expect(calls).toEqual(['continue', 'failure'])
})

test('a research that failed before reasons were kept says so; a reader gets no «Продолжить»', () => {
  render(
    wrap(
      <ResearchScreen
        status={{ kind: 'online' }}
        research={{ ...failed, failure: null }}
        canWrite={false}
        onContinue={() => {}}
      />,
    ),
  )
  expect(screen.getByText('Причина не сохранена.')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Продолжить' })).toBeNull()
})

test('the failure sheet carries the same reason and «Продолжить»', () => {
  const calls: string[] = []
  render(
    wrap(
      <ResearchFailureSheet
        failure={{ kind: 'limit' }}
        onContinue={() => calls.push('continue')}
        onClose={() => calls.push('close')}
      />,
    ),
  )
  expect(
    screen.getByText('Провайдер модели отказал: превышен лимит запросов или закончился баланс.'),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
  expect(calls).toEqual(['continue'])
})

test('a step inside the review loop names its stage (#767)', () => {
  render(
    wrap(
      <ResearchScreen
        status={{ kind: 'online' }}
        research={{ ...failed, failure: { kind: 'interrupted', step: 'review' } }}
      />,
    ),
  )
  expect(screen.getByText('Этап: ревью')).toBeTruthy()
})
