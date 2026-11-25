import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ParabolicCheckbox from '../components/ui/ParabolicCheckbox.vue'
import Step09Terms from '../steps/Step09Terms.vue'
import { useRegistrationStore } from '../stores/registrationStore'

describe('ParabolicCheckbox.vue', () => {
  it('escapes escapesCount times on hover/click before allowing check', async () => {
    const wrapper = mount(ParabolicCheckbox, {
      props: {
        modelValue: false,
        escapesCount: 3,
        label: 'Akceptuję',
      },
    })

    const mover = wrapper.find('[data-testid="parabolic-checkbox-mover"]')
    const input = wrapper.find('[data-testid="parabolic-checkbox-input"]')

    expect(wrapper.find('[data-testid="parabolic-checkbox-status"]').text()).toContain('3')

    // Próba 1 (najechanie) i Próba 2 (kliknięcie) i Próba 3 (najechanie)
    await mover.trigger('mouseenter')
    expect(wrapper.find('[data-testid="parabolic-checkbox-status"]').text()).toContain('2')

    await mover.trigger('click')
    expect(wrapper.find('[data-testid="parabolic-checkbox-status"]').text()).toContain('1')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await mover.trigger('mouseenter')
    expect(wrapper.find('[data-testid="parabolic-checkbox-status"]').text()).toContain('zmęczony')

    // Po wyczerpaniu ucieczek można zaznaczyć checkbox
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
})

describe('Step09Terms.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-24T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resets scrollTop to 0 and shows warning when scrolling too fast, but allows slow scrolling', async () => {
    const wrapper = mount(Step09Terms, {
      props: {
        maxScrollSpeedPxPerSec: 300,
        maxScrollJumpPx: 100,
      },
    })

    const container = wrapper.find('[data-testid="terms-scroll-container"]')
    const el = container.element as HTMLElement

    // Powolne przewijanie: 50px w 500ms = 100 px/s <= 300 px/s
    await vi.advanceTimersByTimeAsync(500)
    el.scrollTop = 50
    await container.trigger('scroll')
    expect(el.scrollTop).toBe(50)
    expect(wrapper.find('[data-testid="scroll-warning"]').exists()).toBe(false)

    // Zbyt szybkie przewijanie: skok o +250px w 50ms
    await vi.advanceTimersByTimeAsync(50)
    el.scrollTop = 300
    await container.trigger('scroll')

    expect(el.scrollTop).toBe(0)
    const warning = wrapper.find('[data-testid="scroll-warning"]')
    expect(warning.exists()).toBe(true)
    expect(warning.text()).toContain(
      'Przewinąłeś za szybko! Mikołaj wie, że nie czytałeś — wracamy na górę!'
    )
  })

  it('unlocks submit button after accepting terms and calls completeStep + goToNextStep', async () => {
    const store = useRegistrationStore()
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep')

    const wrapper = mount(Step09Terms, {
      props: { escapesCount: 2 },
    })

    const submitBtn = wrapper.find('[data-testid="step-09-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    const mover = wrapper.find('[data-testid="parabolic-checkbox-mover"]')
    await mover.trigger('mouseenter')
    await mover.trigger('mouseenter')

    const checkbox = wrapper.find('[data-testid="parabolic-checkbox-input"]')
    await checkbox.setValue(true)

    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeSpy).toHaveBeenCalledWith('step-09-terms', { termsAccepted: true })
    expect(store.completedStepIds).toContain('step-09-terms')
    expect(store.formData.termsAccepted).toBe(true)
    expect(nextSpy).toHaveBeenCalledTimes(1)
  })

  it('keeps submit button enabled in devMode without accepting terms', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    const completeSpy = vi.spyOn(store, 'completeStep')
    const nextSpy = vi.spyOn(store, 'goToNextStep')

    const wrapper = mount(Step09Terms)
    const submitBtn = wrapper.find('[data-testid="step-09-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(completeSpy).toHaveBeenCalledWith('step-09-terms', { termsAccepted: true })
    expect(nextSpy).toHaveBeenCalledTimes(1)
  })
})
