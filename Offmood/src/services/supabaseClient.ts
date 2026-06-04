import axios from 'axios';

const supabaseClient = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});

export default supabaseClient;