// @vitest-environment jsdom
// #943: what another app shared goes to a connection — a cabinet asks which of its three places —
// and stays in hand as a bar until a dialog takes it.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  IncomingBar,
  incomingLine,
  IncomingScreen,
  makeTranslate,
  NativeProvider,
  type Attachment,
  type IconSet,
  type Install,
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

const cabinet: Install = {
  id: 'acme',
  kind: 'saas',
  name: 'Acme',
  status: { kind: 'online' },
  attention: 0,
}
const machine: Install = {
  id: 'mac',
  kind: 'machine',
  name: 'MacBook',
  status: { kind: 'online' },
  attention: 0,
}
const file = (n: number): Attachment => ({
  id: `f${n}`,
  name: `file-${n}.pdf`,
  size: 2048,
  kind: 'file',
})

test('the shared is named and every connection is offered', () => {
  const did: string[] = []
  render(
    wrap(
      <IncomingScreen
        files={[1, 2, 3, 4, 5].map(file)}
        text="https://example.com/spec"
        installs={[cabinet, machine]}
        onPickInstall={(id) => did.push(id)}
        onCancel={() => did.push('cancel')}
      />,
    ),
  )
  expect(screen.getByText('file-1.pdf')).toBeTruthy()
  expect(screen.queryByText('file-4.pdf')).toBeNull()
  expect(screen.getByText('и ещё 2')).toBeTruthy()
  expect(screen.getByText('https://example.com/spec')).toBeTruthy()
  fireEvent.click(screen.getByText('MacBook'))
  fireEvent.click(screen.getByRole('button', { name: 'Не отправлять' }))
  expect(did).toEqual(['mac', 'cancel'])
})

test('a cabinet asks which place: «Ask», a research or a new task', () => {
  const did: string[] = []
  render(
    wrap(
      <IncomingScreen
        files={[file(1)]}
        installs={[cabinet, machine]}
        picked={cabinet}
        onPickPlace={(p) => did.push(p)}
        onBack={() => did.push('back')}
      />,
    ),
  )
  expect(screen.queryByText('MacBook')).toBeNull()
  fireEvent.click(screen.getByText('Спросить'))
  fireEvent.click(screen.getByText('Глубокое исследование'))
  fireEvent.click(screen.getByText('Новая задача'))
  fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
  expect(did).toEqual(['ask', 'research', 'task', 'back'])
})

test('while the files are read nothing is chosen', () => {
  const did: string[] = []
  render(
    wrap(
      <IncomingScreen
        files={[]}
        loading
        installs={[cabinet]}
        onPickInstall={(id) => did.push(id)}
      />,
    ),
  )
  expect(screen.getByText('Читаем файлы…')).toBeTruthy()
  fireEvent.click(screen.getByText('Acme'))
  expect(did).toEqual([])
})

test('a phone without a connection is offered to add one', () => {
  const did: string[] = []
  render(wrap(<IncomingScreen files={[file(1)]} installs={[]} onAdd={() => did.push('add')} />))
  fireEvent.click(screen.getByRole('button', { name: 'Добавить установку' }))
  expect(did).toEqual(['add'])
})

test('the bar says what is in hand, opens the choice and drops the shared', () => {
  const t = makeTranslate('ru')
  expect(incomingLine(t, 2, false)).toBe('Файлов: 2')
  expect(incomingLine(t, 0, true)).toBe('Текст')
  expect(incomingLine(t, 1, true)).toBe('Файлов: 1 и текст')
  const did: string[] = []
  render(
    wrap(
      <IncomingBar files={2} onPress={() => did.push('open')} onCancel={() => did.push('drop')} />,
    ),
  )
  expect(screen.getByText('Файлов: 2')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Выбрать, куда отправить' }))
  fireEvent.click(screen.getByRole('button', { name: 'Не отправлять' }))
  expect(did).toEqual(['open', 'drop'])
})
