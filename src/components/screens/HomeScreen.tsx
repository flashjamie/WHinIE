import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { buildAvatarUrl, ZH, EN } from '../../data/constants';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════
type FurnitureType =
  | 'rug' | 'sofa' | 'guitar' | 'backpack'
  | 'island' | 'microwave' | 'oven' | 'sink'
  | 'desk' | 'bed' | 'wardrobe' | 'bookshelf' | 'plant';

interface PlacedItem {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  stackedOn?: string;
  zOffset?: number;
}

interface OwnedItem {
  type: FurnitureType;
  label: string;
}

// ══════════════════════════════════════════════════════════════
// INITIAL STATE
// ══════════════════════════════════════════════════════════════
const CATALOG: OwnedItem[] = [
  { type: 'sofa',      label: '沙發'   },
  { type: 'bed',       label: '床'     },
  { type: 'desk',      label: '書桌'   },
  { type: 'wardrobe',  label: '衣櫃'   },
  { type: 'bookshelf', label: '書櫃'   },
  { type: 'island',    label: '廚島'   },
  { type: 'microwave', label: '微波爐' },
  { type: 'oven',      label: '烤箱'   },
  { type: 'sink',      label: '水槽'   },
  { type: 'rug',       label: '地毯'   },
  { type: 'guitar',    label: '吉他'   },
  { type: 'backpack',  label: '背包'   },
  { type: 'plant',     label: '盆栽'   },
];

const DEFAULT_PLACED: PlacedItem[] = [
  { id: 'p_rug',       type: 'rug',       x: 200, y: 270, rotation: 0 },
  { id: 'p_sofa',      type: 'sofa',      x: 40,  y: 210, rotation: 0 },
  { id: 'p_guitar',    type: 'guitar',    x: 28,  y: 158, rotation: 0 },
  { id: 'p_backpack',  type: 'backpack',  x: 96,  y: 248, rotation: 0 },
  { id: 'p_island',    type: 'island',    x: 340, y: 198, rotation: 0 },
  { id: 'p_microwave', type: 'microwave', x: 352, y: 158, rotation: 0, stackedOn: 'p_island', zOffset: -40 },
  { id: 'p_desk',      type: 'desk',      x: 500, y: 190, rotation: 0 },
];

const DEFAULT_OWNED: OwnedItem[] = CATALOG.filter(c =>
  !DEFAULT_PLACED.some(p => p.type === c.type)
);

// ══════════════════════════════════════════════════════════════
// CLOCK HOOK
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

// ══════════════════════════════════════════════════════════════
// SKY + WEATHER HOOK
// ══════════════════════════════════════════════════════════════
type WeatherType = 'clear' | 'cloudy' | 'rain';

function useSkyAndWeather(arrived: boolean) {
  const [hour, setHour] = useState(() => new Date().getHours());
  const [weather] = useState<WeatherType>(() => {
    const r = Math.random();
    if (arrived) return r < 0.5 ? 'rain' : r < 0.8 ? 'cloudy' : 'clear';
    return r < 0.2 ? 'cloudy' : 'clear';
  });

  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(id);
  }, []);

  let sky: [string, string, string];
  if (hour < 5 || hour >= 22)      sky = ['#020212', '#0A0E2C', '#141C44'];
  else if (hour < 7)                sky = ['#6B1A2A', '#D4603A', '#F4C060'];
  else if (hour >= 19 && hour < 22) sky = ['#7A1E3A', '#D04428', '#F09030'];
  else if (hour >= 16)              sky = ['#2A5A8C', '#5A9AC0', '#A0C8E0'];
  else if (arrived)                 sky = ['#3A6A8C', '#6AAEC8', '#A8D4E8'];
  else                              sky = ['#1A5A90', '#3A9AC8', '#80CAE8'];

  return { sky, weather };
}

// ══════════════════════════════════════════════════════════════
// WALL ANALOG CLOCK (SVG sub-component, rendered inside RoomSVG)
// ══════════════════════════════════════════════════════════════
function WallClock({ cx, cy, r, offset, label }: {
  cx: number; cy: number; r: number;
  offset: number; label: string;
}) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const arm = (deg: number, len: number, sw: number, col: string) => {
    const rad = deg * Math.PI / 180;
    return (
      <line
        x1={cx} y1={cy}
        x2={cx + Math.cos(rad) * len}
        y2={cy + Math.sin(rad) * len}
        stroke={col} strokeWidth={sw} strokeLinecap="round"
      />
    );
  };
  return (
    <g>
      {/* Clock shadow */}
      <circle cx={cx + 2} cy={cy + 2} r={r + 3} fill="rgba(0,0,0,0.18)" />
      {/* Clock body */}
      <circle cx={cx} cy={cy} r={r + 3} fill="#3A2408" stroke="#1a1a1a" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r}     fill="#FDF8EE" />
      {/* Hour ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const isQ = i % 3 === 0;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * (r - (isQ ? 6 : 4))}
            y1={cy + Math.sin(a) * (r - (isQ ? 6 : 4))}
            x2={cx + Math.cos(a) * (r - 1)}
            y2={cy + Math.sin(a) * (r - 1)}
            stroke="#2C1A08" strokeWidth={isQ ? 2 : 0.8}
          />
        );
      })}
      {arm(hDeg, r * 0.52, 2.5, '#1a1a1a')}
      {arm(mDeg, r * 0.74, 1.8, '#1a1a1a')}
      {arm(sDeg, r * 0.78, 1,   '#C0392B')}
      <circle cx={cx} cy={cy} r={2} fill="#1a1a1a" />
      {/* Label below clock */}
      <text x={cx} y={cy + r + 11} textAnchor="middle" fontSize={8}
        fontWeight="700" fill="#5C3C18"
        fontFamily="'Noto Sans TC', sans-serif">
        {label}
      </text>
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
// REALISTIC SVG FURNITURE COMPONENTS
// ══════════════════════════════════════════════════════════════
const F: Record<FurnitureType, React.FC<{ x: number; y: number; rotation?: number }>> = {

  rug: ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={0} rx={150} ry={30} fill="#A06838" opacity={0.32} stroke="#7A4820" strokeWidth={1}/>
      <ellipse cx={0} cy={0} rx={130} ry={22} fill="#B87840" opacity={0.22} stroke="#C09050" strokeWidth={0.8} strokeDasharray="6,4"/>
      <ellipse cx={0} cy={0} rx={110} ry={16} fill="none" stroke="#D4A860" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4}/>
    </g>
  ),

  sofa: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(5px 8px 0 rgba(0,0,0,0.22))' }}>
      {/* Shadow */}
      <ellipse cx={95} cy={76} rx={100} ry={13} fill="#000" opacity={0.1}/>
      {/* Back rest */}
      <polygon points="0,6 200,6 200,52 0,52" fill="#9B6A3C" stroke="#7A5030" strokeWidth={1.5}/>
      {/* Back cushions */}
      <polygon points="4,8  94,8  94,50 4,50"   fill="#B07A48" stroke="#8A5C30" strokeWidth={1}/>
      <polygon points="106,8 196,8 196,50 106,50" fill="#B07A48" stroke="#8A5C30" strokeWidth={1}/>
      {/* Cushion detail */}
      <path d="M 4,29 Q 49,24 94,29" stroke="#8A5C30" strokeWidth="0.8" fill="none"/>
      <path d="M 106,29 Q 151,24 196,29" stroke="#8A5C30" strokeWidth="0.8" fill="none"/>
      {/* Seat */}
      <polygon points="0,52  200,52  212,82 -12,82" fill="#C48850" stroke="#A06838" strokeWidth={1.5}/>
      {/* Seat cushions */}
      <polygon points="2,53  95,53  102,80 -6,80"  fill="#D4985C" stroke="#B07840" strokeWidth={1}/>
      <polygon points="105,53 198,53 208,80 98,80" fill="#D4985C" stroke="#B07840" strokeWidth={1}/>
      <path d="M -2,66 Q 48,62 100,66" stroke="#B07840" strokeWidth="0.8" fill="none"/>
      <path d="M 102,66 Q 152,62 210,66" stroke="#B07840" strokeWidth="0.8" fill="none"/>
      {/* Armrests */}
      <polygon points="-12,4 12,4 12,82 -22,82" fill="#7A5030" stroke="#5A3818" strokeWidth={1.2}/>
      <polygon points="190,4 212,4 220,82 188,82" fill="#7A5030" stroke="#5A3818" strokeWidth={1.2}/>
      {/* Legs */}
      <rect x={-4}  y={82} width={8}  height={14} rx={2} fill="#4A2C10"/>
      <rect x={186} y={82} width={8}  height={14} rx={2} fill="#4A2C10"/>
    </g>
  ),

  bed: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(5px 8px 0 rgba(0,0,0,0.2))' }}>
      <ellipse cx={80} cy={100} rx={88} ry={12} fill="#000" opacity={0.1}/>
      {/* Frame */}
      <polygon points="0,20 164,20 176,96 12,96" fill="#5A3C1A" stroke="#3A2408" strokeWidth={1.5}/>
      {/* Mattress */}
      <polygon points="4,14 160,14 172,88 16,88"  fill="#E8DCC8" stroke="#C8B8A0" strokeWidth={1.2}/>
      {/* Pillow */}
      <polygon points="8,16  68,16  76,36  16,36"  fill="#FDFAF4" stroke="#D8D0C0" strokeWidth={1}/>
      <polygon points="78,16 138,16 146,36 86,36"  fill="#FDFAF4" stroke="#D8D0C0" strokeWidth={1}/>
      {/* Blanket */}
      <polygon points="8,36  170,36  178,84 16,84" fill="#6A8AC0" stroke="#4A6AA0" strokeWidth={1}/>
      <path d="M 8,36 Q 89,32 170,36" stroke="#5A7AB0" strokeWidth="1.5" fill="none"/>
      <path d="M 12,58 Q 93,54 172,58" stroke="#5A7AB0" strokeWidth="0.8" fill="none" opacity="0.6"/>
      {/* Headboard */}
      <polygon points="-8,-18 168,-18 164,20 0,20" fill="#7A5230" stroke="#5A3818" strokeWidth={1.5}/>
      <rect x={4} y={-14} width={72} height={30} rx={4} fill="#8A6240" stroke="#6A4828" strokeWidth={1}/>
      <rect x={84} y={-14} width={72} height={30} rx={4} fill="#8A6240" stroke="#6A4828" strokeWidth={1}/>
      {/* Legs */}
      <rect x={4}   y={96} width={8} height={16} rx={2} fill="#3A2408"/>
      <rect x={160} y={96} width={8} height={16} rx={2} fill="#3A2408"/>
    </g>
  ),

  desk: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(4px 6px 0 rgba(0,0,0,0.18))' }}>
      {/* Legs */}
      <rect x={4}   y={36} width={7} height={24} rx={2} fill="#5A3C18"/>
      <rect x={116} y={36} width={7} height={24} rx={2} fill="#5A3C18"/>
      {/* Tabletop shadow */}
      <polygon points="4,5 132,5 140,36 12,36" fill="#000" opacity={0.12}/>
      {/* Tabletop underside */}
      <polygon points="-2,-12 128,-12 136,4 4,4" fill="#9A7040" stroke="#7A5028" strokeWidth={1.5}/>
      {/* Tabletop surface */}
      <polygon points="4,4 132,4 140,36 12,36"  fill="#B08848" stroke="#8A6830" strokeWidth={1.5}/>
      {/* Wood grain */}
      <line x1={20} y1={6} x2={26} y2={34} stroke="#A07838" strokeWidth="0.6" opacity="0.5"/>
      <line x1={50} y1={5} x2={57} y2={35} stroke="#A07838" strokeWidth="0.6" opacity="0.5"/>
      <line x1={80} y1={5} x2={88} y2={35} stroke="#A07838" strokeWidth="0.6" opacity="0.5"/>
      {/* Monitor */}
      <polygon points="10,-28 78,-28 82,-12 6,-12"  fill="#2C2C2C" stroke="#1a1a1a" strokeWidth={1}/>
      <polygon points="6,-12 82,-12 88,-2 0,-2"     fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1}/>
      <polygon points="12,-26 76,-26 80,-13 8,-13"  fill="#5DADE2" opacity={0.55}/>
      <rect x={38} y={-2} width={14} height={4} rx={1} fill="#4A4A4A"/>
      {/* Mouse */}
      <ellipse cx={104} cy={6} rx={9} ry={6} fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={0.8}/>
      <line x1={104} y1={0} x2={104} y2={12} stroke="#3a3a3a" strokeWidth="0.8"/>
    </g>
  ),

  wardrobe: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(5px 8px 0 rgba(0,0,0,0.2))' }}>
      {/* Body */}
      <polygon points="0,4 108,4 116,100 8,100" fill="#5A4028" stroke="#3A2810" strokeWidth={1.5}/>
      {/* Top face */}
      <polygon points="-6,-8 108,-8 116,4 0,4"  fill="#7A5838" stroke="#5A3A20" strokeWidth={1.5}/>
      {/* Door divider */}
      <line x1={54} y1={4} x2={62} y2={100} stroke="#3A2810" strokeWidth={2}/>
      {/* Left door panel */}
      <polygon points="4,8 52,8 60,96 12,96" fill="#6A4C30" stroke="#4A3418" strokeWidth={0.8}/>
      {/* Right door panel */}
      <polygon points="56,8 104,8 112,96 64,96" fill="#6A4C30" stroke="#4A3418" strokeWidth={0.8}/>
      {/* Handles */}
      <circle cx={48} cy={52} r={4} fill="#C0A060" stroke="#A08040" strokeWidth={1}/>
      <circle cx={62} cy={52} r={4} fill="#C0A060" stroke="#A08040" strokeWidth={1}/>
      {/* Feet */}
      <rect x={4}   y={100} width={10} height={8} rx={2} fill="#3A2408"/>
      <rect x={100} y={100} width={10} height={8} rx={2} fill="#3A2408"/>
    </g>
  ),

  bookshelf: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(4px 6px 0 rgba(0,0,0,0.18))' }}>
      {/* Back */}
      <polygon points="0,0 90,0 98,100 8,100" fill="#7A5C30" stroke="#5A3C18" strokeWidth={1.5}/>
      {/* Top */}
      <polygon points="-6,-8 90,-8 98,0 0,0" fill="#9A7440" stroke="#7A5428" strokeWidth={1.5}/>
      {/* Shelves */}
      {[0.28, 0.54, 0.78].map((t, i) => (
        <polygon key={i}
          points={`${-2 + t*8},${t*100} ${90 - t*8},${t*100} ${90 - t*8 + 6},${t*100 + 6} ${-2 + t*8 + 6},${t*100 + 6}`}
          fill="#6A4820" stroke="#4A3010" strokeWidth={0.8}/>
      ))}
      {/* Books */}
      {[
        { x: 4,  y: 6,  w: 10, h: 24, c: '#C0392B' },
        { x: 16, y: 4,  w: 12, h: 26, c: '#2E86C1' },
        { x: 30, y: 8,  w: 9,  h: 22, c: '#F39C12' },
        { x: 41, y: 6,  w: 11, h: 24, c: '#27AE60' },
        { x: 6,  y: 32, w: 13, h: 22, c: '#8E44AD' },
        { x: 21, y: 30, w: 10, h: 24, c: '#E74C3C' },
        { x: 33, y: 34, w: 11, h: 20, c: '#1A5276' },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} stroke="#1a1a1a" strokeWidth="0.5" rx={0.5}/>
      ))}
    </g>
  ),

  island: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(5px 8px 0 rgba(0,0,0,0.15))' }}>
      {/* Shadow */}
      <polygon points="8,7 172,7 192,68 28,68" fill="#000" opacity={0.12}/>
      {/* Body */}
      <polygon points="0,30 166,30 184,64 18,64" fill="#7A6040" stroke="#5A4228" strokeWidth={1.5}/>
      {/* Counter top */}
      <polygon points="-6,12 166,12 184,30 0,30" fill="#E8DCC8" stroke="#C8B8A0" strokeWidth={1.5}/>
      {/* Marble veins */}
      <path d="M 10,14 Q 50,20 90,14 Q 130,10 160,18" stroke="#D0C4B0" strokeWidth="0.9" fill="none" opacity="0.7"/>
      <path d="M 30,24 Q 80,18 130,24" stroke="#D0C4B0" strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* Edge highlight */}
      <line x1={0} y1={30} x2={166} y2={30} stroke="#B0A090" strokeWidth={0.8} strokeDasharray="5,3"/>
      {/* Legs */}
      <rect x={6}   y={64} width={8} height={20} rx={2} fill="#4A3018"/>
      <rect x={168} y={64} width={8} height={20} rx={2} fill="#4A3018"/>
    </g>
  ),

  microwave: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.22))' }}>
      {/* Body shadow */}
      <polygon points="4,5 78,5 86,30 12,30" fill="#000" opacity={0.14}/>
      {/* Bottom face */}
      <polygon points="0,16 72,16 80,30 8,30" fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1.2}/>
      {/* Top face */}
      <polygon points="-4,4 72,4 80,16 0,16"  fill="#4C4C4C" stroke="#2a2a2a" strokeWidth={1.2}/>
      {/* Door */}
      <polygon points="2,16 46,16 52,30 6,30"  fill="#2A2A2A" stroke="#1a1a1a" strokeWidth={0.8}/>
      <polygon points="6,17 40,17 46,26 10,26" fill="#0A1A2A"/>
      {/* Control panel */}
      <polygon points="48,16 70,16 76,30 54,30" fill="#5C5C5C" stroke="#3a3a3a" strokeWidth={0.8}/>
      <polygon points="50,18 68,18 73,27 56,27" fill="#001010"/>
      <text x={61} y={24} fontSize={6} fill="#00FF88" fontFamily="monospace" textAnchor="middle">12:00</text>
      {[0,1,2].map(i => <circle key={i} cx={58+i*5} cy={29} r={1.5} fill="#555" stroke="#333" strokeWidth="0.5"/>)}
      <line x1={48} y1={17} x2={54} y2={29} stroke="#888" strokeWidth={2.2} strokeLinecap="round"/>
    </g>
  ),

  oven: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(4px 6px 0 rgba(0,0,0,0.2))' }}>
      {/* Body */}
      <polygon points="0,14 72,14 80,64 8,64" fill="#2C2C2C" stroke="#1a1a1a" strokeWidth={1.5}/>
      {/* Top */}
      <polygon points="-4,0 72,0 80,14 0,14"  fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1.5}/>
      {/* Stovetop burners */}
      <ellipse cx={18} cy={7}  rx={13} ry={5} fill="none" stroke="#555" strokeWidth={1.5}/>
      <ellipse cx={52} cy={7}  rx={13} ry={5} fill="none" stroke="#555" strokeWidth={1.5}/>
      <ellipse cx={18} cy={7}  rx={7}  ry={3} fill="#1a1a1a" stroke="#444" strokeWidth={1}/>
      <ellipse cx={52} cy={7}  rx={7}  ry={3} fill="#1a1a1a" stroke="#444" strokeWidth={1}/>
      {/* Oven door */}
      <polygon points="4,16 68,16 76,60 12,60" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth={1}/>
      <polygon points="8,18 64,18 72,56 16,56" fill="#222" />
      {/* Window on oven door */}
      <polygon points="12,20 58,20 66,50 20,50" fill="#0A1A0A" stroke="#2a2a2a" strokeWidth={0.5}/>
      {/* Handle */}
      <line x1={16} y1={19} x2={66} y2={19} stroke="#888" strokeWidth={3} strokeLinecap="round"/>
      {/* Knobs */}
      {[10, 24, 50, 64].map((kx, i) => (
        <circle key={i} cx={kx} cy={8} r={3} fill="#666" stroke="#444" strokeWidth="0.8"/>
      ))}
    </g>
  ),

  sink: ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={26} cy={18} rx={24} ry={10} fill="#C8D8E0" stroke="#A0B8C8" strokeWidth={1.2}/>
      <ellipse cx={26} cy={18} rx={18} ry={7}  fill="#A8C0D0" stroke="#88A8C0" strokeWidth={0.8}/>
      <ellipse cx={26} cy={19} rx={6}  ry={3}  fill="#888"/>
      {/* Faucet */}
      <rect x={22}  y={4}   width={8} height={12} rx={2} fill="#C0C0C0" stroke="#909090" strokeWidth={1}/>
      <path d="M 26,4 Q 26,-6 36,-6" stroke="#B0B8C0" strokeWidth={5} fill="none" strokeLinecap="round"/>
      <circle cx={36} cy={-6} r={4} fill="#C8C8C8" stroke="#909090" strokeWidth={1}/>
      {/* Water drops */}
      <ellipse cx={36} cy={2} rx={1.5} ry={2.5} fill="#A8C8E0" opacity={0.7}/>
    </g>
  ),

  guitar: ({ x, y, rotation }) => (
    <g transform={`translate(${x},${y}) rotate(${rotation ?? -15})`} style={{ filter: 'drop-shadow(3px 5px 0 rgba(0,0,0,0.22))' }}>
      {/* Neck */}
      <rect x={11} y={-86} width={9}  height={108} rx={3} fill="#8B5C2A" stroke="#5A3C18" strokeWidth={1}/>
      {/* Headstock */}
      <rect x={8}  y={-96} width={15} height={14}  rx={3} fill="#6B4418" stroke="#3A2408" strokeWidth={1}/>
      {/* Tuning pegs */}
      {[-92, -87, -82].map((py, i) => [
        <circle key={`l${i}`} cx={6}  cy={py} r={3} fill="#D4B060" stroke="#B09040" strokeWidth={0.8}/>,
        <circle key={`r${i}`} cx={26} cy={py} r={3} fill="#D4B060" stroke="#B09040" strokeWidth={0.8}/>,
      ])}
      {/* Upper body */}
      <path d="M 0,6 Q -20,0 -16,16 Q -18,24 -8,28 Q 4,34 16,28 Q 26,22 26,14 Q 28,4 18,6 Z"
        fill="#C4803C" stroke="#8B5020" strokeWidth={1.5}/>
      {/* Lower body */}
      <path d="M -8,28 Q -22,30 -22,46 Q -22,66 -6,70 Q 8,74 22,66 Q 36,58 32,44 Q 32,28 16,28 Z"
        fill="#C4803C" stroke="#8B5020" strokeWidth={1.5}/>
      {/* Sound hole */}
      <circle cx={13} cy={48} r={9}  fill="#5A3010" stroke="#3A1C00" strokeWidth={1}/>
      <circle cx={13} cy={48} r={7}  fill="#3A1A00" opacity={0.8}/>
      {/* Strings */}
      {[9, 12, 15, 18, 21, 24].map((sx, i) => (
        <line key={i} x1={sx} y1={-86} x2={sx} y2={68} stroke="#D4C090" strokeWidth={0.5}/>
      ))}
      {/* Frets */}
      {[-60, -40, -20, 0].map((fy, i) => (
        <line key={i} x1={9} y1={fy} x2={26} y2={fy} stroke="#B09060" strokeWidth={1}/>
      ))}
    </g>
  ),

  backpack: ({ x, y }) => (
    <g transform={`translate(${x},${y})`} style={{ filter: 'drop-shadow(3px 5px 0 rgba(0,0,0,0.2))' }}>
      <ellipse cx={24} cy={62} rx={22} ry={6} fill="#000" opacity={0.12}/>
      {/* Main body */}
      <rect x={0}  y={4}  width={48} height={54} rx={7} fill="#5A6B3C" stroke="#3A4C24" strokeWidth={1.8}/>
      {/* Top flap */}
      <rect x={2}  y={0}  width={44} height={18} rx={5} fill="#6A7C48" stroke="#4A5C30" strokeWidth={1.2}/>
      {/* Front pocket */}
      <rect x={6}  y={32} width={36} height={24} rx={5} fill="#4A5C2C" stroke="#3A4C1C" strokeWidth={1.2}/>
      {/* Pocket zipper */}
      <line x1={8}  y1={32} x2={40} y2={32} stroke="#C8A840" strokeWidth={2} strokeLinecap="round"/>
      <circle cx={24} cy={32} r={2.5} fill="#D4B050" stroke="#A08030" strokeWidth={0.8}/>
      {/* Main zipper */}
      <path d="M 4,18 Q 24,15 44,18" stroke="#C8A840" strokeWidth={1.8} fill="none" strokeLinecap="round"/>
      {/* Straps visible */}
      <path d="M 14,0 Q 24,-10 34,0" stroke="#3A4C1C" strokeWidth={3} fill="none" strokeLinecap="round"/>
      {/* Side straps */}
      <rect x={8}  y={8} width={5} height={42} rx={2.5} fill="#4A5C2C" opacity={0.7}/>
      <rect x={35} y={8} width={5} height={42} rx={2.5} fill="#4A5C2C" opacity={0.7}/>
      {/* Ireland flag patch */}
      <rect x={28} y={6} width={15} height={10} rx={1} fill="#169B62"/>
      <rect x={31} y={6} width={5}  height={10} fill="#fff"/>
      <rect x={36} y={6} width={4}  height={10} fill="#FF883E"/>
      <rect x={28} y={6} width={15} height={10} rx={1} fill="none" stroke="#1a1a1a" strokeWidth="0.5"/>
    </g>
  ),

  plant: ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      {/* Pot */}
      <polygon points="4,32 36,32 40,54 0,54"  fill="#C44A2A" stroke="#A33020" strokeWidth={1.2}/>
      <polygon points="0,28 40,28 44,34 -4,34" fill="#D4583A" stroke="#B04030" strokeWidth={1}/>
      {/* Soil */}
      <ellipse cx={20} cy={29} rx={20} ry={5} fill="#3A2410" opacity={0.8}/>
      {/* Stems */}
      <path d="M 20,28 Q 10,16 6,4"  stroke="#3A8020" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <path d="M 20,28 Q 24,14 30,6"  stroke="#3A8020" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <path d="M 20,28 Q 20,12 18,2"  stroke="#3A8020" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      {/* Leaves */}
      <ellipse cx={6}  cy={2}  rx={10} ry={6} fill="#4AA830" stroke="#2A8010" strokeWidth={1} transform="rotate(-20,6,2)"/>
      <ellipse cx={30} cy={4}  rx={11} ry={6} fill="#4AA830" stroke="#2A8010" strokeWidth={1} transform="rotate(15,30,4)"/>
      <ellipse cx={18} cy={0}  rx={9}  ry={5} fill="#5AC040" stroke="#2A8010" strokeWidth={1}/>
    </g>
  ),
};

// ══════════════════════════════════════════════════════════════
// WEATHER OVERLAY (inside window clip)
// ══════════════════════════════════════════════════════════════
function WeatherOverlay({ weather, winX, W, H }: {
  weather: WeatherType; winX: number; W: number; H: number;
}) {
  const [drops, setDrops] = useState<{ x: number; y: number; speed: number; len: number }[]>(() =>
    weather === 'rain'
      ? Array.from({ length: 30 }, () => ({
          x: winX + Math.random() * (W - winX),
          y: Math.random() * H,
          speed: 3 + Math.random() * 4,
          len: 8 + Math.random() * 10,
        }))
      : []
  );

  useEffect(() => {
    if (weather !== 'rain') return;
    const id = setInterval(() => {
      setDrops(prev => prev.map(d => ({
        ...d,
        y: d.y > H ? -d.len : d.y + d.speed,
      })));
    }, 50);
    return () => clearInterval(id);
  }, [weather, H]);

  if (weather === 'clear') return null;

  return (
    <g clipPath="url(#wClip)">
      {weather === 'rain' && drops.map((d, i) => (
        <line key={i} x1={d.x} y1={d.y} x2={d.x - 2} y2={d.y + d.len}
          stroke="rgba(180,210,240,0.6)" strokeWidth={1} strokeLinecap="round"/>
      ))}
      {weather === 'cloudy' && (
        <>
          <ellipse cx={winX + 30} cy={40}  rx={32} ry={16} fill="rgba(220,225,230,0.7)"/>
          <ellipse cx={winX + 50} cy={32}  rx={22} ry={18} fill="rgba(220,225,230,0.7)"/>
          <ellipse cx={winX + 20} cy={48}  rx={18} ry={10} fill="rgba(210,215,220,0.6)"/>
          <ellipse cx={winX + 75} cy={55}  rx={28} ry={14} fill="rgba(215,220,225,0.6)"/>
          <ellipse cx={winX + 95} cy={45}  rx={20} ry={16} fill="rgba(220,225,230,0.7)"/>
        </>
      )}
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN 2.5D ROOM SVG
// ══════════════════════════════════════════════════════════════
function RoomSVG({
  placedItems, editMode, selectedId,
  onItemClick, roomScale,
  transitOffset, transitLabel,
}: {
  placedItems: PlacedItem[];
  editMode: boolean;
  selectedId: string | null;
  onItemClick: (id: string) => void;
  roomScale: number;
  transitOffset: number;
  transitLabel: string;
}) {
  const { derived } = useGame();
  const { sky, weather } = useSkyAndWeather(derived.hasArrived);

  const W = 800, H = 460;
  const winX = Math.floor(W * 0.80);  // window starts at 80%
  const ceilY = 20, wallBotY = 220;
  const roomW = winX;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={sky[0]}/>
          <stop offset="55%"  stopColor={sky[1]}/>
          <stop offset="100%" stopColor={sky[2]}/>
        </linearGradient>
        {/* Floor gradient */}
        <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5E8CC"/>
          <stop offset="100%" stopColor="#E0CC9C"/>
        </linearGradient>
        {/* Floor tile pattern */}
        <pattern id="tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="url(#floorG)"/>
          <rect width="40" height="40" fill="none" stroke="#D4B878" strokeWidth="0.5" opacity="0.5"/>
        </pattern>
        {/* Window clip */}
        <clipPath id="wClip">
          <polygon points={`${winX},0 ${W},0 ${W},${H} ${winX},${H}`}/>
        </clipPath>
        {/* Room clip */}
        <clipPath id="roomClip">
          <rect x="0" y="0" width={roomW} height={H}/>
        </clipPath>
      </defs>

      {/* ── CEILING ── */}
      <rect x={0} y={0} width={roomW} height={ceilY} fill="#D0C4AD"/>
      <line x1={0} y1={ceilY} x2={roomW} y2={ceilY} stroke="#1a1a1a" strokeWidth={2.5}/>

      {/* ── BACK WALL ── */}
      <rect x={0} y={ceilY} width={roomW} height={wallBotY - ceilY} fill="#F4EDE0"/>
      {/* Subtle wallpaper lines */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={i * 50} y1={ceilY} x2={i * 50} y2={wallBotY}
          stroke="#E8DCCa" strokeWidth="0.7" opacity="0.5"/>
      ))}
      {/* WHinIE watermark */}
      <text x={roomW / 2} y={(ceilY + wallBotY) / 2 + 20} textAnchor="middle"
        fontSize={62} fill="rgba(180,148,100,0.07)"
        fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold">
        WHinIE
      </text>
      {/* Baseboard */}
      <rect x={0} y={wallBotY - 14} width={roomW} height={14} fill="#C8B890" stroke="#B0A078" strokeWidth="0.8"/>

      {/* ── WALL CLOCKS ── */}
      <WallClock cx={120} cy={110} r={28} offset={8}             label="台灣 GMT+8"/>
      <WallClock cx={roomW/2} cy={110} r={28} offset={transitOffset} label={transitLabel}/>
      <WallClock cx={roomW - 120} cy={110} r={28} offset={1}    label="愛爾蘭 GMT+1"/>

      {/* ── FLOOR ── */}
      <polygon points={`0,${wallBotY} ${roomW},${wallBotY} ${W},${H} 0,${H}`} fill="url(#tile)"/>
      {/* Floor perspective lines */}
      {[0.15, 0.3, 0.5, 0.7, 0.85].map((t, i) => (
        <line key={`fv${i}`}
          x1={t * roomW} y1={wallBotY}
          x2={t * roomW + (W - roomW) * t} y2={H}
          stroke="#C4A860" strokeWidth="0.6" opacity="0.4"/>
      ))}
      {[0.25, 0.55, 0.8].map((t, i) => (
        <line key={`fh${i}`}
          x1={0} y1={wallBotY + (H - wallBotY) * t}
          x2={roomW + (W - roomW) * t} y2={wallBotY + (H - wallBotY) * t}
          stroke="#C4A860" strokeWidth="0.5" opacity="0.4"/>
      ))}

      {/* ── AIRPORT WINDOW (20% right, minimal frame) ── */}
      <rect x={winX} y={0} width={W - winX} height={H} fill="url(#skyG)"/>
      {/* Weather */}
      <WeatherOverlay weather={weather} winX={winX} W={W} H={H}/>
      {/* Distant city/runway silhouette */}
      <g clipPath="url(#wClip)">
        {/* Horizon */}
        <rect x={winX} y={H * 0.62} width={W - winX} height={H * 0.08} fill="#2A2A2A" opacity={0.9}/>
        {/* Runway lights */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={winX + 18 + i * 28} cy={H * 0.64} r={2}
            fill="#FFD700" opacity={0.85}/>
        ))}
        {/* Ground */}
        <rect x={winX} y={H * 0.68} width={W - winX} height={H * 0.32} fill="#1C1C1C" opacity={0.95}/>
        {/* Airport building silhouette */}
        <rect x={winX + 10} y={H * 0.50} width={60} height={H * 0.12} fill="#1a1a2a" opacity={0.85}/>
        <rect x={winX + 25} y={H * 0.44} width={30} height={H * 0.08} fill="#222233" opacity={0.85}/>
        {/* Building windows */}
        {[0,1,2,3].map(i => [0,1,2].map(j => (
          <rect key={`w${i}${j}`}
            x={winX + 14 + i * 14} y={H * 0.52 + j * 12}
            width={8} height={8}
            fill="#FFE060" opacity={0.7}/>
        )))}
        {/* Parked plane silhouette */}
        <g transform={`translate(${winX + 8}, ${H * 0.60})`} opacity={0.7}>
          <ellipse cx={46} cy={0} rx={50} ry={6} fill="#C8C8C8"/>
          <polygon points="10,-2 58,-2 62,4 6,4" fill="#D0D0D0"/>
          <polygon points="2,-2 10,0 14,4" fill="#007A33"/>
          <line x1={8} y1={1} x2={88} y2={1} stroke="#007A33" strokeWidth={1.5}/>
        </g>
      </g>
      {/* Minimal window frame — just 2 thin vertical mullions */}
      <line x1={winX + (W - winX) * 0.33} y1={0} x2={winX + (W - winX) * 0.33} y2={H}
        stroke="#D8C8A0" strokeWidth={2.5} opacity={0.6}/>
      <line x1={winX + (W - winX) * 0.67} y1={0} x2={winX + (W - winX) * 0.67} y2={H}
        stroke="#D8C8A0" strokeWidth={2.5} opacity={0.6}/>
      {/* Window outer frame */}
      <line x1={winX} y1={0} x2={winX} y2={H} stroke="#1a1a1a" strokeWidth={3}/>

      {/* ── FURNITURE ── */}
      <g clipPath="url(#roomClip)">
        {placedItems.map(item => {
          const Comp = F[item.type];
          if (!Comp) return null;
          const isSelected = editMode && item.id === selectedId;
          return (
            <g key={item.id}
              transform={`translate(${item.x},${item.y})`}
              onClick={() => editMode && onItemClick(item.id)}
              style={{ cursor: editMode ? 'pointer' : 'default' }}
            >
              {isSelected && (
                <rect x={-8} y={-60} width={200} height={120}
                  fill="none" stroke="#FFD700" strokeWidth={2}
                  strokeDasharray="6,3" rx={4}/>
              )}
              <Comp x={0} y={0} rotation={item.rotation}/>
            </g>
          );
        })}
      </g>

      {/* ── ROOM OUTLINES ── */}
      <line x1={0} y1={ceilY} x2={0} y2={H}          stroke="#1a1a1a" strokeWidth={3}/>
      <line x1={0} y1={wallBotY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={2.5}/>
      <line x1={winX} y1={ceilY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={3}/>
      <line x1={0} y1={0} x2={roomW} y2={0}           stroke="#1a1a1a" strokeWidth={2}/>

      {/* Edit mode overlay hint */}
      {editMode && (
        <text x={roomW / 2} y={H - 12} textAnchor="middle" fontSize={10}
          fill="rgba(0,0,0,0.4)" fontFamily="'Noto Sans TC', sans-serif">
          點擊道具可收回抽屜・點擊空白處放置選中道具
        </text>
      )}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// FURNITURE DRAWER (Edit Mode)
// ══════════════════════════════════════════════════════════════
function FurnitureDrawer({
  ownedItems, onPickItem, roomGold, onExpand,
}: {
  ownedItems: OwnedItem[];
  onPickItem: (type: FurnitureType) => void;
  roomGold: number;
  onExpand: () => void;
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(253,251,247,0.96)',
      border: '3px solid #000', borderBottom: 'none',
      boxShadow: '0 -4px 0 #000',
      padding: '6px 10px 4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 900, ...ZH, letterSpacing: '0.1em', flexShrink: 0 }}>
          🎒 道具抽屜
        </div>
        <div style={{
          flex: 1, display: 'flex', gap: 5, overflowX: 'auto',
          paddingBottom: 2,
        }}>
          {ownedItems.length === 0 && (
            <div style={{ fontSize: 9, color: '#888', ...ZH, padding: '4px 8px' }}>
              所有道具已放置 ✓
            </div>
          )}
          {ownedItems.map(item => {
            const PreviewComp = F[item.type];
            return (
              <button key={item.type} onClick={() => onPickItem(item.type)} style={{
                flexShrink: 0, width: 52, height: 48,
                border: '2px solid #000', boxShadow: '2px 2px 0 #000',
                background: '#FDFBF7', cursor: 'pointer', padding: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 1,
              }}>
                <svg width={36} height={28} viewBox="-20 -30 80 70">
                  <PreviewComp x={0} y={0}/>
                </svg>
                <div style={{ fontSize: 7, fontWeight: 700, ...ZH, lineHeight: 1 }}>
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={onExpand} style={{
          flexShrink: 0, padding: '5px 10px',
          border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
          background: '#FFD700', cursor: 'pointer',
          fontSize: 10, fontWeight: 900, ...ZH,
          whiteSpace: 'nowrap',
        }}>
          🔨 擴建 ({roomGold} 💰)
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// FLOATING HUD OVERLAY
// ══════════════════════════════════════════════════════════════
function HUDOverlay() {
  const { state, derived } = useGame();
  const { player } = state;
  const { dayStatus, totalXP } = derived;
  const avatarUrl = buildAvatarUrl(player.avatar);
  const [tooltip, setTooltip] = useState<string | null>(null);

  let statusBg = 'rgba(232,228,216,0.90)';
  let statusIcon = '🛰️';
  let statusLine1 = '台灣整備中';
  let statusLine2 = `基地充能第 ${Math.max(dayStatus.days, 1)} 天`;
  let tooltipText = '冒險不急著出發，先整備裝備吧！點擊可補輸入日期。';
  let glowing = false;

  if (dayStatus.type === 'countdown') {
    statusBg = 'rgba(255,248,220,0.92)';
    statusIcon = '✈️';
    statusLine1 = `出發倒數 D-${dayStatus.days}`;
    statusLine2 = player.arrivalDate;
    tooltipText = '檢查你的背包，飛機即將起飛！';
  } else if (dayStatus.type === 'arrived') {
    statusBg = 'rgba(228,244,228,0.92)';
    statusIcon = '☘️';
    statusLine1 = `登陸愛爾蘭：Day ${dayStatus.days}`;
    statusLine2 = `${player.arrivalDate} 抵達`;
    tooltipText = '你已踏上翡翠島！雙幣記帳已解鎖。';
    glowing = true;
  }

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '42%',
      transform: 'translate(-50%, -50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      pointerEvents: 'none',
    }}>
      {/* Avatar + Name */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        pointerEvents: 'auto',
      }}>
        <div style={{
          width: 52, height: 52,
          border: '3px solid #000', boxShadow: '3px 3px 0 #000',
          background: '#b6e3f4', overflow: 'hidden', borderRadius: 2,
        }}>
          <img src={avatarUrl} alt="" style={{ width: '100%', display: 'block' }}/>
        </div>
        <div style={{
          background: 'rgba(253,251,247,0.90)',
          border: '2.5px solid #000', boxShadow: '2px 2px 0 #000',
          padding: '1px 10px',
          fontSize: 13, fontWeight: 900, ...ZH,
        }}>
          {player.name || '旅行者'}
        </div>
      </div>

      {/* Day counter */}
      <div style={{
        fontSize: 22, fontWeight: 900, color: 'rgba(44,26,8,0.85)',
        fontFamily: "'Itim', cursive",
        textShadow: '2px 2px 0 rgba(255,255,255,0.7)',
        letterSpacing: '0.04em',
      }}>
        ⏰ Day {Math.max(dayStatus.days, 1)}
      </div>

      {/* Status card */}
      <div
        style={{
          background: statusBg,
          border: '3px solid #000', boxShadow: '3px 3px 0 #000',
          padding: '5px 14px', textAlign: 'center',
          animation: glowing ? 'hudPulse 2s ease-in-out infinite' : undefined,
          pointerEvents: 'auto', cursor: 'help', position: 'relative',
        }}
        onMouseEnter={() => setTooltip(tooltipText)}
        onMouseLeave={() => setTooltip(null)}
      >
        <div style={{ fontSize: 12, fontWeight: 900, ...ZH }}>
          {statusIcon} {statusLine1}
        </div>
        <div style={{ fontSize: 8, color: '#666', marginTop: 1, ...ZH }}>
          {statusLine2}
        </div>
        {tooltip && (
          <div style={{
            position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
            background: '#1a1a1a', color: '#fff', padding: '4px 10px',
            fontSize: 9, ...ZH, whiteSpace: 'nowrap',
            border: '1.5px solid #444', boxShadow: '2px 2px 0 #555',
            zIndex: 100,
          }}>
            {tooltip}
          </div>
        )}
      </div>

      {/* Gold display */}
      <div style={{
        fontSize: 28, fontWeight: 900,
        color: 'rgba(180,120,0,0.85)',
        fontFamily: "'Itim', cursive",
        textShadow: '2px 2px 0 rgba(255,255,255,0.7), -1px -1px 0 rgba(0,0,0,0.2)',
      }}>
        💰 {totalXP}
      </div>

      {/* Flight tag */}
      {player.flightNumber && (
        <div style={{
          background: 'rgba(0,0,0,0.80)',
          border: '2px solid #FFD700', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
          padding: '2px 10px',
          fontSize: 11, color: '#FFD700', fontWeight: 700, ...EN,
          pointerEvents: 'auto',
        }}>
          {player.flightNumber}{player.flightTime ? ` @ ${player.flightTime}` : ''}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME SCREEN ROOT
// ══════════════════════════════════════════════════════════════
export function HomeScreen() {
  const { derived } = useGame();

  const [editMode,     setEditMode]     = useState(false);
  const [placedItems,  setPlacedItems]  = useState<PlacedItem[]>(DEFAULT_PLACED);
  const [ownedItems,   setOwnedItems]   = useState<OwnedItem[]>(DEFAULT_OWNED);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [pendingType,  setPendingType]  = useState<FurnitureType | null>(null);
  const [roomScale,    setRoomScale]    = useState(1);
  const [gold]                         = useState(0); // future: from GameContext
  const [panOffset,    setPanOffset]    = useState({ x: 0, y: 0 });
  const panStart                       = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const containerRef                   = useRef<HTMLDivElement>(null);

  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0, 6)
    : '中轉';

  // ── Pick item from drawer ──
  const handlePickItem = useCallback((type: FurnitureType) => {
    setPendingType(type);
  }, []);

  // ── Click item on canvas (edit mode) ──
  const handleCanvasItemClick = useCallback((id: string) => {
    if (pendingType) return; // placing new item takes priority
    setSelectedId(prev => prev === id ? null : id);
  }, [pendingType]);

  // ── Click canvas background — place pending item ──
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode) return;

    if (selectedId && !pendingType) {
      // Return selected item to drawer
      const item = placedItems.find(p => p.id === selectedId);
      if (item) {
        setPlacedItems(prev => prev.filter(p => p.id !== selectedId));
        setOwnedItems(prev => {
          if (prev.some(o => o.type === item.type)) return prev;
          const cat = CATALOG.find(c => c.type === item.type);
          return cat ? [...prev, cat] : prev;
        });
        setSelectedId(null);
      }
      return;
    }

    if (pendingType) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scaleX = 800 / rect.width;
      const scaleY = 460 / rect.height;
      const x = (e.clientX - rect.left) * scaleX - panOffset.x;
      const y = (e.clientY - rect.top)  * scaleY - panOffset.y;
      const newItem: PlacedItem = {
        id: `p_${pendingType}_${Date.now()}`,
        type: pendingType, x, y, rotation: 0,
      };
      setPlacedItems(prev => [...prev, newItem]);
      setOwnedItems(prev => {
        const idx = prev.findIndex(o => o.type === pendingType);
        if (idx === -1) return prev;
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      });
      setPendingType(null);
    }
  }, [editMode, pendingType, selectedId, placedItems, panOffset]);

  // ── Room expand ──
  const handleExpand = useCallback(() => {
    const cost = 50;
    if (gold < cost) {
      alert(`需要 ${cost} 💰 才能擴建！（目前：${gold}）`);
      return;
    }
    setRoomScale(prev => prev + 0.25);
  }, [gold]);

  // ── Panning (mouse) ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editMode) return;
    panStart.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
  }, [editMode, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panStart.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPanOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
  }, []);

  const handleMouseUp = useCallback(() => { panStart.current = null; }, []);

  // ── Save layout ──
  const handleSave = useCallback(() => {
    setEditMode(false);
    setSelectedId(null);
    setPendingType(null);
  }, []);

  const drawerOpen = editMode;

  return (
    <>
      <style>{`
        @keyframes hudPulse {
          0%,100% { box-shadow: 3px 3px 0 #000; }
          50%      { box-shadow: 3px 3px 0 #22c55e, 0 0 16px rgba(34,197,94,0.45); }
        }
        @keyframes roomPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.85; }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          width: '100%', height: '100%',
          position: 'relative', overflow: 'hidden',
          cursor: editMode
            ? (pendingType ? 'crosshair' : 'default')
            : (panStart.current ? 'grabbing' : 'grab'),
          background: '#1a0d06',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* ── Scrollable room canvas ── */}
        <div style={{
          width: '100%', height: drawerOpen ? 'calc(100% - 68px)' : '100%',
          transform: `scale(${roomScale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '0 0',
          position: 'relative',
        }}>
          <RoomSVG
            placedItems={placedItems}
            editMode={editMode}
            selectedId={selectedId}
            onItemClick={handleCanvasItemClick}
            roomScale={roomScale}
            transitOffset={transitOffset}
            transitLabel={transitLabel}
          />

          {/* ── Floating HUD ── */}
          {!editMode && <HUDOverlay />}
        </div>

        {/* ── Edit mode controls (top-right) ── */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end',
          zIndex: 20,
        }}>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} style={{
              padding: '6px 12px',
              border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
              background: '#FDFBF7', cursor: 'pointer',
              fontSize: 10, fontWeight: 900, ...ZH,
            }}>
              ✏️ 編輯小屋
            </button>
          ) : (
            <>
              <button onClick={handleSave} style={{
                padding: '6px 14px',
                border: '2.5px solid #000', boxShadow: '3px 3px 0 #22c55e',
                background: '#22c55e', color: '#fff', cursor: 'pointer',
                fontSize: 10, fontWeight: 900, ...ZH,
              }}>
                ✓ 儲存佈置
              </button>
              {selectedId && (
                <button onClick={() => handleCanvasItemClick(selectedId)} style={{
                  padding: '5px 10px',
                  border: '2.5px solid #000', boxShadow: '2px 2px 0 #C0392B',
                  background: '#FDFBF7', cursor: 'pointer',
                  fontSize: 9, fontWeight: 900, ...ZH,
                }}>
                  ↩ 收回道具
                </button>
              )}
              {pendingType && (
                <div style={{
                  padding: '4px 10px', fontSize: 9, fontWeight: 900, ...ZH,
                  background: '#FFD700', border: '2px solid #000',
                }}>
                  點擊畫面放置：{CATALOG.find(c => c.type === pendingType)?.label}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Furniture Drawer ── */}
        {drawerOpen && (
          <FurnitureDrawer
            ownedItems={ownedItems}
            onPickItem={handlePickItem}
            roomGold={gold}
            onExpand={handleExpand}
          />
        )}
      </div>
    </>
  );
}
