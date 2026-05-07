const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://pibtrbmtxrqayhdagzla.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnRyYm10eHJxYXloZGFnemxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTA2ODksImV4cCI6MjA5MzY4NjY4OX0.rBmXJuLiJsAUrCg-BYlmmsiMAiq52hmbaWtQg3CSBeU');

async function checkSchema() {
  const { data, error } = await supabase.from('transactions').select('*').limit(1);
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Data:', data);
  }
}
checkSchema();
