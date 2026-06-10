-- ============================================================
-- Campus Market UTP — Datos Iniciales (PostgreSQL)
-- ============================================================
-- Este archivo se ejecuta automáticamente al iniciar Spring Boot
-- gracias a spring.sql.init.mode=always y spring.jpa.defer-datasource-initialization=true
-- ============================================================

-- Kioscos iniciales
INSERT INTO kiosco (nombre, ubicacion, piso, activo)
SELECT 'Kiosco Piso 2', 'Edificio Principal', 'Piso 2', TRUE
WHERE NOT EXISTS (SELECT 1 FROM kiosco WHERE nombre = 'Kiosco Piso 2');

INSERT INTO kiosco (nombre, ubicacion, piso, activo)
SELECT 'Kiosco Piso 7', 'Edificio Principal', 'Piso 7', TRUE
WHERE NOT EXISTS (SELECT 1 FROM kiosco WHERE nombre = 'Kiosco Piso 7');

-- Categorías iniciales
INSERT INTO categoria (nombre, activo)
SELECT 'Snack', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Snack');

INSERT INTO categoria (nombre, activo)
SELECT 'Bebida', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Bebida');

INSERT INTO categoria (nombre, activo)
SELECT 'Comida', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Comida');

INSERT INTO categoria (nombre, activo)
SELECT 'Postre', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Postre');

-- NOTA: Los usuarios se crean via DataInitializer.java con BCrypt hashes reales.
-- NO insertar contraseñas en texto plano aquí.
