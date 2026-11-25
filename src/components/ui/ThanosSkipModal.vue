<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import KitschModal from './KitschModal.vue'
import KitschButton from './KitschButton.vue'

interface SkipOffer {
  id: number
  label: string
  variant: 'gold' | 'santa' | 'grinch'
}

interface DustParticle {
  id: number
  tx: string
  ty: string
  rot: string
  color: string
  delay: string
}

type OfferState = 'idle' | 'snapping' | 'gone'

const props = withDefaults(
  defineProps<{
    open?: boolean
    thanosSnapDurationMs?: number
    titleId?: string
  }>(),
  {
    open: true,
    thanosSnapDurationMs: 700,
    titleId: 'thanos-skip-title',
  }
)

const emit = defineEmits<{
  close: []
}>()

const regularOffers: SkipOffer[] = [
  { id: 1, label: '⏭️ Pomiń 1 krok — $2', variant: 'gold' },
  { id: 2, label: '⏭️ Pomiń 2 kroki — $3', variant: 'santa' },
  { id: 3, label: '⏭️ Pomiń 3 kroki — $5', variant: 'grinch' },
]

const offerStates = ref<Record<number, OfferState>>({
  1: 'idle',
  2: 'idle',
  3: 'idle',
})

const paymentFailed = ref(false)
const snapTimers: ReturnType<typeof setTimeout>[] = []

const dustParticles: DustParticle[] = [
  { id: 1, tx: '-64px', ty: '-38px', rot: '-45deg', color: '#facc15', delay: '0ms' },
  { id: 2, tx: '-32px', ty: '-52px', rot: '35deg', color: '#ef4444', delay: '20ms' },
  { id: 3, tx: '18px', ty: '-48px', rot: '-25deg', color: '#a855f7', delay: '10ms' },
  { id: 4, tx: '58px', ty: '-34px', rot: '60deg', color: '#22c55e', delay: '30ms' },
  { id: 5, tx: '-72px', ty: '14px', rot: '-70deg', color: '#fde047', delay: '15ms' },
  { id: 6, tx: '-24px', ty: '28px', rot: '50deg', color: '#fb923c', delay: '25ms' },
  { id: 7, tx: '28px', ty: '24px', rot: '-55deg', color: '#facc15', delay: '5ms' },
  { id: 8, tx: '70px', ty: '16px', rot: '40deg', color: '#c084fc', delay: '35ms' },
  { id: 9, tx: '-48px', ty: '46px', rot: '-80deg', color: '#f87171', delay: '20ms' },
  { id: 10, tx: '0px', ty: '54px', rot: '25deg', color: '#4ade80', delay: '10ms' },
  { id: 11, tx: '46px', ty: '48px', rot: '75deg', color: '#fef08a', delay: '30ms' },
  { id: 12, tx: '84px', ty: '-12px', rot: '-35deg', color: '#e879f9', delay: '15ms' },
]

function snapOffer(offerId: number) {
  if (offerStates.value[offerId] !== 'idle') return
  offerStates.value[offerId] = 'snapping'

  const timer = setTimeout(() => {
    offerStates.value[offerId] = 'gone'
  }, props.thanosSnapDurationMs)
  snapTimers.push(timer)
}

function selectSpecialOffer() {
  paymentFailed.value = true
}

function handleReturn() {
  paymentFailed.value = false
  emit('close')
}

onUnmounted(() => {
  for (const timer of snapTimers) {
    clearTimeout(timer)
  }
})
</script>

<template>
  <KitschModal
    v-if="open"
    data-testid="thanos-skip-modal"
    :title-id="titleId"
  >
    <div class="flex flex-col items-center gap-4 p-6 text-center">
      <div class="text-4xl" aria-hidden="true">{{ paymentFailed ? '🚫💳' : '🧤✨🎅' }}</div>

      <h4
        :id="titleId"
        class="kitsch-text-shadow text-xl font-extrabold text-yellow-300"
      >
        {{ paymentFailed ? 'Ups! Błąd płatności' : 'Świąteczny VIP Skip™!' }}
      </h4>

      <template v-if="!paymentFailed">
        <p class="text-xs leading-relaxed text-amber-100 sm:text-sm">
          Nie masz cierpliwości do tego formularza? Wykup natychmiastowe pominięcie kroków!
        </p>

        <div class="flex w-full flex-col gap-2.5">
          <template v-for="offer in regularOffers" :key="offer.id">
            <div
              v-if="offerStates[offer.id] !== 'gone'"
              class="relative w-full overflow-visible"
            >
              <KitschButton
                :data-testid="`skip-offer-${offer.id}`"
                :variant="offer.variant"
                class="w-full transition-all duration-300"
                :class="
                  offerStates[offer.id] === 'snapping'
                    ? 'pointer-events-none scale-90 opacity-0 blur-[1px]'
                    : ''
                "
                @click="snapOffer(offer.id)"
              >
                {{ offer.label }}
              </KitschButton>

              <div
                v-if="offerStates[offer.id] === 'snapping'"
                :data-testid="`thanos-dust-${offer.id}`"
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span
                  v-for="particle in dustParticles"
                  :key="particle.id"
                  class="thanos-particle"
                  :style="{
                    '--tx': particle.tx,
                    '--ty': particle.ty,
                    '--rot': particle.rot,
                    '--particle-color': particle.color,
                    animationDelay: particle.delay,
                    animationDuration: `${thanosSnapDurationMs}ms`,
                  }"
                />
              </div>
            </div>
          </template>

          <KitschButton
            data-testid="skip-offer-special"
            variant="gold"
            class="mt-1 w-full animate-pulse border-4 border-yellow-200 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-red-950 shadow-[0_0_20px_#facc15] ring-2 ring-yellow-300"
            @click="selectSpecialOffer"
          >
            👑 MEGA VIP ELITA: Pomiń WSZYSTKIE kroki — $9.99 ⭐
          </KitschButton>
        </div>
      </template>

      <template v-else>
        <p
          data-testid="skip-payment-error"
          class="rounded-xl border-2 border-red-400 bg-red-950/75 p-3 text-sm font-bold text-red-100"
        >
          Płatności niestety nie działają! Mikołaj zgubił terminal w zaspie śnieżnej ❄️
        </p>

        <KitschButton
          data-testid="skip-return-btn"
          variant="elf"
          @click="handleReturn"
        >
          🔙 Wróć do formularza
        </KitschButton>
      </template>
    </div>
  </KitschModal>
</template>

<style scoped>
@keyframes thanos-dust {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.2);
  }
}

.thanos-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--particle-color, #facc15);
  box-shadow: 0 0 6px var(--particle-color, #facc15);
  animation-name: thanos-dust;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}
</style>
