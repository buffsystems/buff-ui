/** @jsxRuntime automatic */
import { Lock, Play, PowerOff, ShieldCheck, Smartphone } from 'lucide-react'
import { Button } from '../Button.tsx'
import { Callout } from '../Callout.tsx'
import { Segmented } from '../Chip.tsx'
import { CopyField } from '../CopyField.tsx'
import { Field } from '../Field.tsx'
import type { BlockReason, Locale, PairingPhase } from './model.ts'
import { QrCode } from './QrCode.tsx'
import { formatSeconds, tr } from './strings.ts'
import { useLocale } from '../locale.tsx'

export type PairingMode = 'qr' | 'link'

/**
 * The pairing panel a cabinet and Buff Code share: the offer as a QR or as a link + code,
 * the SAS to confirm once a phone claimed it, the paired / expired / blocked outcomes.
 */
export function PairingPanel({
  phase,
  mode = 'qr',
  locale: localeProp,
  onModeChange,
  onNewOffer,
  onConfirmSas,
  onRejectSas,
  onStartService,
}: {
  phase: PairingPhase
  mode?: PairingMode
  locale?: Locale
  onModeChange?: (mode: PairingMode) => void
  onNewOffer?: () => void
  onConfirmSas?: () => void
  onRejectSas?: () => void
  onStartService?: () => void
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  switch (phase.kind) {
    case 'offer':
      return (
        <div className="ui-pairing">
          <Segmented<PairingMode>
            label={t('modeQr')}
            value={mode}
            onChange={(id) => onModeChange?.(id)}
            options={[
              { id: 'qr', label: t('modeQr') },
              { id: 'link', label: t('modeLink') },
            ]}
          />
          {/* A QR offer has no code, a link one has (#670): right after the switch the phase still
              holds the other mode's offer — show neither its link nor its QR. */}
          {(mode === 'link') !== (phase.offer.code !== '') ? (
            <p className="ui-hint">{t('preparing')}</p>
          ) : mode === 'qr' ? (
            <div className="ui-pairing__offer">
              <QrCode value={phase.offer.link} label={t('modeQr')} />
              <div className="ui-pairing__aside">
                <p className="ui-note">{t('scanHint')}</p>
                <p className="ui-hint">{t('expiresIn', { s: formatSeconds(phase.secondsLeft) })}</p>
              </div>
            </div>
          ) : (
            <div className="ui-pairing__offer ui-pairing__offer--link">
              <Field label={t('link')} hint={t('linkHint')}>
                <CopyField
                  value={phase.offer.link}
                  copyLabel={t('copy')}
                  copiedLabel={t('copied')}
                />
              </Field>
              <Field
                label={t('code')}
                hint={t('expiresIn', { s: formatSeconds(phase.secondsLeft) })}
              >
                <div className="ui-pairing__code" aria-label={phase.offer.code}>
                  {phase.offer.code.slice(0, 4)}
                  <span className="ui-pairing__code-gap" />
                  {phase.offer.code.slice(4)}
                </div>
              </Field>
            </div>
          )}
        </div>
      )
    case 'claimed':
      return (
        <div className="ui-pairing">
          {mode === 'link' && (
            <div className="ui-pairing__sas" aria-label={phase.sas}>
              {phase.sas.slice(0, 3)} {phase.sas.slice(3)}
            </div>
          )}
          <p className="ui-title">{t(mode === 'link' ? 'sasTitle' : 'qrConfirmTitle')}</p>
          <p className="ui-note">
            {t(mode === 'link' ? 'sasText' : 'qrConfirmText', { device: phase.device.name })}
          </p>
          <div className="ui-pairing__actions">
            <Button variant="primary" leadingIcon={ShieldCheck} onClick={onConfirmSas}>
              {t(mode === 'link' ? 'sasMatch' : 'qrConfirm')}
            </Button>
            <Button variant="ghost" onClick={onRejectSas}>
              {t('sasMismatch')}
            </Button>
          </div>
        </div>
      )
    case 'paired':
      return (
        <Callout
          tone="ok"
          icon={Smartphone}
          title={t('pairedTitle')}
          action={
            <Button size="sm" onClick={onNewOffer}>
              {t('pairAnother')}
            </Button>
          }
        >
          {t('pairedText', { device: phase.device.name })}
        </Callout>
      )
    case 'expired':
      return (
        <Callout
          tone="warn"
          title={t('expired')}
          action={
            <Button size="sm" variant="primary" onClick={onNewOffer}>
              {t('newCode')}
            </Button>
          }
        >
          {t('expiredText')}
        </Callout>
      )
    case 'blocked':
      return <Blocked reason={phase.reason} locale={locale} onStartService={onStartService} />
  }
}

function Blocked({
  reason,
  locale,
  onStartService,
}: {
  reason: BlockReason
  locale: Locale
  onStartService?: () => void
}) {
  const t = tr(locale)
  switch (reason) {
    case 'org':
      return (
        <Callout tone="crit" icon={Lock} title={t('blockedOrg')}>
          {t('blockedOrgText')}
        </Callout>
      )
    case 'ee':
      return (
        <Callout tone="crit" icon={ShieldCheck} title={t('blockedEe')}>
          {t('blockedEeText')}
        </Callout>
      )
    case 'disabled':
      return (
        <Callout tone="neutral" icon={PowerOff} title={t('blockedDisabled')}>
          {t('blockedDisabledText')}
        </Callout>
      )
    default:
      return (
        <Callout
          tone="warn"
          title={t('serviceDown')}
          action={
            onStartService && (
              <Button size="sm" variant="primary" leadingIcon={Play} onClick={onStartService}>
                {t('startService')}
              </Button>
            )
          }
        >
          {t('serviceDownText')}
          {!onStartService && (
            <>
              {' '}
              {t('startServiceBy')} <code>buff service start</code>
            </>
          )}
        </Callout>
      )
  }
}
