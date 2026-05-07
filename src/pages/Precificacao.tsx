import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Plus, 
  Calculator, 
  Package, 
  DollarSign, 
  Info,
  ChevronRight,
  Save,
  X
} from 'lucide-react';

interface Material {
  id: string;
  name: string;
  cost: number;
  unit: string;
}

export default function Precificacao() {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Toxina Botulínica (100u)', cost: 950, unit: 'frasco' },
    { id: '2', name: 'Ácido Hialurônico (1ml)', cost: 450, unit: 'seringa' },
    { id: '3', name: 'Seringas/Agulhas (Kit)', cost: 15, unit: 'kit' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculation, setCalculation] = useState({
    name: '',
    materialCost: 0,
    profCommission: 20, // %
    markup: 2.5, // Fator multiplicador
    salePrice: 0
  });

  const calculateTotal = () => {
    const totalCost = calculation.materialCost;
    const commissionVal = (calculation.salePrice * calculation.profCommission) / 100;
    const profit = calculation.salePrice - totalCost - commissionVal;
    return { profit, margin: (profit / calculation.salePrice) * 100 };
  };

  const results = calculateTotal();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Calculator className="text-accent" size={32} />
            Precificação Inteligente
          </h1>
          <p className="text-slate-500 mt-1">Calcule a lucratividade real de cada procedimento</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-accent text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-accent/20 flex items-center gap-2 hover:bg-accent/90 transition-all">
          <Plus size={20} /> Novo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulador de Preço */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl space-y-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-accent" size={20} /> Simulador de Margem
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Procedimento</label>
                <input type="text" placeholder="Ex: Aplicação Botox Full" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Preço de Venda (R$)</label>
                <input 
                  type="number" 
                  value={calculation.salePrice} 
                  onChange={e => setCalculation({...calculation, salePrice: parseFloat(e.target.value) || 0})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent font-bold text-accent text-xl" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">Custo Mat. <Info size={12} className="text-slate-300" /></label>
                <input 
                  type="number" 
                  value={calculation.materialCost}
                  onChange={e => setCalculation({...calculation, materialCost: parseFloat(e.target.value) || 0})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-accent font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Comissão (%)</label>
                <input 
                   type="number" 
                   value={calculation.profCommission}
                   onChange={e => setCalculation({...calculation, profCommission: parseFloat(e.target.value) || 0})}
                   className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-accent font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Markup (Sugestão)</label>
                <div className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-400">
                  x {calculation.salePrice > 0 ? (calculation.salePrice / (calculation.materialCost || 1)).toFixed(2) : '0'}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-6 rounded-3xl">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Lucro Líquido</p>
                  <p className="text-2xl font-black text-emerald-700">R$ {results.profit.toFixed(2)}</p>
                </div>
                <div className="bg-accent/5 p-6 rounded-3xl border border-accent/10">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Margem de Lucro</p>
                  <p className="text-2xl font-black text-accent">{results.margin ? Math.round(results.margin) : 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Insumos */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package className="text-accent" size={20} /> Banco de Insumos
            </h2>
            <div className="space-y-4">
              {materials.map(mat => (
                <div key={mat.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{mat.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Custo: R$ {mat.cost.toFixed(2)} / {mat.unit}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
              <Save size={18} /> SALVAR TABELA DE PREÇOS
            </button>
          </div>
        </div>
      </div>

      {/* Modal Novo Insumo */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">Novo Insumo</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-500">Nome do Insumo</label>
                   <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent" placeholder="Ex: Cânula 22G" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">Custo (R$)</label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent" placeholder="0,00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">Unidade</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent">
                        <option>Frasco</option>
                        <option>Unidade</option>
                        <option>Kit</option>
                      </select>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-full py-5 bg-accent text-white font-bold rounded-2xl shadow-lg hover:bg-accent/90">ADICIONAR AO BANCO</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
