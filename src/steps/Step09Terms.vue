<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import ParabolicCheckbox from '../components/ui/ParabolicCheckbox.vue'

const props = withDefaults(
  defineProps<{
    escapesCount?: number
    maxScrollSpeedPxPerSec?: number
    maxScrollJumpPx?: number
  }>(),
  {
    escapesCount: 3,
    maxScrollSpeedPxPerSec: 450,
    maxScrollJumpPx: 120,
  }
)

const store = useRegistrationStore()

const termsAccepted = ref(false)
const marketingConsent = ref(false)
const scrollWarning = ref<string | null>(null)

const scrollContainerRef = ref<HTMLElement | null>(null)
const lastScrollTop = ref(0)
const lastScrollTime = ref<number>(Date.now())
const isResettingScroll = ref(false)

const canProceed = computed(() => store.devMode || termsAccepted.value)

const termsParagraphs = [
  '§ 1. Postanowienia ogólne Bieguna Północnego: Administratorem Twoich Danych Osobowych, Marzeń Świątecznych oraz Poziomu Grzeczności jest Święty Mikołaj sp. z o.o. z siedzibą w Igloo nr 1, 00-001 Biegun Północny.',
  '§ 2. Cel przetwarzania danych: Twoje dane (w tym liczba zjedzonych pierniczków oraz dokładna godzina pójścia spać w Wigilię) będą przetwarzane przez Elfy-Analityków w celu podjęcia decyzji o przydziale prezentu lub bryły węgla.',
  '§ 3. Podstawa prawna RODO (Reniferowa Ochrona Danych Osobowych): Przetwarzanie odbywa się na podstawie Art. 6 ust. 1 lit. ho-ho-ho Rozporządzenia Świątecznego oraz Prawa Sanek.',
  '§ 4. Profilowanie grzeczności: Zgadzasz się na zautomatyzowane podejmowanie decyzji przez system „Wiem-Kiedy-Śpisz 3000”, który monitoruje, czy nie podglądasz prezentów przed pierwszą gwiazdką.',
  '§ 5. Przekazywanie danych podmiotom trzecim: Twoje dane mogą być przekazywane Reniferom (w celu nawigacji kominowej), Pani Mikołajowej (w celu kalibracji rozmiaru swetra) oraz Bałwanom z działu wsparcia.',
  '§ 6. Czas przechowywania danych: Dane o Twoich dziecięcych wpadkach będą przechowywane wieczyście w Złotej Księdze Mikołaja lub do momentu roztopienia lodowców (zależnie od tego, co nastąpi później).',
  '§ 7. Prawa użytkownika: Masz prawo dostępu do swoich danych, prawo do sprostowania listy życzeń (do 6 grudnia) oraz prawo do bycia zapomnianym, jeśli wyślesz list gończy za pomocą gołębia śnieżnego w formacie PDF.',
  '§ 8. Ciasteczka i mleko: Serwis wykorzystuje pliki cookies (najlepiej z kawałkami czekolady). Brak pozostawienia mleka przy kominku może skutkować opóźnieniem dostawy sań o 365 dni.',
  '§ 9. Postanowienia końcowe: Klikając mikroskopijny checkbox poniżej, potwierdzasz, że przeczytałeś każdy przecinek niniejszego regulaminu z należytą świąteczną powagą i bez użycia przewijania turbo.',
]

function handleTermsScroll(event: Event) {
  if (isResettingScroll.value) {
    isResettingScroll.value = false
    return
  }

  const el = event.target as HTMLElement | null
  if (!el) return

  const currentTop = el.scrollTop
  const now = Date.now()
  const deltaScroll = currentTop - lastScrollTop.value

  if (deltaScroll > 0) {
    const elapsedMs = lastScrollTime.value !== null ? now - lastScrollTime.value : 0
    const speedPxPerSec = elapsedMs > 0 ? (deltaScroll / elapsedMs) * 1000 : Infinity

    if (deltaScroll > props.maxScrollJumpPx || speedPxPerSec > props.maxScrollSpeedPxPerSec) {
      isResettingScroll.value = true
      el.scrollTop = 0
      lastScrollTop.value = 0
      lastScrollTime.value = now
      scrollWarning.value =
        'Przewinąłeś za szybko! Mikołaj wie, że nie czytałeś — wracamy na górę!'
      return
    }
  }

  lastScrollTop.value = currentTop
  lastScrollTime.value = now
}

function proceedNext() {
  if (!canProceed.value) return
  store.completeStep('step-09-terms', { termsAccepted: true })
  store.goToNextStep()
}
</script>

<template>
  <div data-testid="step-09-terms" class="flex w-full max-w-md flex-col items-center gap-3 text-center">
    <div class="retro-bevel w-full border-[#ffff00] bg-[#880000] px-3 py-2">
      <div class="text-sm font-extrabold text-[#ffff00]">
        📜 Regulamin Mikołaja — RODO Bieguna Północnego
      </div>
      <div class="text-[11px] font-bold text-[#ffffff]">
        Przeczytaj powoli i uważnie. Święty Mikołaj mierzy prędkość Twojego scrolla!
      </div>
    </div>

    <div
      ref="scrollContainerRef"
      data-testid="terms-scroll-container"
      class="retro-bevel h-44 w-full overflow-y-auto border-[#00ff00] bg-[#001a33] p-3 text-left text-xs leading-relaxed text-[#e6ffe6]"
      @scroll="handleTermsScroll"
    >
      <p v-for="(paragraph, index) in termsParagraphs" :key="index" class="mb-3 last:mb-0">
        {{ paragraph }}
      </p>
    </div>

    <p
      v-if="scrollWarning"
      data-testid="scroll-warning"
      role="alert"
      class="w-full border-2 border-[#ffff00] bg-[#cc0000] px-2.5 py-1.5 text-xs font-extrabold text-[#ffff00]"
    >
      🚨 {{ scrollWarning }}
    </p>

    <ParabolicCheckbox
      v-model="termsAccepted"
      :escapes-count="props.escapesCount"
      label="Akceptuję"
    />

    <label
      class="retro-bevel flex w-full cursor-pointer items-start gap-2 border-[#88ff88] bg-[#002b00] px-2.5 py-2 text-left text-[11px] text-[#ffffff]"
    >
      <input
        v-model="marketingConsent"
        data-testid="marketing-consent-checkbox"
        type="checkbox"
        class="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#ffcc00]"
      />
      <span>
        Zgoda marketingowa (opcjonalna): chcę otrzymywać spam z Bieguna Północnego oraz powiadomienia o promocjach na węgiel.
      </span>
    </label>

    <KitschButton
      data-testid="step-09-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{ canProceed ? '✅ Przejdź dalej ➡️' : '📜 Najpierw złap i zaznacz „Akceptuję”!' }}
    </KitschButton>
  </div>
</template>
