---
name: step-11-certificate
description: Specyfikacja Kroku 11 rejestracji (Step11Certificate) — kiczowaty Świąteczny Certyfikat z zebranymi danymi oraz nieusuwalny modal błędu serwera z Mikołajem (SantaErrorModal) resetujący cały postęp.
---
# Skill: Krok 11 — Świąteczny Certyfikat i Błąd Serwera (`Step11Certificate`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-11-certificate`
- **Ścieżka (`vue-router`)**: `/krok-11`
- **Komponent**: `src/steps/Step11Certificate.vue` (`data-testid="step-11-certificate"`)
- **Komponent UI**: `src/components/ui/SantaErrorModal.vue` (`data-testid="santa-error-modal"`)

## Opis działania i UI
- **Świąteczny Certyfikat (`Step11Certificate.vue`)**:
  - Renderuje kiczowaty certyfikat wpisu na Listę Grzecznych / Niegrzecznych z ramką laski cukrowej (`candy-cane-border`) i werdyktem Mikołaja.
  - Wyświetla wszystkie dane zebrane dotąd w `store.formData`: dedykowane pola (`username`, `email`, `interests`, `memoryAttempts`, `birthdate`, `phoneNumber`, `country`) oraz ewentualne dodatkowe klucze obecne w `store.formData`.
  - Na dole znajduje się przycisk `🎁 Zakończ rejestrację` (`data-testid="finish-registration-btn"`), którego kliknięcie otwiera `SantaErrorModal`.
- **Modal Błędu Serwera (`SantaErrorModal.vue`)**:
  - Oparty na `KitschModal.vue`, **bez możliwości zamknięcia** (brak przycisku zamknij i obsługi klawisza Escape).
  - Zawiera dużą retro twarz Mikołaja w SVG (`data-testid="santa-retro-svg"`) oraz dymek dialogowy wychodzący z jego ust z napisem `„Hoł Hoł Hoł...”` (`data-testid="santa-speech-bubble"`).
  - Wyświetla komunikat o błędzie serwera i konieczności powtórzenia rejestracji od nowa (z przeprosinami za błędy).
  - Przycisk resetujący (`data-testid="santa-error-reset-btn"`) wywołuje `store.resetProgress()` i przekierowuje użytkownika na stronę główną (`/`).

## Testy jednostkowe
- `src/__tests__/Step11Certificate.spec.ts` — weryfikuje wyświetlanie wszystkich danych z `store.formData` na certyfikacie, otwarcie `SantaErrorModal` po kliknięciu „Zakończ rejestrację”, obecność SVG Mikołaja, dymka „Hoł Hoł Hoł...” i komunikatu błędu, brak przycisku zamknięcia oraz działanie przycisku resetującego (`store.resetProgress()` + `router.push('/')`).
