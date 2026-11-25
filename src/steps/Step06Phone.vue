<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistrationStore } from '../stores/registrationStore'
import KitschButton from '../components/ui/KitschButton.vue'
import RotaryPhoneDial from '../components/ui/RotaryPhoneDial.vue'

const PHONE_LENGTH = 9

const store = useRegistrationStore()

const phoneNumber = ref('')

const isPhoneComplete = computed(() => phoneNumber.value.length === PHONE_LENGTH)
const canProceed = computed(() => store.devMode || isPhoneComplete.value)

const formattedPhonePreview = computed(() => {
  const padded = phoneNumber.value.padEnd(PHONE_LENGTH, '_')
  return `${padded.slice(0, 3)}-${padded.slice(3, 6)}-${padded.slice(6, 9)}`
})

function handleDial(digit: string) {
  if (phoneNumber.value.length >= PHONE_LENGTH) return
  phoneNumber.value += digit
}

function removeLastDigit() {
  if (phoneNumber.value.length === 0) return
  phoneNumber.value = phoneNumber.value.slice(0, -1)
}

function clearPhone() {
  phoneNumber.value = ''
}

function proceedNext() {
  if (!canProceed.value) return
  const phoneToSave = isPhoneComplete.value ? phoneNumber.value : '000000000'
  store.completeStep('step-06-phone', { phoneNumber: phoneToSave })
  store.goToNextStep()
}
</script>

<template>
  <div data-testid="step-06-phone" class="flex w-full max-w-md flex-col items-center gap-3.5 text-center">
    <div class="retro-bevel w-full border-[#ffff00] bg-[#880000] px-3 py-2">
      <div class="flex items-center justify-between text-xs font-bold text-[#ffff88]">
        <span>📞 Twój 9-cyfrowy numer telefonu:</span>
        <span data-testid="phone-digit-count" class="text-[#00ff00]">
          {{ phoneNumber.length }} / {{ PHONE_LENGTH }} cyfr
        </span>
      </div>
      <div
        data-testid="phone-display"
        class="mt-1 text-2xl font-extrabold tracking-widest text-[#00ff00]"
      >
        {{ formattedPhonePreview }}
      </div>
      <div class="mt-2 flex items-center justify-center gap-2">
        <KitschButton
          data-testid="phone-backspace-btn"
          variant="santa"
          :disabled="phoneNumber.length === 0"
          @click="removeLastDigit"
        >
          ⬅️ Cofnij cyfrę
        </KitschButton>
        <KitschButton
          data-testid="phone-clear-btn"
          variant="grinch"
          :disabled="phoneNumber.length === 0"
          @click="clearPhone"
        >
          🗑️ Wyczyść
        </KitschButton>
      </div>
    </div>

    <RotaryPhoneDial :disabled="isPhoneComplete" @dial="handleDial" />

    <KitschButton
      data-testid="step-06-submit-btn"
      variant="gold"
      :disabled="!canProceed"
      @click="proceedNext"
    >
      {{ canProceed ? '✅ Zatwierdź numer telefonu ➡️' : `☎️ Wykręć jeszcze ${PHONE_LENGTH - phoneNumber.length} cyfr!` }}
    </KitschButton>
  </div>
</template>
