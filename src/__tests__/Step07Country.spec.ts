import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step07Country from '../steps/Step07Country.vue'
import { useRegistrationStore } from '../stores/registrationStore'

describe('Step07Country.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders an unsorted country list and completes step when a non-Poland country is selected', async () => {
    const store = useRegistrationStore()
    const completeStepSpy = vi.spyOn(store, 'completeStep')
    const goToNextStepSpy = vi.spyOn(store, 'goToNextStep').mockReturnValue(true)

    const wrapper = mount(Step07Country)

    const select = wrapper.find('[data-testid="country-select"]')
    const optionValues = select
      .findAll('option')
      .map((o) => o.attributes('value'))
      .filter((v): v is string => Boolean(v))

    const sortedValues = [...optionValues].sort((a, b) => a.localeCompare(b, 'pl'))
    expect(optionValues).not.toEqual(sortedValues)

    const submitBtn = wrapper.find('[data-testid="step-07-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    await select.setValue('Finlandia')
    expect(wrapper.find('[data-testid="north-pole-ad"]').exists()).toBe(false)
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeStepSpy).toHaveBeenCalledWith('step-07-country', { country: 'Finlandia' })
    expect(goToNextStepSpy).toHaveBeenCalledTimes(1)
  })

  it('requires closing the North Pole trip ad before proceeding when Polska is selected', async () => {
    const store = useRegistrationStore()
    const completeStepSpy = vi.spyOn(store, 'completeStep')
    const goToNextStepSpy = vi.spyOn(store, 'goToNextStep').mockReturnValue(true)

    const wrapper = mount(Step07Country)

    const select = wrapper.find('[data-testid="country-select"]')
    const submitBtn = wrapper.find('[data-testid="step-07-submit-btn"]')

    await select.setValue('Polska')
    expect(wrapper.find('[data-testid="north-pole-ad"]').exists()).toBe(true)
    expect(submitBtn.attributes('disabled')).toBeDefined()

    await wrapper.find('[data-testid="close-north-pole-ad-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="north-pole-ad"]').exists()).toBe(false)
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeStepSpy).toHaveBeenCalledWith('step-07-country', { country: 'Polska' })
    expect(goToNextStepSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps next button active in devMode even without selecting a country', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    const completeStepSpy = vi.spyOn(store, 'completeStep')
    const goToNextStepSpy = vi.spyOn(store, 'goToNextStep').mockReturnValue(true)

    const wrapper = mount(Step07Country)
    const submitBtn = wrapper.find('[data-testid="step-07-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeStepSpy).toHaveBeenCalledWith('step-07-country', { country: '' })
    expect(goToNextStepSpy).toHaveBeenCalledTimes(1)
  })

  it('opens ThanosSkipModal after 5s, snaps regular offers into dust, and shows payment error on 4th special offer', async () => {
    const wrapper = mount(Step07Country, {
      props: {
        skipOfferDelayMs: 5000,
        thanosSnapDurationMs: 600,
      },
    })

    expect(wrapper.find('[data-testid="thanos-skip-modal"]').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(5000)
    expect(wrapper.find('[data-testid="thanos-skip-modal"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="skip-offer-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="skip-offer-2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="skip-offer-3"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="skip-offer-special"]').exists()).toBe(true)

    // Kliknięcie zwykłej oferty uruchamia rozpad Thanosa i po czasie ją usuwa
    await wrapper.find('[data-testid="skip-offer-2"]').trigger('click')
    expect(wrapper.find('[data-testid="thanos-dust-2"]').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(600)
    expect(wrapper.find('[data-testid="skip-offer-2"]').exists()).toBe(false)

    // Kliknięcie 4. specjalnej oferty wyświetla błąd płatności i przycisk powrotu
    await wrapper.find('[data-testid="skip-offer-special"]').trigger('click')
    expect(wrapper.find('[data-testid="skip-payment-error"]').text()).toContain('nie działają')

    await wrapper.find('[data-testid="skip-return-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="thanos-skip-modal"]').exists()).toBe(false)
  })
})
