# 💎 AntiTestportal v1.0 💎

![Status](https://img.shields.io/badge/STATUS-UNDETECTED-brightgreen?style=for-the-badge&logo=shield)
![Version](https://img.shields.io/badge/version-1.0-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/security-Firebase--Cloud-red?style=for-the-badge&logo=firebase)

**AntiTestportal** to nowoczesne i skuteczne narzędzie do omijania zabezpieczeń platformy Testportal. Wersja 1.0 została zaprojektowana z myślą o prostocie użycia i maksymalnym bezpieczeństwie.

---

## 🚀 PORADNIK DLA UŻYTKOWNIKA (Instalacja)

Jeśli zakupiłeś klucz licencyjny, postępuj zgodnie z poniższą instrukcją:

1.  **Pobierz wtyczkę:** Otrzymasz plik `.zip` z najnowszą wersją. Wypakuj go do dowolnego folderu na pulpicie.
2.  **Otwórz Chrome:** Wpisz w pasku adresu `chrome://extensions`.
3.  **Włącz Tryb Dewelopera:** Przełącznik znajduje się w prawym górnym rogu ekranu.
4.  **Załaduj wtyczkę:** Kliknij przycisk **"Załaduj rozpakowane"** i wybierz folder, który wypakowałeś w kroku 1.
5.  **Gotowe!** Ikonka "ANTI" pojawi się na pasku.

Po kliknięciu w ikonkę, zostaniesz poproszony o podanie klucza.
👉 **Wpisz klucz, który otrzymałeś na Instagramie od `76mikus`.**
*(Uwaga: Każdy klucz ma limit urządzeń!)*

---

## 👻 FUNKCJE (Co to potrafi?)

### 🛡️ Ghost Shield (Niewykrywalność)
Wtyczka automatycznie blokuje próby wykrycia Twojej aktywności przez Testportal.
- Nie wykrywa wyjścia z karty ("Uczciwy Rozwiązywacz").
- Nie wykrywa utraty focusu.
- Działa w tle od razu po zalogowaniu.

### ❄️ Time Freeze (Zatrzymanie Czasu)
Zatrzymaj licznik czasu podczas testu, aby zyskać chwilę na oddech.
- W panelu wtyczki kliknij przełącznik **"Zatrzymaj Czas"**.
- Licznik na stronie testu zatrzyma się wizualnie (np. na `--:--`).
- **Pamiętaj:** Używaj z głową!

### 🤖 Auto-Answer Genius (Podpowiedzi)
Wtyczka potrafi dyskretnie wyświetlać podpowiedzi z Google bezpośrednio pod pytaniem.
- Włącz funkcję w panelu ("Auto-Answer Genius").
- Pod pytaniem pojawi się ramka z wynikami wyszukiwania.

---

## 🛠️ PORADNIK TECHNICZNY (Dla Developerów / Adminów)

Poniższa sekcja przeznaczona jest dla zaawansowanych użytkowników i administratorów systemu AntiTestportal.

### 🔑 Pierwsze Uruchomienie (Root Admin)
Jeśli instalujesz system na czystej bazie danych Firebase, wtyczka automatycznie utworzy konto administratora przy pierwszym uruchomieniu:
- **Klucz:** `mikus`
- **Typ:** Administrator (Root)
- **Uprawnienia:** Pełne zarządzanie, 100 slotów HWID, 9999 punktów.

### ⚙️ Panel Administratora
Aby wejść do ukrytego panelu zarządzania kluczami:
1. Zaloguj się jako admin (`mikus`).
2. Kliknij **5 razy szybko** w logo "ANTI TESTPORTAL" w nagłówku wtyczki.
3. Otworzy się zakładka "TERMINAL" (trzecia ikona na dole), gdzie możesz:
   - Tworzyć nowe klucze (+).
   - Edytować istniejące użytkowników.
   - Banować urządzenia.
   - **Resetować HWID:** Opcja "WYCZYŚĆ LISTĘ HWID" pozwala zdalnie odpiąć wszystkie urządzenia od danego klucza (np. dla całej klasy).

### 🔍 Skróty Klawiszowe (Power User)
| Skrót | Funkcja |
| :--- | :--- |
| **Ctrl + Z** | Szybkie szukanie pytania w Google (nowa karta/okno) |
| **Ctrl + Shift + Z** | Szybkie szukanie pytania w Perplexity AI |

### 🔒 Bezpieczeństwo
- **Anti-Tamper Auto-Start:** Systemy ochronne aktywują się automatycznie DOPIERO po pomyślnej autoryzacji klucza. Przed zalogowaniem wtyczka jest w stanie uśpienia.
- **HWID Lock:** Każdy klucz jest wiązany sprzętowo. Próba użycia na zbyt wielu urządzeniach zablokuje logowanie.
- **Fail-Safe:** W przypadku błędu bazy danych, wtyczka nie wpuści użytkownika bez licencji.

---

**Created by mi1ku Systems 2026.**
*Wszelkie prawa zastrzeżone.*
