import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTriggers() {
  const { data, error } = await supabase.rpc('get_triggers');
  
  if (error) {
    console.log('RPC get_triggers failed, trying query...');
    // We can't query pg_trigger directly usually, but let's try a different RPC or just skip
    console.error(error);
  } else {
    console.log('Triggers:', data);
  }
}

checkTriggers();
