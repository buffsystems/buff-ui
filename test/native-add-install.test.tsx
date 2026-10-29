// @vitest-environment jsdom
// #696: one more install is added the same two ways as the first one.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  EnterCodeScreen,
  ICON_NAMES,
  NativeProvider,
  WelcomeScreen,
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

test('adding an install offers the QR and the link with the code, and a way back', () => {
  const did: string[] = []
  render(
    wrap(
      <WelcomeScreen
        onScan={() => did.push('scan')}
        onEnterCode={() => did.push('code')}
        onBack={() => did.push('back')}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Сканировать QR' }))
  fireEvent.click(screen.getByRole('button', { name: 'Ввести ссылку и код' }))
  fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
  expect(did).toEqual(['scan', 'code', 'back'])
})

// v0.22.0: the hint named app.buff.systems, while every pairing link is https://buff.systems/pair/….
test('the link field shows the address pairing links really have', () => {
  render(wrap(<EnterCodeScreen />))
  expect(screen.getByPlaceholderText('https://buff.systems/pair/…')).toBeTruthy()
})
