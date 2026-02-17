document.addEventListener('DOMContentLoaded', () => {
    const UI_CONFIG_URL = "https://raw.githubusercontent.com/Mi1ku/antitestportal/main/serce-github/ui_config.json";
    const cacheBust = `?v=${Date.now()}`;

    const lockScreen = document.getElementById('lockScreen');
    const mainUI = document.getElementById('mainUI');
    const licenseInput = document.getElementById('licenseInput');
    const activateBtn = document.getElementById('activateBtn');

    // UI Feedback elements
    const updateBtn = document.getElementById('updateBtn');
    const clearBtn = document.getElementById('clearBtn');

    function showStatus(btn, message, color = "#22c55e", success = true) {
        const originalContent = btn.innerHTML;
        const originalBg = btn.style.background;
        btn.innerText = message;
        btn.style.background = color;
        btn.style.color = "white";

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = originalBg;
            btn.style.color = "";
        }, 2000);
    }

    // 1. SPRAWDZANIE LOKALNEGO KLUCZA
    chrome.storage.local.get(['shield_key'], (result) => {
        if (result.shield_key) {
            verifyKey(result.shield_key, true); // Auto-login
        }
    });

    // 2. WERYFIKACJA KLUCZA (Cloud Sync)
    function verifyKey(key, isAuto = false) {
        fetch(UI_CONFIG_URL + cacheBust)
            .then(r => r.json())
            .then(data => {
                const isValid = data.validKeys && data.validKeys.includes(key);

                // TRIAL BYPASS DLA TESTÓW
                if (isValid || key === "TRIAL-2026" || key === "MIKUS-KING") {
                    if (!isAuto) {
                        chrome.storage.local.set({ shield_key: key });
                    }
                    lockScreen.classList.add('hidden');
                    mainUI.classList.remove('hidden');
                } else if (!isAuto) {
                    showStatus(activateBtn, "BŁĘDNY KLUCZ!", "#ef4444", false);
                }
            })
            .catch(() => {
                // Fallback jeśli GitHub leży, a klucz był już raz wpisany
                if (isAuto) {
                    lockScreen.classList.add('hidden');
                    mainUI.classList.remove('hidden');
                }
            });
    }

    activateBtn.addEventListener('click', () => {
        const val = licenseInput.value.trim().toUpperCase();
        if (val) verifyKey(val);
    });

    // PRZYCISKI GŁÓWNE
    clearBtn.addEventListener('click', () => {
        chrome.browsingData.remove({
            "origins": ["https://www.testportal.pl", "https://www.testportal.net", "https://*.testportal.pl", "https://*.testportal.net"]
        }, {
            "cache": true, "cookies": true, "localStorage": true
        }, () => {
            showStatus(clearBtn, "DANE WYCZYSZCZONE!");
        });
    });

    updateBtn.addEventListener('click', () => {
        chrome.tabs.query({ url: ["https://*.testportal.pl/*", "https://*.testportal.net/*", "https://*.testportal.online/*"] }, (tabs) => {
            tabs.forEach(tab => chrome.tabs.reload(tab.id));
            showStatus(updateBtn, "BAZA ZSYNCHRONIZOWANA!");
        });
    });
});