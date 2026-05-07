import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key missing in environment variables.');
}

// Cria o cliente garantindo que os valores existam ou sejam strings vazias para evitar erros fatais imediatos
// mas mantendo o log de erro acima para debug.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

