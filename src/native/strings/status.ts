import { defineStrings } from '../i18n.ts'

/** The not-live states of an install. */
export const S = defineStrings({
  'status.repair': { ru: 'Подключить заново', en: 'Pair again' },
  'status.forget': { ru: 'Удалить установку с телефона', en: 'Remove the install from the phone' },
  'status.repairText': {
    ru: 'Сопряжение разорвано. Данные установки удалены с телефона; подключите её заново с компьютера.',
    en: 'The pairing was revoked. The install’s data was removed from the phone; pair it again from the computer.',
  },
  'status.serviceDownText': {
    ru: 'Запустите Buff Code или его фоновую службу на компьютере — телефон подключится сам.',
    en: 'Start Buff Code or its background service on the computer — the phone will reconnect by itself.',
  },
})
