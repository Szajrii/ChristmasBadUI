<script lang="ts">
export const DEFAULT_DIAL_DIGITS = ['3', '7', '1', '9', '4', '0', '6', '2', '8', '5'] as const
export const STOPPER_ANGLE_DEG = 135
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const FIRST_HOLE_ANGLE_DEG = 90
const HOLE_STEP_DEG = 28
const STOPPER_TOLERANCE_DEG = 8

const props = withDefaults(
  defineProps<{
    digits?: string[]
    disabled?: boolean
  }>(),
  {
    digits: () => [...DEFAULT_DIAL_DIGITS],
    disabled: false,
  }
)

const emit = defineEmits<{
  dial: [digit: string]
}>()

const dialWheelRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const activeHoleIndex = ref<number | null>(null)
const currentRotation = ref(0)
const statusMessage = ref('Chwyć cyfrę i przeciągnij zgodnie z ruchem wskazówek do stopera!')

let lastPointerAngle = 0
let rawRotation = 0
let dialCenterX = 0
let dialCenterY = 0

interface DialHole {
  digit: string
  index: number
  baseAngleDeg: number
  targetRotationDeg: number
  leftPercent: number
  topPercent: number
}

const holes = computed<DialHole[]>(() =>
  props.digits.slice(0, 10).map((digit, index) => {
    const baseAngleDeg = (FIRST_HOLE_ANGLE_DEG - index * HOLE_STEP_DEG + 360) % 360
    const targetRotationDeg = 45 + index * HOLE_STEP_DEG
    const rad = ((baseAngleDeg - 90) * Math.PI) / 180
    const radiusPercent = 36
    return {
      digit,
      index,
      baseAngleDeg,
      targetRotationDeg,
      leftPercent: 50 + radiusPercent * Math.cos(rad),
      topPercent: 50 + radiusPercent * Math.sin(rad),
    }
  })
)

const activeTargetRotation = computed(() => {
  if (activeHoleIndex.value === null) return 0
  return holes.value[activeHoleIndex.value]?.targetRotationDeg ?? 0
})

const dragProgressPercent = computed(() => {
  if (!isDragging.value || activeTargetRotation.value <= 0) return 0
  return Math.min(100, Math.round((currentRotation.value / activeTargetRotation.value) * 100))
})

const wheelStyle = computed(() => ({
  transform: `rotate(${currentRotation.value}deg)`,
  transition: isDragging.value ? 'none' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
}))

function getPointerAngleDeg(clientX: number, clientY: number): number {
  const dx = clientX - dialCenterX
  const dy = clientY - dialCenterY
  return ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360
}

function updateDialCenter() {
  const rect = dialWheelRef.value?.getBoundingClientRect()
  if (rect && (rect.width > 0 || rect.height > 0)) {
    dialCenterX = rect.left + rect.width / 2
    dialCenterY = rect.top + rect.height / 2
  } else {
    dialCenterX = 0
    dialCenterY = 0
  }
}

function beginDrag(index: number, clientX: number, clientY: number) {
  if (props.disabled) return
  updateDialCenter()
  activeHoleIndex.value = index
  isDragging.value = true
  rawRotation = 0
  currentRotation.value = 0
  lastPointerAngle = getPointerAngleDeg(clientX, clientY)
  const digit = holes.value[index]?.digit ?? ''
  statusMessage.value = `Kręcisz cyfrą ${digit}... ciągnij aż do stopera!`
}

function updateDrag(clientX: number, clientY: number) {
  if (!isDragging.value || activeHoleIndex.value === null) return
  const nextAngle = getPointerAngleDeg(clientX, clientY)
  let delta = nextAngle - lastPointerAngle
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360

  lastPointerAngle = nextAngle
  rawRotation += delta

  const target = activeTargetRotation.value
  currentRotation.value = Math.max(0, Math.min(target, rawRotation))
}

function endDrag() {
  if (!isDragging.value || activeHoleIndex.value === null) return

  const hole = holes.value[activeHoleIndex.value]
  const target = hole?.targetRotationDeg ?? 0
  const reachedStopper = currentRotation.value >= target - STOPPER_TOLERANCE_DEG

  isDragging.value = false
  activeHoleIndex.value = null
  currentRotation.value = 0
  rawRotation = 0

  if (reachedStopper && hole) {
    statusMessage.value = `📞 Wybrano cyfrę: ${hole.digit}!`
    emit('dial', hole.digit)
  } else {
    statusMessage.value = '⚠️ Puszczono za wcześnie! Dociągnij tarczę do oporu (stopera).'
  }
}

function onWindowMouseMove(event: MouseEvent) {
  updateDrag(event.clientX, event.clientY)
}

function onWindowMouseUp() {
  removeWindowListeners()
  endDrag()
}

function onWindowTouchMove(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch) return
  updateDrag(touch.clientX, touch.clientY)
}

function onWindowTouchEnd() {
  removeWindowListeners()
  endDrag()
}

function addWindowListeners() {
  window.addEventListener('mousemove', onWindowMouseMove)
  window.addEventListener('mouseup', onWindowMouseUp)
  window.addEventListener('touchmove', onWindowTouchMove, { passive: false })
  window.addEventListener('touchend', onWindowTouchEnd)
  window.addEventListener('touchcancel', onWindowTouchEnd)
}

function removeWindowListeners() {
  window.removeEventListener('mousemove', onWindowMouseMove)
  window.removeEventListener('mouseup', onWindowMouseUp)
  window.removeEventListener('touchmove', onWindowTouchMove)
  window.removeEventListener('touchend', onWindowTouchEnd)
  window.removeEventListener('touchcancel', onWindowTouchEnd)
}

function handleMouseDown(index: number, event: MouseEvent) {
  if (props.disabled) return
  beginDrag(index, event.clientX, event.clientY)
  addWindowListeners()
}

function handleTouchStart(index: number, event: TouchEvent) {
  if (props.disabled) return
  const touch = event.touches[0]
  if (!touch) return
  beginDrag(index, touch.clientX, touch.clientY)
  addWindowListeners()
}

onUnmounted(() => {
  removeWindowListeners()
})
</script>

<template>
  <div
    data-testid="rotary-phone-dial"
    class="retro-bevel flex w-full flex-col items-center gap-3 border-[#ffcc00] bg-[#770000] p-3 text-center"
  >
    <div class="flex w-full items-center justify-between text-xs font-bold text-[#ffff00]">
      <span>☎️ Tarcza Obrotowa Mikołaja</span>
      <span data-testid="dial-angle-indicator" class="text-[#00ff00]">
        {{ isDragging ? `${Math.round(currentRotation)}° / ${activeTargetRotation}°` : 'Gotowa' }}
      </span>
    </div>

    <div class="relative flex h-60 w-60 items-center justify-center select-none">
      <!-- Obracająca się tarcza -->
      <div
        ref="dialWheelRef"
        data-testid="rotary-dial-wheel"
        class="relative h-56 w-56 rounded-full border-4 border-[#ffcc00] bg-[#004400] shadow-inner"
        :style="wheelStyle"
      >
        <button
          v-for="hole in holes"
          :key="`${hole.index}-${hole.digit}`"
          type="button"
          :data-testid="`dial-hole-${hole.digit}`"
          :disabled="props.disabled"
          class="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-[#ffff00] bg-[#cc0000] text-sm font-extrabold text-[#ffffff] shadow active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          :class="activeHoleIndex === hole.index ? 'ring-2 ring-[#00ff00] bg-[#ff2222]' : 'hover:bg-[#ee0000]'"
          :style="{
            left: `${hole.leftPercent}%`,
            top: `${hole.topPercent}%`,
          }"
          @mousedown.prevent="handleMouseDown(hole.index, $event)"
          @touchstart.prevent="handleTouchStart(hole.index, $event)"
        >
          {{ hole.digit }}
        </button>

        <!-- Środek tarczy -->
        <div
          class="pointer-events-none absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-[#ffcc00] bg-[#990000] text-[10px] font-extrabold text-[#ffff00]"
        >
          <span class="text-lg leading-none">🎅</span>
          <span>HO-HO</span>
        </div>
      </div>

      <!-- Stały stoper w pozycji 135° (prawy dół) -->
      <div
        data-testid="dial-stopper"
        class="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1 border-2 border-[#000000] bg-[#ffcc00] px-1.5 py-0.5 text-[10px] font-extrabold text-[#990000] shadow"
      >
        <span>🛑 STOPER</span>
      </div>
    </div>

    <!-- Pasek postępu dociągnięcia do stopera -->
    <div class="w-full max-w-xs">
      <div class="h-3 w-full overflow-hidden border-2 border-[#ffffff] bg-[#000000]">
        <div
          data-testid="dial-progress-bar"
          class="h-full transition-none"
          :class="dragProgressPercent >= 90 ? 'bg-[#00ff00]' : 'bg-[#ffff00]'"
          :style="{ width: `${dragProgressPercent}%` }"
        />
      </div>
    </div>

    <p
      data-testid="dial-status"
      role="status"
      class="w-full border-2 border-[#ffff00] bg-[#002200] px-2 py-1 text-xs font-bold text-[#ffff88]"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>
