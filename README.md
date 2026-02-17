# 🦍 Shield Ultra Enterprise v9.5.0

### **Złoty Standard w Technologii Stealth dla TestPortal.**

Shield Ultra to profesjonalna wtyczka do przeglądarki zaprojektowana w celu zapewnienia całkowitej niewykrywalności i automatyzacji podczas egzaminów na platformie TestPortal.pl. Łącząc zaawansowane maskowanie prototypów (Prototype Poisoning) z filtracją ruchu sieciowego, Shield Ultra omija systemy "Uczciwy Rozwiązujący" oraz śledzenie fokusu ze 100% skutecznością.

---

## 💎 FUNKCJE PREMIUM
- **Nuclear Focus Persistence**: Mechanizm `ReferenceError` paraliżuje skrypty śledzące Testportalu.
- **Ghost Network Protocol**: Blokada raportów `sendBeacon` i `fetch` o "oszustwach".
- **Honest Respondent Killer**: Stan "Uczciwy Rozwiązujący" jest wymuszany na poziomie silnika.
- **AI Solver Integration**: Obsługa AI bezpośrednio w tekście pytań.

---

## 📂 PRZEWODNIK DLA UŻYTKOWNIKA (SZYBKI START)
Jeśli pobrałeś gotową paczkę, wykonaj te proste kroki:

1. **Instalacja**:
   - Otwórz Chrome i przejdź do: `chrome://extensions/`.
   - Włącz **Tryb Dewelopera** (prawy górny róg).
   - Kliknij **Załaduj rozpakowane** i wybierz folder `wtyczka`.
2. **Aktywacja**:
   - Kliknij ikonę wtyczki i wpisz jeden z kluczy licencjynych:
     - `MIKUS`
     - `TEST`
     - `ZSA`
3. **Użycie**:
   - Otwórz test na Testportalu. Wszystkie blokady działają automatycznie.

---

## 🛠️ PRZEWODNIK DLA DEWELOPERA (KONFIGURACJA CHMURY)
Jeśli chcesz zmienić serwer, z którego pobierany jest kod (aby móc go aktualizować bez wysyłania plików klientom):

1. **GitHub Upload**:
   - Wrzuć folder `serce-github` na swoje repozytorium GitHub.
2. **Link RAW**:
   - Wejdź na GitHub w plik `engine.js` i kliknij przycisk **"Raw"**. Skopiuj link (musi zaczynać się od `raw.githubusercontent.com`).
3. **Podmiana Linków**:
   - **`wtyczka/bypass/shield.js`**: Podmień stałą `GITHUB_RAW_URL` na swój link RAW do `engine.js`.
   - **`wtyczka/popup/popup.js`**: Podmień stałą `UI_CONFIG_URL` na swój link RAW do `ui_config.json`.
   - **`wtyczka/background.js`**: Podmień stałą `GITHUB_RAW_URL` na swój link RAW do `engine.js`.
4. **Licencje**:
   - Klucze dodajesz edytując plik `ui_config.json` bezpośrednio na swoim GitHubie. Wtyczka u klientów zaktualizuje się sama!

---

## 🚀 PORADNIK OPERACYJNY (HOTKEYS)
- <kbd>CTRL</kbd> + **Kliknięcie** na pytanie: Szukaj w Google.
- <kbd>ALT</kbd> + **Kliknięcie** na pytanie: Odpowiedź przez AI Solver.
- **Przycisk "WYCZYŚĆ ŚLADY"**: Użyj przed każdym nowym testem, aby usunąć pliki cookies i cache sesji.

---

## ⚖️ NOTA PRAWNA
Oprogramowanie stworzone wyłącznie w celach edukacyjnych i badawczych. Twórcy nie biorą odpowiedzialności za niewłaściwe użycie lub konsekwencje wynikające z korzystania z tego narzędzia. 

---
*Sprzedaż i Wsparcie:*
Instagram: [**@76mikus**](https://www.instagram.com/76mikus/) | GitHub: [Mi1ku](https://github.com/Mi1ku)
