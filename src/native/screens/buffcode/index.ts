/*
  The Buff Code machine screens (#629): what the window shows of a machine, as phone screens.
  Importing this module registers the area's strings.
*/
import '../../strings/buffcode.ts'
import '../../strings/buffcode-side.ts'
import '../../strings/buffcode-work.ts'

export type {
  Automation,
  AutomationRun,
  BcAgent,
  BcModel,
  BcProject,
  BcSession,
  // The cabinet exports its own ChangedFile / Question / QuestionOption: these carry a prefix.
  ChangedFile as BcChangedFile,
  Dock,
  FileNode,
  GitState,
  GoalBarState,
  McpField,
  McpRequest,
  PermissionMode,
  PermissionRequest,
  Question as BcQuestion,
  QuestionOption as BcQuestionOption,
  SessionDetails,
  SessionOrigin,
  SideMessage,
  SlashCommand,
  TimelineItem,
  ToolStatus,
  TrustItem,
  Usage,
  WebSearchRequest,
  Workflow,
  WorkflowArg,
  WorkflowRun,
} from './model.ts'
export { Eyebrow, Gutter, isLive, MachineShell, ORIGIN_ICON, originLabel } from './shell.tsx'
export { ProjectRow, ProjectsScreen } from './projects.tsx'
export { DeleteSessionSheet, SessionActionsSheet, SessionRow, SessionsScreen } from './sessions.tsx'
export { MODE_KEY, NewSessionScreen, PermissionModeControl } from './new-session.tsx'
export { PickerSheet } from './picker.tsx'
export { AssistantTurn, TimelinePart, UserTurn } from './timeline-parts.tsx'
export { BackgroundWork, statusTone, ToolCall } from './tool-parts.tsx'
export { AttachSheet, Composer } from './composer.tsx'
export { AttachmentChip, ComposerChip } from './composer-parts.tsx'
export { DockFrame, PermissionDock } from './docks.tsx'
export { McpDock, WebSearchDock } from './docks-more.tsx'
export type { McpValues } from './docks-more.tsx'
export { QuestionDock } from './question-dock.tsx'
export { ActionPaletteSheet, filterCommands, SlashSuggestions } from './commands.tsx'
export type { PaletteAction } from './commands.tsx'
export { ViewMenu, ViewSwitcher } from './views.tsx'
export { ChangedFileCard, ChangesView, UsageView } from './changes-usage.tsx'
export type { SessionView } from './views.tsx'
export { FilesView, FileViewer, TerminalView } from './files-terminal.tsx'
export { SessionScreen } from './session.tsx'
export type { SessionScreenProps } from './session.tsx'
export { GitChip, GitSheet } from './git.tsx'
export { TrustSheet, TrustStrip } from './trust.tsx'
export { SideConversationScreen } from './side.tsx'
export { SessionDetailsSheet } from './session-details.tsx'
export { AutomationCard, AutomationsScreen } from './automations.tsx'
export { AutomationHistorySheet, DeleteAutomationSheet } from './automation-sheets.tsx'
export { AutomationEditorScreen } from './automation-editor.tsx'
export type { AutomationDraft, ScheduleKind } from './automation-editor.tsx'
export { WorkflowCard, WorkflowsScreen } from './workflows.tsx'
export { WorkflowStartSheet } from './workflow-start.tsx'
export { WorkflowRunScreen } from './workflow-run.tsx'
