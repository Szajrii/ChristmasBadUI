import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Step11Certificate from '../steps/Step11Certificate.vue'
import { useRegistrationStore } from '../stores/registrationStore'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Step11Certificate.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockReset()
  })

  it('displays all collected formData fields on the Christmas certificate', () => {
    const store = useRegistrationStore()
    store.formData = {
      username: 'Grinch2000',
      email: 'grinch@biegun.pl',
      interests: ['Pierniczki', 'Kolędy'],
      memoryAttempts: 5,
      birthdate: '24.12.1999',
      phoneNumber: '+48 123 456 789',
      country: 'Polska',
      customBonusField: 'Sekretny prezent',
    }

    const wrapper = mount(Step11Certificate)

    expect(wrapper.find('[data-testid="step-11-certificate"]').exists()).toBe(true)
    const certificateText = wrapper.find('[data-testid="certificate-data"]').text()

    expect(certificateText).toContain('Grinch2000')
    expect(certificateText).toContain('grinch@biegun.pl')
    expect(certificateText).toContain('Pierniczki, Kolędy')
    expect(certificateText).toContain('5')
    expect(certificateText).toContain('24.12.1999')
    expect(certificateText).toContain('+48 123 456 789')
    expect(certificateText).toContain('Polska')
    expect(certificateText).toContain('Sekretny prezent')
  })

  it('opens SantaErrorModal on clicking finish registration and resets progress + redirects to / on reset', async () => {
    const store = useRegistrationStore()
    store.completedStepIds = ['home', 'step-01-credentials']
    store.currentStepIndex = 2
    store.formData = {
      username: 'ElfTester',
      email: 'elf@biegun.pl',
      interests: ['Choinka'],
      memoryAttempts: 4,
      birthdate: '01.01.2000',
      phoneNumber: '600700800',
      country: 'Laponia',
    }

    const wrapper = mount(Step11Certificate)

    expect(wrapper.find('[data-testid="santa-error-modal"]').exists()).toBe(false)

    await wrapper.find('[data-testid="finish-registration-btn"]').trigger('click')

    const modal = wrapper.find('[data-testid="santa-error-modal"]')
    expect(modal.exists()).toBe(true)
    expect(modal.find('[data-testid="santa-retro-svg"]').exists()).toBe(true)
    expect(modal.find('[data-testid="santa-speech-bubble"]').text()).toContain('Hoł Hoł Hoł...')
    expect(modal.find('[data-testid="santa-error-message"]').text()).toContain('błąd serwera')
    expect(modal.find('[data-testid="santa-error-message"]').text()).toContain('Przepraszamy')
    expect(modal.findAll('button')).toHaveLength(1)

    await modal.find('[data-testid="santa-error-reset-btn"]').trigger('click')

    expect(store.currentStepIndex).toBe(0)
    expect(store.completedStepIds).toEqual([])
    expect(store.formData).toEqual({})
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
