<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import SlotMachineUsername from '../components/ui/SlotMachineUsername.vue'

const store = useRegistrationStore()

const generatedUsername = ref('Święty_Karp_2412')
const hasSpun = ref(false)
const isSpinning = ref(false)
const password = ref('')

// Pozycja świeczki na kursorze (w px względem pudełka hasła)
const candleActive = ref(false)
const candleX = ref(0)
const candleY = ref(0)

const isPasswordValid = computed(() => password.value.length >= 6)
const canSubmit = computed(
  () => store.devMode || (!isSpinning.value && hasSpun.value && isPasswordValid.value)
)

function handleSlotChange(payload: { username: string; hasSpun: boolean; isSpinning: boolean }) {
  generatedUsername.value = payload.username
  hasSpun.value = payload.hasSpun
  isSpinning.value = payload.isSpinning
}

function handlePasswordInput(event: Event) {
  const input = event.target as HTMLInputElement
  const nextVal = input.value

  // Nowo wpisane znaki doklejane są na początek (pisanie od tyłu!)
  if (nextVal.length > password.value.length) {
    const added = nextVal.slice(password.value.length)
    const reversedAdded = added.split('').reverse().join('')
    password.value = reversedAdded + password.value
  } else {
    password.value = nextVal
  }
  input.value = password.value
}

function updateCandlePosition(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement | null
  if (!target) return
  const rect = target.getBoundingClientRect()
  candleX.value = event.clientX - rect.left
  candleY.value = event.clientY - rect.top
  candleActive.value = true
}

function hideCandle() {
  candleActive.value = false
}

const candleOverlayStyle = computed(() => {
  if (!candleActive.value) {
    return { background: 'rgba(4, 4, 10, 0.98)' }
  }
  return {
    background: `radial-gradient(circle 64px at ${candleX.value}px ${candleY.value}px, rgba(255, 210, 110, 0.12) 0%, rgba(20, 12, 6, 0.72) 55%, rgba(4, 4, 10, 0.98) 100%)`,
  }
})

function submitCredentials() {
  if (!canSubmit.value) return
  store.completeStep('step-01-credentials', {
    username: generatedUsername.value,
    password: password.value,
  })
  store.goToNextStep()
}
</script>

<template>
  <form
    data-testid="step-01-credentials"
    class="flex w-full max-w-md flex-col gap-4 text-center"
    @submit.prevent="submitCredentials"
  >
    <!-- Sekcja 1: Animowany Jednoręki Bandyta dla Username -->
    <SlotMachineUsername @change="handleSlotChange" />

    <!-- Sekcja 2: Hasło pisane od tyłu + efekt świeczki na kursorze -->
    <div
      data-testid="candle-box"
      class="relative overflow-hidden rounded-2xl border-2 border-red-400/70 bg-black/60 p-4 text-left"
      @mousemove="updateCandlePosition"
      @mouseenter="updateCandlePosition"
      @mouseleave="hideCandle"
    >
      <label
        for="backwards-password"
        class="mb-1.5 block text-xs font-bold text-yellow-300"
      >
        🔐 Hasło (min. 6 znaków — wpisuj wspak przy świeczce 🕯️!)
      </label>

      <input
        id="backwards-password"
        data-testid="backwards-password-input"
        type="text"
        autocomplete="off"
        :value="password"
        placeholder="Wpisz hasło..."
        class="w-full rounded-xl border-2 border-yellow-300/80 bg-emerald-950/90 px-3 py-2 text-sm font-bold text-yellow-100 outline-none focus:border-yellow-300"
        @input="handlePasswordInput"
      />

      <p class="mt-1.5 text-[11px] text-amber-200/90">
        Długość: <strong data-testid="password-length">{{ password.length }}</strong> / 6
      </p>

      <!-- Warstwa ciemności ze świeczką podążającą za kursorem -->
      <div
        data-testid="candle-overlay"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-10 transition-opacity duration-150"
        :style="candleOverlayStyle"
      >
        <span
          v-if="candleActive"
          class="absolute -translate-x-1/2 -translate-y-1/2 text-xl drop-shadow-[0_0_8px_#facc15]"
          :style="{ left: `${candleX}px`, top: `${candleY}px` }"
        >
          🕯️
        </span>
      </div>
    </div>

    <KitschButton
      data-testid="step-01-submit-btn"
      type="submit"
      variant="elf"
      :disabled="!canSubmit"
    >
      {{ canSubmit ? '✅ Zatwierdź i idź dalej ➡️' : '🔒 Zakręć nickiem i wpisz min. 6 znaków' }}
    </KitschButton>
  </form>
</template>
