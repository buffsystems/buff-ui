/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { useFollowEnd } from '../../follow-end.ts'
import type { Attachment, Install, InstallStatus } from '../../model.ts'
import { useT, useTheme } from '../../theme.tsx'
import { Composer } from './composer.tsx'
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
  GoalBarState,
  FileNode,
  GitState,
  PermissionMode,
  SlashCommand,
  TimelineItem,
  TrustItem,
  Usage,
} from './model.ts'
import { QuestionDock } from './question-dock.tsx'
import { JumpToLatest, SessionContextLine, WaitingAboveNote } from './session-parts.tsx'
import { isLive, MachineShell } from './shell.tsx'
import { TimelinePart } from './timeline-parts.tsx'
import { ChangesView, UsageView } from './changes-usage.tsx'
import { ViewSwitcher, type SessionView } from './views.tsx'

export interface SessionScreenProps {
  install: Install
  status: InstallStatus
  session: BcSession
  project: BcProject
  items: TimelineItem[]
  running?: boolean
  view?: SessionView
  dock?: Dock
  /** The session's goal, shown above the composer (#711). */
  goal?: GoalBarState
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
    /** The host's viewer of the whole file (#710). */
    preview?: ReactNode
    binary?: { mime: string; bytes: number }
    loading?: boolean
  }
  terminal?: string[]
  usage?: Usage
  prompt?: string
  attachments?: Attachment[]
  /** The `/` autocomplete is open with this query. */
  slashQuery?: string
  commands?: SlashCommand[]
  model?: string
  agent?: string
  mode?: PermissionMode
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
  /** Older messages above the loaded ones; absent when the timeline starts here. */
  onEarlier?: () => void
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
  onWebSearch?: (providerId: string) => void
  onWebSearchOff?: () => void
  onOpenFile?: (path: string) => void
  /** A file the agent handed over (#708): the app shows it or gives it to the system. */
  onOpenSent?: (file: { path: string; name: string; mime: string }) => void
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
  onWebSearch,
  onWebSearchOff,
}: Pick<
  SessionScreenProps,
  'dock' | 'onDecide' | 'onReply' | 'onMcpSend' | 'onMcpDecline' | 'onWebSearch' | 'onWebSearchOff'
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
          preview={p.openFile.preview}
          binary={p.openFile.binary}
          loading={p.openFile.loading}
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
            onScroll={follow.onScroll}
            onContentSizeChange={follow.onContentSizeChange}
          >
            {p.onEarlier && (
              <Button size="sm" variant="ghost" leadingIcon="history" onPress={p.onEarlier}>
                {tr('buffcode.older')}
              </Button>
            )}
            {p.items.map((item) => (
              <TimelinePart key={item.id} item={item} disabled={!live} onOpenSent={p.onOpenSent} />
            ))}
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
          dock={p.dock}
          disabled={!live}
          onDecide={p.onDecide}
          onReply={p.onReply}
          onMcpSend={p.onMcpSend}
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
          {p.dock ? (
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
                git={p.git}
                mode={p.mode}
                disabled={!live}
                onPress={p.onDetails}
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
    </MachineShell>
  )
}
