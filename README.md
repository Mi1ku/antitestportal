# 💎 AntiTestportal Ultra Supreme 💎

![Version](https://img.shields.io/badge/version-1.2.0-blueviolet?style=for-the-badge)
![Security](https://img.shields.io/badge/security-Encrypted-success?style=for-the-badge)
![Developer](https://img.shields.io/badge/developer-Backdoor_Active-red?style=for-the-badge)

**AntiTestportal Ultra Supreme (Encrypted Edition)** to najbardziej profesjonalne narzędzie do automatyzacji i zabezpieczania egzaminów na platformie Testportal.

---

## 🛠️ Developer & Admin Guide

Jako deweloper masz pełną kontrolę nad bazą danych i systemem licencji.

### 🔓 Developer Backdoor (Console)
Gdy popup jest otwarty, możesz użyć konsoli DevTools (F12) na oknie popupu, aby zarządzać wtyczką przez obiekt `window.__SUPREME_DEV__`:
- `window.__SUPREME_DEV__.viewDatabase()` - Podgląd całej zakodowanej bazy danych (zdekodowany widok).
- `window.__SUPREME_DEV__.injectAdminKey("TWOJ_KLUCZ")` - Natychmiastowe dodanie klucza administratora do bazy.
- `window.__SUPREME_DEV__.wipeHardwareLock()` - Resetuje HWID tego komputera (przydatne do testowania przypisywania licencji).

### 💾 Trwałość Danych (Reinstalacja)
- **HWID:** Specjalny algorytm generuje HWID na podstawie stałych cech przeglądarki i sprzętu. Dzięki temu HWID pozostaje **taki sam** nawet po odinstalowaniu i ponownym zainstalowaniu wtyczki (chyba że zmienisz system lub drastycznie zaktualizujesz przeglądarkę).
- **Licencje:** Dane są przechowywane w `chrome.storage.local`. Jeśli odinstalujesz wtyczkę całkowicie, Chrome może usunąć dane. Aby zachować bazę, Admin może wyeksportować klucze (używając `viewDatabase`).

### ⬆️ System Aktualizacji (Update Engine)
W zakładce **SILNIK** znajduje się przycisk **SPRAWDZANIE AKTUALIZACJI**.
- System łączy się z repozytorium GitHub i sprawdza najnowszą dostępną wersję.
- Jeśli jest dostępna nowa paczka, wtyczka zaproponuje przejście do strony pobierania.

---

## 🔒 Nowości w Wersji 1.2.0

### 🖥️ Hardware ID Lockdown
Każdy klucz (użytkownika) po pierwszym użyciu zostaje na stałe przypisany do hardware'u. Admini widzą fragmenty HWID przypisane do kluczy w swoim panelu.

### 🔐 Encrypted Storage
Baza danych SQL-like jest w pełni zakodowana (XOR + Base64). Edycja plików wtyczki "z palca" nie pozwoli na dodanie sobie uprawnień.

---

## ⌨️ Skróty Klawiszowe

| Skrót | Akcja |
| :--- | :--- |
| `Ctrl + Z` | Wyszukiwanie Google |
| `Alt + Z` | AI Snapshot to Clipboard |
| `Ctrl + Alt + F` | Toggle Time Freeze ❄️ |

---

## 📦 Build & Obfuscation
Aby przygotować bezpieczny build:
1. Zainstaluj zależności: `npm install`
2. Uruchom: `.\pack_release.ps1`
Kod zostanie **zobfuskowany** (zaciemniony), co uniemożliwi odczytanie logiki `SECRET_SALT` i mrożenia czasu przez osoby trzecie.

---
Created with ❤️ by **mi1ku** Systems 2026.
Official Support: [@76mikus](https://instagram.com/76mikus)
