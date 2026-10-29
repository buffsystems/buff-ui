/*
  `@buff/ui/native` — the React Native face of the design system (#629): the theme made of
  the shared tokens, the primitives, and the presentational screens of the mobile app. Icons
  come from the host (`NativeProvider icons=`), so the package carries no native dependency.
*/
export {
  faceWeight,
  makeTheme,
  NATIVE_FACES,
  NativeProvider,
  useIcons,
  useLocale,
  useT,
  useTheme,
} from './theme.tsx'
export type { FontWeight, NativeProviderProps, NativeTheme, Scheme } from './theme.tsx'
export { ICON_NAMES } from './icons.ts'
export type { IconComponent, IconName, IconProps, IconSet } from './icons.ts'
export { defineStrings, makeTranslate, rubles, registeredStrings } from './i18n.ts'
export type { Dictionary, Locale, Translate } from './i18n.ts'
export { DEFAULT_LOCALE, isLanguageChoice, pickLocale, resolveLocale } from '../shared/locale.ts'
export type { LanguageChoice } from '../shared/locale.ts'
export { S as commonStrings } from './strings/common.ts'
export { auditSectionAbout, auditSectionTitle } from './strings/audit-sections.ts'

export { Icon } from './Icon.tsx'
export { Text, toneColor } from './Text.tsx'
export type { TextProps, TextTone, TextVariant } from './Text.tsx'
export { Button, IconButton } from './Button.tsx'
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button.tsx'
export { Badge, StatusDot, toneColors } from './Badge.tsx'
export type { Tone } from './Badge.tsx'
export { Chip, ChipRow } from './Chip.tsx'
export { Choice } from './Choice.tsx'
export { Card, KeyValue, SectionHeader } from './Card.tsx'
export { Disclosure } from './Disclosure.tsx'
export { Row, RowGroup, SectionTitle } from './Row.tsx'
export { Callout, EmptyState, Separator, Skeleton, Spinner, Toast } from './Feedback.tsx'
export { Avatar, avatarColorFor } from './Avatar.tsx'
export { Screen, TabBar, TopBar } from './Screen.tsx'
export type { TabItem } from './Screen.tsx'
export { Field, Input, Segmented, SelectField } from './Field.tsx'
export type { InputProps } from './Field.tsx'
export { ConfirmSheet, Sheet } from './Sheet.tsx'
export { CodeBlock, DiffView, HighlightedCode, InlineCode, Terminal } from './Code.tsx'
export { highlight, highlightLine } from './highlight.ts'
export type { Token, TokenKind } from './highlight.ts'
export { Prose } from './Prose.tsx'
export { parseMarkdown } from './markdown.ts'
export type { Block as MarkdownBlock } from './markdown.ts'
export { CodeInput, QrPlaceholder, SasCode, ScannerFrame } from './Pairing.tsx'

export type {
  Attachment,
  AttentionItem,
  AttentionKind,
  Install,
  InstallKind,
  InstallStatus,
  Person,
  PicturePolicy,
} from './model.ts'
export { S as homeStrings } from './strings/home.ts'
export { S as statusStrings } from './strings/status.ts'
export { S as settingsStrings } from './strings/settings.ts'
export { S as sidebarStrings } from './strings/sidebar.ts'
export { InstallBanner, RevokedScreen, statusLabel, statusTone } from './screens/status.tsx'
export { SidebarDrawer } from './screens/sidebar.tsx'
export type {
  SidebarContent,
  SidebarProject,
  SidebarSection,
  SidebarSession,
} from './screens/sidebar.tsx'
export {
  EnterCodeScreen,
  PairedScreen,
  PairErrorScreen,
  SasScreen,
  ScanScreen,
  WelcomeScreen,
} from './screens/pairing.tsx'
export type { PairError } from './screens/pairing.tsx'
export {
  AttentionRow,
  HomeScreen,
  installDetail,
  InstallRow,
  InstallSwitchButton,
  InstallSwitcherSheet,
} from './screens/home.tsx'

export * from './screens/cabinet/index.ts'
export * from './screens/buffcode/index.ts'
export * from './screens/notifications/index.ts'
export * from './screens/settings/index.ts'
