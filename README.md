# 💎 AntiTestportal+ v1.0

![Status](https://img.shields.io/badge/STATUS-UNDETECTED-brightgreen?style=for-the-badge&logo=shield)
![Version](https://img.shields.io/badge/version-1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**AntiTestportal+** to zaawansowane narzędzie edukacyjne, zaprojektowane do bezpiecznego wspomagania procesu rozwiązywania testów na platformie Testportal. Wersja **1.0** skupia się na stabilności, niewykrywalności i prostocie obsługi.

---

## 📥 Przewodnik Użytkownika

### Instalacja
1.  **Pobierz:** Otrzymasz plik `AntiTestportal-v1.0.zip`. Wypakuj go do folderu na pulpicie.
2.  **Otwórz Chrome:** Przejdź do `chrome://extensions`.
3.  **Tryb Dewelopera:** Włącz suwak **"Tryb dewelopera"** (prawy górny róg).
4.  **Załaduj:** Kliknij **"Załaduj rozpakowane"** i wskaż wypakowany folder.
5.  **Gotowe!** Ikonka "A" pojawi się na pasku.

### Pierwsze Kroki
Po kliknięciu ikonki, zostaniesz poproszony o **Klucz Licencyjny**.
👉 Wpisz klucz otrzymany od administratora, aby aktywować funkcje.

---

## 🛠️ Główne Funkcje

### 🛡️ Ghost Shield (Tryb Niewidzialny)
Chroni przed wykryciem przez mechanizmy anty-cheat platformy.
- Blokuje detekcję wyjścia z karty (blur).
- Blokuje wykrywanie zmiany okna.
- Działa w tle, nie wymagając uwagi użytkownika.

### ❄️ Nielimitowany Czas (Time Freeze)
Zamraża licznik czasu na stronie egzaminu.
- Kliknij **"Nielimitowany Czas"** w panelu.
- Zegar zatrzyma się wizualnie na **99:99**.
- Po wyłączeniu, czas zostaje poprawnie zsynchronizowany, aby uniknąć błędów po stronie serwera.

### 🔎 Smart Search (Panel Wyszukiwania)
Szybkie wyszukiwanie treści pytań.
- Automatycznie wykrywa treść pytania.
- Dwa przyciski: **Google** i **Perplexity AI**.
- Wyniki otwierają się w dyskretnym oknie (popup), omijając zabezpieczenia strony.

---

## 💻 Przewodnik dla Deweloperów

Sekcja przeznaczona dla osób chcących rozwijać projekt lub kompilować go ze źródeł.

### Wymagania
- **Node.js**: v16+
- **PNPM / NPM**: Menedżer pakietów
- **PowerShell**: Do skryptów wydawniczych (Windows)

### Instalacja Środowiska
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-repo/antitestportal.git
   cd antitestportal/wtyczka
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   # lub
   pnpm install
   ```

### Komendy Budowania
- **Development (Hot Reload):**
  ```bash
  npm run dev
  ```
  Uruchamia serwer developerski Plasmo. Zmiany w kodzie są natychmiast widoczne w przeglądarce.

- **Produkcja (Build):**
  ```bash
  npm run build
  ```
  Tworzy zoptymalizowaną, zminimalizowaną wersję wtyczki w folderze `build/chrome-mv3-prod`.
  Skrypt automatycznie wykonuje obfusjację kodu (javascript-obfuscator).

- **Pakowanie (Release):**
  ```powershell
  ./pack_release.ps1
  ```
  Skrypt PowerShell, który:
  1. Usuwa stare archiwa ZIP.
  2. Uruchamia `npm run build`.
  3. Kopiuje README.md.
  4. Tworzy gotową paczkę `AntiTestportal-v1.0.zip`.

### Struktura Projektu
- `src/popup.tsx`: Główny interfejs UI (React).
- `src/contents/`: Skrypty wstrzykiwane (Content Scripts).
  - `testportal-anti-tamper.tsx`: Główna logika Ghost Shield i Time Freeze.
  - `isolated-relay.ts`: Komunikacja ze światem zewnętrznym (Isolated World).
- `src/hooks/`: Hooki React (zarządzanie stanem, config).

---

## ❓ FAQ

**Q: Błąd "Extension context invalidated".**
A: Odśwież stronę testu (F5). Dzieje się tak po aktualizacji wtyczki w tle.

**Q: Nie działa na stronie panelu nauczyciela.**
A: To celowe. Wtyczka działa tylko na stronach egzaminu (`/exam/`), aby nie powodować konfliktów.

---

## ⚠️ Disclaimer

Oprogramowanie służy wyłącznie do celów edukacyjnych i testowania zabezpieczeń własnych systemów. Autor nie ponosi odpowiedzialności za użycie niezgodne z regulaminem placówek edukacyjnych.

---

**Created by mi1ku Systems 2026.**
