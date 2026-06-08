import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { buildAvatarUrl, ZH, EN } from '../../data/constants';

// ─── Analog clock hook ────────────────────────────────────────────────────────
function useClockHands(gmtOffset: number) {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const utc = t.getTime() + t.getTimezoneOffset() * 60000;
  const d   = new Date(utc + gmtOffset * 3600000);
  const h   = (d.getHours() % 12) + d.getMinutes() / 60;
  const m   = d.getMinutes() + d.getSeconds() / 60;
  const s   = d.getSeconds();
  return { hDeg: h * 30 - 90, mDeg: m * 6 - 90, sDeg: s * 6 - 90 };
}

// ─── SVG Analog Clock ─────────────────────────────────────────────────────────
function SvgClock({ cx, cy, r, offset, label, sub }: {
  cx: number; cy: number; r: number; offset: number; label: string; sub: string;
}) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const arm = (deg: number, len: number, sw: number, col: string) => {
    const rad = deg * Math.PI / 180;
    return (
      <line x1={cx} y1={cy}
        x2={cx + Math.cos(rad) * len}
        y2={cy + Math.sin(rad) * len}
        stroke={col} strokeWidth={sw} strokeLinecap="round" />
    );
  };
  return (
    <g>
      <circle cx={cx + 2} cy={cy + 2} r={r + 3} fill="#000" />
      <circle cx={cx} cy={cy} r={r + 3} fill="#1a1a1a" />
      <circle cx={cx} cy={cy} r={r} fill="#FFFEF5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const inner = i % 3 === 0 ? r - 8 : r - 5;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * inner} y1={cy + Math.sin(a) * inner}
            x2={cx + Math.cos(a) * (r - 1)} y2={cy + Math.sin(a) * (r - 1)}
            stroke="#1a1a1a" strokeWidth={i % 3 === 0 ? 2.5 : 1} />
        );
      })}
      {arm(hDeg, r * 0.54, 3.5, '#1a1a1a')}
      {arm(mDeg, r * 0.78, 2, '#1a1a1a')}
      {arm(sDeg, r * 0.82, 1, '#C0392B')}
      <circle cx={cx} cy={cy} r={2.5} fill="#1a1a1a" />
      <text x={cx} y={cy + r + 13} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#1a1a1a" fontFamily="'Noto Sans TC','Microsoft JhengHei',sans-serif">{label}</text>
      <text x={cx} y={cy + r + 23} textAnchor="middle" fontSize={7} fill="#666"
        fontFamily="monospace">{sub}</text>
    </g>
  );
}

// ─── Sky colour by location + real hour ──────────────────────────────────────
function useSkyGrad(location: 'taiwan' | 'ireland' | 'transit'): [string, string, string] {
  const [h, setH] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setH(new Date().getHours()), 60000);
    return () => clearInterval(id);
  }, []);
  if (h < 5 || h >= 21) return ['#0A0A1E', '#1B2344', '#0A0A1E'];
  if (h < 7)            return ['#C0392B', '#E67E22', '#F39C12'];
  if (h >= 18)          return ['#8E44AD', '#E74C3C', '#F39C12'];
  switch (location) {
    case 'ireland': return ['#5B8EC5', '#87CEEB', '#B0D8EA'];
    case 'taiwan':  return ['#1A8FD1', '#5CC8F8', '#B0E0FF'];
    default:        return ['#E67E22', '#F39C12', '#FFD700']; // desert transit
  }
}

// ─── 2.5D Room SVG ────────────────────────────────────────────────────────────
function RoomSVG() {
  const { state, derived } = useGame();
  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0, 7)
    : 'Transit';

  const location: 'taiwan' | 'ireland' | 'transit' =
    derived.hasArrived ? 'ireland'
    : derived.dayStatus.type === 'countdown' ? 'taiwan'
    : 'taiwan';

  const [sky1, sky2, sky3] = useSkyGrad(location);

  // ── Room geometry ──
  const W = 760, H = 360;
  const ceilY = 28;
  const wallBotY = 248;
  const winX = 570;   // where right wall/window starts

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={sky1} />
          <stop offset="55%"  stopColor={sky2} />
          <stop offset="100%" stopColor={sky3} />
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#DFD0B8" />
          <stop offset="100%" stopColor="#C8B898" />
        </linearGradient>
        <pattern id="floorTile" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="44" height="44" fill="url(#floorG)" />
          <rect width="44" height="44" fill="none" stroke="#C0A880" strokeWidth="0.7" />
        </pattern>
        <clipPath id="floorClip">
          <polygon points={`0,${wallBotY} ${winX},${wallBotY} ${W},${H} 0,${H}`} />
        </clipPath>
        <clipPath id="winClip">
          <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`} />
        </clipPath>
        <filter id="softShadow">
          <feDropShadow dx="3" dy="3" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* ── Ceiling ─────────────────────────────────────── */}
      <rect x={0} y={0} width={winX} height={ceilY} fill="#D4C8B2" />
      <line x1={0} y1={ceilY} x2={winX} y2={ceilY} stroke="#1a1a1a" strokeWidth={2.5} />

      {/* ── Back wall ───────────────────────────────────── */}
      <rect x={0} y={ceilY} width={winX} height={wallBotY - ceilY} fill="#F0E8D8" />
      {/* Subtle vertical planks */}
      {Array.from({ length: 15 }, (_, i) => (
        <line key={i} x1={i * 40} y1={ceilY} x2={i * 40} y2={wallBotY}
          stroke="#E0D2BC" strokeWidth="0.8" />
      ))}
      {/* Skirting board */}
      <rect x={0} y={wallBotY - 14} width={winX} height={14} fill="#D4C4A4" stroke="#C0AC8A" strokeWidth="0.8" />

      {/* ── Floor ───────────────────────────────────────── */}
      <polygon points={`0,${wallBotY} ${winX},${wallBotY} ${W},${H} 0,${H}`}
        fill="url(#floorTile)" />
      {/* Perspective grid lines */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <line key={`fv${i}`}
          x1={i * 73} y1={wallBotY}
          x2={i * 73 + (W - winX) * (i / 8)} y2={H}
          stroke="#C0A880" strokeWidth="0.6" opacity="0.5" />
      ))}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={`fh${i}`}
          x1={0} y1={wallBotY + (H - wallBotY) * t}
          x2={winX + (W - winX) * t} y2={wallBotY + (H - wallBotY) * t}
          stroke="#C0A880" strokeWidth="0.6" opacity="0.5" />
      ))}

      {/* ── Window / right wall ─────────────────────────── */}
      <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`}
        fill="url(#skyG)" />

      {/* Clouds */}
      <g clipPath="url(#winClip)" opacity="0.7">
        <ellipse cx={650} cy={40} rx={38} ry={14} fill="#fff" />
        <ellipse cx={670} cy={34} rx={24} ry={18} fill="#fff" />
        <ellipse cx={635} cy={44} rx={20} ry={10} fill="#fff" />
        <ellipse cx={720} cy={65} rx={28} ry={10} fill="#fff" opacity="0.8" />
        <ellipse cx={735} cy={60} rx={18} ry={13} fill="#fff" opacity="0.8" />
      </g>

      {/* Airport ground + tarmac */}
      <g clipPath="url(#winClip)">
        <polygon points={`${winX},${wallBotY - 20} ${W},${H * 0.64} ${W},${H} ${winX},${wallBotY}`}
          fill="#3A3A3A" />
        {/* Runway centreline */}
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={590 + i * 42} y={282 + i * 10} width={22} height={4}
            fill="#FFD700" opacity={0.75} />
        ))}
        {/* Airport lights */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={585 + i * 38} cy={295 + i * 8} r={2}
            fill="#FFD700" opacity={0.9} />
        ))}
      </g>

      {/* Aer Lingus plane */}
      <g transform="translate(580, 205)" clipPath="url(#winClip)">
        <ellipse cx={52} cy={13} rx={62} ry={12} fill="#F0F0F0" stroke="#D8D8D8" strokeWidth={1} />
        <polygon points="25,13 78,13 84,22 18,22" fill="#E8E8E8" stroke="#CCC" strokeWidth={0.8} />
        <polygon points="4,4 16,13 20,13" fill="#007A33" />
        <polygon points="6,13 18,13 20,19 4,19" fill="#E8E8E8" stroke="#CCC" strokeWidth={0.8} />
        {[0, 1, 2, 3, 4, 5].map(i => (
          <ellipse key={i} cx={28 + i * 13} cy={9} rx={4} ry={3}
            fill="#87CEEB" opacity={0.9} />
        ))}
        <line x1={10} y1={15} x2={114} y2={15} stroke="#007A33" strokeWidth={2.5} />
      </g>

      {/* Window panes */}
      <g stroke="#1a1a1a" strokeWidth={3.5} fill="none">
        <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`} />
      </g>
      <g stroke="#1a1a1a" strokeWidth={2.5} opacity={0.65}>
        <line x1={624} y1={0} x2={624} y2={H} />
        <line x1={682} y1={0} x2={682} y2={H} />
        <line x1={730} y1={0} x2={730} y2={H} />
        <line x1={winX} y1={(ceilY + wallBotY) / 2}
          x2={W} y2={(H) / 2} />
      </g>

      {/* ── Wall clocks ────────────────────────────────── */}
      <SvgClock cx={135} cy={118} r={38} offset={8}
        label="台灣" sub="TAIWAN (GMT+8)" />
      <SvgClock cx={285} cy={118} r={38} offset={transitOffset}
        label={transitLabel} sub={`GMT+${transitOffset}`} />
      <SvgClock cx={445} cy={118} r={38} offset={1}
        label="愛爾蘭" sub="IRELAND (GMT+1)" />

      {/* ── Furniture ──────────────────────────────────── */}

      {/* Rug */}
      <ellipse cx={240} cy={296} rx={140} ry={28}
        fill="#B07040" opacity={0.38} stroke="#8B5530" strokeWidth={1} />

      {/* Bed */}
      <g filter="url(#softShadow)">
        {/* Headboard */}
        <polygon points="45,200 215,200 215,228 45,228" fill="#7B4F2E" stroke="#5A3418" strokeWidth={1.5} />
        {/* Bed frame */}
        <polygon points="45,228 215,228 235,282 25,282" fill="#B8905C" stroke="#8B6040" strokeWidth={1.5} />
        {/* Mattress */}
        <polygon points="50,212 210,212 228,268 32,268" fill="#EAD8C0" stroke="#C8B898" strokeWidth={1} />
        {/* Pillow L */}
        <polygon points="55,200 115,200 122,228 62,228" fill="#FFFEF5" stroke="#D8CCA8" strokeWidth={1} />
        {/* Pillow R */}
        <polygon points="120,200 180,200 187,228 127,228" fill="#FFFEF5" stroke="#D8CCA8" strokeWidth={1} />
        {/* Blanket fold */}
        <polygon points="50,234 210,234 225,268 35,268" fill="#C8A878" opacity={0.6} stroke="#A08050" strokeWidth={0.8} />
      </g>

      {/* Desk */}
      <g filter="url(#softShadow)" transform="translate(380, 215)">
        {/* Legs */}
        <rect x={5} y={38} width={6} height={22} fill="#6B4423" />
        <rect x={115} y={38} width={6} height={22} fill="#6B4423" />
        {/* Surface shadow */}
        <polygon points="5,5 135,5 148,38 18,38" fill="#000" opacity={0.15} />
        {/* Surface top */}
        <polygon points="-3,-10 130,-10 138,5 5,5" fill="#A07848" stroke="#7A5830" strokeWidth={1.5} />
        {/* Surface front */}
        <polygon points="5,5 135,5 148,38 18,38" fill="#8B6038" stroke="#6A4420" strokeWidth={1.5} />
        {/* Laptop */}
        <polygon points="12,-28 78,-28 82,-10 8,-10" fill="#2C2C2C" stroke="#1a1a1a" strokeWidth={1} />
        <polygon points="8,-10 82,-10 88,-2 2,-2" fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1} />
        <polygon points="14,-26 76,-26 80,-11 10,-11" fill="#5DADE2" opacity={0.55} />
        {/* Mouse */}
        <ellipse cx={100} cy={-5} rx={8} ry={5} fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={0.8} />
      </g>

      {/* Globe on desk */}
      <g transform="translate(498, 196)">
        <ellipse cx={0} cy={16} rx={9} ry={3} fill="#5A3C1A" opacity={0.4} />
        <rect x={-2} y={12} width={4} height={6} fill="#6B4423" />
        <ellipse cx={0} cy={-2} rx={8} ry={3} fill="#2980B9" opacity={0.5} />
        <circle cx={0} cy={0} r={13} fill="#3498DB" stroke="#2471A3" strokeWidth={1.5} />
        <ellipse cx={0} cy={0} rx={13} ry={5} fill="none" stroke="#1A6FA8" strokeWidth={0.8} />
        <line x1={0} y1={-13} x2={0} y2={13} stroke="#1A6FA8" strokeWidth={0.8} />
        {/* Land masses */}
        <ellipse cx={-3} cy={-2} rx={4} ry={6} fill="#5D8A3C" opacity={0.8} />
        <ellipse cx={5} cy={3} rx={5} ry={3} fill="#5D8A3C" opacity={0.8} />
      </g>

      {/* ── Room outline strokes ────────────────────────── */}
      <line x1={0} y1={ceilY} x2={0} y2={H} stroke="#1a1a1a" strokeWidth={3} />
      <line x1={0} y1={wallBotY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={2.5} />
      <line x1={winX} y1={ceilY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={3} />
    </svg>
  );
}

// ─── HUD Overlay ──────────────────────────────────────────────────────────────
function HUDOverlay() {
  const { state, derived } = useGame();
  const { player } = state;
  const { dayStatus, totalXP } = derived;
  const avatarUrl = buildAvatarUrl(player.avatar);

  // Day status card
  let statusBg   = '#E8E4D8';
  let statusIcon = '🛰️';
  let statusLine1 = '台灣整備中';
  let statusLine2 = `基地充能第 ${Math.max(dayStatus.days, 1)} 天`;

  if (dayStatus.type === 'countdown') {
    statusBg    = '#FFF8DC';
    statusIcon  = '✈️';
    statusLine1 = `出發倒數 D-${dayStatus.days}`;
    statusLine2 = `抵達日：${player.arrivalDate}`;
  } else if (dayStatus.type === 'arrived') {
    statusBg    = '#E8F8E8';
    statusIcon  = '☘️';
    statusLine1 = `登陸愛爾蘭：Day ${dayStatus.days}`;
    statusLine2 = `${player.arrivalDate} 抵達`;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 10, left: 10,
      display: 'flex', flexDirection: 'column', gap: 6,
      pointerEvents: 'none',
    }}>
      {/* Name card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(253,251,247,0.88)',
        border: '2.5px solid #000',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
        padding: '4px 8px 4px 4px',
      }}>
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          border: '2px solid #000', background: '#b6e3f4', overflow: 'hidden',
        }}>
          <img src={avatarUrl} alt="avatar" style={{ width: '100%', display: 'block' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.1, ...ZH }}>
            {player.name || '旅行者'}
          </div>
          <div style={{ fontSize: 9, color: '#666', ...ZH }}>
            {player.gender === 'female' ? '♀ 女' : player.gender === 'male' ? '♂ 男' : '冒險者'} · LV.1
          </div>
        </div>
      </div>

      {/* XP / Gold */}
      <div style={{
        background: 'rgba(0,0,0,0.82)',
        border: '2.5px solid #FFD700',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
        padding: '4px 10px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 14 }}>⭐</span>
        <span style={{
          fontSize: 18, fontWeight: 900, color: '#FFD700',
          letterSpacing: '0.05em', ...EN,
        }}>{totalXP}</span>
        <span style={{ fontSize: 9, color: '#C9A96E', ...ZH }}>XP</span>
      </div>

      {/* Day status */}
      <div style={{
        background: statusBg,
        border: '2.5px solid #000',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
        padding: '5px 10px',
        minWidth: 140,
      }}>
        <div style={{ fontSize: 11, fontWeight: 900, ...ZH }}>
          {statusIcon} {statusLine1}
        </div>
        <div style={{ fontSize: 9, color: '#555', marginTop: 1, ...ZH }}>
          {statusLine2}
        </div>
      </div>

      {/* Flight info */}
      {player.flightNumber && (
        <div style={{
          background: 'rgba(0,0,0,0.80)',
          border: '2px solid #FFD700',
          padding: '3px 8px',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontSize: 10, color: '#FFD700', fontWeight: 700, ...EN }}>
            ✈ {player.flightNumber}
            {player.flightTime ? ` @ ${player.flightTime}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export function HomeScreen() {
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <RoomSVG />
      <HUDOverlay />
    </div>
  );
}
