import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
/*
  One research (#629): its status line with the timer and the pause / stop controls, the
  analyst's pending question, the document, the dialog, and the composer.
*/
import { View } from 'react-native'
import { Button, IconButton } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, Skeleton } from '../../../Feedback.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { ConfirmSheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import { ThreadComposer } from '../attachments.tsx'
import { AskedQuestions, QuestionForm, type Picks } from '../questions.tsx'
import { documentBody, type Research, type ResearchRole } from './model.ts'
import { StatusLine } from './status.tsx'

const ROLE_KEY: Record<ResearchRole, string> = {
  user: 'research.roleUser',
  clarify: 'research.roleClarify',
  analyst: 'research.roleAnalyst',
  review: 'research.roleReview',
  note: 'research.roleNote',
}

export function ResearchScreen({
  status,
  research,
  loading = false,
  error = false,
  canWrite = true,
  draft = '',
  staged = [],
  onAttach,
  onRemoveStaged,
  picks,
  onBack,
  onExport,
  onPause,
  onResume,
  onStop,
  onPick,
  onFree,
  onAnswer,
  onDraft,
  onSend,
  onRetry,
  cost,
  notice,
}: {
  status: InstallStatus
  research?: Research
  loading?: boolean
  error?: LoadFailure
  canWrite?: boolean
  draft?: string
  /** Files for the next turn (#27), and how to add and drop one; no `onAttach` — no paperclip. */
  staged?: Attachment[]
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  picks?: Picks
  onBack?: () => void
  onExport?: () => void
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  onPick?: (questionId: string, option: number) => void
  onFree?: (questionId: string, text: string) => void
  onAnswer?: () => void
  onDraft?: (text: string) => void
  onSend?: () => void
  onRetry?: () => void
  /** What the research cost so far: «12 ₽ · 41 тыс. токенов». */
  cost?: string
  /** Why the run may not go on — the org's spending ceiling. */
  notice?: string
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const title = research?.title ?? t('research.fallbackTitle')
  const busy = research?.status === 'researching'
  const hasDoc = !!research?.document.trim()
  const last = research?.dialog[research.dialog.length - 1]
  const pending = research?.status === 'waiting' && last?.role === 'clarify' ? last : undefined
  const turns = research?.dialog.filter((x) => x !== pending) ?? []
  return (
    <>
      <TopBar
        title={title}
        subtitle={[t('cabinet.researchFull'), cost].filter(Boolean).join(' · ')}
        onBack={onBack}
        actions={
          hasDoc ? (
            <IconButton icon="download" label={t('research.exportTitle')} onPress={onExport} />
          ) : undefined
        }
      />
      <Screen
        footer={
          research && canWrite ? (
            <ThreadComposer
              value={draft}
              placeholder={
                pending ? t('research.answerPlaceholder') : t('research.refinePlaceholder')
              }
              staged={staged}
              canAttach={!!onAttach && staged.length < 3}
              onAttach={onAttach}
              onRemoveStaged={onRemoveStaged}
              busy={busy && !research.paused}
              disabled={!live}
              onValue={onDraft}
              onSend={onSend}
            />
          ) : research ? (
            <Callout tone="neutral">{t('research.noWrite')}</Callout>
          ) : undefined
        }
      >
        <InstallBanner status={status} />
        {loading ? (
          <ListSkeleton rows={5} />
        ) : error || !research ? (
          <LoadError error={error} text={t('research.loadError')} onRetry={onRetry} />
        ) : (
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(2),
              gap: theme.space(3),
            }}
          >
            <StatusLine research={research} canWrite={canWrite} />
            {notice && (
              <Callout tone="warn" icon="zap">
                {notice}
              </Callout>
            )}
            {(busy || research.paused) && (
              <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
                {canWrite && (
                  <Button
                    leadingIcon={research.paused ? 'play' : 'pause'}
                    disabled={!live}
                    onPress={research.paused ? onResume : onPause}
                    style={{ flex: 1 }}
                  >
                    {research.paused ? t('research.resume') : t('research.pause')}
                  </Button>
                )}
                {busy && (
                  <Button
                    variant="danger"
                    leadingIcon="square"
                    disabled={!live}
                    onPress={onStop}
                    style={{ flex: 1 }}
                  >
                    {t('research.stop')}
                  </Button>
                )}
              </View>
            )}
            {pending && (
              <QuestionForm
                title={t('q.analystAsks')}
                questions={pending.questions ?? []}
                picks={picks}
                sendLabel={t('q.answerAnalyst')}
                disabled={!live || !canWrite}
                onPick={onPick}
                onFree={onFree}
                onSend={onAnswer}
              />
            )}
            {hasDoc ? (
              <Card>
                <Prose markdown={documentBody(research.document, title)} />
              </Card>
            ) : (
              !pending && (
                <Card tone="muted" style={{ gap: 8 }}>
                  <Text variant="caption" tone="muted">
                    {t('research.preparing')}
                  </Text>
                  <Skeleton width="90%" />
                  <Skeleton width="70%" />
                  <Skeleton width="80%" />
                </Card>
              )
            )}
            {turns.length > 0 && (
              <Text variant="heading">{`${t('research.dialog')} · ${turns.length}`}</Text>
            )}
            {turns.map((turn) => (
              <View key={turn.id} style={{ gap: 6 }}>
                <Text
                  variant="caption"
                  tone={
                    turn.role === 'user' ? 'primary' : turn.role === 'review' ? 'warning' : 'muted'
                  }
                >
                  {`${t(ROLE_KEY[turn.role])} · ${turn.when}`}
                </Text>
                {turn.role === 'clarify' && turn.questions ? (
                  <AskedQuestions questions={turn.questions} />
                ) : (
                  <Prose markdown={turn.body} />
                )}
              </View>
            ))}
          </View>
        )}
      </Screen>
    </>
  )
}

/** The pause / resume / stop confirmations of a research. */
export function ResearchConfirmSheet({
  action,
  onConfirm,
  onClose,
}: {
  action: 'pause' | 'resume' | 'stop'
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t(`research.${action}Title`)}
      text={t(`research.${action}Text`)}
      confirmLabel={t(`research.${action}`)}
      destructive={action === 'stop'}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
