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
    id: 'step-05-birthdate',
    path: '/krok-5',
    title: 'Krok 5: Data urodzenia',
    subtitle: 'Wystrzel sanie w przeszłość po swój rok i opanuj uciekające +1/-1!',
    icon: '🛷',
  },
  {
    id: 'step-06-phone',
    path: '/krok-6',
    title: 'Krok 6: Numer telefonu',
    subtitle: 'Wykręć 9 cyfr na starej tarczy obrotowej — nie puszczaj za wcześnie!',
    icon: '☎️',
  },
  {
    id: 'step-07-country',
    path: '/krok-7',
    title: 'Krok 7: Kraj zamieszkania',
    subtitle: 'Znajdź swój kraj na liście wg odległości od Bieguna Północnego!',
    icon: '🌍',
  },
  {
    id: 'step-08-captcha',
    path: '/krok-8',
    title: 'Krok 8: Świąteczna CAPTCHA',
    subtitle: 'Zaznacz wszystkie kawałki karpia bez ości, zanim się zamienią!',
    icon: '🐟',
  },
  {
    id: 'step-09-terms',
    path: '/krok-9',
    title: 'Krok 9: Regulamin Mikołaja',
    subtitle: 'Przeczytaj uważnie RODO Bieguna Północnego i złap checkbox!',
    icon: '📜',
  },
  {
    id: 'step-10-grinch',
    path: '/krok-10',
    title: 'Krok 10: Próba Grincha',
    subtitle: 'Przytrzymaj przycisk przez 5 sekund i nie daj się Grinchowi!',
    icon: '👹',
  },
  {
    id: 'step-11-certificate',
    path: '/krok-11',
    title: 'Krok 11: Świąteczny Certyfikat',
    subtitle: 'Twój oficjalny wpis na Listę Grzecznych / Niegrzecznych!',
    icon: '🏆',
  },
]
