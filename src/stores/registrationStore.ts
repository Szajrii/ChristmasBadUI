import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { registrationSteps } from '../steps/stepRegistry'
import type { ControlPanelSettings } from '../types/step'

export const useRegistrationStore = defineStore('registration', () => {
  const currentStepIndex = ref(0)
  const completedStepIds = ref<string[]>([])
  const formData = ref<Record<string, unknown>>({})

  const settings = ref<ControlPanelSettings>({
    snowEnabled: true,
    lightsEnabled: true,
    kitschBorderEnabled: true,
  })

  const totalSteps = computed(() => registrationSteps.length)
  const currentStep = computed(() => registrationSteps[currentStepIndex.value])
  const isCurrentStepCompleted = computed(() =>
    currentStep.value ? completedStepIds.value.includes(currentStep.value.id) : false
  )
  const canGoNext = computed(
    () => isCurrentStepCompleted.value && currentStepIndex.value < totalSteps.value - 1
  )
  const canGoPrevious = computed(() => currentStepIndex.value > 0)
  const progressPercent = computed(() => {
    if (totalSteps.value === 0) return 0
    return Math.round((completedStepIds.value.length / totalSteps.value) * 100)
  })

  function isStepUnlocked(index: number): boolean {
    if (index <= 0) return true
    const previousStep = registrationSteps[index - 1]
    return previousStep ? completedStepIds.value.includes(previousStep.id) : false
  }

  function completeStep(stepId: string, payload?: Record<string, unknown>) {
    if (!completedStepIds.value.includes(stepId)) {
      completedStepIds.value.push(stepId)
    }
    if (payload) {
      formData.value = { ...formData.value, ...payload }
    }
  }

  function goToNextStep(): boolean {
    if (!canGoNext.value) return false
    currentStepIndex.value += 1
    return true
  }

  function goToPreviousStep(): boolean {
    if (!canGoPrevious.value) return false
    currentStepIndex.value -= 1
    return true
  }

  function goToStep(index: number): boolean {
    if (index < 0 || index >= totalSteps.value) return false
    if (!isStepUnlocked(index)) return false
    currentStepIndex.value = index
    return true
  }

  function toggleSetting(key: keyof ControlPanelSettings) {
    settings.value[key] = !settings.value[key]
  }

  function resetProgress() {
    currentStepIndex.value = 0
    completedStepIds.value = []
    formData.value = {}
  }

  return {
    currentStepIndex,
    completedStepIds,
    formData,
    settings,
    totalSteps,
    currentStep,
    isCurrentStepCompleted,
    canGoNext,
    canGoPrevious,
    progressPercent,
    isStepUnlocked,
    completeStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    toggleSetting,
    resetProgress,
  }
})
