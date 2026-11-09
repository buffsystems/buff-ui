// @vitest-environment jsdom
// «Спросить» on the phone (#813): the follow-up stays open while Buff answers; a question sent
// meanwhile is marked «В очереди» until a turn takes it.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import { AskThreadScreen } from '../src/native/screens/cabinet/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const online = { kind: 'online' } as Parameters<typeof AskThreadScreen>[0]['status']

test('while Buff answers the follow-up can be typed and sent; a later question waits', () => {
  const onSend = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <AskThreadScreen
        status={online}
        draft="и ещё вопрос"
        onSend={onSend}
        thread={{
          id: 't',
          author: 'me',
          status: 'answering',
          updated: '',
          project: 'shop',
          messages: [
            { id: '1', role: 'user', content: 'первый вопрос' },
            { id: '2', role: 'user', content: 'уточнение', queued: true },
          ],
        }}
      />
    </NativeProvider>,
  )
  expect(screen.getAllByText('В очереди')).toHaveLength(1)
  const send = screen.getByRole('button', { name: 'Отправить' })
  expect(send.getAttribute('aria-disabled')).not.toBe('true')
  fireEvent.click(send)
  expect(onSend).toHaveBeenCalledTimes(1)
})
