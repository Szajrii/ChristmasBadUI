import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRegistrationStore } from '../stores/registrationStore'

describe('registrationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts at step 0 with 0% progress and festive effects enabled', () => {
    const store = useRegistrationStore()

    expect(store.currentStepIndex).toBe(0)
    expect(store.progressPercent).toBe(0)
    expect(store.isCurrentStepCompleted).toBe(false)
    expect(store.settings.snowEnabled).toBe(true)
    expect(store.settings.lightsEnabled).toBe(true)
  })

  it('marks a step as completed and saves form data', () => {
    const store = useRegistrationStore()

    store.completeStep('welcome-placeholder', { previewAcknowledged: true })

    expect(store.isCurrentStepCompleted).toBe(true)
    expect(store.progressPercent).toBe(100)
    expect(store.formData.previewAcknowledged).toBe(true)
  })

  it('prevents navigating to locked or out-of-range steps', () => {
    const store = useRegistrationStore()

    expect(store.goToNextStep()).toBe(false)
    expect(store.goToStep(5)).toBe(false)
    expect(store.goToStep(-1)).toBe(false)
    expect(store.currentStepIndex).toBe(0)
  })

  it('toggles control panel settings and resets progress', () => {
    const store = useRegistrationStore()

    store.toggleSetting('snowEnabled')
    expect(store.settings.snowEnabled).toBe(false)

    store.completeStep('welcome-placeholder', { test: 1 })
    store.resetProgress()
    expect(store.completedStepIds).toEqual([])
    expect(store.formData).toEqual({})
  })
})
