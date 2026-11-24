---
name: Nowy krok formularza (ChristmasBadUI)
about: Deleguj utworzenie nowego, kiczowatego i irytującego kroku formularza
title: "[Krok XX] "
labels: gemini-task
---

## Cel kroku
<!-- Co użytkownik musi wpisać/zrobić w tym oknie? np. Wpisanie imienia, hasła, numeru telefonu -->

## Na czym polega kicz / utrudnienie UX?
<!-- Opisz irytującą mechanikę oraz świąteczne motywy (śnieg, Mikołaj, choinka, renifery...) -->

## Warunek przejścia do kolejnego kroku
<!-- Kiedy krok zostaje uznany za zaliczony? -->

## Czy agent ma najpierw zadać pytania, czy ma wolną rękę?
<!-- Np. "Najpierw zaproponuj 2-3 warianty i zadaj pytania" albo "Masz wolną rękę, wybierz najlepszą opcję i zrób PR" -->

## Wymagania techniczne
- [ ] Menedżer pakietów: wyłącznie `pnpm`
- [ ] Reużywalne elementy wydzielone do `src/components/ui/`
- [ ] Krok zarejestrowany w `src/steps/stepRegistry.ts`
- [ ] Osobny skill dla widoku w `.agents/skills/step-XX-<nazwa>/SKILL.md`
- [ ] Proste testy jednostkowe w `src/__tests__/` (`pnpm test`)
- [ ] Zaktualizowany dokument `docs/PROJECT_SPEC.md`
