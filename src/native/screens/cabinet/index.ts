/*
  The cabinet sections of the mobile app (#629): the shell and the seven sections — one
  directory each. Importing this file registers every cabinet string dictionary.
*/
import '../../strings/cabinet.ts'
import '../../strings/cabinet-dev.ts'
import '../../strings/cabinet-dev-detail.ts'
import '../../strings/cabinet-dev-tools.ts'
import '../../strings/cabinet-ask.ts'
import '../../strings/cabinet-research.ts'
import '../../strings/cabinet-review.ts'
import '../../strings/cabinet-review-decide.ts'
import '../../strings/cabinet-knowledge.ts'
import '../../strings/cabinet-knowledge-editor.ts'
import '../../strings/cabinet-audits.ts'
import '../../strings/cabinet-repos.ts'
import '../../strings/cabinet-search.ts'

export { MORE_SECTIONS, SECTION_ICON, SECTION_IDS } from './model.ts'
export type { ProjectKind, ProjectRef, SectionId, ShellProps } from './model.ts'
export { CabinetShell, MoreSectionsSheet, sectionLabel, sectionTitle } from './shell.tsx'
export { ListHeader, ListSkeleton, LoadError, TabStrip } from './parts.tsx'
export { matchProjects, ProjectLink, ProjectPickerSheet } from './project-pick.tsx'
export {
  AttachSourceSheet,
  AttachmentRow,
  noPicturesText,
  ThreadComposer,
  formatSize,
} from './attachments.tsx'
export type { StripTab } from './parts.tsx'
export { AskedQuestions, QuestionForm } from './questions.tsx'
export type { Picks, Question, QuestionOption } from './questions.tsx'

export { STAGE_ORDER } from './dev/model.ts'
export type {
  ChangedFile,
  ChangeKind,
  GatePhase,
  HistoryEvent,
  HistoryTone,
  Pause,
  PostPoolStep,
  RepoBranchPick,
  RunAction,
  Subtask,
  TaskDetail,
  TaskMetricsData,
  TaskRow,
  TaskStage,
  TaskStageId,
  TestEntry,
  UpstreamHold,
} from './dev/model.ts'
export {
  StagePipe,
  StageStrip,
  stageLabel,
  stripHeadline,
  taskStatus,
  taskSubtitle,
} from './dev/stage.tsx'
export { DevListScreen, matchesFilter, TaskCard } from './dev/list.tsx'
export type { StageFilter, StateFilter } from './dev/list.tsx'
export { TaskDetailScreen } from './dev/detail.tsx'
export { BaselinePanel } from './dev/gate.tsx'
export type { DetailTab } from './dev/detail.tsx'
export { DetailsTab, statusText } from './dev/details-tab.tsx'
export { ClarifyPanel, GatePanel, RejectSheet, ReworkSheet } from './dev/gate.tsx'
export {
  ExportSheet,
  PauseNotice,
  pauseLine,
  runActions,
  RunConfirmSheet,
  RunControlsSheet,
} from './dev/controls.tsx'
export { ChangesScreen, FileDiffScreen, TestsTab } from './dev/changes.tsx'
export type { TestFilter } from './dev/changes.tsx'
export { HistoryTab, MetricsTiles } from './dev/history.tsx'
export { AddDevProjectSheet, CreateTaskScreen } from './dev/create.tsx'

export type { AskKind, AskMessage, AskStatus, AskThread, AskThreadRow } from './ask/model.ts'
export {
  AskListScreen,
  DeleteThreadSheet,
  RenameSheet,
  ThreadActionsSheet,
  ThreadRow,
} from './ask/list.tsx'
export { AskThreadScreen } from './ask/thread.tsx'
export { MessageList, ThinkingLine } from './ask/messages.tsx'
export { NewQuestionScreen } from './ask/new.tsx'

export type {
  Research,
  ResearchRole,
  ResearchRow,
  ResearchStatus,
  ResearchTurn,
} from './research/model.ts'
export { DeleteResearchSheet, NewResearchScreen, ResearchListScreen } from './research/list.tsx'
export { ResearchConfirmSheet, ResearchScreen } from './research/detail.tsx'

export type {
  ApproveRepo,
  CheckRun,
  CheckStatus,
  Finding,
  FindingDraft,
  FindingStatus,
  RepoProvider,
  Review,
  ReviewChecks,
  ReviewFile,
  ReviewFileStatus,
  ReviewPr,
  ReviewQueueRow,
} from './review/model.ts'
export { QueueCard, ReviewNotOnGateScreen, ReviewQueueScreen } from './review/queue.tsx'
export { ReviewScreen } from './review/detail.tsx'
export type { ReviewTab } from './review/detail.tsx'
export { ChecksBlock } from './review/checks.tsx'
export type { PromptLoad } from './knowledge/load.tsx'
export { CheckLogScreen } from './review/log.tsx'
export type { CheckLogStep } from './review/log.tsx'
export { ChangesTab, ReviewFileRow } from './review/files.tsx'
export { FindingCard, FindingsTab, matchesFindingFilter } from './review/findings.tsx'
export { FindingSheet } from './review/finding-sheet.tsx'
export type { FindingFilter } from './review/findings.tsx'
export { BlockedSheet, DecisionBar, openFindings, ReworkConfirmSheet } from './review/decide.tsx'

export { KNOWLEDGE_TYPES } from './knowledge/model.ts'
export type {
  KnowledgeEntry,
  KnowledgeFilter,
  KnowledgeForm,
  KnowledgePass,
  KnowledgeType,
} from './knowledge/model.ts'
export { KnowledgeListScreen } from './knowledge/list.tsx'
export { entryBadges, KnowledgeRow, typeLabel } from './knowledge/row.tsx'
export { ArchiveSheet, KnowledgeEntryScreen } from './knowledge/entry.tsx'
export { KnowledgeEditorScreen } from './knowledge/editor.tsx'
export { KnowledgePassCard, passLine } from './knowledge/pass.tsx'

export { isLocked, isStale } from './audits/model.ts'
export type { AuditReport, AuditRun, AuditSection, AuditStatus } from './audits/model.ts'
export { AuditsLandingScreen } from './audits/landing.tsx'
export { AuditsSummary, sectionStatus } from './audits/summary.tsx'
export { AuditSectionScreen, FindingCountsCard } from './audits/report.tsx'
export { AuditExportSheet, AuditRunConfirmSheet, PausedRunCard } from './audits/run.tsx'

export { driftOf } from './repos/model.ts'
export type {
  AddRepoForm,
  BranchSyncStatus,
  HoldStatus,
  Repo,
  RepoBranch,
  RepoHold,
} from './repos/model.ts'
export { ReposListScreen } from './repos/list.tsx'
export { branchBadge, RepoCard } from './repos/card.tsx'
export { AddRepoSheet, defaultDevName, RemoveRepoSheet, urlValid } from './repos/add.tsx'
export { ApproveSheet } from './review/approve.tsx'
export { AuditPickSheet } from './audits/pick.tsx'
export { SEARCH_KINDS, SearchScreen } from './search/search.tsx'
export type { SearchHitRow, SearchKind } from './search/search.tsx'
export { ProjectTestsScreen } from './dev/project-tests.tsx'
