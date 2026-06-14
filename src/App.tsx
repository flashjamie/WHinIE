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
