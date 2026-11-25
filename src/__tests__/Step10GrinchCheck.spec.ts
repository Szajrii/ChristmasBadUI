import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step10GrinchCheck from '../steps/Step10GrinchCheck.vue'
import HoldToConfirmButton from '../components/ui/HoldToConfirmButton.vue'
import { useRegistrationStore } from '../stores/registrationStore'

describe('HoldToConfirmButton.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resets progress on premature release and emits confirm after full holdDurationMs', async () => {
    const wrapper = mount(HoldToConfirmButton, {
      props: {
        holdDurationMs: 5000,
        tickMs: 100,
      },
    })

    const btn = wrapper.find('[data-testid="hold-confirm-btn"]')
    const bar = wrapper.find('[data-testid="hold-progress-bar"]')

    await btn.trigger('mousedown')
    await vi.advanceTimersByTimeAsync(2000)
    expect(bar.attributes('style')).toContain('width: 40%')
    expect(wrapper.emitted('confirm')).toBeUndefined()

    // Premature release resets progress to 0%
    await btn.trigger('mouseup')
    expect(bar.attributes('style')).toContain('width: 0%')
    expect(wrapper.emitted('hold-cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()

    // Full 5000ms hold emits confirm
    await btn.trigger('mousedown')
    await vi.advanceTimersByTimeAsync(5000)
    expect(bar.attributes('style')).toContain('width: 100%')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })
})

describe('Step10GrinchCheck.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows shake, glitch snow overlay, and fake messages while holding, and resets on premature release', async () => {
    const store = useRegistrationStore()
    const completeSpy = vi.spyOn(store, 'completeStep')

    const wrapper = mount(Step10GrinchCheck)
    const root = wrapper.find('[data-testid="step-10-grinch"]')
    const holdBtn = wrapper.find('[data-testid="hold-confirm-btn"]')

    expect(root.classes()).not.toContain('animate-grinch-shake')
    expect(wrapper.find('[data-testid="glitch-snow-overlay"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="grinch-fake-messages"]').exists()).toBe(false)

    await holdBtn.trigger('mousedown')
    await vi.advanceTimersByTimeAsync(1500)

    expect(root.classes()).toContain('animate-grinch-shake')
    expect(wrapper.find('[data-testid="glitch-snow-overlay"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="grinch-fake-messages"]').exists()).toBe(true)

    await holdBtn.trigger('mouseup')

    expect(root.classes()).not.toContain('animate-grinch-shake')
    expect(wrapper.find('[data-testid="grinch-reset-notice"]').exists()).toBe(true)
    expect(completeSpy).not.toHaveBeenCalled()
  })

  it('completes step with notAGrinch: true and calls goToNextStep after holding for 5 seconds', async () => {
    const store = useRegistrationStore()
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep')

    const wrapper = mount(Step10GrinchCheck)
    const holdBtn = wrapper.find('[data-testid="hold-confirm-btn"]')

    await holdBtn.trigger('mousedown')
    await vi.advanceTimersByTimeAsync(5000)

    expect(completeSpy).toHaveBeenCalledWith('step-10-grinch', { notAGrinch: true })
    expect(nextSpy).toHaveBeenCalledTimes(1)
    expect(store.completedStepIds).toContain('step-10-grinch')
    expect(store.formData.notAGrinch).toBe(true)
  })

  it('allows proceeding immediately in devMode without holding for 5 seconds', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep')

    const wrapper = mount(Step10GrinchCheck)
    const submitBtn = wrapper.find('[data-testid="step-10-submit-btn"]')

    expect(submitBtn.attributes('disabled')).toBeUndefined()
    await submitBtn.trigger('click')

    expect(completeSpy).toHaveBeenCalledWith('step-10-grinch', { notAGrinch: true })
    expect(nextSpy).toHaveBeenCalledTimes(1)
    expect(store.completedStepIds).toContain('step-10-grinch')
    expect(store.formData.notAGrinch).toBe(true)
  })
})
