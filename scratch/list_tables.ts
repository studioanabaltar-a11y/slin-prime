import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
  // Query to get table names from public schema
  const { data, error } = await supabase.rpc('get_tables');
  
  if (error) {
    // If RPC doesn't exist, try a different approach
    console.log('RPC get_tables failed, trying raw query...');
    const { data: rawData, error: rawError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (rawError) {
      console.error('Error listing tables:', rawError);
    } else {
      console.log('Tables:', rawData.map(t => t.tablename));
    }
  } else {
    console.log('Tables:', data);
  }
}

listTables();
