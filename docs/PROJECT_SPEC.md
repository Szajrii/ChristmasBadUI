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
| Routing | Vue Router (`createWebHashHistory`, guard kroków) |
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
| 0 | `home` | Świąteczna Strona Główna | `src/steps/Step00Home.vue` | `.agents/skills/step-00-home/SKILL.md` | Zaimplementowany (Issue #2) |
| 1 | `step-01-credentials` | Krok 1: Login i Hasło | `src/steps/Step01Credentials.vue` | `.agents/skills/step-01-credentials/SKILL.md` | Zaimplementowany |
| 2 | `step-02-email` | Krok 2: Świąteczny E-mail | `src/steps/Step02Email.vue` | `.agents/skills/step-02-email/SKILL.md` | Zaimplementowany |
| 3 | `step-03-interests` | Krok 3: Zainteresowania | `src/steps/Step03Interests.vue` | `.agents/skills/step-03-interests/SKILL.md` | Zaimplementowany |
| 4 | `step-04-placeholder` | Krok 4: Wkrótce (Placeholder) | `src/steps/Step04Placeholder.vue` | `.agents/skills/step-04-placeholder/SKILL.md` | Tymczasowy |

---

## 5. Rejestr skilli projektu (`.agents/skills/`)

| Nazwa skilla | Plik | Przeznaczenie |
| :--- | :--- | :--- |
| `christmas-bad-ui` | `.agents/skills/christmas-bad-ui/SKILL.md` | Ogólna architektura, stack (`pnpm`, Vue 3, Vite 8, Tailwind v4, Pinia, Vue Router, Vitest), zasady modularności |
| `clarify-and-propose` | `.agents/skills/clarify-and-propose/SKILL.md` | Procedura zadawania pytań użytkownikowi i proponowania własnych rozwiązań przy niejasnych zadaniach |
| `step-00-home` | `.agents/skills/step-00-home/SKILL.md` | Strona główna z przyciskami Logowanie (okno dialogowe) i Rejestracja (Issue #2) |
| `step-01-credentials` | `.agents/skills/step-01-credentials/SKILL.md` | Krok 1: jednoręki bandyta dla username + hasło wspak z efektem świeczki na kursorze |
| `step-02-email` | `.agents/skills/step-02-email/SKILL.md` | Krok 2: e-mail z 9 absurdalnymi regułami (50+ znaków, 狗, suma cyfr 14, emotka, renifer, XXIV, brak małego e, TLD) |
| `step-03-interests` | `.agents/skills/step-03-interests/SKILL.md` | Krok 3: 30 checkboxów w 3 kolumnach z ukrytą pułapką „Wyczyść wszystko” |
| `step-04-placeholder` | `.agents/skills/step-04-placeholder/SKILL.md` | Tymczasowy pusty widok Kroku 4 rejestracji |
| `control-volume-bauble-game` | `.agents/skills/control-volume-bauble-game/SKILL.md` | Głośna muzyka „Last Christmas” na starcie oraz 10s mini-gra z 20 bombkami wyciszającymi dźwięk |

---

## 6. Zaimplementowane komponenty reużywalne

- `src/components/ui/KitschButton.vue` — świąteczny przycisk w wariantach (`santa`, `elf`, `gold`, `grinch`).
- `src/components/ui/KitschCard.vue` — ramka w stylu laski cukrowej / kiczowatej kartki świątecznej.
- `src/components/ui/KitschModal.vue` — reużywalne okno dialogowe oparte na `KitschCard`.
- `src/components/ui/SlotMachineUsername.vue` — retro skrzynka jednorękiego bandyty z mechaniczną dźwignią i pojedynczym okienkiem bębna losującym 1 `username`.
- `src/components/ui/ChristmasLights.vue` — pasek migających lampek choinkowych.
- `src/components/ui/SnowfallOverlay.vue` — warstwa animowanego, padającego śniegu.
- `src/components/ui/VolumeBaubleGameModal.vue` — okno dialogowe z choinką i 20 losowymi bombkami (1–5%) na 10s do wyciszania muzyki.
- `src/utils/lastChristmasAudio.ts` — statyczny syntezator melodii „Last Christmas” w Web Audio API.
- `src/utils/emailValidation.ts` — zestaw 9 absurdalnych reguł walidacji adresu e-mail dla Kroku 2.
- `src/components/layout/ControlPanel.vue` — panel kontrolny (przełączniki muzyki/śniegu/lampek/ramki, combobox `Tryb dev: OFF/ON` + pasek szybkiego skakania między krokami w trybie deweloperskim).
- `src/components/layout/StageContainer.vue` — duży, kwadratowy główny kontener ładujący aktywny krok formularza.

---

## 7. Historia zmian

- **2026-11-24 (Powiększenie głównego kontenera)**: Zwiększono rozmiar głównego kwadratu w `StageContainer.vue` (`max-w-[780px]`) oraz wysokość listy w `Step03Interests.vue`, aby mieściło się więcej treści bez ciasnego scrollowania.
- **2026-11-24 (Krok 3: Zainteresowania)**: Zaimplementowano `Step03Interests.vue` (30 checkboxów w 3 kolumnach, wymagane zaznaczenie wszystkich poza ukrytym checkboxem-pułapką `Wyczyść wszystko`, który kasuje cały wybór) oraz tymczasowy `Step04Placeholder.vue`.
- **2026-11-24 (Krok 2: E-mail)**: Zaimplementowano `Step02Email.vue` oraz `emailValidation.ts` z 9 irytującymi regułami walidacji (format, >=50 znaków, chiński pies `狗`, >=3 cyfry o sumie 14, emotka, imię renifera, `XXIV`, zakaz małej litery `e`, domena `.pl`/`.ho`/`.xmas`) — reguły są ukryte i po kliknięciu przycisku pokazuje się tylko pierwszy niespełniony warunek — oraz tymczasowy `Step03Placeholder.vue`.

- **2026-11-24 (Krok 1 + Vue Router)**: Dodano `vue-router` (`createWebHashHistory` + strażnik kroków w `src/router/index.ts`) oraz zaimplementowano `Step01Credentials.vue` (username z 3-bębnowego jednorękiego bandyty + pojedyncze pole hasła wpisywanego wspak z efektem świeczki na kursorze, zapis w Pinia, respektowanie `devMode`) oraz tymczasowy `Step02Placeholder.vue`.
- **2026-11-24 (Tryb deweloperski — korekta 2)**: W `devMode` muzyka jest całkowicie zatrzymywana (`audioPlayer.stop()`), a przyciski przechodzenia dalej w krokach (`Step01Credentials`, `Step02Email`) pozostają zawsze aktywne bez spełniania walidacji.
- **2026-11-24 (Issue #2)**: Przekształcono widok startowy w Stronę Główną (`Step00Home.vue`) z przyciskami **Logowanie** (otwierającym reużywalny `KitschModal.vue` z komunikatem o braku kont i przyciskiem do rejestracji) oraz **Rejestracja** przenoszącym do pustego `Step01RegistrationPlaceholder.vue`; dodano skille `step-00-home` i `step-01-registration-placeholder` oraz testy.

- **2026-11-24 (Issue #1)**: Dodano głośną muzykę „Last Christmas” na wejściu (`FestiveAudioPlayer`), przycisk regulacji głośności w `ControlPanel.vue` oraz 10-sekundową mini-grę `VolumeBaubleGameModal.vue` z 20 bombkami (1–5%) i resetem do 100% przy ponownym otwarciu; dodano skill `control-volume-bauble-game` oraz testy jednostkowe.
- **2026-11-24 (Etap 0)**: Inicjalizacja projektu (`pnpm`, Vue 3, Vite 8, Tailwind CSS v4, Pinia, Vitest), rozbicie skilli na osobne pliki (`christmas-bad-ui`, `clarify-and-propose`, `step-00-welcome-placeholder`), panel kontrolny, duży kwadratowy kontener z widokiem placeholder, testy jednostkowe oraz workflow GitHub Pages i Gemini CLI.
