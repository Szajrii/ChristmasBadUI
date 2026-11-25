<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import {
  createCaptchaBoard,
  swapCaptchaTiles,
  verifyCaptchaSelection,
  type CaptchaTile,
} from '../utils/captchaGame'
import KitschButton from '../components/ui/KitschButton.vue'

const props = withDefaults(
  defineProps<{
    swapIntervalMs?: number
    gridSize?: number
    randomFn?: () => number
  }>(),
  {
    swapIntervalMs: 2500,
    gridSize: 3,
    randomFn: () => Math.random(),
  }
)

const store = useRegistrationStore()

const tiles = ref<CaptchaTile[]>(createCaptchaBoard(props.gridSize, props.randomFn))
const captchaAttempts = ref(0)
const isVerified = ref(false)
const statusMessage = ref<string | null>(null)
const swappedIds = ref<number[]>([])
let swapTimer: ReturnType<typeof setInterval> | null = null

const canProceed = computed(() => store.devMode || isVerified.value)
const gridColsClass = computed(() => (props.gridSize === 4 ? 'grid-cols-4' : 'grid-cols-3'))

function stopSwapTimer() {
  if (swapTimer !== null) {
    clearInterval(swapTimer)
    swapTimer = null
  }
}

function toggleTile(tile: CaptchaTile) {
  if (isVerified.value) return
  tile.selected = !tile.selected
  statusMessage.value = null
}

function handleVerify() {
  if (isVerified.value) return
  captchaAttempts.value += 1

  const result = verifyCaptchaSelection(tiles.value)
  if (result.valid) {
    isVerified.value = true
    stopSwapTimer()
    statusMessage.value = '🎉 Zweryfikowano! Czysty karp wigilijny — zero ości!'
    return
  }

  if (result.reason === 'wrong-selection') {
    statusMessage.value = '🦴 BŁĄD! Zaznaczyłeś ość albo inną potrawę! Wybieraj TYLKO karpia bez ości!'
  } else {
    statusMessage.value = '🐟 BŁĄD! Nie zaznaczyłeś wszystkich aktualnych kawałków karpia bez ości!'
  }
}

function proceedNext() {
  if (!canProceed.value) return
  store.completeStep('step-08-captcha', {
    captchaVerified: true,
    captchaAttempts: captchaAttempts.value,
  })
  store.goToNextStep()
}

onMounted(() => {
  if (props.swapIntervalMs > 0) {
    swapTimer = setInterval(() => {
      if (isVerified.value) {
        stopSwapTimer()
        return
      }
      const { tiles: nextTiles, changedIds } = swapCaptchaTiles(tiles.value, 2, props.randomFn)
      tiles.value = nextTiles
      swappedIds.value = changedIds
    }, props.swapIntervalMs)
  }
})

onUnmounted(() => {
  stopSwapTimer()
})
</script>

<template>
  <div data-testid="step-08-captcha" class="flex w-full max-w-md flex-col items-center gap-4 text-center">
    <div class="flex w-full items-center justify-between rounded-xl border-2 border-yellow-300/60 bg-black/40 px-3 py-2 text-xs font-bold">
      <span class="text-yellow-200">🐟 Zaznacz WSZYSTKIE karpie bez ości!</span>
      <span data-testid="captcha-attempts" class="text-emerald-300">Próby: {{ captchaAttempts }}</span>
    </div>

    <p class="text-xs font-semibold text-amber-200">
      Uwaga: co chwilę potrawy na stole zamieniają się miejscami i wyrastają ości (🦴🐟)!
    </p>

    <div
      data-testid="captcha-grid"
      class="grid w-full gap-2.5 rounded-2xl border-2 border-red-400/70 bg-black/45 p-3"
      :class="gridColsClass"
    >
      <button
        v-for="tile in tiles"
        :key="tile.id"
        type="button"
        :data-testid="`captcha-tile-${tile.id}`"
        :data-kind="tile.kind"
        :data-selected="tile.selected ? 'true' : 'false'"
        :aria-pressed="tile.selected"
        :aria-label="tile.label"
        class="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 p-1.5 font-bold shadow-md transition-transform duration-150 hover:scale-105 active:scale-95"
        :class="
          tile.selected
            ? 'border-lime-400 bg-emerald-800/90 text-lime-100 shadow-[0_0_12px_#4ade80]'
            : swappedIds.includes(tile.id)
              ? 'border-amber-300 bg-red-900/80 text-yellow-100'
              : 'border-yellow-400/80 bg-gradient-to-br from-red-700 via-red-900 to-red-950 text-yellow-100'
        "
        @click="toggleTile(tile)"
      >
        <span class="text-2xl leading-none sm:text-3xl">{{ tile.emoji }}</span>
        <span class="text-[10px] leading-tight">{{ tile.label }}</span>
      </button>
    </div>

    <p
      v-if="statusMessage"
      data-testid="captcha-status"
      role="status"
      class="w-full rounded-xl border-2 px-3 py-2 text-xs font-bold"
      :class="
        isVerified
          ? 'border-lime-400 bg-emerald-950/85 text-lime-200'
          : 'border-red-400 bg-red-950/85 text-red-100'
      "
    >
      {{ statusMessage }}
    </p>

    <div class="flex w-full flex-wrap items-center justify-center gap-3">
      <KitschButton
        data-testid="captcha-verify-btn"
        variant="santa"
        :disabled="isVerified"
        @click="handleVerify"
      >
        {{ isVerified ? '✅ Zweryfikowano' : '🔍 Zweryfikuj' }}
      </KitschButton>

      <KitschButton
        data-testid="step-08-submit-btn"
        variant="gold"
        :disabled="!canProceed"
        @click="proceedNext"
      >
        {{ canProceed ? '✅ Przejdź dalej ➡️' : '🔒 Najpierw przejdź CAPTCHA' }}
      </KitschButton>
    </div>
  </div>
</template>
