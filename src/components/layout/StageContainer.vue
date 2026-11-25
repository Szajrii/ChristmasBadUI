<script setup lang="ts">
import { useRegistrationStore } from '../../stores/registrationStore'
import KitschCard from '../ui/KitschCard.vue'
import ChristmasLights from '../ui/ChristmasLights.vue'

const store = useRegistrationStore()
</script>

<template>
  <section
    aria-label="Kontener formularza rejestracyjnego"
    class="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-8"
  >
    <KitschCard
      data-testid="stage-container"
      :striped-border="store.settings.kitschBorderEnabled"
      class="aspect-square w-full max-w-[780px]"
    >
      <div class="flex h-full flex-col justify-between bg-[#005500]/60 p-5 sm:p-7">
        <!-- Step header -->
        <div class="border-b-4 border-double border-[#ffff00] pb-3 text-center">
          <div class="mb-1 flex items-center justify-center gap-2 text-2xl sm:text-3xl">
            <span aria-hidden="true">{{ store.currentStep?.icon ?? '🎄' }}</span>
            <h2 class="kitsch-text-shadow font-extrabold text-[#ffff00]">
              {{ store.currentStep?.title ?? 'Ładowanie świątecznego chaosu...' }}
            </h2>
            <span aria-hidden="true">{{ store.currentStep?.icon ?? '🎄' }}</span>
          </div>
          <p class="text-xs font-bold text-[#ffffff] sm:text-sm">
            {{ store.currentStep?.subtitle }}
          </p>
        </div>

        <!-- Dynamic step content slot -->
        <div class="my-4 flex flex-1 flex-col items-center justify-center overflow-y-auto px-2">
          <slot />
        </div>

        <!-- Footer status bar -->
        <div class="border-t-4 border-double border-[#ffff00] pt-2">
          <ChristmasLights :enabled="store.settings.lightsEnabled" :count="10" />
          <div class="mt-1 flex items-center justify-between text-xs font-bold text-[#ffff00]">
            <span>🎁 Postęp: {{ store.progressPercent }}%</span>
            <span>🦌 Okno {{ store.currentStepIndex + 1 }} z {{ store.totalSteps }}</span>
          </div>
        </div>
      </div>
    </KitschCard>
  </section>
</template>
