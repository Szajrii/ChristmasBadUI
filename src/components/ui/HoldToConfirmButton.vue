<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import type { KitschButtonVariant } from './KitschButton.vue'

const props = withDefaults(
  defineProps<{
    holdDurationMs?: number
    tickMs?: number
    disabled?: boolean
    variant?: KitschButtonVariant
    idleLabel?: string
    holdingLabel?: string
    confirmedLabel?: string
  }>(),
  {
    holdDurationMs: 5000,
    tickMs: 50,
    disabled: false,
    variant: 'santa',
    idleLabel: '🎅 Przytrzymaj przez 5 sekund, aby potwierdzić',
    holdingLabel: '⏳ Trzymaj mocno! Nie puszczaj...',
    confirmedLabel: '✅ Potwierdzono!',
  }
)

const emit = defineEmits<{
  'hold-start': []
  'hold-cancel': []
  'hold-progress': [percent: number]
  confirm: []
}>()

const variantClasses: Record<KitschButtonVariant, string> = {
  santa: 'bg-[#cc0000] text-[#ffff00] border-[#ff6666] hover:bg-[#ee0000]',
  elf: 'bg-[#007700] text-[#ffffff] border-[#55ff55] hover:bg-[#009900]',
  gold: 'bg-[#ffcc00] text-[#990000] border-[#ffff88] hover:bg-[#ffdd33]',
  grinch: 'bg-[#66cc00] text-[#000000] border-[#ccff66] hover:bg-[#77dd00]',
}

const isHolding = ref(false)
const isConfirmed = ref(false)
const elapsedMs = ref(0)
let holdTimer: ReturnType<typeof setInterval> | null = null

const progressPercent = computed(() => {
  if (isConfirmed.value) return 100
  if (props.holdDurationMs <= 0) return 0
  return Math.min(100, Math.round((elapsedMs.value / props.holdDurationMs) * 100))
})

const buttonLabel = computed(() => {
  if (isConfirmed.value) return props.confirmedLabel
  if (isHolding.value) return `${props.holdingLabel} (${progressPercent.value}%)`
  return props.idleLabel
})

function clearHoldTimer() {
  if (holdTimer !== null) {
    clearInterval(holdTimer)
    holdTimer = null
  }
}

function finishHold() {
  clearHoldTimer()
  isHolding.value = false
  isConfirmed.value = true
  elapsedMs.value = props.holdDurationMs
  emit('hold-progress', 100)
  emit('confirm')
}

function startHold() {
  if (props.disabled || isHolding.value || isConfirmed.value) return

  if (props.holdDurationMs <= 0) {
    emit('hold-start')
    finishHold()
    return
  }

  isHolding.value = true
  elapsedMs.value = 0
  emit('hold-start')
  emit('hold-progress', 0)

  holdTimer = setInterval(() => {
    elapsedMs.value += props.tickMs
    const pct = Math.min(100, Math.round((elapsedMs.value / props.holdDurationMs) * 100))
    emit('hold-progress', pct)

    if (elapsedMs.value >= props.holdDurationMs) {
      finishHold()
    }
  }, props.tickMs)
}

function cancelHold() {
  if (!isHolding.value) return
  clearHoldTimer()
  isHolding.value = false
  elapsedMs.value = 0
  emit('hold-progress', 0)
  emit('hold-cancel')
}

onUnmounted(() => {
  clearHoldTimer()
})
</script>

<template>
  <div data-testid="hold-to-confirm" class="flex w-full flex-col gap-2">
    <div
      class="relative h-5 w-full overflow-hidden border-2 border-[#ffffff] bg-[#000000]"
      role="progressbar"
      :aria-valuenow="progressPercent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        data-testid="hold-progress-bar"
        class="h-full transition-none"
        :class="
          progressPercent < 40
            ? 'bg-[#ff0000]'
            : progressPercent < 85
              ? 'bg-[#ffff00]'
              : 'bg-[#00ff00]'
        "
        :style="{ width: `${progressPercent}%` }"
      />
      <span
        data-testid="hold-progress-label"
        class="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-[#ffffff] drop-shadow-[1px_1px_0_#000000]"
      >
        {{ progressPercent }}%
      </span>
    </div>

    <button
      type="button"
      data-testid="hold-confirm-btn"
      :disabled="props.disabled"
      class="retro-bevel inline-flex w-full cursor-pointer items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-extrabold tracking-wide select-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="variantClasses[props.variant]"
      @mousedown="startHold"
      @mouseup="cancelHold"
      @mouseleave="cancelHold"
      @touchstart.prevent="startHold"
      @touchend.prevent="cancelHold"
      @touchcancel.prevent="cancelHold"
      @keydown.space.prevent="startHold"
      @keyup.space.prevent="cancelHold"
      @keydown.enter.prevent="startHold"
      @keyup.enter.prevent="cancelHold"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>
