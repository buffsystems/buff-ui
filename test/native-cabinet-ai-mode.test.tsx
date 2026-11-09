// @vitest-environment jsdom
// «Параметры ИИ» on the phone's cabinet (#840): a folded card on the forms that start a question,
// a research, a task or an audit; a chip in an open session; a note row in the dialogue. Only an
// install with the feature shows them — the screens take them as slots.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import {
  AiModeChip,
  AiModeNoteRow,
  AiModeParamsCard,
  AskThreadScreen,
  CreateTaskScreen,
  MessageList,
  NewQuestionScreen,
} from '../src/native/screens/cabinet/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (node: React.ReactNode, locale: 'ru' | 'en' = 'ru') => (
  <NativeProvider icons={icons} locale={locale}>
    {node}
  </NativeProvider>
)
const defaults = { thinking: 'high', contextTokens: 200_000 }

test('the card folds to what will apply and opens to the two choices, each a pick', () => {
  const onPickThinking = vi.fn()
  const onPickContext = vi.fn()
  render(
    wrap(
      <AiModeParamsCard
        thinking={null}
        contextTokens={null}
        defaults={defaults}
        modelWindow={400_000}
        onPickThinking={onPickThinking}
        onPickContext={onPickContext}
      />,
    ),
  )
  expect(screen.getByText('Параметры ИИ')).toBeTruthy()
  expect(screen.getByText('Размышления: высокие · Контекст: средний, 200k')).toBeTruthy()
  fireEvent.click(screen.getByText('Параметры ИИ'))
  fireEvent.click(screen.getByText('По умолчанию (Высокие)'))
  expect(onPickThinking).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByText('По умолчанию (Средний · 200k)'))
  expect(onPickContext).toHaveBeenCalledOnce()
})

test('an own value shows as itself; the summary follows it', () => {
  render(
    wrap(
      <AiModeParamsCard
        thinking="low"
        contextTokens={64_000}
        defaults={defaults}
        defaultOpen
        onPickThinking={() => {}}
        onPickContext={() => {}}
      />,
      'en',
    ),
  )
  expect(screen.getByText('Low')).toBeTruthy()
  expect(screen.getByText('Compact · 64k')).toBeTruthy()
})

test('the chip says the mode in one line and opens on press; the note row is quiet text with its time', () => {
  const onPress = vi.fn()
  render(
    wrap(
      <>
        <AiModeChip thinking="max" contextTokens={0} modelWindow={400_000} onPress={onPress} />
        <AiModeNoteRow text="Иван: размышления — высокие" when="сегодня" />
      </>,
    ),
  )
  fireEvent.click(screen.getByText('Размышления: максимальные · Контекст: максимум модели, 400k'))
  expect(onPress).toHaveBeenCalledOnce()
  expect(screen.getByText('Иван: размышления — высокие')).toBeTruthy()
  expect(screen.getByText('сегодня')).toBeTruthy()
})

test('a dialogue shows a service note as a note row, not as a turn', () => {
  render(
    wrap(
      <MessageList
        messages={[
          { id: 'u', role: 'user', content: 'Вопрос' },
          { id: 'n', role: 'note', content: 'Размышления — низкие', when: 'сейчас' },
          { id: 'a', role: 'assistant', content: 'Ответ' },
        ]}
      />,
    ),
  )
  expect(screen.getByRole('note').textContent).toContain('Размышления — низкие')
})

test('the forms and the thread take the AI parameters and the chip as slots', () => {
  const status = { kind: 'online' } as const
  const { rerender } = render(
    wrap(<NewQuestionScreen status={status} place="acme · shop" params={<span>PARAMS</span>} />),
  )
  expect(screen.getByText('PARAMS')).toBeTruthy()
  rerender(wrap(<CreateTaskScreen status={status} params={<span>TASK-PARAMS</span>} />))
  expect(screen.getByText('TASK-PARAMS')).toBeTruthy()
  rerender(
    wrap(
      <AskThreadScreen
        status={status}
        thread={{ id: 't', title: 'Тема', project: 'shop', status: 'idle', messages: [] } as never}
        chip={<span>CHIP</span>}
      />,
    ),
  )
  expect(screen.getByText('CHIP')).toBeTruthy()
})
