import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step02Email from '../steps/Step02Email.vue'
import { useRegistrationStore } from '../stores/registrationStore'
import { isEmailValid } from '../utils/emailValidation'

const VALID_FESTIVE_EMAIL = 'rudolf_XXIV_狗_🎄_554_bardzo_dlugi_swiatEczny_adrEs@gmail.pl'

describe('Step02Email.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rejects normal emails and validates all 9 absurd rules', () => {
    expect(isEmailValid('jan.kowalski@gmail.com')).toBe(false)
    // Lowercase 'e' should fail
    expect(isEmailValid(VALID_FESTIVE_EMAIL.replace('adrEs', 'adres'))).toBe(false)
    // Wrong digit sum (5+5+3 = 13) should fail
    expect(isEmailValid(VALID_FESTIVE_EMAIL.replace('554', '553'))).toBe(false)
    // Valid email passes all 9 rules
    expect(isEmailValid(VALID_FESTIVE_EMAIL)).toBe(true)
  })

  it('keeps submit disabled until all rules pass, then saves email and advances to Step 3', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.goToStep(2)

    const wrapper = mount(Step02Email)
    const submitBtn = wrapper.find('[data-testid="step-02-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    const input = wrapper.find('[data-testid="email-input"]')
    await input.setValue('test@gmail.pl')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    await input.setValue(VALID_FESTIVE_EMAIL)
    expect(wrapper.find('[data-testid="email-rules-progress"]').text()).toBe('9 / 9')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await wrapper.find('form').trigger('submit')

    expect(store.formData.email).toBe(VALID_FESTIVE_EMAIL)
    expect(store.completedStepIds).toContain('step-02-email')
    expect(store.currentStepIndex).toBe(3)
  })
})
