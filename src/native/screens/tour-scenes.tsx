/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { View } from 'react-native'
import { Badge } from '../Badge.tsx'
import { Icon } from '../Icon.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import { Line, Panel, Pill } from './tour-scene-parts.tsx'

/*
  The pictures of the tour (#931): little scenes drawn from the kit's own parts — no bitmaps, so
  they follow the theme and the language and weigh nothing. They are pictures: nothing in them
  presses, a screen reader skips them.
*/

function CodeScene() {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <Panel>
        <Line icon="terminal">
          <Text variant="label">{t('tour.sceneAsks')}</Text>
        </Line>
        <View
          style={{
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.background,
            padding: theme.space(2),
          }}
        >
          <Text variant="mono">npm run test</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
          <Pill>{t('tour.sceneDeny')}</Pill>
          <Pill primary>{t('tour.sceneAllow')}</Pill>
        </View>
      </Panel>
      <Panel>
        <Line icon="checkCircle">
          <Text>{t('tour.sceneReply')}</Text>
        </Line>
      </Panel>
    </>
  )
}

function KnowledgeScene() {
  const t = useT()
  const rows = [
    ['Rule', 'info'],
    ['Fact', 'ok'],
    ['Pitfall', 'warn'],
  ] as const
  return (
    <Panel>
      {rows.map(([kind, tone]) => (
        <Line key={kind} icon="bookOpen">
          <Badge tone={tone}>{t(`tour.scene${kind}`)}</Badge>
          <Text style={{ flex: 1 }}>{t(`tour.scene${kind}Text`)}</Text>
        </Line>
      ))}
    </Panel>
  )
}

function DevScene() {
  const t = useT()
  const theme = useTheme()
  return (
    <Panel>
      <Text variant="heading">{t('tour.sceneTask')}</Text>
      <Badge tone="warn">{t('tour.sceneInReview')}</Badge>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
        <Badge tone="ok" icon="checkCircle">
          {t('tour.sceneBuild')}
        </Badge>
        <Badge tone="ok" icon="checkCircle">
          {t('tour.sceneTests')}
        </Badge>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Pill primary>{t('tour.sceneApprove')}</Pill>
      </View>
    </Panel>
  )
}

function PairScene() {
  const theme = useTheme()
  return (
    <Panel>
      <View style={{ alignItems: 'center', gap: theme.space(3) }}>
        <Icon name="qrCode" size={96} color={theme.colors.foreground} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme.space(2),
          }}
        >
          {['Buff Code', 'SaaS', 'Community', 'Enterprise'].map((name) => (
            <View
              key={name}
              style={{
                paddingHorizontal: theme.space(2),
                paddingVertical: 2,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.background,
              }}
            >
              <Text variant="label">{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </Panel>
  )
}

export type TourScene = 'code' | 'knowledge' | 'dev' | 'pair'

const SCENES: Record<TourScene, () => ReactNode> = {
  code: CodeScene,
  knowledge: KnowledgeScene,
  dev: DevScene,
  pair: PairScene,
}

/** The picture's box: the same for every card, so the words under it do not jump. */
const PICTURE_HEIGHT = 220

/**
 * A card's picture, centred in a box of one height. On a screen too short for the card it is
 * drawn smaller (`scale` below 1) — the words matter more than the picture.
 */
export function TourPicture({
  scene,
  scale = 1,
  width = 0,
}: {
  scene: TourScene
  scale?: number
  /** The column's width, when scaled: the picture is laid out wider and shrunk to fill it. */
  width?: number
}) {
  const theme = useTheme()
  const [natural, setNatural] = useState(PICTURE_HEIGHT)
  const Scene = SCENES[scene]
  return (
    <View
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={
        scale === 1
          ? { minHeight: PICTURE_HEIGHT, justifyContent: 'center' }
          : { height: natural * scale, justifyContent: 'center' }
      }
    >
      <View
        onLayout={(e) => setNatural(e.nativeEvent.layout.height)}
        style={[
          { gap: theme.space(3) },
          scale !== 1 && { width: width / scale, alignSelf: 'center', transform: [{ scale }] },
        ]}
      >
        <Scene />
      </View>
    </View>
  )
}
