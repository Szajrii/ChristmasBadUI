<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import {
  clampDayToMonth,
  formatBirthdate,
  getDaysInMonth,
  POLISH_MONTHS,
  wrapMonth,
} from '../utils/birthdateCatapult'
import KitschButton from '../components/ui/KitschButton.vue'
import SleighCatapult from '../components/ui/SleighCatapult.vue'

const props = withDefaults(
  defineProps<{
    swapEveryClicks?: number
    catapultTickMs?: number
    catapultStepPerTick?: number
  }>(),
  {
    swapEveryClicks: 3,
    catapultTickMs: 35,
    catapultStepPerTick: 2.5,
  }
)

const store = useRegistrationStore()

const selectedYear = ref<number | null>(null)
const selectedMonth = ref(12)
const selectedDay = ref(24)
const adjustClicks = ref(0)
const isButtonsSwapped = ref(false)
const swapNotice = ref<string | null>(null)

const activeYearForDays = computed(() => selectedYear.value ?? 2024)
const maxDaysInCurrentMonth = computed(() =>
  getDaysInMonth(selectedMonth.value, activeYearForDays.value)
)

const formattedPreview = computed(() => {
  const yearLabel = selectedYear.value !== null ? String(selectedYear.value) : '????'
  const dd = String(selectedDay.value).padStart(2, '0')
  const mm = String(selectedMonth.value).padStart(2, '0')
  return `${dd}.${mm}.${yearLabel}`
})

const isDateReady = computed(() => selectedYear.value !== null)
const canProceed = computed(() => store.devMode || isDateReady.value)

const monthButtons = computed(() => {
  const base = [
    { id: 'month-dec-btn', label: '➖ -1 Miesiąc', delta: -1 },
    { id: 'month-inc-btn', label: '➕ +1 Miesiąc', delta: 1 },
  ]
  return isButtonsSwapped.value ? [...base].reverse() : base
})

const dayButtons = computed(() => {
  const base = [
    { id: 'day-dec-btn', label: '➖ -1 Dzień', delta: -1 },
    { id: 'day-inc-btn', label: '➕ +1 Dzień', delta: 1 },
  ]
  return isButtonsSwapped.value ? [...base].reverse() : base
})

function registerAdjustClick() {
  adjustClicks.value += 1
  if (props.swapEveryClicks > 0 && adjustClicks.value % props.swapEveryClicks === 0) {
    isButtonsSwapped.value = !isButtonsSwapped.value
    swapNotice.value = '❄️ Elfy zamieniły przyciski +1 i -1 miejscami!'
  } else {
    swapNotice.value = null
  }
}

function changeMonth(delta: number) {
  selectedMonth.value = wrapMonth(selectedMonth.value + delta)
  const maxDays = getDaysInMonth(selectedMonth.value, activeYearForDays.value)
  if (selectedDay.value > maxDays) {
    selectedDay.value = maxDays
  }
  registerAdjustClick()
}

function changeDay(delta: number) {
  selectedDay.value = clampDayToMonth(
    selectedDay.value + delta,
    selectedMonth.value,
    activeYearForDays.value
  )
  registerAdjustClick()
}

watch(selectedYear, (newYear) => {
  if (newYear === null) return
  const maxDays = getDaysInMonth(selectedMonth.value, newYear)
  if (selectedDay.value > maxDays) {
    selectedDay.value = maxDays
  }
})

function proceedNext() {
  if (!canProceed.value) return
  const yearToSave = selectedYear.value ?? 2000
  store.completeStep('step-05-birthdate', {
    birthdate: formatBirthdate(selectedDay.value, selectedMonth.value, yearToSave),
    birthYear: yearToSave,
    birthMonth: selectedMonth.value,
    birthDay: selectedDay.value,
  })
  store.goToNextStep()
}
</script>

<template>
  <div data-testid="step-05-birthdate" class="flex w-full max-w-md flex-col items-center gap-3.5 text-center">
    <div class="retro-bevel w-full border-[#ffff00] bg-[#880000] px-3 py-2">
      <div class="text-xs font-bold text-[#ffff88]">Wybrana data urodzenia:</div>
      <div data-testid="birthdate-preview" class="text-2xl font-extrabold tracking-widest text-[#00ff00]">
        {{ formattedPreview }}
      </div>
      <div class="text-[11px] font-bold text-[#ffffff]">
        {{ selectedDay }} {{ POLISH_MONTHS[selectedMonth - 1] }}
        {{ selectedYear !== null ? selectedYear : '(najpierw rzuć saniami po rok!)' }}
      </div>
    </div>

    <!-- Sekcja 1: Katapulta Sań dla roku -->
    <SleighCatapult
      v-model="selectedYear"
      :tick-ms="props.catapultTickMs"
      :step-per-tick="props.catapultStepPerTick"
    />

    <!-- Sekcja 2: Miesiąc i Dzień z tasującymi się przyciskami -->
    <div class="retro-bevel flex w-full flex-col gap-2.5 border-[#00ff00] bg-[#002244] p-3">
      <div class="flex items-center justify-between text-xs font-bold text-[#ffff00]">
        <span>📅 Miesiąc i Dzień (uwaga na elfy!)</span>
        <span class="text-[#88ff88]">Dni w mies.: {{ maxDaysInCurrentMonth }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <div data-testid="month-display" class="text-xs font-bold text-[#ffffff]">
          Miesiąc: <span class="text-[#ffcc00]">{{ POLISH_MONTHS[selectedMonth - 1] }} ({{ selectedMonth }})</span>
        </div>
        <div data-testid="month-buttons-row" class="grid grid-cols-2 gap-2">
          <KitschButton
            v-for="btn in monthButtons"
            :key="btn.id"
            :data-testid="btn.id"
            :variant="btn.delta > 0 ? 'elf' : 'santa'"
            @click="changeMonth(btn.delta)"
          >
            {{ btn.label }}
          </KitschButton>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <div data-testid="day-display" class="text-xs font-bold text-[#ffffff]">
          Dzień: <span class="text-[#ffcc00]">{{ selectedDay }}</span>
        </div>
        <div data-testid="day-buttons-row" class="grid grid-cols-2 gap-2">
          <KitschButton
            v-for="btn in dayButtons"
            :key="btn.id"
            :data-testid="btn.id"
            :variant="btn.delta > 0 ? 'elf' : 'santa'"
            @click="changeDay(btn.delta)"
          >
            {{ btn.label }}
          </KitschButton>
        </div>
      </div>

      <p
        v-if="swapNotice"
        data-testid="buttons-swap-notice"
        role="status"
        class="border-2 border-[#ffff00] bg-[#660000] px-2 py-1 text-xs font-bold text-[#ffff00]"
      >
        {{ swapNotice }}
      </p>
    </div>

    <KitschButton
      data-testid="step-05-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{ canProceed ? '✅ Zatwierdź datę urodzenia ➡️' : '🛷 Najpierw wystrzel rok katapultą!' }}
    </KitschButton>
  </div>
</template>
