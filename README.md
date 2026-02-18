# 🦍 AntiTestportal Ultra Supreme - Instrukcja Obsługi

Witaj w elicie. To narzędzie to Twój scyzoryk szwajcarski do testów online. Poniżej znajdziesz pełny opis funkcji, instalacji i obsługi panelu administratora.

## 🚀 Instalacja

1.  Upewnij się, że masz zainstalowane `Node.js`.
2.  Otwórz terminal w folderze `wtyczka`.
3.  Wpisz `npm install` (tylko raz).
4.  Wpisz `npm run build`.
5.  W przeglądarce (Chrome/Edge):
    *   Wejdź w `chrome://extensions`.
    *   Włącz "Tryb dewelopera" (prawy górny róg).
    *   Kliknij "Załaduj rozpakowane".
    *   Wybierz folder `wtyczka/build/chrome-mv3-dev`.

---

## 🔑 Logowanie i Klucze

Wtyczka posiada system licencyjny. Aby jej używać, musisz się zalogować.

### Metody Logowania:
1.  **Klucz Licencyjny**: Wpisz kod otrzymany od administratora.
    *   Klucze są sprawdzane w lokalnej bazie danych.
    *   Klucze mogą mieć ważność (np. 1h, 24h) lub być dożywotnie.

### Domyślne Klucze:
*   `admin` - Odblokowuje **Panel Administratora** (pełna władza).
*   `mikus` - Zwykły klucz użytkownika (testowy).
*   `zsa` - Zwykły klucz użytkownika (testowy).

---

## 🛠️ Panel Administratora (Tylko Admin)

Jeśli zalogujesz się kluczem `admin`, w menu pojawi się nowa zakładka **🛠️ ADMIN**.

### Co możesz robić?
1.  **Generować Klucze**:
    *   `+ USER 24H`: Tworzy klucz ważny 24 godziny.
    *   `+ USER 1H`: Tworzy klucz ważny 1 godzinę.
    *   `+ ADMIN`: Tworzy nowego administratora (dożywotnio).
2.  **Lista Kluczy**:
    *   Widzisz wszystkie aktywne klucze w bazie.
    *   Widzisz ich typ (USER/ADMIN) i czy są tymczasowe.
3.  **Usuwanie**:
    *   Kliknij ikonę 🗑️ obok klucza, aby go usunąć i odebrać dostęp.

⚠️ **Baza danych jest lokalna** (`chrome.storage.local`). Jeśli odinstalujesz wtyczkę, baza zniknie (chyba że zrobisz backup).

---

## ⚡ Funkcje Główne (Home)

### ❄️ Kontrola Czasu (Time Freeze)
To serce wtyczki. Pozwala zamrozić czas po stronie klienta.
*   **ZAMRÓŹ (❄️)**: Zatrzymuje zegar Testportalu.
    *   Wtyczka podmienia `Date.now()` i `performance.now()`, aby strona "myślała", że czas nie płynie.
    *   Dodajemy losowe milisekundy (jitter), aby wyglądało to naturalnie dla skryptów wykrywających.
*   **ODMROŹ (🔥)**: Przywraca upływ czasu.
*   **RESET TIMER ⏱️**: Jeśli coś pójdzie nie tak, ten przycisk wymusza reset lokalnego licznika wtyczki bez odświeżania strony.

### 👻 Ghost Shield
Chroni przed wykryciem "wyjścia z karty".
*   Blokuje zdarzenia `blur`, `focus`, `visibilitychange`.
*   Blokuje wysyłanie pakietów telemetrycznych do serwerów Testportalu (via `declarativeNetRequest`).
*   Blokuje wykrywanie nagrywania ekranu/robienia zrzutów.

### 📘 Poradnik & Skróty
*   **Ctrl + Z**: Wyszukaj zaznaczone pytanie w Google.
*   **Alt + Z**: Zrób zrzut ekranu pytania i wyślij do AI (funkcja w przygotowaniu/wymaga zewnętrznego API w pełnej wersji).

---

## 🎰 Kasyno (Casino Royal)

Dla relaksu podczas egzaminu.
*   **Kredyty**: Startujesz ze 100 💎. Twoje saldo zapisuje się w bazie wtyczki.
*   **Spin**: Koszt 10 💎.
*   **Nagrody**:
    *   3x 💎 = 500 Kredytów.
    *   Inne trójki = 100 Kredytów.
*   (W planach): Sklep, gdzie można kupić dodatkowe "zamrożenia" za kredyty.

---

## ⚙️ Opcje & Bezpieczeństwo

*   **Pokaż Status na Stronie (HUD)**: Wyświetla mały pasek na dole ekranu z informacją, czy czas jest zamrożony.
*   **☢️ AWARYJNY RESET ŚLADÓW**:
    *   Usuwa cookies, localStorage i cache związane z Testportalem.
    *   Przeładowuje karty.
    *   Używaj, gdy strona zaczyna dziwnie działać lub podejrzewasz wykrycie.

---

### Twórca
**mi1ku Systems & @76mikus**
*Wersja 1.0.0 Ultra Supreme*
