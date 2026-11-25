export type CaptchaTileKind = 'boneless-carp' | 'bony-carp' | 'pierogi' | 'borscht'

export interface CaptchaTileMeta {
  kind: CaptchaTileKind
  emoji: string
  label: string
}

export interface CaptchaTile extends CaptchaTileMeta {
  id: number
  selected: boolean
}

export const CAPTCHA_TILE_TYPES: Record<CaptchaTileKind, CaptchaTileMeta> = {
  'boneless-carp': {
    kind: 'boneless-carp',
    emoji: '🐟',
    label: 'Karp bez ości',
  },
  'bony-carp': {
    kind: 'bony-carp',
    emoji: '🦴🐟',
    label: 'Karp z ością',
  },
  pierogi: {
    kind: 'pierogi',
    emoji: '🥟',
    label: 'Pieróg',
  },
  borscht: {
    kind: 'borscht',
    emoji: '🥣',
    label: 'Barszcz',
  },
}

const ALL_KINDS: CaptchaTileKind[] = ['boneless-carp', 'bony-carp', 'pierogi', 'borscht']
const OTHER_KINDS: CaptchaTileKind[] = ['bony-carp', 'pierogi', 'borscht']

function shuffleItems<T>(items: T[], randomFn: () => number = Math.random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeTile(id: number, kind: CaptchaTileKind, selected = false): CaptchaTile {
  const meta = CAPTCHA_TILE_TYPES[kind]
  return {
    id,
    kind: meta.kind,
    emoji: meta.emoji,
    label: meta.label,
    selected,
  }
}

export function createCaptchaBoard(
  gridSize = 3,
  randomFn: () => number = Math.random
): CaptchaTile[] {
  const total = gridSize * gridSize
  const minBoneless = Math.min(2, total)
  const kinds: CaptchaTileKind[] = []

  for (let i = 0; i < minBoneless; i++) {
    kinds.push('boneless-carp')
  }

  for (let i = minBoneless; i < total; i++) {
    const idx = Math.floor(randomFn() * ALL_KINDS.length)
    kinds.push(ALL_KINDS[idx] ?? 'pierogi')
  }

  return shuffleItems(kinds, randomFn).map((kind, index) => makeTile(index + 1, kind, false))
}

export function swapCaptchaTiles(
  tiles: CaptchaTile[],
  swapCount = 2,
  randomFn: () => number = Math.random
): { tiles: CaptchaTile[]; changedIds: number[] } {
  if (tiles.length === 0) return { tiles: [], changedIds: [] }

  const indices = shuffleItems(
    tiles.map((_, idx) => idx),
    randomFn
  ).slice(0, Math.min(swapCount, tiles.length))

  const nextTiles = tiles.map((t) => ({ ...t }))
  const changedIds: number[] = []

  for (const idx of indices) {
    const current = nextTiles[idx]
    if (!current) continue
    const candidates = ALL_KINDS.filter((k) => k !== current.kind)
    const nextKind = candidates[Math.floor(randomFn() * candidates.length)] ?? OTHER_KINDS[0]
    nextTiles[idx] = makeTile(current.id, nextKind, current.selected)
    changedIds.push(current.id)
  }

  // Gwarantujemy co najmniej jednego karpia bez ości na planszy, aby zagadka była zawsze rozwiązywalna
  if (!nextTiles.some((t) => t.kind === 'boneless-carp')) {
    const fallbackIdx = Math.floor(randomFn() * nextTiles.length)
    const target = nextTiles[fallbackIdx]
    if (target) {
      nextTiles[fallbackIdx] = makeTile(target.id, 'boneless-carp', target.selected)
      if (!changedIds.includes(target.id)) {
        changedIds.push(target.id)
      }
    }
  }

  return { tiles: nextTiles, changedIds }
}

export interface CaptchaVerificationResult {
  valid: boolean
  reason: 'ok' | 'missing-boneless' | 'wrong-selection'
}

export function verifyCaptchaSelection(tiles: CaptchaTile[]): CaptchaVerificationResult {
  const hasWrongSelection = tiles.some((t) => t.selected && t.kind !== 'boneless-carp')
  if (hasWrongSelection) {
    return { valid: false, reason: 'wrong-selection' }
  }

  const hasUnselectedBoneless = tiles.some((t) => t.kind === 'boneless-carp' && !t.selected)
  if (hasUnselectedBoneless) {
    return { valid: false, reason: 'missing-boneless' }
  }

  return { valid: true, reason: 'ok' }
}
