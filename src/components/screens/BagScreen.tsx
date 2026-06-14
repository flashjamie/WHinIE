import React, { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

// ─── Category definitions ─────────────────────────────────────────────────────
interface ItemDef {
  id: string;
  label: string;
  icon: string;
  genderFilter?: 'female'; // only show for female players
}

interface Category {
  id: string;
  label: string;
  color: string;      // identity color for fill animation
  textColor: string;
  items: ItemDef[];
}

const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    label: '⚡ 電器區',
    color: '#F59E0B',
    textColor: '#7C3A00',
    items: [
      { id: 'adapter',     label: '轉接頭',   icon: '🔌' },
      { id: 'extcord',     label: '延長線',   icon: '🔋' },
      { id: 'powerbank',   label: '行動電源', icon: '📱' },
    ],
  },
  {
    id: 'clothing',
    label: '👗 衣物區',
    color: '#8B5CF6',
    textColor: '#3B0764',
    items: [
      { id: 'jacket',      label: '機能防水防風外套', icon: '🧥' },
      { id: 'waterproof',  label: '防水鞋',           icon: '👟' },
      { id: 'heatwear',    label: '發熱衣',           icon: '🧣' },
      { id: 'underwear',   label: '內衣褲',           icon: '👙' },
      { id: 'clothes',     label: '衣服',             icon: '👕' },
      { id: 'pants',       label: '褲子',             icon: '👖' },
    ],
  },
  {
    id: 'medical',
    label: '💊 醫藥區',
    color: '#EF4444',
    textColor: '#7F1D1D',
    items: [
      { id: 'medicine',    label: '常用藥',           icon: '💊' },
      { id: 'glasses',     label: '備用眼鏡',         icon: '👓' },
      { id: 'contacts',    label: '足量隱形眼鏡',     icon: '🔵' },
      { id: 'pads',        label: '衛生棉',           icon: '🩸', genderFilter: 'female' },
      { id: 'tampons',     label: '棉條',             icon: '🌷', genderFilter: 'female' },
    ],
  },
  {
    id: 'daily',
    label: '🧴 生活用品區',
    color: '#10B981',
    textColor: '#064E3B',
    items: [
      { id: 'toiletries',  label: '盥洗用品', icon: '🪥' },
      { id: 'nailclip',    label: '指甲剪',   icon: '✂️' },
      { id: 'handcream',   label: '護手霜',   icon: '🧴' },
      { id: 'skincare',    label: '保養品',   icon: '💆' },
    ],
  },
  {
    id: 'digital',
    label: '💻 數位區',
    color: '#3B82F6',
    textColor: '#1E3A8A',
    items: [
      { id: 'laptop',      label: '筆電',             icon: '💻' },
      { id: 'ipad',        label: 'iPad',             icon: '📱' },
      { id: 'usb',         label: 'USB 配件',         icon: '🔌' },
      { id: 'cloudbkp',    label: '重要文件雲端備份', icon: '☁️' },
    ],
  },
];

// ─── Backpack fill SVG ────────────────────────────────────────────────────────
function BackpackFill({ pct, color }: { pct: number; color: string }) {
  const fillH = pct * 64; // max 64px
  return (
    <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 10, right: 10, pointerEvents: 'none' }}
    >
      {/* Bag outline */}
      <rect x="6" y="18" width="36" height="38" rx="5" stroke="#000" strokeWidth="3" fill="#FDFBF7" />
      {/* Fill level (clipped from bottom) */}
      <clipPath id={`fill-${color.replace('#','')}`}>
        <rect x="6" y={18 + (38 - Math.min(38, fillH * 38 / 64))} width="36" height="38" rx="5" />
      </clipPath>
      <rect x="6" y="18" width="36" height="38" rx="5"
        fill={color} opacity={0.75}
        clipPath={`url(#fill-${color.replace('#','')})`}
        style={{ transition: 'all 0.6s ease' }}
      />
      {/* Straps */}
      <path d="M14 18 Q14 6 20 6 Q26 6 26 12 Q26 18 24 18" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Handle */}
      <path d="M18 6 Q24 2 30 6" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Zipper */}
      <line x1="6" y1="30" x2="42" y2="30" stroke="#555" strokeWidth="1.5" strokeDasharray="3,2" />
      {/* Pocket */}
      <rect x="13" y="38" width="22" height="14" rx="2" stroke="#000" strokeWidth="1.5" fill="none" />
      {/* % label */}
      {pct > 0 && (
        <text x="24" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill={pct > 0.5 ? '#fff' : '#000'}>
          {Math.round(pct * 100)}%
        </text>
      )}
    </svg>
  );
}

// ─── Category Block ───────────────────────────────────────────────────────────
interface CustomItem { id: string; label: string; icon: string }

function CategoryBlock({
  cat,
  gender,
  checked,
  onToggle,
}: {
  cat: Category;
  gender: string;
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [customItems, setCustomItems]   = useState<CustomItem[]>([]);
  const [showInput, setShowInput]       = useState(false);
  const [inputVal, setInputVal]         = useState('');

  const visibleBase   = cat.items.filter(i => !i.genderFilter || i.genderFilter === gender);
  const allItems      = [...visibleBase, ...customItems];
  const checkedCount  = allItems.filter(i => checked.has(i.id)).length;
  const fillPct       = allItems.length > 0 ? checkedCount / allItems.length : 0;
  const allDone       = allItems.length > 0 && checkedCount === allItems.length;

  const addCustom = () => {
    const val = inputVal.trim();
    if (!val) return;
    setCustomItems(prev => [...prev, { id: `custom_${Date.now()}`, label: val, icon: '📦' }]);
    setInputVal('');
    setShowInput(false);
  };

  return (
    <div style={{
      border: `3px solid ${allDone ? cat.color : '#000'}`,
      boxShadow: `4px 4px 0 ${allDone ? cat.color : '#000'}`,
      overflow: 'hidden', position: 'relative',
      transition: 'border-color 0.4s, box-shadow 0.4s',
    }}>
      {/* Category header */}
      <div style={{
        background: allDone ? cat.color : '#000',
        color: allDone ? cat.textColor : '#fff',
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.4s',
      }}>
        <span style={{ fontWeight: 900, fontSize: 12, ...ZH }}>{cat.label}</span>
        <div style={{
          marginLeft: 'auto', background: allDone ? '#fff' : '#FFD700',
          color: '#000', padding: '1px 7px', border: '1.5px solid #000',
          fontSize: 9, fontWeight: 700, ...EN,
        }}>
          {checkedCount}/{allItems.length}
        </div>
        {allDone && (
          <span style={{ fontSize: 10, fontWeight: 900, ...ZH }}>✓ 完成</span>
        )}
      </div>

      {/* Item grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        position: 'relative',
        paddingBottom: allDone ? 0 : 0,
      }}>
        {allItems.map((item, i) => {
          const done = checked.has(item.id);
          return (
            <div key={item.id}
              onClick={() => onToggle(item.id)}
              style={{
                padding: '9px 5px',
                borderRight: i % 4 !== 3 ? '1px solid #e8e4da' : 'none',
                borderBottom: '1px solid #e8e4da',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                cursor: 'pointer',
                background: done
                  ? `${cat.color}22`
                  : '#FDFBF7',
                transition: 'background 0.2s',
                position: 'relative',
              }}>
              {done && (
                <div style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 13, height: 13, background: cat.color, border: '1.5px solid #000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: '#fff', fontWeight: 900,
                }}>✓</div>
              )}
              <span style={{ fontSize: 20, filter: done ? 'none' : 'grayscale(50%)' }}>{item.icon}</span>
              <span style={{
                fontSize: 8, fontWeight: done ? 700 : 400,
                textAlign: 'center', ...ZH,
                textDecoration: done ? 'line-through' : 'none',
                color: done ? '#555' : '#000',
              }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* + 擴充背包 */}
      <div style={{ borderTop: '1.5px dashed #ccc', background: '#f5f0e8' }}>
        {showInput ? (
          <div style={{ display: 'flex', gap: 0, padding: '5px 8px', alignItems: 'center', gap: 5 }}>
            <input
              autoFocus
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') setShowInput(false); }}
              placeholder="輸入物品名稱..."
              style={{
                flex: 1, padding: '4px 8px', border: '2px solid #000',
                background: '#fff', fontSize: 10, outline: 'none', ...ZH,
              }}
            />
            <button onClick={addCustom} style={{
              padding: '4px 10px', border: '2px solid #000', boxShadow: '2px 2px 0 #000',
              background: '#FFD700', fontSize: 9, fontWeight: 900, cursor: 'pointer', ...ZH,
            }}>加入</button>
            <button onClick={() => setShowInput(false)} style={{
              padding: '4px 6px', border: '1.5px solid #ccc',
              background: '#fff', fontSize: 9, cursor: 'pointer', color: '#888',
            }}>✕</button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            style={{
              width: '100%', padding: '5px 12px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 9, fontWeight: 700, color: '#888',
              display: 'flex', alignItems: 'center', gap: 4,
              ...ZH,
            }}>
            ＋ 擴充背包
          </button>
        )}
      </div>

      {/* Backpack fill animation (absolute) */}
      <BackpackFill pct={fillPct} color={cat.color} />
    </div>
  );
}

// ─── Bag Screen Root ──────────────────────────────────────────────────────────
export function BagScreen() {
  const { state } = useGame();
  const gender    = state.player.gender;

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const totalItems = CATEGORIES.reduce((s, c) => {
    const visible = c.items.filter(i => !i.genderFilter || i.genderFilter === gender);
    return s + visible.length;
  }, 0);
  const totalDone = checked.size;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#2C3E50', color: '#fff',
        padding: '8px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 22 }}>🎒</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, ...ZH }}>冒險者背包</div>
          <div style={{ fontSize: 9, color: '#aaa', ...EN }}>PACKING CHECKLIST · 出發前確認清單</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: totalDone === totalItems && totalItems > 0 ? '#00A651' : '#FFD700',
          color: '#000', padding: '3px 10px', border: '2px solid #000',
          fontSize: 11, fontWeight: 700, ...EN,
        }}>
          {totalDone} / {totalItems}
          {totalDone === totalItems && totalItems > 0 && ' ✓'}
        </div>
      </div>

      {/* Global progress bar */}
      <div style={{ height: 8, background: '#e8e4da', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${totalItems > 0 ? (totalDone / totalItems) * 100 : 0}%`,
          background: 'linear-gradient(90deg, #3B82F6, #10B981)',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Category blocks */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CATEGORIES.map(cat => (
          <CategoryBlock
            key={cat.id}
            cat={cat}
            gender={gender}
            checked={checked}
            onToggle={toggleItem}
          />
        ))}

        {/* Tip */}
        <div style={{
          border: '2px dashed #ccc', padding: '8px 12px',
          background: '#FFFACD', fontSize: 9,
          display: 'flex', gap: 6, alignItems: 'flex-start', ...ZH,
        }}>
          <span>💡</span>
          <span>勾選物品後背包圖示會由下往上填色。所有物品勾選完成後，分類格匡變色解鎖 ✓ 完成標章。</span>
        </div>
      </div>
    </div>
  );
}
