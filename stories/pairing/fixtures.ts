// Fake data of the Pairing stories (#630): neutral names, every status a row can have.
import type {
  AffectedMachine,
  AuditEntry,
  MobilePolicy,
  PairedDevice,
  PairingOffer,
  PairingRequest,
} from '../../src/react/index.ts'

export const offer: PairingOffer = {
  link: 'https://app.buff.systems/pair/7f3a9c',
  code: '7KQ2M9XA',
  ttlSeconds: 300,
}

export const phone = { name: 'iPhone Анны', model: 'iPhone 15 Pro' }

export const myDevices: PairedDevice[] = [
  {
    id: 'd1',
    name: 'iPhone Анны',
    model: 'iPhone 15 Pro',
    pairedAt: '12 окт',
    lastSeen: 'сейчас',
    status: 'online',
  },
  {
    id: 'd2',
    name: 'Pixel',
    model: 'Pixel 9',
    pairedAt: '3 окт',
    lastSeen: 'вчера, 22:10',
    status: 'offline',
  },
  {
    id: 'd3',
    name: 'Старый телефон',
    model: 'Galaxy S21',
    pairedAt: '1 сен',
    lastSeen: '14 сен',
    status: 'revoked',
  },
]

export const orgDevices: PairedDevice[] = [
  ...myDevices.map((d) => ({ ...d, user: 'Анна Громова' })),
  {
    id: 'd4',
    name: 'iPhone Павла',
    model: 'iPhone 14',
    user: 'Павел К.',
    pairedAt: '9 окт',
    lastSeen: '5 мин назад',
    status: 'online',
  },
  {
    id: 'd5',
    name: 'Galaxy',
    model: 'Galaxy S24',
    user: 'Мария С.',
    pairedAt: '20 окт',
    lastSeen: '1 ч назад',
    status: 'online',
  },
]

export const request: PairingRequest = {
  device: { name: 'Pixel', model: 'Pixel 9' },
  user: 'Анна Громова',
  requestedAt: 'только что',
}

export const policy: MobilePolicy = {
  enabled: true,
  pairing: 'all',
  roles: ['Разработчик'],
  push: 'gateway',
  gatewayAddress: 'relay.buff.systems:443',
}

export const roles = ['Владелец', 'Разработчик', 'Ревьюер', 'Аналитик']

export const machines: AffectedMachine[] = [
  { host: 'anna-mbp', user: 'Анна Громова', phones: 1, lastSeen: 'сейчас' },
  { host: 'pavel-ws', user: 'Павел К.', phones: 1, lastSeen: '2 ч назад' },
  { host: 'build-01', user: 'Мария С.', phones: 0, lastSeen: 'вчера' },
]

export const audit: AuditEntry[] = [
  { when: 'сегодня, 14:02', who: 'Анна Громова', what: 'подключила телефон «iPhone Анны»' },
  { when: 'сегодня, 11:40', who: 'admin', what: 'режим push: через buff.systems' },
  { when: 'вчера, 18:12', who: 'Павел К.', what: 'отключил телефон «Galaxy A52»' },
  { when: '14 окт', who: 'admin', what: 'мобильный доступ включён' },
]
