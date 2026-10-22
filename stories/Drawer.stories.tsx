import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileCode2, Plus } from 'lucide-react'
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  Nav,
  NavItem,
} from '../src/react/index.ts'

const meta = { title: 'Overlays/Drawer', component: Drawer } satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const args = { open: true, onOpenChange: () => {}, title: '' }

export const TabSheet: Story = {
  args,
  render: () => (
    <Drawer open onOpenChange={() => {}} title="Вкладки" description="3 открыто">
      <DrawerBody>
        <Nav label="Вкладки" onCard>
          <NavItem icon={FileCode2} current>
            screen.tsx
          </NavItem>
          <NavItem icon={FileCode2}>session.ts</NavItem>
          <NavItem icon={FileCode2}>README.md</NavItem>
        </Nav>
      </DrawerBody>
      <DrawerFooter>
        <Button leadingIcon={Plus} variant="primary">
          Новая вкладка
        </Button>
      </DrawerFooter>
    </Drawer>
  ),
}

/** The phone's tab sheet without a header: the list names itself, the title is read aloud. */
export const BareSheet: Story = {
  args,
  render: () => (
    <Drawer open onOpenChange={() => {}} title="Вкладки" hideTitle hideClose>
      <DrawerBody>
        <Nav label="Вкладки" onCard>
          <NavItem icon={FileCode2} current>
            screen.tsx
          </NavItem>
          <NavItem icon={FileCode2}>session.ts</NavItem>
        </Nav>
      </DrawerBody>
    </Drawer>
  ),
}

export const Inspector: Story = {
  args,
  render: () => (
    <Drawer open onOpenChange={() => {}} side="right" title="Вызов инструмента">
      <DrawerBody>
        <div className="sb-stack">
          <div className="sb-row">
            <Badge tone="ok">готово</Badge>
            <span className="sb-caption">read_file · 120 мс</span>
          </div>
          <p style={{ margin: 0 }}>src/react/Drawer.tsx, строки 1–80</p>
        </div>
      </DrawerBody>
    </Drawer>
  ),
}
