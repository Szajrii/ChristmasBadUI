<script setup lang="ts">
import { useRegistrationStore } from '../../stores/registrationStore'
import ChristmasLights from '../ui/ChristmasLights.vue'
import KitschButton from '../ui/KitschButton.vue'

const store = useRegistrationStore()
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
          @click="store.openVolumeGame()"
        >
          {{ store.musicVolume === 0 ? '🔇' : '🔊' }} Muzyka: {{ store.musicVolume }}%
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
      </nav>
    </div>
  </header>
</template>
