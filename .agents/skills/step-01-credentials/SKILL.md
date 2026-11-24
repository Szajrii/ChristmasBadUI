---
name: step-01-credentials
description: Specyfikacja Kroku 1 rejestracji (Step01Credentials) — wybór username przez świątecznego jednorękiego bandytę oraz hasło pisane od tyłu z efektem świeczki na kursorze.
---

# Skill: Krok 01 — Login i Hasło (`Step01Credentials`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-01-credentials`
- **Ścieżka (`vue-router`)**: `/krok-1`
- **Komponent**: `src/steps/Step01Credentials.vue`

## Opis działania i UI
1. **Username — Animowany Świąteczny Jednoręki Bandyta (`SlotMachineUsername.vue`)**:
   - Retro skrzynka kasynowa z **jednym głównym okienkiem bębna**, linią wygranej (`▶ ... ◀`) oraz mechaniczną dźwignią po prawej stronie.
   - Po pociągnięciu dźwigni (`data-testid="slot-lever-btn"` lub `spin-all-btn`) opcje przewijają się płynnie w dół i zatrzymują z efektem wyhamowania na **1 wylosowanym nicku**.
   - Wymagane jest co najmniej 1 zakręcenie (i zakończenie animacji) przed zatwierdzeniem.
2. **Hasło — Pisanie wspak + Efekt świeczki na kursorze**:
   - Jedno pole hasła (`data-testid="backwards-password-input"`).
   - Nowo wpisane znaki są doklejane na początek ciągu (pisanie od tyłu).
   - Kontener hasła zakryty jest ciemnością (`data-testid="candle-overlay"`), którą rozświetla radialny krąg świeczki (`🕯️`) podążający za kursorem myszy.
   - Efekty wizualne i pisanie wspak działają także w `devMode`, żeby można je było swobodnie testować.
3. **Warunek przejścia**: `password.length >= 6` oraz zakręcony nick. Zapisuje `{ username, password }` w Pinia (`store.formData`) i przechodzi do `/krok-2`.

## Testy jednostkowe
- `src/__tests__/Step01Credentials.spec.ts` — kręcenie dźwignią, pisanie wspak, zachowanie ciemności i animacji również przy włączonym `devMode`, zapis do Pinia i przejście dalej.
