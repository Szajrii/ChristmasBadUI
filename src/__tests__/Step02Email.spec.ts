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

  it('hides rules initially and reveals only the first failing rule on each submit click', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.goToStep(2)

    const wrapper = mount(Step02Email)
    expect(wrapper.find('[data-testid="email-first-error"]').exists()).toBe(false)

    const input = wrapper.find('[data-testid="email-input"]')

    // 1. Submit invalid format -> shows format error only
    await input.setValue('zly-mail')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[data-testid="email-first-error"]').text()).toContain('Poprawny format')

    // 2. Fix format, submit short email -> reveals 50-char requirement
    await input.setValue('test@gmail.pl')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[data-testid="email-first-error"]').text()).toContain('Minimum 50 znaków')

    // 3. Submit valid email -> clears error, saves to Pinia, advances to Step 3
    await input.setValue(VALID_FESTIVE_EMAIL)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('[data-testid="email-first-error"]').exists()).toBe(false)
    expect(store.formData.email).toBe(VALID_FESTIVE_EMAIL)
    expect(store.completedStepIds).toContain('step-02-email')
    expect(store.currentStepIndex).toBe(3)
  })

  it('allows advancing with empty/invalid email when devMode is enabled', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    store.goToStep(2)

    const wrapper = mount(Step02Email)
    expect(wrapper.find('[data-testid="step-02-submit-btn"]').attributes('disabled')).toBeUndefined()

    await wrapper.find('form').trigger('submit')
    expect(store.currentStepIndex).toBe(3)
  })
})
