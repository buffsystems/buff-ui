/** @jsxRuntime automatic */
/*
  The card over the knowledge list (#629): what the AI's last pass did, whether one runs
  now, and the «Refresh now» button.
*/
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { Translate } from '../../../i18n.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { KnowledgePass } from './model.ts'

function boundary(t: Translate, pass: KnowledgePass): string {
  if (pass.boundary === 'audit') return t('kb.boundaryAudit')
  if (pass.boundary === 'manual') return t('kb.boundaryManual', { ref: pass.ref })
  if (pass.outcome === 'rejected') return t('kb.boundaryRejected', { ref: pass.ref })
  if (pass.outcome === 'stopped') return t('kb.boundaryStopped', { ref: pass.ref })
  return t('kb.boundaryTask', { ref: pass.ref })
}

/** The one sentence of the pass card. */
export function passLine(t: Translate, pass?: KnowledgePass): string {
  if (!pass) return t('kb.passNone')
  const b = boundary(t, pass)
  if (pass.paused)
    return t('kb.passPaused', {
      boundary: b,
      line: t('dev.pausedBy', { by: pass.paused.by, when: pass.paused.when }),
    })
  if (pass.status === 'running') return t('kb.passRunning', { boundary: b, when: pass.started })
  const total = pass.added + pass.updated + pass.merged + pass.archived + pass.flagged
  const result =
    pass.status === 'failed'
      ? `${t('kb.passFailed')}${pass.error ? ` — ${pass.error}` : ''}`
      : total === 0
        ? t('kb.noChanges')
        : t('kb.changes', {
            a: pass.added,
            u: pass.updated,
            m: pass.merged,
            ar: pass.archived,
            f: pass.flagged,
          })
  const cost = pass.tokens
    ? ` · ${t('kb.cost', { n: pass.tokens.toLocaleString('ru-RU'), time: pass.time ?? '' })}`
    : ''
  return `${t('kb.passLast', { boundary: b, when: pass.finished ?? '', result })}${cost}`
}

export function KnowledgePassCard({
  pass,
  canRefresh = false,
  lastManual,
  disabled = false,
  onRefresh,
  onPause,
  onResume,
}: {
  pass?: KnowledgePass
  canRefresh?: boolean
  lastManual?: string
  disabled?: boolean
  onRefresh?: () => void
  onPause?: () => void
  onResume?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const running = pass?.status === 'running' && !pass.paused
  // At rest the card is one line that opens (#692): it pushed the entries off the first
  // screen; while a pass runs or waits paused it stays open — that is news.
  const [open, setOpen] = useState(running || !!pass?.paused)
  return (
    <Card style={{ gap: theme.space(2) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t('kb.passTitle')}
        onPress={() => setOpen((was) => !was)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        {running ? (
          <Spinner />
        ) : (
          <Icon name={pass?.paused ? 'pause' : 'zap'} size={18} color={theme.colors.primary} />
        )}
        <Text variant="label" style={{ flex: 1 }}>
          {t('kb.passTitle')}
        </Text>
        {pass?.paused && <Badge tone="warn">{t('dev.paused')}</Badge>}
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={18}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open && (
        <>
          <Text variant="caption" tone="fg2">
            {passLine(t, pass)}
          </Text>
          {(running || pass?.paused) && (onPause || onResume) && (
            <Button
              size="sm"
              leadingIcon={pass?.paused ? 'play' : 'pause'}
              disabled={disabled}
              onPress={pass?.paused ? onResume : onPause}
            >
              {pass?.paused ? t('research.resume') : t('research.pause')}
            </Button>
          )}
          {canRefresh && (
            <View style={{ gap: 4 }}>
              <Button
                size="sm"
                leadingIcon="refreshCw"
                disabled={disabled || running}
                onPress={onRefresh}
              >
                {t('kb.refresh')}
              </Button>
              <Text variant="caption" tone="muted">
                {`${t('kb.refreshHint')} ${lastManual ? t('kb.lastManual', { when: lastManual }) : t('kb.noManual')}`}
              </Text>
            </View>
          )}
        </>
      )}
    </Card>
  )
}
