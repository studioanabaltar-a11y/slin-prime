import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrate() {
  console.log('Starting migration for materials table...');
  
  // Since we cannot run raw SQL easily via PostgREST for DDL, 
  // I will try to insert a dummy record to a table 'materials'.
  // If it fails with 'relation "public.materials" does not exist', 
  // then we know we need to ask the user to run the SQL in Supabase Dashboard.
  
  const { error } = await supabase.from('materials').insert({ name: 'Test', cost: 0, clinic_id: 'dummy' });
  
  if (error && error.code === 'PGRST116') {
     console.log('Table "materials" does not exist. Please run this SQL in your Supabase SQL Editor:');
     console.log(`
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their clinic's materials" ON materials
  USING (clinic_id IN (SELECT clinic_id FROM profiles WHERE id = auth.uid()));
     `);
  } else if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Table "materials" exists or was just created!');
  }
}

migrate();
