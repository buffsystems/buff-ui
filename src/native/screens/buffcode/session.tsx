/** @jsxRuntime automatic */
import { Fragment, useState, type ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { useFollowEnd } from '../../follow-end.ts'
import { useNearTop } from '../../near-top.ts'
import type { Attachment, Install, InstallStatus } from '../../model.ts'
import type { Download } from '../../download.ts'
import { useT, useTheme } from '../../theme.tsx'
import { Composer } from './composer.tsx'
import { QueuedMessages, type QueuedMessage } from './queue.tsx'
import { GoalBar } from './goal-bar.tsx'
import { SlashSuggestions } from './commands.tsx'
import { PermissionDock } from './docks.tsx'
import { McpDock, WebSearchDock, type McpValues } from './docks-more.tsx'
import { FilesView, FileViewer, TerminalView } from './files-terminal.tsx'
import { GitChip } from './git.tsx'
import { TrustStrip } from './trust.tsx'
import type {
  BcProject,
  BcSession,
  ChangedFile,
  Dock,
  FileChoice,
  GoalBarState,
  FileNode,
  GitState,
  PermissionMode,
  SlashCommand,
  SubagentRef,
  TimelineItem,
  TrustItem,
  Usage,
} from './model.ts'
import { QuestionDock } from './question-dock.tsx'
import {
  JumpToLatest,
  ReadOnlyNote,
  SessionContextLine,
  WaitingAboveNote,
  WorkingLine,
} from './session-parts.tsx'
import { isLive, MachineShell } from './shell.tsx'
import { SubagentsLine, SubagentsSheet } from './subagents.tsx'
import { TimelinePart } from './timeline-parts.tsx'
import { foldTools, ToolGroup } from './tool-group.tsx'
import { ChangesView, UsageView } from './changes-usage.tsx'
import { ViewSwitcher, type SessionView } from './views.tsx'

export interface SessionScreenProps {
  install: Install
  status: InstallStatus
  session: BcSession
  project: BcProject
  items: TimelineItem[]
  running?: boolean
  /** The machine works on the latest turn (#742): the line under the timeline, with the timer. */
  working?: { elapsed?: string }
  view?: SessionView
  dock?: Dock
  /** The session's goal, shown above the composer (#711). */
  goal?: GoalBarState
  /** The session's subagents (#753, #762): the working ones behind the composer's icon; a tap opens one read-only. */
  subagents?: SubagentRef[]
  /** A subagent's session (#753): no composer and no docks, the parent session answers. */
  readOnly?: boolean
  /** Messages sent while the agent worked (#812): they wait for the end of its turn. */
  queued?: QueuedMessage[]
  onQueuedCancel?: (id: string) => void
  onQueuedSend?: (id: string) => void
  trust?: TrustItem[]
  git?: GitState
  changes?: ChangedFile[]
  nodes?: FileNode[]
  /** The opened file; a picture carries `image` (a data: URI) and shows as the picture (#27). */
  openFile?: {
    path: string
    content: string
    language?: string
    image?: string
    /** A page (#808): the host's rendering of it, with «Code» one tap away. */
    page?: ReactNode
    /** The host's viewer of the whole file (#710). */
    preview?: ReactNode
    binary?: { mime: string; bytes: number }
    loading?: boolean
    /** How much of it came (#809). */
    progress?: Download
  }
  terminal?: string[]
  usage?: Usage
  prompt?: string
  attachments?: Attachment[]
  /** The `/` autocomplete is open with this query. */
  slashQuery?: string
  commands?: SlashCommand[]
  model?: string
  /** The model's thinking mode (#759) by its variant id, named in the context line. */
  variant?: string
  agent?: string
  mode?: PermissionMode
  /** The plan mark (#760): the composer's mode icon shows the plan. */
  plan?: boolean
  loading?: boolean
  /** Where the timeline opens: at the latest message (default) or at the top (a story). */
  initialScroll?: 'end' | 'top'
  onBack?: () => void
  onMenu?: () => void
  onDetails?: () => void
  onView?: (view: SessionView) => void
  onMore?: () => void
  onSide?: () => void
  onPrompt?: (text: string) => void
  onSend?: () => void
  onStop?: () => void
  onAttach?: () => void
  onRemoveAttachment?: (id: string) => void
  /** Older messages above the loaded ones; absent when the timeline starts here. Also asked by
   *  itself as the reader scrolls up near the top (#766). */
  onEarlier?: () => void
  /** The earlier page is on its way. */
  loadingEarlier?: boolean
  /** The terminal's command line and whether its command still runs. */
  terminalCommand?: string
  terminalRunning?: boolean
  onTerminalCommand?: (text: string) => void
  onTerminalRun?: () => void
  onTerminalInterrupt?: () => void
  onShareFile?: () => void
  onGoalPause?: () => void
  onGoalResume?: () => void
  onGoalClear?: () => void
  /** The system's viewer of the open file (#710). */
  onPreviewFile?: () => void
  onAddFileToChat?: () => void
  onCommands?: () => void
  onPickCommand?: (name: string) => void
  onModel?: () => void
  onMode?: () => void
  onGit?: () => void
  onTrustCheck?: () => void
  onTrustHide?: () => void
  onDecide?: (decision: 'once' | 'always' | 'reject', reason?: string) => void
  onReply?: (answers: string[]) => void
  onMcpSend?: (values: McpValues) => void
  onMcpDecline?: () => void
  /** A link in a form (#765): the app opens it outside. */
  onMcpOpen?: (url: string) => void
  onWebSearch?: (providerId: string) => void
  onWebSearchOff?: () => void
  onOpenFile?: (path: string) => void
  /** A file the agent handed over (#708): the app shows it or gives it to the system. */
  onOpenSent?: (file: { path: string; name: string; mime: string }) => void
  /** A subagent's card or its line in the bar was tapped (#753). */
  onOpenSubagent?: (sessionID: string) => void
  /** A way on after the model refused a request with files (#757). */
  onFileChoice?: (choice: FileChoice, id: string) => void
  /** A compaction's summary was opened (#761): fetch the whole text. */
  onOpenCompaction?: (id: string) => void
  onCloseFile?: () => void
  onRepair?: () => void
}

function DockView({
  dock,
  disabled,
  onDecide,
  onReply,
  onMcpSend,
  onMcpDecline,
  onMcpOpen,
  onWebSearch,
  onWebSearchOff,
}: Pick<
  SessionScreenProps,
  | 'dock'
  | 'onDecide'
  | 'onReply'
  | 'onMcpSend'
  | 'onMcpDecline'
  | 'onMcpOpen'
  | 'onWebSearch'
  | 'onWebSearchOff'
> & { disabled: boolean }) {
  if (!dock) return null
  switch (dock.kind) {
    case 'permission':
      return <PermissionDock request={dock.request} disabled={disabled} onDecide={onDecide} />
    case 'question':
      return (
        <QuestionDock
          // A new question starts clean: the picks of the last one do not carry over.
          key={dock.index}
          questions={dock.questions}
          index={dock.index}
          disabled={disabled}
          onReply={onReply}
          onNext={onReply}
        />
      )
    case 'mcp':
      return (
        <McpDock
          request={dock.request}
          disabled={disabled}
          onSend={onMcpSend}
          onDecline={onMcpDecline}
          onOpen={onMcpOpen}
        />
      )
    case 'websearch':
      return (
        <WebSearchDock
          request={dock.request}
          disabled={disabled}
          onEnable={onWebSearch}
          onDisable={onWebSearchOff}
        />
      )
  }
}

/** The session on a phone: the view switcher over one panel, the docks and the composer. */
export function SessionScreen(p: SessionScreenProps) {
  const t = useTheme()
  const tr = useT()
  const live = isLive(p.status)
  const view = p.view ?? 'session'
  // The timeline opens at the latest message, keeps up with the agent while the reader is at the
  // bottom (#703) and offers a way back to it once scrolled up.
  const follow = useFollowEnd(p.initialScroll === 'top' ? 'top' : 'end')
  const top = useNearTop(p.loadingEarlier ? undefined : p.onEarlier)
  const part = (item: TimelineItem) => (
    <TimelinePart
      item={item}
      disabled={!live}
      onOpenSent={p.onOpenSent}
      onOpenSubagent={p.onOpenSubagent}
      onFileChoice={p.onFileChoice}
      onOpenCompaction={p.onOpenCompaction}
    />
  )
  // The working subagents (#762): the composer's icon and its list.
  const working = (p.subagents ?? []).filter((x) => x.status === 'running')
  const [subagentsOpen, setSubagentsOpen] = useState(false)
  const body = () => {
    if (view === 'changes')
      return (
        <ChangesView
          files={p.changes ?? []}
          loading={p.loading}
          disabled={!live}
          onOpenFile={p.onOpenFile}
        />
      )
    if (view === 'files')
      return p.openFile ? (
        <FileViewer
          path={p.openFile.path}
          content={p.openFile.content}
          image={p.openFile.image}
          page={p.openFile.page}
          preview={p.openFile.preview}
          binary={p.openFile.binary}
          loading={p.openFile.loading}
          progress={p.openFile.progress}
          language={p.openFile.language}
          disabled={!live}
          onBack={p.onCloseFile}
          onShare={p.onShareFile}
          onPreview={p.onPreviewFile}
          onAddToChat={p.onAddFileToChat}
        />
      ) : (
        <FilesView nodes={p.nodes ?? []} loading={p.loading} onOpen={p.onOpenFile} />
      )
    if (view === 'terminal')
      return (
        <TerminalView
          lines={p.terminal ?? []}
          command={p.terminalCommand}
          running={p.terminalRunning}
          disabled={!live}
          onCommand={p.onTerminalCommand}
          onRun={p.onTerminalRun}
          onInterrupt={p.onTerminalInterrupt}
        />
      )
    if (view === 'usage' && p.usage) return <UsageView usage={p.usage} />
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={follow.ref}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: t.space(4), gap: t.space(4) }}
            scrollEventThrottle={100}
            onScroll={(e) => {
              follow.onScroll(e)
              top.onScroll(e)
            }}
            onScrollBeginDrag={top.onScrollBeginDrag}
            onContentSizeChange={follow.onContentSizeChange}
            // An earlier page lands above: the message being read stays where it was (#766).
            maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
          >
            {p.onEarlier && (
              <Button
                size="sm"
                variant="ghost"
                leadingIcon="history"
                loading={p.loadingEarlier ?? false}
                onPress={p.onEarlier}
              >
                {tr('buffcode.older')}
              </Button>
            )}
            {foldTools(p.items).map((item) =>
              item.kind === 'tools' ? (
                <ToolGroup key={item.id} items={item.items} render={part} />
              ) : (
                <Fragment key={item.id}>{part(item)}</Fragment>
              ),
            )}
            {/* A dock waiting for the person takes the place of the working line. */}
            {p.working && !p.dock && <WorkingLine elapsed={p.working.elapsed} />}
          </ScrollView>
          {!follow.atEnd && <JumpToLatest onPress={follow.toEnd} />}
        </View>
        {p.trust && p.trust.length > 0 && (
          <TrustStrip
            items={p.trust}
            disabled={!live}
            onCheck={p.onTrustCheck}
            onHide={p.onTrustHide}
          />
        )}
        {p.dock && !p.readOnly && working.length > 0 && (
          <SubagentsLine count={working.length} onPress={() => setSubagentsOpen(true)} />
        )}
        {p.goal && !p.dock && (
          <GoalBar
            goal={p.goal}
            disabled={!live}
            onPause={p.onGoalPause}
            onResume={p.onGoalResume}
            onClear={p.onGoalClear}
          />
        )}
        <DockView
          dock={p.readOnly ? undefined : p.dock}
          disabled={!live}
          onDecide={p.onDecide}
          onReply={p.onReply}
          onMcpSend={p.onMcpSend}
          onMcpOpen={p.onMcpOpen}
          onMcpDecline={p.onMcpDecline}
          onWebSearch={p.onWebSearch}
          onWebSearchOff={p.onWebSearchOff}
        />
        {p.slashQuery !== undefined && (
          <SlashSuggestions
            commands={p.commands ?? []}
            query={p.slashQuery}
            onPick={p.onPickCommand}
          />
        )}
        <View style={{ borderTopWidth: 1, borderTopColor: t.colors.border }}>
          {p.readOnly ? (
            <ReadOnlyNote />
          ) : p.dock ? (
            // A dock waits for the person: the chat input would compete with it.
            <WaitingAboveNote />
          ) : (
            <>
              {p.git && p.onGit && (
                <View
                  style={{
                    paddingHorizontal: t.space(4),
                    paddingTop: t.space(2),
                    flexDirection: 'row',
                  }}
                >
                  <GitChip state={p.git} disabled={!live} onPress={p.onGit} />
                </View>
              )}
              <SessionContextLine
                model={p.model}
                variant={p.variant}
                git={p.git}
                mode={p.mode}
                plan={p.plan ?? false}
                disabled={!live}
                onPress={p.onDetails}
              />
              <QueuedMessages
                items={p.queued ?? []}
                disabled={!live}
                onCancel={p.onQueuedCancel}
                onSendNow={p.onQueuedSend}
              />
              <Composer
                value={p.prompt}
                running={p.running}
                disabled={!live}
                attachments={p.attachments}
                onChange={p.onPrompt}
                onSend={p.onSend}
                onStop={p.onStop}
                onAttach={p.onAttach}
                onRemoveAttachment={p.onRemoveAttachment}
                onCommands={p.onCommands}
                {...(p.mode ? { mode: p.mode, plan: p.plan ?? false, onMode: p.onDetails } : {})}
                subagents={working.length}
                onSubagents={() => setSubagentsOpen(true)}
              />
            </>
          )}
        </View>
      </View>
    )
  }
  return (
    <MachineShell
      install={p.install}
      status={p.status}
      title={p.session.title}
      subtitle={`${p.project.name} · ${p.install.name}`}
      onBack={p.onBack}
      onMenu={p.onMenu}
      onRepair={p.onRepair}
      scroll={false}
      actions={
        <IconButton
          icon="messageSquare"
          label={tr('buffcode.sideTitle')}
          onPress={p.onSide}
          disabled={!live}
        />
      }
    >
      <ViewSwitcher
        current={view}
        changes={p.changes?.length}
        onSelect={p.onView}
        onMore={p.onMore}
      />
      {body()}
      {subagentsOpen && working.length > 0 && (
        <SubagentsSheet
          subagents={working}
          disabled={!live}
          onOpen={(id) => (setSubagentsOpen(false), p.onOpenSubagent?.(id))}
          onClose={() => setSubagentsOpen(false)}
        />
      )}
    </MachineShell>
  )
}
