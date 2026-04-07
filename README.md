# 💎 AntiTestportal+ v1.0.0 OFFICIAL
> **SUPREME MASTER EDITION** | Najbardziej zaawansowane narzedzie edukacyjne do Testportal.

![Status](https://img.shields.io/badge/STATUS-UNDETECTED-brightgreen?style=for-the-badge&logo=shield)
![Version](https://img.shields.io/badge/version-1.0.0_OFFICIAL-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-PRO_VERSION-green?style=for-the-badge)

**AntiTestportal+** to zaawansowane narzędzie edukacyjne, zaprojektowane do bezpiecznego wspomagania procesu rozwiązywania testów na platformie Testportal. Wersja **1.0.0 Master** skupia się na stabilności, niewykrywalności i pełnej automatyzacji odpowiedzi.

---

## 📥 Przewodnik Użytkownika

### Instalacja (Dla Posiadaczy Builda)
1.  **Pobierz:** Pobierz plik **`AntiTestportal-Plus-v1.0.0.zip`** z sekcji Releases.
2.  **Wypakuj:** Wypakuj ZIP do folderu (np. na pulpicie).
3.  **Otwórz Chrome:** Przejdź do `chrome://extensions`.
4.  **Tryb Dewelopera:** Włącz suwak **"Tryb dewelopera"** (prawy górny róg).
5.  **Załaduj:** Kliknij **"Załaduj rozpakowane"** i wskaż wypakowany folder projektu.
6.  **Gotowe!** Ikonka "A" pojawi się na pasku. Po wejściu na test, system Ghost Shield aktywuje się automatycznie.

### Pierwsze Kroki
Po kliknięciu ikonki, zostaniesz poproszony o **Klucz Licencyjny**.
👉 Wpisz klucz otrzymany od administratora (**76mikus**), aby aktywować funkcje AI oraz Side Dock.

---

## 🛠️ Główne Funkcje (Supreme Master)

### 🛡️ Ghost Shield (Tryb Niewidzialny)
Chroni przed wykryciem przez mechanizmy anty-cheat platformy.
- Blokuje detekcję wyjścia z karty (blur).
- Blokuje wykrywanie zmiany okna i aplikacji.
- Działa w tle, nie wymagając uwagi użytkownika.
- **Inteligentny filtr wyłączeń:** Moduł automatycznie usypia się na stronach lobby (`LoadTestStart.html`) i podsumowaniach wyników, aby nie blokować normalnego funkcjowania serwisu.

### ❄️ Nielimitowany Czas (Time Freeze)
Zamraża licznik czasu na stronie egzaminu.
- Kliknij **"Nielimitowany Czas"** w panelu.
- Zegar zatrzyma się wizualnie na **99:99**.
- Po wyłączeniu, czas zostaje poprawnie zsynchronizowany, aby uniknąć błędów po stronie serwera.

### 🧠 Asystent "Auto-Solver" (Groq AI & Side Dock)
Zaawansowany system z wbudowaną potężną siecią neuronową (Llama 3.3 70B Engine), która samoczynnie odczytuje pytania.
- **Dynamiczne Rozwiązywanie Pytania:** Jeśli funkcja Asystenta AI jest włączona, wtyczka skanuje polecenie na teście, analizuje opcje, łączy się z Groq i w ułamku sekundy dodaje subtelny, pływający zielony znaczek (✔️) obok poprawnej odpowiedzi (lub wpisuje ghost-text dla pytań otwartych).
- **Tryby Fallback (Dock):** Jeśli chcesz wyszukać coś ręcznie, jednym kliknięciem przełączasz silnik na Google lub Perplexity w oknie wtyczki. Klasyczny boczny panel wysuwa się wtedy z prawego brzegu i pozwala na ręczne korzystanie.
- **Zarządzanie Widocznością:** Kiedy przełączysz na głównego Groqa, boczny panel znika całkowicie dla maksymalnej dyskrecji. Masz również skrót `Shift + Q` by przejść w **Panic Mode** - nikt z pleców nie zobaczy, że korzystasz ze wsparcia.

### 📂 Egzamin Dump (Archiwizacja pytań)
Wtyczka całkowicie po cichu zapisuje wszystkie pytania i wygenerowane poprawne odpowiedzi w trakcie pisania z włączonym Auto-Solverem w tle. 
- Pobierz wszystkie pytania w zwykłym czytelnym pliku `.txt` bez żadnych śladów jednym kliknięciem z panelu domowego. Idealne do tworzenia własnej bazy wiedzy.

### 🧹 Narzędzia Przeglądarki
- **Wyczyść Historię:** Szybkie usuwanie śladów i logów przeglądarki jednym kliknięciem z poziomu okna głównego wtyczki.

### ⌨️ Skróty Klawiszowe (Sterowanie)
| Skrót | Funkcja | Opis |
| :--- | :--- | :--- |
| **`Shift + Q`** | **Panic Mode** | Natychmiastowe ukrycie/pokazanie całego HUD i Docka |
| **`Shift + B`** | **Toggle Dock** | Pokazuje lub chowa boczny panel asystenta |
| **`Shift + E`** | **Freeze Time** | Włącza/wyłącza zatrzymanie czasu |
| `Shift + Y` | Quick Google | Otwiera wyszukiwanie Google w nowej karcie (Legacy) |
| `Shift + U` | Quick Perplexity | Otwiera Perplexity w nowej karcie (Legacy) |

---

## 💻 Dokumentacja Deweloperska (BUILD SYSTEM)

### Wymagania
- **Node.js**: v18+
- **NPM**: Menedżer pakietów
- **GitHub CLI (gh)**: Do obsługi automatycznych wydań (Releases)

### Komendy Budowania (Master Flow)
Wersja 1.0.0 wprowadza ujednolicony system budowania i automatycznej dystrybucji.

- **FULL MASTER BUILD & DEPLOY:**
  ```cmd
  build-all.bat
  ```
  Ten skrypt wykonuje pełny cykl produkcyjny:
  1. Czyści stare pliki builda.
  2. Kompiluje wtyczkę (`npm run build`).
  3. Wykonuje zaawansowaną obfuskację kodu (**Fortified Mode**).
  4. Tworzy oficjalne archiwum **`AntiTestportal-Plus-v1.0.0.zip`**.
  5. Wysyła kod na GitHub i automatycznie aktualizuje (nadpisuje) oficjalny **Release v1.0.0**.

---

## ❓ FAQ

**Q: Błąd "Extension context invalidated".**
A: Odśwież stronę testu (F5). Dzieje się tak po aktualizacji wtyczki w tle.

**Q: Nie działa na stronie panelu nauczyciela.**
A: To celowe. Wtyczka działa tylko na stronach egzaminu (`/exam/`), aby nie powodować konfliktów.

---

## ⚖️ Nota Prawna & Prawa Autorskie

**Właścicielem praw autorskich do projektu jest: Mikuś (mi1ku / 76mikus).**

> 🛒 **ZAKUP / UZYSKANIE KLUCZA:**
> Aby uzyskać pełen dostęp, własny klucz licencyjny lub wypróbować wtyczkę - napisz do autora:
> 👉 **[instagram.com/76mikus](https://www.instagram.com/76mikus/)**

Niniejsze oprogramowanie ("AntiTestportal+") zostało stworzone **wyłącznie w celach edukacyjnych** oraz do analizy zagadnień z zakresu cyberbezpieczeństwa i testowania penetracyjnego aplikacji webowych. Projekt ma na celu demonstrację luk w zabezpieczeniach systemów egzaminowania online.

1.  **Odpowiedzialność:** Autor projektu nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody wyrządzone przez użytkowników oprogramowania ani za wykorzystanie go w sposób niezgodny z prawem lub regulaminem placówek edukacyjnych/egzaminacyjnych. Użytkownik korzysta z oprogramowania na własne ryzyko.
2.  **Prawa Autorskie:** Zgodnie z ustawą z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych (Dz.U. 1994 nr 24 poz. 83 z późn. zm.), kopiowanie, modyfikowanie, rozpowszechnianie lub wykorzystywanie kodu źródłowego (w całości lub części) bez wyraźnej, pisemnej zgody autora (**76mikus**) jest surowo zabronione.
3.  **Licencja:** Użytek dozwolony wyłącznie do celów prywatnych, niezwiązanych z osiąganiem korzyści majątkowych, chyba że uzyskano inną licencję od autora. Odsprzedaż wtyczki pod inną nazwą jest surowo zabroniona.

---
**© 2026 Mikuś (mi1ku Systems). Wszelkie prawa zastrzeżone.** 🏙️🛡️🚀
