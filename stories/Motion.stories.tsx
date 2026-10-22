import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimatedNumber, Button, ProgressCircle, TextShimmer } from '../src/react/index.ts'

const meta = { title: 'Feedback/Motion', component: TextShimmer } satisfies Meta<typeof TextShimmer>

export default meta
type Story = StoryObj<typeof meta>

export const Shimmer: Story = {
  render: () => (
    <div className="sb-stack" style={{ fontSize: 14 }}>
      <TextShimmer>Думаю…</TextShimmer>
      <span>
        <TextShimmer>Запускаю</TextShimmer> make ci
      </span>
      <TextShimmer active={false}>Готово — шимер остановлен на месте</TextShimmer>
      <TextShimmer as="p" className="ui-title" style={{ margin: 0 }}>
        Создаю рабочую копию…
      </TextShimmer>
    </div>
  ),
}

export const Rings: Story = {
  render: () => (
    <div className="sb-stack">
      <div className="sb-row">
        {[0, 12, 42, 76, 100].map((value) => (
          <ProgressCircle key={value} value={value} label={`Загрузка ${value}%`} />
        ))}
      </div>
      <div className="sb-row ui-note">
        <ProgressCircle value={38} size={20} strokeWidth={2.5} label="Контекст" /> 38% контекста
        <ProgressCircle value={86} size={20} strokeWidth={2.5} tone="warn" label="Контекст" /> 86%
        <ProgressCircle value={100} size={20} strokeWidth={2.5} tone="crit" label="Контекст" /> 100%
        <ProgressCircle value={100} size={20} strokeWidth={2.5} tone="ok" label="Загрузка" /> готово
      </div>
      <div className="sb-row">
        <ProgressCircle value={64} size={48} strokeWidth={5} label="Прогресс" />
        <ProgressCircle value={64} size={32} strokeWidth={4} tone="ok" label="Прогресс" />
      </div>
    </div>
  ),
}

function Counter() {
  const [tools, setTools] = useState(7)
  const [tokens, setTokens] = useState(18420)
  useEffect(() => {
    const id = setInterval(() => setTools((n) => n + 1), 1500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="sb-stack">
      <div className="sb-row ui-note">
        <span>
          Вызовов инструментов: <AnimatedNumber value={tools} />
        </span>
        <span>
          Токенов:{' '}
          <AnimatedNumber
            value={tokens}
            duration={900}
            format={(n) => Math.round(n).toLocaleString('ru-RU')}
          />
        </span>
      </div>
      <div className="sb-row">
        <Button size="sm" onClick={() => setTokens((n) => n + 2731)}>
          Потратить токены
        </Button>
      </div>
    </div>
  )
}

export const Numbers: Story = { render: () => <Counter /> }
