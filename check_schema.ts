import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error fetching clinics:', error);
  } else {
    console.log('Clinic columns:', Object.keys(data[0] || {}));
  }

  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (pError) {
    console.error('Error fetching profiles:', pError);
  } else {
    console.log('Profile columns:', Object.keys(profiles[0] || {}));
  }
}

checkSchema();
