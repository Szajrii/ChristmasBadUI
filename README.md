# 🎅 ChristmasBadUI 🎄

Kiczowaty, celowo trudny i wkurzający wieloetapowy świąteczny formularz rejestracyjny, budowany etapami w **pnpm + Vue 3 + Vite 8 + Tailwind CSS v4 + Pinia + Vitest**.

## Dokumentacja projektu
- [Plan działania i żywa specyfikacja](docs/PROJECT_SPEC.md)
- [Instrukcje dla agentów AI](AGENTS.md)
- Skille projektu (każdy widok/temat ma własny plik w `.agents/skills/`):
  - [Architektura i konwencje](.agents/skills/christmas-bad-ui/SKILL.md)
  - [Doprecyzowanie niejasnych zadań i propozycje](.agents/skills/clarify-and-propose/SKILL.md)
  - [Krok 00 — Świąteczny Start (Placeholder)](.agents/skills/step-00-welcome-placeholder/SKILL.md)
- [Konfiguracja GitHub Pages i zdalnych agentów Gemini](docs/GITHUB_AGENTS_GUIDE.md)

## Szybki start (`pnpm`)
```bash
pnpm install
pnpm dev
```

## Testy i build
```bash
pnpm test
pnpm run build
```
