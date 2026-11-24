import type { RegistrationStepDefinition } from '../types/step'

/**
 * Centralny rejestr kroków formularza rejestracyjnego (metadane i ścieżki routera).
 * Komponenty podpinane są w src/router/index.ts, aby uniknąć cyklicznych importów ze store.
 */
export const registrationSteps: RegistrationStepDefinition[] = [
  {
    id: 'home',
    path: '/',
    title: 'Świąteczna Strona Główna',
    subtitle: 'Zaloguj się (powodzenia!) albo rozpocznij kiczowatą rejestrację!',
    icon: '🎄',
  },
  {
    id: 'step-01-credentials',
    path: '/krok-1',
    title: 'Krok 1: Login i Hasło',
    subtitle: 'Wylosuj swój świąteczny nick i wpisz hasło wspak przy świeczce!',
    icon: '🎰',
  },
  {
    id: 'step-02-email',
    path: '/krok-2',
    title: 'Krok 2: Świąteczny E-mail',
    subtitle: 'Wpisz adres e-mail spełniający 9 absurdalnych wymagań Mikołaja!',
    icon: '📧',
  },
  {
    id: 'step-03-interests',
    path: '/krok-3',
    title: 'Krok 3: Zainteresowania',
    subtitle: 'Wybierz swoje świąteczne hobby — uważaj, w co klikasz!',
    icon: '🎁',
  },
  {
    id: 'step-04-memory',
    path: '/krok-4',
    title: 'Krok 4: Świąteczne Memory',
    subtitle: 'Znajdź wszystkie świąteczne pary na planszy!',
    icon: '🃏',
  },
  {
    id: 'step-05-placeholder',
    path: '/krok-5',
    title: 'Krok 5: Wkrótce',
    subtitle: 'Kolejne okno rejestracyjne (w budowie!)',
    icon: '🦌',
  },
]
