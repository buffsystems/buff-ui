// The one sentence of where a task is (#906): a decomposition whose run was stopped has atoms
// filed — the sentence read «декомпозирована» for a plan left half done. A stopped run names the
// step it stopped on and what «Запустить заново» does.
import { expect, test } from 'vitest'
import { makeTranslate } from '../src/native/index.ts'
import { statusText } from '../src/native/screens/cabinet/dev/details-tab.tsx'
import type { TaskDetail } from '../src/native/screens/cabinet/dev/model.ts'

const task = (over: Partial<TaskDetail>): TaskDetail =>
  ({
    number: 7,
    title: 'T',
    state: 'open',
    stage: { index: 2, id: 'decomposition', stopped: false },
    subtasksTotal: 18,
    subtasksDone: 0,
    updated: '',
    phase: 'none',
    stageNotes: {},
    ...over,
  }) as TaskDetail

test('a run stopped mid-decomposition names its step, not «декомпозирована»', () => {
  const stopped = task({ stage: { index: 2, id: 'decomposition', stopped: true } })
  expect(statusText(makeTranslate('ru'), stopped)).toBe(
    'Прогон остановлен на шаге «Декомпозиция». «Запустить заново» продолжит его с этого шага.',
  )
  expect(statusText(makeTranslate('en'), stopped)).toContain('Decomposition')
})

test('a decomposed task nobody stopped still reads as waiting for development', () => {
  expect(statusText(makeTranslate('ru'), task({}))).toBe(
    'Задача декомпозирована — разработка ещё не запущена.',
  )
})
