import { beforeEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step06Phone from '../steps/Step06Phone.vue'
import { DEFAULT_DIAL_DIGITS } from '../components/ui/RotaryPhoneDial.vue'
import { useRegistrationStore } from '../stores/registrationStore'

function angleToClientCoords(deg: number, radius = 100) {
  const rad = ((deg - 90) * Math.PI) / 180
  return {
    clientX: radius * Math.cos(rad),
    clientY: radius * Math.sin(rad),
  }
}

async function dragDigitByAngle(wrapper: VueWrapper, digit: string, rotationDeg: number) {
  const hole = wrapper.find(`[data-testid="dial-hole-${digit}"]`)
  const startCoords = angleToClientCoords(0)
  await hole.trigger('mousedown', startCoords)

  const step = 30
  for (let angle = step; angle < rotationDeg; angle += step) {
    window.dispatchEvent(new MouseEvent('mousemove', angleToClientCoords(angle)))
  }
  window.dispatchEvent(new MouseEvent('mousemove', angleToClientCoords(rotationDeg)))
  window.dispatchEvent(new MouseEvent('mouseup'))
  await wrapper.vm.$nextTick()
}

async function dialDigitToStopper(wrapper: VueWrapper, digit: string) {
  const index = DEFAULT_DIAL_DIGITS.indexOf(digit as (typeof DEFAULT_DIAL_DIGITS)[number])
  const targetRotation = 45 + index * 28
  await dragDigitByAngle(wrapper, digit, targetRotation)
}

describe('Step06Phone.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('does not count a digit when released before reaching the stopper', async () => {
    const wrapper = mount(Step06Phone)

    // Digit '3' is at index 0 -> requires 45 deg, release at 20 deg
    await dragDigitByAngle(wrapper, '3', 20)

    expect(wrapper.find('[data-testid="phone-display"]').text()).toBe('___-___-___')
    expect(wrapper.find('[data-testid="phone-digit-count"]').text()).toContain('0 / 9')
    expect(wrapper.find('[data-testid="dial-status"]').text()).toContain('za wcześnie')
  })

  it('unlocks submit after dialing 9 digits, supports backspace/clear, and saves phoneNumber', async () => {
    const store = useRegistrationStore()
    const wrapper = mount(Step06Phone)

    const submitBtn = wrapper.find('[data-testid="step-06-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()

    // Dial 3 digits, test backspace and clear
    await dialDigitToStopper(wrapper, '3')
    await dialDigitToStopper(wrapper, '7')
    await dialDigitToStopper(wrapper, '1')
    expect(wrapper.find('[data-testid="phone-display"]').text()).toBe('371-___-___')

    await wrapper.find('[data-testid="phone-backspace-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="phone-display"]').text()).toBe('37_-___-___')

    await wrapper.find('[data-testid="phone-clear-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="phone-display"]').text()).toBe('___-___-___')

    // Dial full 9-digit number: 123456789
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    for (const d of digits) {
      await dialDigitToStopper(wrapper, d)
    }

    expect(wrapper.find('[data-testid="phone-display"]').text()).toBe('123-456-789')
    expect(wrapper.find('[data-testid="phone-digit-count"]').text()).toContain('9 / 9')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(store.completedStepIds).toContain('step-06-phone')
    expect(store.formData.phoneNumber).toBe('123456789')
  })

  it('keeps submit button enabled in devMode without dialing 9 digits', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)

    const wrapper = mount(Step06Phone)
    const submitBtn = wrapper.find('[data-testid="step-06-submit-btn"]')
    expect(submitBtn.attributes('disabled')).toBeUndefined()

    await submitBtn.trigger('click')
    expect(store.completedStepIds).toContain('step-06-phone')
    expect(store.formData.phoneNumber).toBe('000000000')
  })
})
