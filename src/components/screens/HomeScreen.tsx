import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { buildAvatarUrl, ZH, EN } from '../../data/constants';

// ══════════════════════════════════════════════════════════════
// ISOMETRIC PROJECTION ENGINE
// ══════════════════════════════════════════════════════════════
const TW  = 64;   // tile width (px)
const TH  = 32;   // tile height = TW/2
const ZPX = 56;   // px per z-unit (wall height)
const OX  = 440;  // screen origin X (back corner of room)
const OY  = 200;  // screen origin Y
const ROOM_W = 8; // tiles wide  (x-axis)
const ROOM_D = 5; // tiles deep  (y-axis)
const ROOM_H = 3; // z-units tall

// 3D → 2D isometric projection
function iso(x: number, y: number, z = 0): [number, number] {
  return [
    OX + (x - y) * TW / 2,
    OY + (x + y) * TH / 2 - z * ZPX,
  ];
}

// Convert array of 3D points → SVG polygon "x,y x,y" string
function p(...pts: [number, number, number][]): string {
  return pts.map(([x, y, z]) => iso(x, y, z).join(',')).join(' ');
}

// Screen → grid inverse (at z=0 ground plane)
function screenToGrid(
  sx: number, sy: number,
  rect: DOMRect,
  svgW: number, svgH: number,
): [number, number] {
  const scx = ((sx - rect.left) / rect.width)  * svgW;
  const scy = ((sy - rect.top)  / rect.height) * svgH;
  const dx  = scx - OX;
  const dy  = scy - OY;
  const gx  = dx / TW + dy / TH;
  const gy  = dy / TH - dx / TW;
  return [gx, gy];
}

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
  gx: number;
  gy: number;
  gz?: number;
  rotation: 0 | 90 | 180 | 270;
}

interface OwnedItem {
  type: FurnitureType;
  label: string;
}

// ══════════════════════════════════════════════════════════════
// ISOMETRIC BOX PRIMITIVE  (3 visible faces: top / left / right)
// ══════════════════════════════════════════════════════════════
interface IsoBoxProps {
  x: number; y: number; z?: number;
  w: number; d: number; h: number;
  top:   string;   // lightest (receives light from above)
  left:  string;   // medium   (left/front face, y=y+d side)
  right: string;   // darkest  (right/front face, x=x+w side)
  stroke?: string;
  sw?: number;
  opacity?: number;
}
function IsoBox({ x, y, z = 0, w, d, h, top, left, right, stroke = '#1a1a1a', sw = 1, opacity = 1 }: IsoBoxProps) {
  return (
    <g opacity={opacity}>
      {/* Right face (x+w) — darkest */}
      <polygon stroke={stroke} strokeWidth={sw} fill={right}
        points={p([x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h])}/>
      {/* Left/front face (y+d) — medium */}
      <polygon stroke={stroke} strokeWidth={sw} fill={left}
        points={p([x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h])}/>
      {/* Top face — lightest */}
      <polygon stroke={stroke} strokeWidth={sw} fill={top}
        points={p([x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h])}/>
    </g>
  );
}

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
// WALL CLOCK  (placed on back wall at grid coords wx, wy=0, wz)
// ══════════════════════════════════════════════════════════════
function WallClock({ wx, wz, offset, label, r = 18 }: {
  wx: number; wz: number; offset: number; label: string; r?: number;
}) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const [cx, cy] = iso(wx, 0, wz);

  const arm = (deg: number, len: number, sw: number, col: string) => {
    const rad = deg * Math.PI / 180;
    return (
      <line x1={cx} y1={cy}
        x2={cx + Math.cos(rad) * len}
        y2={cy + Math.sin(rad) * len}
        stroke={col} strokeWidth={sw} strokeLinecap="round"/>
    );
  };

  return (
    <g>
      <circle cx={cx + 2} cy={cy + 2} r={r + 3} fill="rgba(0,0,0,0.20)"/>
      <circle cx={cx} cy={cy} r={r + 3} fill="#3A2408" stroke="#1a1a1a" strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={r}     fill="#FDF8EE"/>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const isQ = i % 3 === 0;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * (r - (isQ ? 5 : 3))}
            y1={cy + Math.sin(a) * (r - (isQ ? 5 : 3))}
            x2={cx + Math.cos(a) * (r - 0.5)}
            y2={cy + Math.sin(a) * (r - 0.5)}
            stroke="#2C1A08" strokeWidth={isQ ? 2 : 0.8}/>
        );
      })}
      {arm(hDeg, r * 0.52, 2.5, '#1a1a1a')}
      {arm(mDeg, r * 0.74, 1.8, '#1a1a1a')}
      {arm(sDeg, r * 0.80, 1.0, '#C0392B')}
      <circle cx={cx} cy={cy} r={2} fill="#1a1a1a"/>
      <text x={cx} y={cy + r + 12} textAnchor="middle" fontSize={7} fontWeight="700"
        fill="#5C3C18" fontFamily="'Noto Sans TC',sans-serif">{label}</text>
    </g>
  );
}

// ══════════════════════════════════════════════════════════════
// SKY / WEATHER
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
  if      (hour < 5 || hour >= 22)      sky = ['#020212', '#0A0E2C', '#141C44'];
  else if (hour < 7)                     sky = ['#6B1A2A', '#D4603A', '#F4C060'];
  else if (hour >= 19 && hour < 22)      sky = ['#7A1E3A', '#D04428', '#F09030'];
  else if (hour >= 16)                   sky = ['#2A5A8C', '#5A9AC0', '#A0C8E0'];
  else if (arrived)                      sky = ['#3A6A8C', '#6AAEC8', '#A8D4E8'];
  else                                   sky = ['#1A5A90', '#3A9AC8', '#80CAE8'];
  return { sky, weather };
}

// ══════════════════════════════════════════════════════════════
// ISOMETRIC FURNITURE COMPONENTS
// Each takes (gx, gy) in grid coords and renders isometric boxes
// ══════════════════════════════════════════════════════════════
type FurnitureProps = { gx: number; gy: number; gz?: number };

const Furniture: Record<FurnitureType, React.FC<FurnitureProps>> = {

  rug: ({ gx, gy }) => {
    const [cx, cy] = iso(gx + 1.5, gy + 1, 0.01);
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={90} ry={30} fill="#A06838" opacity={0.30}/>
        <ellipse cx={cx} cy={cy} rx={74} ry={22} fill="none"
          stroke="#C09050" strokeWidth={1.2} strokeDasharray="6,4" opacity={0.45}/>
        <ellipse cx={cx} cy={cy} rx={58} ry={15} fill="none"
          stroke="#D4A860" strokeWidth={0.7} strokeDasharray="4,4" opacity={0.3}/>
      </g>
    );
  },

  sofa: ({ gx, gy }) => (
    <g>
      {/* Seat */}
      <IsoBox x={gx} y={gy} z={0} w={3} d={0.9} h={0.45}
        top="#D4985C" left="#B07840" right="#9A6830"/>
      {/* Back rest */}
      <IsoBox x={gx} y={gy + 0.55} z={0.45} w={3} d={0.35} h={0.65}
        top="#A06030" left="#8A4C20" right="#7A3C10"/>
      {/* Cushion lines on seat top */}
      {(() => {
        const [ax, ay] = iso(gx + 1.5, gy, 0.45);
        const [bx, by] = iso(gx + 1.5, gy + 0.9, 0.45);
        return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#9A6830" strokeWidth={1.5}/>;
      })()}
      {/* Left armrest */}
      <IsoBox x={gx - 0.2} y={gy - 0.05} z={0} w={0.2} d={1.0} h={0.85}
        top="#7A5030" left="#5A3818" right="#4A2808"/>
      {/* Right armrest */}
      <IsoBox x={gx + 3.0} y={gy - 0.05} z={0} w={0.2} d={1.0} h={0.85}
        top="#7A5030" left="#5A3818" right="#4A2808"/>
      {/* Legs */}
      <IsoBox x={gx}       y={gy}       z={0} w={0.15} d={0.12} h={0.1}
        top="#3A1A08" left="#2A1008" right="#1A0808"/>
      <IsoBox x={gx + 2.7} y={gy}       z={0} w={0.15} d={0.12} h={0.1}
        top="#3A1A08" left="#2A1008" right="#1A0808"/>
    </g>
  ),

  bed: ({ gx, gy }) => (
    <g>
      {/* Frame */}
      <IsoBox x={gx} y={gy} z={0} w={2.5} d={2} h={0.28}
        top="#5A3C1A" left="#3A2408" right="#2A1808"/>
      {/* Mattress */}
      <IsoBox x={gx} y={gy} z={0.28} w={2.5} d={2} h={0.22}
        top="#E8DCC8" left="#C8B8A0" right="#B8A890"/>
      {/* Pillows */}
      <IsoBox x={gx + 0.08} y={gy + 1.45} z={0.5} w={1.0} d={0.45} h={0.14}
        top="#FDFAF4" left="#D8D0C0" right="#C8C0B0"/>
      <IsoBox x={gx + 1.3}  y={gy + 1.45} z={0.5} w={1.0} d={0.45} h={0.14}
        top="#FDFAF4" left="#D8D0C0" right="#C8C0B0"/>
      {/* Blanket */}
      <IsoBox x={gx} y={gy} z={0.5} w={2.5} d={1.35} h={0.12}
        top="#6A8AC0" left="#4A6AA0" right="#3A5A90"/>
      {/* Fold on blanket top */}
      {(() => {
        const [ax, ay] = iso(gx, gy + 1.35, 0.62);
        const [bx, by] = iso(gx + 2.5, gy + 1.35, 0.62);
        return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#3A5A90" strokeWidth={1.2}/>;
      })()}
      {/* Headboard */}
      <IsoBox x={gx} y={gy + 1.8} z={0} w={2.5} d={0.2} h={1.1}
        top="#7A5230" left="#5A3818" right="#4A2808"/>
      {/* Panel details on headboard (left face) */}
      {(() => {
        const [ax, ay] = iso(gx + 0.8, gy + 2, 0.2);
        const [bx, by] = iso(gx + 0.8, gy + 2, 0.9);
        const [cx, cy] = iso(gx + 1.7, gy + 2, 0.9);
        const [dx, dy] = iso(gx + 1.7, gy + 2, 0.2);
        return (
          <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
            fill="#6A4828" stroke="#5A3818" strokeWidth={0.8}/>
        );
      })()}
    </g>
  ),

  desk: ({ gx, gy }) => (
    <g>
      {/* Legs */}
      <IsoBox x={gx + 0.1} y={gy + 0.1} z={0} w={0.12} d={0.12} h={0.45}
        top="#5A3C18" left="#3A2408" right="#2A1808"/>
      <IsoBox x={gx + 1.8} y={gy + 0.1} z={0} w={0.12} d={0.12} h={0.45}
        top="#5A3C18" left="#3A2408" right="#2A1808"/>
      <IsoBox x={gx + 0.1} y={gy + 0.8} z={0} w={0.12} d={0.12} h={0.45}
        top="#5A3C18" left="#3A2408" right="#2A1808"/>
      <IsoBox x={gx + 1.8} y={gy + 0.8} z={0} w={0.12} d={0.12} h={0.45}
        top="#5A3C18" left="#3A2408" right="#2A1808"/>
      {/* Tabletop */}
      <IsoBox x={gx} y={gy} z={0.45} w={2} d={1} h={0.1}
        top="#B08848" left="#8A6830" right="#7A5820"/>
      {/* Monitor stand */}
      <IsoBox x={gx + 0.7} y={gy + 0.55} z={0.55} w={0.2} d={0.1} h={0.4}
        top="#3A3A3A" left="#2A2A2A" right="#1A1A1A"/>
      {/* Monitor */}
      <IsoBox x={gx + 0.3} y={gy + 0.6} z={0.95} w={1.0} d={0.08} h={0.62}
        top="#2C2C2C" left="#3A3A3A" right="#1A1A1A"/>
      {/* Screen glow */}
      {(() => {
        const [ax, ay] = iso(gx + 0.35, gy + 0.68, 1.52);
        const [bx, by] = iso(gx + 1.25, gy + 0.68, 1.52);
        const [cx, cy] = iso(gx + 1.25, gy + 0.68, 1.0);
        const [dx, dy] = iso(gx + 0.35, gy + 0.68, 1.0);
        return (
          <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
            fill="#5DADE2" opacity={0.6}/>
        );
      })()}
      {/* Keyboard */}
      <IsoBox x={gx + 0.3} y={gy + 0.1} z={0.55} w={1.0} d={0.4} h={0.04}
        top="#C8C8C8" left="#A8A8A8" right="#888888"/>
      {/* Mouse */}
      <IsoBox x={gx + 1.55} y={gy + 0.2} z={0.55} w={0.25} d={0.2} h={0.06}
        top="#B0B0B0" left="#909090" right="#707070"/>
    </g>
  ),

  wardrobe: ({ gx, gy }) => (
    <g>
      {/* Main body */}
      <IsoBox x={gx} y={gy} z={0} w={1.5} d={0.8} h={2.0}
        top="#7A5838" left="#6A4C30" right="#4A3018"/>
      {/* Door frame line (left face) */}
      {(() => {
        const [ax, ay] = iso(gx, gy + 0.8, 0.12);
        const [bx, by] = iso(gx + 0.75, gy + 0.8, 0.12);
        const [cx, cy] = iso(gx + 0.75, gy + 0.8, 1.85);
        const [dx, dy] = iso(gx, gy + 0.8, 1.85);
        const [ex, ey] = iso(gx + 1.5, gy + 0.8, 0.12);
        const [fx, fy] = iso(gx + 1.5, gy + 0.8, 1.85);
        return (
          <>
            <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
              fill="#5A3C20" stroke="#4A3010" strokeWidth={0.8}/>
            <polygon points={`${bx},${by} ${ex},${ey} ${fx},${fy} ${cx},${cy}`}
              fill="#5A3C20" stroke="#4A3010" strokeWidth={0.8}/>
          </>
        );
      })()}
      {/* Left handle */}
      {(() => {
        const [hx, hy] = iso(gx + 0.65, gy + 0.8, 1.0);
        return <circle cx={hx} cy={hy} r={3.5} fill="#C0A060" stroke="#A08040" strokeWidth={1}/>;
      })()}
      {/* Right handle */}
      {(() => {
        const [hx, hy] = iso(gx + 0.85, gy + 0.8, 1.0);
        return <circle cx={hx} cy={hy} r={3.5} fill="#C0A060" stroke="#A08040" strokeWidth={1}/>;
      })()}
    </g>
  ),

  bookshelf: ({ gx, gy }) => (
    <g>
      {/* Back panel + sides */}
      <IsoBox x={gx} y={gy} z={0} w={1.2} d={0.7} h={1.8}
        top="#9A7440" left="#7A5C30" right="#5A3C18"/>
      {/* Shelf 1 */}
      <IsoBox x={gx} y={gy} z={0.6} w={1.2} d={0.65} h={0.06}
        top="#7A5428" left="#5A3C18" right="#4A2C10"/>
      {/* Shelf 2 */}
      <IsoBox x={gx} y={gy} z={1.2} w={1.2} d={0.65} h={0.06}
        top="#7A5428" left="#5A3C18" right="#4A2C10"/>
      {/* Books row 1 */}
      {[
        { dx: 0.05, c: '#C0392B', w: 0.18 },
        { dx: 0.25, c: '#2E86C1', w: 0.22 },
        { dx: 0.5,  c: '#F39C12', w: 0.16 },
        { dx: 0.7,  c: '#27AE60', w: 0.2  },
        { dx: 0.95, c: '#8E44AD', w: 0.15 },
      ].map((b, i) => (
        <IsoBox key={i} x={gx + b.dx} y={gy + 0.05} z={0.05} w={b.w} d={0.55} h={0.5}
          top={b.c} left={b.c} right={b.c} sw={0.5}/>
      ))}
      {/* Books row 2 */}
      {[
        { dx: 0.05, c: '#E74C3C', w: 0.20 },
        { dx: 0.3,  c: '#1A5276', w: 0.18 },
        { dx: 0.52, c: '#D4AC0D', w: 0.22 },
        { dx: 0.78, c: '#117A65', w: 0.15 },
      ].map((b, i) => (
        <IsoBox key={i} x={gx + b.dx} y={gy + 0.05} z={0.65} w={b.w} d={0.55} h={0.5}
          top={b.c} left={b.c} right={b.c} sw={0.5}/>
      ))}
    </g>
  ),

  island: ({ gx, gy }) => (
    <g>
      {/* Cabinet body */}
      <IsoBox x={gx} y={gy} z={0} w={2.5} d={1} h={0.65}
        top="#7A6040" left="#5A4228" right="#4A3018"/>
      {/* Door details on left face */}
      {(() => {
        const [ax, ay] = iso(gx + 0.55, gy + 1, 0.1);
        const [bx, by] = iso(gx + 1.15, gy + 1, 0.1);
        const [cx, cy] = iso(gx + 1.15, gy + 1, 0.55);
        const [dx, dy] = iso(gx + 0.55, gy + 1, 0.55);
        return (
          <>
            <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
              fill="#4A3018" stroke="#3A2010" strokeWidth={0.8}/>
            {(() => {
              const [hx, hy] = iso(gx + 1.0, gy + 1, 0.32);
              return <circle cx={hx} cy={hy} r={3} fill="#C0A060" stroke="#A08040" strokeWidth={0.8}/>;
            })()}
          </>
        );
      })()}
      {/* Marble counter top */}
      <IsoBox x={gx - 0.05} y={gy - 0.05} z={0.65} w={2.6} d={1.1} h={0.08}
        top="#E8DCC8" left="#C8B8A0" right="#B0A090"/>
      {/* Marble veins */}
      {(() => {
        const [ax, ay] = iso(gx + 0.3, gy + 0.1, 0.73);
        const [bx, by] = iso(gx + 1.2, gy + 0.8, 0.73);
        return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#D0C4B0" strokeWidth={1} opacity={0.6}/>;
      })()}
    </g>
  ),

  microwave: ({ gx, gy, gz = 0 }) => (
    <g>
      <IsoBox x={gx} y={gy} z={gz} w={0.9} d={0.65} h={0.5}
        top="#4C4C4C" left="#2A2A2A" right="#1A1A1A"/>
      {/* Door window (left face) */}
      {(() => {
        const [ax, ay] = iso(gx + 0.05, gy + 0.65, gz + 0.07);
        const [bx, by] = iso(gx + 0.55, gy + 0.65, gz + 0.07);
        const [cx, cy] = iso(gx + 0.55, gy + 0.65, gz + 0.42);
        const [dx, dy] = iso(gx + 0.05, gy + 0.65, gz + 0.42);
        return (
          <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
            fill="#0A1A2A"/>
        );
      })()}
      {/* Display */}
      {(() => {
        const [sx, sy] = iso(gx + 0.64, gy + 0.65, gz + 0.18);
        return (
          <text x={sx} y={sy} fontSize={5} fill="#00FF88"
            textAnchor="middle">12:00</text>
        );
      })()}
    </g>
  ),

  oven: ({ gx, gy }) => (
    <g>
      {/* Body */}
      <IsoBox x={gx} y={gy} z={0} w={1.0} d={0.85} h={0.9}
        top="#2C2C2C" left="#1A1A1A" right="#0A0A0A"/>
      {/* Door window */}
      {(() => {
        const [ax, ay] = iso(gx + 0.08, gy + 0.85, 0.12);
        const [bx, by] = iso(gx + 0.92, gy + 0.85, 0.12);
        const [cx, cy] = iso(gx + 0.92, gy + 0.85, 0.72);
        const [dx, dy] = iso(gx + 0.08, gy + 0.85, 0.72);
        return (
          <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
            fill="#0A1A0A" stroke="#2a2a2a" strokeWidth={0.5}/>
        );
      })()}
      {/* Stovetop */}
      <IsoBox x={gx} y={gy} z={0.9} w={1.0} d={0.85} h={0.06}
        top="#3A3A3A" left="#2A2A2A" right="#1A1A1A"/>
      {/* Burner rings */}
      {[
        { bx: gx + 0.28, by: gy + 0.26 },
        { bx: gx + 0.72, by: gy + 0.26 },
        { bx: gx + 0.28, by: gy + 0.64 },
        { bx: gx + 0.72, by: gy + 0.64 },
      ].map((b, i) => {
        const [cx, cy] = iso(b.bx, b.by, 0.96);
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={12} ry={5} fill="none" stroke="#555" strokeWidth={1.5}/>
            <ellipse cx={cx} cy={cy} rx={6}  ry={2.5} fill="#1a1a1a" stroke="#333" strokeWidth={1}/>
          </g>
        );
      })}
    </g>
  ),

  sink: ({ gx, gy }) => (
    <g>
      {/* Cabinet */}
      <IsoBox x={gx} y={gy} z={0} w={0.9} d={0.75} h={0.6}
        top="#6A5038" left="#4A3018" right="#3A2008"/>
      {/* Counter */}
      <IsoBox x={gx - 0.05} y={gy - 0.05} z={0.6} w={1.0} d={0.85} h={0.07}
        top="#D8E4E8" left="#B8C8D0" right="#A0B4BC"/>
      {/* Basin */}
      {(() => {
        const [cx, cy] = iso(gx + 0.45, gy + 0.42, 0.67);
        return (
          <>
            <ellipse cx={cx} cy={cy} rx={22} ry={9} fill="#A8C0D0" stroke="#88A0B0" strokeWidth={1}/>
            <ellipse cx={cx} cy={cy} rx={14} ry={5.5} fill="#88A8C0"/>
          </>
        );
      })()}
      {/* Faucet */}
      <IsoBox x={gx + 0.35} y={gy + 0.55} z={0.67} w={0.08} d={0.06} h={0.28}
        top="#C0C8D0" left="#A8B8C0" right="#9098A0"/>
    </g>
  ),

  guitar: ({ gx, gy }) => {
    // Leaning against wall — rendered as 2D sprite using iso projection
    const [bx, by] = iso(gx, gy, 0);
    return (
      <g transform={`translate(${bx}, ${by})`}>
        {/* Neck */}
        <rect x={-3} y={-95} width={7} height={105} rx={2} fill="#8B5C2A" stroke="#5A3C18" strokeWidth={0.8}/>
        <rect x={-5} y={-105} width={12} height={13} rx={2} fill="#6B4418" stroke="#3A2408" strokeWidth={0.8}/>
        {[-101,-96,-91].map((py, i) => [
          <circle key={`l${i}`} cx={-6} cy={py} r={2.5} fill="#D4B060" stroke="#B09040" strokeWidth={0.6}/>,
          <circle key={`r${i}`} cx={8}  cy={py} r={2.5} fill="#D4B060" stroke="#B09040" strokeWidth={0.6}/>,
        ])}
        {/* Upper body */}
        <path d="M -3,2 Q -20,-4 -18,14 Q -20,22 -10,26 Q 2,32 14,26 Q 24,20 24,12 Q 26,2 16,2 Z"
          fill="#C4803C" stroke="#8B5020" strokeWidth={1.2}/>
        {/* Lower body */}
        <path d="M -10,26 Q -24,28 -24,44 Q -24,64 -8,68 Q 6,72 20,64 Q 34,56 30,42 Q 30,26 14,26 Z"
          fill="#C4803C" stroke="#8B5020" strokeWidth={1.2}/>
        <circle cx={10} cy={46} r={9} fill="#3A1000" stroke="#2A0C00" strokeWidth={0.8}/>
        {[7,10,13,16,19,22].map((sx, i) => (
          <line key={i} x1={sx} y1={-95} x2={sx} y2={66} stroke="#D4C090" strokeWidth={0.45}/>
        ))}
      </g>
    );
  },

  backpack: ({ gx, gy }) => (
    <g>
      <IsoBox x={gx} y={gy} z={0} w={0.7} d={0.6} h={0.85}
        top="#5A6B3C" left="#3A4C24" right="#2A3C14"/>
      {/* Front pocket */}
      <IsoBox x={gx} y={gy} z={0.1} w={0.7} d={0.58} h={0.3}
        top="#4A5C2C" left="#3A4C1C" right="#2A3C0C" sw={0.6}/>
      {/* Ireland patch on top */}
      {(() => {
        const [ax, ay] = iso(gx + 0.35, gy + 0.08, 0.85);
        return (
          <g>
            <rect x={ax - 12} y={ay - 5} width={24} height={10} fill="#169B62"/>
            <rect x={ax - 4}  y={ay - 5} width={8}  height={10} fill="#fff"/>
            <rect x={ax + 4}  y={ay - 5} width={8}  height={10} fill="#FF883E"/>
            <rect x={ax - 12} y={ay - 5} width={24} height={10} fill="none" stroke="#1a1a1a" strokeWidth="0.5"/>
          </g>
        );
      })()}
    </g>
  ),

  plant: ({ gx, gy }) => (
    <g>
      {/* Pot */}
      <IsoBox x={gx} y={gy} z={0} w={0.55} d={0.55} h={0.42}
        top="#C44A2A" left="#A33020" right="#8A2010"/>
      {/* Soil */}
      {(() => {
        const [cx, cy] = iso(gx + 0.275, gy + 0.275, 0.42);
        return <ellipse cx={cx} cy={cy} rx={14} ry={6} fill="#3A2410" opacity={0.9}/>;
      })()}
      {/* Stems */}
      {[
        { ex: gx + 0.15, ey: gy + 0.15, ez: 1.1 },
        { ex: gx + 0.4,  ey: gy + 0.1,  ez: 1.2 },
        { ex: gx + 0.1,  ey: gy + 0.4,  ez: 1.0 },
      ].map((s, i) => {
        const [sx, sy] = iso(gx + 0.275, gy + 0.275, 0.42);
        const [ex, ey] = iso(s.ex, s.ey, s.ez);
        return <line key={i} x1={sx} y1={sy} x2={ex} y2={ey}
          stroke="#3A8020" strokeWidth={2} strokeLinecap="round"/>;
      })}
      {/* Leaves */}
      {[
        { lx: gx + 0.1, ly: gy + 0.12, lz: 1.1 },
        { lx: gx + 0.42, ly: gy + 0.08, lz: 1.2 },
        { lx: gx + 0.08, ly: gy + 0.42, lz: 1.0 },
      ].map((l, i) => {
        const [cx, cy] = iso(l.lx, l.ly, l.lz);
        return (
          <ellipse key={i} cx={cx} cy={cy}
            rx={12} ry={6}
            fill={i % 2 === 0 ? '#4AA830' : '#5AC040'}
            stroke="#2A8010" strokeWidth={0.8}
            transform={`rotate(${[-20, 15, -35][i]}, ${cx}, ${cy})`}/>
        );
      })}
    </g>
  ),
};

// ══════════════════════════════════════════════════════════════
// DEFAULT LAYOUT (grid coordinates)
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
  { id:'p_rug',       type:'rug',       gx:2.5,  gy:2.5,  rotation:0 },
  { id:'p_sofa',      type:'sofa',      gx:0.3,  gy:3.0,  rotation:0 },
  { id:'p_guitar',    type:'guitar',    gx:0.2,  gy:4.5,  rotation:0 },
  { id:'p_backpack',  type:'backpack',  gx:2.0,  gy:3.8,  rotation:0 },
  { id:'p_island',    type:'island',    gx:3.8,  gy:0.2,  rotation:0 },
  { id:'p_microwave', type:'microwave', gx:3.9,  gy:0.3,  gz:0.73, rotation:0 },
  { id:'p_desk',      type:'desk',      gx:5.8,  gy:0.2,  rotation:0 },
  { id:'p_bed',       type:'bed',       gx:5.4,  gy:2.0,  rotation:0 },
  { id:'p_wardrobe',  type:'wardrobe',  gx:6.8,  gy:3.8,  rotation:0 },
];

const DEFAULT_OWNED: OwnedItem[] = CATALOG.filter(c =>
  !DEFAULT_PLACED.some(p => p.type === c.type)
);

// ══════════════════════════════════════════════════════════════
// MAIN 2.5D ISOMETRIC ROOM SVG
// ══════════════════════════════════════════════════════════════
const SVG_W = 900, SVG_H = 450;

function RoomSVG({
  placedItems, editMode, selectedId, onItemClick,
  transitOffset, transitLabel,
}: {
  placedItems:   PlacedItem[];
  editMode:      boolean;
  selectedId:    string | null;
  onItemClick:   (id: string) => void;
  transitOffset: number;
  transitLabel:  string;
}) {
  const { derived } = useGame();
  const { sky, weather } = useSkyAndWeather(derived.hasArrived);

  // Sort furniture by isometric Z-order (render far items first)
  const sortedItems = useMemo(() =>
    [...placedItems].sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy)),
    [placedItems]
  );

  // Right wall (airport window) corner points
  const winPts = [
    iso(ROOM_W, 0, 0),
    iso(ROOM_W, ROOM_D, 0),
    iso(ROOM_W, ROOM_D, ROOM_H),
    iso(ROOM_W, 0, ROOM_H),
  ];
  const winPointsStr = winPts.map(([x, y]) => `${x},${y}`).join(' ');

  // Back wall corner points (y=0)
  const bwPts = [
    iso(0, 0, 0),
    iso(ROOM_W, 0, 0),
    iso(ROOM_W, 0, ROOM_H),
    iso(0, 0, ROOM_H),
  ];
  const bwPointsStr = bwPts.map(([x, y]) => `${x},${y}`).join(' ');

  // Left wall corner points (x=0)
  const lwPts = [
    iso(0, 0, 0),
    iso(0, ROOM_D, 0),
    iso(0, ROOM_D, ROOM_H),
    iso(0, 0, ROOM_H),
  ];
  const lwPointsStr = lwPts.map(([x, y]) => `${x},${y}`).join(' ');

  // Floor polygon (the whole room floor)
  const floorPts = [
    iso(0, 0, 0),
    iso(ROOM_W, 0, 0),
    iso(ROOM_W, ROOM_D, 0),
    iso(0, ROOM_D, 0),
  ];
  const floorStr = floorPts.map(([x, y]) => `${x},${y}`).join(' ');

  // Clip path for airport window interior
  const winClipId = 'isoWinClip';

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width:'100%', height:'100%', display:'block', userSelect:'none' }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={sky[0]}/>
          <stop offset="55%"  stopColor={sky[1]}/>
          <stop offset="100%" stopColor={sky[2]}/>
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5E8CC"/>
          <stop offset="100%" stopColor="#E2CE9E"/>
        </linearGradient>
        <clipPath id={winClipId}>
          <polygon points={winPointsStr}/>
        </clipPath>
      </defs>

      {/* ── BACK WALL ── warm cream */}
      <polygon points={bwPointsStr} fill="#F4EDE0" stroke="#1a1a1a" strokeWidth={1.5}/>
      {/* Wallpaper vertical stripes */}
      {Array.from({ length: ROOM_W }, (_, i) => {
        const [ax, ay] = iso(i, 0, 0);
        const [bx, by] = iso(i, 0, ROOM_H);
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
          stroke="#E8DCCa" strokeWidth={0.6} opacity={0.45}/>;
      })}
      {/* Baseboard on back wall */}
      <polygon fill="#C8B890" stroke="#B0A078" strokeWidth={0.7}
        points={p([0,0,0],[ROOM_W,0,0],[ROOM_W,0,0.16],[0,0,0.16])}/>

      {/* ── WALL CLOCKS ── */}
      <WallClock wx={1.5} wz={2.1} offset={8}             label="台灣 GMT+8"/>
      <WallClock wx={4.0} wz={2.1} offset={transitOffset} label={transitLabel}/>
      <WallClock wx={6.5} wz={2.1} offset={1}             label="愛爾蘭 GMT+1"/>

      {/* WHinIE watermark on back wall */}
      {(() => {
        const [tx, ty] = iso(ROOM_W / 2, 0, 1.0);
        return (
          <text x={tx} y={ty} textAnchor="middle" fontSize={48}
            fill="rgba(180,148,100,0.06)" fontStyle="italic" fontWeight="bold">
            WHinIE
          </text>
        );
      })()}

      {/* ── LEFT WALL ── slightly darker */}
      <polygon points={lwPointsStr} fill="#EAE0CC" stroke="#1a1a1a" strokeWidth={1.5}/>
      {/* Left wall baseboard */}
      <polygon fill="#C0B080" stroke="#A89868" strokeWidth={0.7}
        points={p([0,0,0],[0,ROOM_D,0],[0,ROOM_D,0.16],[0,0,0.16])}/>

      {/* ── AIRPORT WINDOW (right wall) ── sky gradient */}
      <polygon points={winPointsStr} fill="url(#skyG)"/>

      {/* Airport scene inside window */}
      <g clipPath={`url(#${winClipId})`}>
        {/* Clouds */}
        {weather !== 'rain' && (
          <>
            <ellipse cx={iso(ROOM_W, 1.0, 2.5)[0]} cy={iso(ROOM_W, 1.0, 2.5)[1]}
              rx={28} ry={11} fill="rgba(230,235,240,0.72)"/>
            <ellipse cx={iso(ROOM_W, 1.5, 2.7)[0]} cy={iso(ROOM_W, 1.5, 2.7)[1]}
              rx={20} ry={15} fill="rgba(230,235,240,0.72)"/>
            <ellipse cx={iso(ROOM_W, 3.5, 2.6)[0]} cy={iso(ROOM_W, 3.5, 2.6)[1]}
              rx={24} ry={10} fill="rgba(225,230,235,0.6)"/>
          </>
        )}
        {/* Rain streaks */}
        {weather === 'rain' && Array.from({ length: 12 }, (_, i) => {
          const ry = 0.3 + i * 0.35;
          const [ax, ay] = iso(ROOM_W, ry, 2.5);
          const [bx, by] = iso(ROOM_W, ry + 0.15, 2.0);
          return <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
            stroke="rgba(180,210,240,0.55)" strokeWidth={1} strokeLinecap="round"/>;
        })}
        {/* Horizon / ground */}
        <polygon fill="#1C1C1C" opacity={0.9}
          points={p([ROOM_W,0,0.5],[ROOM_W,ROOM_D,0.5],[ROOM_W,ROOM_D,0],[ROOM_W,0,0])}/>
        {/* Airport building silhouette */}
        <polygon fill="#1a1a2a" opacity={0.88}
          points={p([ROOM_W,0.5,0.5],[ROOM_W,2.5,0.5],[ROOM_W,2.5,1.2],[ROOM_W,0.5,1.2])}/>
        {/* Building windows */}
        {[0,1,2,3].map(row => [0,1,2].map(col => {
          const [wx, wy] = iso(ROOM_W, 0.7 + row * 0.45, 0.62 + col * 0.2);
          return <rect key={`${row}${col}`} x={wx - 4} y={wy - 3} width={8} height={6}
            fill="#FFE060" opacity={0.75}/>;
        }))}
        {/* Runway lights */}
        {[0.4, 1.2, 2.0, 2.8, 3.6].map((ry, i) => {
          const [rx, ry2] = iso(ROOM_W, ry, 0.52);
          return <circle key={i} cx={rx} cy={ry2} r={2.5} fill="#FFD700" opacity={0.9}/>;
        })}
        {/* Parked plane */}
        <polygon fill="#C8C8C8" stroke="#A8A8A8" strokeWidth={0.6}
          points={p([ROOM_W,1.2,0.7],[ROOM_W,3.2,0.7],[ROOM_W,3.2,0.82],[ROOM_W,1.2,0.82])}/>
        <polygon fill="#007A33"
          points={p([ROOM_W,1.1,0.7],[ROOM_W,1.4,0.7],[ROOM_W,1.4,0.76],[ROOM_W,1.1,0.76])}/>
      </g>
      {/* Minimal window frame: just outline + 1 horizontal divider */}
      <polygon points={winPointsStr} fill="none" stroke="#1a1a1a" strokeWidth={2.5}/>
      {(() => {
        const [ax, ay] = iso(ROOM_W, 0, 1.5);
        const [bx, by] = iso(ROOM_W, ROOM_D, 1.5);
        return <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#C8B890" strokeWidth={1.5} opacity={0.6}/>;
      })()}

      {/* ── FLOOR TILES ── */}
      {Array.from({ length: ROOM_D }, (_, gy) =>
        Array.from({ length: ROOM_W }, (_, gx) => {
          const even = (gx + gy) % 2 === 0;
          const [ax, ay] = iso(gx,   gy,   0);
          const [bx, by] = iso(gx+1, gy,   0);
          const [cx, cy] = iso(gx+1, gy+1, 0);
          const [dx, dy] = iso(gx,   gy+1, 0);
          return (
            <polygon key={`${gx}-${gy}`}
              points={`${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`}
              fill={even ? '#F0E4C8' : '#E4D4B0'}
              stroke="#D4C090" strokeWidth={0.5}/>
          );
        })
      )}

      {/* ── ROOM EDGES ── */}
      {/* Floor outline */}
      <polygon points={floorStr} fill="none" stroke="#1a1a1a" strokeWidth={2}/>
      {/* Vertical edges */}
      {(() => {
        const [ax, ay] = iso(0, 0, 0); const [bx, by] = iso(0, 0, ROOM_H);
        const [cx, cy] = iso(0, ROOM_D, 0); const [dx, dy] = iso(0, ROOM_D, ROOM_H);
        return (
          <>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1a1a1a" strokeWidth={2.5}/>
            <line x1={cx} y1={cy} x2={dx} y2={dy} stroke="#1a1a1a" strokeWidth={2.5}/>
          </>
        );
      })()}

      {/* ── FURNITURE in Z-order ── */}
      {sortedItems.map(item => {
        const Comp = Furniture[item.type];
        if (!Comp) return null;
        const isSelected = editMode && item.id === selectedId;

        // Compute rough screen bounding center for selection indicator
        const [sx, sy] = iso(item.gx + 0.5, item.gy + 0.5, 0.5);

        return (
          <g key={item.id}
            onClick={() => editMode && onItemClick(item.id)}
            style={{ cursor: editMode ? 'pointer' : 'default' }}>
            {isSelected && (
              <circle cx={sx} cy={sy} r={28}
                fill="none" stroke="#FFD700" strokeWidth={2.5}
                strokeDasharray="6,3"/>
            )}
            <Comp gx={item.gx} gy={item.gy} gz={item.gz}/>
          </g>
        );
      })}

      {/* Edit hint */}
      {editMode && (
        <text x={SVG_W / 2} y={SVG_H - 10} textAnchor="middle" fontSize={9}
          fill="rgba(0,0,0,0.35)" fontFamily="'Noto Sans TC',sans-serif">
          點擊畫面放置道具 · 點擊道具選取 · 儲存後退出
        </text>
      )}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// FURNITURE DRAWER  (Edit Mode)
// ══════════════════════════════════════════════════════════════
function FurnitureDrawer({
  ownedItems, onPickItem, gold, onExpand,
}: {
  ownedItems: OwnedItem[];
  onPickItem: (type: FurnitureType) => void;
  gold: number;
  onExpand: () => void;
}) {
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      background:'rgba(253,251,247,0.97)',
      border:'3px solid #000', borderBottom:'none',
      boxShadow:'0 -4px 0 #000',
      padding:'5px 10px 4px',
      zIndex: 30,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ fontSize:9, fontWeight:900, ...ZH, flexShrink:0 }}>🎒 道具抽屜</div>
        <div style={{ flex:1, display:'flex', gap:5, overflowX:'auto', paddingBottom:2 }}>
          {ownedItems.length === 0 && (
            <div style={{ fontSize:9, color:'#888', ...ZH, padding:'4px 8px' }}>
              所有道具已放置 ✓
            </div>
          )}
          {ownedItems.map(item => (
            <button key={item.type} onClick={() => onPickItem(item.type)} style={{
              flexShrink:0, width:54, height:48,
              border:'2px solid #000', boxShadow:'2px 2px 0 #000',
              background:'#FDFBF7', cursor:'pointer', padding:'2px 0 0',
              display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:1,
            }}>
              <span style={{ fontSize:16 }}>
                {({ sofa:'🛋️', bed:'🛏️', desk:'🖥️', wardrobe:'🚪', bookshelf:'📚',
                   island:'🏝️', microwave:'📦', oven:'♨️', sink:'🚰',
                   rug:'🪑', guitar:'🎸', backpack:'🎒', plant:'🌿' } as Record<string,string>)[item.type] ?? '📦'}
              </span>
              <div style={{ fontSize:7, fontWeight:700, ...ZH }}>{item.label}</div>
            </button>
          ))}
        </div>
        <button onClick={onExpand} style={{
          flexShrink:0, padding:'5px 10px',
          border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
          background:'#FFD700', cursor:'pointer',
          fontSize:10, fontWeight:900, ...ZH, whiteSpace:'nowrap',
        }}>
          🔨 擴建 ({gold}💰)
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

  let statusBg   = 'rgba(232,228,216,0.88)';
  let statusIcon = '🛰️';
  let statusL1   = '台灣整備中';
  let statusL2   = `基地充能第 ${Math.max(dayStatus.days, 1)} 天`;
  let tip        = '冒險不急著出發，先整備裝備吧！點擊可補輸入日期。';
  let glowing    = false;

  if (dayStatus.type === 'countdown') {
    statusBg='rgba(255,248,220,0.90)'; statusIcon='✈️';
    statusL1=`出發倒數 D-${dayStatus.days}`; statusL2=player.arrivalDate;
    tip='檢查你的背包，飛機即將起飛！';
  } else if (dayStatus.type === 'arrived') {
    statusBg='rgba(228,244,228,0.90)'; statusIcon='☘️';
    statusL1=`登陸愛爾蘭：Day ${dayStatus.days}`; statusL2=`${player.arrivalDate} 抵達`;
    tip='你已踏上翡翠島！雙幣記帳已解鎖。'; glowing=true;
  }

  return (
    <div style={{
      position:'absolute', top:'50%', left:'44%',
      transform:'translate(-50%,-50%)',
      display:'flex', flexDirection:'column', alignItems:'center', gap:6,
      pointerEvents:'none',
    }}>
      {/* Avatar + Name */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, pointerEvents:'auto' }}>
        <div style={{
          width:52, height:52,
          border:'3px solid #000', boxShadow:'3px 3px 0 #000',
          background:'#b6e3f4', overflow:'hidden', borderRadius:2,
        }}>
          <img src={avatarUrl} alt="" style={{ width:'100%', display:'block' }}/>
        </div>
        <div style={{
          background:'rgba(253,251,247,0.90)',
          border:'2.5px solid #000', boxShadow:'2px 2px 0 #000',
          padding:'1px 10px', fontSize:13, fontWeight:900, ...ZH,
        }}>
          {player.name || '旅行者'}
        </div>
      </div>

      {/* ⏰ Day counter */}
      <div style={{
        fontSize:22, fontWeight:900, color:'rgba(44,26,8,0.82)',
        fontFamily:"'Itim',cursive",
        textShadow:'2px 2px 0 rgba(255,255,255,0.7)',
      }}>
        ⏰ Day {Math.max(dayStatus.days, 1)}
      </div>

      {/* Status card */}
      <div
        style={{
          background:statusBg, border:'3px solid #000', boxShadow:'3px 3px 0 #000',
          padding:'5px 14px', textAlign:'center', position:'relative',
          animation:glowing ? 'hudPulse 2s ease-in-out infinite' : undefined,
          pointerEvents:'auto', cursor:'help',
        }}
        onMouseEnter={() => setTooltip(tip)}
        onMouseLeave={() => setTooltip(null)}
      >
        <div style={{ fontSize:12, fontWeight:900, ...ZH }}>{statusIcon} {statusL1}</div>
        <div style={{ fontSize:8, color:'#666', marginTop:1, ...ZH }}>{statusL2}</div>
        {tooltip && (
          <div style={{
            position:'absolute', bottom:'110%', left:'50%', transform:'translateX(-50%)',
            background:'#1a1a1a', color:'#fff', padding:'4px 10px',
            fontSize:9, ...ZH, whiteSpace:'nowrap',
            border:'1.5px solid #444', boxShadow:'2px 2px 0 #555', zIndex:100,
          }}>
            {tooltip}
          </div>
        )}
      </div>

      {/* 💰 Gold */}
      <div style={{
        fontSize:28, fontWeight:900, color:'rgba(180,120,0,0.82)',
        fontFamily:"'Itim',cursive",
        textShadow:'2px 2px 0 rgba(255,255,255,0.7),-1px -1px 0 rgba(0,0,0,0.15)',
      }}>
        💰 {totalXP}
      </div>

      {/* Flight tag */}
      {player.flightNumber && (
        <div style={{
          background:'rgba(0,0,0,0.78)', border:'2px solid #FFD700',
          padding:'2px 10px', fontSize:11, color:'#FFD700', fontWeight:700, ...EN,
          pointerEvents:'auto',
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

  const [editMode,    setEditMode]    = useState(false);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(DEFAULT_PLACED);
  const [ownedItems,  setOwnedItems]  = useState<OwnedItem[]>(DEFAULT_OWNED);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<FurnitureType | null>(null);
  const [gold]                        = useState(0);
  const [panOffset,   setPanOffset]   = useState({ x: 0, y: 0 });
  const panRef                        = useRef<{ x:number; y:number; ox:number; oy:number } | null>(null);
  const containerRef                  = useRef<HTMLDivElement>(null);

  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0, 7) : '中轉';

  const handlePickItem = useCallback((type: FurnitureType) => {
    setPendingType(type);
  }, []);

  const handleItemClick = useCallback((id: string) => {
    if (pendingType) return;
    setSelectedId(prev => prev === id ? null : id);
  }, [pendingType]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !pendingType) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const [gx, gy] = screenToGrid(e.clientX, e.clientY, rect, SVG_W, SVG_H);
    const cGx = Math.max(0, Math.min(ROOM_W - 1, gx));
    const cGy = Math.max(0, Math.min(ROOM_D - 1, gy));
    setPlacedItems(prev => [...prev, {
      id: `p_${pendingType}_${Date.now()}`,
      type: pendingType, gx: cGx, gy: cGy, rotation: 0,
    }]);
    setOwnedItems(prev => {
      const idx = prev.findIndex(o => o.type === pendingType);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
    setPendingType(null);
  }, [editMode, pendingType]);

  const returnSelected = useCallback(() => {
    if (!selectedId) return;
    const item = placedItems.find(p => p.id === selectedId);
    if (!item) return;
    setPlacedItems(prev => prev.filter(p => p.id !== selectedId));
    setOwnedItems(prev => {
      if (prev.some(o => o.type === item.type)) return prev;
      const cat = CATALOG.find(c => c.type === item.type);
      return cat ? [...prev, cat] : prev;
    });
    setSelectedId(null);
  }, [selectedId, placedItems]);

  const handleExpand = useCallback(() => {
    alert(`需要 50 💰 才能擴建！（目前：${gold}）`);
  }, [gold]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editMode) return;
    panRef.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
  }, [editMode, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panRef.current) return;
    setPanOffset({
      x: panRef.current.ox + e.clientX - panRef.current.x,
      y: panRef.current.oy + e.clientY - panRef.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => { panRef.current = null; }, []);

  return (
    <>
      <style>{`
        @keyframes hudPulse {
          0%,100% { box-shadow:3px 3px 0 #000; }
          50%      { box-shadow:3px 3px 0 #22c55e,0 0 16px rgba(34,197,94,0.45); }
        }
      `}</style>

      <div ref={containerRef}
        style={{
          width:'100%', height:'100%', position:'relative', overflow:'hidden',
          background:'#0A0A18',
          cursor: editMode ? (pendingType ? 'crosshair' : 'default') : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Scrollable / pannable canvas */}
        <div style={{
          width:'100%',
          height: editMode ? 'calc(100% - 64px)' : '100%',
          transform: `translate(${panOffset.x}px,${panOffset.y}px)`,
          position:'relative',
        }}>
          <RoomSVG
            placedItems={placedItems}
            editMode={editMode}
            selectedId={selectedId}
            onItemClick={handleItemClick}
            transitOffset={transitOffset}
            transitLabel={transitLabel}
          />
          {!editMode && <HUDOverlay />}
        </div>

        {/* Edit controls (top-right) */}
        <div style={{
          position:'absolute', top:8, right:8, zIndex:20,
          display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end',
        }}>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} style={{
              padding:'6px 12px', border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
              background:'#FDFBF7', cursor:'pointer', fontSize:10, fontWeight:900, ...ZH,
            }}>
              ✏️ 編輯小屋
            </button>
          ) : (
            <>
              <button onClick={() => { setEditMode(false); setSelectedId(null); setPendingType(null); }}
                style={{
                  padding:'6px 14px', border:'2.5px solid #000', boxShadow:'3px 3px 0 #22c55e',
                  background:'#22c55e', color:'#fff', cursor:'pointer',
                  fontSize:10, fontWeight:900, ...ZH,
                }}>
                ✓ 儲存佈置
              </button>
              {selectedId && (
                <button onClick={returnSelected} style={{
                  padding:'5px 10px', border:'2.5px solid #C0392B',
                  boxShadow:'2px 2px 0 #C0392B', background:'#FDFBF7',
                  cursor:'pointer', fontSize:9, fontWeight:900, ...ZH,
                }}>
                  ↩ 收回道具
                </button>
              )}
              {pendingType && (
                <div style={{
                  padding:'4px 10px', fontSize:9, fontWeight:900, ...ZH,
                  background:'#FFD700', border:'2px solid #000',
                }}>
                  點擊地板放置：{CATALOG.find(c => c.type === pendingType)?.label}
                </div>
              )}
            </>
          )}
        </div>

        {/* Furniture Drawer */}
        {editMode && (
          <FurnitureDrawer
            ownedItems={ownedItems}
            onPickItem={handlePickItem}
            gold={gold}
            onExpand={handleExpand}
          />
        )}
      </div>
    </>
  );
}
