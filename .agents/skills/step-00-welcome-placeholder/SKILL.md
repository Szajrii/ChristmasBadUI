---
name: step-00-welcome-placeholder
description: Specyfikacja widoku startowego Step00WelcomePlaceholder (Etap 0) oraz wzór dokumentowania kolejnych kroków formularza w ChristmasBadUI.
---

# Skill: Krok 00 — Świąteczny Start (Placeholder)

> Ten skill opisuje pierwszy widok aplikacji i służy jako **szablon** dla osobnych skilli kolejnych kroków formularza (`.agents/skills/step-XX-<nazwa>/SKILL.md`).

## Metadane kroku
- **ID w `stepRegistry.ts`**: `welcome-placeholder`
- **Komponent**: `src/steps/Step00WelcomePlaceholder.vue`
- **Typ**: Widok startowy / placeholder Etapu 0 (do rozbudowy lub zastąpienia w Etapie 1)

## Opis działania i UI
- Wyświetla się wewnątrz głównego kwadratowego kontenera `StageContainer.vue`.
- Zawiera kiczowate świąteczne powitanie (`🎄🎅🎁`, `HO! HO! HO!`), przykładowy tekst informujący o przyszłych krokach oraz przycisk `KitschButton` (wariant `gold`).
- Kliknięcie przycisku wywołuje `store.completeStep('welcome-placeholder', { previewAcknowledged: true })`, co zalicza krok i wyświetla komunikat potwierdzający.

## Użyte reużywalne komponenty
- `src/components/ui/KitschButton.vue`
- `src/stores/registrationStore.ts`

## Testy jednostkowe
- `src/__tests__/App.spec.ts` — weryfikuje renderowanie widoku oraz zaliczenie kroku po kliknięciu przycisku `data-testid="placeholder-complete-btn"`.
