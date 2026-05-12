// ============================================================
// Auth Service – Simulated authentication
// ============================================================

import { ADMIN_CREDENTIALS } from '../data/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const loginAdmin = async (username, password) => {
  await delay();
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const token = 'mock-jwt-token-' + Date.now();
    const user = {
      id: 1,
      username: 'admin',
      name: 'Administrador UTP',
      role: 'admin',
      avatar: null,
    };
    localStorage.setItem('cm_token', token);
    localStorage.setItem('cm_user', JSON.stringify(user));
    return { token, user };
  }
  throw new Error('Credenciales inválidas. Intente nuevamente.');
};

export const logoutAdmin = async () => {
  await delay(200);
  localStorage.removeItem('cm_token');
  localStorage.removeItem('cm_user');
  return { success: true };
};

export const getStoredAuth = () => {
  const token = localStorage.getItem('cm_token');
  const user = localStorage.getItem('cm_user');
  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('cm_token');
};
