# 🦍 AntiTestportal Ultra

**AntiTestportal Ultra** to potężne, profesjonalne narzędzie do całkowitego bypassu zabezpieczeń platformy Testportal. Wersja 1.0.2 "Supreme" wprowadza najbardziej zaawansowane mechanizmy niewykrywalności i wsparcia AI, stworzone w całości przez Mi1ku.

---

## 💎 Główne Funkcje (v1.0.2)

- **Ghost Shield (Supreme Stealth)**: Blokuje wszelkie próby wykrycia zmiany karty. Nauczyciel widzi **0 prób** opuszczenia strony. System działa na poziomie jądra przeglądarki (MAIN World).
- **Nuclear Timer Control (EZ ULTRA)**: 
  - **Freeze (❄️)**: Całkowite zamrożenie odliczania czasu. System nadpisuje natywny licznik Testportalu.
  - **Unfreeze (🔥)**: Płynne przywrócenie odliczania czasu bez odświeżania strony.
  - **Reset (⏱️)**: Natychmiastowe przywrócenie pełnego limitu czasu na pytanie.
- **Dual AI/Google Search**: Dwa oddzielne systemy wyszukiwania na ekranie zadania, automatycznie usuwające numerację pytań i prefiksy ("Pytanie 1:").
- **Nuclear Clean Protocol**: Jedno kliknięcie usuwa wszystkie ślady aktywności (Cookies, LocalStorage, Cache) i restartuje środowisko.

---

## 🚀 Instrukcja dla Użytkownika

### 1. Instalacja
- W Chrome: wejdź w `chrome://extensions/`.
- Włącz **Tryb Dewelopera** (prawy górny róg).
- Kliknij **Załaduj rozpakowane** i wybierz folder `build/chrome-mv3-prod`.

### 2. Aktywacja (Klucze)
- Klucze: `mikus`, `zsa`.

### 3. Skróty Klawiszowe (v1.0.2)
- **Ctrl + Shift + X**: Błyskawiczne szukanie **całego pytania** w Perplexity AI.
- **Ctrl + Shift + Z**: Błyskawiczne szukanie **całego pytania** w Google.
- **Alt + Klik**: Szukanie **zaznaczonego tekstu** w AI.
- **Ctrl + Klik**: Szukanie **zaznaczonego tekstu** w Google.

---

## 🛠️ Poradnik Deweloperski (Setup & Dev)

Jeśli chcesz rozwijać ten projekt, postępuj zgodnie z poniższą instrukcją. Projekt oparty jest na środowisku **Plasmo**.

### 1. Wymagania wstępne
- **Node.js**: Wersja 16.x lub nowsza.
- **npm**: Menedżer pakietów.

### 2. Instalacja i Konfiguracja
1. Pobierz pliki źródłowe do folderu.
2. Otwórz terminal w folderze `wtyczka/`.
3. Uruchom:
   ```bash
   npm install
   ```

### 3. Development i Build
- `npm run dev` - Uruchomienie trybu deweloperskiego (Live Reload). Załaduj folder `build/chrome-mv3-dev` do Chrome.
- `npm run build` - Generowanie wersji produkcyjnej do folderu `build/chrome-mv3-prod`.

### 4. Architektura
- **Main World Injection**: Kluczowa logika `assets/anti-anti-tamper.js` wstrzykiwana bezpośrednio do Window strony.
- **Storage Watch**: Popup komunikuje się z content-scriptem przez system `pluginStorage.watch()`, eliminując błędy połączenia (No direct messaging).

---

## ⚖️ Notki Prawne i Prawo Polskie

### 1. Charakter Edukacyjny
Oprogramowanie zostało stworzone wyłącznie w celach **edukacyjnych, badawczych i demonstracyjnych**. Służy do celów prezentacji luk w zabezpieczeniach systemów online. Autor nie zachęca do naruszania regulaminów placówek edukacyjnych.

### 2. Odpowiedzialność Cywilna (Art. 415 KC)
Zgodnie z **Art. 415 Kodeksu Cywilnego**: *"Kto z winy swej wyrządził drugiemu szkodę, obowiązany jest do jej naprawienia"*. Użytkownik wykorzystuje oprogramowanie na własną, wyłączną odpowiedzialność.

### 3. Ochrona Autorska (Dz.U. 1994 nr 24 poz. 83)
Zgodnie z polskim prawem autorskim, autorskie prawa osobiste są niezbywalne. 
- **ZABRANIA SIĘ USUWANIA LUB MODYFIKOWANIA INFORMACJI O AUTORZE (mi1ku)**.
- Jakakolwiek dystrybucja komercyjna, sprzedaż lub redystrybucja kodu bez wyraźnej zgody autora jest zabroniona.
- Próba przywłaszczenia autorstwa kodu lub modyfikacja brandingowa bez licencji skutkuje odpowiedzialnością karną (Plagiat).

---

## 🦍 Kontakt i Autor
- **Twórca**: mi1ku
- **Instagram**: [@76mikus](https://instagram.com/76mikus)
- **Wersja**: 1.0.2 Stable "Supreme Edition"

**Stworzone przez mi1ku. Wszelkie prawa zastrzeżone. © 2026 mi1ku Systems.**
