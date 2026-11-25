<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    escapesCount?: number
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    escapesCount: 3,
    label: 'Akceptuję',
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  escaped: [remaining: number]
}>()

const escapesUsed = ref(0)
const prevX = ref(0)
const prevY = ref(0)
const posX = ref(0)
const posY = ref(0)
const isLaunching = ref(false)
const launchKey = ref(0)

// Zmienne CSS dla animacji parabolicznej i przetoczenia po lądowaniu
const midX = ref(0)
const peakY = ref(-60)
const landX = ref(0)
const landY = ref(0)
const endRot = ref(360)

watch(
  () => props.escapesCount,
  () => {
    escapesUsed.value = 0
  }
)

const remainingEscapes = computed(() => Math.max(0, props.escapesCount - escapesUsed.value))
const canCheck = computed(() => !props.disabled && remainingEscapes.value === 0)

function triggerEscape() {
  if (props.disabled || remainingEscapes.value <= 0) return

  escapesUsed.value += 1

  const startX = posX.value
  const startY = posY.value
  const dir = Math.random() < 0.5 ? -1 : 1
  const horizontalForce = 45 + Math.random() * 85
  const verticalPeak = -(45 + Math.random() * 55)
  const targetY = Math.round((Math.random() - 0.5) * 36)
  const rollDistance = dir * (10 + Math.random() * 18)
  const spinDeg = dir * (360 + Math.round(Math.random() * 180))

  const nextLandX = Math.max(-130, Math.min(130, Math.round(startX + dir * horizontalForce)))
  const nextEndX = Math.max(-145, Math.min(145, Math.round(nextLandX + rollDistance)))

  prevX.value = startX
  prevY.value = startY
  midX.value = Math.round((startX + nextLandX) / 2)
  peakY.value = Math.round(Math.min(startY, targetY) + verticalPeak)
  landX.value = nextLandX
  landY.value = targetY
  endRot.value = spinDeg

  posX.value = nextEndX
  posY.value = targetY
  isLaunching.value = true
  launchKey.value += 1

  emit('escaped', remainingEscapes.value)
}

function handleMouseEnter() {
  if (remainingEscapes.value > 0) {
    triggerEscape()
  }
}

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  if (remainingEscapes.value > 0) {
    event.preventDefault()
    event.stopPropagation()
    triggerEscape()
  }
}

function handleChange(event: Event) {
  if (!canCheck.value) {
    const target = event.target as HTMLInputElement
    target.checked = props.modelValue
    return
  }
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

function handleAnimationEnd() {
  isLaunching.value = false
}

const moverStyle = computed(() => ({
  '--start-x': `${prevX.value}px`,
  '--start-y': `${prevY.value}px`,
  '--mid-x': `${midX.value}px`,
  '--peak-y': `${peakY.value}px`,
  '--land-x': `${landX.value}px`,
  '--land-y': `${landY.value}px`,
  '--end-x': `${posX.value}px`,
  '--end-y': `${posY.value}px`,
  '--mid-rot': `${Math.round(endRot.value * 0.45)}deg`,
  '--land-rot': `${Math.round(endRot.value * 0.85)}deg`,
  '--end-rot': `${endRot.value}deg`,
  transform: isLaunching.value ? undefined : `translate(${posX.value}px, ${posY.value}px)`,
}))
</script>

<template>
  <div
    data-testid="parabolic-checkbox-root"
    class="retro-bevel relative flex min-h-[145px] w-full flex-col items-center justify-end overflow-visible border-[#ffff00] bg-[#003300] p-3"
  >
    <div
      :key="launchKey"
      data-testid="parabolic-checkbox-mover"
      :style="moverStyle"
      :class="[
        'inline-flex items-center gap-1 select-none',
        isLaunching ? 'parabolic-launch' : 'transition-transform duration-150',
      ]"
      @mouseenter="handleMouseEnter"
      @click="handleClick"
      @animationend="handleAnimationEnd"
    >
      <label class="inline-flex cursor-pointer items-center gap-1 bg-[#990000] px-1.5 py-0.5 border border-[#ffff00]">
        <input
          data-testid="parabolic-checkbox-input"
          type="checkbox"
          :checked="props.modelValue"
          :disabled="props.disabled"
          class="h-2.5 w-2.5 cursor-pointer accent-[#00ff00]"
          @change="handleChange"
        />
        <span class="text-[9px] font-bold leading-none text-[#ffff00]">
          {{ props.label }}
        </span>
      </label>
    </div>

    <p
      data-testid="parabolic-checkbox-status"
      class="mt-3 text-[11px] font-bold"
      :class="remainingEscapes > 0 ? 'text-[#ff8888]' : 'text-[#00ff00]'"
    >
      <template v-if="remainingEscapes > 0">
        💨 Checkbox ucieka po paraboli! Pozostało prób: {{ remainingEscapes }}
      </template>
      <template v-else>
        🎯 Checkbox zmęczony — możesz teraz kliknąć „{{ props.label }}”!
      </template>
    </p>
  </div>
</template>

<style scoped>
@keyframes parabolic-launch-and-roll {
  0% {
    transform: translate(var(--start-x), var(--start-y)) rotate(0deg);
  }
  40% {
    transform: translate(var(--mid-x), var(--peak-y)) rotate(var(--mid-rot));
  }
  78% {
    transform: translate(var(--land-x), var(--land-y)) rotate(var(--land-rot));
  }
  100% {
    transform: translate(var(--end-x), var(--end-y)) rotate(var(--end-rot));
  }
}

.parabolic-launch {
  animation: parabolic-launch-and-roll 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
</style>
