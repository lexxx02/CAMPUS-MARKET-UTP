// ============================================================
// Auth Service — Conectado directamente a Supabase Auth
// ============================================================
// Reemplaza el sistema de JWT propio del backend de Spring Boot.
// Usa supabase.auth.signInWithPassword() para autenticar.
// ============================================================

import { supabase } from '../lib/supabaseClient';

/**
 * Autentica un usuario con correo y contraseña usando Supabase Auth.
 * Almacena la sesión automáticamente (Supabase lo gestiona internamente).
 */
export const login = async (correo, contrasena) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });

  if (error) throw new Error('Credenciales incorrectas');

  // Guardamos el rol y nombre en localStorage para acceso rápido
  // El rol se obtiene de los metadatos del usuario en Supabase Auth
  const userMeta = data.user?.user_metadata || {};
  const sessionUser = {
    rol: userMeta.rol || 'ADMIN',
    nombre: userMeta.nombre || data.user?.email || 'Administrador',
    idUsuario: data.user?.id,
  };

  localStorage.setItem('cm_user', JSON.stringify(sessionUser));

  return {
    token: data.session?.access_token,
    ...sessionUser,
  };
};

/**
 * Cierra la sesión en Supabase y limpia el localStorage.
 */
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('cm_user');
  localStorage.removeItem('cm_token');
};

/**
 * Retorna el token de acceso activo de la sesión de Supabase.
 */
export const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
};

/**
 * Retorna los datos del usuario almacenados en localStorage.
 */
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('cm_user') || 'null');
  } catch {
    return null;
  }
};

/**
 * Verifica si hay una sesión activa en Supabase.
 */
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data?.session;
};
