<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '../../stores/registrationStore'
import KitschButton from './KitschButton.vue'
import KitschModal from './KitschModal.vue'

const emit = defineEmits<{
  reset: []
}>()

const store = useRegistrationStore()
const router = useRouter()

async function handleReset() {
  store.resetProgress()
  emit('reset')
  if (router && typeof router.push === 'function') {
    await router.push('/')
  }
}
</script>

<template>
  <KitschModal
    data-testid="santa-error-modal"
    title-id="santa-error-modal-title"
    max-width-class="max-w-lg"
  >
    <div class="flex flex-col items-center gap-4 p-6 text-center">
      <!-- Retro twarz Mikołaja (SVG) + dymek dialogowy z ust -->
      <div class="relative flex flex-col items-center sm:flex-row sm:items-start sm:justify-center sm:gap-3">
        <svg
          data-testid="santa-retro-svg"
          viewBox="0 0 180 180"
          class="h-40 w-40 shrink-0 border-4 border-[#ffff00] bg-[#004400] p-1 shadow-[4px_4px_0_#000000]"
          role="img"
          aria-label="Retro Święty Mikołaj"
        >
          <!-- Czapka Mikołaja -->
          <polygon points="35,65 95,12 145,65" fill="#ff0000" stroke="#000000" stroke-width="4" />
          <circle cx="95" cy="14" r="11" fill="#ffffff" stroke="#000000" stroke-width="3" />
          <rect x="28" y="56" width="124" height="20" rx="4" fill="#ffffff" stroke="#000000" stroke-width="4" />

          <!-- Twarz -->
          <circle cx="90" cy="102" r="44" fill="#ffd1b3" stroke="#000000" stroke-width="4" />

          <!-- Oczy -->
          <circle cx="72" cy="92" r="6" fill="#000000" />
          <circle cx="74" cy="90" r="2" fill="#ffffff" />
          <circle cx="108" cy="92" r="6" fill="#000000" />
          <circle cx="110" cy="90" r="2" fill="#ffffff" />

          <!-- Brwi -->
          <rect x="60" y="80" width="24" height="7" rx="3" fill="#ffffff" stroke="#000000" stroke-width="2" />
          <rect x="96" y="80" width="24" height="7" rx="3" fill="#ffffff" stroke="#000000" stroke-width="2" />

          <!-- Różowe policzki -->
          <circle cx="62" cy="108" r="7" fill="#ff6666" opacity="0.7" />
          <circle cx="118" cy="108" r="7" fill="#ff6666" opacity="0.7" />

          <!-- Broda -->
          <path
            d="M44,108 Q42,166 90,170 Q138,166 136,108 Q120,122 90,122 Q60,122 44,108 Z"
            fill="#ffffff"
            stroke="#000000"
            stroke-width="4"
          />

          <!-- Wąsy -->
          <path
            d="M90,108 Q68,104 54,116 Q72,126 90,114 Q108,126 126,116 Q112,104 90,108 Z"
            fill="#ffffff"
            stroke="#000000"
            stroke-width="3"
          />

          <!-- Nos -->
          <circle cx="90" cy="104" r="9" fill="#ee0000" stroke="#000000" stroke-width="3" />

          <!-- Usta -->
          <ellipse cx="90" cy="124" rx="10" ry="7" fill="#660000" stroke="#000000" stroke-width="3" />
        </svg>

        <!-- Dymek dialogowy wychodzący z ust Mikołaja -->
        <div
          data-testid="santa-speech-bubble"
          class="relative mt-2 border-4 border-[#000000] bg-[#ffffff] px-4 py-2 text-base font-extrabold text-[#cc0000] shadow-[4px_4px_0_#000000] sm:mt-16"
        >
          <span
            aria-hidden="true"
            class="absolute -top-3 left-1/2 hidden h-4 w-4 -translate-x-1/2 rotate-45 border-l-4 border-t-4 border-[#000000] bg-[#ffffff] sm:-left-3 sm:top-4 sm:block sm:translate-x-0 sm:border-b-4 sm:border-l-4 sm:border-t-0"
          />
          „Hoł Hoł Hoł...”
        </div>
      </div>

      <h3
        id="santa-error-modal-title"
        class="kitsch-text-shadow text-xl font-extrabold uppercase text-[#ffff00] sm:text-2xl"
      >
        💥 BŁĄD SERWERA 500!
      </h3>

      <div
        data-testid="santa-error-message"
        class="border-2 border-dashed border-[#ffff00] bg-[#000000]/50 p-3 text-sm leading-relaxed text-[#ffffff]"
      >
        <p class="font-bold text-[#ff9999]">
          Wystąpił krytyczny błąd serwera Bieguna Północnego podczas zapisywania Twojego certyfikatu!
        </p>
        <p class="mt-2 text-[#ffffcc]">
          Twoja rejestracja musi zostać zrobiona jeszcze raz od samego początku. Przepraszamy za błędy! 🦌🔥
        </p>
      </div>

      <KitschButton
        data-testid="santa-error-reset-btn"
        variant="gold"
        class="w-full justify-center py-2.5 text-base uppercase"
        @click="handleReset"
      >
        🔄 Zresetuj i zacznij od nowa
      </KitschButton>
    </div>
  </KitschModal>
</template>
