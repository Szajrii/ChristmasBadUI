---
name: christmas-bad-ui
description: Konwencje, architektura i zasady tworzenia kiczowatych, irytujących kroków formularza w projekcie ChristmasBadUI (pnpm + Vue 3 + Vite 8 + Tailwind CSS v4 + Pinia + Vitest).
---

# Skill: ChristmasBadUI — Architektura i Konwencje

Ten skill opisuje ogólne zasady budowy projektu **ChristmasBadUI**. Poszczególne widoki/formularze mają własne, dedykowane skille w katalogu `.agents/skills/` (np. `step-00-welcome-placeholder`, `step-01-...`).

## 1. Wizja i styl (Bad Christmas UI)

- **Cel**: Wieloetapowy (kilkanaście+ okien) świąteczny formularz rejestracyjny, w którym przejście do kolejnego kroku wymaga poprawnego ukończenia poprzedniego.
- **Estetyka**: Maksymalny świąteczny kicz w stylu stron z przełomu lat 90./2000. (GeoCities / Windows 98) — proste, kanciaste okna z wypukłymi ramkami 3D (`retro-bevel`, `border-double`), krzykliwe podstawowe kolory (`#ff0000`, `#008000`, `#ffff00`, `#00ff00`), paski jak laska cukrowa, migające lampki, padający śnieg, przesuwający się pasek `marquee`, `Comic Sans MS` — bez nowoczesnego glassmorphizmu i zaokrągleń.
- **UX**: Celowo utrudniony, skomplikowany i wkurzający (np. uciekające przyciski, suwaki zamiast inputów, losowo przestawiające się litery, świąteczne zagadki, przeszkadzający Mikołaj), **ale zawsze możliwy do przejścia i deterministycznie testowalny**.

## 2. Stack technologiczny i menedżer pakietów

- **Menedżer pakietów**: **wyłącznie `pnpm`** (nie używaj `npm` ani `yarn`, nie generuj `package-lock.json`).
- **Vue 3** (`<script setup lang="ts">`)
- **Vite 8** (konfiguracja w `vite.config.ts`)
- **Tailwind CSS v4** (`@tailwindcss/vite`, konfiguracja stylów i tokenów w `src/style.css` przez `@theme`)
- **Pinia** (zarządzanie stanem kroków, postępem rejestracji i ustawieniami panelu kontrolnego w `src/stores/registrationStore.ts`)
- **Vue Router** (`createWebHashHistory`, definicja tras i strażnika kroków w `src/router/index.ts`, ścieżki `path` w `src/steps/stepRegistry.ts`)
- **Vitest + @vue/test-utils + jsdom** (proste testy jednostkowe w `src/__tests__/`)
- **Hosting**: GitHub Pages (statyczny build, zmienna `BASE_PATH=/ChristmasBadUI/` w CI).

## 3. Architektura i modularność

Zachowuj ścisły podział odpowiedzialności, aby elementy były maksymalnie reużywalne:

- `src/components/ui/` — małe, reużywalne klocki UI (`KitschButton`, `KitschCard`, `ChristmasLights`, `SnowfallOverlay`, przyszłe irytujące inputy, liczniki, modale).
- `src/components/layout/` — szkielet aplikacji:
  - `ControlPanel.vue` — górny panel kontrolny (przełączniki efektów, pasek postępu, przyszłe kontrolki/debug).
  - `StageContainer.vue` — duży, kwadratowy główny kontener centralny, do którego dynamicznie ładowany jest aktywny krok formularza.
- `src/steps/` — niezależne kroki formularza rejestracyjnego:
  - Każdy krok to osobny komponent Vue, np. `Step01Email.vue`, `Step02Password.vue`.
  - Każdy krok jest rejestrowany w `src/steps/stepRegistry.ts` jako obiekt typu `RegistrationStepDefinition` (`src/types/step.ts`).
- `src/stores/registrationStore.ts` — jedyne źródło prawdy o aktualnym kroku, ukończonych krokach, danych użytkownika (`formData`) oraz ustawieniach panelu kontrolnego (`settings`).

## 4. Kontrakt dodawania nowego kroku formularza (i osobnego skilla!)

Gdy dodajesz nowy krok/widok (np. w ramach kolejnego etapu lub GitHub Issue):

1. Jeśli wymagania są niejasne — najpierw zastosuj skill **`.agents/skills/clarify-and-propose/SKILL.md`**!
2. Utwórz komponent `src/steps/StepXXNazwa.vue` korzystając z reużywalnych komponentów w `src/components/ui/`.
3. **Obsługa trybu deweloperskiego (`store.devMode`)**: gdy `store.devMode === true`, wyłączana jest muzyka (i przyszłe dźwięki), odblokowywane są wszystkie kroki w routerze, a przycisk przejścia do kolejnego kroku w każdym formularzu jest zawsze aktywny (umożliwia przejście dalej bez spełnienia walidacji); animacje i mechaniki wizualne/UX pozostają aktywne do celów testowych.
4. Po spełnieniu warunku walidacji wywołaj `store.completeStep(stepId, payload)`.
4. Zarejestruj krok w `src/steps/stepRegistry.ts`.
5. Utwórz **osobny skill dla tego widoku** w `.agents/skills/step-XX-nazwa/SKILL.md` (wzór: `step-00-welcome-placeholder/SKILL.md`) z opisem mechaniki, warunku zaliczenia, użytych komponentów i ewentualnych pułapek.
6. Dopisz 1–3 proste testy jednostkowe w `src/__tests__/` sprawdzające warunek zaliczenia kroku.
7. **Zaktualizuj `docs/PROJECT_SPEC.md`** (tabela kroków, tabela skilli, historia zmian).

## 5. Zasady weryfikacji przed oddaniem zadania

Przed zakończeniem pracy lub wystawieniem PR uruchom:
```bash
pnpm test
pnpm run build
```
Oba polecenia muszą zakończyć się bez błędów.
