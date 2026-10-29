/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from 'react-native'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/**
  The frame of a field draws its focus ring; on the web the browser's own outline would
  draw a second one inside it. `none` is a web value React Native's types do not list.
*/
export const NO_WEB_OUTLINE: TextStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : {}

/** A labelled control with an optional hint or error under it. */
export function Field({
  label,
  hint,
  error,
  required = false,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text variant="label">
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
      {error ? (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  )
}

export interface InputProps extends TextInputProps {
  icon?: IconName
  invalid?: boolean
  /** Multi-line text: a composer, a knowledge entry. */
  rows?: number
}

/** The edge of a field: red when invalid, the focus ring while typing, else a strong edge. */
function fieldEdge(
  c: { destructive: string; ring: string; borderStrong: string },
  invalid: boolean,
  focused: boolean,
): string {
  if (invalid) return c.destructive
  return focused ? c.ring : c.borderStrong
}

export function Input({
  icon,
  invalid = false,
  rows,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme()
  const c = theme.colors
  const [focused, setFocused] = useState(false)
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: rows ? 'flex-start' : 'center',
        gap: theme.space(2),
        minHeight: theme.touch,
        paddingHorizontal: theme.space(3),
        paddingVertical: rows ? theme.space(2) : 0,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: fieldEdge(c, invalid, focused),
        backgroundColor: c.card,
        boxShadow: focused && !invalid ? `0 0 0 3px ${c.ring}33` : undefined,
      }}
    >
      {icon && (
        <View style={{ paddingTop: rows ? 4 : 0 }}>
          <Icon name={icon} size={18} color={c.mutedForeground} />
        </View>
      )}
      <TextInput
        placeholderTextColor={c.mutedForeground}
        multiline={!!rows}
        numberOfLines={rows}
        {...props}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        style={[
          {
            flex: 1,
            fontFamily: theme.font.sans,
            fontSize: theme.text.body.fontSize,
            lineHeight: theme.text.body.lineHeight,
            color: c.foreground,
            ...NO_WEB_OUTLINE,
            minHeight: rows ? rows * theme.text.body.lineHeight : undefined,
            textAlignVertical: rows ? 'top' : 'center',
          },
          style,
        ]}
      />
    </View>
  )
}

/** A picker that looks like an input and opens a sheet: project, model, period. */
export function SelectField({
  value,
  placeholder,
  icon,
  onPress,
  invalid = false,
  disabled = false,
}: {
  value?: string
  placeholder: string
  icon?: IconName
  onPress?: () => void
  invalid?: boolean
  disabled?: boolean
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ?? placeholder}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        minHeight: theme.touch,
        paddingHorizontal: theme.space(3),
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: fieldEdge(c, invalid, false),
        backgroundColor: c.card,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {icon && <Icon name={icon} size={18} color={c.mutedForeground} />}
      <Text style={{ flex: 1 }} tone={value ? 'fg' : 'muted'} numberOfLines={1}>
        {value ?? placeholder}
      </Text>
      <Icon name="chevronDown" size={18} color={c.mutedForeground} />
    </Pressable>
  )
}

/** Two to four exclusive options in one control: a period, a view. */
export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange?: (id: string) => void
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        padding: 3,
        borderRadius: theme.radius.md,
        backgroundColor: c.muted2,
        gap: 2,
      }}
    >
      {options.map((option) => {
        const active = option.id === value
        return (
          <Pressable
            key={option.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange?.(option.id)}
            style={{
              flex: 1,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radius.sm,
              backgroundColor: active ? c.card : 'transparent',
              ...(active ? theme.raised : {}),
            }}
          >
            <Text variant="label" tone={active ? 'fg' : 'muted'} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
