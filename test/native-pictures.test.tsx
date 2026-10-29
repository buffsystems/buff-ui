// @vitest-environment jsdom
// Pictures on the phone (#27): shown, not named; the camera and the gallery only where the
// dialog's model sees pictures.
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AttachmentRow,
  AttachSourceSheet,
  FileViewer,
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
const PNG = 'data:image/png;base64,iVBORw0KGgo='

test('a picture with its bytes shows as a thumbnail; without them — its icon', () => {
  const { container } = render(
    wrap(
      <AttachmentRow
        attachment={{ id: 'a', name: 'chart.png', size: 2048, kind: 'image', preview: PNG }}
      />,
    ),
  )
  expect(container.querySelector('img')?.getAttribute('src')).toBe(PNG)
  cleanup()
  const { container: bare } = render(
    wrap(<AttachmentRow attachment={{ id: 'b', name: 'b.png', size: 2048, kind: 'image' }} />),
  )
  expect(bare.querySelector('img')).toBeNull()
  expect(bare.querySelector('[data-icon="image"]')).toBeTruthy()
})

test('where the model does not see pictures the camera and the gallery are off and say why', () => {
  render(
    wrap(
      <AttachSourceSheet
        pictures={{ images: false, model: 'deepseek/deepseek-v4-flash' }}
        onCamera={() => {}}
        onFile={() => {}}
      />,
    ),
  )
  expect(screen.getAllByText('Модель «deepseek/deepseek-v4-flash» не видит картинки')).toHaveLength(
    2,
  )
  expect(screen.getByRole('button', { name: 'Снять фото' }).getAttribute('aria-disabled')).toBe(
    'true',
  )
  expect(screen.getByRole('button', { name: 'Файл' }).getAttribute('aria-disabled')).not.toBe(
    'true',
  )
  cleanup()
  render(wrap(<AttachSourceSheet pictures={{ images: true, model: 'x' }} />))
  expect(screen.queryByText(/не видит картинки/)).toBeNull()
})

test("a picture file in Buff Code's viewer shows as the picture", () => {
  render(wrap(<FileViewer path="docs/logo.png" content="(image/png)" image={PNG} />))
  expect(screen.getByRole('img', { name: 'docs/logo.png' }).getAttribute('src')).toBe(PNG)
  expect(screen.queryByText('(image/png)')).toBeNull()
})
