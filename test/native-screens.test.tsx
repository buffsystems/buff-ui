// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  HomeScreen,
  ICON_NAMES,
  InstallBanner,
  NativeProvider,
  PairedScreen,
  PairErrorScreen,
  type IconSet,
  type Install,
  type Locale,
} from '../src/native/index.ts'

afterEach(cleanup)

// The host's icon set: under test, any component with the right props will do.
const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const wrap = (children: ReactNode, locale: Locale = 'ru') => (
  <NativeProvider icons={icons} locale={locale}>
    {children}
  </NativeProvider>
)

const installs: Install[] = [
  { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'online' }, attention: 2 },
  { id: 'm', kind: 'machine', name: 'laptop', status: { kind: 'serviceDown' }, attention: 0 },
]

describe('native screens render through react-native-web', () => {
  test('Home lists the installs with their kind and status, in both languages', () => {
    render(wrap(<HomeScreen installs={installs} attention={[]} />))
    expect(screen.getByText('Acme')).toBeTruthy()
    expect(screen.getByText(/без входа в Buff · Служба Buff Code не запущена/)).toBeTruthy()
    expect(screen.getByText('Ничего не ждёт вашего решения')).toBeTruthy()
    cleanup()
    render(wrap(<HomeScreen installs={installs} attention={[]} />, 'en'))
    expect(screen.getByText(/not signed into Buff · Buff Code service is not running/)).toBeTruthy()
  })

  test('Home lists the installs first, then what waits in them (#695)', () => {
    const { container } = render(wrap(<HomeScreen installs={installs} attention={[]} />))
    const text = container.textContent ?? ''
    expect(text.indexOf('Установки')).toBeLessThan(text.indexOf('Требует внимания'))
  })

  test('Home pulls to refresh without losing its content', () => {
    let pulled = 0
    render(
      wrap(<HomeScreen installs={installs} attention={[]} refreshing onRefresh={() => pulled++} />),
    )
    expect(screen.getByText('Ничего не ждёт вашего решения')).toBeTruthy()
    expect(pulled).toBe(0)
  })

  test('an attention item: its time leads the subtitle, the title has the row (#691)', () => {
    const item = {
      id: 'a:1',
      installId: 'a',
      installName: 'buff-demo',
      kind: 'gate' as const,
      title: 'Формулировка готова к согласованию — «Search: ignore diacritics»',
      subtitle: 'dev_project',
      when: '20 ч назад',
    }
    render(wrap(<HomeScreen installs={installs} attention={[item]} />))
    expect(screen.getByText('20 ч назад · Согласование · buff-demo · dev_project')).toBeTruthy()
  })

  test('Paired names the phone as the cabinet lists it, not as a field to type (#691)', () => {
    render(wrap(<PairedScreen installName="buff-demo" user="demo-lead" deviceName="iPhone" />))
    expect(screen.getByText('iPhone')).toBeTruthy()
    expect(screen.getByText('Под этим именем телефон виден в кабинете')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  test('Home without installs offers pairing', () => {
    render(wrap(<HomeScreen installs={[]} attention={[]} />))
    expect(screen.getByRole('button', { name: 'Добавить установку' })).toBeTruthy()
  })

  test('the banner is silent online and names every other status', () => {
    const { container } = render(wrap(<InstallBanner status={{ kind: 'online' }} />))
    expect(container.textContent).toBe('')
    render(wrap(<InstallBanner status={{ kind: 'offline', since: '14:20' }} />))
    expect(screen.getByText('Недоступна с 14:20')).toBeTruthy()
    render(wrap(<InstallBanner status={{ kind: 'blockedEe' }} />))
    // #671: CE and EE alike — the install administrator forbade phones, not an Enterprise-only policy.
    expect(screen.getByText('Запрещено администратором установки')).toBeTruthy()
    expect(
      screen.getByText('Администратор установки запретил сопряжение сотрудникам.'),
    ).toBeTruthy()
  })

  test('a link coming back is quiet: no banner, «connecting» in a row (#695)', () => {
    const { container } = render(wrap(<InstallBanner status={{ kind: 'connecting' }} />))
    expect(container.textContent).toBe('')
    cleanup()
    render(
      wrap(
        <HomeScreen
          installs={[
            { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'connecting' }, attention: 0 },
          ]}
          attention={[]}
        />,
      ),
    )
    expect(screen.getByText(/Подключаемся…/)).toBeTruthy()
  })

  test('unavailable says why: no connection to the gateway, or the install does not answer', () => {
    render(wrap(<InstallBanner status={{ kind: 'offline', since: '14:20', reason: 'network' }} />))
    expect(screen.getByText('Нет связи со шлюзом с 14:20')).toBeTruthy()
    expect(screen.getByText(/Проверьте интернет на телефоне/)).toBeTruthy()
    cleanup()
    render(wrap(<InstallBanner status={{ kind: 'offline', since: '14:20', reason: 'install' }} />))
    expect(screen.getByText('Не отвечает с 14:20')).toBeTruthy()
    expect(screen.getByText(/выключена или осталась без интернета/)).toBeTruthy()
  })

  test('a pairing error names the real gateway, and a silent install is told apart', () => {
    render(wrap(<PairErrorScreen error="gateway" gateway="dev.buff.systems" />))
    expect(screen.getByText(/dev\.buff\.systems недоступен/)).toBeTruthy()
    cleanup()
    render(wrap(<PairErrorScreen error="installOffline" />))
    expect(screen.getByText('Установка не отвечает')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeTruthy()
  })

  test('a pairing error explains itself and offers retry only when retrying helps', () => {
    render(wrap(<PairErrorScreen error="gateway" />))
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeTruthy()
    cleanup()
    render(wrap(<PairErrorScreen error="blockedOrg" />))
    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull()
    expect(screen.getByText('Организация запретила телефоны')).toBeTruthy()
  })
})
