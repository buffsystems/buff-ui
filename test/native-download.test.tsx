// @vitest-environment jsdom
// A file on its way to the phone (#809): how much came, of how much, and how long is left; the
// file viewer shows it while loading, and a page (#808) with a «Preview / Code» switch.
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  DownloadProgress,
  downloadLabel,
  FileViewer,
  ICON_NAMES,
  makeTranslate,
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
const MB = 1024 * 1024

describe('downloadLabel', () => {
  const ru = makeTranslate('ru')
  const en = makeTranslate('en')
  test('how much of how much, and the time left', () => {
    expect(downloadLabel({ done: 1.2 * MB, total: 3.4 * MB, eta: 5 }, ru)).toBe(
      '1.2 MB из 3.4 MB · ещё ~5 с',
    )
    expect(downloadLabel({ done: 1.2 * MB, total: 3.4 * MB, eta: 5 }, en)).toBe(
      '1.2 MB of 3.4 MB · ~5 s left',
    )
  })
  test('minutes past a minute, rounded up', () => {
    expect(downloadLabel({ done: MB, total: 90 * MB, eta: 130 }, ru)).toBe(
      '1.0 MB из 90.0 MB · ещё ~3 мин',
    )
  })
  test('under a second — almost done; no estimate yet — no time', () => {
    expect(downloadLabel({ done: 3 * MB, total: 3.1 * MB, eta: 0.4 }, ru)).toBe(
      '3.0 MB из 3.1 MB · почти готово',
    )
    expect(downloadLabel({ done: 0, total: 2 * MB }, ru)).toBe('0 KB из 2.0 MB')
  })
})

test('the bar shows the share that came', () => {
  render(wrap(<DownloadProgress name="report.pdf" done={MB} total={4 * MB} eta={9} />))
  const bar = screen.getByRole('progressbar')
  expect(bar.getAttribute('aria-valuenow')).toBe('25')
  expect(screen.getByText('report.pdf')).toBeTruthy()
  expect(screen.getByText('1.0 MB из 4.0 MB · ещё ~9 с')).toBeTruthy()
})

test('a loading file with its progress shows the bar, not a bare spinner', () => {
  render(
    wrap(
      <FileViewer
        path="docs/report.pdf"
        content=""
        loading
        progress={{ done: MB, total: 2 * MB }}
      />,
    ),
  )
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50')
  expect(screen.getByText('report.pdf')).toBeTruthy()
})

test('a page opens rendered; «Code» shows its source', () => {
  render(
    wrap(
      <FileViewer
        path="out/index.html"
        content="<h1>Hello</h1>"
        language="html"
        page={<span>rendered page</span>}
      />,
    ),
  )
  expect(screen.getByText('rendered page')).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'Код' }))
  expect(screen.queryByText('rendered page')).toBeNull()
  expect(screen.getByText(/Hello/)).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'Просмотр' }))
  expect(screen.getByText('rendered page')).toBeTruthy()
})

test('without «add to chat» the viewer has no such button (a cabinet attachment)', () => {
  render(wrap(<FileViewer path="a.txt" content="hi" />))
  expect(screen.queryByLabelText('В чат')).toBeNull()
})
