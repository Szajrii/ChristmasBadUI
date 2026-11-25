<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import SantaErrorModal from '../components/ui/SantaErrorModal.vue'

const store = useRegistrationStore()
const isErrorModalOpen = ref(false)

interface CertificateField {
  key: string
  label: string
  value: string
}

const KNOWN_FIELD_LABELS: Array<{ key: string; label: string }> = [
  { key: 'username', label: 'Nazwa użytkownika' },
  { key: 'email', label: 'Adres e-mail' },
  { key: 'interests', label: 'Zainteresowania' },
  { key: 'memoryAttempts', label: 'Próby w grze Memory' },
  { key: 'birthdate', label: 'Data urodzenia' },
  { key: 'phoneNumber', label: 'Numer telefonu' },
  { key: 'country', label: 'Kraj' },
]

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') {
    return '— (brak danych)'
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '— (brak)'
  }
  if (typeof value === 'boolean') {
    return value ? 'Tak' : 'Nie'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

const certificateFields = computed<CertificateField[]>(() => {
  const data = store.formData
  const knownKeys = new Set(KNOWN_FIELD_LABELS.map((item) => item.key))

  const primaryFields = KNOWN_FIELD_LABELS.map(({ key, label }) => ({
    key,
    label,
    value: formatValue(data[key]),
  }))

  const extraFields = Object.entries(data)
    .filter(([key]) => !knownKeys.has(key))
    .map(([key, value]) => ({
      key,
      label: key,
      value: formatValue(value),
    }))

  return [...primaryFields, ...extraFields]
})

const naughtyOrNiceVerdict = computed(() => {
  const attempts = Number(store.formData.memoryAttempts ?? 0)
  const interests = Array.isArray(store.formData.interests) ? store.formData.interests : []
  if (attempts > 8 || interests.length === 0) {
    return 'LISTA NIEGRZECZNYCH (wymaga pierniczkowej pokuty 🍪)'
  }
  return 'LISTA GRZECZNYCH (zatwierdzono przez Elfy ✨)'
})

function openErrorModal() {
  isErrorModalOpen.value = true
}
</script>

<template>
  <div
    data-testid="step-11-certificate"
    class="flex w-full max-w-2xl flex-col items-center gap-4 text-center"
  >
    <!-- Kiczowaty certyfikat -->
    <div class="candy-cane-border w-full p-2 shadow-[6px_6px_0_#000000]">
      <div class="border-4 border-double border-[#ffff00] bg-[#004d00] p-4 text-[#ffffff] sm:p-6">
        <div class="text-3xl" aria-hidden="true">📜🎄⭐🎅⭐🎄📜</div>

        <h3 class="kitsch-text-shadow mt-2 text-xl font-extrabold uppercase text-[#ffff00] sm:text-2xl">
          Oficjalny Świąteczny Certyfikat
        </h3>

        <p class="mt-1 text-xs font-bold uppercase tracking-widest text-[#00ff00]">
          Wpis na Listę Grzecznych / Niegrzecznych Bieguna Północnego™
        </p>

        <div
          data-testid="certificate-verdict"
          class="my-3 border-2 border-[#ffff00] bg-[#990000] px-3 py-2 text-sm font-extrabold text-[#ffff00]"
        >
          Werdykt Mikołaja: {{ naughtyOrNiceVerdict }}
        </div>

        <div
          data-testid="certificate-data"
          class="mt-3 border-2 border-[#ffffff] bg-[#000000]/45 p-3 text-left text-xs sm:text-sm"
        >
          <p class="mb-2 border-b border-dashed border-[#ffff00] pb-1 font-bold text-[#ffff00]">
            🎁 Zebrane dane uczestnika:
          </p>

          <dl class="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <div
              v-for="field in certificateFields"
              :key="field.key"
              :data-testid="`certificate-field-${field.key}`"
              class="border border-[#008000] bg-[#002b00]/80 px-2.5 py-1.5"
            >
              <dt class="text-[11px] font-bold uppercase text-[#ffff00]">
                {{ field.label }}
              </dt>
              <dd class="break-words font-bold text-[#ffffff]">
                {{ field.value }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs font-bold text-[#ffff99]">
          <span>Pieczęć: 🦌 Renifer Rudolf</span>
          <span>Rok: 2000 / 2026™</span>
        </div>
      </div>
    </div>

    <KitschButton
      data-testid="finish-registration-btn"
      variant="santa"
      class="px-6 py-2.5 text-base uppercase"
      @click="openErrorModal"
    >
      🎁 Zakończ rejestrację
    </KitschButton>

    <SantaErrorModal v-if="isErrorModalOpen" />
  </div>
</template>
