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
- **Inteligentny filtr wyłączeń:** Moduł automatycznie usypia się na stronach lobby (`LoadTestStart.html`) i podsumowaniach wyników (`test-result.html`), aby nie blokować normalnego funkcjowania serwisu.

### ❄️ Nielimitowany Czas (Time Freeze)
Zamraża licznik czasu na stronie egzaminu.
- Kliknij **"Nielimitowany Czas"** w panelu.
- Zegar zatrzyma się wizualnie na **99:99**.
- Po wyłączeniu, czas zostaje poprawnie zsynchronizowany, aby uniknąć błędów po stronie serwera.

### 🧠 Asystent "Supreme AI Cortex" (Auto-Clicker & Side Dock)
Zaawansowany panel boczny z wbudowaną siecią neuronową (Google Gemini 1.5 Flash), która samoczynnie odczytuje pytania.
- **Dynamiczne Rozwiązywanie Pytania:** Jeśli funkcja 'Auto-Answer Genius' jest włączona, wtyczka skanuje polecenie na teście, analizuje opcje, łączy się z modelem językowym i w ułamku sekundy automatycznie klika prawidłową odpowiedź otaczając ją zieloną poświatą.
- **Wbudowane Klucze API:** Proces uwierzytelniania sztucznej inteligencji jest wbudowany prosto w narzędzie podczas budowania rozszerzenia. Zwykły Użytkownik nie musi zakładać żadnych płatnych/bezpłatnych kont. 
- **Google & Perplexity:** Dla starszych trybów "darmowych", oba silniki wyszukiwania ładują się do bocznej ramki z funkcjonalnym panelem i możliwością kopiowania jednym prostym kliknięciem.
- **Zarządzanie Widocznością:** Panel możesz w każdej chwili całkowicie ukryć za pomocą HUD'a. Użyj skrótu `Shift + Q` by przejść w **Panic Mode** - nikt z pleców nie zobaczy, że korzystasz ze wsparcia.

### 🧹 Narzędzia Przeglądarki
- **Wyczyść Historię:** Szybkie usuwanie śladów i logów przeglądarki jednym kliknięciem z poziomu okna głównego wtyczki.

### 🔄 Auto-Aktualizacje (CI/CD)
Wtyczka posiada wbudowany system sprawdzania powiadomień połączony bezpośrednio z repozytorium GitHub.
- **Powiadomienia in-app:** Jeśli wyjdzie nowa wersja, automatycznie zobaczysz czerwony pasek w oknie wtyczki z banerem i przyciskiem do pobrania.
- **Zero-touch Release:** Każdy "push" na GitHuba buduje, pakuje i uaktualnia wtyczkę generując zawsze najnowszą zaktualizowaną wersję w zakładce Releases.

### ⌨️ Skróty Klawiszowe (Sterowanie)
| Skrót | Funkcja | Opis |
| :--- | :--- | :--- |
| **`Shift + Q`** | **Panic Mode** | Natychmiastowe ukrycie/pokazanie całego HUD i Docka |
| **`Shift + B`** | **Toggle Dock** | Pokazuje lub chowa boczny panel asystenta |
| **`Shift + E`** | **Freeze Time** | Włącza/wyłącza zatrzymanie czasu |
| `Shift + Y` | Quick Google | Otwiera wyszukiwanie Google w nowej karcie (Legacy) |
| `Shift + U` | Quick Perplexity | Otwiera Perplexity w nowej karcie (Legacy) |

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

## ⚖️ Nota Prawna & Prawa Autorskie

**Właścicielem praw autorskich do projektu jest: Mikuś (mi1ku).**

> 🛒 **ZAKUP / UZYSKANIE KLUCZA DO WTYCZKI:**
> Aby uzyskać pełen dostęp jako użytkownik, zdobyć własny klucz licencyjny lub wypróbować wtyczkę - napisz do mnie na Instagramie:
> 👉 **[instagram.com/76mikus](https://www.instagram.com/76mikus/)**

Niniejsze oprogramowanie ("AntiTestportal+") zostało stworzone **wyłącznie w celach edukacyjnych** oraz do nauki i analizy zagadnień z zakresu cyberbezpieczeństwa i testowania penetracyjnego aplikacji webowych. Projekt ma na celu demonstrację luk w zabezpieczeniach systemów egzaminowania online.

1.  **Odpowiedzialność:** Autor projektu nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody wyrządzone przez użytkowników oprogramowania ani za wykorzystanie go w sposób niezgodny z prawem lub regulaminem placówek edukacyjnych/egzaminacyjnych. Użytkownik korzysta z oprogramowania na własne ryzyko.
2.  **Prawa Autorskie:** Zgodnie z ustawą z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych (Dz.U. 1994 nr 24 poz. 83 z późn. zm.), kopiowanie, modyfikowanie, rozpowszechnianie lub wykorzystywanie kodu źródłowego (w całości lub części) bez wyraźnej, pisemnej zgody autora jest zabronione i podlega karze.
3.  **Licencja:** Użytek dozwolony wyłącznie do celów prywatnych, niezwiązanych z osiąganiem korzyści majątkowych, chyba że uzyskano inną licencję od autora. Odsprzedaż wtyczki pod inną nazwą jest surowo zabroniona.

---

**© 2026 Mikuś (mi1ku Systems). Wszelkie prawa zastrzeżone.**
