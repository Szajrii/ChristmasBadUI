---
name: control-volume-bauble-game
description: Specyfikacja irytującej regulacji głośności muzyki „Last Christmas” przez 10-sekundową mini-grę z 20 bombkami na choince (Issue #1).
---

# Skill: Regulacja głośności — Mini-gra z bombkami na choince

Ten skill opisuje mechanikę głośnej muzyki startowej oraz okna dialogowego do jej wyciszania w górnym panelu kontrolnym.

## Cel i zachowanie
- **Muzyka na starcie**: `FestiveAudioPlayer` (`src/utils/lastChristmasAudio.ts`) odtwarza w pętli głośną, kiczowatą melodię „Last Christmas” (syntetyzator Web Audio API, bez zewnętrznych plików MP3). Jeśli przeglądarka zablokuje autoplay, dźwięk automatycznie rusza przy pierwszej interakcji użytkownika (`pointerdown` / `keydown`).
- **Nie jest to osobny krok formularza**: funkcja działa globalnie z poziomu `ControlPanel.vue` już od kroku 0.

## Mechanika okna dialogowego (`VolumeBaubleGameModal.vue`)
- Kliknięcie przycisku `data-testid="volume-control-btn"` w `ControlPanel.vue` wywołuje `store.openVolumeGame()`, co:
  1. **Resetuje głośność muzyki do `100%`** (nawet jeśli wcześniej była częściowo lub całkowicie wyciszona).
  2. Otwiera okno modalne `VolumeBaubleGameModal.vue`.
- W oknie znajduje się choinka z **20 kolorowymi bombkami** (każda ma losową wartość od `1` do `5`).
- Okno jest aktywne przez **10 sekund**.
- Kliknięta bombka znika, a jej wartość (1–5%) jest dodawana do sumy wyciszenia.
- Po upływie 10 sekund lub po kliknięciu wszystkich 20 bombek okno zamyka się i wywołuje `store.finishVolumeGame(reductionPercent, allBaublesClicked)`:
  - Jeśli kliknięto wszystkie 20 bombek → głośność ustawiana jest na **`0%`**.
  - W przeciwnym razie → głośność ustawiana jest na `max(0, 100 - suma_wartości)%`.

## Użyte pliki i komponenty
- `src/utils/lastChristmasAudio.ts` — syntezator Web Audio API (`FestiveAudioPlayer`)
- `src/components/ui/VolumeBaubleGameModal.vue` — okno dialogowe z choinką i 20 bombkami
- `src/components/layout/ControlPanel.vue` — przycisk `data-testid="volume-control-btn"`
- `src/stores/registrationStore.ts` — stan `musicVolume`, `isVolumeGameOpen` oraz akcje `openVolumeGame` / `finishVolumeGame`
- `src/App.vue` — uruchamianie audio, nasłuch pierwszej interakcji, synchronizacja głośności

## Testy jednostkowe
- `src/__tests__/registrationStore.spec.ts` — logika wyciszania, pełnego wyciszenia do 0% i resetu do 100% przy ponownym otwarciu.
- `src/__tests__/VolumeBaubleGameModal.spec.ts` — klikanie bombek, licznik 10s (`vi.useFakeTimers()`), kliknięcie wszystkich 20 bombek.
- `src/__tests__/App.spec.ts` — otwieranie modalu z poziomu `ControlPanel`.
