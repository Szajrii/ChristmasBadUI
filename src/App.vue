<script setup lang="ts">
import { useRegistrationStore } from './stores/registrationStore'
import SnowfallOverlay from './components/ui/SnowfallOverlay.vue'
import ControlPanel from './components/layout/ControlPanel.vue'
import StageContainer from './components/layout/StageContainer.vue'

const store = useRegistrationStore()
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <SnowfallOverlay :enabled="store.settings.snowEnabled" />

    <ControlPanel />

    <main class="flex flex-1 flex-col">
      <StageContainer>
        <component :is="store.currentStep.component" v-if="store.currentStep" />
      </StageContainer>
    </main>
  </div>
</template>
