/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { TextInput, View } from 'react-native'
import { Icon } from './Icon.tsx'
import { Text } from './Text.tsx'
import { QR_CELLS, qrRows } from '../shared/qr-pattern.ts'
import { useTheme } from './theme.tsx'

/**
 * The 8-character pairing code, grouped 4+4, as the person types it or reads it back. With
 * `onChange` it is typeable: an invisible field over the cells takes the keyboard.
 */
export function CodeInput({
  value,
  length = 8,
  invalid = false,
  onChange,
  editable = true,
}: {
  value: string
  length?: number
  invalid?: boolean
  onChange?: (value: string) => void
  editable?: boolean
}) {
  const theme = useTheme()
  const c = theme.colors
  const cells = Array.from({ length }, (_, i) => value[i] ?? '')
  return (
    <View
      accessibilityLabel={value}
      style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}
    >
      {onChange && (
        <TextInput
          value={value}
          onChangeText={(text) =>
            onChange(
              text
                .toUpperCase()
                .replace(/[^0-9A-Z]/g, '')
                .slice(0, length),
            )
          }
          editable={editable}
          autoCapitalize="characters"
          autoCorrect={false}
          caretHidden
          contextMenuHidden
          maxLength={length + 2}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0,
            zIndex: 1,
          }}
        />
      )}
      {cells.map((ch, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {i === length / 2 && <View style={{ width: 8 }} />}
          <View
            style={{
              width: 34,
              height: 44,
              borderRadius: theme.radius.sm,
              borderWidth: 1.5,
              borderColor: invalid ? c.destructive : ch ? c.primary : c.borderStrong,
              backgroundColor: c.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="mono" style={{ fontSize: 20, lineHeight: 24, fontWeight: '600' }}>
              {ch}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** The short authentication string both sides show after the handshake: six digits, big. */
export function SasCode({ value }: { value: string }) {
  const theme = useTheme()
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.space(2) }}>
      <Text
        variant="mono"
        style={{ fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: 6 }}
      >
        {value.slice(0, 3)} {value.slice(3)}
      </Text>
    </View>
  )
}

/** The camera view with the scan window; the camera itself is the host's — this is the frame. */
export function ScannerFrame({
  hint,
  found = false,
  camera,
}: {
  hint: string
  found?: boolean
  /** The host's live camera, drawn under the frame. */
  camera?: ReactNode
}) {
  const theme = useTheme()
  const c = theme.colors
  const corner = {
    position: 'absolute' as const,
    width: 28,
    height: 28,
    borderColor: found ? c.success : '#ffffff',
  }
  const w = 3
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b0d12',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(6),
      }}
    >
      {camera && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{camera}</View>
      )}
      <View style={{ width: 240, height: 240 }}>
        <View
          style={[
            corner,
            { top: 0, left: 0, borderTopWidth: w, borderLeftWidth: w, borderTopLeftRadius: 12 },
          ]}
        />
        <View
          style={[
            corner,
            { top: 0, right: 0, borderTopWidth: w, borderRightWidth: w, borderTopRightRadius: 12 },
          ]}
        />
        <View
          style={[
            corner,
            {
              bottom: 0,
              left: 0,
              borderBottomWidth: w,
              borderLeftWidth: w,
              borderBottomLeftRadius: 12,
            },
          ]}
        />
        <View
          style={[
            corner,
            {
              bottom: 0,
              right: 0,
              borderBottomWidth: w,
              borderRightWidth: w,
              borderBottomRightRadius: 12,
            },
          ]}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
          <Icon name="qrCode" size={120} color="#ffffff" strokeWidth={1} />
        </View>
      </View>
      <Text align="center" style={{ color: '#ffffff', paddingHorizontal: theme.space(8) }}>
        {hint}
      </Text>
    </View>
  )
}

/** A QR code stand-in for the showcase: the real app renders a real code. */
export function QrPlaceholder({ size = 200, label }: { size?: number; label?: string }) {
  const theme = useTheme()
  const rows = qrRows()
  const cell = size / (QR_CELLS + 2)
  return (
    <View accessibilityLabel={label ?? 'QR'} style={{ alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: '#ffffff',
          padding: cell,
          borderRadius: theme.radius.md,
        }}
      >
        {rows.map((row, y) => (
          <View key={y} style={{ flexDirection: 'row' }}>
            {row.map((on, x) => (
              <View
                key={x}
                style={{ width: cell, height: cell, backgroundColor: on ? '#0b0d12' : '#ffffff' }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
