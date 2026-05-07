import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  negative?: boolean;
  sub?: string;
}

export default function MetricCard({ label, value, icon, negative, sub }: MetricCardProps) {
  return (
    <div className="bg-luxury-black rounded-[24px] p-6 border border-luxury-gold/10 flex flex-col justify-between h-40 group hover:border-luxury-gold/30 transition-all duration-500 shadow-xl">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none">{label}</span>
        <div className={`p-2.5 rounded-xl transition-all duration-500 ${negative ? 'bg-error/20 text-error' : 'bg-luxury-gold/10 text-luxury-gold group-hover:scale-110'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-serif font-bold tracking-tight ${negative ? 'text-error' : 'text-white'}`}>{value}</p>
        {sub && <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-widest mt-1 opacity-60">{sub}</p>}
      </div>
    </div>
  );
}
