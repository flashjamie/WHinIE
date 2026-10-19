import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { NotebookContainer } from './components/layout/NotebookContainer';
import { ParticlesBurst } from './components/shared/ParticlesBurst';
import { CoverScreen }       from './components/screens/CoverScreen';
import { SetupScreen }       from './components/screens/SetupScreen';
import { HomeScreen }        from './components/screens/HomeScreen';
import { TaskScreen }        from './components/screens/TaskScreen';
import { CollectionsScreen } from './components/screens/CollectionsScreen';
import { ThriftScreen }      from './components/screens/ThriftScreen';
import { BagScreen }         from './components/screens/BagScreen';
import { AIBScreen }         from './components/screens/AIBScreen';
import { GuildScreen }       from './components/screens/GuildScreen';
import { GOOGLE_FONTS_URL }  from './data/constants';

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('${GOOGLE_FONTS_URL}');

  /* ── Font custom properties ─────────────────────────────────── */
  :root {
    --font-en:  'Itim', 'Cre Happiness', cursive;
    --font-zh:  'Noto Sans TC', 'Microsoft JhengHei UI', 'Microsoft JhengHei',
                'PingFang TC', 'Heiti TC', sans-serif;
    /* Combined: Itim handles Latin/numbers; CJK falls through to Noto Sans TC */
    --font-all: 'Itim', 'Noto Sans TC', 'Microsoft JhengHei UI',
                'PingFang TC', 'Heiti TC', sans-serif;
  }

  /* ── Reset ───────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: #1a0d06; }
  #root { width: 100%; height: 100%; }

  /* ── STRICT font enforcement on every element ────────────────
     Itim covers Latin/numbers; Noto Sans TC covers CJK.
     Any inline fontFamily with Georgia/serif/monospace/cursive
     is overridden here. PMingLiU / MingLiU never appear.      */
  *, *::before, *::after {
    font-family: var(--font-all) !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-synthesis: none;
  }

  /* SVG text elements also inherit */
  text, tspan {
    font-family: var(--font-all) !important;
  }

  /* ── High-contrast baseline ─────────────────────────────────── */
  * { color-scheme: light; }

  /* ── Scrollbar ───────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f0ece0; }
  ::-webkit-scrollbar-thumb { background: #888; border: 1px solid #000; }

  /* ── Animations ─────────────────────────────────────────────── */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes particleFall {
    0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(220px) rotate(720deg) scale(0.3); opacity: 0; }
  }
  @keyframes pulseRing {
    0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.9; }
    100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes badgeIn {
    0%   { opacity: 0; transform: translateY(-60px) scale(0.7); }
    60%  { transform: translateY(6px) scale(1.04); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes badgeOut {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(0.85); }
  }
  @keyframes badgeShine {
    0%   { left: -80%; }
    100% { left: 130%; }
  }

  /* ── Native date/time input ─────────────────────────────────── */
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer; opacity: 0.6;
  }
  input:focus { outline: none; }
`;

// ─── Screen Router ────────────────────────────────────────────────────────────
function ScreenRouter() {
  const { state } = useGame();

  switch (state.currentScreen) {
    case 'SETUP':       return <SetupScreen />;
    case 'HOME':        return <HomeScreen />;
    case 'TASK':        return <TaskScreen />;
    case 'COLLECTIONS': return <CollectionsScreen />;
    case 'DUNNES':      return <ThriftScreen />;
    case 'BAG':         return <BagScreen />;
    case 'AIB':         return <AIBScreen />;
    case 'GUILD':       return <GuildScreen />;
    default:            return <HomeScreen />;
  }
}

// ─── Badge Unlock Toast ───────────────────────────────────────────────────────
function BadgeToast() {
  const { newBadge, clearBadge } = useGame();
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    if (!newBadge) { setExiting(false); return; }
    setExiting(false);
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(clearBadge, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [newBadge, clearBadge]);

  if (!newBadge) return null;

  return (
    <div
      onClick={() => { setExiting(true); setTimeout(clearBadge, 400); }}
      style={{
        position: 'fixed', top: 18, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, cursor: 'pointer',
        animation: exiting ? 'badgeOut 0.4s ease-in forwards' : 'badgeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}
    >
      <div style={{
        background: '#1a0a00',
        border: `3px solid ${newBadge.color}`,
        boxShadow: `0 0 0 1px #000, 0 8px 32px rgba(0,0,0,0.55), 0 0 20px ${newBadge.color}66`,
        padding: '12px 20px 12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        minWidth: 220, position: 'relative', overflow: 'hidden',
      }}>
        {/* Shine sweep */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          animation: 'badgeShine 1.2s ease-in-out 0.3s both',
          pointerEvents: 'none',
        }} />
        {/* Color strip */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: newBadge.color,
        }} />
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          border: `2.5px solid ${newBadge.color}`,
          background: `${newBadge.color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}>{newBadge.emoji}</div>
        <div>
          <div style={{
            fontSize: 9, color: newBadge.color, fontWeight: 900,
            letterSpacing: '0.15em', marginBottom: 2,
            fontFamily: "'Itim', cursive",
          }}>✦ 徽章解鎖！</div>
          <div style={{
            fontSize: 14, fontWeight: 900, color: '#fff',
            fontFamily: "'Noto Sans TC', sans-serif",
          }}>【{newBadge.title}】</div>
          <div style={{
            fontSize: 10, color: '#c0a070', marginTop: 2,
            fontFamily: "'Noto Sans TC', sans-serif",
          }}>{newBadge.desc}</div>
        </div>
      </div>
    </div>
  );
}

// ─── App Inner (needs context) ────────────────────────────────────────────────
function AppInner() {
  const { state } = useGame();

  // Inject global CSS once
  useEffect(() => {
    const existing = document.getElementById('whinie-global-css');
    if (existing) return;
    const style = document.createElement('style');
    style.id = 'whinie-global-css';
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => { document.getElementById('whinie-global-css')?.remove(); };
  }, []);

  // Cover screen renders outside the notebook
  if (state.currentScreen === 'COVER') return <CoverScreen />;

  return (
    <>
      <BadgeToast />
      <ParticlesBurst />
      <NotebookContainer>
        <ScreenRouter />
      </NotebookContainer>
    </>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
