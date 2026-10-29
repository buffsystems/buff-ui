// @vitest-environment jsdom
// The detail screen's stages (#691): folded to one line by default, so the task's call to act
// stays on the first screen; a tap opens the seven stages with their notes.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import { StageStrip } from '../src/native/screens/cabinet/dev/stage.tsx'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

test('folded by default; a tap opens the stages and their notes', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <StageStrip
        stage={{ index: 1, id: 'formulation', stopped: false }}
        notes={{ request: '24 окт.' }}
      />
    </NativeProvider>,
  )
  const head = screen.getByRole('button', { name: 'Этапы · 2 из 7 · сейчас формулировка' })
  expect(screen.queryByText('Декомпозиция')).toBeNull()
  expect(screen.queryByText('24 окт.')).toBeNull()
  fireEvent.click(head)
  expect(screen.getByText('Декомпозиция')).toBeTruthy()
  expect(screen.getByText('24 окт.')).toBeTruthy()
})
