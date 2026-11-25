---
name: step-03-interests
description: Specyfikacja Kroku 3 rejestracji (Step03Interests) — 21 checkboxów z zainteresowaniami (7 wierszy × 3 kolumny) oraz pułapką „Wyczyść wszystko”.
---

# Skill: Krok 03 — Wybór Zainteresowań (`Step03Interests`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-03-interests`
- **Ścieżka (`vue-router`)**: `/krok-3`
- **Komponent**: `src/steps/Step03Interests.vue`

## Opis działania i UI
- Wyświetla **21 checkboxów** ułożonych w responsywnej siatce 2–3 kolumn (`grid-cols-2 sm:grid-cols-3`, na desktopie 7 wierszy × 3 kolumny).
- Jeden z checkboxów pod koniec listy (`int-19`) nazywa się **„Wyczyść wszystko”** (`isResetTrap: true`) i wygląda identycznie jak pozostałe opcje.
- Kliknięcie **„Wyczyść wszystko”** natychmiast kasuje wszystkie zaznaczone checkboxy (łącznie z samym sobą).
- Przy próbie przejścia dalej bez zaznaczenia wszystkich 20 właściwych zainteresowań pojawia się komunikat, że trzeba wybrać **każde** zainteresowanie.
- Aby przejść dalej, należy zaznaczyć wszystkie 20 zainteresowań **z pominięciem** pułapki „Wyczyść wszystko” (lub użyć `devMode`).

## Testy jednostkowe
- `src/__tests__/Step03Interests.spec.ts` — testuje błąd przy niepełnym zaznaczeniu, działanie pułapki „Wyczyść wszystko”, zaliczenie kroku po zaznaczeniu 20 właściwych opcji oraz obejście w `devMode`.
