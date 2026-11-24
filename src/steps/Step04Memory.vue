<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import { createMemoryDeck, type MemoryCard } from '../utils/memoryGame'
import KitschButton from '../components/ui/KitschButton.vue'
import KitschModal from '../components/ui/KitschModal.vue'

const props = withDefaults(
  defineProps<{
    mismatchDelayMs?: number
    skipOfferDelayMs?: number
    randomFn?: () => number
  }>(),
  {
    mismatchDelayMs: 650,
    skipOfferDelayMs: 5000,
    randomFn: () => Math.random(),
  }
)

const store = useRegistrationStore()

const cards = ref<MemoryCard[]>(createMemoryDeck(4, props.randomFn))
const selectedIds = ref<number[]>([])
const isLocked = ref(false)
const attempts = ref(1)
const statusMessage = ref<string | null>(null)
const isSkipModalOpen = ref(false)
const paymentFailed = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null
let skipOfferTimer: ReturnType<typeof setTimeout> | null = null

const isWon = computed(() => cards.value.every((c) => c.matched))
const canProceed = computed(() => store.devMode || isWon.value)

function flipBackMismatched(firstCard: MemoryCard, secondCard: MemoryCard) {
  firstCard.flipped = false
  secondCard.flipped = false
  selectedIds.value = []
  isLocked.value = false
  attempts.value += 1
}

function flipCard(card: MemoryCard) {
  if (isLocked.value || card.flipped || card.matched || isWon.value) return

  card.flipped = true
  selectedIds.value.push(card.id)
  statusMessage.value = null

  if (selectedIds.value.length < 2) return

  const [firstId, secondId] = selectedIds.value
  const firstCard = cards.value.find((c) => c.id === firstId)
  const secondCard = cards.value.find((c) => c.id === secondId)

  if (!firstCard || !secondCard) return

  if (firstCard.symbol === secondCard.symbol) {
    firstCard.matched = true
    secondCard.matched = true
    selectedIds.value = []

    if (isWon.value) {
      statusMessage.value = '🎉 BRAWO! Bezbłędna pamięć! Możesz przejść dalej!'
    }
    return
  }

  // Pomyłka -> blokujemy na chwilę, a potem zakrywamy tylko dwie nietrafione karty
  isLocked.value = true
  statusMessage.value = '💥 PUDŁO! Spróbuj jeszcze raz!'

  resetTimer = setTimeout(() => {
    flipBackMismatched(firstCard, secondCard)
  }, props.mismatchDelayMs)
}

function selectSkipOffer() {
  paymentFailed.value = true
}

function closeSkipModal() {
  isSkipModalOpen.value = false
  paymentFailed.value = false
}

function proceedNext() {
  if (!canProceed.value) return
  store.completeStep('step-04-memory', { memoryAttempts: attempts.value })
  store.goToNextStep()
}

onMounted(() => {
  if (props.skipOfferDelayMs > 0) {
    skipOfferTimer = setTimeout(() => {
      if (!isWon.value) {
        paymentFailed.value = false
        isSkipModalOpen.value = true
      }
    }, props.skipOfferDelayMs)
  }
})

onUnmounted(() => {
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
  }
  if (skipOfferTimer !== null) {
    clearTimeout(skipOfferTimer)
  }
})
</script>

<template>
  <div data-testid="step-04-memory" class="flex w-full max-w-md flex-col items-center gap-4 text-center">
    <div class="flex w-full items-center justify-between rounded-xl border-2 border-yellow-300/60 bg-black/40 px-3 py-2 text-xs font-bold">
      <span class="text-yellow-200">🃏 Znajdź wszystkie 4 świąteczne pary!</span>
      <span data-testid="memory-attempts" class="text-emerald-300">Próba #{{ attempts }}</span>
    </div>

    <div
      data-testid="memory-grid"
      class="grid w-full grid-cols-4 gap-2.5 rounded-2xl border-2 border-red-400/70 bg-black/45 p-3"
    >
      <button
        v-for="card in cards"
        :key="card.id"
        type="button"
        :data-testid="`memory-card-${card.id}`"
        :data-symbol="card.symbol"
        :aria-label="card.flipped || card.matched ? card.symbol : 'Zakryta karta'"
        class="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 text-3xl font-bold shadow-md transition-transform duration-150 hover:scale-105 active:scale-95"
        :class="
          card.matched
            ? 'border-lime-400 bg-emerald-800/90 shadow-[0_0_12px_#4ade80]'
            : card.flipped
              ? 'border-yellow-300 bg-amber-100 text-slate-900'
              : 'border-yellow-400/80 bg-gradient-to-br from-red-600 via-red-800 to-red-950 text-yellow-200'
        "
        @click="flipCard(card)"
      >
        {{ card.flipped || card.matched ? card.symbol : '🎁' }}
      </button>
    </div>

    <p
      v-if="statusMessage"
      data-testid="memory-status"
      role="status"
      class="w-full rounded-xl border-2 px-3 py-2 text-xs font-bold"
      :class="
        isWon
          ? 'border-lime-400 bg-emerald-950/85 text-lime-200'
          : 'border-red-400 bg-red-950/85 text-red-100'
      "
    >
      {{ statusMessage }}
    </p>

    <KitschButton
      data-testid="step-04-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{ canProceed ? '✅ Przejdź do Kroku 5 ➡️' : '🔒 Dopasuj wszystkie 4 pary' }}
    </KitschButton>

    <!-- Po 5 sekundach: fałszywy dialog wykupu pominięcia kroków -->
    <KitschModal
      v-if="isSkipModalOpen"
      data-testid="memory-skip-modal"
      title-id="memory-skip-title"
    >
      <div class="flex flex-col items-center gap-4 p-6 text-center">
        <div class="text-4xl" aria-hidden="true">{{ paymentFailed ? '🚫💳' : '💸🎅🎁' }}</div>

        <h4
          id="memory-skip-title"
          class="kitsch-text-shadow text-xl font-extrabold text-yellow-300"
        >
          {{ paymentFailed ? 'Ups! Błąd płatności' : 'Świąteczny VIP Skip™!' }}
        </h4>

        <template v-if="!paymentFailed">
          <p class="text-xs leading-relaxed text-amber-100 sm:text-sm">
            Nie masz cierpliwości do kart? Wykup natychmiastowe pominięcie kolejnych kroków!
          </p>

          <div class="flex w-full flex-col gap-2.5">
            <KitschButton
              data-testid="skip-offer-1"
              variant="gold"
              class="w-full"
              @click="selectSkipOffer"
            >
              ⏭️ Pomiń 1 krok — $2
            </KitschButton>
            <KitschButton
              data-testid="skip-offer-2"
              variant="santa"
              class="w-full"
              @click="selectSkipOffer"
            >
              ⏭️ Pomiń 2 kroki — $3
            </KitschButton>
            <KitschButton
              data-testid="skip-offer-3"
              variant="grinch"
              class="w-full"
              @click="selectSkipOffer"
            >
              ⏭️ Pomiń 3 kroki — $5
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
            @click="closeSkipModal"
          >
            🃏 Wróć do gry
          </KitschButton>
        </template>
      </div>
    </KitschModal>
  </div>
</template>
