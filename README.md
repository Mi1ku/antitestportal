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

## 🛠️ Główne Funkcje

### 🛡️ Ghost Shield (v2.0)
Chroni przed wykryciem przez mechanizmy anty-cheat platformy Testportal.
- Blokuje detekcję wyjścia z karty (blur).
- Blokuje wykrywanie zmiany okna i aplikacji.
- **Inteligentny filtr wyłączeń:** Moduł automatycznie usypia się na stronach lobby oraz podsumowaniach wyników, aby uniknąć wykrycia korelacyjnego.

### 🧠 AI Auto-Solver (Llama 3.3 70B Engine)
Zaawansowany system z wbudowaną potężną siecią neuronową, która samoczynnie odczytuje pytania.
- **Dynamiczne Rozwiązywanie:** System skanuje polecenia, analizuje opcje i w ułamku sekundy dodaje subtelny zielony znaczek (✔️) obok poprawnej odpowiedzi.
- **Panic Mode:** Skrót `Shift + Q` natychmiast ukrywa wszystkie ślady działania wtyczki przed osobami trzecimi.

### 📂 Egzamin Dump (Archiwizacja pytań)
Wtyczka po cichu zapisuje wszystkie pytania i wygenerowane odpowiedzi w trakcie pisania z włączonym Auto-Solverem. 
- Pobierz całą bazę testu w czystym pliku `.txt` jednym kliknięciem z panelu domowego.

---

## 💻 Dokumentacja Deweloperska (BUILD SYSTEM)

### Wymagania
- **Node.js**: v18+
- **NPM**: Menedżer pakietów
- **GitHub CLI (gh)**: Do obsługi automatycznych wydań (Releases)

### Komendy Budowania (Master Flow)
Wersja 1.0.0 wprowadza ujednolicony system budowania i automatycznej dystrybucji.

- **Development (Hot Reload):**
  ```bash
  npm run dev
  ```
  Uruchamia serwer developerski Plasmo.

- **FULL MASTER BUILD & DEPLOY:**
  ```cmd
  build-all.bat
  ```
  **Najważniejsza komenda.** Ten skrypt wykonuje pełny cykl produkcyjny:
  1. Czyści stare pliki builda.
  2. Kompiluje wtyczkę (`npm run build`).
  3. Wykonuje zaawansowaną obfuskację kodu (**Fortified Mode**).
  4. Tworzy oficjalne archiwum **`AntiTestportal-Plus-v1.0.0.zip`**.
  5. Wysyła kod na GitHub i automatycznie aktualizuje (nadpisuje) oficjalny **Release v1.0.0** z profesjonalnym opisem.

---

## ⚖️ Nota Prawna & Prawa Autorskie

**Właścicielem praw autorskich do projektu jest: Mikuś (mi1ku / 76mikus).**

> 🛒 **ZAKUP / UZYSKANIE KLUCZA:**
> Aby uzyskać pełen dostęp, własny klucz licencyjny lub wypróbować wtyczkę - napisz do autora:
> 👉 **[instagram.com/76mikus](https://www.instagram.com/76mikus/)**

Niniejsze oprogramowanie ("AntiTestportal+") zostało stworzone **wyłącznie w celach edukacyjnych** oraz do analizy zagadnień z zakresu cyberbezpieczeństwa. Projekt ma na celu demonstrację luk w zabezpieczeniach systemów egzaminowania online.

1.  **Odpowiedzialność:** Autor projektu nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody wyrządzone przez użytkowników oprogramowania ani za wykorzystanie go w sposób niezgodny z prawem lub regulaminem placówek edukacyjnych. Użytkownik korzysta z oprogramowania na własne ryzyko.
2.  **Prawa Autorskie:** Zgodnie z ustawą z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych (Dz.U. 1994 nr 24 poz. 83 z późn. zm.), kopiowanie, modyfikowanie, rozpowszechnianie lub wykorzystywanie kodu źródłowego (w całości lub części) bez wyraźnej, pisemnej zgody autora (**76mikus**) jest surowo zabronione.
3.  **Licencja:** Użytek dozwolony wyłącznie do celów prywatnych. Odsprzedaż wtyczki lub redystrybucja pod inną nazwą bez zgody autora podlega odpowiedzialności karnej.

---
**© 2026 mi1ku Systems. Wszelkie prawa zastrzeżone.** 🏙️🛡️🚀
