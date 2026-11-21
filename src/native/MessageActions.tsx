/** @jsxRuntime automatic */
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { IconButton } from './Button.tsx'
import { useT } from './theme.tsx'

/** How long «Copied» stays before the copy icon comes back. */
const COPIED_MS = 1500

/**
 * The actions under a message (#947), as in Claude and ChatGPT: copy the whole message (its
 * Markdown) and share it (a public link, #769). The host copies and opens the link sheet; the
 * button only says «Copied» for a moment. Without a host for an action there is no button.
 */
export function MessageActions({ onCopy, onShare }: { onCopy?: () => void; onShare?: () => void }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])
  if (!onCopy && !onShare) return null
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {onCopy && (
        <IconButton
          icon={copied ? 'check' : 'copy'}
          label={t(copied ? 'message.copied' : 'message.copy')}
          size="sm"
          onPress={() => {
            onCopy()
            setCopied(true)
          }}
        />
      )}
      {onShare && (
        <IconButton icon="share" label={t('message.share')} size="sm" onPress={onShare} />
      )}
    </View>
  )
}
