import React from 'react';
import { useGame } from '../../context/GameContext';
import { TABS, ZH } from '../../data/constants';

// ─── Tab color palette (one per tab) ─────────────────────────────────────────
const TAB_COLORS = [
  '#7B4A2A', // HOME    — warm brown
  '#1A5C38', // AIB     — forest green
  '#2A3D8B', // Task    — navy
  '#6B2D8B', // Guild   — purple
  '#2E7D5A', // Thrift  — teal
  '#8B3A5A', // Bag     — berry
  '#4A6B2A', // Collect — olive
  '#7A4A1A', // Setup   — leather
];

// ─── Parchment fiber overlay ──────────────────────────────────────────────────
function FiberOverlay() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%',
      zIndex:1, pointerEvents:'none', opacity:0.12 }}
      xmlns="http://www.w3.org/2000/svg">
      <filter id="fnp">
        <feTurbulence type="fractalNoise" baseFrequency="0.75 0.08" numOctaves="3" seed="7" result="n"/>
        <feColorMatrix type="saturate" values="0" in="n" result="g"/>
        <feBlend in="SourceGraphic" in2="g" mode="multiply"/>
      </filter>
      <rect width="100%" height="100%" fill="#8B5E3C" filter="url(#fnp)"/>
    </svg>
  );
}

// ─── Notebook Container ───────────────────────────────────────────────────────
export function NotebookContainer({ children }: { children: React.ReactNode }) {
  const { state, navigate } = useGame();
  const { currentScreen }   = state;

  const allTabs = [
    ...TABS,
    { id: 'SETUP' as const, label: '角色', emoji: '⚙️' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 30% 60%, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Book frame */}
      <div style={{
        width: '100%', maxWidth: 430,
        height: '100%', maxHeight: 900,
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        filter: 'drop-shadow(10px 10px 28px rgba(0,0,0,0.85))',
      }}>

        {/* Top spine strip with rivets */}
        <div style={{
          flexShrink: 0, height: 16,
          background: 'linear-gradient(180deg, #5C3317 0%, #3A1C0A 100%)',
          border: '2px solid #1A0D06', borderBottom: 'none',
          borderRadius: '5px 5px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
          boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.5)',
        }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #C9A96E, #7B5A2A)',
              border: '1px solid #2A1208',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}/>
          ))}
        </div>

        {/* Middle: spine + page + tabs */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'row',
          border: '2px solid #1A0D06',
          borderTop: 'none', borderBottom: 'none',
          overflow: 'hidden',
        }}>

          {/* Left book spine */}
          <div style={{
            width: 18, flexShrink: 0,
            background: 'linear-gradient(90deg, #2C1208 0%, #4A2510 40%, #3A1C0C 100%)',
            position: 'relative',
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.45)',
          }}>
            {/* Spine stitching lines */}
            {[0.15,0.35,0.55,0.75,0.90].map((pos,i) => (
              <div key={i} style={{
                position: 'absolute', left: 4, right: 4,
                top: `${pos * 100}%`,
                height: 1,
                background: 'rgba(201,169,110,0.2)',
              }}/>
            ))}
          </div>

          {/* Page area — parchment */}
          <div style={{
            flex: 1,
            position: 'relative',
            background: '#F5EDD6',
            backgroundImage: `
              radial-gradient(ellipse at 5% 5%,   rgba(139,90,43,0.12) 0%, transparent 40%),
              radial-gradient(ellipse at 95% 10%,  rgba(139,90,43,0.08) 0%, transparent 35%),
              radial-gradient(ellipse at 15% 95%,  rgba(139,90,43,0.10) 0%, transparent 40%),
              radial-gradient(ellipse at 85% 90%,  rgba(139,90,43,0.07) 0%, transparent 35%),
              repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(139,90,43,0.025) 22px, rgba(139,90,43,0.025) 23px)
            `,
            overflow: 'hidden',
          }}>
            <FiberOverlay />

            {/* Age stains */}
            <div style={{ position:'absolute', top:0, left:0, width:80, height:80, zIndex:2, pointerEvents:'none',
              background:'radial-gradient(ellipse at 0% 0%, rgba(101,67,33,0.15) 0%, transparent 70%)' }}/>
            <div style={{ position:'absolute', bottom:0, right:0, width:60, height:60, zIndex:2, pointerEvents:'none',
              background:'radial-gradient(ellipse at 100% 100%, rgba(101,67,33,0.12) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div style={{ position:'absolute', inset:0, zIndex:3, overflowY:'auto' }}>
              {children}
            </div>
          </div>

          {/* Right-side book tabs */}
          <div style={{
            width: 36, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            background: '#2C1208',
            borderLeft: '1.5px solid #1A0A04',
            position: 'relative',
          }}>
            {allTabs.map((tab, i) => {
              const isActive = currentScreen === tab.id;
              const color    = TAB_COLORS[i] ?? '#5C3A2A';
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 2,
                    border: 'none',
                    borderBottom: i < allTabs.length - 1 ? '1px solid rgba(0,0,0,0.35)' : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s',
                    // Active tab pops out to the left
                    background: isActive
                      ? color
                      : `linear-gradient(90deg, ${color}99 0%, ${color}66 100%)`,
                    transform: isActive ? 'translateX(-4px)' : 'none',
                    zIndex: isActive ? 10 : 1,
                    boxShadow: isActive ? '-3px 0 8px rgba(0,0,0,0.5)' : 'none',
                    // Left notch for active tab
                    borderLeft: isActive ? '3px solid #FFD700' : '3px solid transparent',
                    padding: '2px 0',
                  }}
                >
                  <span style={{ fontSize: isActive ? 14 : 12, lineHeight: 1 }}>
                    {tab.emoji}
                  </span>
                  <span style={{
                    fontSize: 6,
                    fontWeight: isActive ? 900 : 500,
                    color: isActive ? '#FFE580' : 'rgba(255,220,150,0.6)',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    letterSpacing: '0.05em',
                    fontFamily: "'Noto Sans TC', sans-serif",
                    userSelect: 'none',
                    lineHeight: 1,
                    maxHeight: 38,
                    overflow: 'hidden',
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom edge — fore-edge pages effect */}
        <div style={{
          flexShrink: 0, height: 10,
          borderRadius: '0 0 5px 5px',
          border: '2px solid #1A0D06', borderTop: 'none',
          background: 'repeating-linear-gradient(0deg, #F5EDD6 0px, #E8DFC8 1px, #F2EBD9 2px, #F5EDD6 3px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        }}/>

      </div>
    </div>
  );
}
