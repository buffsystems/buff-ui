// @vitest-environment jsdom
// «Аудиты» on the phone (#649): the section's run shows what it changed and opens the files.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AuditSectionScreen,
  ICON_NAMES,
  NativeProvider,
  type IconSet,
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

test('a ready section shows its spend and changes; the changes open', () => {
  let opened = 0
  render(
    wrap(
      <AuditSectionScreen
        status={{ kind: 'online' }}
        report={{
          section: { id: 'A', title: 'A. Архитектура', about: '', status: 'ready', date: '1 окт' },
          content: '# A\n\nтекст',
          tokens: '120 тыс. токенов',
          changes: { files: 1, add: 40, del: 0 },
        }}
        onChanges={() => opened++}
      />,
    ),
  )
  expect(screen.getByText('120 тыс. токенов')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Изменено файлов: 1 · +40 −0' }))
  expect(opened).toBe(1)
})
