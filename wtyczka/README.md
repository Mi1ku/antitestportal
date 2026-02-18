# 🦍 AntiTestportal Ultra (mi1ku Supreme Edition 1.0)

**AntiTestportal Ultra** to potężne, profesjonalne narzędzie do całkowitego bypassu zabezpieczeń platformy Testportal. Wersja 1.0 "Supreme" wprowadza najbardziej zaawansowane mechanizmy niewykrywalności i wsparcia AI, stworzone przez **mi1ku Systems**.

---

## 💎 Główne Funkcje (v1.0)

- **Ghost Shield (Supreme Stealth)**: Blokuje wszelkie próby wykrycia zmiany karty. Nauczyciel widzi **0 prób** opuszczenia strony. System działa na poziomie jądra przeglądarki (MAIN World).
- **Nuclear Timer Control (EZ ULTRA)**: 
  - **Freeze**: Całkowite zamrożenie odliczania czasu. System nadpisuje natywny licznik Testportalu.
  - **Reset**: Natychmiastowe przywrócenie pełnego limitu czasu na pytanie.
  - **Dynamic Sync**: Mrożenie i odmrażanie działa w locie, bez odświeżania strony (No-F5).
- **Smart Scrape AI Search**: Inteligentny system Scrapingu, który automatycznie odfiltrowuje numery pytań i prefiksy, wysyłając czystą treść zadania do AI.
- **Nuclear Clean Protocol**: Jedno kliknięcie usuwa wszystkie ślady Twojej aktywności (Cookies, LocalStorage, Cache) i restartuje środowisko testowe.
- **Stealth HUD 1.0**: Dyskretny pasek statusu z pulsacyjnym wskaźnikiem i przyciskiem AI Search. W pełni konfigurowalna widoczność.

---

## 🚀 Instrukcja dla Użytkownika

### 1. Instalacja
- W Chrome: wejdź w `chrome://extensions/`.
- Włącz **Tryb Dewelopera** (prawy górny róg).
- Kliknij **Załaduj rozpakowane** i wybierz folder `build/chrome-mv3-prod`.

### 2. Aktywacja (Klucze)
- Otwórz popup wtyczki i wpisz jeden z autoryzowanych kluczy:
  - `mikus`
  - `zsa`

### 3. Skróty Klawiszowe (Stealth Mastery)
- **Alt + S**: Błyskawiczne szukanie **całego pytania** w Perplexity AI.
- **Alt + G**: Błyskawiczne szukanie **całego pytania** w Google.
- **Alt + Klik**: Szukanie **zaznaczonego tekstu** w AI.
- **Ctrl + Klik**: Szukanie **zaznaczonego tekstu** w Google.

---

## 🛠️ Informacje dla Dewelopera (Config & Build)

### Środowisko
- **Framework**: [Plasmo 0.90.5](https://www.plasmo.com/)
- **Frontend**: React 18 + TypeScript.
- **Styling**: Vanilla CSS (Premium Glassmorphism).

### Build & Dev
- `npm install` - Instalacja zależności.
- `npm run dev` - Uruchomienie trybu deweloperskiego.
- `npm run build` - Generowanie produkcyjnej paczki w folderze `build/`.

### Architektura
- **Main World Injection**: Skrypt `assets/anti-anti-tamper.js` jest wstrzykiwany bezpośrednio do warstwy okna strony w celu manipulacji obiektem `window.Testportal`.
- **Dynamic Bridge**: Komunikacja między popupem a silnikiem strony odbywa się przez system synchronizacji pamięci (Storage Watch), co eliminuje błędy połączenia.

---

## ⚖️ Notki Prawne i Prawo Polskie

### 1. Charakter Edukacyjny (Proof of Concept)
Oprogramowanie zostało stworzone i udostępnione wyłącznie w celach **edukacyjnych, badawczych oraz demonstracyjnych**. Narzędzie służy do wykazywania luk w zabezpieczeniach systemów Web-Based Testing. Autor nie zachęca ani nie propaguje łamania regulaminów placówek edukacyjnych.

### 2. Odpowiedzialność Cywilna (Art. 415 KC)
Zgodnie z **Art. 415 Kodeksu Cywilnego**: *"Kto z winy swej wyrządził drugiemu szkodę, obowiązany jest do jej naprawienia"*. Użytkownik wykorzystuje oprogramowanie na własną, wyłączną odpowiedzialność. Twórca nie ponosi odpowiedzialności za ewentualne konsekwencje dyscyplinarne, prawne lub techniczne wynikające z niewłaściwego użycia narzędzia.

### 3. Prawa Autorskie (Dz.U. 1994 nr 24 poz. 83)
Wszystkie elementy niniejszego oprogramowania, w tym kod źródłowy, nazwa **"mi1ku Systems"** oraz interfejs graficzny, podlegają ochronie prawnej na podstawie **Ustawy o prawie autorskim i prawach pokrewnych (Dz.U. 1994 nr 24 poz. 83)**. Autor zastrzega sobie wszelkie prawa do utworu. Kopiowanie, modyfikowanie bez wyraźnej zgody lub dystrybucja komercyjna jest zabroniona.

---

## 🦍 Kontakt i Autor
- **Twórca**: mi1ku (Supreme Systems Designer)
- **Instagram**: [@76mikus](https://instagram.com/76mikus)
- **Wersja**: 1.0.0 Stable "Supreme Edition"

**Stworzone przez mi1ku. Wszelkie prawa zastrzeżone. © 2026 mi1ku Systems.**
