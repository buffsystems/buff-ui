// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'
import { Button, CardDescription, CardHeader, CardTitle } from '../src/react/index.ts'
import { cssRule } from './css-rule.ts'

afterEach(cleanup)

const rule = (selector: string): string => cssRule('card.css', selector)

describe('CardHeader', () => {
  test('without an action it is the plain header: its children directly inside', () => {
    render(
      <CardHeader data-testid="h" className="gap-1">
        <CardTitle>Машины</CardTitle>
      </CardHeader>,
    )
    const header = screen.getByTestId('h')
    expect(header.className).toBe('ui-card__header gap-1')
    expect(header.firstElementChild?.className).toBe('ui-card__title')
  })

  test('an action puts the text in the heading and the controls beside it, in that order', () => {
    render(
      <CardHeader data-testid="h" action={<Button size="sm">Опросить</Button>}>
        <CardTitle>Машины</CardTitle>
        <CardDescription>3 шт.</CardDescription>
      </CardHeader>,
    )
    const header = screen.getByTestId('h')
    expect(header.className).toBe('ui-card__header ui-card__header--action')
    const [heading, action] = [...header.children]
    expect(heading.className).toBe('ui-card__heading')
    expect([...heading.children].map((c) => c.className)).toEqual([
      'ui-card__title',
      'ui-card__description',
    ])
    expect(action.className).toBe('ui-card__action')
    expect(action.contains(screen.getByRole('button', { name: 'Опросить' }))).toBe(true)
  })

  test('a conditional action that is not there leaves the plain header', () => {
    render(
      <CardHeader data-testid="h" action={false}>
        <CardTitle>Машины</CardTitle>
      </CardHeader>,
    )
    expect(screen.getByTestId('h').className).toBe('ui-card__header')
  })
})

describe('card header CSS contract', () => {
  test('text on the left, controls on the right, controls wrap under a text too wide for both', () => {
    const header = rule('.ui-card__header--action')
    expect(header).toMatch(/flex-direction:\s*row/)
    expect(header).toMatch(/flex-wrap:\s*wrap/)
    expect(header).toMatch(/justify-content:\s*space-between/)
    const heading = rule('.ui-card__heading')
    expect(heading).toMatch(/flex:\s*1 1 16rem/)
    expect(heading).toMatch(/min-width:\s*0/)
    expect(rule('.ui-card__action')).toMatch(/flex-wrap:\s*wrap/)
  })
})
