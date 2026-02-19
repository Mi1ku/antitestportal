# 💎 AntiTestportal v1.1 💎

![Status](https://img.shields.io/badge/STATUS-UNDETECTED-brightgreen?style=for-the-badge&logo=shield)
![Version](https://img.shields.io/badge/version-1.1-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/security-Firebase--Cloud-red?style=for-the-badge&logo=firebase)

**AntiTestportal** to nowoczesne i skuteczne narzędzie do omijania zabezpieczeń platformy Testportal. Wersja 1.1 została zaprojektowana z myślą o prostocie użycia i maksymalnym bezpieczeństwie.

---

## 🚀 PORADNIK DLA UŻYTKOWNIKA (Instalacja)

Jeśli zakupiłeś klucz licencyjny, postępuj zgodnie z poniższą instrukcją:

1.  **Pobierz wtyczkę:** Otrzymasz plik `.zip` z najnowszą wersją. Wypakuj go do dowolnego folderu na pulpicie.
2.  **Otwórz Chrome:** Wpisz w pasku adresu `chrome://extensions`.
3.  **Włącz Tryb Dewelopera:** Przełącznik znajduje się w prawym górnym rogu ekranu.
4.  **Załaduj wtyczkę:** Kliknij przycisk **"Załaduj rozpakowane"** i wybierz folder, który wypakowałeś w kroku 1.
5.  **Gotowe!** Ikonka "ANTI" pojawi się na pasku.

Po kliknięciu w ikonkę, zostaniesz poproszony o podanie klucza.
👉 **Wpisz klucz, który otrzymałeś na Instagramie od [`76mikus`](https://www.instagram.com/76mikus/).**
*(Uwaga: Każdy klucz ma limit urządzeń!)*

---

## 👻 FUNKCJE (Co to potrafi?)

### 🛡️ Ghost Shield (Niewykrywalność)
Wtyczka automatycznie blokuje próby wykrycia Twojej aktywności przez Testportal.
- Nie wykrywa wyjścia z karty ("Uczciwy Rozwiązywacz").
- Nie wykrywa utraty focusu.
- Działa w tle od razu po zalogowaniu.

### ❄️ Nielimitowany Czas (Nuclear Timer)
Gdy czas się kończy, włącz ten tryb, aby zyskać nieskończoność.
- W panelu wtyczki kliknij **"Nielimitowany Czas"**.
- Zegar systemowy zostanie nadpisany, a licznik pokaże **99 godz. 99 min. 99 sek.**
- **Pamiętaj:** Używaj z głową! Nie trzymaj włączonego przez godzinę.

### 📚 Wbudowany Poradnik
Masz wątpliwości? Wtyczka posiada teraz wbudowaną zakładkę **HELP**, gdzie znajdziesz szybkie instrukcje obsługi bezpośrednio w panelu.

### 🤖 Auto-Answer Genius (AI & Google)
Wtyczka potrafi dyskretnie wyświetlać podpowiedzi bezpośrednio pod pytaniem.
- **Wybór Silnika:** W zakładce SYSTEM możesz wybrać **Google** lub **Perplexity AI**.
- Skrót **CTRL + Z**: Wyszukaj w Google.
- Skrót **CTRL + SHIFT + Z**: Zapytaj sztuczną inteligencję (Perplexity).

---

## 💻 DOKUMENTACJA TECHNICZNA (Dla Developerów)

Sekcja przeznaczona dla osób chcących rozwijać projekt lub skompilować go samodzielnie ze źródeł.

### ⚙️ Wymagania
- **Node.js**: v16 lub nowszy
- **NPM / PNPM / Yarn**: Menedżer pakietów
- **PowerShell**: Do skryptów budujących (Windows)

### 📥 Instalacja Środowiska
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-repo/antitestportal.git
   cd antitestportal/wtyczka
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```

### 🔧 Konfiguracja Firebase
Projekt wymaga własnej bazy danych Firebase Realtime Database.
1. Utwórz projekt w konsoli Firebase.
2. Skopiuj dane konfiguracyjne (API Key, Project ID itp.).
3. Podmień konfigurację w pliku: `src/hooks/use-database.ts`.

### 🔨 Budowanie i Rozwój
- **Tryb Development (Hot Reload):**
  Uruchamia serwer developerski z nasłuchiwaniem zmian.
  ```bash
  npm run dev
  ```
- **Budowanie Produkcyjne:**
  Kompiluje wtyczkę do folderu `build/chrome-mv3-prod`.
  ```bash
  npm run build
  ```
- **Pakowanie Release (.zip):**
  Automatyczny skrypt tworzący gotową paczkę dla użytkownika (`AntiTestportal-v1.0.zip`).
  ```powershell
  ..\pack_release.ps1
  ```

### 🔍 Skróty Klawiszowe (Power User)
| Skrót | Funkcja |
| :--- | :--- |
| **Ctrl + Z** | Szybkie szukanie pytania w Google (nowa karta/okno) |
| **Ctrl + Shift + Z** | Szybkie szukanie pytania w Perplexity AI |

---

**Created by mi1ku Systems 2026.**
*Wszelkie prawa zastrzeżone.*
