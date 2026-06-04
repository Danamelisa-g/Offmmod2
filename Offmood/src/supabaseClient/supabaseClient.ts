import { createClient } from '@supabase/supabase-js'

// Usamos import.meta.env para acceder a las variables de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
