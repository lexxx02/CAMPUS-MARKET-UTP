// ============================================================
// Supabase Client — Conexión directa a Supabase
// ============================================================
// Reemplaza la necesidad del backend de Render (Spring Boot).
// Usa las variables de entorno de Vite para las credenciales.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl || '').trim();
const supabaseAnonKey = (rawKey || '').trim();

console.log('[Supabase] URL:', JSON.stringify(supabaseUrl));
console.log('[Supabase] Key defined:', !!supabaseAnonKey, '| Length:', supabaseAnonKey.length);
console.log('[Supabase] Key chars (last 5):', JSON.stringify(supabaseAnonKey.slice(-5)));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
