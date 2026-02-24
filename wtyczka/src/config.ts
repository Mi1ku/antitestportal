/**
 * ==========================================================
 * 🔥 SUPREME DEVELOPER CONFIGURATION
 * ==========================================================
 * Poniżej znajdują się klucze i ustawienia dla deweloperów.
 * Użytkownicy wtyczki nie zobaczą tego pliku, więc klucze API
 * są wbudowane na stałe. Jeśli chcesz zmienić powiązania AI
 * (np. nowy klucz Gemini, albo inna domena bazy danych), 
 * zrób to tutaj.
 */

export const DEV_CONFIG = {
    // KLUCZ DO GOOGLE GEMINI (Auto-Answer 1.5 Flash):
    // Zostaw jako pusty ciąg (""), jeśli wtyczka ma używać trybu Iframe (wersji darmowej dla wszystkich bez bota)
    // Zabezpieczenie przed wyciekiem (Boty Google na Github od razu banują publiczne klucze zaczynające się od AIza). 
    // Podziel swój nowy klucz w tablicy tak jak na przykładzie, by go ukryć.
    GEMINI_API_KEY: ["AIza", "SyBd99wprDoIzxwikqCxHO7te63-PTJ6Z8M"].join(""),

    // Wymuszana wersja aplikacji (Tylko do wyświetlania w logach)
    VERSION: "1.0.0",

    // Główna domena wyszukiwania z Docka
    SEARCH_CORTEX_DEFAULT: "https://www.google.com",

    // Konfiguracja GitHub dla auto-aktualizacji
    GITHUB_OWNER: "mi1ku",
    GITHUB_REPO: "antitestportal",

    // URL Wsparcie/Autor
    SUPPORT_URL: "https://www.instagram.com/76mikus/",

    // Adres Firebase (baza danych)
    FIREBASE_DB_URL: "https://antitestportaldb-default-rtdb.europe-west1.firebasedatabase.app",

    // Model Sztucznej Inteligencji i Prompty
    AI_MODEL: "gemini-1.5-flash",
    AI_PROMPT: `Jesteś ekspertem zdającym test. Przeanalizuj pytanie i wybierz JEDNĄ najbardziej trafną opcję. Twoja odpowiedź KONIECZNIE musi być DOKŁADNYM CYTATEM jednej z opcji z pytania. Żadnego wstępu, żadnego komentarza. TYLKO dokładny tekst poprawnej odpowiedzi, aby nasz skrypt mógł ją kliknąć w DOM.`,

    // Skróty Klawiszowe (Zdefiniowane kody JS: event.code)
    SHORTCUTS: {
        PANIC_MODE: "KeyQ",     // Shift + Q
        TOGGLE_DOCK: "KeyB",    // Shift + B
        TIME_FREEZE: "KeyE",    // Shift + E
        SEARCH_GOOGLE: "KeyY",  // Shift + Y
        SEARCH_PERPLEXITY: "KeyU"// Shift + U
    },

    // Konfiguracja logowania (App/Core) Firebase 
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyDSnKsbPNCCmEKAO1r_PvvVldViGWQ1Sw",
        authDomain: "antitestportaldb.firebaseapp.com",
        projectId: "antitestportaldb",
        storageBucket: "antitestportaldb.firebasestorage.app",
        messagingSenderId: "99856592412",
        appId: "1:99856592412:web:b73e994dcb8d3561e4e3d9",
        measurementId: "G-PDM2VNPEZ9"
    }
};
