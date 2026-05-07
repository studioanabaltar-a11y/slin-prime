import React, { useEffect } from 'react';

export default function GridBackground() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty('--mouse-x', `${e.clientX}px`);
      root.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Base Neutral Dots - Very subtle so it doesn't bother the text */}
      <div 
        className="absolute inset-0 opacity-[0.12]" 
        style={{
          backgroundImage: `radial-gradient(circle, #94a3b8 0.6px, transparent 0.6px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Spotlight revealed Dots - Golden Amber, small and sharp */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `radial-gradient(circle, #F59E0B 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          WebkitMaskImage: `radial-gradient(350px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), black 10%, transparent 100%)`,
          maskImage: `radial-gradient(350px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), black 10%, transparent 100%)`,
        }}
      />

      {/* Ambient Glow - Extremely subtle aura */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(245, 158, 11, 0.02), transparent 100%)`,
        }}
      />
    </div>
  );
}
