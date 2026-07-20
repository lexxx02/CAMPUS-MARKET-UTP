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

-- Productos iniciales para demostración en la nube
INSERT INTO producto (nombre, descripcion, precio, stock_piso2, stock_piso7, imagen, category_id, activo)
SELECT 'Coca Cola 500ml', 'Gaseosa sabor original', 2.50, 15, 20, 'https://micocacola.pe/cdn/shop/files/111002_a_a21060eb-55f7-41ab-85fa-71fbfef4fc4b_1000x.png', 
       (SELECT id FROM categoria WHERE nombre = 'Bebida'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Coca Cola 500ml');

INSERT INTO producto (nombre, descripcion, precio, stock_piso2, stock_piso7, imagen, category_id, activo)
SELECT 'Galletas Oreo', 'Galletas de chocolate con crema', 1.50, 30, 10, 'https://oechsle.vteximg.com.br/arquivos/ids/16543169-1000-1000/2288304.jpg', 
       (SELECT id FROM categoria WHERE nombre = 'Snack'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Galletas Oreo');

INSERT INTO producto (nombre, descripcion, precio, stock_piso2, stock_piso7, imagen, category_id, activo)
SELECT 'Empanada de Carne', 'Empanada horneada fresca', 3.00, 5, 2, 'https://www.comedera.com/wp-content/uploads/2023/10/Empanadas-de-carne-al-horno-shutterstock_134017688.jpg', 
       (SELECT id FROM categoria WHERE nombre = 'Comida'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Empanada de Carne');

INSERT INTO producto (nombre, descripcion, precio, stock_piso2, stock_piso7, imagen, category_id, activo)
SELECT 'Agua San Mateo', 'Agua mineral sin gas', 2.00, 50, 45, 'https://www.inka-world.com/media/image/84/c4/62/san-mateo-sin-gas-0-6-botella-1024x1024.jpg', 
       (SELECT id FROM categoria WHERE nombre = 'Bebida'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Agua San Mateo');

INSERT INTO producto (nombre, descripcion, precio, stock_piso2, stock_piso7, imagen, category_id, activo)
SELECT 'Alfajor de Maicena', 'Alfajor relleno de manjar blanco', 1.00, 12, 8, 'https://cdn0.recetasgratis.net/es/posts/5/6/2/alfajores_de_maicena_10265_orig.jpg', 
       (SELECT id FROM categoria WHERE nombre = 'Postre'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Alfajor de Maicena');
