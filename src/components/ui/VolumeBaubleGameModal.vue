<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import KitschCard from './KitschCard.vue'

export interface BaubleItem {
  id: number
  value: number
  x: number
  y: number
  colorClass: string
  clicked: boolean
}

const props = withDefaults(
  defineProps<{
    baubleCount?: number
    durationSeconds?: number
    randomFn?: () => number
  }>(),
  {
    baubleCount: 20,
    durationSeconds: 10,
    randomFn: () => Math.random(),
  }
)

const emit = defineEmits<{
  complete: [payload: { reductionPercent: number; allClicked: boolean }]
}>()

// Współrzędne (w %) ułożone w kształt choinki (od czubka do dołu)
const TREE_SLOTS: Array<{ x: number; y: number }> = [
  { x: 50, y: 18 },
  { x: 43, y: 27 },
  { x: 57, y: 27 },
  { x: 37, y: 37 },
  { x: 50, y: 36 },
  { x: 63, y: 37 },
  { x: 31, y: 48 },
  { x: 44, y: 47 },
  { x: 56, y: 47 },
  { x: 69, y: 48 },
  { x: 26, y: 60 },
  { x: 38, y: 59 },
  { x: 50, y: 58 },
  { x: 62, y: 59 },
  { x: 74, y: 60 },
  { x: 22, y: 72 },
  { x: 36, y: 72 },
  { x: 50, y: 71 },
  { x: 64, y: 72 },
  { x: 78, y: 72 },
]

const BAUBLE_COLORS = [
  'bg-red-500 border-yellow-200 text-white shadow-[0_0_10px_#ef4444]',
  'bg-yellow-400 border-white text-red-950 shadow-[0_0_10px_#facc15]',
  'bg-sky-400 border-white text-slate-950 shadow-[0_0_10px_#38bdf8]',
  'bg-fuchsia-500 border-yellow-200 text-white shadow-[0_0_10px_#d946ef]',
  'bg-orange-500 border-yellow-100 text-white shadow-[0_0_10px_#f97316]',
]

function createBaubles(): BaubleItem[] {
  return Array.from({ length: props.baubleCount }, (_, idx) => {
    const slot = TREE_SLOTS[idx % TREE_SLOTS.length]
    const value = Math.floor(props.randomFn() * 5) + 1
    return {
      id: idx + 1,
      value,
      x: slot.x,
      y: slot.y,
      colorClass: BAUBLE_COLORS[idx % BAUBLE_COLORS.length],
      clicked: false,
    }
  })
}

const baubles = ref<BaubleItem[]>(createBaubles())
const remainingMs = ref(props.durationSeconds * 1000)
const hasFinished = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

const reductionSum = computed(() =>
  baubles.value.reduce((sum, b) => (b.clicked ? sum + b.value : sum), 0)
)
const remainingBaublesCount = computed(
  () => baubles.value.filter((b) => !b.clicked).length
)
const remainingSecondsFormatted = computed(() =>
  (Math.max(0, remainingMs.value) / 1000).toFixed(1)
)
const previewVolume = computed(() => {
  if (remainingBaublesCount.value === 0) return 0
  return Math.max(0, 100 - reductionSum.value)
})

function finalize(allClicked: boolean) {
  if (hasFinished.value) return
  hasFinished.value = true
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  emit('complete', {
    reductionPercent: reductionSum.value,
    allClicked,
  })
}

function clickBauble(baubleId: number) {
  if (hasFinished.value) return
  const target = baubles.value.find((b) => b.id === baubleId)
  if (!target || target.clicked) return

  target.clicked = true
  if (baubles.value.every((b) => b.clicked)) {
    finalize(true)
  }
}

onMounted(() => {
  intervalId = setInterval(() => {
    remainingMs.value = Math.max(0, remainingMs.value - 100)
    if (remainingMs.value <= 0) {
      finalize(baubles.value.every((b) => b.clicked))
    }
  }, 100)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<template>
  <div
    data-testid="volume-game-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="volume-game-title"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
  >
    <KitschCard class="w-full max-w-lg">
      <div class="flex flex-col gap-3 p-5 text-center">
        <h2
          id="volume-game-title"
          class="kitsch-text-shadow text-xl font-extrabold text-yellow-300"
        >
          🎄 Świąteczna Regulacja Głośności™ 🔊
        </h2>

        <p class="text-xs text-amber-100 sm:text-sm">
          Klikaj bombki na choince! Każda zbija głośność o <strong>1–5%</strong>.
          Zbijesz wszystkie <strong>{{ props.baubleCount }}</strong> w {{ props.durationSeconds }}s = <strong>0%</strong>!
        </p>

        <!-- Stats bar -->
        <div
          class="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-yellow-400/70 bg-black/40 px-3 py-2 text-xs font-bold sm:text-sm"
        >
          <span data-testid="volume-game-timer" class="text-red-300">
            ⏱️ Czas: {{ remainingSecondsFormatted }}s
          </span>
          <span data-testid="volume-game-reduction" class="text-emerald-300">
            📉 Wyciszenie: -{{ reductionSum }}% (Zostanie: {{ previewVolume }}%)
          </span>
        </div>

        <!-- Christmas Tree Playfield -->
        <div
          data-testid="bauble-tree-area"
          class="relative mx-auto h-80 w-full max-w-[360px] select-none overflow-hidden rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-b from-slate-950 via-emerald-950/70 to-red-950/80"
        >
          <!-- Tree SVG -->
          <svg
            viewBox="0 0 200 220"
            class="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <!-- Star -->
            <polygon
              points="100,6 106,20 120,20 109,29 113,43 100,34 87,43 91,29 80,20 94,20"
              fill="#ffd700"
            />
            <!-- Tree layers -->
            <polygon points="100,26 52,82 148,82" fill="#15803d" stroke="#22c55e" stroke-width="2" />
            <polygon points="100,56 38,128 162,128" fill="#166534" stroke="#22c55e" stroke-width="2" />
            <polygon points="100,90 22,178 178,178" fill="#14532d" stroke="#22c55e" stroke-width="2" />
            <!-- Trunk -->
            <rect x="86" y="178" width="28" height="30" rx="3" fill="#78350f" />
          </svg>

          <!-- 20 Baubles -->
          <button
            v-for="bauble in baubles"
            v-show="!bauble.clicked"
            :key="bauble.id"
            type="button"
            :data-testid="`bauble-${bauble.id}`"
            :data-value="bauble.value"
            :aria-label="`Bombka ${bauble.id}, wycisza o ${bauble.value}%`"
            class="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-extrabold transition-transform hover:scale-125 active:scale-90"
            :class="bauble.colorClass"
            :style="{ left: `${bauble.x}%`, top: `${bauble.y}%` }"
            @click="clickBauble(bauble.id)"
          >
            {{ bauble.value }}%
          </button>
        </div>

        <p class="text-[11px] text-yellow-200/80">
          Pozostało bombek: <strong data-testid="baubles-remaining">{{ remainingBaublesCount }}</strong> / {{ props.baubleCount }}
        </p>
      </div>
    </KitschCard>
  </div>
</template>
