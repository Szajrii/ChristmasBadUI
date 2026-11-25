<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { calculateYearFromPower, MAX_BIRTH_YEAR, MIN_BIRTH_YEAR } from '../../utils/birthdateCatapult'

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    tickMs?: number
    stepPerTick?: number
  }>(),
  {
    tickMs: 35,
    stepPerTick: 2.5,
  }
)

const emit = defineEmits<{
  'update:modelValue': [year: number]
}>()

const power = ref(0)
const direction = ref<1 | -1>(1)
const isCharging = ref(false)
const launchCount = ref(0)
let chargeTimer: ReturnType<typeof setInterval> | null = null

const previewYear = computed(() => calculateYearFromPower(power.value))

function clearTimer() {
  if (chargeTimer !== null) {
    clearInterval(chargeTimer)
    chargeTimer = null
  }
}

function startCharge() {
  if (isCharging.value) return
  isCharging.value = true
  power.value = 0
  direction.value = 1

  chargeTimer = setInterval(() => {
    let next = power.value + direction.value * props.stepPerTick
    if (next >= 100) {
      next = 100
      direction.value = -1
    } else if (next <= 0) {
      next = 0
      direction.value = 1
    }
    power.value = next
  }, props.tickMs)
}

function releaseCharge() {
  if (!isCharging.value) return
  isCharging.value = false
  clearTimer()
  launchCount.value += 1
  emit('update:modelValue', calculateYearFromPower(power.value))
}

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <div
    data-testid="sleigh-catapult"
    class="retro-bevel flex w-full flex-col gap-2.5 border-[#ffcc00] bg-[#003300] p-3 text-center"
  >
    <div class="flex items-center justify-between text-xs font-bold text-[#ffff00]">
      <span>🛷 Katapulta Sań (Rok {{ MIN_BIRTH_YEAR }}–{{ MAX_BIRTH_YEAR }})</span>
      <span data-testid="catapult-launches" class="text-[#88ff88]">Rzuty: {{ launchCount }}</span>
    </div>

    <div class="flex items-center justify-between text-[11px] font-bold text-[#ffffff]">
      <span>{{ MAX_BIRTH_YEAR }} (0%)</span>
      <span data-testid="catapult-preview" class="text-[#ffcc00]">
        {{ isCharging ? `🎯 Cel: ${previewYear}` : modelValue !== null ? `📅 Wylądowano: ${modelValue}` : '❓ Rok nieustawiony' }}
      </span>
      <span>{{ MIN_BIRTH_YEAR }} (100%)</span>
    </div>

    <div
      class="relative h-5 w-full overflow-hidden border-2 border-[#ffffff] bg-[#000000]"
      role="progressbar"
      :aria-valuenow="Math.round(power)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        data-testid="catapult-power-bar"
        class="h-full transition-none"
        :class="
          power < 35
            ? 'bg-[#00ff00]'
            : power < 70
              ? 'bg-[#ffff00]'
              : 'bg-[#ff0000]'
        "
        :style="{ width: `${power}%` }"
      />
    </div>

    <button
      type="button"
      data-testid="catapult-charge-btn"
      class="retro-bevel w-full cursor-pointer border-[#ff6666] bg-[#cc0000] px-3 py-2 text-sm font-extrabold text-[#ffff00] select-none hover:bg-[#ee0000] active:bg-[#990000]"
      @mousedown="startCharge"
      @mouseup="releaseCharge"
      @mouseleave="releaseCharge"
      @touchstart.prevent="startCharge"
      @touchend.prevent="releaseCharge"
      @keydown.space.prevent="startCharge"
      @keyup.space.prevent="releaseCharge"
      @keydown.enter.prevent="startCharge"
      @keyup.enter.prevent="releaseCharge"
    >
      {{ isCharging ? '🔥 TRZYMASZ LEJCE... PUŚĆ ŻEBY RZUCIĆ!' : '🦌 Naciągnij lejce reniferów (przytrzymaj!)' }}
    </button>
  </div>
</template>
