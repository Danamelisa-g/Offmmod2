import axios from 'axios';
import { supabase } from '../supabaseClient/supabaseprincipal';

const supabaseClient = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`,
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  },
});

// Interceptor que agrega el token del usuario autenticado en cada petición
supabaseClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    config.headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
  }
  return config;
});

export default supabaseClient;