import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { buildAvatarUrl, ZH, EN } from '../../data/constants';

// ══════════════════════════════════════════════════════════════
// FURNITURE DATA STRUCTURE
// ══════════════════════════════════════════════════════════════
interface FurnitureItem {
  id:          string;
  type:        string;
  x:           number;
  y:           number;
  rotation?:   number;
  isSurface?:  boolean;
  stackedOn?:  string;
  zOffset?:    number;
}

const FURNITURE: FurnitureItem[] = [
  { id: 'rug',       type: 'rug',       x: 210,  y: 290 },
  { id: 'sofa',      type: 'sofa',      x: 42,   y: 228, rotation: 90 },
  { id: 'guitar',    type: 'guitar',    x: 22,   y: 168, rotation: -15 },
  { id: 'backpack',  type: 'backpack',  x: 98,   y: 264 },
  { id: 'island',    type: 'island',    x: 348,  y: 208, isSurface: true },
  { id: 'sink',      type: 'sink',      x: 454,  y: 204 },
  { id: 'induction', type: 'induction', x: 386,  y: 208 },
  { id: 'microwave', type: 'microwave', x: 362,  y: 192, stackedOn: 'island', zOffset: -28 },
  { id: 'desk',      type: 'desk',      x: 276,  y: 216 },
];

// ══════════════════════════════════════════════════════════════
// SVG FURNITURE DRAWERS
// ══════════════════════════════════════════════════════════════

function Rug({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={0} rx={148} ry={30} fill="#B07845" opacity={0.38} stroke="#8B5C30" strokeWidth={1.2} />
      <ellipse cx={0} cy={0} rx={128} ry={22} fill="none" stroke="#C09050" strokeWidth={0.8} strokeDasharray="6,4" opacity={0.5} />
    </g>
  );
}

// Caramel modular sofa (rotation=90 → faces right toward window)
function Sofa({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Shadow */}
      <ellipse cx={90} cy={68} rx={95} ry={16} fill="#000" opacity={0.12} />
      {/* Back cushion */}
      <polygon points="0,10 190,10 190,52 0,52" fill="#A0724A" stroke="#7A5030" strokeWidth={1.5} />
      {/* Seat */}
      <polygon points="0,52 190,52 200,80 -10,80" fill="#C4925A" stroke="#A07040" strokeWidth={1.5} />
      {/* Seat cushion L */}
      <polygon points="8,34 88,34 94,52 2,52" fill="#D4A870" stroke="#B08850" strokeWidth={1} />
      {/* Seat cushion R */}
      <polygon points="100,34 180,34 186,52 94,52" fill="#D4A870" stroke="#B08850" strokeWidth={1} />
      {/* Left armrest */}
      <polygon points="-8,8 14,8 14,80 -18,80" fill="#8B6038" stroke="#6A4020" strokeWidth={1.2} />
      {/* Right armrest */}
      <polygon points="178,8 200,8 210,80 184,80" fill="#8B6038" stroke="#6A4020" strokeWidth={1.2} />
      {/* Leg FL */}
      <rect x={0} y={80} width={8} height={12} fill="#5A3C18" />
      {/* Leg FR */}
      <rect x={182} y={80} width={8} height={12} fill="#5A3C18" />
    </g>
  );
}

// Guitar leaning against left wall
function Guitar({ x, y, rotation }: { x: number; y: number; rotation: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Neck */}
      <rect x={12} y={-80} width={8} height={100} rx={3} fill="#8B5C2A" stroke="#5A3C18" strokeWidth={1} />
      {/* Headstock */}
      <rect x={9} y={-88} width={14} height={12} rx={2} fill="#6B4418" stroke="#3A2408" strokeWidth={1} />
      {/* Tuning pegs */}
      {[-86,-82,-78].map((py,i) => <circle key={i} cx={7} cy={py} r={2.5} fill="#C0A060" />)}
      {[-86,-82,-78].map((py,i) => <circle key={`r${i}`} cx={25} cy={py} r={2.5} fill="#C0A060" />)}
      {/* Body */}
      <ellipse cx={16} cy={30} rx={18} ry={22} fill="#C4803C" stroke="#8B5020" strokeWidth={1.5} />
      <ellipse cx={16} cy={8}  rx={14} ry={16} fill="#C4803C" stroke="#8B5020" strokeWidth={1.5} />
      {/* Waist connector */}
      <rect x={6} y={16} width={20} height={16} fill="#C4803C" />
      <rect x={4} y={16} width={24} height={16} fill="none" stroke="#8B5020" strokeWidth={1.5} />
      {/* Sound hole */}
      <circle cx={16} cy={22} r={6} fill="#5A3010" stroke="#3A1C00" strokeWidth={0.8} />
      {/* Strings */}
      {[10,13,16,19,22].map((sx,i) => (
        <line key={i} x1={sx} y1={-80} x2={sx} y2={44} stroke="#D4C090" strokeWidth={0.6} />
      ))}
    </g>
  );
}

// Backpack leaning near sofa
function Backpack({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Shadow */}
      <ellipse cx={22} cy={58} rx={20} ry={5} fill="#000" opacity={0.15} />
      {/* Main body */}
      <rect x={0} y={4} width={44} height={52} rx={6} fill="#6B7C4A" stroke="#4A5830" strokeWidth={1.5} />
      {/* Top flap */}
      <rect x={2} y={0} width={40} height={16} rx={4} fill="#7A8C58" stroke="#4A5830" strokeWidth={1} />
      {/* Front pocket */}
      <rect x={6} y={30} width={32} height={22} rx={4} fill="#5A6B3C" stroke="#4A5830" strokeWidth={1} />
      {/* Pocket zipper */}
      <line x1={8} y1={30} x2={36} y2={30} stroke="#C0A060" strokeWidth={1.5} />
      {/* Handle */}
      <path d="M 14,0 Q 22,-8 30,0" stroke="#4A5830" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Straps */}
      <rect x={8} y={8} width={5} height={38} rx={2} fill="#4A5830" opacity={0.6} />
      <rect x={31} y={8} width={5} height={38} rx={2} fill="#4A5830" opacity={0.6} />
    </g>
  );
}

// Kitchen island counter (isSurface: true)
function KitchenIsland({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Shadow */}
      <polygon points="5,5 165,5 185,60 25,60" fill="#000" opacity={0.14} />
      {/* Counter front face */}
      <polygon points="0,28 160,28 178,58 18,58" fill="#8B7048" stroke="#6A5030" strokeWidth={1.5} />
      {/* Counter top (marble effect) */}
      <polygon points="-6,10 166,10 178,28 0,28" fill="#E8E0D0" stroke="#C0B8A8" strokeWidth={1.5} />
      {/* Marble veins */}
      <path d="M 20,14 Q 50,18 80,12 Q 110,8 140,16" stroke="#C8C0B0" strokeWidth="0.8" fill="none" opacity="0.7" />
      <path d="M 30,20 Q 70,24 110,18" stroke="#C8C0B0" strokeWidth="0.6" fill="none" opacity="0.5" />
      {/* isSurface indicator (subtle shelf line) */}
      <line x1={0} y1={28} x2={160} y2={28} stroke="#A09080" strokeWidth={0.8} strokeDasharray="4,3" />
      {/* Legs */}
      <rect x={4}   y={58} width={7} height={18} fill="#5A3C18" />
      <rect x={162} y={58} width={7} height={18} fill="#5A3C18" />
    </g>
  );
}

// Sink fixture on island
function Sink({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Basin */}
      <ellipse cx={24} cy={18} rx={22} ry={10} fill="#D8E0E8" stroke="#A0B0C0" strokeWidth={1.2} />
      <ellipse cx={24} cy={18} rx={16} ry={7} fill="#B8C8D8" stroke="#90A8B8" strokeWidth={0.8} />
      {/* Drain */}
      <circle cx={24} cy={18} r={3} fill="#8090A0" />
      {/* Faucet base */}
      <rect x={20} y={4} width={8} height={12} rx={2} fill="#C8C8C8" stroke="#909090" strokeWidth={1} />
      {/* Faucet neck */}
      <path d="M 24,4 Q 24,-4 32,-4" stroke="#B0B0B0" strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={32} cy={-4} r={3} fill="#C0C0C0" stroke="#909090" strokeWidth={0.8} />
    </g>
  );
}

// Induction cooktop
function InductionCooktop({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <polygon points="0,8 62,8 72,26 10,26" fill="#1C1C2C" stroke="#0A0A18" strokeWidth={1.2} rx={4} />
      {/* Surface */}
      <polygon points="-4,0 66,0 72,8 0,8" fill="#2A2A3C" stroke="#18183A" strokeWidth={1} />
      {/* Heating zones */}
      <ellipse cx={18} cy={4} rx={12} ry={5} fill="none" stroke="#E74C3C" strokeWidth={1.2} opacity={0.7} />
      <ellipse cx={48} cy={4} rx={12} ry={5} fill="none" stroke="#E74C3C" strokeWidth={1.2} opacity={0.7} />
      {/* Zone glow */}
      <ellipse cx={18} cy={4} rx={8} ry={3} fill="#FF6B6B" opacity={0.15} />
      <ellipse cx={48} cy={4} rx={8} ry={3} fill="#FF6B6B" opacity={0.15} />
      {/* Control panel */}
      <rect x={26} y={2} width={14} height={4} rx={1} fill="#3A3A5C" />
      {[0,1,2].map(i => <circle key={i} cx={29+i*4} cy={4} r={1} fill="#00D4FF" opacity={0.8} />)}
    </g>
  );
}

// Microwave stacked on island (zOffset compensates Z-axis height)
function Microwave({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body shadow */}
      <polygon points="4,4 72,4 80,28 12,28" fill="#000" opacity={0.15} />
      {/* Body front */}
      <polygon points="0,16 68,16 76,28 8,28" fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1.2} />
      {/* Body top */}
      <polygon points="-4,4 68,4 76,16 0,16" fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={1.2} />
      {/* Door */}
      <polygon points="2,16 44,16 50,28 6,28" fill="#2A2A2A" stroke="#1a1a1a" strokeWidth={0.8} />
      {/* Door window */}
      <polygon points="6,17 38,17 44,26 10,26" fill="#0A1A2A" opacity={0.9} />
      <polygon points="8,18 36,18 42,25 12,25" fill="#0D2A3A" opacity={0.5} />
      {/* Control panel */}
      <polygon points="46,16 68,16 74,28 52,28" fill="#5A5A5A" stroke="#3a3a3a" strokeWidth={0.8} />
      {/* Clock display */}
      <polygon points="48,18 66,18 71,26 54,26" fill="#001010" />
      <text x={56} y={24} fontSize={6} fill="#00FF88" fontFamily="monospace" textAnchor="middle">12:00</text>
      {/* Handle */}
      <line x1={44} y1={17} x2={50} y2={27} stroke="#888" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

// Writing desk
function Desk({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={4} y={36} width={6} height={20} fill="#6B4423" />
      <rect x={112} y={36} width={6} height={20} fill="#6B4423" />
      <polygon points="4,4 130,4 138,36 12,36" fill="#000" opacity={0.12} />
      <polygon points="-2,-10 126,-10 134,4 4,4" fill="#A07848" stroke="#7A5830" strokeWidth={1.5} />
      <polygon points="4,4 130,4 138,36 12,36" fill="#8B6038" stroke="#6A4420" strokeWidth={1.5} />
      {/* Laptop */}
      <polygon points="10,-26 72,-26 76,-10 6,-10" fill="#2C2C2C" stroke="#1a1a1a" strokeWidth={1} />
      <polygon points="6,-10 76,-10 82,0 0,0" fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1} />
      <polygon points="12,-24 70,-24 74,-11 8,-11" fill="#5DADE2" opacity={0.5} />
      <ellipse cx={98} cy={-4} rx={8} ry={5} fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={0.8} />
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
// LIVE CLOCK HOOK
// ══════════════════════════════════════════════════════════════
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

// SVG Wall Clock (on back wall)
function WallClock({ cx, cy, r, offset, label, sub }: {
  cx: number; cy: number; r: number; offset: number; label: string; sub: string;
}) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const arm = (deg: number, len: number, sw: number, col: string) => {
    const rad = deg * Math.PI / 180;
    return <line x1={cx} y1={cy}
      x2={cx + Math.cos(rad) * len} y2={cy + Math.sin(rad) * len}
      stroke={col} strokeWidth={sw} strokeLinecap="round" />;
  };
  return (
    <g>
      <circle cx={cx+2} cy={cy+2} r={r+3} fill="#000" />
      <circle cx={cx} cy={cy} r={r+3} fill="#1a1a1a" />
      <circle cx={cx} cy={cy} r={r} fill="#FFFEF5" />
      {Array.from({length:12},(_,i) => {
        const a=(i*30-90)*Math.PI/180;
        const inner = i%3===0 ? r-8 : r-5;
        return <line key={i}
          x1={cx+Math.cos(a)*inner} y1={cy+Math.sin(a)*inner}
          x2={cx+Math.cos(a)*(r-1)} y2={cy+Math.sin(a)*(r-1)}
          stroke="#1a1a1a" strokeWidth={i%3===0?2.5:1} />;
      })}
      {arm(hDeg, r*.54, 3.5, '#1a1a1a')}
      {arm(mDeg, r*.78, 2,   '#1a1a1a')}
      {arm(sDeg, r*.82, 1,   '#C0392B')}
      <circle cx={cx} cy={cy} r={2.5} fill="#1a1a1a" />
      <text x={cx} y={cy+r+12} textAnchor="middle" fontSize={9} fontWeight="700"
        fill="#1a1a1a" fontFamily="'Noto Sans TC',sans-serif">{label}</text>
      <text x={cx} y={cy+r+22} textAnchor="middle" fontSize={7} fill="#666"
        fontFamily="monospace">{sub}</text>
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
// SKY GRADIENT (location-aware)
// ══════════════════════════════════════════════════════════════
function useSkyGrad(location: 'taiwan'|'ireland'|'transit'): [string,string,string] {
  const [h, setH] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setH(new Date().getHours()), 60000);
    return () => clearInterval(id);
  }, []);
  if (h<5||h>=21) return ['#0A0A1E','#1B2344','#0A0A1E'];
  if (h<7)        return ['#C0392B','#E67E22','#F39C12'];
  if (h>=18)      return ['#8E44AD','#E74C3C','#F39C12'];
  if (location==='ireland') return ['#5B8EC5','#87CEEB','#B0D8EA'];
  if (location==='taiwan')  return ['#1A8FD1','#5CC8F8','#B0E0FF'];
  return ['#E67E22','#F39C12','#FFD700'];
}

// ══════════════════════════════════════════════════════════════
// 2.5D ROOM SVG
// ══════════════════════════════════════════════════════════════
function RoomSVG() {
  const { derived } = useGame();
  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0,7) : 'Transit';
  const location: 'taiwan'|'ireland'|'transit' =
    derived.hasArrived ? 'ireland' : 'taiwan';
  const [sky1,sky2,sky3] = useSkyGrad(location);

  const W=760, H=360, ceilY=28, wallBotY=248, winX=570;

  // Resolve furniture with Z-axis stacking
  const resolvedFurniture = FURNITURE.map(item => {
    if (item.stackedOn) {
      const surface = FURNITURE.find(f => f.id === item.stackedOn);
      return surface ? { ...item, y: item.y + (item.zOffset ?? 0) } : item;
    }
    return item;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={sky1}/>
          <stop offset="55%" stopColor={sky2}/>
          <stop offset="100%" stopColor={sky3}/>
        </linearGradient>
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#E4C890"/>
          <stop offset="100%" stopColor="#D2B06C"/>
        </linearGradient>
        <pattern id="floorTile" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="44" height="44" fill="url(#floorG)"/>
          <rect width="44" height="44" fill="none" stroke="#C0A060" strokeWidth="0.7"/>
        </pattern>
        <clipPath id="winClip">
          <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`}/>
        </clipPath>
        <filter id="drop">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* Ceiling */}
      <rect x={0} y={0} width={winX} height={ceilY} fill="#D4C8B2"/>
      <line x1={0} y1={ceilY} x2={winX} y2={ceilY} stroke="#1a1a1a" strokeWidth={2.5}/>

      {/* Back wall */}
      <rect x={0} y={ceilY} width={winX} height={wallBotY-ceilY} fill="#F0E8D8"/>
      {Array.from({length:15},(_,i)=>(
        <line key={i} x1={i*40} y1={ceilY} x2={i*40} y2={wallBotY}
          stroke="#E0D2BC" strokeWidth="0.8"/>
      ))}
      <rect x={0} y={wallBotY-14} width={winX} height={14} fill="#D4C4A4" stroke="#C0AC8A" strokeWidth="0.8"/>

      {/* Floor */}
      <polygon points={`0,${wallBotY} ${winX},${wallBotY} ${W},${H} 0,${H}`} fill="url(#floorTile)"/>
      {[1,2,3,4,5,6,7,8].map(i=>(
        <line key={`fv${i}`} x1={i*73} y1={wallBotY}
          x2={i*73+(W-winX)*(i/8)} y2={H}
          stroke="#C0A060" strokeWidth="0.6" opacity="0.4"/>
      ))}
      {[0.25,0.5,0.75].map((t,i)=>(
        <line key={`fh${i}`} x1={0} y1={wallBotY+(H-wallBotY)*t}
          x2={winX+(W-winX)*t} y2={wallBotY+(H-wallBotY)*t}
          stroke="#C0A060" strokeWidth="0.6" opacity="0.4"/>
      ))}

      {/* Airport window */}
      <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`} fill="url(#skyG)"/>
      <g clipPath="url(#winClip)" opacity="0.75">
        <ellipse cx={650} cy={42} rx={38} ry={14} fill="#fff"/>
        <ellipse cx={668} cy={36} rx={24} ry={18} fill="#fff"/>
        <ellipse cx={635} cy={46} rx={20} ry={10} fill="#fff"/>
        <ellipse cx={722} cy={66} rx={28} ry={11} fill="#fff" opacity="0.85"/>
      </g>
      <g clipPath="url(#winClip)">
        <polygon points={`${winX},${wallBotY-18} ${W},${H*0.64} ${W},${H} ${winX},${wallBotY}`} fill="#3A3A3A"/>
        {[0,1,2,3].map(i=>(
          <rect key={i} x={592+i*42} y={284+i*10} width={22} height={4} fill="#FFD700" opacity={0.75}/>
        ))}
        {[0,1,2,3,4].map(i=>(
          <circle key={i} cx={587+i*38} cy={296+i*8} r={2} fill="#FFD700" opacity={0.9}/>
        ))}
      </g>
      {/* Aer Lingus plane */}
      <g transform="translate(578,206)" clipPath="url(#winClip)">
        <ellipse cx={52} cy={13} rx={62} ry={12} fill="#F0F0F0" stroke="#D8D8D8" strokeWidth={1}/>
        <polygon points="25,13 78,13 84,22 18,22" fill="#E8E8E8" stroke="#CCC" strokeWidth={0.8}/>
        <polygon points="4,4 16,13 20,13" fill="#007A33"/>
        <polygon points="6,13 18,13 20,19 4,19" fill="#E8E8E8" stroke="#CCC" strokeWidth={0.8}/>
        {[0,1,2,3,4,5].map(i=>(
          <ellipse key={i} cx={28+i*13} cy={9} rx={4} ry={3} fill="#87CEEB" opacity={0.9}/>
        ))}
        <line x1={10} y1={15} x2={114} y2={15} stroke="#007A33" strokeWidth={2.5}/>
      </g>
      {/* Window panes */}
      <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`}
        fill="none" stroke="#1a1a1a" strokeWidth={3.5}/>
      <g stroke="#1a1a1a" strokeWidth={2.5} opacity={0.6}>
        <line x1={624} y1={0} x2={624} y2={H}/>
        <line x1={682} y1={0} x2={682} y2={H}/>
        <line x1={730} y1={0} x2={730} y2={H}/>
        <line x1={winX} y1={(ceilY+wallBotY)/2} x2={W} y2={H/2}/>
      </g>

      {/* Wall clocks */}
      <WallClock cx={125} cy={118} r={36} offset={8}       label="台灣"   sub="TAIWAN (GMT+8)"/>
      <WallClock cx={276} cy={118} r={36} offset={transitOffset} label={transitLabel} sub={`GMT+${transitOffset}`}/>
      <WallClock cx={438} cy={118} r={36} offset={1}       label="愛爾蘭" sub="IRELAND (GMT+1)"/>

      {/* Furniture (data-driven) */}
      {resolvedFurniture.map(item => {
        switch(item.type) {
          case 'rug':       return <Rug       key={item.id} x={item.x} y={item.y}/>;
          case 'sofa':      return <Sofa      key={item.id} x={item.x} y={item.y}/>;
          case 'guitar':    return <Guitar    key={item.id} x={item.x} y={item.y} rotation={item.rotation??0}/>;
          case 'backpack':  return <Backpack  key={item.id} x={item.x} y={item.y}/>;
          case 'island':    return <KitchenIsland key={item.id} x={item.x} y={item.y}/>;
          case 'sink':      return <Sink      key={item.id} x={item.x} y={item.y}/>;
          case 'induction': return <InductionCooktop key={item.id} x={item.x} y={item.y}/>;
          case 'microwave': return <Microwave key={item.id} x={item.x} y={item.y}/>;
          case 'desk':      return <Desk      key={item.id} x={item.x} y={item.y}/>;
          default: return null;
        }
      })}

      {/* Room outlines */}
      <line x1={0} y1={ceilY} x2={0} y2={H} stroke="#1a1a1a" strokeWidth={3}/>
      <line x1={0} y1={wallBotY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={2.5}/>
      <line x1={winX} y1={ceilY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={3}/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// HUD TOY CLOCK (hand-drawn button style)
// ══════════════════════════════════════════════════════════════
function ToyClockBtn({ offset, label, sub, bg }: {
  offset: number; label: string; sub: string; bg: string;
}) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const r = 22, cx = 26, cy = 26;
  const arm = (deg: number, len: number, sw: number, col: string) => {
    const rad = deg * Math.PI / 180;
    return <line x1={cx} y1={cy}
      x2={cx+Math.cos(rad)*len} y2={cy+Math.sin(rad)*len}
      stroke={col} strokeWidth={sw} strokeLinecap="round"/>;
  };
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:2,
      background: bg,
      border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
      padding:'5px 6px',
    }}>
      <svg width={52} height={52}>
        <circle cx={cx+1} cy={cy+1} r={r+2} fill="#000"/>
        <circle cx={cx} cy={cy} r={r+2} fill="#1a1a1a"/>
        <circle cx={cx} cy={cy} r={r} fill="#FFFEF5"/>
        {Array.from({length:12},(_,i)=>{
          const a=(i*30-90)*Math.PI/180;
          return <line key={i}
            x1={cx+Math.cos(a)*(r-5)} y1={cy+Math.sin(a)*(r-5)}
            x2={cx+Math.cos(a)*(r-1)} y2={cy+Math.sin(a)*(r-1)}
            stroke="#1a1a1a" strokeWidth={i%3===0?2:0.8}/>;
        })}
        {arm(hDeg,r*.52,3,'#1a1a1a')}
        {arm(mDeg,r*.76,2,'#1a1a1a')}
        {arm(sDeg,r*.80,1,'#C0392B')}
        <circle cx={cx} cy={cy} r={2} fill="#1a1a1a"/>
      </svg>
      <div style={{fontSize:9,fontWeight:900,...ZH,textAlign:'center'}}>{label}</div>
      <div style={{fontSize:7,color:'#666',fontFamily:'monospace',textAlign:'center'}}>{sub}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HUD OVERLAY (3 Areas, no opaque background)
// ══════════════════════════════════════════════════════════════
function HUDOverlay() {
  const { state, derived } = useGame();
  const { player } = state;
  const { dayStatus, totalXP } = derived;
  const avatarUrl = buildAvatarUrl(player.avatar);
  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0,8) : '中轉機場';

  // ── Day status card ──
  let statusBg='#E8E4D8', statusText='', statusSub='';
  if (dayStatus.type==='none') {
    statusText = `台灣整備中`;
    statusSub  = `基地充能第 ${Math.max(dayStatus.days,1)} 天`;
  } else if (dayStatus.type==='countdown') {
    statusBg   = '#FFF8DC';
    statusText = `出發倒數 D-${dayStatus.days} 天`;
    statusSub  = player.arrivalDate;
  } else {
    statusBg   = '#E4F4E4';
    statusText = `登陸愛爾蘭：Day ${dayStatus.days}`;
    statusSub  = `${player.arrivalDate} 抵達`;
  }

  return (
    <div style={{
      position:'absolute', inset:0,
      pointerEvents:'none',
      display:'flex', flexDirection:'column',
      justifyContent:'space-between',
      padding:'8px 8px 6px',
    }}>

      {/* ── HUD Area 1: 個人名牌 + Gold ── */}
      <div style={{display:'flex', gap:6, alignItems:'flex-start'}}>
        {/* Name card */}
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          background:'rgba(253,251,247,0.90)',
          border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
          padding:'3px 7px 3px 3px',
        }}>
          <div style={{
            width:38, height:38, flexShrink:0,
            border:'2px solid #000', background:'#b6e3f4', overflow:'hidden',
          }}>
            <img src={avatarUrl} alt="" style={{width:'100%',display:'block'}}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:900,lineHeight:1.1,...ZH}}>
              {player.name||'旅行者'}
            </div>
            <div style={{fontSize:9,color:'#666',...ZH}}>
              {player.gender==='female'?'♀ 女':player.gender==='male'?'♂ 男':'冒險者'} · LV.1
            </div>
          </div>
        </div>

        {/* Gold / XP */}
        <div style={{
          background:'rgba(0,0,0,0.85)',
          border:'2.5px solid #FFD700', boxShadow:'3px 3px 0 rgba(0,0,0,0.6)',
          padding:'3px 10px',
          display:'flex', alignItems:'center', gap:5,
        }}>
          <span style={{fontSize:10,color:'#FFD700',...ZH}}>XP</span>
          <span style={{
            fontSize:22, fontWeight:900, color:'#FFD700',
            fontFamily:"'Itim', cursive", letterSpacing:'0.05em',
          }}>{totalXP}</span>
        </div>

        {/* Day status card */}
        <div style={{
          background: statusBg,
          border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
          padding:'4px 10px', minWidth:130,
        }}>
          <div style={{fontSize:11,fontWeight:900,...ZH}}>{statusText}</div>
          <div style={{fontSize:8,color:'#666',marginTop:1,...ZH}}>{statusSub}</div>
        </div>

        {/* Flight tag */}
        {player.flightNumber && (
          <div style={{
            background:'rgba(0,0,0,0.82)',
            border:'2px solid #FFD700', boxShadow:'3px 3px 0 rgba(0,0,0,0.5)',
            padding:'3px 8px',
          }}>
            <span style={{fontSize:10,color:'#FFD700',fontWeight:700,...EN}}>
              {player.flightNumber}
              {player.flightTime?` @ ${player.flightTime}`:''}
            </span>
          </div>
        )}
      </div>

      {/* ── HUD Area 3: 時空同步時鐘組 ── */}
      <div style={{display:'flex', gap:5, justifyContent:'flex-end'}}>
        <ToyClockBtn offset={8}             label="台灣"       sub="GMT+8"           bg="#FFE4E1"/>
        <ToyClockBtn offset={transitOffset} label={transitLabel} sub={`GMT+${transitOffset}`} bg="#EDE7F6"/>
        <ToyClockBtn offset={1}             label="愛爾蘭"     sub="GMT+1"           bg="#E8F5E9"/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME SCREEN ROOT
// ══════════════════════════════════════════════════════════════
export function HomeScreen() {
  return (
    <div style={{height:'100%', position:'relative', overflow:'hidden'}}>
      <RoomSVG />
      <HUDOverlay />
    </div>
  );
}
