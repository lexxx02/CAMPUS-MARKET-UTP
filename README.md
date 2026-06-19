# Campus Market — Sistema de Gestión de Kioscos UTP

Este proyecto es una solución integral (Backend + Frontend) para la gestión de productos, inventario y reportes de los kioscos ubicados en el campus de la UTP.

## 👥 Equipo de Trabajo (Integrantes)
- [Nombre del Integrante 1]
- [Nombre del Integrante 2]
- [Nombre del Integrante 3]

*(Nota: Reemplaza estos corchetes con los nombres reales de tu grupo antes de subirlo)*

---

## 🚀 Tecnologías Utilizadas

### ⚙️ Backend (API REST)
- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3
- **Base de Datos:** PostgreSQL
- **Seguridad:** Spring Security + JWT
- **Reportes:** Apache POI (Excel)

### 💻 Frontend (Interfaz Web)
- **Librería:** React 18 + Vite
- **Estilos:** Tailwind CSS
- **Navegación:** React Router DOM
- **Peticiones:** Axios

---

## 🛠️ Instrucciones de Instalación y Uso

Para correr este proyecto en tu entorno local, asegúrate de tener instalado **Java 17**, **Maven**, **Node.js** y **PostgreSQL**.

### 1. Levantar el Backend
1. Abre una terminal y navega hacia la carpeta del backend:
   ```bash
   cd campus-market-backend
   ```
2. Ejecuta el servidor usando Maven:
   ```bash
   mvn spring-boot:run
   ```
   *El servidor de Spring Boot se iniciará y se conectará a tu base de datos local.*

### 2. Levantar el Frontend
1. Abre otra terminal en la carpeta raíz del proyecto (fuera del backend).
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en tu navegador, generalmente en `http://localhost:5173/`.*

---

## 🧪 Pruebas Unitarias (Testing)
El backend cuenta con pruebas unitarias desarrolladas en JUnit y Mockito para garantizar el correcto funcionamiento de los servicios clave (Casos de Prueba CP-01 al CP-05).

Para ejecutar todas las pruebas, navega a la carpeta del backend y usa el comando:
```bash
mvn test
```
