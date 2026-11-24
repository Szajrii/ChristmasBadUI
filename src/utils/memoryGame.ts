export interface MemoryCard {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

export const FESTIVE_SYMBOLS = ['🎅', '🎄', '🎁', '🦌', '⛄', '🔔', '🕯️', '❄️']

export function shuffleArray<T>(items: T[], randomFn: () => number = Math.random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function createMemoryDeck(
  pairCount = 4,
  randomFn: () => number = Math.random
): MemoryCard[] {
  const chosenSymbols = shuffleArray(FESTIVE_SYMBOLS, randomFn).slice(0, pairCount)
  const doubled = [...chosenSymbols, ...chosenSymbols]
  const shuffled = shuffleArray(doubled, randomFn)

  return shuffled.map((symbol, index) => ({
    id: index + 1,
    symbol,
    flipped: false,
    matched: false,
  }))
}
