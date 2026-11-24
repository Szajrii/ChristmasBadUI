<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import KitschButton from './KitschButton.vue'

const props = withDefaults(
  defineProps<{
    usernames?: string[]
    devMode?: boolean
    spinDurationMs?: number
  }>(),
  {
    usernames: () => [
      'Święty_Karp_2412',
      'Gruby_Renifer_007',
      'Pijany_Elf_2026',
      'Kiczowaty_Mikołaj_99',
      'Mroźny_Piernik_1225',
      'Śnieżny_Bałwan_777',
      'Zamarznięty_Barszcz_24',
      'Błyskawiczny_Rudolf_1',
      'Złoty_Opłatek_2026',
      'Dziki_Makowiec_666',
      'Rozśpiewany_Dzwonek_88',
      'Kosmaty_Grinch_404',
      'Chrupiący_Karpik_12',
      'Świąteczny_Bigos_9000',
      'Szybki_Śnieżek_321',
      'Wesoły_Kominiarz_25',
    ],
    devMode: false,
    spinDurationMs: 1600,
  }
)

const emit = defineEmits<{
  change: [payload: { username: string; hasSpun: boolean; isSpinning: boolean }]
}>()

// Wysokość jednego wiersza w okienku (px); okienko ma 3 wiersze wysokości (środkowy = linia wygranej)
const ITEM_HEIGHT_PX = 40
const REEL_LOOPS = 4

const selectedIndex = ref(0)
const visualOffset = ref(0)
const isSpinning = ref(false)
const leverPulled = ref(false)
const hasSpun = ref(false)

const timeouts: Array<ReturnType<typeof setTimeout>> = []

const currentUsername = computed(() => props.usernames[selectedIndex.value] ?? 'Święty_Karp_2412')

const reelStrip = computed(() => {
  const strip: string[] = []
  for (let i = 0; i < REEL_LOOPS; i++) {
    strip.push(...props.usernames)
  }
  return strip
})

function emitState() {
  emit('change', {
    username: currentUsername.value,
    hasSpun: hasSpun.value,
    isSpinning: isSpinning.value,
  })
}

function pullLever() {
  if (isSpinning.value || props.usernames.length === 0) return

  const len = props.usernames.length
  const step = Math.floor(Math.random() * Math.max(1, len - 1)) + 1
  const nextIdx = (selectedIndex.value + step) % len
  selectedIndex.value = nextIdx
  hasSpun.value = true

  if (props.devMode || props.spinDurationMs <= 0) {
    visualOffset.value = nextIdx
    isSpinning.value = false
    leverPulled.value = false
    emitState()
    return
  }

  // Zaczynamy od bieżącej pozycji w 1. pętli, bez przejścia, i jedziemy płynnie do 3. pętli
  visualOffset.value = visualOffset.value % len
  isSpinning.value = true
  leverPulled.value = true
  emitState()

  const targetOffset = len * 2 + nextIdx
  requestAnimationFrame(() => {
    visualOffset.value = targetOffset
  })

  const leverTimer = setTimeout(() => {
    leverPulled.value = false
  }, 380)
  timeouts.push(leverTimer)

  const stopTimer = setTimeout(() => {
    isSpinning.value = false
    emitState()
  }, props.spinDurationMs)
  timeouts.push(stopTimer)
}

onUnmounted(() => {
  timeouts.forEach((t) => clearTimeout(t))
})
</script>

<template>
  <div data-testid="slot-machine" class="flex items-center justify-center gap-2">
    <!-- Skrzynka automatu -->
    <div
      class="flex-1 rounded-2xl border-4 border-yellow-400 bg-gradient-to-b from-red-700 via-red-900 to-red-950 p-3 shadow-[0_10px_28px_rgba(0,0,0,0.75),inset_0_2px_6px_rgba(255,255,255,0.25)]"
    >
      <!-- Górny szyld kasynowy -->
      <div class="mb-2 flex items-center justify-center gap-2 rounded-lg border-2 border-yellow-300 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 px-2 py-1 text-red-950 shadow">
        <span class="text-xs font-black uppercase tracking-wider">
          🎄 JACKPOT NICKÓW 777 🎄
        </span>
      </div>

      <!-- Jedno główne okienko bębna (wysokość 3 wierszy = 120px, środkowy wiersz na linii wygranej) -->
      <div class="relative rounded-xl border-4 border-amber-300 bg-slate-900 p-1 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)]">
        <div
          data-testid="slot-window"
          class="relative h-[120px] overflow-hidden rounded-lg bg-gradient-to-b from-amber-200 via-white to-amber-200"
        >
          <!-- Pasek z nickami -->
          <div
            class="flex flex-col"
            :class="
              isSpinning
                ? 'transition-transform duration-[1550ms] ease-[cubic-bezier(0.12,0.8,0.2,1)]'
                : 'transition-none'
            "
            :style="{
              transform: `translateY(${ITEM_HEIGHT_PX - visualOffset * ITEM_HEIGHT_PX}px)`,
            }"
          >
            <div
              v-for="(name, idx) in reelStrip"
              :key="idx"
              class="flex h-[40px] shrink-0 items-center justify-center px-3 text-sm font-black tracking-wide text-red-950 sm:text-base"
            >
              {{ name }}
            </div>
          </div>

          <!-- Cień walca u góry i u dołu -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/55"
          />

          <!-- Linia wygranej (środkowy wiersz) -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-[40px] flex h-[40px] items-center justify-between border-y-2 border-red-600/80 bg-yellow-300/15 px-1.5"
          >
            <span class="text-xs font-black text-red-600">▶</span>
            <span class="text-xs font-black text-red-600">◀</span>
          </div>
        </div>
      </div>

      <!-- Dolny panel skrzynki -->
      <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span data-testid="generated-username" class="font-bold text-emerald-300">
          Nick: {{ currentUsername }}
        </span>

        <KitschButton
          data-testid="spin-all-btn"
          variant="gold"
          :disabled="isSpinning"
          @click="pullLever"
        >
          {{ isSpinning ? '🎲 Losowanie...' : '🎰 Pociągnij dźwignię!' }}
        </KitschButton>
      </div>
    </div>

    <!-- Boczna mechaniczna dźwignia skrzynki -->
    <button
      type="button"
      data-testid="slot-lever-btn"
      aria-label="Pociągnij dźwignię jednorękiego bandyty"
      :disabled="isSpinning"
      class="group relative flex h-32 w-10 shrink-0 cursor-pointer flex-col items-center justify-end pb-3 disabled:cursor-not-allowed"
      @click="pullLever"
    >
      <!-- Czerwona gałka dźwigni -->
      <span
        class="z-10 block h-6 w-6 rounded-full border-2 border-yellow-200 bg-gradient-to-br from-red-400 via-red-600 to-red-900 shadow-[0_0_12px_rgba(239,68,68,0.85)] transition-transform duration-300"
        :class="leverPulled ? 'translate-y-14 scale-110' : 'group-hover:scale-110'"
      />
      <!-- Chromowane ramię -->
      <span
        class="block w-2 origin-bottom rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-500 transition-all duration-300"
        :class="leverPulled ? 'h-4' : 'h-16'"
      />
      <!-- Podstawa przykręcona do skrzynki -->
      <span class="block h-5 w-7 rounded-r-lg border-2 border-yellow-400 bg-gradient-to-b from-amber-500 to-yellow-800 shadow" />
    </button>
  </div>
</template>
