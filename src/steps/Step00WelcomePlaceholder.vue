<script setup lang="ts">
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'

const store = useRegistrationStore()

function markPreviewComplete() {
  store.completeStep('welcome-placeholder', { previewAcknowledged: true })
}
</script>

<template>
  <div data-testid="placeholder-step" class="flex max-w-md flex-col items-center gap-4 text-center">
    <div class="text-5xl" aria-hidden="true">🎄🎅🎁</div>

    <h3 class="text-xl font-extrabold text-yellow-300 sm:text-2xl">
      HO! HO! HO! Witaj w Świątecznym Formularzu Rejestracyjnym!
    </h3>

    <p class="rounded-2xl border-2 border-red-400/70 bg-black/30 p-4 text-sm leading-relaxed text-amber-50 sm:text-base">
      To jest przykładowy tekst wewnątrz głównego, kwadratowego kontenera formularza.
      W kolejnych etapach właśnie tutaj będą ładowane kolejne, absurdalnie trudne i kiczowate
      okna rejestracji — aby odblokować następne okno, trzeba będzie zaliczyć poprzednie!
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-1">
      <KitschButton
        v-if="!store.isCurrentStepCompleted"
        data-testid="placeholder-complete-btn"
        variant="gold"
        @click="markPreviewComplete"
      >
        ✨ Potwierdź, że jestem gotowy na kicz!
      </KitschButton>

      <p
        v-else
        data-testid="placeholder-completed-msg"
        class="rounded-xl border-2 border-lime-400 bg-emerald-900/80 px-4 py-2 text-sm font-bold text-lime-200"
      >
        ✅ Etap 0 zaliczony! Czas na kolejne kroki formularza w następnych etapach! 🦌
      </p>
    </div>
  </div>
</template>
