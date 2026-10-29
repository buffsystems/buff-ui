import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AddDevProjectSheet,
  ProjectTestsScreen,
  ChangesScreen,
  CreateTaskScreen,
  DevListScreen,
  ExportSheet,
  FileDiffScreen,
  ProjectPickerSheet,
  RejectSheet,
  ReworkSheet,
  RunConfirmSheet,
  RunControlsSheet,
  TaskDetailScreen,
} from '../../src/native/screens/cabinet/index.ts'
import {
  changedFiles,
  diffLines,
  history,
  offline,
  online,
  repoPicks,
  shell,
  taskClarify,
  taskGate,
  taskPaused,
  taskRunning,
  tasks,
  tests,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Dev',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Разработка: the task list with the stage chips and the open/closed switch. */
export const List: Story = {
  render: () => (
    <DevListScreen
      shell={shell}
      status={online}
      tasks={tasks}
      state="all"
      moreCount={3}
      project={{ id: 'shop', name: 'shop' }}
    />
  ),
}
/** The project picker (#695), a few projects: no search, no groups. */
export const PickProject: Story = {
  render: () => (
    <>
      <DevListScreen
        shell={shell}
        status={online}
        tasks={tasks}
        project={{ id: 'shop', name: 'shop' }}
      />
      <ProjectPickerSheet
        currentId="shop"
        projects={[
          { id: 'shop', name: 'shop' },
          { id: 'notes', name: 'notes-api' },
          { id: 'site', name: 'site' },
        ]}
      />
    </>
  ),
}
/** An organisation with dozens (buff-demo): a search field leads, groups by kind. */
export const PickProjectMany: Story = {
  render: () => (
    <>
      <DevListScreen
        shell={shell}
        status={online}
        tasks={tasks}
        project={{ id: 'p3', name: 'acme-api' }}
      />
      <ProjectPickerSheet
        currentId="p3"
        projects={[
          ...[
            'dev_project',
            'notes-api',
            'acme-api',
            'acme-api-2',
            'catalog',
            'storefront',
            'market',
            'phone-proj',
            'sync-demo',
            'pp529',
          ].map((name, i) => ({ id: `p${i + 1}`, name })),
          { id: 'g1', name: 'notes-web', kind: 'git' as const },
          { id: 's1', name: 'Регламенты', kind: 'space' as const },
          { id: 's2', name: 'product-kb', kind: 'space' as const },
        ]}
      />
    </>
  ),
}
export const ListFiltered: Story = {
  render: () => (
    <DevListScreen shell={shell} status={online} tasks={tasks} state="all" filter="review" />
  ),
}
export const ListEmpty: Story = {
  render: () => <DevListScreen shell={shell} status={online} tasks={[]} />,
}
/** A reader (demo guest, a member without the right, #666): no «Новая задача», no invitation. */
export const ListReadOnly: Story = {
  render: () => <DevListScreen shell={shell} status={online} tasks={[]} canCreate={false} />,
}
export const ListToolsNotReady: Story = {
  render: () => <DevListScreen shell={shell} status={online} tasks={[]} toolsReady={false} />,
}
export const ListLoading: Story = {
  render: () => <DevListScreen shell={shell} status={online} tasks={[]} loading />,
}
export const ListError: Story = {
  render: () => <DevListScreen shell={shell} status={online} tasks={[]} error />,
}
export const ListOffline: Story = {
  render: () => <DevListScreen shell={shell} status={offline} tasks={tasks} state="all" />,
}

/** The clarify gate: the analyst's questions with options and a free answer. */
export const DetailClarify: Story = {
  render: () => (
    <TaskDetailScreen
      status={online}
      task={taskClarify}
      picks={{ q1: { options: [0], free: '' }, q2: { options: [0, 1], free: '' } }}
    />
  ),
}
export const DetailGate: Story = {
  render: () => <TaskDetailScreen status={online} task={taskGate} />,
}
export const DetailGateNoRight: Story = {
  render: () => <TaskDetailScreen status={online} task={taskGate} canAct={false} />,
}
export const DetailGateSent: Story = {
  render: () => <TaskDetailScreen status={online} task={taskGate} gateSent />,
}
export const DetailBaselineGate: Story = {
  render: () => (
    <TaskDetailScreen
      status={online}
      task={{
        ...taskGate,
        phase: 'preparing',
        formulation: undefined,
        baseline: {
          invite:
            'До этой задачи уже не проходили **2** теста: `search.test.ts › trims`, `store.test.ts › order`.',
        },
      }}
    />
  ),
}
export const DetailRunning: Story = {
  render: () => <TaskDetailScreen status={online} task={taskRunning} tests={tests} />,
}
export const DetailPaused: Story = {
  render: () => <TaskDetailScreen status={online} task={taskPaused} />,
}
export const DetailSubtasks: Story = {
  render: () => <TaskDetailScreen status={online} task={taskRunning} tab="subtasks" />,
}
export const DetailTests: Story = {
  render: () => <TaskDetailScreen status={online} task={taskRunning} tab="tests" tests={tests} />,
}
export const DetailTestsEmpty: Story = {
  render: () => <TaskDetailScreen status={online} task={taskRunning} tab="tests" />,
}
export const DetailHistory: Story = {
  render: () => (
    <TaskDetailScreen status={online} task={taskRunning} tab="history" history={history} />
  ),
}
export const DetailMetrics: Story = {
  render: () => <TaskDetailScreen status={online} task={taskRunning} tab="metrics" />,
}
export const DetailLoading: Story = {
  render: () => <TaskDetailScreen status={online} loading />,
}
export const DetailNotFound: Story = {
  render: () => <TaskDetailScreen status={online} notFound />,
}
export const DetailOffline: Story = {
  render: () => <TaskDetailScreen status={offline} task={taskGate} />,
}

/** The «⋯» actions of a running task, and one confirmation. */
export const RunControls: Story = {
  render: () => (
    <>
      <TaskDetailScreen status={online} task={taskRunning} />
      <RunControlsSheet actions={['pause', 'stop', 'close']} />
    </>
  ),
}
export const StopConfirm: Story = {
  render: () => (
    <>
      <TaskDetailScreen status={online} task={taskRunning} />
      <RunConfirmSheet action="stop" />
    </>
  ),
}
export const Rework: Story = {
  render: () => (
    <>
      <TaskDetailScreen status={online} task={taskGate} />
      <ReworkSheet note="Уточнить, что делать с очередью при перезапуске" />
    </>
  ),
}
export const Reject: Story = {
  render: () => (
    <>
      <TaskDetailScreen status={online} task={taskGate} />
      <RejectSheet />
    </>
  ),
}
export const Export: Story = {
  render: () => (
    <>
      <TaskDetailScreen status={online} task={taskGate} />
      <ExportSheet title="Выгрузить задачу" onPdf={() => {}} onMarkdown={() => {}} />
    </>
  ),
}

export const Changes: Story = {
  render: () => <ChangesScreen status={online} taskNumber={139} files={changedFiles} />,
}
export const ChangesEmpty: Story = {
  render: () => <ChangesScreen status={online} taskNumber={139} files={[]} />,
}
export const ChangesOffline: Story = {
  render: () => <ChangesScreen status={offline} taskNumber={139} files={changedFiles} />,
}
export const FileDiff: Story = {
  render: () => <FileDiffScreen status={online} path="src/payments/service.ts" lines={diffLines} />,
}

export const CreateTask: Story = {
  render: () => (
    <CreateTaskScreen
      status={online}
      project={{ id: 'p1', name: 'billing-service' }}
      statement="Добавить экспорт отчёта в PDF"
      staged={[{ id: 's1', name: 'макет.png', size: 212_000, kind: 'image', progress: 0.4 }]}
    />
  ),
}
export const CreateTaskEmpty: Story = {
  render: () => <CreateTaskScreen status={online} />,
}
export const CreateTaskOffline: Story = {
  render: () => (
    <CreateTaskScreen status={offline} project={{ id: 'p1', name: 'billing-service' }} />
  ),
}
export const AddDevProject: Story = {
  render: () => (
    <>
      <DevListScreen shell={shell} status={online} tasks={[]} />
      <AddDevProjectSheet
        name="billing"
        repos={repoPicks}
        picked={{ 'billing-service': 'develop' }}
      />
    </>
  ),
}
export const AddDevProjectBusy: Story = {
  render: () => (
    <>
      <DevListScreen shell={shell} status={online} tasks={[]} />
      <AddDevProjectSheet
        repos={repoPicks}
        picked={{}}
        busy
        statusText="Клонируем billing-service…"
      />
    </>
  ),
}

export const ProjectTests: Story = {
  render: () => (
    <ProjectTestsScreen
      status={online}
      project="dev_project"
      capturedAt="23 окт., 14:10"
      stale
      tests={[
        { file: 'src/search.test.ts', case: 'trims the query', status: 'active' },
        {
          file: 'src/store.test.ts',
          case: 'keeps the order',
          status: 'disabled',
          scope: 'permanent',
          reason: 'flaky on CI',
        },
      ]}
    />
  ),
}
