/** @jsxRuntime automatic */
/*
  What the base adds to every run (#648, the web's prompt-load line): how many entries the model
  gets whole and roughly how many tokens that is; it opens to the heaviest of them.
*/
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '../../../Icon.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'

export interface PromptLoad {
  /** The project the figure is for. */
  project: string
  pinned: number
  total: number
  tokens: number
  /** Entries held on single tasks — outside «every run». */
  taskEntries: number
  heaviest: { id: string; title: string; scope: string; tokens: number }[]
}

const n = (x: number) => x.toLocaleString('ru-RU')

export function PromptLoadLine({ load }: { load: PromptLoad }) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.muted,
        padding: theme.space(3),
        gap: theme.space(2),
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={{ flexDirection: 'row', gap: 8 }}
      >
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={16}
          color={theme.colors.mutedForeground}
        />
        <Text variant="caption" tone="fg2" style={{ flex: 1 }}>
          {[
            t('kb.loadLine', {
              project: load.project,
              pinned: n(load.pinned),
              total: n(load.total),
              tokens: n(load.tokens),
            }),
            load.taskEntries > 0 ? t('kb.loadTasks', { n: n(load.taskEntries) }) : '',
          ]
            .filter(Boolean)
            .join(' ')}
        </Text>
      </Pressable>
      {open && (
        <View
          style={{
            gap: 4,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingTop: theme.space(2),
          }}
        >
          {load.heaviest.length === 0 ? (
            <Text variant="caption" tone="muted">
              {t('kb.loadNone')}
            </Text>
          ) : (
            load.heaviest.map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
                <Text variant="caption" style={{ flex: 1 }} numberOfLines={2}>
                  {`${e.title} · ${e.scope}`}
                </Text>
                <Text variant="mono" tone="muted">
                  {t('kb.loadItem', { n: n(e.tokens) })}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  )
}
