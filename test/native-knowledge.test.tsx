// @vitest-environment jsdom
// «База знаний» on the phone (#648): the search, the editor's fields and the archive reason are
// handed on as typed.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ArchiveSheet,
  ICON_NAMES,
  KnowledgeEditorScreen,
  KnowledgeListScreen,
  NativeProvider,
  type IconSet,
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
const online = { kind: 'online' } as const
const shell: ShellProps = {
  install: { id: 'a', kind: 'saas', name: 'Acme', status: online, attention: 0 },
}

test('the list hands on the search as typed', () => {
  const typed: string[] = []
  render(
    wrap(
      <KnowledgeListScreen
        shell={shell}
        status={online}
        entries={[]}
        onQuery={(q) => typed.push(q)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText(/Поиск|Search/), { target: { value: 'сборка' } })
  expect(typed).toEqual(['сборка'])
})

test('the editor hands on each text field', () => {
  const typed: string[] = []
  render(
    wrap(
      <KnowledgeEditorScreen
        status={online}
        form={{
          title: '',
          name: '',
          description: '',
          type: 'rule',
          scope: '',
          body: '',
          pinned: false,
          permanent: false,
        }}
        onField={(f, v) => typed.push(`${f}:${v}`)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText('sborka-trebuet-tulcheyn'), {
    target: { value: 'x-y' },
  })
  fireEvent.change(screen.getByPlaceholderText(/\[\[имя-записи\]\]/), {
    target: { value: 'текст' },
  })
  expect(typed).toEqual(['name:x-y', 'body:текст'])
})

test('the editor examples speak the app language (#565)', () => {
  const form = {
    title: '',
    name: '',
    description: '',
    type: 'fact' as const,
    scope: '',
    body: '',
    pinned: false,
    permanent: false,
  }
  render(
    <NativeProvider icons={icons} locale="en">
      <KnowledgeEditorScreen status={online} form={form} />
    </NativeProvider>,
  )
  const placeholders = [...document.querySelectorAll('[placeholder]')].map((e) =>
    e.getAttribute('placeholder'),
  )
  expect(placeholders).toContain('For example: The stand lives at stage.example.com')
  expect(placeholders.some((p) => p?.includes('[[entry-name]]'))).toBe(true)
  expect(placeholders.filter((p) => /[а-яё]/i.test(p ?? ''))).toEqual([])
})

test('the archive sheet hands on its reason', () => {
  const typed: string[] = []
  render(wrap(<ArchiveSheet onReason={(r) => typed.push(r)} />))
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'устарело' } })
  expect(typed).toEqual(['устарело'])
})

test('the prompt load names what every run gets and opens to the heaviest', () => {
  render(
    wrap(
      <KnowledgeListScreen
        shell={shell}
        status={online}
        entries={[]}
        load={{
          project: 'shop',
          pinned: 2,
          total: 9,
          tokens: 1240,
          taskEntries: 0,
          heaviest: [{ id: '1', title: 'YAGNI', scope: 'Организация', tokens: 800 }],
        }}
      />,
    ),
  )
  const line = screen.getByText(/модель получает целиком записей: 2 из 9/)
  fireEvent.click(line)
  expect(screen.getByText('~800 ток.')).toBeTruthy()
})
