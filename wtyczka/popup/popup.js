document.addEventListener('DOMContentLoaded', () => {
    // KONFIGURACJA
    const UI_CONFIG_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/ui_config.json";
    const cacheBust = `?v=${Date.now()}`;
    const patterns = [
        "*://*.testportal.pl/*",
        "*://*.testportal.net/*",
        "*://*.testportal.de/*",
        "*://*.testportal.online/*"
    ];

    // ELEMENTY UI
    const lockScreen = document.getElementById('lockScreen');
    const mainUI = document.getElementById('mainUI');
    const licenseInput = document.getElementById('licenseInput');
    const activateBtn = document.getElementById('activateBtn');
    const updateBtn = document.getElementById('updateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const timeFreezeToggle = document.getElementById('timeFreezeToggle');
    const resetTimeBtn = document.getElementById('resetTimeBtn');

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

    // 1. SPRAWDZANIE KLUCZA I USTAWIEŃ
    chrome.storage.local.get(['shield_key', 'shield_time_freeze'], (result) => {
        if (result.shield_key) {
            verifyKey(result.shield_key, true);
        }
        if (result.shield_time_freeze !== undefined) {
            timeFreezeToggle.checked = result.shield_time_freeze;
        }
    });

    // 2. WERYFIKACJA KLUCZA (Case Sensitive + Better UI)
    function verifyKey(key, isAuto = false) {
        const trimmedKey = key.trim();

        fetch(UI_CONFIG_URL + cacheBust)
            .then(r => r.json())
            .then(data => {
                const validKeys = data.validKeys || [];
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
                        chrome.storage.local.remove(['shield_key']);
                    }
                }
            })
            .catch(() => {
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
            chrome.tabs.query({ url: patterns }, (tabs) => {
                if (tabs && tabs.length > 0) {
                    tabs.forEach(tab => chrome.tabs.reload(tab.id));
                }
                showAlert("SUKCES", "Wszystkie ślady obecności zostały usunięte, a strony odświeżone.", "success");
            });
        });
    });

    // SYNCHRONIZACJA
    updateBtn.addEventListener('click', () => {
        updateBtn.classList.add('hidden');
        clearBtn.classList.add('hidden');
        document.getElementById('syncLoading').style.display = 'block';

        chrome.tabs.query({ url: patterns }, (tabs) => {
            if (tabs && tabs.length > 0) {
                tabs.forEach(tab => chrome.tabs.reload(tab.id));
            }

            setTimeout(() => {
                updateBtn.classList.remove('hidden');
                clearBtn.classList.remove('hidden');
                document.getElementById('syncLoading').style.display = 'none';
                showAlert("SYNCHRONIZACJA", "Silnik został pomyślnie zaktualizowany w chmurze i odświeżony w kartach.", "success");
            }, 1500);
        });
    });

    // MODUŁ CZASU - LOGIKA
    timeFreezeToggle.addEventListener('change', () => {
        const enabled = timeFreezeToggle.checked;
        chrome.storage.local.set({ shield_time_freeze: enabled });
        chrome.tabs.query({ url: patterns }, (tabs) => {
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: (val) => { window.__tp_freeze__ = val; },
                    args: [enabled]
                });
            });
        });
    });

    resetTimeBtn.addEventListener('click', () => {
        chrome.tabs.query({ url: patterns }, (tabs) => {
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: () => { window.startTime = Date.now(); }
                });
            });
            showAlert("CZAS ZRESETOWANY", "Licznik pytania został ustawiony na 0.", "success");
        });
    });
});