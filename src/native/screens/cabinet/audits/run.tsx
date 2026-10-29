/** @jsxRuntime automatic */
/*
  Running an audit (#629): the pick sheet with its confirm step, the paused-run card, the
  pause / resume / cancel confirmations, and the export sheet.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Icon } from '../../../Icon.tsx'
import { Row, RowGroup } from '../../../Row.tsx'
import { ConfirmSheet, Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { type AuditRun, type AuditSection } from './model.ts'

export function PausedRunCard({
  run,
  sections,
  disabled = false,
  onResume,
  onCancel,
}: {
  run: AuditRun
  sections: AuditSection[]
  disabled?: boolean
  onResume?: () => void
  onCancel?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const titles = run.sectionIds
    .map((id) => sections.find((s) => s.id === id)?.title ?? id)
    .join(', ')
  return (
    <Card style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="pause" size={18} color={theme.colors.warning} />
        <Text variant="label" style={{ flex: 1 }}>
          {t('audit.pausedTitle')}
        </Text>
        <Badge tone="warn">{t('dev.paused')}</Badge>
      </View>
      <Text variant="caption" tone="muted">
        {`${t('audit.pausedSections', { titles })} · ${t('dev.pausedBy', { by: run.paused?.by ?? '', when: run.paused?.when ?? '' })}`}
      </Text>
      <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
        <Button
          size="sm"
          variant="primary"
          leadingIcon="play"
          disabled={disabled}
          onPress={onResume}
        >
          {t('audit.resume')}
        </Button>
        <Button
          size="sm"
          variant="danger"
          leadingIcon="square"
          disabled={disabled}
          onPress={onCancel}
        >
          {t('audit.cancel')}
        </Button>
      </View>
    </Card>
  )
}

export function AuditRunConfirmSheet({
  action,
  onConfirm,
  onClose,
}: {
  action: 'pause' | 'resume' | 'cancel'
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t(`audit.${action}Title`)}
      text={t(`audit.${action}Text`)}
      confirmLabel={action === 'cancel' ? t('audit.cancelConfirm') : t(`audit.${action}`)}
      destructive={action === 'cancel'}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}

/** Export: the section or the whole audit, as PDF or Markdown, saved to the phone. */
export function AuditExportSheet({
  section,
  collecting,
  onSectionPdf,
  onSectionMd,
  onAllPdf,
  onAllMd,
  onClose,
}: {
  /** The open section's title, when one is open and exportable. */
  section?: string
  /** «Collecting 3/10» while the digest is built. */
  collecting?: { done: number; total: number }
  onSectionPdf?: () => void
  onSectionMd?: () => void
  onAllPdf?: () => void
  onAllMd?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const busy = !!collecting
  return (
    <Sheet title={t('cabinet.export')} onClose={onClose}>
      {section && (
        <RowGroup title={section}>
          <Row
            icon="fileText"
            title={t('devt.exportPdf')}
            subtitle={t('cabinet.saveToPhone')}
            onPress={onSectionPdf}
            chevron
          />
          <Row
            icon="download"
            title={t('devt.exportMd')}
            subtitle={t('cabinet.saveToPhone')}
            onPress={onSectionMd}
            chevron
          />
        </RowGroup>
      )}
      <RowGroup title={t('audit.exportAll')}>
        <Row
          icon="fileText"
          title={t('devt.exportPdf')}
          subtitle={busy ? t('audit.collecting', collecting) : t('cabinet.saveToPhone')}
          onPress={onAllPdf}
          disabled={busy}
          chevron
        />
        <Row
          icon="download"
          title={t('devt.exportMd')}
          subtitle={busy ? t('audit.collecting', collecting) : t('cabinet.saveToPhone')}
          onPress={onAllMd}
          disabled={busy}
          chevron
        />
      </RowGroup>
    </Sheet>
  )
}
