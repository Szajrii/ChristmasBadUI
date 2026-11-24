import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step01Credentials from '../steps/Step01Credentials.vue'
import { useRegistrationStore } from '../stores/registrationStore'

describe('Step01Credentials.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('spins slot machine reels with animation, reverses password in normal mode, and saves to Pinia', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.goToNextStep()

    const wrapper = mount(Step01Credentials)
    const submitBtn = wrapper.find('[data-testid="step-01-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="candle-overlay"]').exists()).toBe(true)

    // Pull slot machine lever / spin button
    await wrapper.find('[data-testid="slot-lever-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="spin-all-btn"]').attributes('disabled')).toBeDefined()

    // Wait for reel to finish spinning and settle on 1 username
    await vi.advanceTimersByTimeAsync(1700)

    const chosenUsername = wrapper
      .find('[data-testid="generated-username"]')
      .text()
      .replace('Nick: ', '')

    // Type characters one by one -> reversed! ("a", "b", "c", "d", "e", "f" -> "fedcba")
    const input = wrapper.find('[data-testid="backwards-password-input"]')
    for (const ch of ['a', 'b', 'c', 'd', 'e', 'f']) {
      const current = (input.element as HTMLInputElement).value
      await input.setValue(current + ch)
    }

    expect((input.element as HTMLInputElement).value).toBe('fedcba')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await wrapper.find('form').trigger('submit')

    expect(store.formData.username).toBe(chosenUsername)
    expect(store.formData.password).toBe('fedcba')
    expect(store.completedStepIds).toContain('step-01-credentials')
    expect(store.currentStepIndex).toBe(2)
  })

  it('keeps candle darkness and backwards typing active even when devMode is enabled', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)

    const wrapper = mount(Step01Credentials)
    expect(wrapper.find('[data-testid="candle-overlay"]').exists()).toBe(true)

    const input = wrapper.find('[data-testid="backwards-password-input"]')
    for (const ch of ['a', 'b', 'c']) {
      const current = (input.element as HTMLInputElement).value
      await input.setValue(current + ch)
    }
    expect((input.element as HTMLInputElement).value).toBe('cba')
  })
})
