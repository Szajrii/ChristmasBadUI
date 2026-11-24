---
name: step-04-memory
description: Specyfikacja Kroku 4 rejestracji (Step04Memory) — klasyczna świąteczna gra Memory z 4 parami kart.
---

# Skill: Krok 04 — Świąteczne Memory (`Step04Memory`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-04-memory`
- **Ścieżka (`vue-router`)**: `/krok-4`
- **Komponent**: `src/steps/Step04Memory.vue`
- **Logika talii**: `src/utils/memoryGame.ts` (`createMemoryDeck`)

## Opis działania i UI
- Plansza 4×2 (8 kart = 4 pary losowych świątecznych symboli z puli `FESTIVE_SYMBOLS`).
- Odkrycie dwóch pasujących kart zostawia je odkryte.
- Odkrycie dwóch **różnych** kart powoduje krótką blokadę (650 ms), po czym zakrywane są wyłącznie te dwie nietrafione karty (wcześniej dopasowane pary zostają odkryte).
- Po dopasowaniu wszystkich 4 par odblokowuje się przycisk przejścia dalej (w `devMode` przycisk jest zawsze aktywny).
- **Po 5 sekundach** w tym widoku wyskakuje dialog (`KitschModal`, `data-testid="memory-skip-modal"`) z fałszywą ofertą wykupienia pominięcia 1, 2 lub 3 kroków ($2, $3, $5 — przyciski jeden pod drugim). Kliknięcie dowolnej opcji pokazuje informację, że płatności nie działają i zostawia wyłącznie przycisk powrotu do gry.

## Testy jednostkowe
- `src/__tests__/Step04Memory.spec.ts` — weryfikuje zakrycie nietrafionych kart przy zachowaniu dopasowanych par, dialog płatności po 5s, zaliczenie gry po dopasowaniu 4 par oraz obejście w `devMode`.
