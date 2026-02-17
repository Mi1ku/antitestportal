# 🦍 Shield Ultra Enterprise v9.5.0

### **Złoty Standard w Technologii Stealth dla TestPortal.**

Shield Ultra to profesjonalna wtyczka do przeglądarki zaprojektowana w celu zapewnienia całkowitej niewykrywalności i automatyzacji podczas egzaminów na platformie TestPortal.pl. Łącząc zaawansowane maskowanie prototypów (Prototype Poisoning) z filtracją ruchu sieciowego, Shield Ultra omija systemy "Uczciwy Rozwiązujący" oraz śledzenie fokusu ze 100% skutecznością.

---

## 💎 FUNKCJE PREMIUM

- **Nuclear Focus Persistence**: Wykorzystuje mechanizm `ReferenceError`, aby natychmiastowo "wywalić" skrypty śledzące Testportalu przy ich starcie.
- **Ghost Network Protocol**: Przechwytuje i blokuje zapytania `sendBeacon` oraz `fetch`, dzięki czemu raporty o "oszustwach" nigdy nie docierają do nauczyciela.
- **Honest Respondent Killer**: Siłowo nadpisuje wewnętrzne obiekty Testportalu, aby serwer zawsze widział stan "Uczciwy Rozwiązujący".
- **AI Solver Integration**: Błyskawiczne odpowiedzi AI pod skrótem klawiszowym bezpośrednio na tekście pytania.
- **Dynamic Cloud Logic**: Automatyczna synchronizacja najnowszego silnika z Twojego GitHuba przy każdym odświeżeniu strony.

---

## 📖 INSTRUKCJA INSTALACJI (KROK PO KROKU)

### 🛠️ KROK 1: Konfiguracja Twojego "Serca" na GitHubie
Wtyczka pobiera logikę z chmury, abyś nie musiał jej przeinstalowywać przy każdej aktualizacji.
1. Wrzuć zawartość folderu `serce-github` (plik `engine.js` oraz `ui_config.json`) na swoje repozytorium GitHub.
2. Skopiuj link "Raw" do swojego pliku `engine.js` (powinien zaczynać się od `raw.githubusercontent.com`).
3. Otwórz plik `wtyczka/bypass/shield.js` na swoim komputerze i wklej ten link w stałej `GITHUB_RAW_URL`.
4. To samo zrób w `wtyczka/popup/popup.js` dla zmiennej `UI_CONFIG_URL`.

### 📂 KROK 2: Instalacja w przeglądarce
1. Otwórz Chrome i przejdź do: `chrome://extensions/`.
2. Włącz **Tryb Dewelopera** (Developer Mode) w prawym górnym rogu.
3. Kliknij **Załaduj rozpakowane** (Load Unpacked).
4. Wybierz folder o nazwie `wtyczka` z Twojego projektu.

### 🔑 KROK 3: Aktywacja
1. Kliknij w ikonę wtyczki na pasku rozszerzeń.
2. Wprowadź klucz licencyjny (Domyślny testowy: `TRIAL-2026`).
3. Po aktywacji powinieneś zobaczyć błękitny panel sterowania.

---

## 🚀 PORADNIK OPERACYJNY (UŻYCIE)

- **Zmiana okien/kart**: Możesz swobodnie wychodzić z karty testu do innych aplikacji. System będzie raportował Twój stan jako "Aktywny i Skupiony" przez cały czas.
- **Szybkie Szukanie**:
    - <kbd>CTRL</kbd> + **Kliknięcie** na pytanie: Błyskawiczne wyszukiwanie w Google (nowa karta).
    - <kbd>ALT</kbd> + **Kliknięcie** na pytanie: Odpowiedź przez AI Solver (Perplexity).
- **Bezpieczeństwo**: Przed każdym nowym testem kliknij przycisk **"WYCZYŚĆ ŚLADY (ANTI-DETECT)"** w menu wtyczki. To wyczyści cookies i historię Testportalu.

---

## 🛠️ ARCHITEKTURA BYPASSU

Shield Ultra działa na trzech niezależnych poziomach:
1. **Warstwa Manifestu (CSP Strip)**: Używamy `declarativeNetRequest` do usuwania nagłówków zabezpieczeń Testportalu, co pozwala na wstrzykiwanie dowolnego kodu.
2. **Warstwa Sieciowa (Ghost Network)**: Service Worker w tle filtruje pakiety telemetryczne, neutralizując raporty wysyłane do serwerów Testportalu.
3. **Warstwa Logiki (JS Engine)**: Silnik wstrzykiwany do strony "oślepia" skrypty proktorujące poprzez zamrożenie stanów fokusu i widoczności.

---

## ⚖️ NOTA PRAWNA
Oprogramowanie stworzone wyłącznie w celach edukacyjnych i badawczych. Twórcy nie biorą odpowiedzialności za niewłaściwe użycie lub konsekwencje wynikające z korzystania z tego narzędzia. 

---
*Sprzedaż i Wsparcie:*
Instagram: [**@76mikus**](https://www.instagram.com/76mikus/)
GitHub: [Mi1ku](https://github.com/Mi1ku)
