import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  to?: string;
  variant?: 'light' | 'dark';
}

export default function NavItem({ icon, label, badge, to = '#', variant = 'light' }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const themes = {
    light: {
      active: 'bg-accent text-white shadow-lg shadow-accent/20',
      inactive: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
      iconActive: 'text-white',
      iconInactive: 'text-outline-variant'
    },
    dark: {
      active: 'bg-accent text-white shadow-lg shadow-accent/20',
      inactive: 'text-slate-400 hover:bg-white/5 hover:text-white',
      iconActive: 'text-white',
      iconInactive: 'text-slate-500'
    }
  };

  const theme = themes[variant];

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-medium ${isActive ? theme.active : theme.inactive}`}
    >
      <span className={isActive ? theme.iconActive : theme.iconInactive}>{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {badge && <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </Link>
  );
}
