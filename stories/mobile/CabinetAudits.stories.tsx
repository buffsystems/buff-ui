import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AuditExportSheet,
  AuditPickSheet,
  AuditRunConfirmSheet,
  AuditSectionScreen,
  AuditsLandingScreen,
} from '../../src/native/screens/cabinet/index.ts'
import {
  offline,
  online,
  reportInProgress,
  reportMissing,
  reportReady,
  reportScheduled,
  runs,
  runsPaused,
  sections,
  sectionsFresh,
  shell,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Audits',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Аудиты: the summary — stats, a run in flight, stale sections, every section. */
export const Landing: Story = {
  render: () => (
    <AuditsLandingScreen shell={shell} status={online} sections={sections} runs={runs} />
  ),
}
export const LandingPaused: Story = {
  render: () => (
    <AuditsLandingScreen shell={shell} status={online} sections={sections} runs={runsPaused} />
  ),
}
export const FirstRun: Story = {
  render: () => <AuditsLandingScreen shell={shell} status={online} sections={sectionsFresh} />,
}
export const LandingLoading: Story = {
  render: () => <AuditsLandingScreen shell={shell} status={online} sections={[]} loading />,
}
export const LandingError: Story = {
  render: () => <AuditsLandingScreen shell={shell} status={online} sections={[]} error />,
}
export const LandingOffline: Story = {
  render: () => (
    <AuditsLandingScreen shell={shell} status={offline} sections={sections} runs={runs} />
  ),
}
export const Pick: Story = {
  render: () => (
    <>
      <AuditsLandingScreen shell={shell} status={online} sections={sections} />
      <AuditPickSheet mode="restart" sections={sections} picked={['A-architecture', 'F-process']} />
    </>
  ),
}
export const PickConfirm: Story = {
  render: () => (
    <>
      <AuditsLandingScreen shell={shell} status={online} sections={sectionsFresh} />
      <AuditPickSheet
        mode="launch"
        sections={sectionsFresh}
        picked={sectionsFresh.map((s) => s.id)}
        confirm
      />
    </>
  ),
}
export const CancelConfirm: Story = {
  render: () => (
    <>
      <AuditsLandingScreen shell={shell} status={online} sections={sections} runs={runs} />
      <AuditRunConfirmSheet action="cancel" />
    </>
  ),
}
export const Export: Story = {
  render: () => (
    <>
      <AuditSectionScreen status={online} report={reportReady} />
      <AuditExportSheet section={reportReady.section.title} />
    </>
  ),
}
export const ExportCollecting: Story = {
  render: () => (
    <>
      <AuditsLandingScreen shell={shell} status={online} sections={sections} />
      <AuditExportSheet collecting={{ done: 3, total: 6 }} />
    </>
  ),
}

/** A section's report: stale note, findings counts, the prose. */
export const Report: Story = {
  render: () => <AuditSectionScreen status={online} report={reportReady} />,
}
export const ReportFresh: Story = {
  render: () => (
    <AuditSectionScreen status={online} report={{ ...reportReady, section: sections[1] }} />
  ),
}
export const ReportInProgress: Story = {
  render: () => <AuditSectionScreen status={online} report={reportInProgress} />,
}
export const ReportScheduled: Story = {
  render: () => <AuditSectionScreen status={online} report={reportScheduled} />,
}
export const ReportMissing: Story = {
  render: () => <AuditSectionScreen status={online} report={reportMissing} />,
}
export const ReportLoading: Story = { render: () => <AuditSectionScreen status={online} loading /> }
export const ReportError: Story = { render: () => <AuditSectionScreen status={online} error /> }
export const ReportOffline: Story = {
  render: () => <AuditSectionScreen status={offline} report={reportReady} />,
}
