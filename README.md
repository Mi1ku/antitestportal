# 💎 AntiTestportal Ultra Supreme 💎

![Version](https://img.shields.io/badge/version-1.2.0-blueviolet?style=for-the-badge)
![Security](https://img.shields.io/badge/security-Encrypted-success?style=for-the-badge)
![License](https://img.shields.io/badge/HWID-Locked-gold?style=for-the-badge)

**AntiTestportal Ultra Supreme (Encrypted Edition)** to najbardziej profesjonalne narzędzie do automatyzacji i zabezpieczania egzaminów na platformie Testportal. Wersja 1.2.0 wprowadza zabezpieczenia klasy bankowej oraz system przypisywania licencji do sprzętu (HWID).

---

## 🔒 Nowości w Wersji 1.2.0 (Elite Security)

### 🖥️ Hardware ID (HWID) Lockdown
System automatycznie generuje unikalny identyfikator Twojego komputera. 
- **Anti-Leak:** Każda licencja (z wyjątkiem Admina) przypisuje się do pierwszego komputera, na którym zostanie użyta.
- **Single Device:** Nie ma możliwości współdzielenia jednego klucza przez wiele osób. Próba użycia na innym sprzęcie skutkuje blokadą.

### 🔐 Encrypted SQL Storage
Wszystkie dane (klucze, punkty, ustawienia) są zapisywane w lokalnej bazie danych w formie **zakodowanej (XOR + Base64 + Supreme Salt)**.
- Nawet jeśli ktoś podejrzy pliki wtyczki, nie odczyta Twoich kluczy ani nie doda sobie punktów ręcznie.
- Silnik automatycznie szyfruje/odszyfrowuje dane w locie przy każdym załadowaniu wtyczki.

### 🛡️ Obfuscated Build
Kod źródłowy wtyczki jest poddawany procesowi **obfuskacji** podczas budowania. Logika mrożenia czasu i sprawdzania kluczy jest nieczytelna dla osób postronnych, co chroni wtyczkę przed inżynierią wsteczną.

---

## 🚀 Główne Funkcje

- **System Freeze 2.0:** Zaawansowana manipulacja czasem na poziomie jądra JS.
- **Ghost Shield EX:** Całkowite ukrycie aktywności przed skryptami śledzącymi fokus strony.
- **AI Snapshot & Search:** Błyskawiczne zrzuty ekranu i wyszukiwanie oparte o sztuczną inteligencję.
- **Supreme Casino:** System lojalnościowy oparty o punkty i reflinki.

---

## ⌨️ Zaawansowane Skróty Klawiszowe

| Skrót | Akcja |
| :--- | :--- |
| `Ctrl + Z` | Wyszukiwanie Google (Całe Pytanie) |
| `Alt + Z` | AI Snapshot (Obraz do Schowka + GPT) |
| `Ctrl + Alt + F` | Szybkie Mrożenie/Odmrożenie Czasu ❄️ |

---

## 🛠️ Administracja (Panel SQL)

Aby wejść do panelu administratora, użyj klucza o randze `admin` (np. domyślny `SUPREME_ADMIN_76`).
- **Generator Kluczy:** Twórz klucze z określoną datą ważności.
- **HWID Tracking:** Podglądaj, do jakich maszyn przypisały się Twoje klucze.
- **Database Management:** Usuwaj wygasłe licencje i zarządzaj bazą w czasie rzeczywistym.

---

## 📦 Przygotowanie Wydania (Build & Pack)

Użyj autorskiego skryptu PowerShell do przygotowania profesjonalnego builda:
```powershell
.\pack_release.ps1
```
Skrypt wyczyści stare pliki, zbuduje projekt w wersji produkcyjnej, zsynchronizuje README i spakuje wszystko do zabezpieczonego archiwum `.zip`.

---
Created with ❤️ by **mi1ku** Systems 2026.
Official Support: [@76mikus](https://instagram.com/76mikus)
