import React from 'react';
import { useGame } from '../../context/GameContext';
import { TABS, ZH } from '../../data/constants';

// ─── Bottom Nav Tab ───────────────────────────────────────────────────────────
interface BottomTabProps {
  label:   string;
  emoji:   string;
  active:  boolean;
  onClick: () => void;
}

function BottomTab({ label, emoji, active, onClick }: BottomTabProps) {
  return (
    <button onClick={onClick} style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 2,
      padding: '6px 2px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.15s',
    }}>
      {/* Active indicator line on top */}
      {active && (
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%',
          height: 2,
          background: 'linear-gradient(90deg, #FFD700, #C9A040)',
          borderRadius: '0 0 2px 2px',
        }} />
      )}
      <span style={{ fontSize: active ? 18 : 16, transition: 'font-size 0.15s' }}>{emoji}</span>
      <span style={{
        fontSize: 7,
        fontWeight: active ? 900 : 500,
        color: active ? '#FFE580' : '#A0784A',
        letterSpacing: '0.04em',
        fontFamily: "'Noto Sans TC', 'Itim', sans-serif",
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        textShadow: active ? '0 0 6px rgba(255,215,0,0.5)' : 'none',
      }}>{label}</span>
    </button>
  );
}

// ─── Parchment fiber overlay ──────────────────────────────────────────────────
function FiberOverlay() {
  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 1, pointerEvents: 'none',
        opacity: 0.15,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="fiber-noise-p">
        <feTurbulence type="fractalNoise" baseFrequency="0.75 0.08"
          numOctaves="3" seed="7" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
        <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
      </filter>
      <rect width="100%" height="100%" fill="#8B5E3C" filter="url(#fiber-noise-p)" />
    </svg>
  );
}

// ─── Notebook Container ───────────────────────────────────────────────────────
export function NotebookContainer({ children }: { children: React.ReactNode }) {
  const { state, navigate } = useGame();
  const { currentScreen }   = state;

  // Split tabs: main nav (first 7) stay in bottom bar; setup pinned separately
  const mainTabs = TABS;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 30% 60%, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Portrait notebook frame */}
      <div style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        maxHeight: 900,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        filter: 'drop-shadow(8px 8px 20px rgba(0,0,0,0.8))',
      }}>

        {/* Top strip — horizontal spine */}
        <div style={{
          flexShrink: 0,
          height: 14,
          background: 'linear-gradient(180deg, #5C3317 0%, #3D1F0A 100%)',
          border: '3px solid #1A0D06',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-evenly',
          boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.5)',
        }}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #C9A96E, #7B5A2A)',
              border: '1px solid #2A1208',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }} />
          ))}
        </div>

        {/* Page area — parchment */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: '#F5EDD6',
          backgroundImage: `
            radial-gradient(ellipse at 5% 5%,   rgba(139,90,43,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 95% 10%,  rgba(139,90,43,0.08) 0%, transparent 35%),
            radial-gradient(ellipse at 15% 95%,  rgba(139,90,43,0.10) 0%, transparent 40%),
            radial-gradient(ellipse at 85% 90%,  rgba(139,90,43,0.07) 0%, transparent 35%),
            repeating-linear-gradient(
              0deg,
              transparent 0px, transparent 18px,
              rgba(139,90,43,0.025) 18px, rgba(139,90,43,0.025) 19px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 24px,
              rgba(139,90,43,0.015) 24px, rgba(139,90,43,0.015) 25px
            )
          `,
          border: '3px solid #2A1208',
          borderTop: 'none',
          borderBottom: 'none',
        }}>
          <FiberOverlay />

          {/* Corner age stains */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 100, height: 100,
            background: 'radial-gradient(ellipse at 0% 0%, rgba(101,67,33,0.18) 0%, transparent 70%)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 80, height: 80,
            background: 'radial-gradient(ellipse at 100% 100%, rgba(101,67,33,0.15) 0%, transparent 70%)',
            zIndex: 2, pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </div>

        {/* Bottom navigation bar */}
        <div style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, #2C1810 0%, #1A0D06 100%)',
          border: '3px solid #1A0D06',
          borderTop: '2px solid #3D1F0A',
          borderRadius: '0 0 4px 4px',
          boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          padding: '2px 0 4px',
          paddingBottom: 'env(safe-area-inset-bottom, 4px)',
        }}>
          {mainTabs.map(tab => (
            <BottomTab
              key={tab.id}
              label={tab.label}
              emoji={tab.emoji}
              active={currentScreen === tab.id}
              onClick={() => navigate(tab.id)}
            />
          ))}
          {/* Setup tab */}
          <BottomTab
            label="角色"
            emoji="⚙️"
            active={currentScreen === 'SETUP'}
            onClick={() => navigate('SETUP')}
          />
        </div>
      </div>
    </div>
  );
}
