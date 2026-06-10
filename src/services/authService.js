// ============================================================
// Auth Service — Conectado al backend Spring Boot real
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Autentica un usuario con correo y contraseña contra el backend real.
 * Almacena el JWT token en localStorage.
 */
export const login = async (correo, contrasena) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Credenciales incorrectas');
  }
  const data = await res.json();
  localStorage.setItem('cm_token', data.token);
  localStorage.setItem('cm_user', JSON.stringify({
    rol: data.rol,
    nombre: data.nombre,
    idUsuario: data.idUsuario,
  }));
  return data;
};

/**
 * Cierra sesión eliminando token y datos del usuario.
 */
export const logout = () => {
  localStorage.removeItem('cm_token');
  localStorage.removeItem('cm_user');
};

/**
 * Retorna el JWT token almacenado.
 */
export const getToken = () => localStorage.getItem('cm_token');

/**
 * Retorna los datos del usuario almacenados.
 */
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('cm_user') || 'null');
  } catch {
    return null;
  }
};

/**
 * Verifica si hay un token de sesión activo.
 */
export const isAuthenticated = () => !!getToken();
