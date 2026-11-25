---
name: step-05-birthdate
description: Specyfikacja Kroku 5 rejestracji (Step05Birthdate) — wybór daty urodzenia katapultą sań (rok) oraz tasującymi się przyciskami +1/-1 (miesiąc i dzień).
---
# Skill: Krok 05 — Data urodzenia (`Step05Birthdate`)

## Metadane kroku
- **ID w `stepRegistry.ts`**: `step-05-birthdate`
- **Ścieżka (`vue-router`)**: `/krok-5`
- **Komponent**: `src/steps/Step05Birthdate.vue`
- **Komponent UI**: `src/components/ui/SleighCatapult.vue`
- **Logika pomocnicza**: `src/utils/birthdateCatapult.ts`

## Opis działania i UI
- **Rok urodzenia (`SleighCatapult.vue`)**:
  - Użytkownik przytrzymuje przycisk `🦌 Naciągnij lejce reniferów`, aby naładować pasek siły (`0–100%` w trybie ping-pong).
  - Po puszczeniu przycisku `calculateYearFromPower` przelicza moc na rok z przedziału `1900–2026` (`0% = 2026`, `100% = 1900`).
- **Miesiąc i Dzień**:
  - Ustawiane przyciskami `+1` i `-1` (z poprawnym zawijaniem miesięcy i uwzględnieniem liczby dni w miesiącu oraz lat przestępnych).
  - **Utrudnienie UX**: Co 3 kliknięcia przycisków `+1` / `-1` kolejność przycisków zamienia się miejscami, a pod spodem pojawia się komunikat o psotach elfów.
- **Warunek zaliczenia**:
  - Wystrzelenie roku katapultą przynajmniej raz (`selectedYear !== null`) i zatwierdzenie dowolnej poprawnej daty.
  - W `store.devMode === true` przycisk przejścia dalej jest zawsze aktywny.
  - Po przejściu dalej zapisuje w `store.formData`: `birthdate` (`DD.MM.YYYY`), `birthYear`, `birthMonth`, `birthDay`.

## Testy jednostkowe
- `src/__tests__/Step05Birthdate.spec.ts` — weryfikuje mapowanie mocy na rok, lata przestępne, ładowanie i rzut katapultą, zamianę przycisków co 3 kliknięcia, zapis w `store.formData` oraz obejście w `devMode`.
