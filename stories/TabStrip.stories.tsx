import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileCode, SquareTerminal } from 'lucide-react'
import {
  Avatar,
  avatarColor,
  Kbd,
  Spinner,
  TabStrip,
  TabStripTab,
  TabStripTrigger,
} from '../src/react/index.ts'
import type { TabStripOrientation } from '../src/react/index.ts'

const meta = { title: 'Navigation/TabStrip', component: TabStrip } satisfies Meta<typeof TabStrip>

export default meta
type Story = StoryObj<typeof meta>

type Doc = { id: string; title: string; icon: 'project' | 'file' | 'terminal' | 'busy' }

const initial: Doc[] = [
  { id: 'a', title: 'Починить вход по SSO', icon: 'project' },
  { id: 'b', title: 'src/react/TabStrip.tsx', icon: 'file' },
  { id: 'c', title: 'Терминал 1', icon: 'terminal' },
  { id: 'd', title: 'Длинное название сессии, которое не помещается целиком', icon: 'busy' },
]

function DocIcon({ icon }: { icon: Doc['icon'] }) {
  if (icon === 'project') return <Avatar name="buff" size={16} square color={avatarColor('blue')} />
  if (icon === 'file') return <FileCode aria-hidden />
  if (icon === 'terminal') return <SquareTerminal aria-hidden />
  return <Spinner size={14} />
}

// The states as a drag would report them: «c» is being dragged, it would land after «a».
function Strip({ orientation }: { orientation: TabStripOrientation }) {
  const [docs, setDocs] = useState(initial)
  const [active, setActive] = useState('b')
  return (
    <TabStrip label="Открытые вкладки" orientation={orientation}>
      {docs.map((doc) => (
        <TabStripTab
          key={doc.id}
          active={doc.id === active}
          dragging={doc.id === 'c'}
          drop={doc.id === 'a' ? 'after' : undefined}
          onClose={() => setDocs((list) => list.filter((item) => item.id !== doc.id))}
        >
          <TabStripTrigger
            selected={doc.id === active}
            icon={<DocIcon icon={doc.icon} />}
            onClick={() => setActive(doc.id)}
          >
            {doc.title}
          </TabStripTrigger>
        </TabStripTab>
      ))}
    </TabStrip>
  )
}

export const States: Story = {
  render: () => (
    <div className="sb-stack">
      <p className="sb-caption">Горизонтально: активная, перетаскиваемая, метка «встанет после»</p>
      <div style={{ maxWidth: 720 }}>
        <Strip orientation="horizontal" />
      </div>
      <p className="sb-caption">Вертикально (боковая панель)</p>
      <div style={{ width: 240 }}>
        <Strip orientation="vertical" />
      </div>
    </div>
  ),
}

// The close button with the app's hooks and a tooltip naming its shortcut.
export const CloseTooltip: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TabStrip label="Открытые вкладки">
        {initial.slice(0, 2).map((doc, index) => (
          <TabStripTab
            key={doc.id}
            active={index === 0}
            onClose={() => {}}
            closeProps={{ 'data-slot': 'tab-close' }}
            closeTooltip={
              <>
                Закрыть вкладку <Kbd>⌘W</Kbd>
              </>
            }
          >
            <TabStripTrigger selected={index === 0} icon={<DocIcon icon={doc.icon} />}>
              {doc.title}
            </TabStripTrigger>
          </TabStripTab>
        ))}
      </TabStrip>
    </div>
  ),
}

// Window tabs are links to pages: no tab roles, the open one is aria-current="page".
export const NavLinks: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <TabStrip nav label="Открытые сессии">
        {initial.slice(0, 3).map((doc, index) => (
          <TabStripTab key={doc.id} active={index === 0} onClose={() => {}}>
            <TabStripTrigger asChild selected={index === 0}>
              <a href={`#/session/${doc.id}`}>
                <DocIcon icon={doc.icon} />
                <span className="ui-tab-strip__label">{doc.title}</span>
              </a>
            </TabStripTrigger>
          </TabStripTab>
        ))}
      </TabStrip>
    </div>
  ),
}
