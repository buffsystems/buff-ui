import type { Meta, StoryObj } from '@storybook/react-vite'
import { TourScreen } from '../../src/native/screens/tour.tsx'
import { withDevice, withPhone } from './PhoneFrame.tsx'

/** Знакомство при первом запуске (#931): четыре карточки-истории, демо и подключение в одно касание. */
const meta = {
  title: 'Mobile/Tour',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const noop = () => undefined

export const Tour: Story = {
  decorators: [withPhone],
  render: () => <TourScreen onDemo={noop} onConnect={noop} onClose={noop} />,
}
/** Сборка без демо: одна кнопка «Подключить». */
export const NoDemo: Story = {
  decorators: [withPhone],
  render: () => <TourScreen onConnect={noop} onClose={noop} />,
}
/** Карточки не листаются сами — как при «уменьшении движения». */
export const Still: Story = {
  decorators: [withPhone],
  render: () => <TourScreen autoAdvance={false} onDemo={noop} onConnect={noop} onClose={noop} />,
}
/** Планшет: та же раскладка, но крупнее — не узкая колонка телефона в пустоте. */
export const Tablet: Story = {
  decorators: [withDevice('tablet')],
  render: () => <TourScreen autoAdvance={false} onDemo={noop} onConnect={noop} onClose={noop} />,
}
/** Самый маленький телефон: всё помещается, а чего не хватило — прокручивается. */
export const Small: Story = {
  decorators: [withDevice('small')],
  render: () => <TourScreen autoAdvance={false} onDemo={noop} onConnect={noop} onClose={noop} />,
}
