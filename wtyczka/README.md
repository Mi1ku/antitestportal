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
- **Stealth HUD 1.0**: Dyskretny pasek statusu z pulsacyjnym wskaźnikiem i przyciskiem AI Search.

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

## 🛠️ Poradnik Deweloperski (Setup & Dev)

Jeśli chcesz rozwijać ten projekt lub zmodyfikować go pod własne potrzeby, postępuj zgodnie z poniższą instrukcją. Projekt oparty jest na nowoczesnym stacku technologicznym dla rozszerzeń przeglądarkowych.

### 1. Wymagania wstępne
- **Node.js**: Wersja 16.x lub nowsza.
- **npm**: Menedżer pakietów (dostarczany z Node.js).
- **Znajomość**: React, TypeScript oraz architektury Chrome Extensions.

### 2. Konfiguracja Środowiska
1. Sklonuj repozytorium lub wypakuj pliki źródłowe.
2. Otwórz terminal w folderze `wtyczka/`.
3. Uruchom komendę instalacji zależności:
   ```bash
   npm install
   ```

### 3. Uruchomienie trybu deweloperskiego (Live Reload)
Aby widzieć zmiany w kodzie na żywo, uruchom:
```bash
npm run dev
```
Następnie w `chrome://extensions/` załaduj folder `build/chrome-mv3-dev`. Każda zmiana w kodzie Reacta lub assetach automatycznie odświeży rozszerzenie.

### 4. Budowanie wersji produkcyjnej
Gdy kod jest gotowy do wydania, wygeneruj zoptymalizowaną paczkę:
```bash
npm run build
```
Gotowe pliki znajdą się w folderze `build/chrome-mv3-prod`.

### 5. Architektura Systemu
- **Main World Injection**: Skrypt w `assets/anti-anti-tamper.js` jest wstrzykiwany bezpośrednio do środowiska wykonawczego strony (Window). Pozwala to na nadpisywanie metod obiektu `Testportal.Timer` i `Testportal.HonestRespondent`.
- **Nuclear Storage Sync**: Synchronizacja między Popupem a Stroną odbywa się przez `pluginStorage.watch()`. Zmiana parametrów w pamięci wtyczki wyzwala `CustomEvents`, które sterują wstrzykniętym silnikiem bez przerywania sesji użytkownika.

---

## ⚖️ Notki Prawne i Prawo Polskie

### 1. Charakter Proof of Concept
Narzędzie zostało stworzone wyłącznie w celach **edukacyjnych, badawczych i demonstracyjnych**. Służy do celów prezentacji luk w zabezpieczeniach systemów testowania online. Autor nie zachęca do naruszania regulaminów edukacyjnych.

### 2. Odpowiedzialność Cywilna (Art. 415 KC)
Zgodnie z **Art. 415 Kodeksu Cywilnego**: *"Kto z winy swej wyrządził drugiemu szkodę, obowiązany jest do jej naprawienia"*. Użytkownik wykorzystuje oprogramowanie na własną, wyłączną odpowiedzialność. Twórca nie ponosi odpowiedzialności za konsekwencje wynikające z użycia narzędzia.

### 3. Ochrona Autorska (Prawa Niezbywalne)
Zgodnie z **Ustawą o prawie autorskim i prawach pokrewnych (Dz.U. 1994 nr 24 poz. 83)**, autorskie prawa osobiste (w tym prawo do autorstwa utworu) są **niezbywalne i wygasają wraz ze śmiercią autora**. 
- **Zabrania się usuwania lub modyfikowania informacji o autorze (mi1ku)**.
- Jakakolwiek dystrybucja komercyjna bez zgody autora jest zabroniona.
- Każda próba przywłaszczenia autorstwa kodu skutkuje naruszeniem art. 115 wspomnianej ustawy (Plagiat).

---

## 🦍 Kontakt i Autor
- **Twórca**: mi1ku (Supreme Systems Designer)
- **Instagram**: [@76mikus](https://instagram.com/76mikus)
- **Wersja**: 1.0.0 Stable "Supreme Edition"

**Stworzone przez mi1ku. Wszelkie prawa zastrzeżone. © 2026 mi1ku Systems.**
