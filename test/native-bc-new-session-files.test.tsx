// @vitest-environment jsdom
// #943: a new Buff Code session takes files for its first message, as a session's composer does.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  ICON_NAMES,
  NativeProvider,
  NewSessionScreen,
  type Attachment,
  type IconSet,
  type Install,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const machine: Install = {
  id: 'mac',
  kind: 'machine',
  name: 'MacBook',
  status: { kind: 'online' },
  attention: 0,
}
const file: Attachment = { id: 'f1', name: 'file-1.pdf', size: 2048, kind: 'file' }

test('a new session shows its files and attaches more', () => {
  const did: string[] = []
  render(
    <NativeProvider icons={icons} locale="ru">
      <NewSessionScreen
        install={machine}
        status={machine.status}
        staged={[file]}
        onAttach={() => did.push('attach')}
        onRemoveStaged={(id) => did.push(id)}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('file-1.pdf')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Прикрепить' }))
  fireEvent.click(screen.getByRole('button', { name: 'Убрать' }))
  expect(did).toEqual(['attach', 'f1'])
})
