import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function findByAmount() {
  console.log('💰 Buscando transações por valor...');
  const { data: trans, error } = await supabase.from('transactions').select('*').eq('amount', 890);
  
  if (error) console.error('Erro na busca:', error.message);
  console.log('Transações de R$ 890 encontradas:', trans?.length || 0);

  if (trans && trans.length > 0) {
    for (const t of trans) {
      const { error: delErr } = await supabase.from('transactions').delete().eq('id', t.id);
      if (delErr) console.error(`Erro ao deletar transação ${t.id}:`, delErr.message);
      else console.log(`✅ Transação ${t.id} removida.`);
    }
  }

  // Tentar apagar agendamentos novamente
  const { error: appErr } = await supabase.from('appointments').delete().filter('id', 'neq', '0');
  if (appErr) console.error('Erro Final nos Agendamentos:', appErr.message);
  else console.log('✅✅ TUDO LIMPO! Agendamentos removidos.');
}

findByAmount();
