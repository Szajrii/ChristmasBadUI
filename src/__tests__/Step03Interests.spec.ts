import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step03Interests from '../steps/Step03Interests.vue'
import { INTEREST_OPTIONS } from '../utils/interestsData'
import { useRegistrationStore } from '../stores/registrationStore'

describe('Step03Interests.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders 21 checkboxes, resets all when trap is clicked, and completes when all 20 non-trap items are selected', async () => {
    const store = useRegistrationStore()
    store.completeStep('home')
    store.completeStep('step-01-credentials')
    store.completeStep('step-02-email')
    store.goToStep(3)

    const wrapper = mount(Step03Interests)
    expect(INTEREST_OPTIONS.length).toBe(21)

    // Submit with nothing selected -> error message
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[data-testid="interests-error"]').text()).toContain('KAŻDE zainteresowanie')

    // Select a few interests, then click the "Wyczyść wszystko" trap
    await wrapper.find('[data-testid="interest-checkbox-int-01"]').trigger('change')
    await wrapper.find('[data-testid="interest-checkbox-int-02"]').trigger('change')
    await wrapper.find('[data-testid="interest-checkbox-int-19"]').trigger('change')

    expect(wrapper.find('[data-testid="interests-error"]').text()).toContain('Wyczyść wszystko')
    expect((wrapper.find('[data-testid="interest-checkbox-int-01"]').element as HTMLInputElement).checked).toBe(false)

    // Select all 20 non-trap options
    for (const opt of INTEREST_OPTIONS) {
      if (!opt.isResetTrap) {
        await wrapper.find(`[data-testid="interest-checkbox-${opt.id}"]`).trigger('change')
      }
    }

    await wrapper.find('form').trigger('submit')

    expect(store.completedStepIds).toContain('step-03-interests')
    expect((store.formData.interests as string[]).length).toBe(20)
    expect(store.currentStepIndex).toBe(4)
  })

  it('allows advancing in devMode without selecting all interests', async () => {
    const store = useRegistrationStore()
    store.setDevMode(true)
    store.goToStep(3)

    const wrapper = mount(Step03Interests)
    await wrapper.find('form').trigger('submit')

    expect(store.currentStepIndex).toBe(4)
  })
})
