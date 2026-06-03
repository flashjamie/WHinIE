import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const COLORS = ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#00FF41'];

export function ParticlesBurst() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (!state.showParticles) return;
    const t = setTimeout(() => dispatch({ type: 'HIDE_PARTICLES' }), 2800);
    return () => clearTimeout(t);
  }, [state.showParticles, dispatch]);

  if (!state.showParticles) return null;

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 65,
    size: 6 + Math.random() * 16,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.6,
    round: Math.random() > 0.5,
    rot: Math.random() * 360,
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: p.color,
          border: '2px solid #000',
          borderRadius: p.round ? '50%' : '2px',
          animation: `particleFall 1.8s ease-out ${p.delay}s both`,
        }} />
      ))}
      {/* ☘️ centre pulse */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 48,
        animation: 'pulseRing 1.2s ease-out 0.2s both',
      }}>☘️</div>
    </div>
  );
}
