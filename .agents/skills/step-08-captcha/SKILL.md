---
name: step-08-captcha
description: Specyfikacja Kroku 8 rejestracji (Step08Captcha) — świąteczna CAPTCHA „Karp bez ości” z okresową podmianą kafelków na planszy 3×3.
---

# Skill: Krok 08 — Świąteczna CAPTCHA „Karp bez ości” (`Step08Captcha`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-08-captcha`
- **Ścieżka (`vue-router`)**: `/krok-8`
- **Komponent**: `src/steps/Step08Captcha.vue`
- **Logika planszy**: `src/utils/captchaGame.ts` (`createCaptchaBoard`, `swapCaptchaTiles`, `verifyCaptchaSelection`)

## Opis działania i UI
- Siatka 3×3 (domyślnie 9 kafelków, opcjonalnie 4×4 przez prop `gridSize`) zawierająca świąteczne potrawy:
  - `boneless-carp` (`🐟` Karp bez ości)
  - `bony-carp` (`🦴🐟` Karp z ością)
  - `pierogi` (`🥟` Pieróg)
  - `borscht` (`🥣` Barszcz)
- Co 2,5 sekundy (domyślnie `swapIntervalMs = 2500`, konfigurowalne jako prop dla testów) część kafelków na planszy podmienia się w inne potrawy (np. w karpia z ością lub z powrotem w karpia bez ości). Plansza zawsze zachowuje co najmniej jednego karpia bez ości.
- Użytkownik musi zaznaczyć **wszystkie aktualne kawałki „karpia bez ości”** (i żadnego innego kafelka) oraz kliknąć przycisk **„Zweryfikuj”** (`data-testid="captcha-verify-btn"`), zanim potrawy się podmienią.
- Poprawna weryfikacja zatrzymuje podmianę kafelków i odblokowuje przycisk przejścia dalej (`data-testid="step-08-submit-btn"`), który wywołuje `store.completeStep('step-08-captcha', { captchaVerified: true, captchaAttempts })` oraz `store.goToNextStep()`.
- W trybie `store.devMode === true` przycisk przejścia dalej jest zawsze aktywny.

## Testy jednostkowe
- `src/__tests__/Step08Captcha.spec.ts` — weryfikuje renderowanie siatki 3×3, nieudaną weryfikację przy błędnym/niepełnym zaznaczeniu, okresową podmianę kafelków po `swapIntervalMs`, pomyślną weryfikację i zapisanie `{ captchaVerified: true, captchaAttempts }` do store oraz odblokowanie w `devMode`.
