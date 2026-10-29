import { defineStrings } from '../i18n.ts'

/** Pairing, Home and the install switcher. */
export const S = defineStrings({
  'pair.welcomeTitle': { ru: 'Подключите установку', en: 'Connect an install' },
  'pair.welcomeText': {
    ru: 'Отсканируйте QR-код из кабинета Buff или из Buff Code на компьютере, либо введите ссылку и код.',
    en: 'Scan the QR code from the Buff cabinet or Buff Code on your computer, or enter the link and the code.',
  },
  'pair.scan': { ru: 'Сканировать QR', en: 'Scan QR' },
  'pair.enterCode': { ru: 'Ввести ссылку и код', en: 'Enter link and code' },
  'pair.scanHint': {
    ru: 'Наведите камеру на QR-код на экране компьютера',
    en: 'Point the camera at the QR code on the computer screen',
  },
  'pair.scanFound': { ru: 'Код распознан', en: 'Code recognised' },
  'pair.link': { ru: 'Ссылка', en: 'Link' },
  'pair.linkHint': { ru: 'Из кабинета или Buff Code', en: 'From the cabinet or Buff Code' },
  'pair.code': { ru: 'Код', en: 'Code' },
  'pair.codeHint': {
    ru: '8 символов, показан на компьютере',
    en: '8 characters, shown on the computer',
  },
  'pair.connect': { ru: 'Подключить', en: 'Connect' },
  'pair.connecting': { ru: 'Подключаемся…', en: 'Connecting…' },
  'pair.sasTitle': { ru: 'Сравните код', en: 'Compare the code' },
  'pair.sasText': {
    ru: 'На компьютере показан такой же код? Подтвердите там, что он совпадает. Так мы убеждаемся, что никто не встал между телефоном и установкой.',
    en: 'Does the computer show the same code? Confirm there that it matches. This proves nobody sits between the phone and the install.',
  },
  'pair.sasWaiting': {
    ru: 'Ждём подтверждения на компьютере…',
    en: 'Waiting for confirmation on the computer…',
  },
  'pair.doneTitle': { ru: 'Подключено', en: 'Connected' },
  'pair.doneText': {
    ru: 'Телефон получил права пользователя {user}. Переподключение будет автоматическим.',
    en: 'The phone has the rights of {user}. Reconnection is automatic.',
  },
  'pair.deviceNameIs': {
    ru: 'Под этим именем телефон виден в кабинете',
    en: 'The cabinet lists the phone under this name',
  },
  'pair.qrWaitingText': {
    ru: 'В кабинете на компьютере нажмите «Это мой телефон» — подключение завершится само.',
    en: 'In the cabinet on the computer, press «It is my phone» — the connection then completes.',
  },
  'pair.errExpired': { ru: 'Код истёк', en: 'The code expired' },
  'pair.errExpiredText': {
    ru: 'Откройте сопряжение на компьютере заново — он покажет новый код.',
    en: 'Start pairing on the computer again — it will show a new code.',
  },
  'pair.errLocked': { ru: 'Слишком много попыток', en: 'Too many attempts' },
  'pair.errLockedText': {
    ru: 'Подождите 15 минут и начните сопряжение заново.',
    en: 'Wait 15 minutes and start pairing again.',
  },
  'pair.errBlockedOrg': {
    ru: 'Организация запретила телефоны',
    en: 'The organisation forbids phones',
  },
  'pair.errBlockedOrgText': {
    ru: 'Владелец организации отключил сопряжение мобильных устройств.',
    en: 'The organisation owner disabled pairing of mobile devices.',
  },
  'pair.errBlockedEe': {
    ru: 'Запрещено администратором установки',
    en: 'Forbidden by the install administrator',
  },
  'pair.errBlockedEeText': {
    ru: 'Администратор установки запретил сопряжение сотрудникам.',
    en: 'The install administrator forbade pairing for employees.',
  },
  'pair.errIncompatible': { ru: 'Несовместимая версия', en: 'Incompatible version' },
  'pair.errIncompatibleText': {
    ru: 'Установка {version} старше, чем умеет приложение. Обновите установку или приложение.',
    en: 'Install {version} is older than the app supports. Update the install or the app.',
  },
  'pair.errGateway': { ru: 'Нет связи со шлюзом', en: 'No connection to the gateway' },
  'pair.errGatewayText': {
    ru: 'Проверьте интернет на телефоне и повторите: {gateway} недоступен.',
    en: 'Check the phone’s internet and retry: {gateway} is unreachable.',
  },
  'pair.errInstallOffline': { ru: 'Установка не отвечает', en: 'The install does not answer' },
  'pair.errInstallOfflineText': {
    ru: 'Шлюз на связи, а установка молчит: возможно, она выключена или осталась без интернета. Попросите администратора проверить её и повторите.',
    en: 'The gateway answers but the install is silent: it may be off or without internet. Ask its administrator to check it, then retry.',
  },
  'pair.blockedHint': {
    ru: 'Если доступ нужен по работе, обратитесь к владельцу организации или администратору установки.',
    en: 'If you need access for work, ask the organisation owner or the install administrator.',
  },
  'home.title': { ru: 'Домой', en: 'Home' },
  'home.installs': { ru: 'Установки', en: 'Installs' },
  'home.attention': { ru: 'Требует внимания', en: 'Needs attention' },
  'home.attentionEmpty': {
    ru: 'Ничего не ждёт вашего решения',
    en: 'Nothing waits for your decision',
  },
  'home.addInstall': { ru: 'Добавить установку', en: 'Add an install' },
  'home.noInstalls': { ru: 'Ни одной установки', en: 'No installs yet' },
  'home.switch': { ru: 'Переключить установку', en: 'Switch install' },
  'home.kindSaas': { ru: 'Организация buff.systems', en: 'buff.systems organisation' },
  'home.kindCe': { ru: 'Buff Community', en: 'Buff Community' },
  'home.kindEe': { ru: 'Buff Enterprise', en: 'Buff Enterprise' },
  'home.kindMachine': { ru: 'Buff Code', en: 'Buff Code' },
  'home.standalone': { ru: 'без входа в Buff', en: 'not signed into Buff' },
  'home.signedInto': { ru: 'вошёл в {install}', en: 'signed into {install}' },
  'home.gate': { ru: 'Согласование', en: 'Approval' },
  'home.question': { ru: 'Вопрос агента', en: 'Agent question' },
  'home.permission': { ru: 'Разрешение Buff Code', en: 'Buff Code permission' },
  'home.bcQuestion': { ru: 'Вопрос Buff Code', en: 'Buff Code question' },
  'home.review': { ru: 'Ревью ждёт решения', en: 'Review awaits a decision' },
  'home.research': { ru: 'Исследование готово', en: 'Research ready' },
  'home.audit': { ru: 'Аудит готов', en: 'Audit ready' },
})
