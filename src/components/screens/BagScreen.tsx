import React, { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

const C = {
  gold:   '#D4AF37',
  bg:     '#FDFBF7',
  black:  '#111',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface GearItem {
  id:          string;
  label:       string;
  icon:        string;
  note?:       string;
  femaleOnly?: boolean;
}
interface GearCategory {
  id:    string;
  label: string;
  icon:  string;
  color: string;
  tip?:  string;
  items: GearItem[];
}
interface CustomItem { id: string; label: string; catId: string; }

// ─── Gear Data ────────────────────────────────────────────────────────────────
const GEAR: GearCategory[] = [
  {
    id:'docs', label:'證件文件', icon:'📋', color:'#2563EB',
    items:[
      { id:'passport',   label:'護照',               icon:'🛂', note:'剩餘效期須超過 1 年'},
      { id:'authorization',   label:'打工度假簽證正本',icon:'🪪', note:'入境愛爾蘭時移民官會看'},
      { id:'ticket',     label:'每張機票影本&電子檔',      icon:'✈️' },
      { id:'insurance',  label:'一年期保險英文投保證明', icon:'📄'},
      { id:'cash',       label:'外幣現金',       icon:'💶', note:'愛爾蘭大部分都可以刷卡，建議帶€1000-1500以便繳房租即可。' },
      { id:'creditcard', label:'金融卡/高回饋信用卡', icon:'💳', note:'歐洲最普遍、接受度最高的是 Visa 與 Mastercard' },
    ],
  },
  {
    id:'energy', label:'電器區', icon:'⚡', color:'#D4AF37',
    tip:'愛爾蘭插座位置通常很尷尬且少，延長線是救星。電器用品要特別注意電壓，愛爾蘭是220V；台灣是110V！',
    items:[
      { id:'adapter_g',   label:'轉接頭 (英規三腳)', icon:'🔌' },
      { id:'adapter_eu',  label:'轉接頭 (歐規)',          icon:'🔌' },
      { id:'extcord',     label:'延長線',                  icon:'🔌', note:'當地購買也方便' },
      { id:'powerbank',   label:'行動電源',                icon:'🔋' , note:'搭飛機需隨身攜帶'},
      { id:'charger',   label:'3C充電器/線',           icon:'⚡' },
      { id:'lugscale',    label:'行李秤',                  icon:'⚖️' },
      { id:'universal',   label:'萬國插頭',                icon:'🌍' },
    ],
  },
  {
    id:'layer', label:'衣物區', icon:'🧥', color:'#4F7942',
    tip:'愛爾蘭的雨是橫著噴的，機能防水外套比雨傘實用。謎之音：冬天真的很~~冷',
    items:[
      { id:'jacket',       label:'防水防風外套',   icon:'🧥', note:'最重要單品' },
      { id:'down',         label:'羽絨衣/背心',         icon:'🦺' },
      { id:'heatwear',     label:'發熱衣',              icon:'🧣' },
      { id:'sweater',      label:'毛衣',                icon:'🧶' },
      { id:'longsleeve',   label:'長袖',        icon:'👕' },
      { id:'tshirt',       label:'短袖',        icon:'👕' },
      { id:'pants',        label:'褲子',          icon:'👖' },
      { id:'underwear',    label:'內衣褲',       icon:'👙' },
      { id:'disposable_u', label:'免洗內褲',            icon:'🩲', note:'當地較少見，多帶幾件旅行用' },
      { id:'presssocks',   label:'壓力襪',              icon:'🧦', note:'長途飛行必備' },
      { id:'socks',        label:'襪子 (多雙)',         icon:'🧦' , note:'歐洲襪子品質沒有亞洲好'},
      { id:'shoes',        label:'鞋子',       icon:'👟', note:'最好能防水' },
      { id:'beanie',       label:'毛帽',                icon:'🎩' },
      { id:'scarf',        label:'圍巾',                icon:'🧣' },
      { id:'sunglasses',   label:'墨鏡',                icon:'🕶️' },
      { id:'eyeglasses',   label:'備用眼鏡',            icon:'👓' },
      { id:'neckpillow',   label:'頸枕',                icon:'💤', note:'長途飛行必備' },
      { id:'pads',         label:'棉條/衛生棉', icon:'🩸', femaleOnly:true },
    ],
  },
  {
    id:'bio', label:'醫藥區', icon:'💊', color:'#E74C3C',
    tip:'愛爾蘭就診費用昂貴，建議出發前去診所請醫師開一週常備藥（含處方簽）。其餘依個人需求攜帶',
    items:[
      { id:'prescription', label:'診所處方藥 (一週份)',  icon:'💊', note:'感冒/腸胃/過敏/止痛/止瀉' },
      { id:'supplements',  label:'保健食品',              icon:'💊'},
      { id:'motionsick',   label:'暈船/暈車藥',           icon:'💊' },
      { id:'painkill',     label:'痠痛藥布/膏',           icon:'🩹' },
      { id:'firstaid',     label:'醫療包',                icon:'🧰', note:'OK繃＋痘痘貼＋人工皮' },
      { id:'floss',        label:'牙線棒',                icon:'🦷' },
      { id:'qtips',        label:'棉花棒',                icon:'🩺' },
      { id:'contacts',     label:'足量隱形眼鏡',          icon:'👁️' },
      { id:'contactsol',   label:'隱形眼鏡保養液',        icon:'💧', note:'當地賣很貴！建議多帶幾瓶' },
    ],
  },
  {
    id:'daily', label:'生活用品', icon:'🧴', color:'#6C8EBF',
    tip:'愛爾蘭藥妝比台灣貴很多，可依個人習慣、喜好攜帶。盥洗用品建議帶旅行組，供前幾天用就好，到了再買大罐的！。',
    items:[
      { id:'toothbrush',  label:'牙刷',          icon:'🪥' },
      { id:'toothpaste',  label:'小條牙膏',      icon:'🧴' },
      { id:'hairdryer',   label:'吹風機',        icon:'💨', note:'部分宿舍有提供，先確認' },
      { id:'mirror',      label:'隨身鏡',        icon:'🪞' },
      { id:'perfume',     label:'香水',          icon:'🌸' },
      { id:'laundrybag',  label:'洗衣袋',     icon:'🧼' },
      { id:'thermos',     label:'保溫瓶',        icon:'🍵' },
      { id:'wetwipe',     label:'隨身濕紙巾/衛生紙',    icon:'🧻' },
      { id:'ecobag',      label:'帆布包/折疊購物袋', icon:'🛍️' },
      { id:'compressbag', label:'衣物壓縮袋', icon:'🛍️' },
      { id:'comb',        label:'梳子',          icon:'🪮' },
      { id:'hanger',      label:'摺疊衣架',      icon:'🥼' },
      { id:'nailclip',    label:'指甲剪',        icon:'✂️' },
      { id:'lock',        label:'小鎖頭',        icon:'🔒', note:'青旅置物櫃用' },
      { id:'stationery',  label:'文具',          icon:'📎', note:'原子筆/剪刀/美工刀/立可帶' },
      { id:'rubber',      label:'橡皮筋',        icon:'⭕' },
      { id:'towel',       label:'速乾浴巾',      icon:'🏖️' },
      { id:'utensil',     label:'環保餐具',      icon:'🍴' },
      { id:'sunscreen',   label:'防曬乳',        icon:'☀️' },
      { id:'toner',       label:'化妝水',        icon:'💧' },
      { id:'lotion',      label:'乳液',          icon:'🧴' },
      { id:'eyecream',    label:'眼霜',          icon:'👁️' },
      { id:'serum',       label:'精華液',        icon:'✨' },
      { id:'makeup',      label:'化妝品',        icon:'💄' },
      { id:'cottonpad',   label:'化妝棉',        icon:'🌸' },
      { id:'lipbalm',     label:'護唇膏',        icon:'💋' },
      { id:'toiletbag',   label:'盥洗用品',        icon:'🪣' },
    ],
  },
  {
    id:'data', label:'數位區', icon:'💻', color:'#7B5E4F',
    tip:'USB 存好履歷、大頭照和文件掃描檔，圖書館或列印店隨時可能用到。',
    items:[
      { id:'laptop',    label:'筆電',            icon:'💻',note:'選配'},
      { id:'ipad',      label:'iPad',            icon:'📱', note:'選配，可當電子書/娛樂' },
      { id:'airpods',   label:'AirPods/耳機',    icon:'🎧' },
      { id:'phonefilm', label:'手機保護膜',   icon:'📱', note:'當地販售金額較高' },
      { id:'usb',       label:'USB（履歷/文件）', icon:'💾', note:'存電子文件備份' },
      { id:'cloudbkp',  label:'重要文件雲端備份', icon:'☁️' },
    ],
  },
  {
    id:'food', label:'食物補給', icon:'🍜', color:'#B45309',
    tip:'愛爾蘭超市的亞洲食材很有限，建議調味料、湯包、濾掛咖啡從台灣帶足量。',
    items:[
      { id:'soup',    label:'湯包',            icon:'🍲' },
      { id:'tea',     label:'茶包',            icon:'🍵' },
      { id:'spice',   label:'調味料',          icon:'🧂', note:'孜然粉/鹹酥雞粉/十三香較少見' },
      { id:'coffee',  label:'濾掛咖啡',        icon:'☕', note:'當地常見為即溶咖啡' },
      { id:'snacks',  label:'台灣零食', icon:'🍡' },
    ],
  },
];

// ─── Backpack SVG (corner fill indicator) ────────────────────────────────────
function BackpackSVG({ fills }: { fills: Record<string, number> }) {
  const totalPct = Object.values(fills).reduce((s, v) => s + v, 0) / GEAR.length;
  // Accumulate fill layers from bottom
  let cumH = 0;
  const layers = [...GEAR].reverse().map(cat => {
    const pct = fills[cat.id] ?? 0;
    const h   = pct * 44;
    const y   = 64 - cumH - h;
    cumH += h;
    return { ...cat, h, y };
  }).filter(l => l.h > 0);

  return (
    <svg width="52" height="68" viewBox="0 0 56 72" fill="none">
      <rect x="6" y="20" width="44" height="44" rx="6" fill={C.bg} stroke={C.black} strokeWidth="2.5"/>
      <defs>
        <clipPath id="bagclip"><rect x="6" y="20" width="44" height="44" rx="6"/></clipPath>
      </defs>
      <g clipPath="url(#bagclip)">
        {layers.map(l => (
          <rect key={l.id} x="6" y={l.y} width="44" height={l.h}
            fill={l.color} opacity={0.75}
            style={{ transition: 'all 0.5s ease' }}/>
        ))}
      </g>
      <rect x="6" y="20" width="44" height="44" rx="6" fill="none" stroke={C.black} strokeWidth="2.5"/>
      <path d="M18 20 Q18 8 24 8 Q30 8 30 14 Q30 20 28 20" stroke={C.black} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M20 8 Q28 4 36 8" stroke={C.black} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="6" y1="34" x2="50" y2="34" stroke="#555" strokeWidth="1.5" strokeDasharray="3,2"/>
      <rect x="14" y="44" width="28" height="16" rx="3" stroke={C.black} strokeWidth="1.5" fill="none"/>
      {totalPct > 0.05 && (
        <text x="28" y="56" textAnchor="middle" fontSize="7" fontWeight="bold"
          fill={totalPct > 0.5 ? '#fff' : C.black}>
          {Math.round(totalPct * 100)}%
        </text>
      )}
    </svg>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  cat, gender, checked, onToggle, customItems, onAddCustom, onDeleteBuiltin, hiddenBuiltin, defaultOpen,
}: {
  cat:              GearCategory;
  gender:           string;
  checked:          Set<string>;
  onToggle:         (id: string) => void;
  customItems:      CustomItem[];
  onAddCustom:      (label: string, catId: string) => void;
  onDeleteBuiltin:  (id: string) => void;
  hiddenBuiltin:    Set<string>;
  defaultOpen?:     boolean;
}) {
  const [open,    setOpen]    = useState(defaultOpen ?? false);
  const [addOpen, setAddOpen] = useState(false);
  const [inputV,  setInputV]  = useState('');

  const visibleBuiltin = cat.items.filter(i => (!i.femaleOnly || gender === 'female') && !hiddenBuiltin.has(i.id));
  const visibleCustom  = customItems.filter(c => c.catId === cat.id);
  const allVisible     = [...visibleBuiltin.map(i => i.id), ...visibleCustom.map(c => c.id)];
  const doneCount      = allVisible.filter(id => checked.has(id)).length;
  const total          = allVisible.length;
  const pct            = total > 0 ? doneCount / total : 0;
  const allDone        = pct >= 1 && total > 0;

  const submit = () => {
    if (!inputV.trim()) return;
    onAddCustom(inputV.trim(), cat.id);
    setInputV(''); setAddOpen(false);
  };

  return (
    <div style={{
      border: `2.5px solid ${allDone ? cat.color : C.black}`,
      boxShadow: `4px 4px 0 ${allDone ? cat.color : C.black}`,
      overflow: 'hidden',
      background: C.bg,
      transition: 'all 0.3s',
    }}>
      {/* Section header — click to expand/collapse */}
      <div onClick={() => setOpen(o => !o)} style={{
        background: allDone ? cat.color : C.black,
        color: allDone ? C.black : '#fff',
        padding: '9px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', userSelect: 'none',
      }}>
        <span style={{ fontSize: 16 }}>{cat.icon}</span>
        <span style={{ fontWeight: 900, fontSize: 13, ...ZH }}>{cat.label}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {allDone && <span style={{ fontSize: 9, fontWeight: 900, ...ZH }}>✓ 完備</span>}
          <div style={{
            background: allDone ? 'rgba(0,0,0,0.15)' : '#FFD700',
            color: C.black, padding: '1px 8px',
            border: `1.5px solid ${C.black}`,
            fontSize: 9, fontWeight: 900, ...EN,
          }}>{doneCount}/{total}</div>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Collapsed mini progress bar */}
      {!open && (
        <div style={{ height: 3, background: '#ddd' }}>
          <div style={{ height:'100%', width:`${pct*100}%`, background:cat.color, transition:'width 0.4s' }}/>
        </div>
      )}

      {open && <>
      {/* Progress bar */}
      <div style={{ height: 4, background: '#ddd' }}>
        <div style={{
          height: '100%', width: `${pct * 100}%`,
          background: cat.color, transition: 'width 0.4s',
        }}/>
      </div>

      {/* Tip banner */}
      {cat.tip && (
        <div style={{
          background: `${cat.color}15`,
          borderBottom: `1px solid ${cat.color}33`,
          padding: '7px 12px',
          display: 'flex', gap: 6,
        }}>
          <span style={{ fontSize: 12, flexShrink: 0 }}>💡</span>
          <span style={{ fontSize: 9, lineHeight: 1.6, color: '#444', ...ZH }}>{cat.tip}</span>
        </div>
      )}

      {/* Items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {visibleBuiltin.map((item, i) => {
          const done  = checked.has(item.id);
          const isLast4 = i >= Math.floor(visibleBuiltin.length / 4) * 4;
          return (
            <div key={item.id} onClick={() => onToggle(item.id)} style={{
              padding: '10px 4px',
              borderRight:  (i % 4 !== 3) ? '1px solid #e0dcd5' : 'none',
              borderBottom: '1px solid #e0dcd5',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', position: 'relative',
              background: done ? `${cat.color}22` : C.bg,
              transition: 'background 0.2s',
            }}>
              <div
                onClick={e => { e.stopPropagation(); onDeleteBuiltin(item.id); }}
                style={{
                  position: 'absolute', top: 2, left: 3,
                  width: 13, height: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#bbb', cursor: 'pointer', lineHeight: 1,
                  fontWeight: 900,
                }}
                title="刪除此項目"
              >×</div>
              {done && (
                <div style={{
                  position:'absolute', top:3, right:3,
                  width:14, height:14,
                  background: cat.color, border:`1.5px solid ${C.black}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:8, color:'#fff', fontWeight:900,
                }}>✓</div>
              )}
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{
                fontSize: 7.5, fontWeight: done ? 700 : 400,
                textAlign: 'center', lineHeight: 1.3, ...ZH,
                textDecoration: done ? 'line-through' : 'none',
                color: done ? '#888' : C.black,
                wordBreak: 'break-all',
              }}>{item.label}</span>
              {item.note && (
                <span style={{
                  fontSize: 6.5, color: done ? '#aaa' : cat.color,
                  textAlign: 'center', lineHeight: 1.2, ...ZH,
                }}>{item.note}</span>
              )}
            </div>
          );
        })}

        {/* Custom items */}
        {visibleCustom.map((ci, i) => {
          const done = checked.has(ci.id);
          return (
            <div key={ci.id} onClick={() => onToggle(ci.id)} style={{
              padding: '10px 4px',
              borderRight: ((visibleBuiltin.length + i) % 4 !== 3) ? '1px solid #e0dcd5' : 'none',
              borderBottom: '1px solid #e0dcd5',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', position: 'relative',
              background: done ? `${cat.color}22` : '#f8f4ec',
              transition: 'background 0.2s',
            }}>
              {done && (
                <div style={{
                  position:'absolute', top:3, right:3,
                  width:14, height:14,
                  background: cat.color, border:`1.5px solid ${C.black}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:8, color:'#fff', fontWeight:900,
                }}>✓</div>
              )}
              <span style={{ fontSize: 20 }}>📦</span>
              <span style={{
                fontSize: 7.5, textAlign: 'center', lineHeight: 1.3, ...ZH,
                textDecoration: done ? 'line-through' : 'none',
                color: done ? '#888' : C.black,
              }}>{ci.label}</span>
            </div>
          );
        })}
      </div>

      {/* [+] Add custom item */}
      <div style={{ borderTop: '1.5px dashed #ccc', background: '#f8f4ec' }}>
        {addOpen ? (
          <div style={{ display:'flex', gap:5, padding:'7px 10px', alignItems:'center' }}>
            <input
              autoFocus
              value={inputV}
              onChange={e => setInputV(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter') submit(); if (e.key==='Escape') setAddOpen(false); }}
              placeholder="輸入物品名稱..."
              style={{
                flex:1, padding:'5px 8px',
                border:`2px solid ${C.black}`, background:'#fff',
                fontSize:11, outline:'none', ...ZH,
              }}
            />
            <button onClick={submit} style={{
              padding:'5px 10px', border:`2px solid ${C.black}`,
              boxShadow:'2px 2px 0 #111', background: cat.color,
              fontSize:9, fontWeight:900, cursor:'pointer', color: '#fff', ...ZH,
            }}>加入</button>
            <button onClick={() => setAddOpen(false)} style={{
              padding:'5px 7px', border:'1.5px solid #ccc',
              background:'#fff', fontSize:9, cursor:'pointer', color:'#888',
            }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setAddOpen(true)} style={{
            width:'100%', padding:'7px 12px',
            background:'none', border:'none', cursor:'pointer',
            fontSize:9, fontWeight:700, color:'#888',
            display:'flex', alignItems:'center', gap:5, ...ZH,
          }}>
            <span style={{ fontSize:11, color: cat.color }}>＋</span> 擴充背包 — 新增自訂物品
          </button>
        )}
      </div>
      </>}
    </div>
  );
}

// ─── Bag Screen Root ──────────────────────────────────────────────────────────
export function BagScreen() {
  const { state } = useGame();
  const gender = state.player.gender;

  const [checked,       setChecked]       = useState<Set<string>>(new Set());
  const [customItems,   setCustomItems]   = useState<CustomItem[]>([]);
  const [hiddenBuiltin, setHiddenBuiltin] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const addCustom = useCallback((label: string, catId: string) => {
    setCustomItems(p => [...p, { id:`c_${Date.now()}`, label, catId }]);
  }, []);

  const deleteBuiltin = useCallback((id: string) => {
    setHiddenBuiltin(prev => new Set([...prev, id]));
    setChecked(prev => { const next = new Set(prev); next.delete(id); return next; });
  }, []);

  // Compute fills for backpack SVG
  const fills = Object.fromEntries(
    GEAR.map(cat => {
      const visible = cat.items.filter(i => (!i.femaleOnly || gender === 'female') && !hiddenBuiltin.has(i.id));
      const custom  = customItems.filter(c => c.catId === cat.id);
      const all     = [...visible.map(i => i.id), ...custom.map(c => c.id)];
      const done    = all.filter(id => checked.has(id)).length;
      return [cat.id, all.length > 0 ? done / all.length : 0];
    })
  );

  const allIds = [
    ...GEAR.flatMap(cat => cat.items.filter(i => !i.femaleOnly || gender === 'female').map(i => i.id)),
    ...customItems.map(c => c.id),
  ];
  const totalDone = allIds.filter(id => checked.has(id)).length;
  const total     = allIds.length;
  const totalPct  = total > 0 ? totalDone / total : 0;

  return (
    <div style={{ background:'#f0ece0', minHeight:'100%' }}>

      {/* ── Header ── */}
      <div style={{
        position:'sticky', top:0, zIndex:20,
        background:'#2C1A0E', color:'#C9A96E',
        padding:'10px 14px',
        display:'flex', alignItems:'center', gap:10,
      }}>
        <div>
          <div style={{ fontSize:13, fontWeight:900, letterSpacing:'0.08em', ...EN }}>GEAR LAYOUT</div>
          <div style={{ fontSize:9, color:'#8B6239', ...ZH }}>生存背包 · 物料整備系統</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          <div style={{ fontSize:9, color:'#FFD700', fontWeight:900, ...EN }}>
            {totalDone} / {total} ITEMS
          </div>
          <div style={{ width:100, height:5, background:'#333', borderRadius:3, overflow:'hidden' }}>
            <div style={{
              height:'100%', width:`${totalPct * 100}%`,
              background:`linear-gradient(90deg, #4F7942, #D4AF37)`,
              transition:'width 0.4s',
            }}/>
          </div>
        </div>
      </div>

      {/* ── Gear sections ── */}
      <div style={{ padding:12, display:'flex', flexDirection:'column', gap:12, paddingBottom:100 }}>
        {GEAR.map((cat, i) => (
          <SectionCard
            key={cat.id}
            cat={cat}
            gender={gender}
            checked={checked}
            onToggle={toggleItem}
            customItems={customItems}
            onAddCustom={addCustom}
            onDeleteBuiltin={deleteBuiltin}
            hiddenBuiltin={hiddenBuiltin}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {/* ── Floating backpack indicator (bottom-right) ── */}
      <div style={{
        position:'fixed', bottom:20, right:20, zIndex:50,
        background:C.black, border:`2.5px solid ${C.black}`,
        boxShadow:'4px 4px 0 rgba(0,0,0,0.4)',
        padding:'6px 8px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:3,
      }}>
        <BackpackSVG fills={fills} />
        <div style={{
          fontSize:7, color:'#C9A96E', fontWeight:900,
          letterSpacing:'0.08em', ...EN,
        }}>PACK STATUS</div>
      </div>

    </div>
  );
}
