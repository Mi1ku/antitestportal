-- BAZA DANYCH KLUCZY (license_keys.sql)
-- Aby dodać klucz, dopisz linię w formacie:
-- INSERT INTO license_keys (code, type, note) VALUES ('TWC-KOD', 'USER', 'Opis');

CREATE TABLE IF NOT EXISTS license_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    type TEXT DEFAULT 'USER', -- 'ADMIN' or 'USER'
    expires_at INTEGER DEFAULT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    note TEXT
);

-- DOMYŚLNE KLUCZE
INSERT INTO license_keys (code, type, note) VALUES ('admin', 'ADMIN', 'Główny Administrator');
INSERT INTO license_keys (code, type, note) VALUES ('mikus', 'USER', 'Klucz Testowy 1');
INSERT INTO license_keys (code, type, note) VALUES ('zsa', 'USER', 'Klucz Testowy 2');
