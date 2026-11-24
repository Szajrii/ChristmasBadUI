import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step04Memory from '../steps/Step04Memory.vue'
import { useRegistrationStore } from '../stores/registrationStore'

describe('Step04Memory.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('flips back only the two mismatched cards while keeping matched pairs face up', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.completeStep('step-02-email')
    store.completeStep('step-03-interests')
    store.goToStep(4)

    const wrapper = mount(Step04Memory, {
      props: { mismatchDelayMs: 500, randomFn: () => 0.42 },
    })

    const buttons = wrapper.findAll('[data-testid^="memory-card-"]')
    expect(buttons.length).toBe(8)

    // Group cards by symbol
    const bySymbol = new Map<string, typeof buttons>()
    for (const btn of buttons) {
      const sym = btn.attributes('data-symbol')!
      bySymbol.set(sym, [...(bySymbol.get(sym) ?? []), btn])
    }
    const pairs = Array.from(bySymbol.values())

    // Match the first pair
    await pairs[0][0].trigger('click')
    await pairs[0][1].trigger('click')
    expect(pairs[0][0].text()).not.toBe('🎁')

    // Now make a mismatch with pair 1 and pair 2
    await pairs[1][0].trigger('click')
    await pairs[2][0].trigger('click')
    expect(wrapper.find('[data-testid="memory-status"]').text()).toContain('PUDŁO')

    // Advance timer -> only mismatched cards flip back, pair 0 stays matched
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.find('[data-testid="memory-attempts"]').text()).toContain('#2')
    expect(pairs[0][0].text()).not.toBe('🎁')
    expect(pairs[0][1].text()).not.toBe('🎁')
    expect(pairs[1][0].text()).toBe('🎁')
    expect(pairs[2][0].text()).toBe('🎁')
  })

  it('unlocks next step when all 4 pairs are matched without mistake', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.completeStep('step-02-email')
    store.completeStep('step-03-interests')
    store.goToStep(4)

    const wrapper = mount(Step04Memory, {
      props: { randomFn: () => 0.3 },
    })

    const submitBtn = wrapper.find('[data-testid="step-04-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    const buttons = wrapper.findAll('[data-testid^="memory-card-"]')
    const bySymbol = new Map<string, typeof buttons>()
    for (const btn of buttons) {
      const sym = btn.attributes('data-symbol')!
      bySymbol.set(sym, [...(bySymbol.get(sym) ?? []), btn])
    }

    for (const pair of bySymbol.values()) {
      await pair[0].trigger('click')
      await pair[1].trigger('click')
    }

    expect(submitBtn.attributes('disabled')).toBeUndefined()
    await submitBtn.trigger('click')
    expect(store.completedStepIds).toContain('step-04-memory')
    expect(store.currentStepIndex).toBe(5)
  })

  it('keeps next button active in devMode', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    store.goToStep(4)

    const wrapper = mount(Step04Memory)
    const submitBtn = wrapper.find('[data-testid="step-04-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
    await submitBtn.trigger('click')
    expect(store.currentStepIndex).toBe(5)
  })

  it('shows pay-to-skip modal after 5s, displays payment error on option click, and returns to game', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.completeStep('step-02-email')
    store.completeStep('step-03-interests')
    store.goToStep(4)

    const wrapper = mount(Step04Memory)
    expect(wrapper.find('[data-testid="memory-skip-modal"]').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(5000)
    expect(wrapper.find('[data-testid="memory-skip-modal"]').exists()).toBe(true)

    // Click $3 option -> shows payment error and only return button
    await wrapper.find('[data-testid="skip-offer-2"]').trigger('click')
    expect(wrapper.find('[data-testid="skip-payment-error"]').text()).toContain('nie działają')
    expect(wrapper.find('[data-testid="skip-offer-1"]').exists()).toBe(false)

    // Return to game closes modal
    await wrapper.find('[data-testid="skip-return-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="memory-skip-modal"]').exists()).toBe(false)
  })
})
