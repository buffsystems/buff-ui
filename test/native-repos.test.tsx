// @vitest-environment jsdom
// «Репозитории» on the phone (#650): the import form hands on what is typed.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AddRepoSheet, ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)

test('the import form hands on the address, the name and the dev project name', () => {
  const typed: string[] = []
  render(
    wrap(
      <AddRepoSheet
        form={{ url: '', name: '', token: '', createDev: true, devName: '' }}
        onField={(f, v) => typed.push(`${f}:${v}`)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText('https://gitlab.com/group/project'), {
    target: { value: 'https://gitlab.com/g/p' },
  })
  fireEvent.change(screen.getByPlaceholderText('project'), { target: { value: 'p' } })
  expect(typed).toEqual(['url:https://gitlab.com/g/p', 'name:p'])
})
