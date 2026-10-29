import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from 'react-native'
import {
  Avatar,
  Badge,
  Button,
  Callout,
  Card,
  Chip,
  ChipRow,
  CodeInput,
  DiffView,
  EmptyState,
  Field,
  IconButton,
  Input,
  KeyValue,
  Prose,
  QrPlaceholder,
  Row,
  RowGroup,
  SasCode,
  Screen,
  SectionHeader,
  Segmented,
  SelectField,
  Skeleton,
  StatusDot,
  TabBar,
  Terminal,
  Text,
  Toast,
  TopBar,
} from '../../src/native/index.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Primitives',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Buttons, badges, chips, status dots — the controls every screen is built from. */
export const Controls: Story = {
  render: () => (
    <>
      <TopBar
        title="Примитивы"
        subtitle="Controls"
        onBack={() => {}}
        actions={<IconButton icon="search" label="Поиск" />}
      />
      <Screen padded>
        <SectionHeader title="Кнопки" />
        <View style={{ gap: 8 }}>
          <Button variant="primary" leadingIcon="plus" block>
            Основное действие
          </Button>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Button>Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive" size="sm">
              Удалить
            </Button>
            <Button loading>Ждём</Button>
          </View>
        </View>
        <SectionHeader title="Бейджи и чипы" />
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge tone="info">в работе</Badge>
          <Badge tone="ok" icon="check">
            готов
          </Badge>
          <Badge tone="warn">ожидает</Badge>
          <Badge tone="crit">ошибка</Badge>
          <Badge>3</Badge>
          <StatusDot tone="ok" pulse />
          <StatusDot tone="crit" />
        </View>
        <ChipRow>
          <Chip selected count={12}>
            Все
          </Chip>
          <Chip icon="user" count={3}>
            Мои
          </Chip>
          <Chip>Ждут решения</Chip>
          <Chip>Выполнены</Chip>
        </ChipRow>
        <Segmented
          options={[
            { id: 'd', label: 'День' },
            { id: 'w', label: 'Неделя' },
            { id: 'm', label: 'Месяц' },
          ]}
          value="w"
        />
        <SectionHeader title="Аватары" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Avatar name="Анна Громова" />
          <Avatar name="Pavel K" />
          <Avatar name="Buff Code · ноутбук" icon="cpu" />
          <Avatar name="buff-demo" icon="server" />
        </View>
        <Toast tone="ok">Сохранено</Toast>
      </Screen>
    </>
  ),
}

/** Forms, rows and cards. */
export const FormsAndLists: Story = {
  render: () => (
    <>
      <TopBar title="Формы и списки" />
      <Screen padded>
        <Field label="Ссылка на установку" hint="Скопируйте из кабинета" required>
          <Input icon="link" placeholder="https://…" />
        </Field>
        <Field label="Код" error="Код не найден или истёк">
          <CodeInput value="7KQ2" invalid />
        </Field>
        <Field label="Проект" required>
          <SelectField icon="folderGit" placeholder="Выберите проект" />
        </Field>
        <Field label="Модель" required>
          <SelectField icon="cpu" placeholder="Выберите модель" value="claude-fable-5-1" />
        </Field>
        <RowGroup title="Установки">
          <Row
            leading={<StatusDot tone="ok" />}
            title="Acme · buff.systems"
            subtitle="На связи"
            chevron
            onPress={() => {}}
          />
          <Row
            leading={<StatusDot tone="warn" />}
            title="CE · офис"
            subtitle="Недоступна с 14:20"
            chevron
            onPress={() => {}}
          />
          <Row icon="trash" title="Удалить установку" destructive onPress={() => {}} />
        </RowGroup>
        <Card>
          <KeyValue label="Версия" value="v0.21.5" />
          <KeyValue label="Отпечаток" value="a9f3 11c0 7e2b" mono />
        </Card>
        <Callout tone="warn" title="Служба не запущена">
          Телефон не увидит машину, пока служба Buff Code остановлена.
        </Callout>
        <View style={{ gap: 8 }}>
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton width="80%" />
        </View>
      </Screen>
      <TabBar
        items={[
          { id: 'dev', label: 'Разработка', icon: 'inbox', badge: 2 },
          { id: 'ask', label: 'Спросить', icon: 'circleHelp' },
          { id: 'review', label: 'Ревью', icon: 'gitPullRequest' },
          { id: 'more', label: 'Ещё', icon: 'ellipsis' },
        ]}
        selected="dev"
      />
    </>
  ),
}

/** Markdown, diff and terminal rendering. */
export const Content: Story = {
  render: () => (
    <>
      <TopBar title="Контент" onBack={() => {}} />
      <Screen padded>
        <Prose
          markdown={`# Отчёт\n\nИсследование показало **три** варианта. Основной — \`relay\`.\n\n- Первый пункт\n- Второй пункт\n\n> Цитата из источника\n\n\`\`\`ts\nconst x = 1\n\`\`\``}
        />
        <DiffView
          lines={['@@ -1,3 +1,4 @@', ' import a', '-const x = 1', '+const x = 2', '+const y = 3']}
        />
        <Terminal lines={['$ bun test', '✓ 12 passed', '! 1 failed']} cursor height={120} />
        <SasCode value="482913" />
        <QrPlaceholder size={160} />
      </Screen>
    </>
  ),
}

/** Empty and loading states. */
export const Empty: Story = {
  render: () => (
    <>
      <TopBar title="Пусто" />
      <Screen scroll={false}>
        <EmptyState
          icon="smartphone"
          title="Подключите установку"
          text="Отсканируйте QR-код в кабинете или Buff Code."
          action={{ label: 'Сканировать', icon: 'qrCode' }}
        />
        <Text align="center" tone="muted" variant="caption">
          — или —
        </Text>
        <EmptyState title="Загрузка" loading />
      </Screen>
    </>
  ),
}
