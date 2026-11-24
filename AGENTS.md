# AGENTS.md — ChristmasBadUI

Witaj, agencie! Pracujesz nad projektem **ChristmasBadUI** — celowo kiczowatym, irytującym i absurdalnie trudnym świątecznym formularzem rejestracyjnym (wieloetapowym).

## Obowiązkowe zasady przed rozpoczęciem pracy

1. **PRZECZYTAJ WSZYSTKIE SKILLE PROJEKTU**:
   - Zanim napiszesz choćby jedną linię kodu, sprawdź katalog `.agents/skills/` i przeczytaj **wszystkie** pliki `SKILL.md` (będziemy dodawać ich coraz więcej — w tym osobne skille opisujące każdy widok/formularz).
   - Przeczytaj także główną specyfikację projektu: [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md).
2. **Zadawaj pytania i proponuj rozwiązania (gdy zadanie jest niejasne)**:
   - Jeśli wymagania użytkownika lub treść GitHub Issue są niepełne lub niejasne, zastosuj zasady ze skilla `.agents/skills/clarify-and-propose/SKILL.md`: przygotuj krótką listę pytań dla użytkownika oraz zaproponuj własne kreatywne rozwiązania, zanim przejdziesz do kodowania.
3. **Używaj wyłącznie `pnpm`**:
   - Cały projekt (lokalnie i w GitHub Actions) działa na **`pnpm`**. Nie używaj `npm` ani `yarn` i nie commituj `package-lock.json`.
4. **Projekt rozwijany jest etapami — modularność, tryb dev i osobne skille**:
   - Nie przepisuj architektury bez wyraźnej potrzeby. Buduj małe, reużywalne komponenty w `src/components/ui/` i rejestruj nowe kroki formularza w `src/steps/stepRegistry.ts`.
   - **Szacunek dla `store.devMode`**: gdy `store.devMode === true`, wyciszona zostaje muzyka (oraz ewentualne inne głośne dźwięki) i odblokowana zostaje nawigacja między krokami bez ich zaliczania; animacje wizualne oraz mechaniki UI (np. przyciemnianie, uciekające elementy) pozostają aktywne, aby dało się je testować.
   - Dla każdego nowego widoku/formularza utwórz **osobny skill** w `.agents/skills/step-XX-<nazwa>/SKILL.md` (wzór: `.agents/skills/step-00-home/SKILL.md`).
5. **Aktualizuj dokumentację na bieżąco (Living Documentation)**:
   - Po dodaniu lub zmianie kroku formularza, komponentu UI, skilla lub opcji w panelu kontrolnym **zawsze zaktualizuj** `docs/PROJECT_SPEC.md` (sekcje kroków, skilli oraz „Historia zmian").
   - Jeśli zmienisz istniejący widok, zaktualizuj także jego dedykowany skill w `.agents/skills/`.
6. **Testy jednostkowe**:
   - Uruchamiaj `pnpm test` (Vitest) i `pnpm run build` przed zakończeniem zadania.
   - Dodawaj proste, czytelne testy jednostkowe dla logiki nowych kroków i zmian w store (`src/__tests__/`). Nie przesadzaj ze złożonością — to projekt dla zabawy, ale testy mają chronić wcześniejsze etapy przed regresją.
7. **Kompatybilność z GitHub Pages**:
   - Wszystkie ścieżki do zasobów muszą uwzględniać `import.meta.env.BASE_URL` (aplikacja działa pod `/ChristmasBadUI/` na GitHub Pages).
   - Nie używaj backendu ani sekretów w kodzie klienta — aplikacja jest w 100% statyczna (SPA).

## Komendy deweloperskie (`pnpm`)

- `pnpm install` — instalacja zależności
- `pnpm dev` — lokalny serwer deweloperski (Vite 8)
- `pnpm test` — testy jednostkowe (Vitest, jednorazowe uruchomienie)
- `pnpm run test:watch` — testy w trybie watch
- `pnpm run build` — budowanie produkcyjne (`dist/`)
- `pnpm run preview` — podgląd zbudowanej wersji
