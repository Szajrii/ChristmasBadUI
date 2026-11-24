<script setup lang="ts">
import { ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import { evaluateEmailRules, type EmailRuleResult } from '../utils/emailValidation'
import KitschButton from '../components/ui/KitschButton.vue'

const store = useRegistrationStore()
const email = ref((store.formData.email as string | undefined) ?? '')
const currentError = ref<EmailRuleResult | null>(null)

function submitEmail() {
  const rules = evaluateEmailRules(email.value)
  const firstFailing = rules.find((rule) => !rule.passed) ?? null

  if (firstFailing) {
    currentError.value = firstFailing
    return
  }

  currentError.value = null
  store.completeStep('step-02-email', { email: email.value })
  store.goToNextStep()
}
</script>

<template>
  <form
    data-testid="step-02-email"
    class="flex w-full max-w-md flex-col gap-4 text-left"
    @submit.prevent="submitEmail"
  >
    <div>
      <label for="festive-email" class="mb-1.5 block text-xs font-bold text-yellow-300">
        📧 Podaj swój adres e-mail:
      </label>
      <input
        id="festive-email"
        data-testid="email-input"
        v-model="email"
        type="text"
        autocomplete="off"
        placeholder="np. mikolaj@biegun.pl"
        class="w-full rounded-xl border-2 border-yellow-300/80 bg-emerald-950/90 px-3 py-2.5 text-sm font-bold text-yellow-100 outline-none focus:border-yellow-300"
      />
    </div>

    <div
      v-if="currentError"
      data-testid="email-first-error"
      role="alert"
      class="rounded-2xl border-2 border-red-400 bg-red-950/80 p-3 text-xs font-bold text-red-100 shadow-[0_0_16px_rgba(239,68,68,0.45)] sm:text-sm"
    >
      ❌ {{ currentError.label }}
    </div>

    <KitschButton
      data-testid="step-02-submit-btn"
      type="submit"
      variant="gold"
    >
      ✅ Zatwierdź e-mail ➡️
    </KitschButton>
  </form>
</template>
