---
name: step-10-grinch
description: Specyfikacja Kroku 10 rejestracji (Step10GrinchCheck) — „Udowodnij, że nie jesteś Grinchem” z przyciskiem wymagającym przytrzymania przez 5 sekund, trzęsącym się oknem, śniegiem z błędami i fałszywymi komunikatami.
---
# Skill: Krok 10 — Udowodnij, że nie jesteś Grinchem (`Step10GrinchCheck`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-10-grinch`
- **Ścieżka (`vue-router`)**: `/krok-10`
- **Komponent**: `src/steps/Step10GrinchCheck.vue`
- **Komponent UI**: `src/components/ui/HoldToConfirmButton.vue`

## Opis działania i UI
- **Przycisk przytrzymania (`HoldToConfirmButton.vue`)**:
  - Wymaga przytrzymania przycisku przez `holdDurationMs = 5000` (5 sekund), wyświetlając pasek postępu (`0–100%`).
  - Przedwczesne puszczenie (`mouseup`, `mouseleave`, `touchend`, `keyup`) natychmiast resetuje pasek postępu do `0%` i wyświetla komunikat o próbie sabotażu Grincha.
- **Utrudnienia UX podczas przytrzymywania**:
  - Kontener kroku trzęsie się (animacja CSS `animate-grinch-shake`).
  - Nałożony zostaje glitchowy śnieg z błędami (`data-testid="glitch-snow-overlay"`).
  - Wyświetlane są fałszywe komunikaty ostrzegawcze (np. `„🚨 Grinch próbuje przejąć sesję! Nie puszczaj!”`).
- **Warunek zaliczenia**:
  - Przytrzymanie przycisku przez pełne 5 sekund (`holdDurationMs`), co wywołuje `store.completeStep('step-10-grinch', { notAGrinch: true })` i `store.goToNextStep()`.
  - W `store.devMode === true` przycisk przejścia dalej (`step-10-submit-btn`) jest zawsze aktywny bez konieczności przytrzymywania.

## Testy jednostkowe
- `src/__tests__/Step10GrinchCheck.spec.ts` — weryfikuje reset paska postępu przy przedwczesnym puszczeniu, aktywację trzęsienia/glitch-śniegu/komunikatów w trakcie trzymania, zaliczenie kroku po 5 sekundach (`notAGrinch: true`) oraz obejście w `devMode` (bez polegania na `stepRegistry.ts`).
