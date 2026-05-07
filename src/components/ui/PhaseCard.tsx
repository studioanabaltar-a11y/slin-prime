import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface PhaseCardProps {
  number: string;
  title: string;
  description: string;
  features: string[];
  accent: string;
}

export default function PhaseCard({ number, title, description, features, accent }: PhaseCardProps) {
  const accentColor = accent === 'primary' ? 'bg-primary' : accent === 'primary-600' ? 'bg-primary-600' : 'bg-secondary';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-surface rounded-3xl p-8 shadow-ambient border border-outline-variant/30 flex flex-col relative overflow-hidden h-full"
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${accentColor}`} />
      <div className="flex items-center gap-4 mb-6">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${accentColor} text-white`}>
          {number}
        </span>
        <h3 className="font-display text-xl font-bold text-on-background tracking-tight">{title}</h3>
      </div>
      <p className="text-on-surface-variant flex-grow mb-8 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm font-medium text-on-surface">
            <CheckCircle2 size={16} className={accent === 'primary' ? 'text-primary' : 'text-primary-600'} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
