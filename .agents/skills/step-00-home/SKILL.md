---
name: step-00-home
description: Specyfikacja strony głównej Step00Home (Issue #2) z przyciskami Logowanie (okno dialogowe) i Rejestracja.
---

# Skill: Krok 00 — Strona Główna (`Step00Home`)

> Ten skill opisuje stronę główną aplikacji oraz służy jako wzór dokumentowania kolejnych kroków w `.agents/skills/step-XX-<nazwa>/SKILL.md`.

## Metadane kroku
- **ID w `stepRegistry.ts`**: `home`
- **Komponent**: `src/steps/Step00Home.vue`

## Opis działania i UI
- Wyświetla się jako pierwszy widok wewnątrz `StageContainer.vue`.
- Zawiera dwa główne przyciski `KitschButton`:
  1. **`🔐 Logowanie`** (`data-testid="home-login-btn"`) — otwiera okno dialogowe `KitschModal` (`data-testid="login-modal"`) z kiczowatym komunikatem, że *„przecież tu nikt jeszcze nie ma konta”*, oraz przyciskiem `🎁 Przejdź do rejestracji` (`data-testid="login-modal-register-btn"`).
  2. **`📝 Rejestracja`** (`data-testid="home-register-btn"`) — bezpośrednio zalicza krok `home` (`entryChoice: 'register'`) i przenosi do kroku 1 (`goToNextStep()`).

## Warunek przejścia do kolejnego kroku
- Kliknięcie przycisku **Rejestracja** na stronie głównej lub przycisku **Przejdź do rejestracji** w oknie dialogowym logowania.

## Użyte reużywalne komponenty
- `src/components/ui/KitschButton.vue`
- `src/components/ui/KitschModal.vue`
- `src/stores/registrationStore.ts`

## Testy jednostkowe
- `src/__tests__/App.spec.ts` — testuje otwieranie okna dialogowego logowania oraz przejście do Kroku 1 zarówno przez przycisk rejestracji, jak i przez przycisk w oknie logowania.
