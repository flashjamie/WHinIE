import React, { useState, useCallback, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  green:  '#4F7942',
  brown:  '#7B5E4F',
  gold:   '#D4AF37',
  pink:   '#FF1493',
  bg:     '#FDFBF7',
  black:  '#111',
  border: '2.5px solid #111',
  shadow: '3px 3px 0 #111',
} as const;

// ─── Gear Categories ──────────────────────────────────────────────────────────
interface GearItem { id: string; label: string; icon: string; genderFilter?: 'female' }
interface GearCategory {
  id:    string;
  code:  string;
  label: string;
  color: string;
  tip:   string;
  items: GearItem[];
}

const GEAR: GearCategory[] = [
  {
    id: 'energy', code: 'ENERGY NODE', label: '⚡ 電器區',
    color: C.gold,
    tip: '愛爾蘭旅館插座位置通常很尷尬，延長線是你的救星。Type G 三孔轉接頭是必備，建議備兩顆。',
    items: [
      { id: 'adapter',   label: '轉接頭 (Type G)', icon: '🔌' },
      { id: 'extcord',   label: '延長線 4座',       icon: '🔋' },
      { id: 'powerbank', label: '行動電源',          icon: '📱' },
    ],
  },
  {
    id: 'layer', code: 'LAYERING SYSTEM', label: '🧥 衣物區',
    color: C.green,
    tip: '愛爾蘭的雨是橫著噴的，在這裡沒人在撐傘。機能防水外套比雨傘實用十倍。',
    items: [
      { id: 'jacket',    label: '機能防水防風外套', icon: '🧥' },
      { id: 'waterproof',label: '防水鞋',           icon: '👟' },
      { id: 'heatwear',  label: '發熱衣',           icon: '🧣' },
      { id: 'underwear', label: '內衣褲 (多件)',     icon: '👙', genderFilter: 'female' },
      { id: 'pads',      label: '衛生棉備量',        icon: '🩸', genderFilter: 'female' },
      { id: 'clothes',   label: '衣服 (3~5件)',      icon: '👕' },
      { id: 'pants',     label: '長褲 (2件)',        icon: '👖' },
    ],
  },
  {
    id: 'bio', code: 'BIO-SUPPORT', label: '💊 醫藥區',
    color: C.pink,
    tip: '配眼鏡在愛爾蘭非常昂貴，建議帶兩副備用。常備藥品也要帶夠，台灣藥便宜效果好。',
    items: [
      { id: 'medicine', label: '常用藥品',     icon: '💊' },
      { id: 'glasses',  label: '備用眼鏡 ×2', icon: '👓' },
      { id: 'contacts', label: '足量隱形眼鏡', icon: '🔵' },
    ],
  },
  {
    id: 'data', code: 'DATA ARCHIVE', label: '💻 數位區',
    color: C.brown,
    tip: '圖書館或列印店隨時可能需要實體載具，USB 存好履歷、大頭照和文件掃描檔。',
    items: [
      { id: 'laptop',   label: '筆電',             icon: '💻' },
      { id: 'usb',      label: 'USB（履歷/文件）',  icon: '💾' },
      { id: 'cloudbkp', label: '重要文件雲端備份',  icon: '☁️' },
      { id: 'ipad',     label: 'iPad（選配）',      icon: '📱' },
    ],
  },
  {
    id: 'daily', code: 'DAILY SUPPLY', label: '🧴 生活用品',
    color: '#6C8EBF',
    tip: '愛爾蘭藥妝比台灣貴很多，常用保養品和個人盥洗用具建議從台灣帶充足量。',
    items: [
      { id: 'toiletries', label: '盥洗用品',   icon: '🪥' },
      { id: 'nailclip',   label: '指甲剪',     icon: '✂️' },
      { id: 'handcream',  label: '護手霜',     icon: '🧴' },
      { id: 'skincare',   label: '保養品備量', icon: '💆' },
    ],
  },
];

// ─── Backpack SVG ─────────────────────────────────────────────────────────────
function BackpackSVG({ fills }: { fills: Record<string, number> }) {
  // fills: { energy: 0~1, layer: 0~1, bio: 0~1, data: 0~1, daily: 0~1 }
  const totalPct = Object.values(fills).reduce((s, v) => s + v, 0) / GEAR.length;

  const segments = GEAR.map((cat, i) => {
    const segH  = fills[cat.id] * 28;
    const y     = 44 - (GEAR.slice(0, i + 1).reduce((s, c) => s + fills[c.id] * 28, 0));
    return { color: cat.color, h: segH, y };
  }).filter(s => s.h > 0);

  return (
    <div style={{ position: 'relative', width: 56, height: 72 }}>
      <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bag body */}
        <rect x="6" y="20" width="44" height="44" rx="6" fill={C.bg} stroke={C.black} strokeWidth="2.5" />
        {/* Fills */}
        {GEAR.map((cat) => {
          const pct = fills[cat.id] ?? 0;
          if (pct <= 0) return null;
          const fillH = pct * 44;
          return (
            <rect key={cat.id}
              x="6" y={64 - fillH} width="44" height={fillH}
              rx="0" fill={cat.color} opacity={0.7}
              style={{ transition: 'all 0.5s ease', clipPath: 'inset(0 0 0 0 round 0 0 6px 6px)' }}
            />
          );
        })}
        {/* Body border on top */}
        <rect x="6" y="20" width="44" height="44" rx="6" fill="none" stroke={C.black} strokeWidth="2.5" />
        {/* Strap */}
        <path d="M18 20 Q18 8 24 8 Q30 8 30 14 Q30 20 28 20" stroke={C.black} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Handle */}
        <path d="M20 8 Q28 4 36 8" stroke={C.black} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Zipper */}
        <line x1="6" y1="34" x2="50" y2="34" stroke="#555" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Front pocket */}
        <rect x="14" y="44" width="28" height="16" rx="3" stroke={C.black} strokeWidth="1.5" fill="none" />
        {/* % label */}
        {totalPct > 0 && (
          <text x="28" y="56" textAnchor="middle" fontSize="7" fontWeight="bold"
            fill={totalPct > 0.5 ? '#fff' : C.black}>
            {Math.round(totalPct * 100)}%
          </text>
        )}
      </svg>
    </div>
  );
}

// ─── Gear Modal ───────────────────────────────────────────────────────────────
function GearModal({
  gender,
  checked,
  onToggle,
  onClose,
}: {
  gender: string;
  checked: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const fills = Object.fromEntries(
    GEAR.map(cat => {
      const visible = cat.items.filter(i => !i.genderFilter || i.genderFilter === gender);
      const done    = visible.filter(i => checked.has(i.id)).length;
      return [cat.id, visible.length > 0 ? done / visible.length : 0];
    })
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(3px)',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxHeight: '90vh',
        background: C.bg,
        border: `3px solid ${C.black}`,
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div style={{
          background: C.black, color: C.gold,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          flexShrink: 0,
        }}>
          <BackpackSVG fills={fills} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.08em', ...EN }}>
              GEAR LAYOUT
            </div>
            <div style={{ fontSize: 10, color: '#C9A96E', ...ZH }}>
              生存背包 · 物料整備系統
            </div>
            <div style={{ marginTop: 4, height: 5, background: '#333', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Object.values(fills).reduce((s, v) => s + v, 0) / GEAR.length * 100}%`,
                background: `linear-gradient(90deg, ${C.green}, ${C.gold})`,
                transition: 'width 0.4s',
              }} />
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.gold,
            fontSize: 20, cursor: 'pointer', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Category tabs */}
        <div style={{
          display: 'flex', overflowX: 'auto', gap: 0,
          background: '#1a1a1a', flexShrink: 0,
          borderBottom: `2px solid ${C.black}`,
        }}>
          {GEAR.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              style={{
                flex: '0 0 auto', padding: '8px 12px',
                border: 'none', borderBottom: activeCat === cat.id ? `3px solid ${cat.color}` : '3px solid transparent',
                background: 'none',
                color: activeCat === cat.id ? cat.color : '#888',
                fontSize: 9, fontWeight: 900,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                letterSpacing: '0.05em', ...EN,
              }}>
              {cat.code}
              <div style={{
                width: '100%', height: 3, marginTop: 2,
                background: cat.color, opacity: fills[cat.id],
                transition: 'opacity 0.3s',
              }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GEAR.map(cat => {
            const visible = cat.items.filter(i => !i.genderFilter || i.genderFilter === gender);
            const done    = visible.filter(i => checked.has(i.id)).length;
            const isOpen  = activeCat === cat.id || activeCat === null;
            return (
              <div key={cat.id} style={{
                border: `2.5px solid ${done === visible.length && visible.length > 0 ? cat.color : C.black}`,
                boxShadow: `3px 3px 0 ${done === visible.length && visible.length > 0 ? cat.color : C.black}`,
                background: C.bg,
                transition: 'all 0.3s',
                overflow: 'hidden',
              }}>
                {/* Cat header */}
                <div
                  onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                  style={{
                    background: done === visible.length && visible.length > 0 ? cat.color : C.black,
                    color: done === visible.length && visible.length > 0 ? C.black : '#fff',
                    padding: '8px 12px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer',
                  }}>
                  <span style={{ fontWeight: 900, fontSize: 12, ...ZH }}>{cat.label}</span>
                  <span style={{
                    fontSize: 8, ...EN, letterSpacing: '0.08em',
                    color: done === visible.length && visible.length > 0 ? 'rgba(0,0,0,0.6)' : '#888',
                  }}>{cat.code}</span>
                  <div style={{
                    marginLeft: 'auto', background: '#FFD700', color: C.black,
                    padding: '1px 8px', border: `1.5px solid ${C.black}`,
                    fontSize: 9, fontWeight: 700, ...EN,
                  }}>{done}/{visible.length}</div>
                  {done === visible.length && visible.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 900, ...ZH }}>✓ DONE</span>
                  )}
                </div>

                {/* Tip banner */}
                <div style={{
                  background: `${cat.color}18`,
                  borderBottom: `1px solid ${cat.color}44`,
                  padding: '7px 12px',
                  display: 'flex', gap: 6, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>💡</span>
                  <span style={{ fontSize: 9, lineHeight: 1.5, color: '#444', ...ZH }}>{cat.tip}</span>
                </div>

                {/* Items grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                }}>
                  {visible.map((item, i) => {
                    const isDone = checked.has(item.id);
                    return (
                      <div key={item.id}
                        onClick={() => onToggle(item.id)}
                        style={{
                          padding: '10px 5px',
                          borderRight: i % 4 !== 3 ? '1px solid #e0dcd5' : 'none',
                          borderBottom: '1px solid #e0dcd5',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          cursor: 'pointer', position: 'relative',
                          background: isDone ? `${cat.color}22` : C.bg,
                          transition: 'background 0.2s',
                        }}>
                        {isDone && (
                          <div style={{
                            position: 'absolute', top: 3, right: 3,
                            width: 14, height: 14, background: cat.color,
                            border: `1.5px solid ${C.black}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: '#fff', fontWeight: 900,
                          }}>✓</div>
                        )}
                        <span style={{ fontSize: 22, filter: isDone ? 'none' : 'grayscale(40%)' }}>{item.icon}</span>
                        <span style={{
                          fontSize: 8, fontWeight: isDone ? 700 : 400,
                          textAlign: 'center', ...ZH,
                          textDecoration: isDone ? 'line-through' : 'none',
                          color: isDone ? '#666' : C.black,
                        }}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Character Init Modal ─────────────────────────────────────────────────────
const HAIR_STYLES   = ['短髮', '中長髮', '長直髮', '捲髮', '丸子頭', '馬尾'];
const HAIR_COLORS   = ['黑色', '深棕', '亞麻', '奶茶棕', '霧灰', '染色'];
const OUTFIT_STYLES = [
  { id:'techwear', label:'⚡ 機能', desc:'防水防風 · 功能至上' },
  { id:'vintage',  label:'🕰 古著', desc:'復古風格 · 獨樹一格' },
  { id:'urban',    label:'🏙 城市', desc:'都市輕量 · 日常通勤' },
];

interface CharProfile {
  hairStyle:   string;
  hairColor:   string;
  outfitStyle: string;
}

function CharInitModal({
  name, gender, onConfirm,
}: {
  name: string; gender: string; onConfirm: (p: CharProfile) => void;
}) {
  const [hairStyle,   setHairStyle]   = useState(HAIR_STYLES[0]);
  const [hairColor,   setHairColor]   = useState(HAIR_COLORS[0]);
  const [outfitStyle, setOutfitStyle] = useState('techwear');

  const avatar = gender === 'female' ? '🧙‍♀️' : '🧙';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 600,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: C.bg,
        border: `3px solid ${C.black}`,
        boxShadow: `8px 8px 0 ${C.black}`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        maxHeight: '85vh',
      }}>
        {/* Header */}
        <div style={{
          background: C.black, color: C.gold,
          padding: '12px 16px',
          borderBottom: `3px solid ${C.black}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.08em', ...EN }}>
            CHARACTER INITIALIZER
          </div>
          <div style={{ fontSize: 9, color: '#aaa', marginTop: 2, ...ZH }}>
            裝備你的冒險者外觀，踏上愛爾蘭之旅
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Player preview */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px',
            border: `2px solid ${C.black}`,
            background: '#f5f0e8',
          }}>
            <span style={{ fontSize: 40 }}>{avatar}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, ...ZH }}>{name || '冒險者'}</div>
              <div style={{
                display: 'inline-block', marginTop: 3,
                padding: '1px 8px', fontSize: 9, fontWeight: 700,
                background: gender === 'female' ? '#FF69B4' : '#1E90FF',
                color: '#fff', border: `1.5px solid ${C.black}`,
                ...ZH,
              }}>
                {gender === 'female' ? '女 ♀' : '男 ♂'}
              </div>
            </div>
          </div>

          {/* Hair style */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, marginBottom: 6, letterSpacing: '0.08em', ...EN }}>
              HAIR STYLE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HAIR_STYLES.map(h => (
                <button key={h} onClick={() => setHairStyle(h)} style={{
                  padding: '5px 10px',
                  border: `2px solid ${C.black}`,
                  boxShadow: hairStyle === h ? 'none' : C.shadow,
                  transform: hairStyle === h ? 'translate(3px,3px)' : 'none',
                  background: hairStyle === h ? C.black : C.bg,
                  color: hairStyle === h ? C.gold : C.black,
                  fontWeight: 700, fontSize: 10, cursor: 'pointer',
                  transition: 'all 0.1s', ...ZH,
                }}>{h}</button>
              ))}
            </div>
          </div>

          {/* Hair color */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, marginBottom: 6, letterSpacing: '0.08em', ...EN }}>
              HAIR COLOR
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => setHairColor(c)} style={{
                  padding: '5px 10px',
                  border: `2px solid ${C.black}`,
                  boxShadow: hairColor === c ? 'none' : C.shadow,
                  transform: hairColor === c ? 'translate(3px,3px)' : 'none',
                  background: hairColor === c ? C.brown : C.bg,
                  color: hairColor === c ? '#fff' : C.black,
                  fontWeight: 700, fontSize: 10, cursor: 'pointer',
                  transition: 'all 0.1s', ...ZH,
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Outfit style */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 900, marginBottom: 6, letterSpacing: '0.08em', ...EN }}>
              OUTFIT STYLE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OUTFIT_STYLES.map(o => (
                <button key={o.id} onClick={() => setOutfitStyle(o.id)} style={{
                  padding: '10px 14px',
                  border: `2.5px solid ${C.black}`,
                  boxShadow: outfitStyle === o.id ? 'none' : C.shadow,
                  transform: outfitStyle === o.id ? 'translate(3px,3px)' : 'none',
                  background: outfitStyle === o.id ? C.green : C.bg,
                  color: outfitStyle === o.id ? '#fff' : C.black,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.12s',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 900, ...ZH }}>{o.label}</span>
                  <span style={{ fontSize: 9, opacity: 0.8, ...ZH }}>{o.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ padding: '12px 16px', borderTop: `2px solid ${C.black}`, flexShrink: 0 }}>
          <button
            onClick={() => onConfirm({ hairStyle, hairColor, outfitStyle })}
            style={{
              width: '100%', padding: 13,
              background: C.green, border: `3px solid ${C.black}`,
              boxShadow: `6px 6px 0 ${C.black}`,
              color: '#fff', fontSize: 14, fontWeight: 900,
              cursor: 'pointer', letterSpacing: '0.06em',
              transition: 'all 0.1s', ...ZH,
            }}
            onMouseDown={e => { e.currentTarget.style.transform='translate(5px,5px)'; e.currentTarget.style.boxShadow='none'; }}
            onMouseUp={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`6px 6px 0 ${C.black}`; }}
          >
            ☘ 啟動冒險
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Player Panel ─────────────────────────────────────────────────────────────
function PlayerPanel({ name, gender, profile, totalDone, total }: {
  name: string; gender: string;
  profile: CharProfile;
  totalDone: number; total: number;
}) {
  const pct = total > 0 ? totalDone / total : 0;
  const outfit = OUTFIT_STYLES.find(o => o.id === profile.outfitStyle);
  const avatar = gender === 'female' ? '🧙‍♀️' : '🧙';

  return (
    <div style={{
      flexShrink: 0,
      background: C.black,
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 44, height: 44, flexShrink: 0,
        border: `2.5px solid ${C.gold}`,
        background: '#1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
      }}>{avatar}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', ...ZH }}>{name || '冒險者'}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
          <span style={{
            padding: '1px 6px', fontSize: 8, fontWeight: 700,
            background: C.brown, color: '#fff',
            border: `1px solid ${C.gold}`, ...ZH,
          }}>{profile.hairColor} {profile.hairStyle}</span>
          <span style={{
            padding: '1px 6px', fontSize: 8, fontWeight: 700,
            background: C.green, color: '#fff',
            border: `1px solid ${C.gold}`, ...ZH,
          }}>{outfit?.label}</span>
        </div>
        {/* XP bar */}
        <div style={{ marginTop: 5, height: 4, background: '#333', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct * 100}%`,
            background: pct >= 1
              ? `linear-gradient(90deg, ${C.green}, ${C.gold})`
              : `linear-gradient(90deg, ${C.gold}, ${C.pink})`,
            transition: 'width 0.4s',
          }} />
        </div>
      </div>

      <div style={{
        background: pct >= 1 ? C.green : C.gold,
        color: C.black, padding: '4px 10px',
        border: `2px solid ${C.gold}`,
        fontSize: 10, fontWeight: 900, flexShrink: 0, ...EN,
      }}>
        {totalDone}/{total}
      </div>
    </div>
  );
}

// ─── Bag Screen Root ──────────────────────────────────────────────────────────
export function BagScreen() {
  const { state } = useGame();
  const { player } = state;

  const [profile,     setProfile]     = useState<CharProfile | null>(null);
  const [checked,     setChecked]     = useState<Set<string>>(new Set());
  const [showGear,    setShowGear]    = useState(false);
  const [customItems, setCustomItems] = useState<Array<{ id: string; label: string }>>([]);
  const [inputVal,    setInputVal]    = useState('');
  const [showInput,   setShowInput]   = useState(false);

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Flat list of all visible items
  const allItems = [
    ...GEAR.flatMap(cat => cat.items.filter(i => !i.genderFilter || i.genderFilter === player.gender)),
    ...customItems,
  ];
  const totalDone = allItems.filter(i => checked.has(i.id)).length;
  const total     = allItems.length;

  const addCustom = () => {
    if (!inputVal.trim()) return;
    setCustomItems(p => [...p, { id: `c_${Date.now()}`, label: inputVal.trim() }]);
    setInputVal('');
    setShowInput(false);
  };

  // Show character init on first visit
  if (!profile) {
    return (
      <CharInitModal
        name={player.name}
        gender={player.gender}
        onConfirm={setProfile}
      />
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>

      {showGear && (
        <GearModal
          gender={player.gender}
          checked={checked}
          onToggle={toggleItem}
          onClose={() => setShowGear(false)}
        />
      )}

      {/* Player Panel */}
      <PlayerPanel
        name={player.name}
        gender={player.gender}
        profile={profile}
        totalDone={totalDone}
        total={total}
      />

      {/* Global progress bar */}
      <div style={{ height: 6, background: '#e0dcd5', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${total > 0 ? (totalDone / total) * 100 : 0}%`,
          background: `linear-gradient(90deg, ${C.green}, ${C.gold})`,
          transition: 'width 0.4s',
        }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ── GEAR CARD ── */}
        <div
          onClick={() => setShowGear(true)}
          style={{
            border: `2.5px solid ${C.black}`,
            boxShadow: `4px 4px 0 ${C.black}`,
            background: C.black,
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'all 0.1s',
          }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(3px,3px)'; e.currentTarget.style.boxShadow='none'; }}
          onMouseUp={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`4px 4px 0 ${C.black}`; }}
        >
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <BackpackSVG fills={Object.fromEntries(GEAR.map(cat => {
              const visible = cat.items.filter(i => !i.genderFilter || i.genderFilter === player.gender);
              const done = visible.filter(i => checked.has(i.id)).length;
              return [cat.id, visible.length > 0 ? done / visible.length : 0];
            }))} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: C.gold, letterSpacing: '0.12em', ...EN }}>
                SURVIVAL PACK
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginTop: 2, ...ZH }}>
                生存背包 · 物料整備
              </div>
              <div style={{ fontSize: 9, color: '#888', marginTop: 3, ...ZH }}>
                {totalDone} / {total} 項完成 · 點擊展開裝備清單
              </div>
            </div>
            <div style={{
              background: C.gold, color: C.black,
              padding: '4px 10px', border: `2px solid ${C.gold}`,
              fontSize: 10, fontWeight: 900, ...EN,
            }}>OPEN →</div>
          </div>
          {/* Mini category fill bars */}
          <div style={{ display: 'flex', height: 4 }}>
            {GEAR.map(cat => {
              const visible = cat.items.filter(i => !i.genderFilter || i.genderFilter === player.gender);
              const done    = visible.filter(i => checked.has(i.id)).length;
              const pct     = visible.length > 0 ? done / visible.length : 0;
              return (
                <div key={cat.id} style={{ flex: 1, background: '#222', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', inset: 0, transformOrigin: 'left',
                    background: cat.color,
                    transform: `scaleX(${pct})`,
                    transition: 'transform 0.4s',
                  }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── QUICK CHECKLIST (flat list of all items) ── */}
        <div style={{
          border: C.border,
          boxShadow: C.shadow,
          overflow: 'hidden',
        }}>
          <div style={{
            background: C.green, color: '#fff',
            padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontWeight: 900, fontSize: 12, ...ZH }}>📋 快速核對清單</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, ...EN }}>{totalDone}/{total}</span>
          </div>

          {GEAR.map(cat => (
            <div key={cat.id}>
              <div style={{
                padding: '5px 12px',
                background: `${cat.color}22`,
                borderTop: `1px solid ${cat.color}44`,
                borderBottom: `1px solid ${cat.color}44`,
                fontSize: 9, fontWeight: 900, color: cat.color,
                letterSpacing: '0.06em', ...EN,
              }}>{cat.code}</div>
              {cat.items
                .filter(i => !i.genderFilter || i.genderFilter === player.gender)
                .map(item => {
                  const done = checked.has(item.id);
                  return (
                    <div key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid #e8e4da',
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer',
                        background: done ? `${cat.color}15` : C.bg,
                        transition: 'background 0.15s',
                      }}>
                      <div style={{
                        width: 18, height: 18, border: `2px solid ${C.black}`, flexShrink: 0,
                        background: done ? cat.color : C.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span style={{
                        fontSize: 12, flex: 1, ...ZH,
                        textDecoration: done ? 'line-through' : 'none',
                        color: done ? '#999' : C.black,
                      }}>{item.label}</span>
                    </div>
                  );
                })}
            </div>
          ))}

          {/* Custom items */}
          {customItems.map(item => {
            const done = checked.has(item.id);
            return (
              <div key={item.id}
                onClick={() => toggleItem(item.id)}
                style={{
                  padding: '8px 12px', borderBottom: '1px solid #e8e4da',
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  background: done ? `${C.pink}18` : C.bg,
                }}>
                <div style={{
                  width: 18, height: 18, border: `2px solid ${C.black}`, flexShrink: 0,
                  background: done ? C.pink : C.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 16 }}>📦</span>
                <span style={{
                  fontSize: 12, flex: 1, ...ZH,
                  textDecoration: done ? 'line-through' : 'none',
                  color: done ? '#999' : C.black,
                }}>{item.label}</span>
              </div>
            );
          })}

          {/* Add custom item */}
          <div style={{ borderTop: '1.5px dashed #ccc', background: '#f8f4ec' }}>
            {showInput ? (
              <div style={{ display: 'flex', gap: 5, padding: '7px 10px', alignItems: 'center' }}>
                <input
                  autoFocus
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') setShowInput(false); }}
                  placeholder="新增自訂物品..."
                  style={{
                    flex: 1, padding: '5px 8px',
                    border: `2px solid ${C.black}`, background: '#fff',
                    fontSize: 11, outline: 'none', ...ZH,
                  }}
                />
                <button onClick={addCustom} style={{
                  padding: '5px 10px', border: `2px solid ${C.black}`,
                  boxShadow: C.shadow, background: C.gold,
                  fontSize: 9, fontWeight: 900, cursor: 'pointer', ...ZH,
                }}>加入</button>
                <button onClick={() => setShowInput(false)} style={{
                  padding: '5px 7px', border: `1.5px solid #ccc`,
                  background: '#fff', fontSize: 9, cursor: 'pointer', color: '#888',
                }}>✕</button>
              </div>
            ) : (
              <button onClick={() => setShowInput(true)} style={{
                width: '100%', padding: '7px 12px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 9, fontWeight: 700, color: '#888',
                display: 'flex', alignItems: 'center', gap: 5, ...ZH,
              }}>＋ 自訂物品</button>
            )}
          </div>
        </div>

        {/* Tip */}
        <div style={{
          border: `2px dashed ${C.green}`,
          padding: '10px 12px',
          background: `${C.green}10`,
          fontSize: 9, display: 'flex', gap: 7, ...ZH,
        }}>
          <span>☘️</span>
          <span>勾選物品後，背包圖示會由下往上以區塊顏色填色。點擊【生存背包】卡片可查看各分區機能叮嚀。</span>
        </div>
      </div>
    </div>
  );
}
