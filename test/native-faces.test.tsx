// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Platform } from 'react-native'
import {
  faceWeight,
  ICON_NAMES,
  NATIVE_FACES,
  NativeProvider,
  Text,
  type IconSet,
} from '../src/native/index.ts'
import { tokens } from '../src/tokens/tokens.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

describe('a weight is its own face on a phone (#692)', () => {
  test('any style weight lands on one of the four files', () => {
    expect(faceWeight(undefined)).toBe('400')
    expect(faceWeight('normal')).toBe('400')
    expect(faceWeight('300')).toBe('400')
    expect(faceWeight(500)).toBe('500')
    expect(faceWeight('600')).toBe('600')
    expect(faceWeight('bold')).toBe('700')
    expect(faceWeight('900')).toBe('700')
  })

  test('the 400 faces are the families the tokens already name', () => {
    expect(NATIVE_FACES.sans['400']).toBe(tokens.fonts.sans.family)
    expect(NATIVE_FACES.mono['400']).toBe(tokens.fonts.mono.family)
  })

  test('on a phone a title is the bold file, and a style weight overrides the variant', () => {
    const was = Platform.OS
    Object.defineProperty(Platform, 'OS', { value: 'ios', configurable: true })
    try {
      render(
        <NativeProvider icons={icons}>
          <Text variant="title">Заголовок</Text>
          <Text style={{ fontWeight: '600' }}>Жирный</Text>
          <Text variant="mono">abc</Text>
        </NativeProvider>,
      )
      expect(screen.getByText('Заголовок').style.fontFamily).toBe('Geist-Bold')
      expect(screen.getByText('Жирный').style.fontFamily).toBe('Geist-SemiBold')
      expect(screen.getByText('abc').style.fontFamily).toBe('Geist Mono')
    } finally {
      Object.defineProperty(Platform, 'OS', { value: was, configurable: true })
    }
  })
})
