import React from 'react';
import { useGame } from '../../context/GameContext';
import { ThreeWorldClocks } from '../shared/WorldClock';
import { buildAvatarUrl, ZH, EN } from '../../data/constants';

// ─── Airport window silhouette ────────────────────────────────────────────────
function AirportWindow() {
  const { state, derived } = useGame();
  const { transitTz }      = derived;
  const { transitHubs, airlines } = state.player;

  const skyColors: Record<string, [string, string]> = {
    Dubai:       ['#FF6B35', '#C4501E'],
    Istanbul:    ['#6B3FA0', '#2D1B69'],
    Doha:        ['#E67E22', '#8B4513'],
    'Hong Kong': ['#1a1a2e', '#16213e'],
    Amsterdam:   ['#2C3E50', '#3498DB'],
    London:      ['#4A4A6A', '#2C2C4A'],
    Paris:       ['#2C3E50', '#8E44AD'],
    Frankfurt:   ['#1C1C2E', '#2D4059'],
  };
  const [sky1, sky2] = skyColors[transitTz.name] ?? ['#0D0D2B', '#1B1B3A'];

  const Silhouette = () => {
    switch (transitTz.name) {
      case 'Dubai': return (
        <g fill="#0a0a1a" opacity="0.95">
          <rect x="190" y="15" width="7"  height="145" />
          <rect x="185" y="60" width="17" height="100" />
          <rect x="178" y="100" width="31" height="60" />
          <rect x="168" y="130" width="51" height="30" />
          <rect x="80"  y="110" width="35" height="70" />
          <rect x="230" y="105" width="40" height="75" />
          <rect x="280" y="90"  width="28" height="90" />
        </g>
      );
      case 'Istanbul': return (
        <g fill="#0a0a1a" opacity="0.95">
          <ellipse cx="200" cy="105" rx="52" ry="38" />
          <rect x="158" y="105" width="84" height="65" />
          <rect x="142" y="50"  width="11" height="120" />
          <polygon points="142,50 147,32 153,50" />
          <rect x="247" y="50"  width="11" height="120" />
          <polygon points="247,50 252,32 258,50" />
          <rect x="50"  y="130" width="38" height="50" />
          <rect x="312" y="120" width="42" height="60" />
        </g>
      );
      case 'Hong Kong': return (
        <g fill="#0a0a1a" opacity="0.95">
          {[30,62,95,127,163,193,220,258,290,330,366].map((x, i) => (
            <rect key={i} x={x} y={[120,100,78,55,42,35,50,70,88,100,115][i]} width={[28,32,24,28,22,18,30,24,32,28,24][i]} height={[60,80,102,125,138,145,130,110,92,80,65][i]} />
          ))}
        </g>
      );
      default: return (
        <g fill="#0a0a1a" opacity="0.95">
          <rect x="188" y="45"  width="24" height="135" />
          <rect x="178" y="38"  width="44" height="16" />
          <rect x="168" y="50"  width="64" height="8" />
          <circle cx="200" cy="35" r="12" />
          <rect x="60"  y="130" width="100" height="50" />
          <rect x="240" y="130" width="100" height="50" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={20 + i * 48} y="188" width="28" height="4" fill="#FFD700" opacity="0.6" />
          ))}
        </g>
      );
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', border: '3px solid #000', overflow: 'hidden', borderRadius: 6, position: 'relative' }}>
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={sky1} />
            <stop offset="100%" stopColor={sky2} />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#skyGrad)" />
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={12 + i * 19} cy={5 + (i % 4) * 10} r="1.2" fill="white" opacity="0.7" />
        ))}
        <circle cx="360" cy="28" r="14" fill="#FFEAA7" opacity="0.88" />
        <circle cx="367" cy="23" r="10" fill={sky1} />
        <rect x="0" y="178" width="400" height="22" fill="#1a1a1a" />
        <Silhouette />
      </svg>
      <div style={{
        position: 'absolute', bottom: 6, left: 8,
        background: 'rgba(0,0,0,0.75)', color: '#FFD700',
        padding: '2px 8px', fontSize: 10, border: '1px solid #FFD700',
        borderRadius: 3, ...EN,
      }}>
        ✈ {transitTz.name !== '中轉機場' ? transitTz.name : 'Select Transit Hub'}
        {transitTz.offset ? ` · GMT+${transitTz.offset}` : ''}
      </div>
    </div>
  );
}

// ─── HUD Day Status ───────────────────────────────────────────────────────────
function DayStatusHUD() {
  const { derived } = useGame();
  const { dayStatus } = derived;

  const [bg, msg] =
    dayStatus.type === 'arrived'   ? ['#a8f0a8', `☘️ 登陸愛爾蘭 Day ${dayStatus.days}`]
  : dayStatus.type === 'countdown' ? ['#FFE082', `✈️ 出發倒數 D-${dayStatus.days}`]
  : ['#e8e4d8', '🛰️ 台灣整備中'];

  return (
    <div style={{
      background: bg, border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
      padding: '8px 12px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 900, ...ZH }}>{msg}</div>
      {dayStatus.type === 'none' && (
        <div style={{ fontSize: 10, color: '#666', marginTop: 2, ...ZH }}>基地充能第 1 天</div>
      )}
    </div>
  );
}

// ─── Main HomeScreen ──────────────────────────────────────────────────────────
export function HomeScreen() {
  const { state, derived } = useGame();
  const { player }         = state;
  const { dayStatus }      = derived;
  const avatarUrl          = buildAvatarUrl(player.avatar);

  return (
    <div style={{
      height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 8, padding: 10,
    }}>
      {/* Row 1: Avatar + Info + HUD */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', flexShrink: 0 }}>
        <div style={{
          width: 58, flexShrink: 0,
          border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
          background: '#b6e3f4', overflow: 'hidden', borderRadius: 4,
        }}>
          <img src={avatarUrl} alt="player" style={{ width: '100%', display: 'block' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
          <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1, ...ZH }}>
            {player.name || '旅行者'}
          </div>
          <div style={{ fontSize: 11, color: '#555', ...ZH }}>
            {player.gender === 'female' ? '女 ♀' : player.gender === 'male' ? '男 ♂' : '冒險者'} · LV.1 新移民
          </div>
          {player.flightNumber && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#000', color: '#FFD700',
              padding: '2px 8px', fontSize: 11, width: 'fit-content', ...EN,
            }}>
              ✈ {player.flightNumber} {player.flightTime && `@ ${player.flightTime}`}
            </div>
          )}
        </div>

        <DayStatusHUD />
      </div>

      {/* Row 2: Airport window */}
      <div style={{ height: 108, flexShrink: 0 }}>
        <AirportWindow />
      </div>

      {/* Row 3: Clocks */}
      <ThreeWorldClocks />

      {/* Row 4: Transit tags */}
      {(player.transitHubs.length > 0 || player.airlines.length > 0) && (
        <div style={{
          border: '2px solid #000', padding: '6px 10px',
          background: '#f5f0e8', fontSize: 11,
          display: 'flex', flexWrap: 'wrap', gap: 4, flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, marginRight: 4, ...ZH }}>中轉：</span>
          {player.transitHubs.map(h => (
            <span key={h} style={{
              background: '#FFD700', border: '1.5px solid #000',
              padding: '1px 6px', fontSize: 10, ...ZH,
            }}>{h}</span>
          ))}
          {player.airlines.map(a => (
            <span key={a} style={{
              background: '#b6e3f4', border: '1.5px solid #000',
              padding: '1px 6px', fontSize: 10, ...ZH,
            }}>{a.split(' ')[0]}</span>
          ))}
        </div>
      )}

      {/* Row 5: Quick XP display */}
      <div style={{
        display: 'flex', gap: 6, flexShrink: 0,
        border: '2px solid #000', padding: '6px 10px', background: '#fff8e8',
      }}>
        <span style={{ fontSize: 14 }}>⭐</span>
        <span style={{ fontSize: 11, fontWeight: 700, ...ZH }}>
          累積 XP：{derived.totalXP} pts
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#888', ...EN }}>
          {dayStatus.type === 'arrived' ? `Day ${dayStatus.days} in IE` : 'Pre-departure'}
        </span>
      </div>
    </div>
  );
}
