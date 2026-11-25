---
name: step-07-country
description: Specyfikacja Kroku 7 rejestracji (Step07Country) — wybór kraju zamieszkania „Odległość od Bieguna Północnego”, reklama wycieczki dla Polski oraz modal ThanosSkipModal po 5 sekundach.
---

# Skill: Krok 07 — Kraj / Odległość od Bieguna Północnego (`Step07Country`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-07-country`
- **Ścieżka (`vue-router`)**: `/krok-7`
- **Komponent**: `src/steps/Step07Country.vue`
- **Komponenty UI**: `src/components/ui/ThanosSkipModal.vue`, `src/components/ui/KitschButton.vue`

## Opis działania i UI
- Użytkownik wybiera kraj zamieszkania w małym, ciasnym okienku `<select>` (`data-testid="country-select"`) bez wyszukiwarki.
- Lista krajów celowo **nie jest posortowana alfabetycznie** — ułożona jest według odległości od Bieguna Północnego (i zawiera informację o liczbie reniferów).
- Wybór kraju **„Polska”** wyświetla natrętną reklamę wycieczki na Biegun Północny (`data-testid="north-pole-ad"`). Przycisk przejścia dalej pozostaje zablokowany do momentu zamknięcia reklamy (`data-testid="close-north-pole-ad-btn"`).
- Po 5 sekundach (`skipOfferDelayMs = 5000` jako prop) otwiera się reużywalny modal `ThanosSkipModal.vue` (`data-testid="thanos-skip-modal"`):
  - zawiera 3 zwykłe oferty skipu (`skip-offer-1..3`) oraz 4. wyraźnie wyróżnioną i podświetloną ofertę specjalną (`skip-offer-special`),
  - kliknięcie w jedną z 3 zwykłych ofert uruchamia animację rozpadu na cząsteczki („rękawica Thanosa”), po czym oferta znika z widoku,
  - kliknięcie w 4. specjalną ofertę wyświetla komunikat o błędzie płatności (`skip-payment-error`) oraz przycisk powrotu (`skip-return-btn`) zamykający modal.
- Po wybraniu kraju (i ewentualnym zamknięciu reklamy dla Polski) odblokowuje się przycisk przejścia dalej (`data-testid="step-07-submit-btn"`), który wywołuje `store.completeStep('step-07-country', { country })` i `store.goToNextStep()`.
- W trybie deweloperskim (`store.devMode === true`) przycisk dalej jest zawsze aktywny.

## Testy jednostkowe
- `src/__tests__/Step07Country.spec.ts` — weryfikuje niealfabetyczną kolejność listy krajów, odblokowanie przejścia dla kraju innego niż Polska, blokadę i reklamę dla Polski, `devMode` oraz działanie `ThanosSkipModal` po 5s (rozpad 3 ofert i błąd płatności na 4. specjalnej ofercie).
