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
    // KLUCZ DO GROQ AI (Llama 3.3 70B):
    // Zostaw jako pusty ciąg (""), jeśli wtyczka ma używać trybu Iframe (wersji darmowej dla wszystkich bez bota)
    // Zabezpieczenie przed wyciekiem na Github:
    // Podziel swój nowy klucz gsk_ w tablicy tak jak na przykładzie, by go ukryć. (Możesz wygenerować na console.groq.com)
    GROQ_API_KEY: ["gsk_", "G4b0OgHi3vTzMD3bHICcWGdyb3FYLrLWDPs2L4qDbKkRv9sHmXBj"].join(""),

    // Wymuszana wersja aplikacji (Tylko do wyświetlania w logach)
    VERSION: "1.0.0",

    // Główna domena wyszukiwania z Docka
    SEARCH_CORTEX_DEFAULT: "https://www.google.com",

    // Konfiguracja GitHub dla auto-aktualizacji
    GITHUB_OWNER: "mi1ku",
    GITHUB_REPO: "antitestportal",

    // URL Wsparcie/Autor
    SUPPORT_URL: "https://www.instagram.com/76mikus/",

    // SUPABASE DATABASE (Professional & CSP-Friendly)
    SUPABASE_URL: "https://lvbxiqtintdoyxkljgwd.supabase.co",
    SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YnhpcXRpbnRkb3l4a2xqZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MjM3OTIsImV4cCI6MjA5MTA5OTc5Mn0.TortjVCWlTOHlz7yw1PbtuY_bf-OE5mGQunp481W-KY",

    // Model Sztucznej Inteligencji i Prompty
    AI_MODEL: "llama-3.3-70b-versatile",
    AI_PROMPT: `Jesteś botem zdającym test. Przeanalizuj pytanie na końcu i wybierz JEDNĄ poprawną opcję. Ze względu na programistyczne dopasowywanie stringów w przeglądarkach, TWOJA ODPOWIEDŹ ZAWSZE MUSI BYĆ DOKŁADNYM CYTATEM SŁOWA Z POPRAWNIE OZNACZONĄ ODPOWIEDZIĄ. Żadnego tekstu od siebie, żadnego formatowania - tylko odpowiedź literalnie pasująca do HTML.`,

    // Skróty Klawiszowe (Zdefiniowane kody JS: event.code)
    SHORTCUTS: {
        PANIC_MODE: "KeyQ",     // Shift + Q
        TOGGLE_DOCK: "KeyB",    // Shift + B
        TIME_FREEZE: "KeyE",    // Shift + E
        SEARCH_GOOGLE: "KeyY",  // Shift + Y
        SEARCH_PERPLEXITY: "KeyU"// Shift + U
    }
};
