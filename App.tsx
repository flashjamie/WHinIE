import React, { useState, useEffect } from 'react';

// ─── Google Fonts Injection ───────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Itim&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow: hidden; background: #1a0d06; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #f0ece0; }
  ::-webkit-scrollbar-thumb { background: #888; border: 1px solid #000; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes particleFall {
    0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(220px) rotate(720deg) scale(0.3); opacity: 0; }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(3); opacity: 0; }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer; opacity: 0.6;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender   = 'female' | 'male' | '';
type ScreenId = 'SETUP' | 'HOME' | 'AIB' | 'TASK' | 'GUILD' | 'DUNNES' | 'BAG' | 'COLLECTIONS';
type AvatarTab = 'hair' | 'outfit' | 'eyes' | 'mouth';

interface AvatarConfig {
  hairIdx:   number;
  outfitIdx: number;
  eyesIdx:   number;
  mouthIdx:  number;
}

// ─── Font shorthand helpers ───────────────────────────────────────────────────
const ZH: React.CSSProperties = { fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" };
const EN: React.CSSProperties = { fontFamily: "'Itim', cursive" };

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS: { id: ScreenId; label: string }[] = [
  { id: 'HOME',        label: 'HOME'          },
  { id: 'AIB',         label: 'AIB Bank'      },
  { id: 'TASK',        label: 'Task'          },
  { id: 'GUILD',       label: 'GUILD'         },
  { id: 'DUNNES',      label: 'DUNNES STORE'  },
  { id: 'BAG',         label: 'BAG'           },
  { id: 'COLLECTIONS', label: 'COLLECTIONS'  },
];

// ─── Avatar Option Sets ───────────────────────────────────────────────────────
const HAIR_OPTIONS = [
  { label: '無髮', value: 'NoHair',              emoji: '🔘' },
  { label: '短直', value: 'ShortHairShortFlat',  emoji: '💙' },
  { label: '短捲', value: 'ShortHairShortCurly', emoji: '💚' },
  { label: '波浪', value: 'ShortHairShortWaved', emoji: '💛' },
  { label: '長直', value: 'LongHairStraight',    emoji: '🩷' },
  { label: '長捲', value: 'LongHairCurly',       emoji: '❤️' },
  { label: '丸子', value: 'LongHairBun',         emoji: '🟣' },
  { label: '帽子', value: 'Hat',                 emoji: '🎩' },
];
const OUTFIT_OPTIONS = [
  { label: '帽T',  value: 'Hoodie',          emoji: '🧥' },
  { label: '西裝', value: 'BlazerShirt',     emoji: '👔' },
  { label: '毛衣', value: 'CollarSweater',   emoji: '🧶' },
  { label: '印花', value: 'GraphicShirt',    emoji: '👕' },
  { label: 'T恤',  value: 'ShirtCrewNeck',   emoji: '🩵' },
  { label: '吊帶', value: 'Overall',         emoji: '👗' },
];
const EYES_OPTIONS = [
  { label: '一般', value: 'Default',   emoji: '👁️' },
  { label: '開心', value: 'Happy',     emoji: '😊' },
  { label: '側眼', value: 'Side',      emoji: '👀' },
  { label: '瞇眼', value: 'Squint',    emoji: '😏' },
  { label: '驚訝', value: 'Surprised', emoji: '😲' },
  { label: '眨眼', value: 'Wink',      emoji: '😉' },
];
const MOUTH_OPTIONS = [
  { label: '一般', value: 'Default',  emoji: '😐' },
  { label: '微笑', value: 'Smile',    emoji: '😄' },
  { label: '嚴肅', value: 'Serious',  emoji: '😑' },
  { label: '鬼臉', value: 'Grimace',  emoji: '😬' },
  { label: '閃耀', value: 'Twinkle',  emoji: '🤩' },
];

// ─── Dropdown Data ─────────────────────────────────────────────────────────────
const TRANSIT_HUB_OPTIONS = [
  '阿拉伯聯合大公國', '土耳其', '卡達', '香港', '荷蘭', '英國', '法國', '德國', '其他',
];
const AIRLINE_OPTIONS = [
  '阿提哈德航空 (Etihad Airways)',
  '阿聯酋航空 (Emirates)',
  '土耳其航空 (Turkish Airlines)',
  '卡達航空 (Qatar Airways)',
  '國泰航空 (Cathay Pacific)',
  '中華航空 (China Airlines)',
  '長榮航空 (EVA Air)',
  '愛爾蘭航空 (Aer Lingus)',
  '瑞安航空 (Ryanair)',
  '荷蘭皇家航空 (KLM)',
  '法國航空 (Air France)',
  '漢莎航空 (Lufthansa)',
  '英國航空 (British Airways)',
  '其他',
];

// ─── Taiwan Task List (LV.0) ──────────────────────────────────────────────────
const TW_TASKS = [
  { id: 'tw1', icon: '🛂', label: '準備護照 & 簽證文件' },
  { id: 'tw2', icon: '🏦', label: '辦理海外匯款帳戶' },
  { id: 'tw3', icon: '💊', label: '備好常備藥品三個月份' },
  { id: 'tw4', icon: '📦', label: '行李清單確認' },
  { id: 'tw5', icon: '📱', label: '購買愛爾蘭 SIM 卡 eSIM' },
  { id: 'tw6', icon: '✈️', label: '確認班機 Check-in' },
];

// ─── Ireland Task List (LV.1) ─────────────────────────────────────────────────
const IE_TASKS = [
  { id: 'ie1', icon: '🏛️', label: 'IRP 登記外國人居留許可' },
  { id: 'ie2', icon: '🔢', label: '申辦 PPSN 公共服務號碼' },
  { id: 'ie3', icon: '🏦', label: '開立 AIB / BOI 本地銀行帳戶' },
  { id: 'ie4', icon: '🏠', label: '找到長期住所' },
  { id: 'ie5', icon: '🚌', label: '辦理 Leap Card 交通卡' },
  { id: 'ie6', icon: '💼', label: '確認工作 / 學校報到' },
];

// ─── Helper: Timezone Resolution ─────────────────────────────────────────────
function getTransitTz(hubs: string[], lines: string[]): { name: string; offset: number } {
  const s = [...hubs, ...lines].join(' ');
  if (/阿拉伯|阿聯酋|Emirates|阿提哈德|Etihad/.test(s)) return { name: 'Dubai',     offset: 4 };
  if (/土耳其|Turkish/.test(s))                           return { name: 'Istanbul',  offset: 3 };
  if (/卡達|Qatar/.test(s))                               return { name: 'Doha',      offset: 3 };
  if (/香港|國泰|Cathay/.test(s))                         return { name: 'Hong Kong', offset: 8 };
  if (/荷蘭|KLM/.test(s))                                 return { name: 'Amsterdam', offset: 2 };
  if (/英國|British/.test(s))                             return { name: 'London',    offset: 1 };
  if (/法國|Air France/.test(s))                          return { name: 'Paris',     offset: 2 };
  if (/德國|Lufthansa/.test(s))                           return { name: 'Frankfurt', offset: 2 };
  return { name: '中轉機場', offset: 0 };
}

// ─── Helper: Clock String ─────────────────────────────────────────────────────
function clockAt(offsetHours: number): string {
  const now  = new Date();
  const utc  = now.getTime() + now.getTimezoneOffset() * 60000;
  const t    = new Date(utc + offsetHours * 3600000);
  return t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Helper: Day Status ───────────────────────────────────────────────────────
function getDayStatus(arrivalDate: string): { type: 'none' | 'countdown' | 'arrived'; days: number } {
  if (!arrivalDate) return { type: 'none', days: 0 };
  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const arr    = new Date(arrivalDate); arr.setHours(0, 0, 0, 0);
  const diff   = Math.floor((arr.getTime() - today.getTime()) / 86400000);
  if (diff > 0) return { type: 'countdown', days: diff };
  return { type: 'arrived', days: Math.abs(diff) };
}

// ─── Helper: Build DiceBear URL ───────────────────────────────────────────────
function buildAvatarUrl(cfg: AvatarConfig): string {
  const hair   = HAIR_OPTIONS[cfg.hairIdx]?.value   ?? 'ShortHairShortFlat';
  const outfit = OUTFIT_OPTIONS[cfg.outfitIdx]?.value ?? 'Hoodie';
  const eyes   = EYES_OPTIONS[cfg.eyesIdx]?.value   ?? 'Default';
  const mouth  = MOUTH_OPTIONS[cfg.mouthIdx]?.value ?? 'Default';
  const params = new URLSearchParams({
    seed: 'WHinIE-traveler',
    backgroundColor: 'b6e3f4,c0aede,d1d4f9',
  });
  params.append('top[]',    hair);
  params.append('eyes[]',   eyes);
  params.append('mouth[]',  mouth);
  params.append('clothe[]', outfit);
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}

// ─── Particle Burst ───────────────────────────────────────────────────────────
function ParticlesBurst() {
  const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 70,
    size: 6 + Math.random() * 16,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.6,
    round: Math.random() > 0.5,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: p.color,
          border: '2px solid #000',
          borderRadius: p.round ? '50%' : '2px',
          animation: `particleFall 1.8s ease-out ${p.delay}s both`,
        }} />
      ))}
      {/* Central pulse ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 60, height: 60, borderRadius: '50%',
        border: '3px solid #FFD700',
        animation: 'pulseRing 1s ease-out 0.3s both',
      }} />
    </div>
  );
}

// ─── Airport Window SVG ───────────────────────────────────────────────────────
function AirportWindow({ transitHubs, airlines }: { transitHubs: string[]; airlines: string[] }) {
  const tz = getTransitTz(transitHubs, airlines);

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
  const [sky1, sky2] = skyColors[tz.name] ?? ['#0D0D2B', '#1B1B3A'];

  const Silhouette = () => {
    switch (tz.name) {
      case 'Dubai': return (
        <g fill="#0a0a1a" opacity="0.95">
          <rect x="190" y="15" width="7"  height="145" /> {/* Burj Khalifa tip */}
          <rect x="185" y="60" width="17" height="100" />
          <rect x="178" y="100" width="31" height="60" />
          <rect x="168" y="130" width="51" height="30" />
          <rect x="80"  y="110" width="35" height="70" />
          <rect x="120" y="95"  width="30" height="85" />
          <rect x="230" y="105" width="40" height="75" />
          <rect x="280" y="90"  width="28" height="90" />
          <rect x="318" y="115" width="45" height="65" />
          <rect x="30"  y="130" width="30" height="50" />
        </g>
      );
      case 'Istanbul': return (
        <g fill="#0a0a1a" opacity="0.95">
          {/* Hagia Sophia dome */}
          <ellipse cx="200" cy="105" rx="52" ry="38" />
          <rect x="158" y="105" width="84" height="65" />
          {/* Minarets */}
          <rect x="142" y="50" width="11" height="120" />
          <polygon points="142,50 147,32 153,50" />
          <rect x="247" y="50" width="11" height="120" />
          <polygon points="247,50 252,32 258,50" />
          {/* Side buildings */}
          <rect x="50"  y="130" width="38" height="50" />
          <rect x="98"  y="115" width="30" height="65" />
          <rect x="312" y="120" width="42" height="60" />
          <rect x="360" y="135" width="30" height="45" />
        </g>
      );
      case 'Hong Kong': return (
        <g fill="#0a0a1a" opacity="0.95">
          <rect x="20"  y="120" width="28" height="60" />
          <rect x="55"  y="100" width="32" height="80" />
          <rect x="95"  y="78"  width="24" height="102" />
          <rect x="127" y="55"  width="28" height="125" />
          <rect x="163" y="42"  width="22" height="138" />
          <rect x="193" y="35"  width="18" height="145" />
          <rect x="220" y="50"  width="30" height="130" />
          <rect x="258" y="70"  width="24" height="110" />
          <rect x="290" y="88"  width="32" height="92" />
          <rect x="330" y="100" width="28" height="80" />
          <rect x="366" y="115" width="24" height="65" />
        </g>
      );
      default: return (
        <g fill="#0a0a1a" opacity="0.95">
          {/* Control tower */}
          <rect x="188" y="45"  width="24" height="135" />
          <rect x="178" y="38"  width="44" height="16"  />
          <rect x="168" y="50"  width="64" height="8"   />
          <circle cx="200" cy="35" r="12" />
          {/* Terminal buildings */}
          <rect x="60"  y="130" width="100" height="50" />
          <rect x="240" y="130" width="100" height="50" />
          <rect x="30"  y="145" width="40"  height="35" />
          <rect x="330" y="145" width="40"  height="35" />
          {/* Runway center line */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={20 + i * 48} y="188" width="28" height="4" fill="#FFD700" opacity="0.6" />
          ))}
        </g>
      );
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      border: '3px solid #000', overflow: 'hidden',
      borderRadius: '6px', position: 'relative',
    }}>
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={sky1} />
            <stop offset="100%" stopColor={sky2} />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#skyGrad)" />
        {/* Stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx={12 + i * 19} cy={5 + (i % 4) * 10} r="1.2" fill="white" opacity="0.7" />
        ))}
        {/* Moon */}
        <circle cx="360" cy="28" r="14" fill="#FFEAA7" opacity="0.88" />
        <circle cx="367" cy="23" r="10" fill={sky1} />
        {/* Ground */}
        <rect x="0" y="178" width="400" height="22" fill="#1a1a1a" />
        <Silhouette />
      </svg>
      {/* Location badge */}
      <div style={{
        position: 'absolute', bottom: '6px', left: '8px',
        background: 'rgba(0,0,0,0.75)', color: '#FFD700',
        padding: '2px 7px', fontSize: '10px', border: '1px solid #FFD700',
        borderRadius: '3px', ...EN,
      }}>
        ✈ {tz.name !== '中轉機場' ? tz.name : 'Select Transit Hub'}
      </div>
    </div>
  );
}

// ─── Multi-Select Dropdown ────────────────────────────────────────────────────
function MultiSelectDropdown({
  label, options, selected, onToggle,
  customVal, setCustomVal, tagColor,
}: {
  label: string; options: string[]; selected: string[];
  onToggle: (v: string) => void;
  customVal: string; setCustomVal: (v: string) => void;
  tagColor: string;
}) {
  const [open, setOpen] = useState(false);
  const inputS: React.CSSProperties = {
    width: '100%', padding: '5px 8px',
    border: '2.5px solid #000', boxShadow: open ? 'none' : '3px 3px 0 #000',
    background: '#FDFBF7', fontSize: '12px', outline: 'none',
    cursor: 'pointer', ...ZH,
    display: 'flex', flexWrap: 'wrap', gap: '3px', minHeight: '32px',
    alignItems: 'center',
  };
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', marginBottom: '3px', ...ZH }}>{label}</div>
      <div style={inputS as React.CSSProperties} onClick={() => setOpen(o => !o)} role="button">
        {selected.length === 0
          ? <span style={{ color: '#999', fontSize: '11px' }}>點選選擇...</span>
          : selected.map(s => (
              <span key={s} style={{
                background: tagColor, border: '1.5px solid #000',
                padding: '0 5px', fontSize: '10px', borderRadius: '3px',
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                cursor: 'default', ...ZH,
              }}>
                {s.length > 10 ? s.slice(0, 8) + '…' : s}
                <span onClick={e => { e.stopPropagation(); onToggle(s); }}
                  style={{ cursor: 'pointer', fontWeight: '900', fontSize: '11px' }}>×</span>
              </span>
            ))
        }
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#666', ...EN }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 200,
          background: '#FDFBF7', border: '2.5px solid #000', boxShadow: '4px 4px 0 #000',
          maxHeight: '170px', overflowY: 'auto',
          animation: 'fadeSlideIn 0.15s ease-out both',
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => opt !== '其他' && onToggle(opt)}
              style={{
                padding: '5px 10px', cursor: opt === '其他' ? 'default' : 'pointer',
                background: selected.includes(opt) ? tagColor : 'transparent',
                borderBottom: '1px solid #e8e4da',
                fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'background 0.1s', ...ZH,
              }}
              onMouseEnter={e => { if (!selected.includes(opt)) (e.currentTarget as HTMLDivElement).style.background = '#f5f0e8'; }}
              onMouseLeave={e => { if (!selected.includes(opt)) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '13px' }}>{selected.includes(opt) ? '☑' : '☐'}</span>
              {opt}
            </div>
          ))}
          <div style={{ padding: '4px 6px', borderTop: '2px solid #000', background: '#f5f0e8' }}>
            <input
              placeholder="自訂輸入 + Enter..."
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && customVal.trim()) {
                  onToggle(customVal.trim());
                  setCustomVal('');
                }
              }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', padding: '4px 6px',
                border: '2px solid #000', background: '#FDFBF7',
                fontSize: '11px', outline: 'none', ...ZH,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen({
  playerName, setPlayerName,
  gender, setGender,
  arrivalDate, setArrivalDate,
  flightTime, setFlightTime,
  transitHubs, setTransitHubs,
  airlines, setAirlines,
  flightNumber, setFlightNumber,
  avatarConfig, setAvatarConfig,
  onSubmit,
}: {
  playerName: string; setPlayerName: (v: string) => void;
  gender: Gender; setGender: (v: Gender) => void;
  arrivalDate: string; setArrivalDate: (v: string) => void;
  flightTime: string; setFlightTime: (v: string) => void;
  transitHubs: string[]; setTransitHubs: (v: string[]) => void;
  airlines: string[]; setAirlines: (v: string[]) => void;
  flightNumber: string; setFlightNumber: (v: string) => void;
  avatarConfig: AvatarConfig; setAvatarConfig: (v: AvatarConfig) => void;
  onSubmit: () => void;
}) {
  const [avatarTab, setAvatarTab] = useState<AvatarTab>('hair');
  const [transitCustom, setTransitCustom] = useState('');
  const [airlineCustom, setAirlineCustom] = useState('');
  const avatarUrl = buildAvatarUrl(avatarConfig);

  const tabOptionsMap: Record<AvatarTab, typeof HAIR_OPTIONS> = {
    hair: HAIR_OPTIONS, outfit: OUTFIT_OPTIONS, eyes: EYES_OPTIONS, mouth: MOUTH_OPTIONS,
  };
  const currentOptions = tabOptionsMap[avatarTab];
  const currentIdx = { hair: avatarConfig.hairIdx, outfit: avatarConfig.outfitIdx, eyes: avatarConfig.eyesIdx, mouth: avatarConfig.mouthIdx }[avatarTab];
  const setIdx = (idx: number) => setAvatarConfig({
    ...avatarConfig,
    ...(avatarTab === 'hair'   ? { hairIdx:   idx }
      : avatarTab === 'outfit' ? { outfitIdx: idx }
      : avatarTab === 'eyes'   ? { eyesIdx:   idx }
      : { mouthIdx: idx }),
  });

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '7px 10px',
    border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
    background: '#FDFBF7', fontSize: '13px', outline: 'none',
    borderRadius: '3px', ...ZH,
  };
  const labelBase: React.CSSProperties = {
    fontSize: '10px', fontWeight: '700', marginBottom: '4px',
    display: 'block', letterSpacing: '0.06em', ...ZH,
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── LEFT COLUMN 45% ─────────────────────────────────────────── */}
      <div style={{
        width: '45%', flexShrink: 0, display: 'flex', flexDirection: 'column',
        borderRight: '3px solid #000',
        background: 'linear-gradient(170deg, #f0ece0 0%, #FDFBF7 60%)',
        padding: '10px', gap: '8px',
      }}>
        {/* Polaroid Avatar Frame */}
        <div style={{
          flex: '0 0 auto', background: 'white',
          border: '3px solid #000', boxShadow: '5px 5px 0 #000',
          padding: '6px', position: 'relative',
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '18px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Polaroid frame inner */}
          <div style={{
            background: '#fff', padding: '5px 5px 18px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            border: '1px solid #ddd',
            width: '110px',
          }}>
            <img src={avatarUrl} alt="avatar preview" style={{ width: '100%', display: 'block' }} />
          </div>
          {/* LIVE badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: '#000', color: '#00FF41',
            fontSize: '8px', padding: '2px 6px', letterSpacing: '0.08em',
            border: '1.5px solid #00FF41',
            display: 'flex', alignItems: 'center', gap: '3px', ...EN,
          }}>
            <span style={{ animation: 'blink 1s step-start infinite' }}>●</span>
            LIVE PREVIEW
          </div>
          {/* Player name label under polaroid */}
          <div style={{
            marginTop: '5px', fontSize: '12px', fontWeight: '700',
            color: '#333', textAlign: 'center', ...ZH,
          }}>
            {playerName || '冒險者姓名'}
          </div>
        </div>

        {/* Avatar Customization Tabs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
          {/* Tab row */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['hair', 'outfit', 'eyes', 'mouth'] as AvatarTab[]).map(tab => (
              <button key={tab} onClick={() => setAvatarTab(tab)} style={{
                flex: 1, padding: '4px 2px', border: '2px solid #000',
                boxShadow: avatarTab === tab ? 'none' : '2px 2px 0 #000',
                background: avatarTab === tab ? '#FFD700' : '#FDFBF7',
                cursor: 'pointer', fontSize: '10px', fontWeight: '700',
                transform: avatarTab === tab ? 'translate(2px,2px)' : 'none',
                transition: 'all 0.1s', ...ZH,
              }}>
                {{ hair: '髮型', outfit: '服裝', eyes: '眼睛', mouth: '嘴巴' }[tab]}
              </button>
            ))}
          </div>
          {/* Options grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${currentOptions.length <= 6 ? 3 : 4}, 1fr)`,
            gap: '4px', overflowY: 'auto',
          }}>
            {currentOptions.map((opt, idx) => (
              <button key={opt.value} onClick={() => setIdx(idx)} style={{
                padding: '5px 3px', border: '2px solid #000',
                boxShadow: currentIdx === idx ? 'none' : '2px 2px 0 #000',
                background: currentIdx === idx ? '#FFD700' : '#FDFBF7',
                cursor: 'pointer', fontSize: '9px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                transform: currentIdx === idx ? 'translate(2px,2px)' : 'none',
                transition: 'all 0.1s', ...ZH,
              }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN 55% ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#FDFBF7', overflow: 'hidden',
      }}>
        {/* Header banner */}
        <div style={{
          background: '#000', color: '#FDFBF7',
          padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: '8px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '18px' }}>🛂</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '0.08em', ...ZH }}>
              冒險者護照 — 身份設定面板
            </div>
            <div style={{ fontSize: '9px', color: '#aaa', letterSpacing: '0.12em', ...EN }}>
              PASSPORT CONFIGURATION PANEL
            </div>
          </div>
          <div style={{
            marginLeft: 'auto', border: '1px solid #555',
            padding: '2px 8px', fontSize: '9px', color: '#888', ...EN,
          }}>
            REPUBLIC OF IRELAND
          </div>
        </div>

        {/* Scrollable form area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: '9px',
        }}>

          {/* Field: 冒險者稱號 */}
          <div>
            <label style={labelBase}>🏷 冒險者稱號</label>
            <input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="請輸入你的姓名..."
              style={inputBase}
            />
          </div>

          {/* Field: 生理性別 */}
          <div>
            <label style={labelBase}>⚧ 生理性別</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([
                { v: 'female' as Gender, label: '女 ♀', active: '#FF69B4' },
                { v: 'male'  as Gender, label: '男 ♂', active: '#1E90FF' },
              ] as { v: Gender; label: string; active: string }[]).map(({ v, label, active }) => (
                <button key={v} onClick={() => setGender(v)} style={{
                  flex: 1, padding: '9px 8px',
                  border: '3px solid #000',
                  borderRadius: '100px',
                  boxShadow: gender === v ? 'inset 3px 3px 8px rgba(0,0,0,0.25)' : '4px 4px 0 #000',
                  background: gender === v ? active : '#FDFBF7',
                  color: gender === v ? '#fff' : '#000',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                  transform: gender === v ? 'translate(2px,2px)' : 'none',
                  transition: 'all 0.15s', ...ZH,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Logistics Core Group */}
          <div style={{
            border: '3px solid #000', boxShadow: '4px 4px 0 #000',
            padding: '9px', background: '#f0ece0',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: '900', marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '5px',
              letterSpacing: '0.06em', ...ZH,
            }}>
              <span style={{ fontSize: '14px' }}>🛫</span>
              跨境後勤動態排程核心
            </div>

            {/* Date + Time row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '7px' }}>
              <div>
                <label style={{ ...labelBase, fontSize: '9px' }}>啟程日期</label>
                <input type="date" value={arrivalDate}
                  onChange={e => setArrivalDate(e.target.value)}
                  style={{ ...inputBase, fontSize: '12px', padding: '5px 7px' }}
                />
              </div>
              <div>
                <label style={{ ...labelBase, fontSize: '9px' }}>班機時間</label>
                <input type="time" value={flightTime}
                  onChange={e => setFlightTime(e.target.value)}
                  style={{ ...inputBase, fontSize: '12px', padding: '5px 7px', ...EN }}
                />
              </div>
            </div>

            {/* Transit Hubs */}
            <div style={{ marginBottom: '7px' }}>
              <MultiSelectDropdown
                label="中轉地點 (Transit Hub)"
                options={TRANSIT_HUB_OPTIONS}
                selected={transitHubs}
                onToggle={v => setTransitHubs(
                  transitHubs.includes(v) ? transitHubs.filter(x => x !== v) : [...transitHubs, v]
                )}
                customVal={transitCustom}
                setCustomVal={setTransitCustom}
                tagColor="#FFD700"
              />
            </div>

            {/* Airlines */}
            <div style={{ marginBottom: '7px' }}>
              <MultiSelectDropdown
                label="航空公司 (Airlines)"
                options={AIRLINE_OPTIONS}
                selected={airlines}
                onToggle={v => setAirlines(
                  airlines.includes(v) ? airlines.filter(x => x !== v) : [...airlines, v]
                )}
                customVal={airlineCustom}
                setCustomVal={setAirlineCustom}
                tagColor="#b6e3f4"
              />
            </div>

            {/* Flight Number */}
            <div>
              <label style={{ ...labelBase, fontSize: '9px' }}>航班編號 (Flight Number)</label>
              <input
                value={flightNumber}
                onChange={e => setFlightNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                placeholder="例如: EK367 或 BR087..."
                style={{ ...inputBase, fontSize: '12px', padding: '5px 7px', ...EN }}
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div style={{ padding: '8px 14px', borderTop: '2px solid #000', flexShrink: 0 }}>
          <button onClick={onSubmit}
            onMouseDown={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translate(4px,4px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
            onMouseUp={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '6px 6px 0 #000';
            }}
            style={{
              width: '100%', padding: '13px',
              background: 'rgba(124,58,237,0.55)',
              border: '3px solid #000',
              boxShadow: '6px 6px 0 #000',
              color: '#fff', fontSize: '15px', fontWeight: '900',
              cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'all 0.1s',
              backdropFilter: 'blur(2px)',
              ...ZH,
            }}>
            👾 啟動愛爾蘭冒險
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({
  playerName, gender, avatarConfig, arrivalDate, transitHubs, airlines, flightNumber, flightTime,
}: {
  playerName: string; gender: Gender; avatarConfig: AvatarConfig;
  arrivalDate: string; transitHubs: string[]; airlines: string[];
  flightNumber: string; flightTime: string;
}) {
  const [, forceRender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceRender(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const transitTz  = getTransitTz(transitHubs, airlines);
  const dayStatus  = getDayStatus(arrivalDate);
  const avatarUrl  = buildAvatarUrl(avatarConfig);

  const hudBg = dayStatus.type === 'arrived' ? '#a8f0a8'
              : dayStatus.type === 'countdown' ? '#FFE082'
              : '#e8e4d8';

  const hudText = dayStatus.type === 'none'
    ? `🛰️ 台灣整備中\n基地充能第 1 天`
    : dayStatus.type === 'countdown'
    ? `✈️ 出發倒數\nD - ${dayStatus.days} 天`
    : `☘️ 登陸愛爾蘭\nDay ${dayStatus.days}`;

  const clocks = [
    { flag: '🇹🇼', name: '台灣',        sub: 'GMT+8',                       time: clockAt(8),                                        bg: '#FFE4E1' },
    { flag: '✈️',   name: transitTz.name, sub: transitTz.offset ? `GMT+${transitTz.offset}` : '—', time: transitTz.offset ? clockAt(transitTz.offset) : '--:--:--', bg: '#EDE7F6' },
    { flag: '🇮🇪', name: '愛爾蘭',      sub: 'GMT+1 (IST)',                  time: clockAt(1),                                        bg: '#E8F5E9' },
  ];

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px' }}>

      {/* Row 1: Avatar + Player info + HUD */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', flexShrink: 0 }}>
        {/* Avatar */}
        <div style={{
          width: '58px', flexShrink: 0,
          border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
          background: '#b6e3f4', overflow: 'hidden', borderRadius: '4px',
        }}>
          <img src={avatarUrl} alt="player" style={{ width: '100%', display: 'block' }} />
        </div>
        {/* Name + stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', lineHeight: 1, ...ZH }}>
            {playerName || '旅行者'}
          </div>
          <div style={{ fontSize: '11px', color: '#555', ...ZH }}>
            {gender === 'female' ? '女 ♀' : gender === 'male' ? '男 ♂' : '冒險者'} · LV.1 新移民
          </div>
          {flightNumber && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: '#000', color: '#FFD700',
              padding: '2px 8px', fontSize: '11px', width: 'fit-content', ...EN,
            }}>
              ✈ {flightNumber} {flightTime && `@ ${flightTime}`}
            </div>
          )}
        </div>
        {/* Day HUD */}
        <div style={{
          flexShrink: 0, background: hudBg,
          border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
          padding: '8px 12px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px',
        }}>
          {hudText.split('\n').map((line, i) => (
            <div key={i} style={{
              fontSize: i === 0 ? '12px' : '14px',
              fontWeight: i === 0 ? '500' : '900',
              ...ZH,
            }}>{line}</div>
          ))}
        </div>
      </div>

      {/* Row 2: Airport window */}
      <div style={{ height: '110px', flexShrink: 0 }}>
        <AirportWindow transitHubs={transitHubs} airlines={airlines} />
      </div>

      {/* Row 3: Three World Clocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '7px', flexShrink: 0 }}>
        {clocks.map(({ flag, name, sub, time, bg }) => (
          <div key={name} style={{
            border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
            background: bg, padding: '8px 6px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px' }}>{flag}</div>
            <div style={{ fontSize: '10px', fontWeight: '700', ...ZH }}>{name}</div>
            <div style={{ fontSize: '8px', color: '#777', marginBottom: '4px', ...EN }}>{sub}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.05em', ...EN }}>{time}</div>
          </div>
        ))}
      </div>

      {/* Row 4: Transit info */}
      {(transitHubs.length > 0 || airlines.length > 0) && (
        <div style={{
          border: '2px solid #000', padding: '7px 10px',
          background: '#f5f0e8', fontSize: '11px',
          display: 'flex', flexWrap: 'wrap', gap: '4px',
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: '700', marginRight: '4px', ...ZH }}>中轉：</span>
          {transitHubs.map(h => (
            <span key={h} style={{
              background: '#FFD700', border: '1.5px solid #000',
              padding: '1px 6px', fontSize: '10px', ...ZH,
            }}>{h}</span>
          ))}
          {airlines.map(a => (
            <span key={a} style={{
              background: '#b6e3f4', border: '1.5px solid #000',
              padding: '1px 6px', fontSize: '10px', ...ZH,
            }}>{a.split(' ')[0]}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TASK SCREEN ──────────────────────────────────────────────────────────────
function TaskScreen({
  arrivalDate, playerName,
}: {
  arrivalDate: string; playerName: string;
}) {
  const dayStatus = getDayStatus(arrivalDate);
  const isArrived = dayStatus.type === 'arrived';

  const [twDone,  setTwDone]  = useState<Set<string>>(new Set());
  const [ieDone,  setIeDone]  = useState<Set<string>>(new Set());
  const toggleTask = (id: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const hudBg = isArrived ? '#a8f0a8' : dayStatus.type === 'countdown' ? '#FFE082' : '#e8e4d8';
  const hudMsg = dayStatus.type === 'none'
    ? `🛰️ 台灣整備中 / 基地充能第 1 天`
    : dayStatus.type === 'countdown'
    ? `✈️ 出發倒數 D - ${dayStatus.days} 天`
    : `☘️ 登陸愛爾蘭：Day ${dayStatus.days}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HUD Bar */}
      <div style={{
        flexShrink: 0, background: hudBg,
        border: '0 0 3px 0', borderBottom: '3px solid #000',
        padding: '10px 14px', fontSize: '13px', fontWeight: '700',
        display: 'flex', alignItems: 'center', gap: '8px', ...ZH,
      }}>
        <span style={{ fontSize: '20px' }}>{isArrived ? '☘️' : '🗓️'}</span>
        {hudMsg}
        {playerName && (
          <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '400', color: '#555' }}>
            冒險者：{playerName}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Taiwan Tasks LV.0 */}
        <div style={{
          border: '3px solid #000',
          boxShadow: '4px 4px 0 #000',
          overflow: 'hidden',
          opacity: isArrived ? 0.45 : 1,
          transition: 'opacity 0.5s',
        }}>
          <div style={{
            background: isArrived ? '#888' : '#FF6B35',
            color: '#fff', padding: '7px 12px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontWeight: '900', fontSize: '12px', ...EN }}>LV.0</span>
            <span style={{ fontWeight: '700', fontSize: '12px', ...ZH }}>
              🇹🇼 台灣整備任務
            </span>
            {isArrived && (
              <span style={{
                marginLeft: 'auto', background: '#555', color: '#fff',
                padding: '1px 8px', fontSize: '9px', border: '1px solid #fff',
                ...ZH,
              }}>
                ✓ 已完成階段
              </span>
            )}
          </div>
          {TW_TASKS.map(task => (
            <div key={task.id}
              onClick={() => !isArrived && toggleTask(task.id, twDone, setTwDone)}
              style={{
                padding: '7px 12px', borderTop: '1px solid #ddd',
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: isArrived ? 'not-allowed' : 'pointer',
                background: twDone.has(task.id) ? '#f0f0f0' : '#FDFBF7',
                transition: 'background 0.15s',
              }}>
              <div style={{
                width: '18px', height: '18px', border: '2px solid #000',
                background: twDone.has(task.id) ? '#FF6B35' : '#FDFBF7',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {twDone.has(task.id) && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '900' }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px' }}>{task.icon}</span>
              <span style={{
                fontSize: '12px',
                textDecoration: twDone.has(task.id) ? 'line-through' : 'none',
                color: twDone.has(task.id) ? '#999' : '#000',
                ...ZH,
              }}>{task.label}</span>
            </div>
          ))}
        </div>

        {/* Ireland Tasks LV.1 */}
        <div style={{
          border: `3px solid ${isArrived ? '#000' : '#ccc'}`,
          boxShadow: isArrived ? '4px 4px 0 #000' : '4px 4px 0 #ccc',
          overflow: 'hidden',
          opacity: isArrived ? 1 : 0.4,
          transition: 'all 0.5s',
          position: 'relative',
        }}>
          <div style={{
            background: isArrived ? '#00A651' : '#aaa',
            color: '#fff', padding: '7px 12px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ fontWeight: '900', fontSize: '12px', ...EN }}>LV.1</span>
            <span style={{ fontWeight: '700', fontSize: '12px', ...ZH }}>
              🇮🇪 愛爾蘭初登陸任務
            </span>
            {!isArrived && (
              <span style={{
                marginLeft: 'auto', fontSize: '9px', background: '#888',
                padding: '1px 8px', border: '1px solid #fff', ...ZH,
              }}>
                🔒 抵達後解鎖
              </span>
            )}
          </div>
          {IE_TASKS.map(task => (
            <div key={task.id}
              onClick={() => isArrived && toggleTask(task.id, ieDone, setIeDone)}
              style={{
                padding: '7px 12px', borderTop: '1px solid #ddd',
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: isArrived ? 'pointer' : 'not-allowed',
                background: ieDone.has(task.id) ? '#e8f5ec' : '#FDFBF7',
                transition: 'background 0.15s',
              }}>
              <div style={{
                width: '18px', height: '18px', border: '2px solid #000',
                background: ieDone.has(task.id) ? '#00A651' : '#FDFBF7',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {ieDone.has(task.id) && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '900' }}>✓</span>}
              </div>
              <span style={{ fontSize: '13px' }}>{task.icon}</span>
              <span style={{
                fontSize: '12px',
                textDecoration: ieDone.has(task.id) ? 'line-through' : 'none',
                color: ieDone.has(task.id) ? '#666' : isArrived ? '#000' : '#bbb',
                ...ZH,
              }}>{task.label}</span>
            </div>
          ))}
          {!isArrived && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 16px)',
              pointerEvents: 'none',
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COLLECTIONS SCREEN ───────────────────────────────────────────────────────
function CollectionsScreen({
  transitHubs, airlines, arrivalDate, playerName,
}: {
  transitHubs: string[]; airlines: string[]; arrivalDate: string; playerName: string;
}) {
  const hasComplexRouting = transitHubs.length > 1 || (transitHubs.length >= 1 && airlines.length >= 1 && airlines.length > 1);
  const dayStatus = getDayStatus(arrivalDate);
  const hasArrived = dayStatus.type === 'arrived';

  const badges = [
    {
      id: 'transit-maniac',
      emoji: '🔀',
      title: '轉機狂人',
      titleEn: 'Transit Maniac',
      desc: '選擇多個中轉地點或複雜航線',
      unlocked: hasComplexRouting,
      color: '#9B59B6',
    },
    {
      id: 'ireland-landed',
      emoji: '☘️',
      title: '愛爾蘭登陸',
      titleEn: 'Ireland Landed',
      desc: '抵達愛爾蘭',
      unlocked: hasArrived,
      color: '#00A651',
    },
    {
      id: 'passport-set',
      emoji: '🛂',
      title: '護照完成',
      titleEn: 'Passport Set',
      desc: '完整填寫冒險者資料',
      unlocked: !!playerName && !!arrivalDate,
      color: '#E67E22',
    },
    {
      id: 'flight-ready',
      emoji: '✈️',
      title: '飛行準備',
      titleEn: 'Flight Ready',
      desc: '填寫航班編號與時間',
      unlocked: airlines.length > 0,
      color: '#2980B9',
    },
    {
      id: 'world-clock',
      emoji: '🕐',
      title: '時空旅人',
      titleEn: 'Time Traveler',
      desc: '擁有中轉時區同步',
      unlocked: transitHubs.length > 0 || airlines.length > 0,
      color: '#16A085',
    },
    {
      id: 'locked-1', emoji: '❓', title: '???', titleEn: 'Mystery', desc: '繼續探索解鎖', unlocked: false, color: '#95A5A6',
    },
    {
      id: 'locked-2', emoji: '❓', title: '???', titleEn: 'Mystery', desc: '繼續探索解鎖', unlocked: false, color: '#95A5A6',
    },
    {
      id: 'locked-3', emoji: '❓', title: '???', titleEn: 'Mystery', desc: '繼續探索解鎖', unlocked: false, color: '#95A5A6',
    },
  ];

  const unlocked = badges.filter(b => b.unlocked).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#2C1A0E', color: '#C9A96E',
        padding: '10px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '20px' }}>📔</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '0.06em', ...ZH }}>
            時空旅人里程碑
          </div>
          <div style={{ fontSize: '9px', color: '#888', ...EN }}>MILESTONE COLLECTION</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: '#FFD700', color: '#000',
          padding: '3px 10px', border: '2px solid #000',
          fontSize: '11px', fontWeight: '700', ...EN,
        }}>
          {unlocked} / {badges.length} UNLOCKED
        </div>
      </div>

      {/* Badges scrapbook */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px', alignContent: 'start',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '22px 22px',
      }}>
        {badges.map(badge => (
          <div key={badge.id} style={{
            border: `3px solid ${badge.unlocked ? '#000' : '#ccc'}`,
            boxShadow: badge.unlocked ? `4px 4px 0 #000` : '4px 4px 0 #ccc',
            background: badge.unlocked ? '#FDFBF7' : '#f0ece0',
            padding: '10px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            position: 'relative', overflow: 'hidden',
            filter: badge.unlocked ? 'none' : 'grayscale(80%)',
            transition: 'all 0.3s',
            animation: badge.unlocked ? 'fadeSlideIn 0.4s ease-out both' : 'none',
          }}>
            {/* Badge color strip */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '4px', background: badge.unlocked ? badge.color : '#ccc',
            }} />
            <span style={{ fontSize: '28px', marginTop: '4px' }}>{badge.emoji}</span>
            <div style={{
              fontSize: '11px', fontWeight: '900', textAlign: 'center',
              color: badge.unlocked ? '#000' : '#aaa', ...ZH,
            }}>
              {badge.title}
            </div>
            <div style={{ fontSize: '8px', color: '#888', ...EN }}>{badge.titleEn}</div>
            <div style={{ fontSize: '9px', color: '#666', textAlign: 'center', ...ZH }}>
              {badge.desc}
            </div>
            {badge.unlocked && (
              <div style={{
                position: 'absolute', top: '6px', right: '4px',
                background: badge.color, color: '#fff',
                fontSize: '8px', padding: '1px 4px',
                border: '1px solid #000', ...EN,
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 轉機狂人 special callout */}
      {hasComplexRouting && (
        <div style={{
          flexShrink: 0, margin: '0 12px 10px',
          border: '3px solid #9B59B6', boxShadow: '4px 4px 0 #9B59B6',
          background: 'rgba(155,89,182,0.08)', padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'fadeSlideIn 0.5s ease-out both',
        }}>
          <span style={{ fontSize: '22px' }}>🏆</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '900', color: '#9B59B6', ...ZH }}>
              【轉機狂人】徽章解鎖！
            </div>
            <div style={{ fontSize: '10px', color: '#555', ...ZH }}>
              你選擇了複雜的中轉路線，展現了航線規劃大師的素養
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLACEHOLDER SCREEN ───────────────────────────────────────────────────────
function PlaceholderScreen({ id }: { id: ScreenId }) {
  const meta: Record<string, { emoji: string; title: string; desc: string }> = {
    AIB:    { emoji: '🏦', title: 'AIB Bank',       desc: '愛爾蘭銀行開戶指南與帳戶管理' },
    GUILD:  { emoji: '⚔️', title: 'GUILD',           desc: '加入冒險者公會，找到志同道合的夥伴' },
    DUNNES: { emoji: '🛒', title: 'DUNNES STORE',   desc: '愛爾蘭超市攻略與生活採購清單' },
    BAG:    { emoji: '🎒', title: 'BAG',             desc: '行李清單與物品管理' },
  };
  const info = meta[id] ?? { emoji: '🚧', title: id, desc: '即將開放' };
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '12px',
      background: '#FDFBF7', padding: '20px',
    }}>
      <span style={{ fontSize: '56px' }}>{info.emoji}</span>
      <div style={{ fontSize: '22px', fontWeight: '900', ...ZH }}>{info.title}</div>
      <div style={{
        border: '3px solid #000', boxShadow: '4px 4px 0 #000',
        background: '#f5f0e8', padding: '10px 20px',
        fontSize: '13px', ...ZH, textAlign: 'center',
      }}>
        {info.desc}
      </div>
      <div style={{
        background: '#FFD700', border: '2px solid #000',
        padding: '5px 14px', fontSize: '11px', ...EN,
      }}>
        🚧 COMING SOON
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,      setScreen]      = useState<ScreenId>('SETUP');
  const [playerName,  setPlayerName]  = useState('');
  const [gender,      setGender]      = useState<Gender>('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [flightTime,  setFlightTime]  = useState('');
  const [transitHubs, setTransitHubs] = useState<string[]>([]);
  const [airlines,    setAirlines]    = useState<string[]>([]);
  const [flightNumber,setFlightNumber]= useState('');
  const [avatarConfig,setAvatarConfig]= useState<AvatarConfig>({ hairIdx: 1, outfitIdx: 0, eyesIdx: 0, mouthIdx: 1 });
  const [showParticles, setShowParticles] = useState(false);

  const dayStatus = getDayStatus(arrivalDate);
  const prevType  = React.useRef(dayStatus.type);
  useEffect(() => {
    if (prevType.current !== 'arrived' && dayStatus.type === 'arrived') {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2800);
    }
    prevType.current = dayStatus.type;
  }, [dayStatus.type]);

  const handleSubmit = () => {
    setScreen('HOME');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'SETUP':
        return (
          <SetupScreen
            playerName={playerName}  setPlayerName={setPlayerName}
            gender={gender}           setGender={setGender}
            arrivalDate={arrivalDate} setArrivalDate={setArrivalDate}
            flightTime={flightTime}   setFlightTime={setFlightTime}
            transitHubs={transitHubs} setTransitHubs={setTransitHubs}
            airlines={airlines}       setAirlines={setAirlines}
            flightNumber={flightNumber} setFlightNumber={setFlightNumber}
            avatarConfig={avatarConfig} setAvatarConfig={setAvatarConfig}
            onSubmit={handleSubmit}
          />
        );
      case 'HOME':
        return (
          <HomeScreen
            playerName={playerName} gender={gender} avatarConfig={avatarConfig}
            arrivalDate={arrivalDate} transitHubs={transitHubs} airlines={airlines}
            flightNumber={flightNumber} flightTime={flightTime}
          />
        );
      case 'TASK':
        return <TaskScreen arrivalDate={arrivalDate} playerName={playerName} />;
      case 'COLLECTIONS':
        return (
          <CollectionsScreen
            transitHubs={transitHubs} airlines={airlines}
            arrivalDate={arrivalDate} playerName={playerName}
          />
        );
      default:
        return <PlaceholderScreen id={screen} />;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {showParticles && <ParticlesBurst />}

      {/* Outer dark leather background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, #3D1F0A 0%, #1A0D06 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6px',
        ...EN,
      }}>
        {/* Notebook Container */}
        <div style={{
          width: '100%', maxWidth: '1080px',
          height: '100%', maxHeight: '640px',
          display: 'flex',
          border: '5px solid #000',
          boxShadow: '10px 10px 0 #000, 0 0 40px rgba(0,0,0,0.6)',
          position: 'relative',
          // Book-edge shadow
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.08) 0px, transparent 12px)',
        }}>

          {/* Page area (main content) */}
          <div style={{
            flex: 1, overflow: 'hidden', position: 'relative',
            background: '#FDFBF7',
            backgroundImage: `
              radial-gradient(ellipse at 10% 80%, rgba(139,90,43,0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 90% 20%, rgba(139,90,43,0.03) 0%, transparent 50%)
            `,
          }}>
            {renderScreen()}
          </div>

          {/* Leather Tab Bar (Right Side) */}
          <div style={{
            width: '46px', flexShrink: 0,
            background: 'linear-gradient(180deg, #3D1F0A 0%, #2C1810 50%, #1A0D06 100%)',
            display: 'flex', flexDirection: 'column',
            borderLeft: '4px solid #000',
          }}>
            {TABS.map(tab => {
              const isActive = screen === tab.id;
              return (
                <button key={tab.id}
                  onClick={() => setScreen(tab.id)}
                  title={tab.label}
                  style={{
                    flex: 1, border: 'none', cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(to right, #FDFBF7 0%, #f5f0e8 100%)'
                      : 'transparent',
                    color: isActive ? '#000' : '#C9A96E',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: '9px',
                    fontWeight: isActive ? '900' : '400',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    padding: '4px 2px',
                    transition: 'all 0.15s',
                    letterSpacing: '0.06em',
                    position: 'relative',
                    ...ZH,
                  }}>
                  {/* Active indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: '3px', background: '#FFD700',
                    }} />
                  )}
                  {tab.label}
                </button>
              );
            })}
            {/* Setup tab at bottom */}
            <button
              onClick={() => setScreen('SETUP')}
              title="Character Setup"
              style={{
                flexShrink: 0, height: '44px', border: 'none', cursor: 'pointer',
                background: screen === 'SETUP'
                  ? 'linear-gradient(to right, #FDFBF7, #f5f0e8)'
                  : '#FFD700',
                color: screen === 'SETUP' ? '#000' : '#000',
                writingMode: 'vertical-rl',
                fontSize: '9px', fontWeight: '900',
                borderTop: '3px solid #000',
                padding: '4px 2px',
                ...ZH,
              }}>
              {screen === 'SETUP' ? '▶ 設定中' : '⚙ 角色設定'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
