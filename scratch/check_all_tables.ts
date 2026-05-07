import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAll() {
  const tables = ['clinics', 'profiles', 'plans', 'subscriptions', 'appointments', 'transactions', 'patients', 'services', 'professionals'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: Not found or error (${error.message})`);
    } else {
      console.log(`Table ${table}: OK. Columns:`, Object.keys(data[0] || {}));
    }
  }
}

checkAll();
