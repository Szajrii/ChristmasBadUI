<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import HoldToConfirmButton from '../components/ui/HoldToConfirmButton.vue'
import KitschButton from '../components/ui/KitschButton.vue'

const props = withDefaults(
  defineProps<{
    holdDurationMs?: number
    tickMs?: number
  }>(),
  {
    holdDurationMs: 5000,
    tickMs: 50,
  }
)

const store = useRegistrationStore()

const isHolding = ref(false)
const isConfirmed = ref(false)
const holdProgress = ref(0)
const wasReset = ref(false)

const fakeMessages = [
  '🚨 Grinch próbuje przejąć sesję! Nie puszczaj!',
  '⚠️ Wykryto zielone futro w pamięci RAM — trzymaj dalej!',
  '🎄 Mikołaj walczy o połączenie z biegunem północnym...',
  '💀 Kradzież świątecznych ciasteczek w toku! Zablokuj przyciskiem!',
  '🔥 Prawie go mamy! Jeszcze chwila, nie puszczaj!',
]

const glitchFlakes = [
  { left: '5%', top: '8%', text: '❄️ ERR_GRINCH_0x13' },
  { left: '22%', top: '24%', text: '⚠️ 404_SANTA_NOT_FOUND' },
  { left: '48%', top: '12%', text: '💀 SYNTAX_SNOW_PANIC()' },
  { left: '68%', top: '32%', text: '🦠 GRINCH_INJECTION' },
  { left: '14%', top: '58%', text: '🔥 KERNEL_CHRISTMAS_FAIL' },
  { left: '55%', top: '66%', text: '❄️ SEGFAULT_IN_SLEIGH' },
  { left: '76%', top: '78%', text: '⚠️ COOKIE_THEFT_ALERT' },
  { left: '30%', top: '84%', text: '💀 NULL_PRESENT_PTR' },
]

const activeFakeMessage = computed(() => {
  if (!isHolding.value) return ''
  const idx = Math.min(
    fakeMessages.length - 1,
    Math.floor((holdProgress.value / 100) * fakeMessages.length)
  )
  return fakeMessages[idx]
})

const canProceed = computed(() => store.devMode || isConfirmed.value)

function onHoldStart() {
  isHolding.value = true
  wasReset.value = false
  holdProgress.value = 0
}

function onHoldProgress(percent: number) {
  holdProgress.value = percent
}

function onHoldCancel() {
  isHolding.value = false
  holdProgress.value = 0
  wasReset.value = true
}

function completeAndProceed() {
  store.completeStep('step-10-grinch', { notAGrinch: true })
  store.goToNextStep()
}

function onHoldConfirm() {
  isHolding.value = false
  isConfirmed.value = true
  holdProgress.value = 100
  completeAndProceed()
}

function proceedNext() {
  if (!canProceed.value) return
  completeAndProceed()
}
</script>

<template>
  <div
    data-testid="step-10-grinch"
    class="relative flex w-full max-w-md flex-col items-center gap-3.5 overflow-hidden text-center"
    :class="{ 'animate-grinch-shake': isHolding }"
  >
    <!-- Glitch / śnieg z błędami podczas trzymania przycisku -->
    <div
      v-if="isHolding"
      data-testid="glitch-snow-overlay"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-20 overflow-hidden border-4 border-dashed border-[#ff0000] bg-[#ff0000]/15"
    >
      <span
        v-for="(flake, idx) in glitchFlakes"
        :key="idx"
        class="glitch-flake absolute font-mono text-[11px] font-extrabold text-[#00ff00] drop-shadow-[1px_1px_0_#000000]"
        :style="{ left: flake.left, top: flake.top }"
      >
        {{ flake.text }}
      </span>
    </div>

    <div class="retro-bevel w-full border-[#00ff00] bg-[#003300] px-3 py-2.5">
      <div class="text-base font-extrabold text-[#ffff00]">
        💚 Udowodnij, że nie jesteś Grinchem!
      </div>
      <p class="mt-1 text-xs font-bold text-[#ffffff]">
        Aby potwierdzić swoje świąteczne intencje, przytrzymaj przycisk poniżej przez pełne
        <span class="text-[#00ff00]">5 sekund</span> bez puszczania!
      </p>
    </div>

    <div
      v-if="isHolding"
      data-testid="grinch-fake-messages"
      role="alert"
      class="retro-bevel z-30 w-full border-[#ffff00] bg-[#990000] px-3 py-2 text-xs font-extrabold text-[#ffff00]"
    >
      {{ activeFakeMessage }}
    </div>

    <div
      v-else-if="wasReset"
      data-testid="grinch-reset-notice"
      role="status"
      class="retro-bevel w-full border-[#ff6666] bg-[#440000] px-3 py-2 text-xs font-bold text-[#ffcc00]"
    >
      😈 Puściłeś za wcześnie! Grinch zresetował pasek — spróbuj ponownie i trzymaj pełne 5s!
    </div>

    <div class="z-30 w-full">
      <HoldToConfirmButton
        :hold-duration-ms="props.holdDurationMs"
        :tick-ms="props.tickMs"
        variant="grinch"
        idle-label="🎄 Przytrzymaj 5s: Nie jestem Grinchem!"
        holding-label="🚨 NIE PUSZCZAJ! Weryfikacja..."
        confirmed-label="🎅 Zweryfikowano — nie jesteś Grinchem!"
        @hold-start="onHoldStart"
        @hold-progress="onHoldProgress"
        @hold-cancel="onHoldCancel"
        @confirm="onHoldConfirm"
      />
    </div>

    <KitschButton
      data-testid="step-10-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{ canProceed ? '✅ Przejdź dalej ➡️' : '🔒 Najpierw przytrzymaj przycisk przez 5s!' }}
    </KitschButton>
  </div>
</template>

<style scoped>
@keyframes grinch-shake {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(-5px, 3px) rotate(-1deg);
  }
  40% {
    transform: translate(5px, -3px) rotate(1deg);
  }
  60% {
    transform: translate(-4px, -2px) rotate(-0.8deg);
  }
  80% {
    transform: translate(4px, 3px) rotate(0.8deg);
  }
}

.animate-grinch-shake {
  animation: grinch-shake 0.18s linear infinite;
}

@keyframes glitch-fall {
  0% {
    transform: translateY(-10px) skewX(-6deg);
    opacity: 0.95;
  }
  50% {
    transform: translateY(10px) skewX(6deg);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-10px) skewX(-6deg);
    opacity: 0.95;
  }
}

.glitch-flake {
  animation: glitch-fall 0.45s steps(2, start) infinite;
}
</style>
