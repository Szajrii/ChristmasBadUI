<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import ThanosSkipModal from '../components/ui/ThanosSkipModal.vue'

interface CountryOption {
  name: string
  distanceKm: number
  reindeers: number
}

const props = withDefaults(
  defineProps<{
    skipOfferDelayMs?: number
    thanosSnapDurationMs?: number
  }>(),
  {
    skipOfferDelayMs: 5000,
    thanosSnapDurationMs: 700,
  }
)

const store = useRegistrationStore()

// Celowo nieposortowana alfabetycznie lista krajów (wg odległości od Bieguna Północnego / liczby reniferów)
const COUNTRIES: CountryOption[] = [
  { name: 'Grenlandia', distanceKm: 1350, reindeers: 3200 },
  { name: 'Finlandia', distanceKm: 2450, reindeers: 198000 },
  { name: 'Norwegia', distanceKm: 2550, reindeers: 220000 },
  { name: 'Islandia', distanceKm: 2780, reindeers: 6500 },
  { name: 'Szwecja', distanceKm: 2950, reindeers: 250000 },
  { name: 'Kanada', distanceKm: 3100, reindeers: 1300000 },
  { name: 'Rosja', distanceKm: 3250, reindeers: 1600000 },
  { name: 'USA (Alaska)', distanceKm: 3400, reindeers: 35000 },
  { name: 'Szkocja', distanceKm: 3700, reindeers: 150 },
  { name: 'Dania', distanceKm: 3820, reindeers: 42 },
  { name: 'Polska', distanceKm: 4180, reindeers: 12 },
  { name: 'Niemcy', distanceKm: 4350, reindeers: 8 },
  { name: 'Szwajcaria', distanceKm: 4720, reindeers: 3 },
  { name: 'Japonia', distanceKm: 5600, reindeers: 650 },
  { name: 'Brazylia', distanceKm: 10900, reindeers: 0 },
  { name: 'Australia', distanceKm: 13800, reindeers: 0 },
  { name: 'Antarktyda', distanceKm: 20000, reindeers: 0 },
]

const selectedCountry = ref('')
const adDismissed = ref(false)
const isSkipModalOpen = ref(false)
let skipOfferTimer: ReturnType<typeof setTimeout> | null = null

const selectedCountryMeta = computed(
  () => COUNTRIES.find((c) => c.name === selectedCountry.value) ?? null
)

const isNorthPoleAdVisible = computed(
  () => selectedCountry.value === 'Polska' && !adDismissed.value
)

const isCountryReady = computed(() => {
  if (!selectedCountry.value) return false
  if (selectedCountry.value === 'Polska' && !adDismissed.value) return false
  return true
})

const canProceed = computed(() => store.devMode || isCountryReady.value)

function dismissNorthPoleAd() {
  adDismissed.value = true
}

function closeSkipModal() {
  isSkipModalOpen.value = false
}

function proceedNext() {
  if (!canProceed.value) return
  store.completeStep('step-07-country', { country: selectedCountry.value })
  store.goToNextStep()
}

onMounted(() => {
  if (props.skipOfferDelayMs > 0) {
    skipOfferTimer = setTimeout(() => {
      if (!isCountryReady.value) {
        isSkipModalOpen.value = true
      }
    }, props.skipOfferDelayMs)
  }
})

onUnmounted(() => {
  if (skipOfferTimer !== null) {
    clearTimeout(skipOfferTimer)
  }
})
</script>

<template>
  <div
    data-testid="step-07-country"
    class="flex w-full max-w-md flex-col items-center gap-4 text-center"
  >
    <div class="w-full rounded-xl border-2 border-yellow-300/70 bg-black/45 p-3">
      <p class="text-sm font-extrabold text-yellow-200">
        🧭 Odległość od Bieguna Północnego
      </p>
      <p class="mt-1 text-xs text-amber-100">
        Wybierz kraj zamieszkania z naszego mikro-okienka (lista posortowana wg odległości od Mikołaja i populacji reniferów, bez wyszukiwarki!).
      </p>
    </div>

    <div class="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-red-400/80 bg-black/50 p-3">
      <label for="country-select" class="text-xs font-bold text-lime-200">
        🌍 Kraj dostawy prezentów:
      </label>

      <!-- Celowo małe okienko select bez wyszukiwarki i nieposortowane alfabetycznie -->
      <select
        id="country-select"
        v-model="selectedCountry"
        data-testid="country-select"
        class="h-8 w-44 border-2 border-yellow-300 bg-[#003300] px-1.5 py-0.5 text-xs font-bold text-yellow-100 outline-none focus:border-red-400"
      >
        <option value="">-- Wybierz (brak szukajki!) --</option>
        <option
          v-for="country in COUNTRIES"
          :key="country.name"
          :value="country.name"
        >
          {{ country.name }} ({{ country.distanceKm }} km | 🦌 {{ country.reindeers }})
        </option>
      </select>

      <p
        v-if="selectedCountryMeta"
        data-testid="country-distance-info"
        class="text-xs font-bold text-cyan-200"
      >
        🎅 Odległość od Bieguna: {{ selectedCountryMeta.distanceKm }} km • Renifery: {{ selectedCountryMeta.reindeers }}
      </p>
    </div>

    <!-- Natrętna reklama wycieczki na Biegun Północny po wybraniu Polski -->
    <div
      v-if="isNorthPoleAdVisible"
      data-testid="north-pole-ad"
      role="alert"
      class="w-full border-4 border-dashed border-yellow-300 bg-gradient-to-br from-red-700 via-red-900 to-green-900 p-3 shadow-[0_0_16px_#facc15]"
    >
      <p class="text-sm font-extrabold text-yellow-300">
        ✈️ SUPER PROMOCJA! WYCIECZKA NA BIEGUN PÓŁNOCNY! ❄️
      </p>
      <p class="mt-1 text-xs leading-relaxed text-white">
        Po co marznąć w Polsce, skoro możesz lecieć prosto do fabryki zabawek za jedyne 9 999 pierniczków?!
      </p>
      <div class="mt-2.5 flex justify-center">
        <KitschButton
          data-testid="close-north-pole-ad-btn"
          variant="gold"
          @click="dismissNorthPoleAd"
        >
          ❌ Zamknij reklamę i zostań przy Polsce
        </KitschButton>
      </div>
    </div>

    <KitschButton
      data-testid="step-07-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{
        canProceed
          ? '✅ Przejdź do Kroku 8 ➡️'
          : isNorthPoleAdVisible
            ? '🔒 Najpierw zamknij reklamę!'
            : '🔒 Wybierz kraj zamieszkania'
      }}
    </KitschButton>

    <ThanosSkipModal
      :open="isSkipModalOpen"
      :thanos-snap-duration-ms="thanosSnapDurationMs"
      @close="closeSkipModal"
    />
  </div>
</template>
