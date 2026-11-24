---
name: clarify-and-propose
description: Zasady zadawania pytań doprecyzowujących i proponowania własnych kreatywnych rozwiązań użytkownikowi, gdy zadanie lub GitHub Issue jest niejasne lub niepełne.
---

# Skill: Doprecyzowanie niejasnych zadań i proponowanie rozwiązań

Używaj tego skilla **zawsze**, gdy zadanie od użytkownika (na czacie lub w GitHub Issue) jest ogólne, niejednoznaczne albo pozostawia pole do interpretacji (np. *„zrób krok z hasłem"*, *„dodaj coś wkurzającego w panelu kontrolnym"*, *„zrób 2 nowe okna"*).

## Kiedy przerwać i zapytać przed pisaniem kodu?

Zadaj pytania zanim zaczniesz implementację, jeśli brakuje którejś z kluczowych informacji:
- Jakie dokładnie dane ma zebrać krok i jaki jest warunek jego zaliczenia?
- Jak bardzo irytująca/trudna ma być mechanika (lekki żart vs ekstremalna frustracja)?
- Czy dany element ma wpływać na inne kroki albo panel kontrolny?
- Czy istnieje konkretny motyw świąteczny, na którym zależy użytkownikowi (Mikołaj, choinka, karp, renifery, kolędy, śnieg)?

## Jak powinna wyglądać lista pytań i propozycji?

1. **Krótka, numerowana lista pytań** (zwykle 3–5 konkretnych pytań, bez lania wody).
2. **Proaktywne propozycje od agenta**:
   - Przy każdym pytaniu lub jako osobna sekcja **zaproponuj własne, kreatywne pomysły** (np. 2–3 warianty: *Opcja A*, *Opcja B*, *Opcja C*).
   - Zaznacz swoją **rekomendację**, krótko uzasadniając dlaczego pasuje do kiczowatego klimatu **ChristmasBadUI** i reużywalnej architektury.
3. **Wskazanie domyślnego planu** — napisz wyraźnie, że czekasz na odpowiedzi użytkownika, a po ich otrzymaniu (lub jeśli użytkownik napisze „wybierz sam") natychmiast wdrożysz ustaloną wersję.

## Przykład zachowania na GitHub Issues (zdalny agent)

Jeśli pracujesz jako agent uruchomiony z GitHub Issue i opis Issue jest zbyt ogólnikowy:
- **Nie zgaduj w ciemno całego dużego ficzera**, tylko dodaj komentarz pod Issue z listą pytań oraz Twoimi propozycjami rozwiązań (Opcja A / B / C).
- Poproś użytkownika o odpowiedź w komentarzu (np. z `@gemini-cli`), abyś mógł ruszyć z implementacją dokładnie tego, czego chce.
- Jeśli jednak użytkownik wyraźnie napisał w Issue *„zaproponuj i zrób od razu"* lub *„masz wolną rękę"*, wybierz najlepszą propozycję, opisz ją w PR i wdróż ją od razu.
