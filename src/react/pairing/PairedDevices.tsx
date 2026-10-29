/** @jsxRuntime automatic */
import { Pencil, Unplug } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../Badge.tsx'
import { ConfirmDialog } from '../ConfirmDialog.tsx'
import { IconButton } from '../IconButton.tsx'
import { StatusDot } from '../StatusDot.tsx'
import { Table } from '../Table.tsx'
import type { DeviceStatus, Locale, PairedDevice } from './model.ts'
import { tr } from './strings.ts'
import { useLocale } from '../locale.tsx'

const TONE: Record<DeviceStatus, 'ok' | 'neutral' | 'crit'> = {
  online: 'ok',
  offline: 'neutral',
  revoked: 'crit',
}

/**
 * The paired phones as a table: a person's own, the organisation's (owner) or every user's
 * (admin). Disconnect asks first — it drops the live connection and wipes the phone's copy.
 */
export function PairedDevices({
  devices,
  scope = 'mine',
  locale: localeProp,
  readOnly = false,
  onRename,
  onDisconnect,
}: {
  devices: PairedDevice[]
  /** `mine` hides the user column; `org` / `all` show it. */
  scope?: 'mine' | 'org' | 'all'
  locale?: Locale
  readOnly?: boolean
  onRename?: (id: string) => void
  onDisconnect?: (id: string) => void
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  const [confirm, setConfirm] = useState<PairedDevice | null>(null)
  const withUser = scope !== 'mine'
  if (devices.length === 0) return <p className="ui-note">{t('devicesEmpty')}</p>
  return (
    <>
      <Table
        framed
        aria-label={t(
          scope === 'mine' ? 'devicesMine' : scope === 'org' ? 'devicesOrg' : 'devicesAll',
        )}
      >
        <thead>
          <tr>
            <th>{t('colDevice')}</th>
            {withUser && <th>{t('colUser')}</th>}
            <th>{t('colPaired')}</th>
            <th>{t('colSeen')}</th>
            <th>{t('colStatus')}</th>
            {!readOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td>
                <div className="ui-pairing__device">
                  <StatusDot tone={TONE[d.status]} pulse={d.status === 'online'} />
                  <div>
                    <div>{d.name}</div>
                    <div className="ui-hint">{d.model}</div>
                  </div>
                </div>
              </td>
              {withUser && <td>{d.user}</td>}
              <td className="ui-table__muted">{d.pairedAt}</td>
              <td className="ui-table__muted">{d.lastSeen}</td>
              <td>
                <Badge tone={TONE[d.status]}>{t(d.status)}</Badge>
              </td>
              {!readOnly && (
                <td className="ui-table__num">
                  <span className="ui-pairing__row-actions">
                    {onRename && (
                      <IconButton
                        icon={Pencil}
                        aria-label={t('rename')}
                        size="sm"
                        onClick={() => onRename(d.id)}
                      />
                    )}
                    <IconButton
                      icon={Unplug}
                      aria-label={t('disconnect')}
                      size="sm"
                      disabled={d.status === 'revoked'}
                      onClick={() => setConfirm(d)}
                    />
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <ConfirmDialog
        open={confirm !== null}
        title={t('disconnectTitle', { device: confirm?.name ?? '' })}
        message={t('disconnectText')}
        confirmLabel={t('disconnect')}
        cancelLabel={t('cancel')}
        danger
        onConfirm={() => {
          if (confirm) onDisconnect?.(confirm.id)
          setConfirm(null)
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}
