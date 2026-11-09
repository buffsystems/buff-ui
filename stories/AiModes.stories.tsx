import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AiContextSelect,
  AiModeChip,
  AiModeMatrix,
  AiModeNote,
  AiModePanel,
  AiModeParams,
  AiThinkingSelect,
  Field,
  LocaleProvider,
} from '../src/react/index.ts'
import type { AiModeCell, AiModeStepDef } from '../src/react/index.ts'

// Режимы ИИ (#832, эпик #783): уровень мышления и окно контекста по шагам и ролям — выбор с
// пояснениями, матрица фаз × ролей с наследованием, чип с поповером в шапке сессии, блок
// «Параметры ИИ» на форме создания и строка-заметка в диалоге. Язык — тумблер в тулбаре.

const meta = {
  title: 'Inputs/AI modes',
  component: AiModeMatrix,
  decorators: [
    (Story, ctx) => (
      <LocaleProvider locale={ctx.globals.locale === 'en' ? 'en' : 'ru'}>
        <Story />
      </LocaleProvider>
    ),
  ],
} satisfies Meta<typeof AiModeMatrix>

export default meta
type Story = StoryObj<typeof meta>

const ANALYST = { id: 'analyst', label: { ru: 'Аналитик', en: 'Analyst' } }
const REVIEWER = { id: 'reviewer', label: { ru: 'Ревьюер', en: 'Reviewer' } }
const DEVELOPER = { id: 'developer', label: { ru: 'Разработчик', en: 'Developer' } }
// The dictionary as the server hands it (common-lib ai_modes).
const STEPS: AiModeStepDef[] = [
  {
    id: 'ask',
    label: { ru: 'Спросить', en: 'Ask' },
    roles: [{ id: 'responder', label: { ru: 'Ответчик', en: 'Responder' } }],
  },
  {
    id: 'research',
    label: { ru: 'Глубокое исследование', en: 'Deep research' },
    roles: [ANALYST, REVIEWER],
  },
  { id: 'audit', label: { ru: 'Аудит', en: 'Audit' }, roles: [ANALYST, REVIEWER] },
  {
    id: 'review',
    label: { ru: 'Code review', en: 'Code review' },
    roles: [
      { id: 'summary', label: { ru: 'Сводка изменений', en: 'Change summary' } },
      { id: 'discussion', label: { ru: 'Обсуждение', en: 'Discussion' } },
    ],
  },
  {
    id: 'task_formulate',
    label: { ru: 'Задача — формулировка и доработка', en: 'Task — formulation and rework' },
    roles: [ANALYST, REVIEWER],
  },
  {
    id: 'task_decompose',
    label: { ru: 'Задача — декомпозиция', en: 'Task — decomposition' },
    roles: [ANALYST, REVIEWER],
  },
  {
    id: 'task_analysis',
    label: { ru: 'Задача — аналитика атома', en: 'Task — atom analysis' },
    roles: [ANALYST, REVIEWER],
  },
  {
    id: 'task_develop',
    label: { ru: 'Задача — разработка', en: 'Task — development' },
    roles: [DEVELOPER],
  },
  {
    id: 'task_review',
    label: { ru: 'Задача — ревью реализации', en: 'Task — implementation review' },
    roles: [REVIEWER, ANALYST, DEVELOPER],
  },
  {
    id: 'task_merge',
    label: { ru: 'Задача — слияние конфликтов', en: 'Task — merge conflicts' },
    roles: [ANALYST, REVIEWER, DEVELOPER],
  },
  {
    id: 'ide',
    label: { ru: 'Buff Code через коннектор', en: 'Buff Code via the connector' },
    roles: [DEVELOPER],
  },
]

const INSTALL: AiModeCell[] = [
  { step: 'ask', role: 'responder', thinking: 'medium', context_tokens: 200_000 },
  { step: 'research', role: 'analyst', thinking: 'high', context_tokens: 500_000 },
  { step: 'research', role: 'reviewer', thinking: 'medium', context_tokens: 200_000 },
  { step: 'audit', role: 'analyst', thinking: 'high', context_tokens: 0 },
  { step: 'task_develop', role: 'developer', thinking: 'high', context_tokens: 0 },
]
const ORG: AiModeCell[] = [
  { step: 'ask', role: 'responder', thinking: 'low', context_tokens: null },
  { step: 'task_develop', role: 'developer', thinking: 'max', context_tokens: 500_000 },
]

/** The matrix as the organisation's owner sees it: the installation's values underneath. */
function Matrix({
  inherited,
  own: initial,
  from,
}: {
  inherited: AiModeCell[]
  own: AiModeCell[]
  from: string
}) {
  const [own, setOwn] = useState(initial)
  return (
    <AiModeMatrix
      steps={STEPS}
      own={own}
      inherited={inherited}
      inheritedFrom={from}
      modelWindow={1_048_576}
      onChange={(cells) =>
        setOwn((was) => {
          const rest = was.filter((c) => !cells.some((n) => n.step === c.step && n.role === c.role))
          return [...rest, ...cells.filter((c) => c.thinking != null || c.context_tokens != null)]
        })
      }
    />
  )
}

export const OrganisationOverInstallation: Story = {
  args: {
    steps: STEPS,
    own: ORG,
    inherited: INSTALL,
    inheritedFrom: 'как у установки',
    onChange: () => {},
  },
  render: () => <Matrix inherited={INSTALL} own={ORG} from="как у установки" />,
}

export const InstallationDefaults: Story = {
  args: {
    steps: STEPS,
    own: INSTALL,
    inherited: [],
    inheritedFrom: 'по умолчанию',
    onChange: () => {},
  },
  render: () => <Matrix inherited={[]} own={INSTALL} from="по умолчанию" />,
}

function Choices() {
  const [thinking, setThinking] = useState<string | null>(null)
  const [tokens, setTokens] = useState<number | null>(123_000)
  return (
    <div className="sb-stack" style={{ maxWidth: 420 }}>
      <Field label="Размышления" hint="Как долго модель думает перед ответом">
        <AiThinkingSelect
          value={thinking}
          onChange={setThinking}
          inherited="high"
          inheritedFrom="как у установки"
          available={['low', 'medium', 'high']}
        />
      </Field>
      <Field label="Контекст" hint="Сколько разговора модель держит перед сжатием">
        <AiContextSelect value={tokens} onChange={setTokens} modelWindow={128_000} />
      </Field>
    </div>
  )
}

export const ThinkingAndContext: Story = {
  args: { steps: STEPS, own: [], inherited: [], inheritedFrom: '', onChange: () => {} },
  render: () => <Choices />,
}

function SessionHeader() {
  const [thinking, setThinking] = useState<string | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  const defaults = { thinking: 'high', contextTokens: 200_000 }
  return (
    <div className="sb-stack" style={{ maxWidth: 560 }}>
      <div className="sb-row">
        <span style={{ fontWeight: 600 }}>Как устроен кэш?</span>
        <AiModeChip
          thinking={thinking ?? defaults.thinking}
          contextTokens={tokens ?? defaults.contextTokens}
          modelWindow={1_048_576}
        >
          <AiModePanel
            thinking={thinking}
            contextTokens={tokens}
            defaults={defaults}
            modelWindow={1_048_576}
            onChange={(next) => {
              if ('thinking' in next) setThinking(next.thinking ?? null)
              if ('contextTokens' in next) setTokens(next.contextTokens ?? null)
            }}
          />
        </AiModeChip>
      </div>
      <AiModeNote when="14:02">
        Режим ИИ изменён: размышления — высокие, контекст — средний, 200k. Применится со следующего
        ответа.
      </AiModeNote>
    </div>
  )
}

export const ChipAndNote: Story = {
  args: { steps: STEPS, own: [], inherited: [], inheritedFrom: '', onChange: () => {} },
  render: () => <SessionHeader />,
}

function NewQuestion() {
  const [thinking, setThinking] = useState<string | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  return (
    <div className="sb-stack" style={{ maxWidth: 560 }}>
      <AiModeParams
        thinking={thinking}
        contextTokens={tokens}
        defaults={{ thinking: 'medium', contextTokens: 200_000 }}
        onChange={(next) => {
          if ('thinking' in next) setThinking(next.thinking ?? null)
          if ('contextTokens' in next) setTokens(next.contextTokens ?? null)
        }}
      />
      <AiModeParams
        defaultOpen
        thinking="max"
        contextTokens={null}
        defaults={{ thinking: 'medium', contextTokens: 200_000 }}
        onChange={() => {}}
      />
    </div>
  )
}

export const ParamsOnAForm: Story = {
  args: { steps: STEPS, own: [], inherited: [], inheritedFrom: '', onChange: () => {} },
  render: () => <NewQuestion />,
}
