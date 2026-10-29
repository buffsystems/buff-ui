// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  formatSeconds,
  MobilePolicyForm,
  OrgPhonePolicy,
  PairedDevices,
  PairingPanel,
  pairingStrings,
} from '../src/react/index.ts'
import { qrAscii, qrRows } from '../src/shared/qr-pattern.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

const offer = { link: 'https://app.buff.systems/pair/x', code: '7KQ2M9XA', ttlSeconds: 300 }
const policy = {
  enabled: true,
  pairing: 'all' as const,
  roles: [],
  push: 'gateway' as const,
  gatewayAddress: 'relay.buff.systems:443',
}

describe('pairing strings', () => {
  test('both locales interpolate and the countdown formats', () => {
    expect(pairingStrings('ru')('expiresIn', { s: '3:32' })).toBe('Действует ещё 3:32')
    expect(pairingStrings('en')('pairedText', { device: 'Pixel' })).toBe(
      '“Pixel” received your rights. Reconnection is automatic.',
    )
    expect(formatSeconds(212)).toBe('3:32')
    expect(formatSeconds(-5)).toBe('0:00')
  })
})

describe('qr pattern', () => {
  test('is square with three finders and renders as block art', () => {
    const rows = qrRows()
    expect(rows).toHaveLength(21)
    expect(rows[0].slice(0, 7)).toEqual([true, true, true, true, true, true, true])
    expect(rows[3][3]).toBe(true)
    expect(rows[1][1]).toBe(false)
    expect(qrAscii()).toHaveLength(11)
    expect(qrAscii()[0]).toMatch(/^[█▀▄ ]{21}$/)
  })
})

describe('PairingPanel', () => {
  test('shows the QR with its countdown, then the link and code on the other mode', () => {
    render(
      <PairingPanel
        phase={{ kind: 'offer', offer: { ...offer, code: '' }, secondsLeft: 212 }}
        mode="qr"
      />,
    )
    // The QR carries the link (and its secret) as a code, never as an accessible name.
    expect(screen.getByRole('img', { name: 'QR-код' })).toBeTruthy()
    expect(screen.queryByRole('img', { name: offer.link })).toBeNull()
    expect(screen.getByText('Действует ещё 3:32')).toBeTruthy()
    cleanup()
    render(<PairingPanel phase={{ kind: 'offer', offer, secondsLeft: 9 }} mode="link" />)
    expect(screen.getByLabelText('7KQ2M9XA')).toBeTruthy()
    expect(screen.getByDisplayValue(offer.link)).toBeTruthy()
    cleanup()
    // The copy button speaks the panel's language, not the field's default.
    render(
      <PairingPanel phase={{ kind: 'offer', offer, secondsLeft: 9 }} mode="link" locale="en" />,
    )
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy()
  })

  // #670: right after the mode switch the previous offer is still the phase — a QR link under
  // «Ссылка и код» (no code), or a code link drawn as a QR. Neither is shown: «Готовим…».
  test('an offer of the other mode is not shown while the new one is prepared', () => {
    render(
      <PairingPanel
        phase={{ kind: 'offer', offer: { ...offer, code: '' }, secondsLeft: 200 }}
        mode="link"
      />,
    )
    expect(screen.getByText('Готовим…')).toBeTruthy()
    expect(screen.queryByDisplayValue(offer.link)).toBeNull()
    cleanup()
    render(<PairingPanel phase={{ kind: 'offer', offer, secondsLeft: 200 }} mode="qr" />)
    expect(screen.getByText('Готовим…')).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'QR-код' })).toBeNull()
  })

  test('the SAS asks for confirmation; blocked states explain themselves', async () => {
    const confirm = vi.fn()
    render(
      <PairingPanel
        mode="link"
        phase={{ kind: 'claimed', sas: '482913', device: { name: 'Pixel', model: 'Pixel 9' } }}
        onConfirmSas={confirm}
      />,
    )
    expect(screen.getByLabelText('482913')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'Совпадает' }))
    expect(confirm).toHaveBeenCalledOnce()
    cleanup()
    render(<PairingPanel phase={{ kind: 'blocked', reason: 'ee' }} locale="en" />)
    expect(screen.getByText('Forbidden by the install administrator')).toBeTruthy()
  })

  // #659: Buff Code's window has no way to start the service, so its button did nothing.
  test('a stopped service offers the button only with a handler, else the command', async () => {
    const start = vi.fn()
    render(
      <PairingPanel phase={{ kind: 'blocked', reason: 'serviceDown' }} onStartService={start} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Запустить службу' }))
    expect(start).toHaveBeenCalledOnce()
    cleanup()
    render(<PairingPanel phase={{ kind: 'blocked', reason: 'serviceDown' }} />)
    expect(screen.queryByRole('button', { name: 'Запустить службу' })).toBeNull()
    expect(screen.getByText('buff service start')).toBeTruthy()
  })
})

// Seen live (#640/#655): a phone that came by QR shows no code — the QR carried the secret — so the
// panel asks to confirm the phone itself instead of comparing a code the phone never shows.
test('a phone that came by QR is confirmed by name, with no code to compare', async () => {
  const confirm = vi.fn()
  render(
    <PairingPanel
      mode="qr"
      phase={{ kind: 'claimed', sas: '482913', device: { name: 'Pixel', model: 'Pixel 9' } }}
      onConfirmSas={confirm}
    />,
  )
  expect(screen.queryByLabelText('482913')).toBeNull()
  expect(screen.queryByText(/показывает код/)).toBeNull()
  expect(screen.getByText(/«Pixel» просит подключиться по QR-коду/)).toBeTruthy()
  await userEvent.click(screen.getByRole('button', { name: 'Это мой телефон' }))
  expect(confirm).toHaveBeenCalledOnce()
})

describe('PairedDevices', () => {
  test('disconnect asks first and then reports the device', async () => {
    const onDisconnect = vi.fn()
    render(
      <PairedDevices
        devices={[
          {
            id: 'd1',
            name: 'Pixel',
            model: 'Pixel 9',
            pairedAt: '1 окт',
            lastSeen: 'сейчас',
            status: 'online',
          },
        ]}
        onDisconnect={onDisconnect}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Отключить' }))
    expect(screen.getByRole('dialog', { name: 'Отключить «Pixel»?' })).toBeTruthy()
    expect(onDisconnect).not.toHaveBeenCalled()
    await userEvent.click(screen.getAllByRole('button', { name: 'Отключить' }).at(-1)!)
    expect(onDisconnect).toHaveBeenCalledWith('d1')
    // Nothing to rename with here: no pencil that does nothing.
    expect(screen.queryByRole('button', { name: 'Переименовать' })).toBeNull()
  })

  test('the owner sees who owns each phone; an empty list says so', () => {
    render(<PairedDevices devices={[]} />)
    expect(screen.getByText('Ни одного телефона')).toBeTruthy()
  })
})

describe('policies', () => {
  test('forbidding phones in the organisation asks first; lifting the ban does not', async () => {
    const onChange = vi.fn()
    render(<OrgPhonePolicy forbidden={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Запретить' }))
    expect(onChange).toHaveBeenCalledWith(true)
    cleanup()
    render(<OrgPhonePolicy forbidden onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  test('the admin form confirms «forbidden», changes the rest at once', async () => {
    const onChange = vi.fn()
    render(
      <MobilePolicyForm policy={policy} availableRoles={['Разработчик']} onChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Выключены' }))
    expect(onChange).toHaveBeenLastCalledWith({ ...policy, push: 'off' })
    await userEvent.click(screen.getByRole('radio', { name: /Запрещено сотрудникам/ }))
    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ pairing: 'forbidden' }))
    await userEvent.click(screen.getByRole('button', { name: 'Запретить' }))
    expect(onChange).toHaveBeenLastCalledWith({ ...policy, pairing: 'forbidden' })
  })
})
