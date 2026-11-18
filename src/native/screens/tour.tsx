/** @jsxRuntime automatic */
import { useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'
import { Button } from '../Button.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import { TourHeader, TourProgress } from './tour-parts.tsx'
import { TourPicture, type TourScene } from './tour-scenes.tsx'
import { useTour, type TourTiming } from './use-tour.ts'

const CARDS: { scene: TourScene; title: string; text: string }[] = [
  { scene: 'code', title: 'tour.codeTitle', text: 'tour.codeText' },
  { scene: 'knowledge', title: 'tour.knowledgeTitle', text: 'tour.knowledgeText' },
  { scene: 'dev', title: 'tour.devTitle', text: 'tour.devText' },
  { scene: 'pair', title: 'tour.pairTitle', text: 'tour.pairText' },
]

/** A drag this far down closes the tour. */
const CLOSE_DRAG = 80
/** From this width — a tablet — the whole tour is drawn larger: the phone's layout, enlarged. */
const WIDE = 700
/** The phone layout's width a tablet enlarges, and how far at most. */
const WIDE_BASE = 460
const WIDE_MAX = 1.8
/** The picture on a screen too short for the card. */
const COMPACT = 0.7

/**
 * The first-launch tour (#931): four story cards. A tap on the right goes on, on the left goes
 * back, a hold pauses, a drag down or «Skip» closes; the demo and connecting are one tap away on
 * every card, and every gesture has its button. Cards turn by themselves unless the person asked
 * the system for less motion or a screen reader is on — then only a tap or a button turns them.
 */
export function TourScreen({
  onDemo,
  onConnect,
  onClose,
  cardMs = 6000,
  autoAdvance = true,
  timing,
}: {
  /** The demo in one tap; absent — the build offers none. */
  onDemo?: () => void
  onConnect?: () => void
  /** «Skip», a drag down, a tap past the last card. */
  onClose?: () => void
  cardMs?: number
  autoAdvance?: boolean
  /** What runs a card's time — a test's stand-in for the animation. */
  timing?: TourTiming
}) {
  const t = useT()
  const theme = useTheme()
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [room, setRoom] = useState(0)
  const [content, setContent] = useState(0)
  // Too short for the card: first the picture gets smaller, and what still does not fit scrolls.
  const [compact, setCompact] = useState(false)
  const tour = useTour({
    count: CARDS.length,
    cardMs,
    autoAdvance,
    onEnd: onClose,
    ...(timing ? { timing } : {}),
  })
  const zoom =
    size.width >= WIDE ? Math.min(WIDE_MAX, (size.width - theme.space(24)) / WIDE_BASE) : 1
  const column = (zoom === 1 ? Math.min(size.width, 520) : WIDE_BASE) - theme.space(8)
  const scrolls = content > room + 1
  useEffect(() => {
    if (scrolls) setCompact(true)
  }, [scrolls])
  const card = CARDS[tour.index]!
  const words = `${t(card.text)}${card.scene === 'pair' && onDemo ? ` ${t('tour.pairDemo')}` : ''}`

  // A new card is said aloud: nothing else tells a screen reader the words have changed. The web
  // has a live region for it instead.
  const said = useRef(0)
  useEffect(() => {
    if (said.current === tour.index) return
    said.current = tour.index
    if (Platform.OS !== 'web')
      AccessibilityInfo.announceForAccessibility(`${t(card.title)}. ${words}`)
  }, [tour.index, t, card.title, words])

  // The responder is made once; it reads the latest state through the ref.
  const live = useRef({ tour, onClose, scrolls })
  live.current = { tour, onClose, scrolls }
  // A drag owns the touch from its start to the next one: the card's own press must neither
  // turn the card nor let the clock go on under the finger.
  const dragged = useRef(false)
  const drag = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) =>
        !live.current.scrolls && g.dy > 16 && g.dy > Math.abs(g.dx) * 1.5,
      onPanResponderGrant: () => {
        dragged.current = true
        live.current.tour.hold()
      },
      onPanResponderRelease: (_e, g) =>
        g.dy > CLOSE_DRAG ? live.current.onClose?.() : live.current.tour.release(),
      onPanResponderTerminate: () => live.current.tour.release(),
    }),
  ).current

  return (
    <View
      onLayout={(e) => setSize(e.nativeEvent.layout)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}
      {...drag.panHandlers}
    >
      <View
        style={[
          { paddingHorizontal: theme.space(4), paddingTop: theme.space(3) },
          zoom === 1
            ? { flex: 1, width: '100%', maxWidth: 520 }
            : { width: WIDE_BASE, height: size.height / zoom, transform: [{ scale: zoom }] },
        ]}
      >
        <TourProgress count={CARDS.length} tour={tour} />
        <TourHeader tour={tour} onClose={onClose} />
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={scrolls}
          onLayout={(e) => setRoom(e.nativeEvent.layout.height)}
          onContentSizeChange={(_w, h) => setContent(h)}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* The card is one surface for the gestures; a screen reader passes through it to the
              words, and turns cards by the buttons above. */}
          <Pressable
            accessible={false}
            testID="tour-card"
            onPressIn={() => {
              dragged.current = false
              tour.hold()
            }}
            onPressOut={() => {
              if (!dragged.current) tour.release()
            }}
            // A hold pauses and is not a tap: the card stays.
            onLongPress={() => undefined}
            onPress={(e) => {
              if (dragged.current) return
              if (e.nativeEvent.pageX < size.width * 0.3) tour.back()
              else tour.next()
            }}
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              gap: theme.space(compact ? 3 : 5),
              paddingVertical: theme.space(compact ? 1 : 3),
            }}
          >
            <TourPicture scene={card.scene} scale={compact ? COMPACT : 1} width={column} />
            {/* As tall as the longest card's words, so the cards do not jump as they turn. */}
            <View
              {...(Platform.OS === 'web' ? { 'aria-live': 'polite' as const } : {})}
              style={{ gap: theme.space(2), minHeight: compact ? 0 : 124 }}
            >
              <Text variant="title" accessibilityRole="header">
                {t(card.title)}
              </Text>
              <Text tone="fg2">{words}</Text>
            </View>
          </Pressable>
        </ScrollView>
        <View style={{ gap: theme.space(2), paddingVertical: theme.space(4) }}>
          {onDemo && (
            <Button variant="primary" block leadingIcon="eye" onPress={onDemo}>
              {t('starter.demo')}
            </Button>
          )}
          <Button
            variant={onDemo ? 'outline' : 'primary'}
            block
            leadingIcon="qrCode"
            onPress={onConnect}
          >
            {t('tour.connect')}
          </Button>
        </View>
      </View>
    </View>
  )
}
