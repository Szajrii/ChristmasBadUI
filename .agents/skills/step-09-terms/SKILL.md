---
name: step-09-terms
description: Specyfikacja Kroku 9 rejestracji (Step09Terms) — Regulamin Mikołaja RODO Bieguna Północnego z detekcją prędkości przewijania oraz uciekającym po paraboli mikroskopijnym checkboxem.
---
# Skill: Krok 09 — Regulamin Mikołaja RODO Bieguna Północnego (`Step09Terms`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-09-terms`
- **Ścieżka (`vue-router`)**: `/krok-9`
- **Komponent**: `src/steps/Step09Terms.vue` (`data-testid="step-09-terms"`)
- **Komponent UI**: `src/components/ui/ParabolicCheckbox.vue`

## Opis działania i UI
- **Przewijany regulamin RODO Bieguna Północnego (`terms-scroll-container`)**:
  - Długi, kiczowaty regulamin w przewijanym kontenerze z detekcją prędkości scrollowania.
  - Zbyt szybkie przewijanie w dół (`deltaScroll > maxScrollJumpPx` lub prędkość przekraczająca `maxScrollSpeedPxPerSec`) natychmiast resetuje `scrollTop` do `0` i wyświetla ostrzeżenie: `„Przewinąłeś za szybko! Mikołaj wie, że nie czytałeś — wracamy na górę!”`.
- **Uciekający checkbox (`ParabolicCheckbox.vue`)**:
  - Mikroskopijny checkbox `„Akceptuję”`, który przy pierwszych `escapesCount` (domyślnie `3`) próbach najechania (`mouseenter`) lub kliknięcia (`click`) wystrzeliwuje po paraboli w losowym kierunku z losową siłą, a po wylądowaniu lekko się przetacza (animacja paraboliczna + rotacja).
  - Po wyczerpaniu ucieczek checkbox można normalnie zaznaczyć.
- **Opcjonalna zgoda marketingowa**:
  - Dodatkowy checkbox na spam z Bieguna Północnego (niewymagany do przejścia dalej).
- **Warunek zaliczenia**:
  - Zaznaczenie wymaganego checkboxa `„Akceptuję”` odblokowuje przycisk przejścia dalej.
  - W `store.devMode === true` przycisk przejścia dalej jest zawsze aktywny.
  - Po kliknięciu przycisku wywołuje `store.completeStep('step-09-terms', { termsAccepted: true })` oraz `store.goToNextStep()`.

## Testy jednostkowe
- `src/__tests__/Step09Terms.spec.ts` — weryfikuje ucieczki paraboliczne `ParabolicCheckbox.vue`, reset `scrollTop` i komunikat przy zbyt szybkim przewijaniu, odblokowanie przycisku i zapis w store oraz zachowanie w `devMode`.
