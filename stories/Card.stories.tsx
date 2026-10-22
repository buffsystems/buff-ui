import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, ScanSearch } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../src/react/index.ts'

const meta = { title: 'Layout/Card', component: Card } satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>Репозиторий подключён</CardTitle>
        <CardDescription>stocks-bot · 8 веток · последний аудит вчера</CardDescription>
      </CardHeader>
      <CardContent>Аудит проверил 10 разделов. Замечаний к безопасности нет.</CardContent>
      <CardFooter>
        <div className="sb-row">
          <Button variant="primary">Открыть</Button>
          <Button variant="ghost">Позже</Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

// Controls for the whole card ride in the header's `action`: on the right of the text, under it
// when the card is too narrow for both.
export const HeaderAction: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 720 }}>
      <Card>
        <CardHeader
          action={
            <>
              <Button size="sm" leadingIcon={ScanSearch}>
                Опросить машины
              </Button>
              <Button size="sm">Проверить доступ</Button>
            </>
          }
        >
          <CardTitle>Машины</CardTitle>
          <CardDescription>3 шт.</CardDescription>
        </CardHeader>
        <CardContent>Таблица машин.</CardContent>
      </Card>
      <Card>
        <CardHeader
          action={
            <Button size="sm" leadingIcon={Plus}>
              Машина
            </Button>
          }
        >
          <CardTitle>Машины облака</CardTitle>
          <CardDescription>
            Имена — без префикса установки; на каждой машине — одна роль. Тип машины — из типов
            провайдера; ядра и память задаёт он.
          </CardDescription>
        </CardHeader>
        <CardContent>Список машин.</CardContent>
      </Card>
    </div>
  ),
}
