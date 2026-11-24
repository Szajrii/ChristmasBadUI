<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import { evaluateEmailRules } from '../utils/emailValidation'
import KitschButton from '../components/ui/KitschButton.vue'

const store = useRegistrationStore()
const email = ref((store.formData.email as string | undefined) ?? '')

const rules = computed(() => evaluateEmailRules(email.value))
const passedCount = computed(() => rules.value.filter((r) => r.passed).length)
const allValid = computed(() => passedCount.value === rules.value.length)

function submitEmail() {
  if (!allValid.value) return
  store.completeStep('step-02-email', { email: email.value })
  store.goToNextStep()
}
</script>

<template>
  <form
    data-testid="step-02-email"
    class="flex w-full max-w-md flex-col gap-3 text-left"
    @submit.prevent="submitEmail"
  >
    <div>
      <label for="festive-email" class="mb-1 block text-xs font-bold text-yellow-300">
        📧 Podaj swój świąteczny adres e-mail:
      </label>
      <input
        id="festive-email"
        data-testid="email-input"
        v-model="email"
        type="text"
        autocomplete="off"
        placeholder="np. rudolf_XXIV_狗_🎄..."
        class="w-full rounded-xl border-2 border-yellow-300/80 bg-emerald-950/90 px-3 py-2 text-xs font-bold text-yellow-100 outline-none focus:border-yellow-300 sm:text-sm"
      />
    </div>

    <div class="rounded-2xl border-2 border-red-400/60 bg-black/40 p-2.5">
      <div class="mb-1.5 flex items-center justify-between text-xs font-extrabold">
        <span class="text-yellow-300">📜 Lista wymagań Mikołaja:</span>
        <span data-testid="email-rules-progress" class="text-emerald-300">
          {{ passedCount }} / {{ rules.length }}
        </span>
      </div>

      <ul class="max-h-44 space-y-1 overflow-y-auto pr-1 text-[11px] leading-snug">
        <li
          v-for="rule in rules"
          :key="rule.id"
          :data-testid="`email-rule-${rule.id}`"
          class="flex items-start gap-1.5 rounded-lg px-1.5 py-0.5"
          :class="
            rule.passed
              ? 'bg-emerald-900/50 text-lime-200'
              : 'bg-red-950/60 text-red-200'
          "
        >
          <span aria-hidden="true">{{ rule.passed ? '✅' : '❌' }}</span>
          <span>{{ rule.label }}</span>
        </li>
      </ul>
    </div>

    <KitschButton
      data-testid="step-02-submit-btn"
      type="submit"
      variant="gold"
      :disabled="!allValid"
    >
      {{ allValid ? '✅ Zapisz e-mail i idź dalej ➡️' : `🔒 Spełnij wszystkie reguły (${passedCount}/${rules.length})` }}
    </KitschButton>
  </form>
</template>
