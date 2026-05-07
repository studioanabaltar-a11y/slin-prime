import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCleanup() {
  console.log('🚀 Tentativa Final de Limpeza...');

  try {
    // Pegar clinic_id de qualquer agendamento existente
    const { data: apps } = await supabase.from('appointments').select('clinic_id').limit(1);
    const clinicId = apps?.[0]?.clinic_id;

    if (clinicId) {
      console.log(`📍 Clínica Detectada: ${clinicId}`);
      await supabase.from('transactions').delete().eq('clinic_id', clinicId);
      await supabase.from('appointments').delete().eq('clinic_id', clinicId);
      await supabase.from('patients').delete().eq('clinic_id', clinicId);
      console.log('✨ Dados da clínica removidos.');
    } else {
      console.log('⚠️ Nenhum clinic_id encontrado via appointments. Tentando delete direto...');
      await supabase.from('transactions').delete().filter('id', 'neq', '0');
      await supabase.from('appointments').delete().filter('id', 'neq', '0');
      await supabase.from('patients').delete().filter('id', 'neq', '0');
    }
  } catch (e) {
    console.error('Erro:', e);
  }
}

finalCleanup();
