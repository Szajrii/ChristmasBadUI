---
name: step-06-phone
description: Specyfikacja Kroku 6 rejestracji (Step06Phone) — wpisywanie 9-cyfrowego numeru telefonu za pomocą retro tarczy obrotowej (RotaryPhoneDial).
---
# Skill: Krok 06 — Numer telefonu (`Step06Phone`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-06-phone`
- **Ścieżka (`vue-router`)**: `/krok-6`
- **Komponent**: `src/steps/Step06Phone.vue`
- **Komponent UI**: `src/components/ui/RotaryPhoneDial.vue`

## Opis działania i UI
- **Tarcza obrotowa (`RotaryPhoneDial.vue`)**:
  - Retro tarcza telefonu z 10 otworami dla cyfr `0–9` w lekko pomieszanym układzie (`['3', '7', '1', '9', '4', '0', '6', '2', '8', '5']`).
  - Wybranie cyfry wymaga chwycenia otworu (`mousedown` / `touchstart`) i przeciągnięcia tarczy zgodnie z ruchem wskazówek zegara aż do stopera (`135°`, `targetRotationDeg = 45 + index * 28`).
  - Jeśli użytkownik puści tarczę przed osiągnięciem stopera, tarcza płynnie wraca na miejsce (`transform: rotate(0deg)` z CSS transition), a cyfra nie zostaje zaliczona.
- **Zarządzanie numerem (`Step06Phone.vue`)**:
  - Zbiera 9-cyfrowy numer telefonu w formacie `XXX-XXX-XXX`.
  - Posiada przyciski `⬅️ Cofnij cyfrę` oraz `🗑️ Wyczyść`.
- **Warunek zaliczenia**:
  - Wykręcenie pełnych 9 cyfr (`phoneNumber.length === 9`).
  - W `store.devMode === true` przycisk przejścia dalej jest zawsze aktywny.
  - Po przejściu dalej zapisuje w `store.formData`: `phoneNumber` (9-cyfrowy ciąg znaków) i wywołuje `store.goToNextStep()`.

## Testy jednostkowe
- `src/__tests__/Step06Phone.spec.ts` — weryfikuje odrzucenie cyfry przy zbyt wczesnym puszczeniu tarczy, zaliczenie cyfry po dociągnięciu do stopera, cofanie/czyszczenie cyfr, odblokowanie przycisku po 9 cyfrach, zapis `phoneNumber` w `store.formData` oraz obejście w `devMode`.
