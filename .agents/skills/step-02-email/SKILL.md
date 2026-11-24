---
name: step-02-email
description: Specyfikacja Kroku 2 rejestracji (Step02Email) — adres e-mail z 9 absurdalnymi, irytującymi regułami walidacji.
---

# Skill: Krok 02 — Świąteczny E-mail (`Step02Email`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-02-email`
- **Ścieżka (`vue-router`)**: `/krok-2`
- **Komponent**: `src/steps/Step02Email.vue`
- **Logika walidacji**: `src/utils/emailValidation.ts` (`evaluateEmailRules`, `isEmailValid`)

## Opis UX (ukryta lista wymagań)
- Formularz **nie pokazuje** z góry listy reguł ani ich łącznej liczby.
- Dopiero po kliknięciu przycisku zatwierdzenia (`data-testid="step-02-submit-btn"`) sprawdzana jest walidacja i wyświetlany jest **wyłącznie pierwszy niespełniony warunek** (`data-testid="email-first-error"`).

## Reguły walidacji (wszystkie 9 muszą być spełnione)
1. Poprawny format e-maila (`local@domain.xx`, bez spacji).
2. Minimum 50 znaków.
3. Słowo „pies” po chińsku (`狗`).
4. Minimum 3 cyfry, których suma wynosi dokładnie `14`.
5. Przynajmniej jedna emotka (Unicode `\p{Extended_Pictographic}`).
6. Imię renifera Mikołaja (np. `rudolf`, `kometek`, `dasher`, `comet`).
7. Liczba rzymska `XXIV` (wielkimi literami).
8. Zakaz używania małej litery `e` (wielkie `E` jest dozwolone).
9. Domena kończąca się na `.pl`, `.ho` lub `.xmas`.

## Testy jednostkowe
- `src/__tests__/Step02Email.spec.ts` — weryfikuje odrzucanie niepełnych adresów, wykrywanie każdej z reguł oraz zaliczenie kroku i zapis `email` w Pinia dla poprawnego adresu.
