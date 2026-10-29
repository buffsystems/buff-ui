/** @jsxRuntime automatic */
import { Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../Button.tsx'
import { Callout } from '../Callout.tsx'
import { ConfirmDialog } from '../ConfirmDialog.tsx'
import { Switch } from '../Switch.tsx'
import type { Locale, PairingRequest } from './model.ts'
import { tr } from './strings.ts'
import { useLocale } from '../locale.tsx'

/**
 * The organisation owner's switch (SaaS): forbid phones for everyone. Turning it on asks
 * first — it tears down every pairing, including employees' Buff Code signed into the org.
 */
export function OrgPhonePolicy({
  forbidden,
  locale: localeProp,
  busy = false,
  onChange,
}: {
  forbidden: boolean
  locale?: Locale
  busy?: boolean
  onChange?: (forbidden: boolean) => void
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  const [asking, setAsking] = useState(false)
  return (
    <>
      <label className="ui-pairing__policy">
        <Switch
          checked={forbidden}
          disabled={busy}
          aria-label={t('orgPolicyTitle')}
          onCheckedChange={(next) => (next ? setAsking(true) : onChange?.(false))}
        />
        <span>
          <span className="ui-pairing__policy-title">{t('orgPolicyTitle')}</span>
          <span className="ui-hint">{t('orgPolicyText')}</span>
        </span>
      </label>
      <ConfirmDialog
        open={asking}
        title={t('orgPolicyConfirmTitle')}
        message={t('orgPolicyConfirmText')}
        confirmLabel={t('orgPolicyConfirm')}
        cancelLabel={t('cancel')}
        danger
        busy={busy}
        onConfirm={() => {
          setAsking(false)
          onChange?.(true)
        }}
        onCancel={() => setAsking(false)}
      />
    </>
  )
}

/** A phone asking to pair, when the policy wants the person to confirm it first. */
export function PairingRequestCard({
  request,
  locale: localeProp,
  onAllow,
  onDeny,
}: {
  request: PairingRequest
  locale?: Locale
  onAllow?: () => void
  onDeny?: () => void
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  return (
    <Callout
      tone="info"
      icon={Smartphone}
      title={t('requestTitle')}
      role="alert"
      action={
        <span className="ui-pairing__actions">
          <Button size="sm" variant="primary" onClick={onAllow}>
            {t('requestAllow')}
          </Button>
          <Button size="sm" variant="ghost" onClick={onDeny}>
            {t('requestDeny')}
          </Button>
        </span>
      }
    >
      {t('requestText', {
        device: `${request.device.name} · ${request.device.model}`,
        user: request.user,
      })}
      <span className="ui-hint"> · {request.requestedAt}</span>
    </Callout>
  )
}
