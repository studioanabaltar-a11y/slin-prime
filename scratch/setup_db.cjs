const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://pibtrbmtxrqayhdagzla.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnRyYm10eHJxYXloZGFnemxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTA2ODksImV4cCI6MjA5MzY4NjY4OX0.rBmXJuLiJsAUrCg-BYlmmsiMAiq52hmbaWtQg3CSBeU');

async function setup() {
  console.log('Iniciando criação das tabelas financeiras...');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.transactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now(),
      amount DECIMAL(10,2) NOT NULL,
      description TEXT,
      type TEXT CHECK (type IN ('income', 'expense')),
      category TEXT,
      payment_method TEXT,
      clinic_id UUID,
      patient_id UUID REFERENCES public.patients(id),
      appointment_id UUID REFERENCES public.appointments(id)
    );

    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    
    -- Política simples para permitir tudo (pode ser refinada depois)
    CREATE POLICY "Allow all for authenticated" ON public.transactions FOR ALL TO authenticated USING (true);
  `;

  const { data, error } = await supabase.rpc('run_sql', { sql });
  
  if (error) {
    console.error('Erro ao configurar banco:', error);
  } else {
    console.log('✅ Tabelas financeiras criadas com sucesso!');
  }
}

setup();
