import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { buildAvatarUrl, ZH, EN, TRANSIT_HUB_OPTIONS, AIRLINE_OPTIONS } from '../../data/constants';
import { AvatarCustomizer } from '../shared/AvatarCustomizer';
import type { Gender } from '../../types';

// ══════════════════════════════════════════════════════════════
// FURNITURE DATA STRUCTURE  (isSurface / Z-axis stacking)
// ══════════════════════════════════════════════════════════════
interface FurnitureItem {
  id: string; type: string;
  x: number; y: number;
  rotation?: number;
  isSurface?: boolean;
  stackedOn?: string;
  zOffset?: number;
}
const FURNITURE: FurnitureItem[] = [
  { id: 'rug',       type: 'rug',       x: 200, y: 288 },
  { id: 'sofa',      type: 'sofa',      x: 36,  y: 224, rotation: 90 },
  { id: 'guitar',    type: 'guitar',    x: 18,  y: 162, rotation: -15 },
  { id: 'backpack',  type: 'backpack',  x: 92,  y: 260 },
  { id: 'island',    type: 'island',    x: 340, y: 204, isSurface: true },
  { id: 'sink',      type: 'sink',      x: 448, y: 200 },
  { id: 'induction', type: 'induction', x: 376, y: 204 },
  { id: 'microwave', type: 'microwave', x: 352, y: 188, stackedOn: 'island', zOffset: -40 },
  { id: 'desk',      type: 'desk',      x: 268, y: 212 },
];

// ══════════════════════════════════════════════════════════════
// SVG FURNITURE COMPONENTS
// ══════════════════════════════════════════════════════════════
const F = {
  Rug: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={0} rx={145} ry={28} fill="#B07845" opacity={0.36} stroke="#8B5C30" strokeWidth={1.2}/>
      <ellipse cx={0} cy={0} rx={124} ry={20} fill="none" stroke="#C09050" strokeWidth={0.8} strokeDasharray="6,4" opacity={0.5}/>
    </g>
  ),

  Sofa: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`} style={{filter:'drop-shadow(4px 6px 0 rgba(0,0,0,0.18))'}}>
      <ellipse cx={90} cy={70} rx={96} ry={14} fill="#000" opacity={0.1}/>
      <polygon points="0,10 190,10 190,52 0,52"    fill="#A0724A" stroke="#7A5030" strokeWidth={1.5}/>
      <polygon points="0,52 190,52 202,82 -12,82"  fill="#C4925A" stroke="#A07040" strokeWidth={1.5}/>
      <polygon points="8,34 88,34 94,52 2,52"      fill="#D4A870" stroke="#B08850" strokeWidth={1}/>
      <polygon points="100,34 180,34 186,52 94,52" fill="#D4A870" stroke="#B08850" strokeWidth={1}/>
      <polygon points="-10,8 14,8 14,82 -20,82"   fill="#8B6038" stroke="#6A4020" strokeWidth={1.2}/>
      <polygon points="178,8 202,8 212,82 186,82"  fill="#8B6038" stroke="#6A4020" strokeWidth={1.2}/>
      <rect x={0}   y={82} width={8}  height={12} fill="#5A3C18"/>
      <rect x={182} y={82} width={8}  height={12} fill="#5A3C18"/>
    </g>
  ),

  Guitar: ({ x, y, rotation }: { x:number; y:number; rotation:number }) => (
    <g transform={`translate(${x},${y}) rotate(${rotation})`} style={{filter:'drop-shadow(3px 5px 0 rgba(0,0,0,0.2))'}}>
      <rect x={12} y={-82} width={8} height={102} rx={3} fill="#8B5C2A" stroke="#5A3C18" strokeWidth={1}/>
      <rect x={9}  y={-90} width={14} height={12} rx={2} fill="#6B4418" stroke="#3A2408" strokeWidth={1}/>
      {[-88,-84,-80].map((py,i)=>[<circle key={`l${i}`} cx={7}  cy={py} r={2.5} fill="#C0A060"/>,
                                   <circle key={`r${i}`} cx={25} cy={py} r={2.5} fill="#C0A060"/>])}
      <ellipse cx={16} cy={30} rx={18} ry={22} fill="#C4803C" stroke="#8B5020" strokeWidth={1.5}/>
      <ellipse cx={16} cy={8}  rx={14} ry={16} fill="#C4803C" stroke="#8B5020" strokeWidth={1.5}/>
      <rect x={6} y={16} width={20} height={16} fill="#C4803C"/>
      <rect x={4} y={16} width={24} height={16} fill="none" stroke="#8B5020" strokeWidth={1.5}/>
      <circle cx={16} cy={22} r={6} fill="#5A3010" stroke="#3A1C00" strokeWidth={0.8}/>
      {[10,13,16,19,22].map((sx,i)=>(
        <line key={i} x1={sx} y1={-82} x2={sx} y2={44} stroke="#D4C090" strokeWidth={0.6}/>
      ))}
    </g>
  ),

  Backpack: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`} style={{filter:'drop-shadow(3px 4px 0 rgba(0,0,0,0.18))'}}>
      <ellipse cx={22} cy={58} rx={20} ry={5} fill="#000" opacity={0.12}/>
      <rect x={0} y={4}  width={44} height={52} rx={6} fill="#6B7C4A" stroke="#4A5830" strokeWidth={1.5}/>
      <rect x={2} y={0}  width={40} height={16} rx={4} fill="#7A8C58" stroke="#4A5830" strokeWidth={1}/>
      <rect x={6} y={30} width={32} height={22} rx={4} fill="#5A6B3C" stroke="#4A5830" strokeWidth={1}/>
      <line x1={8} y1={30} x2={36} y2={30} stroke="#C0A060" strokeWidth={1.5}/>
      <path d="M 14,0 Q 22,-8 30,0" stroke="#4A5830" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
      <rect x={8}  y={8} width={5} height={38} rx={2} fill="#4A5830" opacity={0.6}/>
      <rect x={31} y={8} width={5} height={38} rx={2} fill="#4A5830" opacity={0.6}/>
    </g>
  ),

  KitchenIsland: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`} style={{filter:'drop-shadow(4px 6px 0 rgba(0,0,0,0.15))'}}>
      <polygon points="5,5 168,5 188,62 25,62" fill="#000" opacity={0.12}/>
      <polygon points="0,28 162,28 180,60 18,60" fill="#8B7048" stroke="#6A5030" strokeWidth={1.5}/>
      <polygon points="-6,10 168,10 180,28 0,28" fill="#E8E0D0" stroke="#C0B8A8" strokeWidth={1.5}/>
      <path d="M 20,14 Q 50,18 80,12 Q 110,8 142,16" stroke="#C8C0B0" strokeWidth="0.8" fill="none" opacity="0.7"/>
      <line x1={0} y1={28} x2={162} y2={28} stroke="#A09080" strokeWidth={0.8} strokeDasharray="4,3"/>
      <rect x={4}   y={60} width={7} height={18} fill="#5A3C18"/>
      <rect x={164} y={60} width={7} height={18} fill="#5A3C18"/>
    </g>
  ),

  Sink: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={24} cy={18} rx={22} ry={10} fill="#D8E0E8" stroke="#A0B0C0" strokeWidth={1.2}/>
      <ellipse cx={24} cy={18} rx={16} ry={7}  fill="#B8C8D8" stroke="#90A8B8" strokeWidth={0.8}/>
      <circle  cx={24} cy={18} r={3}            fill="#8090A0"/>
      <rect    x={20}  y={4}   width={8} height={12} rx={2} fill="#C8C8C8" stroke="#909090" strokeWidth={1}/>
      <path d="M 24,4 Q 24,-4 32,-4" stroke="#B0B0B0" strokeWidth={4} fill="none" strokeLinecap="round"/>
      <circle cx={32} cy={-4} r={3} fill="#C0C0C0" stroke="#909090" strokeWidth={0.8}/>
    </g>
  ),

  Induction: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,8 64,8 74,26 10,26"  fill="#1C1C2C" stroke="#0A0A18" strokeWidth={1.2}/>
      <polygon points="-4,0 68,0 74,8 0,8"   fill="#2A2A3C" stroke="#18183A" strokeWidth={1}/>
      <ellipse cx={18} cy={4} rx={12} ry={5} fill="none" stroke="#E74C3C" strokeWidth={1.2} opacity={0.7}/>
      <ellipse cx={50} cy={4} rx={12} ry={5} fill="none" stroke="#E74C3C" strokeWidth={1.2} opacity={0.7}/>
      <ellipse cx={18} cy={4} rx={8}  ry={3} fill="#FF6B6B" opacity={0.15}/>
      <ellipse cx={50} cy={4} rx={8}  ry={3} fill="#FF6B6B" opacity={0.15}/>
      <rect x={28} y={2} width={14} height={4} rx={1} fill="#3A3A5C"/>
      {[0,1,2].map(i=><circle key={i} cx={31+i*4} cy={4} r={1} fill="#00D4FF" opacity={0.8}/>)}
    </g>
  ),

  Microwave: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`} style={{filter:'drop-shadow(3px 4px 0 rgba(0,0,0,0.2))'}}>
      <polygon points="4,4 74,4 82,28 12,28"  fill="#000"   opacity={0.14}/>
      <polygon points="0,16 70,16 78,28 8,28" fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1.2}/>
      <polygon points="-4,4 70,4 78,16 0,16"  fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={1.2}/>
      <polygon points="2,16 46,16 52,28 6,28"  fill="#2A2A2A" stroke="#1a1a1a" strokeWidth={0.8}/>
      <polygon points="6,17 40,17 46,26 10,26" fill="#0A1A2A" opacity={0.9}/>
      <polygon points="48,16 70,16 76,28 54,28" fill="#5A5A5A" stroke="#3a3a3a" strokeWidth={0.8}/>
      <polygon points="50,18 68,18 73,26 56,26" fill="#001010"/>
      <text x={58} y={24} fontSize={6} fill="#00FF88" fontFamily="monospace" textAnchor="middle">12:00</text>
      <line x1={46} y1={17} x2={52} y2={27} stroke="#888" strokeWidth={2.5} strokeLinecap="round"/>
    </g>
  ),

  Desk: ({ x, y }: { x:number; y:number }) => (
    <g transform={`translate(${x},${y})`} style={{filter:'drop-shadow(3px 5px 0 rgba(0,0,0,0.16))'}}>
      <rect x={4}   y={36} width={6} height={20} fill="#6B4423"/>
      <rect x={114} y={36} width={6} height={20} fill="#6B4423"/>
      <polygon points="4,4 132,4 140,36 12,36"   fill="#000" opacity={0.12}/>
      <polygon points="-2,-10 128,-10 136,4 4,4" fill="#A07848" stroke="#7A5830" strokeWidth={1.5}/>
      <polygon points="4,4 132,4 140,36 12,36"   fill="#8B6038" stroke="#6A4420" strokeWidth={1.5}/>
      <polygon points="10,-26 74,-26 78,-10 6,-10"  fill="#2C2C2C" stroke="#1a1a1a" strokeWidth={1}/>
      <polygon points="6,-10 78,-10 84,0 0,0"       fill="#3A3A3A" stroke="#1a1a1a" strokeWidth={1}/>
      <polygon points="12,-24 72,-24 76,-11 8,-11"  fill="#5DADE2" opacity={0.5}/>
      <ellipse cx={100} cy={-4} rx={8} ry={5} fill="#4A4A4A" stroke="#2a2a2a" strokeWidth={0.8}/>
    </g>
  ),
};

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
  return { hDeg: h*30-90, mDeg: m*6-90, sDeg: s*6-90 };
}

// ══════════════════════════════════════════════════════════════
// WATCH BOX HUD — bottom-right, compact Neo-Brutalism 3-zone
// ══════════════════════════════════════════════════════════════
function MiniClock({ offset, label, bg }: { offset:number; label:string; bg:string }) {
  const { hDeg, mDeg, sDeg } = useClockHands(offset);
  const r=18, cx=20, cy=20;
  const arm = (deg:number, len:number, sw:number, col:string) => {
    const rad = deg * Math.PI / 180;
    return <line x1={cx} y1={cy} x2={cx+Math.cos(rad)*len} y2={cy+Math.sin(rad)*len}
      stroke={col} strokeWidth={sw} strokeLinecap="round"/>;
  };
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:2,
      background: bg, border:'2px solid #000', boxShadow:'2px 2px 0 #000',
      padding:'4px 5px',
    }}>
      <svg width={40} height={40}>
        <circle cx={cx+1} cy={cy+1} r={r+2} fill="#000"/>
        <circle cx={cx} cy={cy} r={r+2} fill="#1a1a1a"/>
        <circle cx={cx} cy={cy} r={r}   fill="#FFFEF5"/>
        {Array.from({length:12},(_,i)=>{
          const a=(i*30-90)*Math.PI/180;
          return <line key={i}
            x1={cx+Math.cos(a)*(r-4)} y1={cy+Math.sin(a)*(r-4)}
            x2={cx+Math.cos(a)*(r-1)} y2={cy+Math.sin(a)*(r-1)}
            stroke="#1a1a1a" strokeWidth={i%3===0?2:0.8}/>;
        })}
        {arm(hDeg,r*.52,3,'#1a1a1a')}
        {arm(mDeg,r*.76,2,'#1a1a1a')}
        {arm(sDeg,r*.80,1,'#C0392B')}
        <circle cx={cx} cy={cy} r={2} fill="#1a1a1a"/>
      </svg>
      <div style={{fontSize:8,fontWeight:900,...ZH,textAlign:'center',lineHeight:1}}>{label}</div>
    </div>
  );
}

function WatchBoxHUD() {
  const { derived } = useGame();
  const transitOffset = derived.transitTz.offset ?? 8;
  const transitLabel  = derived.transitTz.name !== '中轉機場'
    ? derived.transitTz.name.slice(0,5) : '中轉';
  return (
    <div style={{
      position:'absolute', bottom:8, right:8,
      display:'flex', gap:3, alignItems:'flex-end',
      background:'rgba(253,251,247,0.92)',
      border:'3px solid #000', boxShadow:'4px 4px 0 #000',
      padding:'5px 6px',
    }}>
      <div style={{fontSize:9,fontWeight:900,writingMode:'vertical-rl',letterSpacing:'0.1em',...ZH,marginRight:2}}>
        時區
      </div>
      <MiniClock offset={8}             label="台灣"       bg="#FFE4E1"/>
      <MiniClock offset={transitOffset} label={transitLabel} bg="#EDE7F6"/>
      <MiniClock offset={1}             label="愛爾蘭"     bg="#E8F5E9"/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SKY GRADIENT
// ══════════════════════════════════════════════════════════════
function useSkyGrad(arrived: boolean): [string,string,string] {
  const [h, setH] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setH(new Date().getHours()), 60000);
    return () => clearInterval(id);
  }, []);
  if (h<5||h>=21) return ['#0A0A1E','#1B2344','#0A0A1E'];
  if (h<7)        return ['#FF6B6B','#FFA07A','#FFD700'];
  if (h>=18)      return ['#C0392B','#E67E22','#F39C12'];
  return arrived ? ['#5B8EC5','#87CEEB','#C8E8F8'] : ['#1A8FD1','#5CC8F8','#B0E0FF'];
}

// ══════════════════════════════════════════════════════════════
// 2.5D ROOM SVG  (NO wall clocks)
// ══════════════════════════════════════════════════════════════
function RoomSVG() {
  const { derived } = useGame();
  const [sky1,sky2,sky3] = useSkyGrad(derived.hasArrived);
  const W=480, H=340, ceilY=24, wallBotY=232, winX=384;   // 80/20 split

  const resolved = FURNITURE.map(item =>
    item.stackedOn
      ? { ...item, y: item.y + (item.zOffset ?? 0) }
      : item
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}}>
      <defs>
        <linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={sky1}/>
          <stop offset="55%" stopColor={sky2}/>
          <stop offset="100%" stopColor={sky3}/>
        </linearGradient>
        <linearGradient id="floorG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F3E5C8"/>
          <stop offset="100%" stopColor="#DFC898"/>
        </linearGradient>
        <pattern id="tile2" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill="url(#floorG2)"/>
          <rect width="36" height="36" fill="none" stroke="#CEB870" strokeWidth="0.5" opacity="0.5"/>
        </pattern>
        <clipPath id="wClip2">
          <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`}/>
        </clipPath>
      </defs>

      {/* Ceiling */}
      <rect x={0} y={0} width={winX} height={ceilY} fill="#D8CCBA"/>
      <line x1={0} y1={ceilY} x2={winX} y2={ceilY} stroke="#1a1a1a" strokeWidth={2}/>

      {/* Back wall */}
      <rect x={0} y={ceilY} width={winX} height={wallBotY-ceilY} fill="#F5EDE0"/>
      {Array.from({length:11},(_,i)=>(
        <line key={i} x1={i*38} y1={ceilY} x2={i*38} y2={wallBotY} stroke="#E5D8C4" strokeWidth="0.7"/>
      ))}
      {/* World map watermark on wall */}
      <text x={192} y={148} textAnchor="middle" fontSize={58} fill="rgba(180,150,100,0.08)"
        fontFamily="Georgia,serif" fontStyle="italic" fontWeight="bold">WHinIE</text>
      <rect x={0} y={wallBotY-12} width={winX} height={12} fill="#D8C8A8" stroke="#C4B490" strokeWidth="0.8"/>

      {/* Floor */}
      <polygon points={`0,${wallBotY} ${winX},${wallBotY} ${W},${H} 0,${H}`} fill="url(#tile2)"/>
      {[1,2,3,4,5,6].map(i=>(
        <line key={`fv${i}`} x1={i*64} y1={wallBotY} x2={i*64+(W-winX)*(i/6)} y2={H}
          stroke="#CEB870" strokeWidth="0.5" opacity="0.45"/>
      ))}
      {[0.3,0.6].map((t,i)=>(
        <line key={`fh${i}`} x1={0} y1={wallBotY+(H-wallBotY)*t}
          x2={winX+(W-winX)*t} y2={wallBotY+(H-wallBotY)*t}
          stroke="#CEB870" strokeWidth="0.5" opacity="0.45"/>
      ))}

      {/* Airport window (20% right) */}
      <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`} fill="url(#skyG2)"/>
      <g clipPath="url(#wClip2)" opacity="0.72">
        <ellipse cx={432} cy={38} rx={28} ry={10} fill="#fff"/>
        <ellipse cx={445} cy={32} rx={18} ry={14} fill="#fff"/>
        <ellipse cx={420} cy={42} rx={16} ry={8}  fill="#fff"/>
        <ellipse cx={468} cy={54} rx={22} ry={9}  fill="#fff" opacity="0.8"/>
      </g>
      <g clipPath="url(#wClip2)">
        <polygon points={`${winX},${wallBotY-14} ${W},${H*0.62} ${W},${H} ${winX},${wallBotY}`} fill="#3A3A3A"/>
        {[0,1,2].map(i=>(
          <rect key={i} x={396+i*28} y={272+i*8} width={16} height={3} fill="#FFD700" opacity={0.8}/>
        ))}
        {/* Aer Lingus plane (scaled) */}
        <g transform="translate(386,196)">
          <ellipse cx={40} cy={10} rx={46} ry={9} fill="#F0F0F0" stroke="#D8D8D8" strokeWidth={0.8}/>
          <polygon points="18,10 60,10 64,17 14,17" fill="#E8E8E8" stroke="#CCC" strokeWidth={0.6}/>
          <polygon points="3,3 12,10 16,10" fill="#007A33"/>
          {[0,1,2,3].map(i=>(
            <ellipse key={i} cx={20+i*10} cy={7} rx={3} ry={2.5} fill="#87CEEB" opacity={0.9}/>
          ))}
          <line x1={8} y1={12} x2={86} y2={12} stroke="#007A33" strokeWidth={2}/>
        </g>
      </g>
      {/* Window frame */}
      <polygon points={`${winX},${ceilY} ${W},0 ${W},${H} ${winX},${wallBotY}`}
        fill="none" stroke="#1a1a1a" strokeWidth={3}/>
      <g stroke="#1a1a1a" strokeWidth={2} opacity={0.55}>
        <line x1={418} y1={0} x2={418} y2={H}/>
        <line x1={452} y1={0} x2={452} y2={H}/>
        <line x1={winX} y1={(ceilY+wallBotY)/2} x2={W} y2={H/2}/>
      </g>

      {/* Furniture */}
      {resolved.map(item => {
        switch(item.type) {
          case 'rug':       return <F.Rug       key={item.id} x={item.x} y={item.y}/>;
          case 'sofa':      return <F.Sofa      key={item.id} x={item.x} y={item.y}/>;
          case 'guitar':    return <F.Guitar    key={item.id} x={item.x} y={item.y} rotation={item.rotation??0}/>;
          case 'backpack':  return <F.Backpack  key={item.id} x={item.x} y={item.y}/>;
          case 'island':    return <F.KitchenIsland key={item.id} x={item.x} y={item.y}/>;
          case 'sink':      return <F.Sink      key={item.id} x={item.x} y={item.y}/>;
          case 'induction': return <F.Induction key={item.id} x={item.x} y={item.y}/>;
          case 'microwave': return <F.Microwave key={item.id} x={item.x} y={item.y}/>;
          case 'desk':      return <F.Desk      key={item.id} x={item.x} y={item.y}/>;
          default: return null;
        }
      })}

      {/* Room outlines */}
      <line x1={0} y1={ceilY} x2={0} y2={H} stroke="#1a1a1a" strokeWidth={2.5}/>
      <line x1={0} y1={wallBotY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={2}/>
      <line x1={winX} y1={ceilY} x2={winX} y2={wallBotY} stroke="#1a1a1a" strokeWidth={2.5}/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// FLOATING STATUS HUD (top-left over diorama)
// ══════════════════════════════════════════════════════════════
function StatusHUD() {
  const { state, derived } = useGame();
  const { player } = state;
  const { dayStatus, totalXP } = derived;
  const avatarUrl = buildAvatarUrl(player.avatar);

  let statusBg='#E8E4D8', statusIcon='🛰️', line1='台灣整備中', line2=`基地充能第 ${Math.max(dayStatus.days,1)} 天`;
  if (dayStatus.type==='countdown') {
    statusBg='#FFF8DC'; statusIcon='✈️';
    line1=`出發倒數 D-${dayStatus.days} 天`; line2=player.arrivalDate;
  } else if (dayStatus.type==='arrived') {
    statusBg='#E4F4E4'; statusIcon='☘️';
    line1=`登陸愛爾蘭：Day ${dayStatus.days}`; line2=`${player.arrivalDate} 抵達`;
  }

  return (
    <div style={{position:'absolute',top:8,left:8,display:'flex',flexDirection:'column',gap:5,pointerEvents:'none'}}>
      {/* Name + avatar */}
      <div style={{
        display:'flex',alignItems:'center',gap:5,
        background:'rgba(253,251,247,0.92)',
        border:'2.5px solid #000',boxShadow:'3px 3px 0 #000',
        padding:'3px 8px 3px 3px',
      }}>
        <div style={{width:34,height:34,flexShrink:0,border:'2px solid #000',background:'#b6e3f4',overflow:'hidden'}}>
          <img src={avatarUrl} alt="" style={{width:'100%',display:'block'}}/>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:900,lineHeight:1.1,...ZH}}>{player.name||'旅行者'}</div>
          <div style={{fontSize:9,color:'#666',...ZH}}>
            {player.gender==='female'?'♀':player.gender==='male'?'♂':'—'} · LV.1
          </div>
        </div>
        <div style={{
          marginLeft:4,background:'rgba(0,0,0,0.88)',border:'2px solid #FFD700',
          padding:'2px 8px',display:'flex',alignItems:'center',gap:4,
        }}>
          <span style={{fontSize:9,color:'#FFD700',...ZH}}>XP</span>
          <span style={{fontSize:18,fontWeight:900,color:'#FFD700',fontFamily:"'Itim',cursive"}}>{totalXP}</span>
        </div>
      </div>

      {/* Day counter */}
      <div style={{
        background:statusBg,border:'2.5px solid #000',boxShadow:'3px 3px 0 #000',
        padding:'4px 10px',
        ...(dayStatus.type==='arrived' ? {animation:'pulse 2s ease-in-out infinite'} : {}),
      }}>
        <div style={{fontSize:11,fontWeight:900,...ZH}}>{statusIcon} {line1}</div>
        <div style={{fontSize:8,color:'#666',marginTop:1,...ZH}}>{line2}</div>
      </div>

      {/* Flight tag */}
      {player.flightNumber && (
        <div style={{
          background:'rgba(0,0,0,0.85)',border:'2px solid #FFD700',
          boxShadow:'3px 3px 0 rgba(0,0,0,0.5)',padding:'3px 8px',
        }}>
          <span style={{fontSize:10,color:'#FFD700',fontWeight:700,...EN}}>
            {player.flightNumber}{player.flightTime?` @ ${player.flightTime}`:''}
          </span>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LEFT PANEL — Smartphone-frame Setup Console
// ══════════════════════════════════════════════════════════════
function SetupConsole() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const inputSt: React.CSSProperties = {
    width:'100%', padding:'5px 8px',
    border:'2px solid #000', boxShadow:'2px 2px 0 #000',
    background:'#FDFBF7', fontSize:11, outline:'none', ...ZH,
  };
  const labelSt: React.CSSProperties = {
    fontSize:9, fontWeight:700, marginBottom:3, display:'block',
    letterSpacing:'0.06em', ...ZH,
  };

  return (
    <div style={{
      height:'100%', display:'flex', flexDirection:'column',
      background:'#1C1C1C',
      border:'3px solid #000', boxShadow:'inset 0 0 20px rgba(0,0,0,0.4)',
      borderRadius:16, overflow:'hidden', position:'relative',
    }}>
      {/* Phone notch */}
      <div style={{
        background:'#1C1C1C', height:28, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      }}>
        <div style={{width:48,height:6,background:'#333',borderRadius:3}}/>
        <div style={{width:8,height:8,background:'#333',borderRadius:'50%'}}/>
      </div>

      {/* Phone screen */}
      <div style={{
        flex:1, background:'#FDFBF7', overflow:'hidden',
        display:'flex', flexDirection:'column',
        margin:'0 3px',
      }}>
        {/* Screen header */}
        <div style={{
          background:'#000', color:'#FDFBF7',
          padding:'6px 10px', flexShrink:0,
          display:'flex', alignItems:'center', gap:6,
        }}>
          <span style={{fontSize:12}}>🛂</span>
          <div>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:'0.06em',...ZH}}>冒險者護照</div>
            <div style={{fontSize:7,color:'#aaa',...EN}}>CHARACTER SETUP</div>
          </div>
        </div>

        {/* Avatar */}
        <div style={{flexShrink:0, borderBottom:'2px solid #000', background:'#f0ece0'}}>
          <AvatarCustomizer />
        </div>

        {/* Form fields */}
        <div style={{flex:1, overflowY:'auto', padding:'8px 10px', display:'flex', flexDirection:'column', gap:7}}>

          <div>
            <label style={labelSt}>冒險者稱號</label>
            <input value={player.name}
              onChange={e=>dispatch({type:'SET_PLAYER_NAME',value:e.target.value})}
              placeholder="姓名..." style={inputSt}/>
          </div>

          <div>
            <label style={labelSt}>性別</label>
            <div style={{display:'flex',gap:5}}>
              {(['female','male'] as const).map(v=>(
                <button key={v}
                  onClick={()=>dispatch({type:'SET_GENDER',value:v as Gender})}
                  style={{
                    flex:1, padding:'5px 4px',
                    border:'2px solid #000',
                    boxShadow: player.gender===v ? 'inset 2px 2px 6px rgba(0,0,0,0.25)' : '2px 2px 0 #000',
                    background: player.gender===v ? (v==='female'?'#FF69B4':'#1E90FF') : '#FDFBF7',
                    color: player.gender===v ? '#fff' : '#000',
                    cursor:'pointer', fontSize:11, fontWeight:700,
                    transform: player.gender===v ? 'translate(2px,2px)' : 'none', ...ZH,
                  }}>
                  {v==='female'?'女 ♀':'男 ♂'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelSt}>抵達日期</label>
            <input type="date" value={player.arrivalDate}
              onChange={e=>dispatch({type:'SET_ARRIVAL_DATE',value:e.target.value})}
              style={inputSt}/>
          </div>

          <div>
            <label style={labelSt}>航班號碼</label>
            <input value={player.flightNumber}
              onChange={e=>dispatch({type:'SET_FLIGHT_NUM',value:e.target.value})}
              placeholder="EI 234..." style={inputSt}/>
          </div>

          <div>
            <label style={labelSt}>起飛時間</label>
            <input type="time" value={player.flightTime}
              onChange={e=>dispatch({type:'SET_FLIGHT_TIME',value:e.target.value})}
              style={inputSt}/>
          </div>

          <button
            onClick={()=>dispatch({type:'NAVIGATE',screen:'HOME'})}
            style={{
              padding:'8px', background:'#000', color:'#FFD700',
              border:'2.5px solid #000', boxShadow:'3px 3px 0 #555',
              cursor:'pointer', fontWeight:900, fontSize:11,
              letterSpacing:'0.1em', marginTop:4, ...ZH,
            }}>
            ☘ 開始冒險
          </button>
        </div>
      </div>

      {/* Phone chin */}
      <div style={{background:'#1C1C1C',height:20,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:32,height:4,background:'#333',borderRadius:2}}/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOME SCREEN ROOT — two-column layout
// ══════════════════════════════════════════════════════════════
export function HomeScreen() {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 3px 3px 0 #000; }
          50%      { box-shadow: 3px 3px 0 #22c55e, 0 0 12px rgba(34,197,94,0.4); }
        }
      `}</style>

      <div style={{height:'100%', display:'flex', overflow:'hidden'}}>

        {/* ── LEFT 45%: Smartphone Setup Console ── */}
        <div style={{
          width:'44%', flexShrink:0,
          borderRight:'3px solid #000',
          padding:'8px 6px 8px 8px',
          background:'linear-gradient(160deg,#1a1a1a 0%,#2C2C2C 100%)',
          display:'flex', flexDirection:'column',
        }}>
          <SetupConsole />
        </div>

        {/* ── RIGHT 56%: 2.5D Diorama ── */}
        <div style={{flex:1, position:'relative', overflow:'hidden'}}>
          <RoomSVG />
          <StatusHUD />
          <WatchBoxHUD />
        </div>
      </div>
    </>
  );
}
