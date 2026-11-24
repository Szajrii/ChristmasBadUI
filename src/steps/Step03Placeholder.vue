<script setup lang="ts">
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'

const store = useRegistrationStore()
</script>

<template>
  <div data-testid="step-03-placeholder" class="flex max-w-md flex-col items-center gap-4 text-center">
    <div class="text-5xl" aria-hidden="true">📧🎉🦌</div>

    <h3 class="text-xl font-extrabold text-yellow-300 sm:text-2xl">
      Krok 3 Rejestracji — Wkrótce!
    </h3>

    <p class="rounded-2xl border-2 border-emerald-400/70 bg-black/30 p-4 text-sm leading-relaxed text-amber-50 sm:text-base">
      Brawo, <strong class="text-yellow-300">{{ store.formData.username || 'Świąteczny Gościu' }}</strong>!
      Twój absurdalny e-mail został zaakceptowany. Kolejny krok pojawi się wkrótce! 🎄
    </p>

    <KitschButton
      v-if="store.canGoPrevious"
      data-testid="step-03-back-btn"
      variant="elf"
      @click="store.goToPreviousStep()"
    >
      ⬅️ Wróć do Kroku 2
    </KitschButton>
  </div>
</template>
