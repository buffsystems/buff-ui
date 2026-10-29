/*
  The words of the pairing screens on the install side (#630), Russian and English. The web
  package otherwise speaks Russian through prop defaults; these screens carry enough text
  that a locale prop is the honest way to show both.
*/
import type { Locale } from './model.ts'

const STRINGS = {
  title: ['Телефон', 'Phone'],
  copy: ['Копировать', 'Copy'],
  copied: ['Скопировано', 'Copied'],
  intro: [
    'Подключите телефон один раз — дальше он переподключается сам. Всё, что видит телефон, зашифровано между ним и этой установкой: buff.systems не читает данные.',
    'Pair the phone once — it reconnects by itself afterwards. Everything the phone sees is encrypted between it and this install: buff.systems cannot read the data.',
  ],
  modeQr: ['QR-код', 'QR code'],
  modeLink: ['Ссылка и код', 'Link and code'],
  // #670: the offer of the chosen mode is still on its way.
  preparing: ['Готовим…', 'Preparing…'],
  scanHint: [
    'Откройте приложение Buff на телефоне и отсканируйте код.',
    'Open the Buff app on the phone and scan the code.',
  ],
  linkHint: [
    'Откройте ссылку на телефоне и введите код.',
    'Open the link on the phone and enter the code.',
  ],
  link: ['Ссылка', 'Link'],
  code: ['Код', 'Code'],
  expiresIn: ['Действует ещё {s}', 'Valid for {s}'],
  expired: ['Код истёк', 'The code expired'],
  expiredText: [
    'Телефон не успел подключиться. Покажите новый код.',
    'No phone connected in time. Show a new code.',
  ],
  newCode: ['Новый код', 'New code'],
  sasTitle: ['Сравните код с телефоном', 'Compare the code with the phone'],
  sasText: [
    'Телефон «{device}» показывает код. Если он совпадает с этим — подтвердите. Так мы убеждаемся, что никто не встал между телефоном и установкой.',
    'The phone “{device}” shows a code. If it matches this one — confirm. This proves nobody sits between the phone and the install.',
  ],
  // By QR the phone shows no code — the QR carried the secret: the person confirms the phone itself.
  qrConfirmTitle: ['Подтвердите телефон', 'Confirm the phone'],
  qrConfirmText: [
    'Телефон «{device}» просит подключиться по QR-коду. Подтвердите, если это ваш телефон — он получит ваши права.',
    'The phone “{device}” asks to connect by the QR code. Confirm if it is your phone — it will get your rights.',
  ],
  qrConfirm: ['Это мой телефон', 'It is my phone'],
  sasMatch: ['Совпадает', 'It matches'],
  sasMismatch: ['Это не мой телефон', 'That is not my phone'],
  pairedTitle: ['Телефон подключён', 'Phone paired'],
  pairedText: [
    '«{device}» получил ваши права. Переподключение автоматическое.',
    '“{device}” received your rights. Reconnection is automatic.',
  ],
  pairAnother: ['Подключить ещё один', 'Pair another'],
  blockedOrg: ['Организация запретила телефоны', 'The organisation forbids phones'],
  blockedOrgText: [
    'Владелец организации отключил сопряжение мобильных устройств. Существующие сопряжения разорваны.',
    'The organisation owner disabled pairing of mobile devices. Existing pairings were torn down.',
  ],
  blockedEe: ['Запрещено администратором установки', 'Forbidden by the install administrator'],
  blockedEeText: [
    'Администратор установки запретил сопряжение сотрудникам. Существующие сопряжения разорваны.',
    'The install administrator forbade pairing for employees. Existing pairings were torn down.',
  ],
  blockedDisabled: ['Мобильный доступ выключен', 'Mobile access is off'],
  blockedDisabledText: [
    'Администратор выключил мобильное приложение для этой установки.',
    'The administrator switched the mobile app off for this install.',
  ],
  serviceDown: ['Служба не запущена', 'The service is not running'],
  serviceDownText: [
    'Телефон не увидит эту машину, пока фоновая служба Buff Code остановлена.',
    'The phone will not see this machine while the Buff Code background service is stopped.',
  ],
  startService: ['Запустить службу', 'Start the service'],
  startServiceBy: ['Запустите её в терминале:', 'Start it in a terminal:'],
  devicesMine: ['Мои телефоны', 'My phones'],
  devicesOrg: ['Телефоны организации', 'Phones of the organisation'],
  devicesAll: ['Устройства', 'Devices'],
  devicesEmpty: ['Ни одного телефона', 'No phones yet'],
  colDevice: ['Телефон', 'Phone'],
  colUser: ['Сотрудник', 'Employee'],
  colPaired: ['Подключён', 'Paired'],
  colSeen: ['На связи', 'Last seen'],
  colStatus: ['Статус', 'Status'],
  online: ['на связи', 'online'],
  offline: ['не на связи', 'offline'],
  revoked: ['отключён', 'revoked'],
  rename: ['Переименовать', 'Rename'],
  disconnect: ['Отключить', 'Disconnect'],
  disconnectTitle: ['Отключить «{device}»?', 'Disconnect “{device}”?'],
  disconnectText: [
    'Соединение разорвётся сразу, данные установки будут удалены с телефона. Подключить заново можно только новым сопряжением.',
    'The connection drops at once and the install’s data is removed from the phone. Only a new pairing brings it back.',
  ],
  orgPolicyTitle: [
    'Запретить сопряжение телефонов в организации',
    'Forbid phone pairing in the organisation',
  ],
  orgPolicyText: ['Новые телефоны не смогут подключиться.', 'New phones will not be able to pair.'],
  orgPolicyConfirmTitle: ['Запретить телефоны?', 'Forbid phones?'],
  orgPolicyConfirmText: [
    'Существующие сопряжения будут разорваны немедленно — включая Buff Code сотрудников, вошедшие в организацию. Снятие запрета их не вернёт: сотрудники сопрягут телефоны заново.',
    'Existing pairings are torn down at once — including employees’ Buff Code signed into the organisation. Lifting the ban does not bring them back: employees pair their phones again.',
  ],
  orgPolicyConfirm: ['Запретить', 'Forbid'],
  orgPolicyForbidden: [
    'Телефоны запрещены в организации',
    'Phones are forbidden in the organisation',
  ],
  requestTitle: ['Телефон просит подключение', 'A phone asks to pair'],
  requestText: [
    '«{device}» просит подключиться от имени {user}.',
    '“{device}” asks to pair as {user}.',
  ],
  requestAllow: ['Разрешить', 'Allow'],
  requestDeny: ['Это не я', 'That was not me'],
  adminTitle: ['Мобильное приложение', 'Mobile app'],
  adminEnabled: ['Мобильный доступ включён', 'Mobile access is on'],
  adminEnabledHint: [
    'Выключено — установка не регистрируется на шлюзе, телефоны её не видят.',
    'Off — the install does not register at the gateway, phones do not see it.',
  ],
  adminPairing: ['Кто может подключать телефоны', 'Who may pair phones'],
  pairingAll: ['Все сотрудники', 'Every employee'],
  pairingRoles: ['Только роли', 'Only these roles'],
  pairingForbidden: ['Запрещено сотрудникам', 'Forbidden for employees'],
  pairingForbiddenHint: [
    'Новые сопряжения отклоняются, существующие рвутся — и у кабинета, и у Buff Code, вошедших в установку.',
    'New pairings are refused, existing ones torn down — in the cabinet and in Buff Code signed into the install.',
  ],
  adminPush: ['Push-уведомления', 'Push notifications'],
  pushOff: ['Выключены', 'Off'],
  pushGateway: ['Через buff.systems', 'Via buff.systems'],
  pushGatewayHint: [
    'Единственный исходящий адрес установки — {address}. Содержимое зашифровано для телефона.',
    'The install’s only outbound address — {address}. Content is encrypted for the phone.',
  ],
  affected: ['Buff Code, вошедшие в установку', 'Buff Code signed into the install'],
  affectedHint: ['Политика действует и на них.', 'The policy applies to them too.'],
  colMachine: ['Машина', 'Machine'],
  colPhones: ['Телефонов', 'Phones'],
  audit: ['Журнал', 'Log'],
  colWhen: ['Когда', 'When'],
  colWho: ['Кто', 'Who'],
  colWhat: ['Что', 'What'],
  bcStandalone: ['Без входа в Buff', 'Not signed into Buff'],
  bcStandaloneText: [
    'Машина сопрягается напрямую через buff.systems. Политики организаций на неё не действуют.',
    'The machine pairs directly via buff.systems. No organisation policy applies to it.',
  ],
  bcSignedIn: ['Вошёл в {install}', 'Signed into {install}'],
  bcSignedInText: [
    'Действует политика мобильного доступа этой установки.',
    'The mobile-access policy of that install applies.',
  ],
  bcConsoleHint: ['В консоли: команда /phone', 'In the console: the /phone command'],
  sessionFromPhone: [
    'Сессия начата с телефона «{device}»',
    'Session started from the phone “{device}”',
  ],
  sessionFromPhoneText: [
    'Продолжайте здесь или на телефоне — это одна сессия.',
    'Continue here or on the phone — it is one session.',
  ],
  originPhone: ['телефон', 'phone'],
  save: ['Сохранить', 'Save'],
  cancel: ['Отмена', 'Cancel'],
} as const

export type StringKey = keyof typeof STRINGS

export type Translate = (key: StringKey, vars?: Record<string, string | number>) => string

/** The translator of a locale: `tr(locale)('sasMatch')`. */
export function tr(locale: Locale): Translate {
  const index = locale === 'en' ? 1 : 0
  return (key, vars) => {
    const text = STRINGS[key][index]
    return vars
      ? text.replace(/\{(\w+)\}/g, (m, n: string) => (n in vars ? String(vars[n]) : m))
      : text
  }
}

/** Seconds as «м:сс» / «m:ss» for the countdown. */
export function formatSeconds(total: number): string {
  const m = Math.floor(Math.max(0, total) / 60)
  const s = Math.max(0, total) % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
