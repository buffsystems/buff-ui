import { defineStrings } from '../i18n.ts'

/** Words every screen shares: actions, states, time. */
export const S = defineStrings({
  'common.ok': { ru: 'Готово', en: 'Done' },
  'common.cancel': { ru: 'Отмена', en: 'Cancel' },
  'common.close': { ru: 'Закрыть', en: 'Close' },
  'common.back': { ru: 'Назад', en: 'Back' },
  'common.retry': { ru: 'Повторить', en: 'Retry' },
  'common.save': { ru: 'Сохранить', en: 'Save' },
  'common.delete': { ru: 'Удалить', en: 'Delete' },
  'common.rename': { ru: 'Переименовать', en: 'Rename' },
  'common.send': { ru: 'Отправить', en: 'Send' },
  'common.share': { ru: 'Поделиться', en: 'Share' },
  'common.open': { ru: 'Открыть', en: 'Open' },
  'common.more': { ru: 'Ещё', en: 'More' },
  // #903: the timeline holds the start of a long text; this fetches the whole.
  'common.showAll': { ru: 'Показать полностью', en: 'Show all' },
  'common.showMore': { ru: 'Показать ещё', en: 'Show more' },
  'common.search': { ru: 'Поиск', en: 'Search' },
  'common.filter': { ru: 'Фильтр', en: 'Filter' },
  'common.loading': { ru: 'Загрузка…', en: 'Loading…' },
  // #809: a file on its way — how much of how much, how long is left.
  'common.downloadOf': { ru: '{done} из {total}', en: '{done} of {total}' },
  'common.etaSeconds': { ru: 'ещё ~{n} с', en: '~{n} s left' },
  'common.etaMinutes': { ru: 'ещё ~{n} мин', en: '~{n} min left' },
  'common.etaAlmost': { ru: 'почти готово', en: 'almost done' },
  'common.empty': { ru: 'Пока пусто', en: 'Nothing here yet' },
  'common.error': { ru: 'Что-то пошло не так', en: 'Something went wrong' },
  'common.all': { ru: 'Все', en: 'All' },
  'common.mine': { ru: 'Мои', en: 'Mine' },
  'common.yes': { ru: 'Да', en: 'Yes' },
  'common.no': { ru: 'Нет', en: 'No' },
  'common.online': { ru: 'На связи', en: 'Online' },
  'common.connecting': { ru: 'Подключаемся…', en: 'Connecting…' },
  'common.offline': { ru: 'Недоступна', en: 'Unavailable' },
  'common.offlineSince': { ru: 'Недоступна с {time}', en: 'Unavailable since {time}' },
  'common.noGatewaySince': {
    ru: 'Нет связи со шлюзом с {time}',
    en: 'No connection to the gateway since {time}',
  },
  // #902: an action refused at once because the install is not online (read-only, no queue).
  'common.offlineAction': {
    ru: 'Установка не в сети — действие недоступно',
    en: 'The install is offline — the action is unavailable',
  },
  // #901: the gateway was reached and refused the phone — its reason, not «check the internet».
  'common.gatewayRefusedSince': {
    ru: 'Шлюз отказал с {time}',
    en: 'The gateway refused since {time}',
  },
  'common.readOnlyGateway': {
    ru: 'Шлюз отказал в подключении: {detail}. Показано последнее известное состояние, действия недоступны. Подключимся сами, когда шлюз пустит.',
    en: 'The gateway refused the connection: {detail}. Showing the last known state; actions are disabled. We reconnect by ourselves once it lets us in.',
  },
  // #916: a pair's daily traffic against the gateway's limit.
  'usage.line': {
    ru: 'Трафик за сутки: {used} из {limit}, сброс в {time}',
    en: 'Traffic today: {used} of {limit}, resets at {time}',
  },
  'usage.exhausted': {
    ru: 'Суточный лимит трафика исчерпан до {time}',
    en: 'Daily traffic limit used up until {time}',
  },
  'usage.exhaustedText': {
    ru: 'Телефон и установка израсходовали суточный трафик через buff.systems. Показано последнее известное состояние, действия недоступны. Связь вернётся в {time}.',
    en: 'The phone and the install used up their daily traffic through buff.systems. Showing the last known state; actions are disabled. The link comes back at {time}.',
  },
  'size.b': { ru: '{n} Б', en: '{n} B' },
  'size.kb': { ru: '{n} КБ', en: '{n} KB' },
  'size.mb': { ru: '{n} МБ', en: '{n} MB' },
  'size.gb': { ru: '{n} ГБ', en: '{n} GB' },
  'size.tb': { ru: '{n} ТБ', en: '{n} TB' },
  'common.notRespondingSince': { ru: 'Не отвечает с {time}', en: 'Not responding since {time}' },
  'common.readOnlyNetwork': {
    ru: 'Телефон не достучался до шлюза. Показано последнее известное состояние, действия недоступны. Проверьте интернет на телефоне — подключимся сами.',
    en: 'The phone cannot reach the gateway. Showing the last known state; actions are disabled. Check the phone’s internet — we reconnect by ourselves.',
  },
  'common.readOnlyInstall': {
    ru: 'Установка не отвечает: возможно, она выключена или осталась без интернета. Показано последнее известное состояние, действия недоступны. Подключимся сами, когда она вернётся.',
    en: 'The install does not answer: it may be off or without internet. Showing the last known state; actions are disabled. We reconnect by ourselves once it is back.',
  },
  'common.readOnly': {
    ru: 'Установка недоступна. Показано последнее известное состояние, действия недоступны.',
    en: 'The install is unavailable. Showing the last known state; actions are disabled.',
  },
  'common.repairNeeded': { ru: 'Нужна привязка', en: 'Needs linking' },
  'common.menu': { ru: 'Меню', en: 'Menu' },
  'common.blockedByOrg': { ru: 'Запрещено организацией', en: 'Forbidden by the organisation' },
  'common.blockedByEe': {
    ru: 'Запрещено администратором установки',
    en: 'Forbidden by the install administrator',
  },
  'common.incompatible': { ru: 'Несовместимая версия', en: 'Incompatible version' },
  'common.serviceDown': {
    ru: 'Служба Buff Code не запущена',
    en: 'Buff Code service is not running',
  },
  'common.revokedByAdmin': {
    ru: 'Сопряжение разорвано администратором. Данные этой установки удалены с телефона.',
    en: 'Pairing was revoked by an administrator. Data of this install was removed from the phone.',
  },
  'common.revokedByOrg': {
    ru: 'Сопряжение разорвано: организация запретила телефоны. Данные удалены с телефона.',
    en: 'Pairing was revoked: the organisation forbade phones. Data was removed from the phone.',
  },
  'common.justNow': { ru: 'только что', en: 'just now' },
  'common.minutesAgo': { ru: '{n} мин назад', en: '{n} min ago' },
  'common.hoursAgo': { ru: '{n} ч назад', en: '{n} h ago' },
  'common.today': { ru: 'сегодня', en: 'today' },
  'common.yesterday': { ru: 'вчера', en: 'yesterday' },
})
