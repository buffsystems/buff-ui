// @vitest-environment jsdom
// The first-launch tour (#931): four cards — Buff Code first, then the knowledge base, development
// and how to connect. A tap or a button turns them, they turn by themselves on a clock, «Skip» and a tap past the last card close; the demo and connecting are on every
// card, and a build without the demo offers only connecting.
import { afterEach, expect, test, vi } from 'vitest'

// The system's «reduce motion», which jsdom does not have: the tests set it.
const motion = vi.hoisted(() => {
  const motion = { reduce: false }
  window.matchMedia = () =>
    ({
      get matches() {
        return motion.reduce
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList
  return motion
})
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { Animated } from 'react-native'
import {
  ICON_NAMES,
  NativeProvider,
  TourScreen,
  WelcomeScreen,
  type IconSet,
  type Locale,
} from '../src/native/index.ts'
import type { TourTiming } from '../src/native/screens/use-tour.ts'

afterEach(() => {
  cleanup()
  motion.reduce = false
})

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode, locale: Locale = 'ru') => (
  <NativeProvider icons={icons} locale={locale}>
    {children}
  </NativeProvider>
)
const TITLES = {
  ru: [
    'Buff Code — с телефона',
    'База знаний команды',
    'Решения принимаете вы',
    'Подключение — по QR-⁠коду',
  ],
  en: [
    'Buff Code from your phone',
    'Your team’s knowledge base',
    'You make the decisions',
    'Connect with a QR code',
  ],
}
const press = (name: string) => fireEvent.click(screen.getByRole('button', { name }))
const shows = (title: string) => expect(screen.getByRole('heading', { name: title })).toBeTruthy()
const sleep = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)))
const card = () => screen.getByRole('progressbar').getAttribute('aria-label')

test.each(['ru', 'en'] as const)(
  'the buttons go through the four cards and back (%s)',
  (locale) => {
    const [next, back] = locale === 'ru' ? ['Дальше', 'Назад'] : ['Next', 'Back']
    render(wrap(<TourScreen autoAdvance={false} />, locale))
    expect(screen.getByText(locale === 'ru' ? /ИИ-агенты пишут код/ : /AI agents write the code/))
    for (const [i, title] of TITLES[locale].entries()) {
      shows(title)
      if (i < 3) press(next)
    }
    press(back)
    shows(TITLES[locale][2]!)
    press(back)
    press(back)
    press(back)
    shows(TITLES[locale][0]!)
  },
)

test('a tap on the card goes on, and past the last card closes the tour', () => {
  const closed = vi.fn()
  render(wrap(<TourScreen autoAdvance={false} onClose={closed} />))
  for (const title of TITLES.ru) {
    shows(title)
    fireEvent.click(screen.getByTestId('tour-card'))
  }
  expect(closed).toHaveBeenCalledTimes(1)
  shows(TITLES.ru[3]!)
})

test('the demo, connecting and «Skip» are on every card', () => {
  const done: string[] = []
  render(
    wrap(
      <TourScreen
        autoAdvance={false}
        onDemo={() => done.push('demo')}
        onConnect={() => done.push('connect')}
        onClose={() => done.push('close')}
      />,
    ),
  )
  for (const [i] of TITLES.ru.entries()) {
    press('Посмотреть демо')
    press('Подключить')
    press('Пропустить')
    if (i < 3) press('Дальше')
  }
  expect(done).toEqual(Array(4).fill(['demo', 'connect', 'close']).flat())
  expect(screen.getByText(/Или посмотрите демо — без регистрации/)).toBeTruthy()
})

test('a build without the demo offers connecting only and does not speak of the demo', () => {
  render(wrap(<TourScreen autoAdvance={false} onConnect={() => undefined} />))
  expect(screen.queryByText('Посмотреть демо')).toBeNull()
  for (const _ of TITLES.ru.slice(1)) press('Дальше')
  expect(screen.queryByText(/демо/)).toBeNull()
})

test('with «reduce motion» cards wait for the person: no clock, nothing to pause', async () => {
  motion.reduce = true
  render(wrap(<TourScreen cardMs={100} />))
  await sleep(400)
  expect(card()).toBe('Карточка 1 из 4')
  expect(screen.queryByRole('button', { name: 'Пауза' })).toBeNull()
})

// The clock, with a stand-in for the animation: the test says when a card's time runs out.
function fakeClock() {
  type Run = { duration: number; running: boolean; finish: () => void }
  const runs: Run[] = []
  const timing: TourTiming = (value, config) => {
    let end: ((result: { finished: boolean }) => void) | undefined
    const run: Run = {
      duration: Number(config.duration),
      running: false,
      finish: () => {
        run.running = false
        value.setValue(1)
        end?.({ finished: true })
      },
    }
    runs.push(run)
    return {
      start: (cb) => {
        run.running = true
        end = cb
      },
      stop: () => {
        if (!run.running) return
        run.running = false
        end?.({ finished: false })
      },
    }
  }
  return {
    timing,
    runs,
    last: () => runs.at(-1)!,
    at: (v: number) => act(() => progressOf().setValue(v)),
  }
}
// The current card's time, as the screen's clock keeps it.
let progressOf: () => Animated.Value
const Clocked = (props: Parameters<typeof TourScreen>[0]) => <TourScreen cardMs={6000} {...props} />

async function clocked(onClose?: () => void) {
  const clock = fakeClock()
  const timing: TourTiming = (value, config) => {
    progressOf = () => value
    return clock.timing(value, config)
  }
  render(wrap(<Clocked timing={timing} {...(onClose ? { onClose } : {})} />))
  await waitFor(() => expect(clock.runs.length).toBe(1))
  return clock
}

test('a card that runs out turns to the next, which starts its own six seconds', async () => {
  const clock = await clocked()
  expect(clock.last()).toMatchObject({ duration: 6000, running: true })
  act(() => clock.last().finish())
  expect(card()).toBe('Карточка 2 из 4')
  expect(clock.runs.length).toBe(2)
  expect(clock.last()).toMatchObject({ duration: 6000, running: true })
})

test('«Pause» stops the clock where it is and «Play» runs the rest of the card', async () => {
  const clock = await clocked()
  clock.at(0.5)
  press('Пауза')
  expect(clock.last().running).toBe(false)
  expect(clock.runs.length).toBe(1)
  press('Продолжить')
  expect(clock.runs.length).toBe(2)
  expect(clock.last()).toMatchObject({ duration: 3000, running: true })
  expect(card()).toBe('Карточка 1 из 4')
})

test('a card turned while paused waits at its start', async () => {
  const clock = await clocked()
  press('Пауза')
  press('Дальше')
  expect(card()).toBe('Карточка 2 из 4')
  expect(clock.runs.length).toBe(1)
  press('Продолжить')
  expect(clock.last()).toMatchObject({ duration: 6000, running: true })
})

test('back on the first card starts its time again', async () => {
  const clock = await clocked()
  clock.at(0.5)
  press('Назад')
  expect(card()).toBe('Карточка 1 из 4')
  expect(clock.last()).toMatchObject({ duration: 6000, running: true })
})

test('the last card stays when its time runs out: no close, and nothing left to pause', async () => {
  const closed = vi.fn()
  const clock = await clocked(closed)
  for (let i = 0; i < 4; i++) act(() => clock.last().finish())
  expect(card()).toBe('Карточка 4 из 4')
  expect(clock.runs.length).toBe(4)
  expect(clock.last().running).toBe(false)
  expect(screen.queryByRole('button', { name: 'Пауза' })).toBeNull()
  expect(closed).not.toHaveBeenCalled()
  // Going back brings the clock back with the card.
  press('Назад')
  expect(clock.last()).toMatchObject({ duration: 6000, running: true })
  expect(screen.getByRole('button', { name: 'Пауза' })).toBeTruthy()
})

test('without a clock, back on the first card has nothing to do and says so', () => {
  render(wrap(<TourScreen autoAdvance={false} />))
  expect(screen.getByRole('button', { name: 'Назад' }).getAttribute('aria-disabled')).toBe('true')
  press('Дальше')
  expect(screen.getByRole('button', { name: 'Назад' }).getAttribute('aria-disabled')).not.toBe(
    'true',
  )
})

test('the first screen leads back to the tour where the app wires it', () => {
  const done: string[] = []
  const { rerender } = render(wrap(<WelcomeScreen />))
  expect(screen.queryByText('Знакомство с Buff')).toBeNull()
  rerender(wrap(<WelcomeScreen onTour={() => done.push('tour')} />))
  press('Знакомство с Buff')
  expect(done).toEqual(['tour'])
})
