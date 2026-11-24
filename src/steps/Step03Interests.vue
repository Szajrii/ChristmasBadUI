<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import { INTEREST_OPTIONS, type InterestOption } from '../utils/interestsData'
import KitschButton from '../components/ui/KitschButton.vue'

const store = useRegistrationStore()
const selectedIds = ref<string[]>(
  Array.isArray(store.formData.interests) ? [...(store.formData.interests as string[])] : []
)
const errorMessage = ref<string | null>(null)

const requiredInterests = INTEREST_OPTIONS.filter((opt) => !opt.isResetTrap)
const allRequiredSelected = computed(() =>
  requiredInterests.every((opt) => selectedIds.value.includes(opt.id))
)

function toggleInterest(option: InterestOption) {
  if (option.isResetTrap) {
    selectedIds.value = []
    errorMessage.value = '🧹 Wybrałeś „Wyczyść wszystko”! Wszystkie wybory zostały skasowane!'
    return
  }

  errorMessage.value = null
  const idx = selectedIds.value.indexOf(option.id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(option.id)
  }
}

function submitInterests() {
  if (!store.devMode && !allRequiredSelected.value) {
    errorMessage.value = '❌ Aby przejść dalej, musisz wybrać KAŻDE zainteresowanie!'
    return
  }

  errorMessage.value = null
  store.completeStep('step-03-interests', { interests: [...selectedIds.value] })
  store.goToNextStep()
}
</script>

<template>
  <form
    data-testid="step-03-interests"
    class="flex w-full flex-col gap-3 text-left"
    @submit.prevent="submitInterests"
  >
    <p class="text-center text-xs font-bold text-yellow-200">
      🎄 Zaznacz swoje świąteczne zainteresowania (zaznaczono: {{ selectedIds.length }}):
    </p>

    <div
      class="grid max-h-[420px] grid-cols-2 gap-2 overflow-y-auto rounded-2xl border-2 border-yellow-300/60 bg-black/40 p-2.5 sm:grid-cols-3"
    >
      <label
        v-for="option in INTEREST_OPTIONS"
        :key="option.id"
        :data-testid="`interest-label-${option.id}`"
        class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-2 py-1.5 text-[11px] leading-tight text-amber-50 transition-colors hover:bg-emerald-900/70"
      >
        <input
          :data-testid="`interest-checkbox-${option.id}`"
          type="checkbox"
          :checked="selectedIds.includes(option.id)"
          class="h-3.5 w-3.5 shrink-0 accent-yellow-400"
          @change="toggleInterest(option)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>

    <div
      v-if="errorMessage"
      data-testid="interests-error"
      role="alert"
      class="rounded-xl border-2 border-red-400 bg-red-950/85 px-3 py-2 text-center text-xs font-bold text-red-100"
    >
      {{ errorMessage }}
    </div>

    <KitschButton
      data-testid="step-03-submit-btn"
      type="submit"
      variant="gold"
    >
      ✅ Zatwierdź zainteresowania ➡️
    </KitschButton>
  </form>
</template>
