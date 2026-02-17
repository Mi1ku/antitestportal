document.addEventListener('DOMContentLoaded', () => {
    // KONFIGURACJA
    const UI_CONFIG_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/ui_config.json";
    const cacheBust = `?v=${Date.now()}`;

    // ELEMENTY UI
    const lockScreen = document.getElementById('lockScreen');
    const mainUI = document.getElementById('mainUI');
    const licenseInput = document.getElementById('licenseInput');
    const activateBtn = document.getElementById('activateBtn');
    const updateBtn = document.getElementById('updateBtn');
    const clearBtn = document.getElementById('clearBtn');

    // ALERT SYSTEM
    const alertLayer = document.getElementById('alertLayer');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertText = document.getElementById('alertText');
    const alertClose = document.getElementById('alertClose');

    function showAlert(title, text, type = "error") {
        alertTitle.innerText = title;
        alertText.innerText = text;
        alertIcon.innerText = type === "success" ? "✅" : "❌";
        alertLayer.style.display = "flex";
    }

    alertClose.addEventListener('click', () => {
        alertLayer.style.display = "none";
    });

    // 1. SPRAWDZANIE LOKALNEGO KLUCZA
    chrome.storage.local.get(['shield_key'], (result) => {
        if (result.shield_key) {
            verifyKey(result.shield_key, true);
        }
    });

    // 2. WERYFIKACJA KLUCZA (Case Sensitive + Better UI)
    function verifyKey(key, isAuto = false) {
        const trimmedKey = key.trim();

        fetch(UI_CONFIG_URL + cacheBust)
            .then(r => r.json())
            .then(data => {
                const validKeys = data.validKeys || [];
                // Sprawdzamy klucz dokładnie tak, jak został wpisany (Case Sensitive)
                const isValid = validKeys.includes(trimmedKey);

                if (isValid) {
                    if (!isAuto) {
                        chrome.storage.local.set({ shield_key: trimmedKey });
                    }
                    lockScreen.classList.add('hidden');
                    mainUI.classList.remove('hidden');
                } else {
                    if (!isAuto) {
                        showAlert("BŁĘDNY KLUCZ", "Wprowadzony klucz jest nieaktywny lub wygasł. Skontaktuj się ze sprzedawcą, aby zakupić dostęp.");
                    } else {
                        // Jeśli auto-login zawiódł, wyczyść stary klucz
                        chrome.storage.local.remove(['shield_key']);
                    }
                }
            })
            .catch(() => {
                // Offline Fallback
                if (isAuto && key) {
                    lockScreen.classList.add('hidden');
                    mainUI.classList.remove('hidden');
                } else if (!isAuto) {
                    showAlert("BŁĄD POŁĄCZENIA", "Nie udało się połączyć z serwerem licencji. Sprawdź połączenie z internetem.");
                }
            });
    }

    activateBtn.addEventListener('click', () => {
        const val = licenseInput.value.trim();
        if (val) {
            verifyKey(val);
        } else {
            showAlert("BRAK KLUCZA", "Wprowadź klucz licencyjny, aby odblokować Shield Ultra.");
        }
    });

    // CZYSZCZENIE DANYCH
    clearBtn.addEventListener('click', () => {
        chrome.browsingData.remove({
            "origins": [
                "https://www.testportal.pl",
                "https://www.testportal.net",
                "https://www.testportal.online"
            ]
        }, {
            "cache": true, "cookies": true, "localStorage": true
        }, () => {
            showAlert("SUKCES", "Wszystkie ślady obecności na Testportal zostały usunięte.", "success");
        });
    });

    // SYNCHRONIZACJA
    updateBtn.addEventListener('click', () => {
        chrome.tabs.query({ url: "*://*.testportal.*/*" }, (tabs) => {
            tabs.forEach(tab => chrome.tabs.reload(tab.id));
            showAlert("SYNCHRONIZACJA", "Silnik Shield Ultra został zaktualizowany w chmurze.", "success");
        });
    });
});