import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Toaster, toast } from '../src/react/index.ts'

const meta = { title: 'Feedback/Toast', component: Toaster } satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Toasts: Story = {
  render: () => (
    <>
      <div className="sb-row">
        <Button onClick={() => toast('Задача создана', 'success', 600000)}>Успех</Button>
        <Button onClick={() => toast('Не удалось подключиться к шине', 'error', 600000)}>
          Ошибка
        </Button>
        <Button onClick={() => toast('Аудит запущен в фоне', 'info', 600000)}>Сообщение</Button>
      </div>
      <Toaster />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const name of ['Успех', 'Ошибка', 'Сообщение'])
      await userEvent.click(canvas.getByRole('button', { name }))
  },
}

const showRich = () => {
  toast.show({
    title: 'Сессия сохранена',
    description: '12 файлов, 340 строк изменено',
    kind: 'success',
    ttlMs: 600000,
  })
  toast.show({
    title: 'Вкладка закрыта',
    actions: [{ label: 'Вернуть', onClick: () => {} }],
    ttlMs: 600000,
  })
  toast.show({
    title: 'Нет связи с шиной',
    description: 'Переподключаемся; ответы модели придут, когда связь вернётся',
    kind: 'error',
    persistent: true,
    actions: [
      { label: 'Повторить', onClick: () => {} },
      { label: 'Подробнее', onClick: () => {} },
    ],
  })
}

export const WithActions: Story = {
  render: () => (
    <>
      <Button onClick={showRich}>Показать</Button>
      <Toaster />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Показать' }))
  },
}
