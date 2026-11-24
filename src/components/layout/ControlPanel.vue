<script setup lang="ts">
import { useRegistrationStore } from '../../stores/registrationStore'
import { registrationSteps } from '../../steps/stepRegistry'
import ChristmasLights from '../ui/ChristmasLights.vue'
import KitschButton from '../ui/KitschButton.vue'

const store = useRegistrationStore()

function onDevModeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  store.setDevMode(value === 'on')
}

function onDevStepChange(event: Event) {
  const index = Number((event.target as HTMLSelectElement).value)
  store.goToStep(index)
}
</script>

<template>
  <header
    data-testid="control-panel"
    class="relative z-20 w-full border-b-4 border-yellow-400 bg-gradient-to-r from-red-900 via-emerald-900 to-red-900 shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
  >
    <ChristmasLights :enabled="store.settings.lightsEnabled" :count="18" />

    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3"
    >
      <!-- Branding -->
      <div class="flex items-center gap-2.5">
        <span class="text-3xl" aria-hidden="true">🎅</span>
        <div>
          <h1 class="kitsch-text-shadow text-lg font-extrabold tracking-wide text-yellow-300 sm:text-xl">
            ChristmasBadUI™
          </h1>
          <p class="text-xs text-emerald-200">
            Panel Kontrolny Bieguna Północnego • Krok {{ store.currentStepIndex + 1 }} / {{ store.totalSteps }}
          </p>
        </div>
      </div>

      <!-- Control options -->
      <nav aria-label="Panel kontrolny" class="flex flex-wrap items-center gap-2">
        <KitschButton
          data-testid="volume-control-btn"
          variant="grinch"
          :active="store.isVolumeGameOpen"
          :disabled="store.devMode"
          @click="store.openVolumeGame()"
        >
          {{ store.effectiveMusicVolume === 0 ? '🔇' : '🔊' }} Muzyka: {{ store.effectiveMusicVolume }}%{{ store.devMode ? ' (DEV)' : '' }}
        </KitschButton>

        <KitschButton
          data-testid="toggle-snow-btn"
          variant="elf"
          :active="store.settings.snowEnabled"
          @click="store.toggleSetting('snowEnabled')"
        >
          ❄️ Śnieg: {{ store.settings.snowEnabled ? 'ON' : 'OFF' }}
        </KitschButton>

        <KitschButton
          data-testid="toggle-lights-btn"
          variant="gold"
          :active="store.settings.lightsEnabled"
          @click="store.toggleSetting('lightsEnabled')"
        >
          💡 Lampki: {{ store.settings.lightsEnabled ? 'ON' : 'OFF' }}
        </KitschButton>

        <KitschButton
          data-testid="toggle-border-btn"
          variant="santa"
          :active="store.settings.kitschBorderEnabled"
          @click="store.toggleSetting('kitschBorderEnabled')"
        >
          🍬 Ramka: {{ store.settings.kitschBorderEnabled ? 'KICZ' : 'ZŁOTO' }}
        </KitschButton>

        <!-- Combobox Tryb Deweloperski -->
        <label class="inline-flex items-center gap-1.5 rounded-xl border-2 border-yellow-300 bg-black/45 px-2.5 py-1.5 text-xs font-bold text-yellow-200">
          <span aria-hidden="true">🛠️</span>
          <select
            data-testid="dev-mode-select"
            aria-label="Tryb deweloperski"
            :value="store.devMode ? 'on' : 'off'"
            class="cursor-pointer bg-transparent text-xs font-bold text-yellow-200 outline-none"
            @change="onDevModeChange"
          >
            <option value="off" class="bg-red-950 text-yellow-100">Tryb dev: OFF</option>
            <option value="on" class="bg-emerald-950 text-lime-200">Tryb dev: ON</option>
          </select>
        </label>
      </nav>
    </div>

    <!-- Pasek szybkiej nawigacji widoczny w trybie deweloperskim -->
    <div
      v-if="store.devMode"
      data-testid="dev-nav-bar"
      class="border-t-2 border-dashed border-lime-400/60 bg-black/50 px-4 py-2"
    >
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs">
        <span class="font-bold text-lime-300">
          🛠️ TRYB DEWELOPERSKI AKTYWNY — muzyka wyciszona, wszystkie kroki odblokowane (animacje i efekty działają)
        </span>

        <div class="flex items-center gap-2">
          <KitschButton
            data-testid="dev-prev-btn"
            variant="elf"
            :disabled="!store.canGoPrevious"
            @click="store.goToPreviousStep()"
          >
            ⬅️ Poprzedni
          </KitschButton>

          <select
            data-testid="dev-step-select"
            aria-label="Skocz do kroku"
            :value="store.currentStepIndex"
            class="rounded-xl border-2 border-lime-400 bg-emerald-950 px-2.5 py-1.5 text-xs font-bold text-lime-100 outline-none"
            @change="onDevStepChange"
          >
            <option
              v-for="(step, idx) in registrationSteps"
              :key="step.id"
              :value="idx"
            >
              {{ idx + 1 }}. {{ step.title }} ({{ step.id }})
            </option>
          </select>

          <KitschButton
            data-testid="dev-next-btn"
            variant="gold"
            :disabled="!store.canGoNext"
            @click="store.goToNextStep()"
          >
            Następny ➡️
          </KitschButton>
        </div>
      </div>
    </div>
  </header>
</template>
