import { markRaw } from 'vue'
import type { RegistrationStepDefinition } from '../types/step'
import Step00WelcomePlaceholder from './Step00WelcomePlaceholder.vue'

/**
 * Centralny rejestr kroków formularza rejestracyjnego.
 * Kolejne etapy (Step01..., Step02...) dopisujemy tutaj w kolejności przechodzenia.
 */
export const registrationSteps: RegistrationStepDefinition[] = [
  {
    id: 'welcome-placeholder',
    title: 'Świąteczny Start',
    subtitle: 'Przygotuj się na najbardziej irytującą rejestrację pod choinką!',
    icon: '🎄',
    component: markRaw(Step00WelcomePlaceholder),
  },
]
