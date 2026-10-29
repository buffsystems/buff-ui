/** @jsxRuntime automatic */
import { Cpu, Globe, Smartphone, TerminalSquare } from 'lucide-react'
import { Badge } from '../Badge.tsx'
import { Callout } from '../Callout.tsx'
import type { BuffCodeHome, Locale } from './model.ts'
import { qrAscii } from '../../shared/qr-pattern.ts'
import { tr } from './strings.ts'
import { useLocale } from '../locale.tsx'

/** The line over Buff Code's phone settings: standalone, or signed into an install. */
export function BuffCodeHomeNote({
  home,
  locale: localeProp,
}: {
  home: BuffCodeHome
  locale?: Locale
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  if (home.kind === 'standalone') {
    return (
      <Callout tone="neutral" icon={Cpu} title={t('bcStandalone')} compact>
        {t('bcStandaloneText')}
      </Callout>
    )
  }
  return (
    <Callout
      tone={home.policyForbids ? 'crit' : 'info'}
      icon={Globe}
      title={t('bcSignedIn', { install: home.install })}
      compact
    >
      {home.policyForbids ? t('blockedEeText') : t('bcSignedInText')}
    </Callout>
  )
}

/** The console's `/phone` dialog, as the TUI draws it: the QR as block art, the code, the phones. */
export function ConsolePhoneDialog({
  code,
  link,
  secondsLeft,
  sas,
  phones,
  locale: localeProp,
  warning,
}: {
  code: string
  link: string
  secondsLeft: number
  /** Once a phone claimed the offer: the SAS to confirm with Enter. */
  sas?: string
  phones: { name: string; status: 'online' | 'offline' }[]
  locale?: Locale
  warning?: string
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - s.length))
  return (
    <pre className="ui-terminal ui-terminal--framed" aria-label={t('bcConsoleHint')}>
      <span className="ui-ansi-bold">/phone</span>
      {'  '}
      <span className="ui-ansi-gray">{t('title')}</span>
      {'\n\n'}
      {qrAscii().map((line, i) => (
        <span key={i}>
          {'   '}
          <span className="ui-ansi-white">{line}</span>
          {'\n'}
        </span>
      ))}
      {'\n'}
      {'   '}
      <span className="ui-ansi-gray">{pad(t('link'), 8)}</span>
      <span className="ui-ansi-cyan">{link}</span>
      {'\n   '}
      <span className="ui-ansi-gray">{pad(t('code'), 8)}</span>
      <span className="ui-ansi-bold ui-ansi-yellow">
        {code.slice(0, 4)} {code.slice(4)}
      </span>
      <span className="ui-ansi-gray">
        {'   '}
        {t('expiresIn', {
          s: `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`,
        })}
      </span>
      {'\n'}
      {sas && (
        <>
          {'\n   '}
          <span className="ui-ansi-green ui-ansi-bold">
            SAS {sas.slice(0, 3)} {sas.slice(3)}
          </span>
          {'  '}
          <span className="ui-ansi-gray">
            {t('sasMatch')} <span className="ui-ansi-white">[Enter]</span> · {t('sasMismatch')}{' '}
            <span className="ui-ansi-white">[Esc]</span>
          </span>
          {'\n'}
        </>
      )}
      {warning && (
        <>
          {'\n   '}
          <span className="ui-ansi-red">! {warning}</span>
          {'\n'}
        </>
      )}
      {'\n   '}
      <span className="ui-ansi-gray">{t('devicesMine')}</span>
      {'\n'}
      {phones.length === 0 ? (
        <span>
          {'   '}
          <span className="ui-ansi-gray">— {t('devicesEmpty')}</span>
          {'\n'}
        </span>
      ) : (
        phones.map((p) => (
          <span key={p.name}>
            {'   '}
            <span className={p.status === 'online' ? 'ui-ansi-green' : 'ui-ansi-gray'}>●</span>{' '}
            {pad(p.name, 22)}
            <span className="ui-ansi-gray">{t(p.status)}</span>
            {'\n'}
          </span>
        ))
      )}
      {'\n   '}
      <span className="ui-ansi-gray">
        [d] {t('disconnect')} · [n] {t('newCode')} · [q] {locale === 'en' ? 'close' : 'закрыть'}
      </span>
    </pre>
  )
}

/** The banner in the window / console over a session a phone started. */
export function PhoneSessionBanner({
  device,
  at,
  locale: localeProp,
}: {
  device: string
  at?: string
  locale?: Locale
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  return (
    <Callout tone="info" icon={Smartphone} banner compact title={t('sessionFromPhone', { device })}>
      {t('sessionFromPhoneText')}
      {at && <span className="ui-hint"> · {at}</span>}
    </Callout>
  )
}

/** The origin mark in a session list: the phone that started the session. */
export function PhoneOriginBadge({
  device,
  locale: localeProp,
}: {
  device?: string
  locale?: Locale
}) {
  const locale = useLocale(localeProp)
  const t = tr(locale)
  return (
    <Badge tone="info" size="sm">
      <Smartphone size={12} aria-hidden /> {device ?? t('originPhone')}
    </Badge>
  )
}

export { TerminalSquare as ConsoleIcon }
