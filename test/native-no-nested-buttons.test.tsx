// @vitest-environment jsdom
/// <reference types="vite/client" />
// Every phone scene, every state: no button inside a button (#692). A screen reader hears the
// outer one only — the inner is out of reach — and a tap on the inner fires both.
import { afterEach, expect, test } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { composeStories } from '@storybook/react-vite'
import type { ComponentType } from 'react'

afterEach(cleanup)

const modules = import.meta.glob('../stories/mobile/*.stories.tsx', { eager: true })

const scenes = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(composeStories(mod as Parameters<typeof composeStories>[0])).map(
    ([name, Story]) => ({
      id: `${file.replace(/.*\//, '')} ${name}`,
      Story: Story as ComponentType,
    }),
  ),
)

test.each(scenes)('$id', ({ Story }) => {
  const { container } = render(<Story />)
  const nested = [...container.querySelectorAll('[role="button"] [role="button"]')].map(
    (el) => el.getAttribute('aria-label') ?? el.textContent,
  )
  expect(nested).toEqual([])
})
