/** @jsxRuntime automatic */
import { useState } from 'react'
import { Badge } from '../Badge.tsx'
import { Callout } from '../Callout.tsx'
import { ConfirmDialog } from '../ConfirmDialog.tsx'
import { Field } from '../Field.tsx'
import { RadioGroup, RadioItem } from '../RadioGroup.tsx'
import { Switch } from '../Switch.tsx'
import type {
  AuditEntry,
  AffectedMachine,
  Locale,
  MobilePolicy,
  PairingPolicy,
  PushMode,
} from './model.ts'
import { Table } from '../Table.tsx'
import { tr } from './strings.ts'
import { useLocale } from '../locale.tsx'

/**
 * The Enterprise admin's settings of the mobile app: on/off, who may pair, push mode.
 * Choosing «forbidden» asks first — it tears down every pairing, Buff Code's included.
 */
export function MobilePolicyForm({
  policy,
  availableRoles,
  locale: localeProp,
  onChange,
}: {
  policy: MobilePolicy
  availableRoles: string[]
  locale?: Locale
  onChange?: (policy: MobilePolicy) => void
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  const [asking, setAsking] = useState(false)
  const set = (patch: Partial<MobilePolicy>) => onChange?.({ ...policy, ...patch })
  const off = !policy.enabled
  return (
    <div className="ui-pairing__form">
      <label className="ui-pairing__policy">
        <Switch
          checked={policy.enabled}
          aria-label={t('adminEnabled')}
          onCheckedChange={(enabled) => set({ enabled })}
        />
        <span>
          <span className="ui-pairing__policy-title">{t('adminEnabled')}</span>
          <span className="ui-hint">{t('adminEnabledHint')}</span>
        </span>
      </label>
      <Field label={t('adminPairing')} group>
        <RadioGroup
          aria-label={t('adminPairing')}
          value={policy.pairing}
          disabled={off}
          onValueChange={(v) =>
            v === 'forbidden' ? setAsking(true) : set({ pairing: v as PairingPolicy })
          }
        >
          <RadioItem value="all" label={t('pairingAll')} />
          <RadioItem value="roles" label={t('pairingRoles')} />
          <RadioItem
            value="forbidden"
            label={t('pairingForbidden')}
            hint={t('pairingForbiddenHint')}
          />
        </RadioGroup>
      </Field>
      {policy.pairing === 'roles' && !off && (
        <div className="ui-chip-row" role="group" aria-label={t('pairingRoles')}>
          {availableRoles.map((role) => {
            const on = policy.roles.includes(role)
            return (
              <button
                key={role}
                type="button"
                className="ui-chip"
                aria-pressed={on}
                onClick={() =>
                  set({
                    roles: on ? policy.roles.filter((r) => r !== role) : [...policy.roles, role],
                  })
                }
              >
                {role}
              </button>
            )
          })}
        </div>
      )}
      {policy.pairing === 'forbidden' && !off && (
        <Callout tone="crit" compact>
          {t('blockedEeText')}
        </Callout>
      )}
      <Field label={t('adminPush')} group>
        <RadioGroup
          aria-label={t('adminPush')}
          value={policy.push}
          disabled={off}
          onValueChange={(v) => set({ push: v as PushMode })}
        >
          <RadioItem value="off" label={t('pushOff')} />
          <RadioItem
            value="gateway"
            label={t('pushGateway')}
            hint={t('pushGatewayHint', { address: policy.gatewayAddress })}
          />
        </RadioGroup>
      </Field>
      <ConfirmDialog
        open={asking}
        title={t('orgPolicyConfirmTitle')}
        message={t('orgPolicyConfirmText')}
        confirmLabel={t('orgPolicyConfirm')}
        cancelLabel={t('cancel')}
        danger
        onConfirm={() => {
          setAsking(false)
          set({ pairing: 'forbidden' })
        }}
        onCancel={() => setAsking(false)}
      />
    </div>
  )
}

/** Buff Code machines signed into the install — the policy reaches them too. */
export function AffectedMachines({
  machines,
  locale: localeProp,
}: {
  machines: AffectedMachine[]
  locale?: Locale
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  return (
    <Table framed compact aria-label={t('affected')}>
      <thead>
        <tr>
          <th>{t('colMachine')}</th>
          <th>{t('colUser')}</th>
          <th className="ui-table__num">{t('colPhones')}</th>
          <th>{t('colSeen')}</th>
        </tr>
      </thead>
      <tbody>
        {machines.map((m) => (
          <tr key={m.host}>
            <td>{m.host}</td>
            <td>{m.user}</td>
            <td className="ui-table__num">
              {m.phones ? <Badge tone="info">{m.phones}</Badge> : '—'}
            </td>
            <td className="ui-table__muted">{m.lastSeen}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

/** The audit log of mobile access: pairings, revocations, policy changes. */
export function MobileAuditLog({
  entries,
  locale: localeProp,
}: {
  entries: AuditEntry[]
  locale?: Locale
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  return (
    <Table framed compact aria-label={t('audit')}>
      <thead>
        <tr>
          <th>{t('colWhen')}</th>
          <th>{t('colWho')}</th>
          <th>{t('colWhat')}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e, i) => (
          <tr key={i}>
            <td className="ui-table__muted">{e.when}</td>
            <td>{e.who}</td>
            <td>{e.what}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
