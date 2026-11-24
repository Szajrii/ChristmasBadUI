# Automatyzacja pracy z GitHub Pages, Issues i Agentami Gemini

Ten przewodnik wyjaśnia krok po kroku, jak:
1. Włączyć automatyczny hosting aplikacji na **GitHub Pages**.
2. Podpiąć **agentów Gemini** pod **GitHub Actions + Issues**, aby móc zdalnie delegować zadania (np. z telefonu, zakładając Issue na GitHubie).

---

## Część 1: Konfiguracja GitHub Pages (Hosting)

W repozytorium znajduje się już gotowy plik `.github/workflows/deploy.yml`. Przy każdym `push` na gałąź `master` uruchamia on:
1. Konfigurację `pnpm` (`pnpm/action-setup@v4`) + `pnpm install --frozen-lockfile`
2. `pnpm test` (testy jednostkowe Vitest)
3. `pnpm run build` (z `BASE_PATH=/ChristmasBadUI/`)
4. Publikację katalogu `dist/` na GitHub Pages.

### Co musisz kliknąć na GitHubie (jednorazowo):
1. Wejdź w swoje repozytorium na GitHubie (`Szajrii/ChristmasBadUI`).
2. Przejdź do **Settings** → **Pages** (w menu po lewej).
3. W sekcji **Build and deployment** → **Source** wybierz **GitHub Actions**.
4. Wypchnij kod na gałąź `master` (`git push origin master`).
5. Po ~1 minucie strona będzie dostępna pod adresem:
   `https://szajrii.github.io/ChristmasBadUI/`

---

## Część 2: Podpięcie Agentów Gemini (GitHub Actions + Issues)

Dzięki oficjalnej akcji **`google-github-actions/run-gemini-cli`** możesz traktować GitHub Issues jak tablicę zadań dla zdalnych agentów Gemini. Agent przeczyta `AGENTS.md`, **wszystkie skille** w `.agents/skills/*/SKILL.md` oraz `docs/PROJECT_SPEC.md`, a następnie:
- jeśli opis Issue jest niejasny — zada Ci pytania i zaproponuje własne rozwiązania w komentarzu (zgodnie ze skillem `clarify-and-propose`),
- jeśli wymagania są jasne — napisze kod, utworzy osobny skill dla nowego widoku, uruchomi `pnpm test` i `pnpm run build`, zaktualizuje dokumentację i otworzy Pull Requesta!

### Krok 1: Zdobądź klucz API Gemini
1. Wejdź na [Google AI Studio](https://aistudio.google.com/apikey).
2. Wygeneruj nowy klucz API (`Create API key`).

### Krok 2: Dodaj sekret w repozytorium GitHub
1. W repozytorium przejdź do **Settings** → **Secrets and variables** → **Actions**.
2. Kliknij **New repository secret**.
3. Nazwa: `GEMINI_API_KEY`
4. Wartość: wklej swój klucz z Google AI Studio i zapisz.

### Krok 3: Włącz uprawnienia dla GitHub Actions (tworzenie PR i akcje Google)
1. Przejdź do **Settings** → **Actions** → **General**.
2. W sekcji **Actions permissions** wybierz **Allow all actions and reusable workflows** (lub w *Allow specified actions* dodaj `google-github-actions/*`), aby GitHub zezwolił na uruchomienie `google-github-actions/run-gemini-cli`.
3. Zjedź na dół do sekcji **Workflow permissions**.
4. Wybierz **Read and write permissions**.
5. Zaznacz checkbox **Allow GitHub Actions to create and approve pull requests**.
6. Kliknij **Save**.

### Krok 4: Utwórz etykietę (Label) dla zadań agenta
1. Przejdź do zakładki **Issues** → **Labels**.
2. Utwórz nową etykietę o nazwie: `gemini-task` (np. w świątecznym kolorze `#c41e3a`).

---

## Część 3: Jak zdalnie delegować zadania agentowi?

W repozytorium przygotowałem gotowy workflow `.github/workflows/gemini-agent.yml` oraz szablon Issue `.github/ISSUE_TEMPLATE/new-step.md`.

### Sposób A — Nowy krok formularza przez Issue + etykieta `gemini-task`
1. Na GitHubie (również z aplikacji mobilnej) kliknij **Issues** → **New issue**.
2. Wybierz szablon **Nowy krok formularza (ChristmasBadUI)**.
3. Opisz pomysł na kolejny irytujący krok (np. *„Krok 1: Wpisywanie imienia przez łapanie spadających płatków śniegu z literami"*).
4. Nadaj Issue etykietę **`gemini-task`**.
5. GitHub Actions automatycznie uruchomi agenta Gemini, który:
   - przeczyta `AGENTS.md`, **wszystkie skille** w `.agents/skills/*/SKILL.md` oraz `docs/PROJECT_SPEC.md`,
   - jeśli coś jest niejasne — najpierw zada pytania i zaproponuje warianty w komentarzu pod Issue,
   - po ustaleniu szczegółów utworzy gałąź (np. `gemini/issue-12`), zaimplementuje nowy krok i reużywalne komponenty, utworzy dla niego osobny skill, dopisze testy jednostkowe, zaktualizuje `docs/PROJECT_SPEC.md`, uruchomi `pnpm test` oraz `pnpm run build` i otworzy **Pull Request**.

### Sposób B — Komentarz `@gemini-cli` w dowolnym Issue lub PR
Możesz też napisać komentarz pod istniejącym Issue lub Pull Requestem zaczynający się od `@gemini-cli`, np.:
> `@gemini-cli wybieram Opcję B, zrób z tego PR!`

### Bezpieczeństwo (ważne!)
- Workflow w `.github/workflows/gemini-agent.yml` domyślnie sprawdza, czy akcję wywołał **właściciel repozytorium** (`OWNER`, `MEMBER` lub `COLLABORATOR`), aby nikt z zewnątrz nie mógł zużyć Twojego klucza `GEMINI_API_KEY` ani wstrzyknąć poleceń przez obce Issue.
- Zawsze przeglądaj utworzony Pull Request przed kliknięciem **Merge** — po zmergowaniu do `master` GitHub Pages automatycznie wdroży nową wersję aplikacji!
