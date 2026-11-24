<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRegistrationStore } from './stores/registrationStore'
import { FestiveAudioPlayer } from './utils/lastChristmasAudio'
import SnowfallOverlay from './components/ui/SnowfallOverlay.vue'
import ControlPanel from './components/layout/ControlPanel.vue'
import StageContainer from './components/layout/StageContainer.vue'
import VolumeBaubleGameModal from './components/ui/VolumeBaubleGameModal.vue'

const store = useRegistrationStore()
const audioPlayer = new FestiveAudioPlayer()

function handleFirstInteraction() {
  audioPlayer.resumeIfSuspended()
}

function handleVolumeGameComplete(payload: { reductionPercent: number; allClicked: boolean }) {
  store.finishVolumeGame(payload.reductionPercent, payload.allClicked)
}

watch(
  () => store.effectiveMusicVolume,
  (newVolume) => {
    audioPlayer.setVolume(newVolume)
  }
)

onMounted(() => {
  audioPlayer.start(store.effectiveMusicVolume)
  window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
  window.addEventListener('keydown', handleFirstInteraction, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handleFirstInteraction)
  window.removeEventListener('keydown', handleFirstInteraction)
  audioPlayer.stop()
})
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <SnowfallOverlay :enabled="store.effectiveSnowEnabled" />

    <ControlPanel />

    <main class="flex flex-1 flex-col">
      <StageContainer>
        <component :is="store.currentStep.component" v-if="store.currentStep" />
      </StageContainer>
    </main>

    <VolumeBaubleGameModal
      v-if="store.isVolumeGameOpen"
      @complete="handleVolumeGameComplete"
    />
  </div>
</template>
