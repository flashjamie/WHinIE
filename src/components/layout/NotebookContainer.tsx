import React from 'react';
import { useGame } from '../../context/GameContext';
import { TABS, ZH } from '../../data/constants';

export function NotebookContainer({ children }: { children: React.ReactNode }) {
  const { state, navigate } = useGame();
  const { currentScreen }   = state;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 6,
    }}>
      {/* Notebook */}
      <div style={{
        width: '100%', maxWidth: 1080,
        height: '100%', maxHeight: 640,
        display: 'flex',
        border: '5px solid #000',
        boxShadow: '10px 10px 0 #000, 0 0 40px rgba(0,0,0,0.6)',
        position: 'relative',
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.08) 0px, transparent 12px)',
      }}>
        {/* Page area */}
        <div style={{
          flex: 1, overflow: 'hidden', position: 'relative',
          background: '#FDFBF7',
          backgroundImage: `
            radial-gradient(ellipse at 10% 80%, rgba(139,90,43,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 20%, rgba(139,90,43,0.03) 0%, transparent 50%)
          `,
        }}>
          {children}
        </div>

        {/* Leather Tab Bar – right side */}
        <div style={{
          width: 46, flexShrink: 0,
          background: 'linear-gradient(180deg,#3D1F0A 0%,#2C1810 50%,#1A0D06 100%)',
          display: 'flex', flexDirection: 'column',
          borderLeft: '4px solid #000',
        }}>
          {TABS.map(tab => {
            const active = currentScreen === tab.id;
            return (
              <button key={tab.id}
                onClick={() => navigate(tab.id)}
                title={tab.label}
                style={{
                  flex: 1, border: 'none', cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(to right,#FDFBF7 0%,#f5f0e8 100%)'
                    : 'transparent',
                  color: active ? '#000' : '#C9A96E',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: 9, fontWeight: active ? 900 : 400,
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  padding: '4px 2px', transition: 'all 0.15s',
                  letterSpacing: '0.06em', position: 'relative',
                  ...ZH,
                }}>
                {active && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: 3, background: '#FFD700',
                  }} />
                )}
                {tab.label}
              </button>
            );
          })}

          {/* SETUP tab pinned at bottom */}
          <button
            onClick={() => navigate('SETUP')}
            title="角色設定"
            style={{
              flexShrink: 0, height: 48, border: 'none', cursor: 'pointer',
              background: currentScreen === 'SETUP'
                ? 'linear-gradient(to right,#FDFBF7,#f5f0e8)'
                : '#FFD700',
              color: '#000', writingMode: 'vertical-rl',
              fontSize: 9, fontWeight: 900,
              borderTop: '3px solid #000', padding: '4px 2px',
              position: 'relative', ...ZH,
            }}>
            {currentScreen === 'SETUP' ? '▶ 設定中' : '⚙ 角色'}
          </button>
        </div>
      </div>
    </div>
  );
}
