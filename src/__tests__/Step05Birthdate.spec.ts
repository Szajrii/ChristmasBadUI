import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step05Birthdate from '../steps/Step05Birthdate.vue'
import { useRegistrationStore } from '../stores/registrationStore'
import {
  calculateYearFromPower,
  formatBirthdate,
  getDaysInMonth,
  MAX_BIRTH_YEAR,
  MIN_BIRTH_YEAR,
} from '../utils/birthdateCatapult'

function unlockStep5() {
  const store = useRegistrationStore()
  store.completeStep('home')
  store.completeStep('step-01-credentials')
  store.completeStep('step-02-email')
  store.completeStep('step-03-interests')
  store.completeStep('step-04-memory')
  store.goToStep(5)
  return store
}

describe('birthdateCatapult utils', () => {
  it('maps power 0-100 to MAX_BIRTH_YEAR-MIN_BIRTH_YEAR and handles leap years', () => {
    expect(calculateYearFromPower(0)).toBe(MAX_BIRTH_YEAR)
    expect(calculateYearFromPower(100)).toBe(MIN_BIRTH_YEAR)
    expect(getDaysInMonth(2, 2024)).toBe(29)
    expect(getDaysInMonth(2, 2023)).toBe(28)
    expect(formatBirthdate(5, 3, 1995)).toBe('05.03.1995')
  })
})

describe('Step05Birthdate.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('requires charging and releasing the sleigh catapult before proceeding, and saves birthdate in store', async () => {
    const store = unlockStep5()

    const wrapper = mount(Step05Birthdate, {
      props: {
        catapultTickMs: 50,
        catapultStepPerTick: 10,
      },
    })

    const submitBtn = wrapper.find('[data-testid="step-05-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    const chargeBtn = wrapper.find('[data-testid="catapult-charge-btn"]')
    await chargeBtn.trigger('mousedown')
    await vi.advanceTimersByTimeAsync(250) // 5 ticks * 10% = 50% -> 1963
    await chargeBtn.trigger('mouseup')

    expect(wrapper.find('[data-testid="catapult-launches"]').text()).toContain('1')
    expect(wrapper.find('[data-testid="birthdate-preview"]').text()).toBe('24.12.1963')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(store.completedStepIds).toContain('step-05-birthdate')
    expect(store.formData.birthdate).toBe('24.12.1963')
    expect(store.formData.birthYear).toBe(1963)
    expect(store.formData.birthMonth).toBe(12)
    expect(store.formData.birthDay).toBe(24)
    expect(store.currentStepIndex).toBe(6)
  })

  it('swaps +1 and -1 button positions every 3 clicks', async () => {
    unlockStep5()

    const wrapper = mount(Step05Birthdate, {
      props: { swapEveryClicks: 3 },
    })

    const getMonthOrder = () =>
      wrapper
        .findAll('[data-testid="month-buttons-row"] button')
        .map((b) => b.attributes('data-testid'))

    expect(getMonthOrder()).toEqual(['month-dec-btn', 'month-inc-btn'])
    expect(wrapper.find('[data-testid="buttons-swap-notice"]').exists()).toBe(false)

    // Click 1 & 2 -> order stays the same
    await wrapper.find('[data-testid="month-dec-btn"]').trigger('click')
    await wrapper.find('[data-testid="day-inc-btn"]').trigger('click')
    expect(getMonthOrder()).toEqual(['month-dec-btn', 'month-inc-btn'])

    // Click 3 -> order swaps!
    await wrapper.find('[data-testid="day-dec-btn"]').trigger('click')
    expect(getMonthOrder()).toEqual(['month-inc-btn', 'month-dec-btn'])
    expect(wrapper.find('[data-testid="buttons-swap-notice"]').exists()).toBe(true)
  })

  it('keeps submit button enabled in devMode without launching catapult', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    store.goToStep(5)

    const wrapper = mount(Step05Birthdate)
    const submitBtn = wrapper.find('[data-testid="step-05-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(store.completedStepIds).toContain('step-05-birthdate')
    expect(store.currentStepIndex).toBe(6)
  })
})
