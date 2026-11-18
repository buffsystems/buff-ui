// @vitest-environment jsdom
// #936: a text file on the phone. Its source is one piece of selectable text — a fragment of
// several lines can be selected and copied, not a line at a time — with the line numbers beside
// it, out of the selection. A Markdown file opens rendered, its source one tap away, as a page
// has «Preview / Code».
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FileViewer, ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const CODE = 'export function search(notes, query) {\n  return notes // all\n}\n'
const MD = '# notes-api\n\nСервис заметок: **поиск** и теги.\n\n- первый\n- второй\n'

test('the source of a file is one selectable text of all its lines', () => {
  render(wrap(<FileViewer path="src/search.js" content={CODE} language="javascript" />))
  const source = screen.getByTestId('file-source')
  expect(source.textContent).toBe(CODE)
  // The numbers stand beside the text and never get into what is copied.
  expect(screen.getByTestId('file-lines').textContent).toBe('1\n2\n3\n4')
  expect(within(source).queryByText('1')).toBeNull()
})

test('a plain text file shows as it is, with no view switch', () => {
  render(wrap(<FileViewer path="notes.txt" content={'первая\nвторая\n'} />))
  expect(screen.getByTestId('file-source').textContent).toBe('первая\nвторая\n')
  expect(screen.queryByRole('tab')).toBeNull()
})

test('a Markdown file opens rendered, and «Text» shows its source', () => {
  render(wrap(<FileViewer path="docs/README.md" content={MD} language="markdown" />))
  expect(screen.getByRole('tab', { name: 'Просмотр' }).getAttribute('aria-selected')).toBe('true')
  expect(screen.getByText('notes-api')).toBeTruthy()
  expect(screen.queryByTestId('file-source')).toBeNull()
  fireEvent.click(screen.getByRole('tab', { name: 'Текст' }))
  expect(screen.getByTestId('file-source').textContent).toBe(MD)
  fireEvent.click(screen.getByRole('tab', { name: 'Просмотр' }))
  expect(screen.queryByTestId('file-source')).toBeNull()
})

test('Markdown is told by the name too, whatever the case', () => {
  render(wrap(<FileViewer path="CHANGELOG.MD" content={MD} />))
  expect(screen.getByRole('tab', { name: 'Текст' })).toBeTruthy()
})

test('a page keeps «Preview / Code»', () => {
  render(
    wrap(<FileViewer path="index.html" content="<p>hi</p>" language="html" page={<i>page</i>} />),
  )
  expect(screen.getByRole('tab', { name: 'Код' })).toBeTruthy()
  expect(screen.queryByRole('tab', { name: 'Текст' })).toBeNull()
})

test('«Copy» takes the whole text of a text file; a picture or a file on its way has none', () => {
  const onCopy = vi.fn()
  const { rerender } = render(
    wrap(<FileViewer path="src/search.js" content={CODE} language="javascript" onCopy={onCopy} />),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Скопировать текст файла' }))
  expect(onCopy).toHaveBeenCalledTimes(1)
  rerender(wrap(<FileViewer path="docs/README.md" content={MD} onCopy={onCopy} />))
  expect(screen.getByRole('button', { name: 'Скопировать текст файла' })).toBeTruthy()
  rerender(
    wrap(<FileViewer path="a.png" content="" image="data:image/png;base64,AA" onCopy={onCopy} />),
  )
  expect(screen.queryByRole('button', { name: 'Скопировать текст файла' })).toBeNull()
  rerender(wrap(<FileViewer path="src/search.js" content="" loading onCopy={onCopy} />))
  expect(screen.queryByRole('button', { name: 'Скопировать текст файла' })).toBeNull()
  rerender(wrap(<FileViewer path="src/search.js" content={CODE} />))
  expect(screen.queryByRole('button', { name: 'Скопировать текст файла' })).toBeNull()
})
