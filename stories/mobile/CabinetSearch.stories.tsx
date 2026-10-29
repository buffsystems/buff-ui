import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchScreen } from '../../src/native/index.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta: Meta = { title: 'Mobile/Cabinet/Search', decorators: [withPhone] }
export default meta
type Story = StoryObj

const online = { kind: 'online' } as const

export const Hits: Story = {
  render: () => (
    <SearchScreen
      status={online}
      query="кэш"
      hits={[
        {
          id: 'task:3',
          kind: 'task',
          title: 'Кэширование ответов API',
          subtitle: 'buff-demo / dev_project · #3',
        },
        {
          id: 'review:9',
          kind: 'review',
          title: 'Вынести аутентификацию в отдельный модуль',
          subtitle: 'dev_project · #9',
        },
        {
          id: 'research:r1',
          kind: 'research',
          title: 'Кэш для поиска заметок',
          subtitle: 'dev_project',
        },
      ]}
    />
  ),
}
export const Narrowed: Story = {
  render: () => <SearchScreen status={online} query="поиск" kinds={['task']} hits={[]} />,
}
export const Empty: Story = { render: () => <SearchScreen status={online} query="" hits={[]} /> }
