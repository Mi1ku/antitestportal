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
    GEMINI_API_KEY: "AIzaSyAkSnIpTHZ_yDuJDYwcbAQfDPDpw_RNre4",

    // Wymuszana wersja aplikacji (Tylko do wyświetlania w logach)
    VERSION: "1.0.0",

    // Główna domena wyszukiwania z Docka
    SEARCH_CORTEX_DEFAULT: "https://www.google.com"
};
