# ChristmasBadUI — Specyfikacja projektu i Plan Działania

> **Ważne dla agentów AI**: Ten dokument jest żywą specyfikacją projektu. Przed rozpoczęciem pracy przeczytaj `AGENTS.md` oraz **wszystkie skille** w `.agents/skills/*/SKILL.md`. Każda zmiana w krokach formularza, skillach, panelu kontrolnym lub architekturze **musi** zostać tu odnotowana.

## 1. Koncepcja projektu

**ChristmasBadUI** to satyryczna aplikacja webowa w klimacie świątecznym (Boże Narodzenie), której trzonem jest **wieloetapowy formularz rejestracyjny** (docelowo kilkanaście lub więcej okien/kroków).

### Główne założenia:
- **Progresja blokowana**: Aby przejść do kroku `N + 1`, użytkownik musi poprawnie zaliczyć krok `N`.
- **Maksymalny kicz świąteczny**: Śnieg, migające lampki, laski cukrowe, Mikołaj, choinki, złote obramowania, jaskrawe kolory, krzykliwe fonty i animacje.
- **Celowo trudny i irytujący UX**: Każde okno wprowadza własny, frustrujący mechanizm (np. uciekające przyciski, dziwne sposoby wpisywania tekstu, świąteczne pułapki), ale zawsze pozostaje możliwe do przejścia.
- **Modularność i osobne skille**: Kod dzielony jest na małe komponenty UI (`src/components/ui/`) oraz niezależne moduły kroków (`src/steps/`), a każdy widok/formularz otrzymuje własny plik skilla w `.agents/skills/step-XX-<nazwa>/SKILL.md`.
- **Proste testy jednostkowe**: Vitest pilnuje, by nowe etapy nie psuły logiki przechodzenia kroków i wcześniejszych ekranów.
- **Hosting**: GitHub Pages (`https://szajrii.github.io/ChristmasBadUI/`).

---

## 2. Stack technologiczny

| Warstwa | Technologia |
| :--- | :--- |
| Menedżer pakietów | **pnpm** (`packageManager: pnpm@11.24.0`) |
| Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Bundler | Vite 8 |
| Stylowanie | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Zarządzanie stanem | Pinia |
| Testy jednostkowe | Vitest + `@vue/test-utils` + `jsdom` |
| CI/CD & Hosting | GitHub Actions + GitHub Pages |

---

## 3. Plan działania (Etapy)

### Etap 0 — Fundament projektu (OBECNY ETAP)
- [x] Utworzenie instrukcji dla agentów (`AGENTS.md`), modułowych skilli (`.agents/skills/`) oraz żywej specyfikacji (`docs/PROJECT_SPEC.md`).
- [x] Instrukcja automatyzacji z GitHub Actions / Issues / Gemini (`docs/GITHUB_AGENTS_GUIDE.md`).
- [x] Konfiguracja `pnpm` + Vue 3 + Vite 8 + Tailwind CSS v4 + Pinia + Vitest.
- [x] Podstawowy układ aplikacji:
  - **Panel kontrolny** (`ControlPanel.vue`) — górny pasek z bazowymi przełącznikami (śnieg, lampki, ramka) i miejscem na przyszłe opcje.
  - **Kwadratowy kontener główny** (`StageContainer.vue`) — duże centralne okno ładujące aktywny krok formularza.
  - **Przykładowy widok startowy** (`Step00WelcomePlaceholder.vue`) — tymczasowy tekst powitalny w świątecznym kiczu.
- [x] Podstawowe testy jednostkowe (`registrationStore.spec.ts`, `App.spec.ts`).
- [x] Workflow GitHub Pages (`.github/workflows/deploy.yml`) oraz szablon dla agentów Gemini (`.github/workflows/gemini-agent.yml`) na `pnpm`.

### Etap 1 — Mechanizm kroków i pierwsze 3 formularze (Planowane)
- [ ] Krok 1: Wybór imienia / loginu (np. kręcące się koło fortuny z literami albo spadające płatki śniegu z literami).
- [ ] Krok 2: Wpisanie daty urodzenia (np. suwak od roku 1900 z losowym dryfem wiatru).
- [ ] Krok 3: Akceptacja regulaminu Mikołaja (np. mikroskopijny checkbox uciekający przed kursorem + przeszkadzający tekst).
- [ ] Rozbudowa panelu kontrolnego (np. licznik prób, pasek „Cierpliwości Mikołaja").

### Etap 2 — Kolejne irytujące kroki (4–8) (Planowane)
- [ ] Krok 4: Hasło spełniające absurdalne świąteczne reguły (np. musi zawierać imię renifera, sumę cyfr równą 24 itp.).
- [ ] Krok 5: Wybór numeru telefonu za pomocą „bombek na choince" lub suwaka binarnego.
- [ ] Krok 6: Świąteczna CAPTCHA („Zaznacz wszystkie kawałki karpia bez ości").
- [ ] Krok 7: Wybór kraju z nieposortowanej listy w migającym okienku.
- [ ] Krok 8: Potwierdzenie adresu e-mail (wpisywanie od tyłu lub za pomocą alfabetu Morse'a z dzwoneczków).

### Etap 3 — Zaawansowany chaos (kroki 9–12+) i finał (Planowane)
- [ ] Krok 9–12+: Dodatkowe mini-gry i pułapki (np. ubieranie choinki jako walidacja, trzymanie przycisku przez X sekund, podczas gdy okno się trzęsie).
- [ ] Ekran końcowy („Gratulacje, zarejestrowano na liście grzecznych / niegrzecznych!" + podsumowanie statystyk i certyfikat do pobrania).
- [ ] Opcjonalne dźwięki świąteczne (dżingle, dzwoneczki) sterowane z panelu kontrolnego.

---

## 4. Aktualny stan — Zaimplementowane kroki

| # | ID | Nazwa kroku | Plik komponentu | Dedykowany skill | Status |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 0 | `welcome-placeholder` | Świąteczny Start (Placeholder) | `src/steps/Step00WelcomePlaceholder.vue` | `.agents/skills/step-00-welcome-placeholder/SKILL.md` | Zaimplementowany (Etap 0) |

---

## 5. Rejestr skilli projektu (`.agents/skills/`)

| Nazwa skilla | Plik | Przeznaczenie |
| :--- | :--- | :--- |
| `christmas-bad-ui` | `.agents/skills/christmas-bad-ui/SKILL.md` | Ogólna architektura, stack (`pnpm`, Vue 3, Vite 8, Tailwind v4, Pinia, Vitest), zasady modularności |
| `clarify-and-propose` | `.agents/skills/clarify-and-propose/SKILL.md` | Procedura zadawania pytań użytkownikowi i proponowania własnych rozwiązań przy niejasnych zadaniach |
| `step-00-welcome-placeholder` | `.agents/skills/step-00-welcome-placeholder/SKILL.md` | Opis pierwszego widoku placeholder oraz wzór dla osobnych skilli kolejnych kroków |

---

## 6. Zaimplementowane komponenty reużywalne

- `src/components/ui/KitschButton.vue` — świąteczny przycisk w wariantach (`santa`, `elf`, `gold`, `grinch`).
- `src/components/ui/KitschCard.vue` — ramka w stylu laski cukrowej / kiczowatej kartki świątecznej.
- `src/components/ui/ChristmasLights.vue` — pasek migających lampek choinkowych.
- `src/components/ui/SnowfallOverlay.vue` — warstwa animowanego, padającego śniegu.
- `src/components/layout/ControlPanel.vue` — panel kontrolny (przełączniki śniegu/lampek/ramki, status kroku, miejsce na kolejne kontrolki).
- `src/components/layout/StageContainer.vue` — duży, kwadratowy główny kontener ładujący aktywny krok formularza.

---

## 7. Historia zmian

- **2026-11-24 (Etap 0)**: Inicjalizacja projektu (`pnpm`, Vue 3, Vite 8, Tailwind CSS v4, Pinia, Vitest), rozbicie skilli na osobne pliki (`christmas-bad-ui`, `clarify-and-propose`, `step-00-welcome-placeholder`), panel kontrolny, duży kwadratowy kontener z widokiem placeholder, testy jednostkowe oraz workflow GitHub Pages i Gemini CLI.
