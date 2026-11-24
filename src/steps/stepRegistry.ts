import { markRaw } from 'vue'
import type { RegistrationStepDefinition } from '../types/step'
import Step00Home from './Step00Home.vue'
import Step01RegistrationPlaceholder from './Step01RegistrationPlaceholder.vue'

/**
 * Centralny rejestr kroków formularza rejestracyjnego.
 * Kolejne etapy (Step01..., Step02...) dopisujemy tutaj w kolejności przechodzenia.
 */
export const registrationSteps: RegistrationStepDefinition[] = [
  {
    id: 'home',
    title: 'Świąteczna Strona Główna',
    subtitle: 'Zaloguj się (powodzenia!) albo rozpocznij kiczowatą rejestrację!',
    icon: '🎄',
    component: markRaw(Step00Home),
  },
  {
    id: 'step-01-placeholder',
    title: 'Krok 1: Rejestracja',
    subtitle: 'Pierwsze okno rejestracyjne (na razie puste — w budowie!)',
    icon: '🎁',
    component: markRaw(Step01RegistrationPlaceholder),
  },
]
