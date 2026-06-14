import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

// ─── Types ────────────────────────────────────────────────────────────────────
type Condition      = '全新' | '二手';
type DeliveryMethod = '面交' | '線上' | '寄存';
type ThriftCategory = '電器' | '衣物' | '醫藥' | '生活用品' | '數位' | '其他';

interface ThriftItem {
  id:             string;
  category:       ThriftCategory;
  name:           string;
  price:          number;        // EUR
  images:         string[];      // data URLs / object URLs, 1–5
  condition:      Condition;
  deliveryMethod: DeliveryMethod;
  location:       string;
  contact:        string;
  sellerId:       string;
  isSold:         boolean;
}

const CAT_ICON: Record<ThriftCategory, string> = {
  電器:'⚡', 衣物:'👗', 醫藥:'💊', 生活用品:'🧴', 數位:'💻', 其他:'📦',
};
const DELIVERY_ICON: Record<DeliveryMethod, string> = {
  面交:'🤝', 線上:'📦', 寄存:'🗃️',
};

// ─── Seed listings ────────────────────────────────────────────────────────────
const SEED: ThriftItem[] = [
  {
    id:'s1', category:'電器', name:'英式三腳轉接頭 ×3（全新未拆）',
    price:8, images:[], condition:'全新', deliveryMethod:'線上',
    location:'Dublin 1', contact:'WhatsApp +353 87 xxx xxxx',
    sellerId:'senior_1', isSold:false,
  },
  {
    id:'s2', category:'衣物', name:'Columbia 防水外套 L號（穿過兩次）',
    price:35, images:[], condition:'二手', deliveryMethod:'面交',
    location:'Cork City Centre', contact:'Line: cork_tw_girl',
    sellerId:'senior_2', isSold:false,
  },
  {
    id:'s3', category:'數位', name:'iPad mini 6 Wi-Fi 64GB（含保護殼）',
    price:280, images:[], condition:'二手', deliveryMethod:'面交',
    location:'Galway', contact:'IG: @galway_tw_life',
    sellerId:'senior_3', isSold:false,
  },
  {
    id:'s4', category:'生活用品', name:'日系護手霜全套組（4入）',
    price:12, images:[], condition:'全新', deliveryMethod:'線上',
    location:'Limerick', contact:'WhatsApp +353 85 xxx xxxx',
    sellerId:'senior_4', isSold:false,
  },
  {
    id:'s5', category:'衣物', name:'Nike 防風薄外套 M號',
    price:22, images:[], condition:'二手', deliveryMethod:'寄存',
    location:'Dublin 2 (行李箱寄存)', contact:'Line: tw_nike_seller',
    sellerId:'senior_5', isSold:false,
  },
  {
    id:'s6', category:'電器', name:'延長線 4插座（英規）附保護蓋',
    price:15, images:[], condition:'全新', deliveryMethod:'線上',
    location:'Waterford', contact:'WhatsApp +353 89 xxx xxxx',
    sellerId:'senior_6', isSold:false,
  },
];

// ─── Image slot component ─────────────────────────────────────────────────────
function ImageSlots({
  images, onChange,
}: { images: string[]; onChange: (imgs: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    Promise.all(toAdd.map(f => new Promise<string>(res => {
      const r = new FileReader();
      r.onload = ev => res(ev.target?.result as string);
      r.readAsDataURL(f);
    }))).then(urls => onChange([...images, ...urls]));
    e.target.value = '';
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:9, fontWeight:900, ...ZH }}>📷 商品照片</span>
        <span style={{
          fontSize:8, fontWeight:700, ...EN,
          color: images.length >= 5 ? '#E74C3C' : '#888',
        }}>已上傳: {images.length}/5</span>
      </div>
      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
        {images.map((src, i) => (
          <div key={i} style={{ position:'relative', width:52, height:52 }}>
            <img src={src} style={{ width:52, height:52, objectFit:'cover',
              border:'2px solid #000' }} alt="" />
            <button onClick={() => remove(i)} style={{
              position:'absolute', top:-4, right:-4,
              width:16, height:16, borderRadius:'50%',
              background:'#E74C3C', border:'1.5px solid #fff',
              color:'#fff', fontSize:9, fontWeight:900, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>×</button>
          </div>
        ))}
        {images.length < 5 && (
          <button onClick={() => inputRef.current?.click()} style={{
            width:52, height:52,
            border:'2.5px dashed #000', background:'#f5f0e6',
            cursor:'pointer', fontSize:20, display:'flex',
            alignItems:'center', justifyContent:'center',
          }}>＋</button>
        )}
        <input ref={inputRef} type="file" accept="image/*" multiple
          style={{ display:'none' }} onChange={handleFile} />
      </div>
      {images.length === 0 && (
        <div style={{ fontSize:8, color:'#E74C3C', marginTop:3, ...ZH }}>
          ✗ 最少需上傳 1 張照片
        </div>
      )}
    </div>
  );
}

// ─── Seller Form ──────────────────────────────────────────────────────────────
function SellerForm({ onSubmit, onBack }: {
  onSubmit: (item: Omit<ThriftItem,'id'|'isSold'|'sellerId'>) => void;
  onBack: () => void;
}) {
  const { state } = useGame();
  const [category,  setCategory]  = useState<ThriftCategory>('電器');
  const [name,      setName]      = useState('');
  const [price,     setPrice]     = useState('');
  const [images,    setImages]    = useState<string[]>([]);
  const [condition, setCondition] = useState<Condition>('全新');
  const [delivery,  setDelivery]  = useState<DeliveryMethod>('面交');
  const [location,  setLocation]  = useState('');
  const [contact,   setContact]   = useState('');
  const [error,     setError]     = useState('');

  const submit = () => {
    if (!name.trim())         { setError('請填寫商品名稱'); return; }
    if (!price || +price <= 0){ setError('請填寫有效價格'); return; }
    if (images.length === 0)  { setError('請至少上傳 1 張照片'); return; }
    if (!location.trim())     { setError('請填寫交易地點'); return; }
    if (!contact.trim())      { setError('請填寫聯繫方式'); return; }
    setError('');
    onSubmit({ category, name: name.trim(), price: +price, images,
      condition, deliveryMethod: delivery,
      location: location.trim(), contact: contact.trim() });
  };

  const inputSt: React.CSSProperties = {
    width:'100%', padding:'7px 10px',
    border:'2.5px solid #000', boxShadow:'2px 2px 0 #000',
    background:'#FDFBF7', fontSize:12, outline:'none', ...ZH,
  };
  const labelSt: React.CSSProperties = {
    fontSize:9, fontWeight:900, marginBottom:3,
    display:'block', letterSpacing:'0.06em', ...ZH,
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink:0, background:'#000', color:'#FFD700',
        padding:'8px 14px', borderBottom:'3px solid #000',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <button onClick={onBack} style={{
          background:'none', border:'none', color:'#FFD700',
          fontSize:14, cursor:'pointer', fontWeight:900,
        }}>↩</button>
        <span style={{ fontSize:13, fontWeight:900, ...ZH }}>📦 賣家上架台</span>
        <span style={{ marginLeft:'auto', fontSize:9, color:'#aaa', ...ZH }}>
          {state.player.name || '賣家'}
        </span>
      </div>

      {/* Form */}
      <div style={{ flex:1, overflowY:'auto', padding:'10px 14px', display:'flex', flexDirection:'column', gap:10 }}>

        {/* Category */}
        <div>
          <label style={labelSt}>📂 商品類別</label>
          <select value={category} onChange={e => setCategory(e.target.value as ThriftCategory)}
            style={{ ...inputSt }}>
            {(Object.keys(CAT_ICON) as ThriftCategory[]).map(c => (
              <option key={c} value={c}>{CAT_ICON[c]} {c}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label style={labelSt}>🏷 商品名稱</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="請描述你的出清寶物..."
            style={{ ...inputSt, fontWeight:700 }} />
        </div>

        {/* Price */}
        <div>
          <label style={labelSt}>💶 販售價錢 (EUR)</label>
          <div style={{ position:'relative' }}>
            <input type="number" min="0" step="0.5"
              value={price} onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              style={{ ...inputSt, paddingRight:28, ...EN }} />
            <span style={{
              position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
              fontSize:13, fontWeight:900, color:'#555',
            }}>€</span>
          </div>
        </div>

        {/* Images */}
        <div style={{
          border:'2.5px solid #000', boxShadow:'2px 2px 0 #000',
          padding:9, background:'#f5f0e6',
        }}>
          <ImageSlots images={images} onChange={setImages} />
        </div>

        {/* Condition */}
        <div>
          <label style={labelSt}>🔍 商品使用狀況</label>
          <div style={{ display:'flex', gap:8 }}>
            {(['全新','二手'] as Condition[]).map(c => (
              <button key={c} onClick={() => setCondition(c)} style={{
                flex:1, padding:'8px 0',
                border:'2.5px solid #000',
                boxShadow: condition===c ? 'none' : '3px 3px 0 #000',
                transform: condition===c ? 'translate(2px,2px)' : 'none',
                background: condition===c ? '#000' : '#FDFBF7',
                color: condition===c ? '#FFD700' : '#000',
                fontWeight:900, fontSize:12, cursor:'pointer',
                transition:'all 0.1s', ...ZH,
              }}>{condition===c ? '✓ ' : ''}{c}</button>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div>
          <label style={labelSt}>🚚 交易方式</label>
          <div style={{ display:'flex', gap:6 }}>
            {(['面交','線上','寄存'] as DeliveryMethod[]).map(d => (
              <button key={d} onClick={() => setDelivery(d)} style={{
                flex:1, padding:'7px 4px',
                border:'2.5px solid #000',
                boxShadow: delivery===d ? 'none' : '3px 3px 0 #000',
                transform: delivery===d ? 'translate(2px,2px)' : 'none',
                background: delivery===d ? '#1a1a1a' : '#FDFBF7',
                color: delivery===d ? '#fff' : '#000',
                fontWeight:900, fontSize:11, cursor:'pointer',
                transition:'all 0.1s', ...ZH,
              }}>{DELIVERY_ICON[d]} {d}</button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label style={labelSt}>📍 交易地點</label>
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="如：Dublin 1、Cork City Centre..."
            style={{ ...inputSt, ...EN }} />
        </div>

        {/* Contact */}
        <div>
          <label style={labelSt}>📲 聯繫方式</label>
          <input value={contact} onChange={e => setContact(e.target.value)}
            placeholder="WhatsApp / Line / IG @帳號"
            style={{ ...inputSt }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding:'6px 10px', background:'#FDECEA',
            border:'2px solid #E74C3C', fontSize:10, color:'#E74C3C',
            fontWeight:700, ...ZH,
          }}>✗ {error}</div>
        )}
      </div>

      {/* Submit */}
      <div style={{ flexShrink:0, padding:'10px 14px', borderTop:'3px solid #000' }}>
        <button onClick={submit} style={{
          width:'100%', padding:13,
          background:'#FFD700', border:'3px solid #000', boxShadow:'5px 5px 0 #000',
          fontSize:14, fontWeight:900, cursor:'pointer',
          letterSpacing:'0.04em', ...ZH,
        }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='none'; }}
          onMouseUp={e   => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='5px 5px 0 #000'; }}
        >
          🚀 投放離愛出清市集
        </button>
      </div>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, gold, onBuy }: {
  item: ThriftItem;
  gold: number;
  onBuy: (item: ThriftItem) => void;
}) {
  const canAfford = gold >= item.price;
  const hasImg    = item.images.length > 0;

  return (
    <div style={{
      border:'3px solid #000',
      boxShadow: item.isSold ? '3px 3px 0 #aaa' : '4px 4px 0 #000',
      background: item.isSold ? '#f0ece0' : '#FDFBF7',
      display:'flex', flexDirection:'column',
      overflow:'hidden', position:'relative',
      transition:'all 0.2s',
      opacity: item.isSold ? 0.65 : 1,
    }}>
      {/* Image */}
      <div style={{
        width:'100%', aspectRatio:'1',
        background: hasImg ? undefined : '#e8e4da',
        display:'flex', alignItems:'center', justifyContent:'center',
        borderBottom:'2px solid #000', overflow:'hidden', position:'relative',
      }}>
        {hasImg
          ? <img src={item.images[0]} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
          : <span style={{ fontSize:32 }}>{CAT_ICON[item.category]}</span>
        }
        {/* Condition badge */}
        <div style={{
          position:'absolute', top:4, left:4,
          background: item.condition==='全新' ? '#00A651' : '#F59E0B',
          color:'#fff', fontSize:7, fontWeight:900, padding:'2px 5px',
          border:'1.5px solid #000', ...ZH,
        }}>{item.condition}</div>
        {/* Delivery badge */}
        <div style={{
          position:'absolute', top:4, right:4,
          background:'#000', color:'#FFD700',
          fontSize:7, fontWeight:900, padding:'2px 5px',
          border:'1.5px solid #444', ...ZH,
        }}>{DELIVERY_ICON[item.deliveryMethod]}{item.deliveryMethod}</div>
      </div>

      {/* Info */}
      <div style={{ padding:'6px 7px', flex:1, display:'flex', flexDirection:'column', gap:3 }}>
        <div style={{ fontSize:9, color:'#888', ...ZH }}>{CAT_ICON[item.category]} {item.category}</div>
        <div style={{ fontSize:10, fontWeight:900, lineHeight:1.3, ...ZH }}>
          {item.name}
        </div>
        <div style={{ fontSize:8, color:'#666', ...ZH }}>📍 {item.location}</div>
        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:16, fontWeight:900, color:'#003A70', ...EN }}>€{item.price}</span>
        </div>
      </div>

      {/* Buy button */}
      <button onClick={() => !item.isSold && canAfford && onBuy(item)}
        style={{
          margin:'0 7px 7px', padding:'6px 0',
          border:'2.5px solid #000',
          boxShadow: item.isSold || !canAfford ? 'none' : '3px 3px 0 #000',
          background: item.isSold ? '#e0e0e0'
            : canAfford ? '#FFD700' : '#f5f0e6',
          color: item.isSold ? '#aaa' : canAfford ? '#000' : '#bbb',
          fontWeight:900, fontSize:9, cursor: item.isSold || !canAfford ? 'not-allowed' : 'pointer',
          ...ZH,
        }}>
        {item.isSold ? '— 已頂讓 —' : canAfford ? '💰 收購入庫' : `需 €${item.price}（不足）`}
      </button>

      {/* SOLD overlay */}
      {item.isSold && (
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          pointerEvents:'none',
        }}>
          <div style={{
            background:'rgba(0,0,0,0.65)', color:'#fff',
            fontSize:18, fontWeight:900, padding:'8px 14px',
            border:'3px solid #fff', letterSpacing:'0.1em',
            transform:'rotate(-12deg)', ...ZH,
          }}>已頂讓<br/><span style={{ fontSize:11, ...EN }}>SOLD OUT</span></div>
        </div>
      )}
    </div>
  );
}

// ─── Buyer View ───────────────────────────────────────────────────────────────
function BuyerView({ items, gold, onBuy, onBack }: {
  items:  ThriftItem[];
  gold:   number;
  onBuy:  (item: ThriftItem) => void;
  onBack: () => void;
}) {
  const [search,   setSearch]   = useState('');
  const [catFilt,  setCatFilt]  = useState<ThriftCategory | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(500);

  const maxPossible = useMemo(() =>
    Math.max(...items.map(i => i.price), 100), [items]);

  const filtered = useMemo(() => items.filter(i => {
    if (search  && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilt !== 'all' && i.category !== catFilt) return false;
    if (i.price > maxPrice) return false;
    return true;
  }), [items, search, catFilt, maxPrice]);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink:0, background:'#000', color:'#FFD700',
        padding:'8px 14px', borderBottom:'3px solid #000',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <button onClick={onBack} style={{
          background:'none', border:'none', color:'#FFD700',
          fontSize:14, cursor:'pointer', fontWeight:900,
        }}>↩</button>
        <span style={{ fontSize:13, fontWeight:900, ...ZH }}>🛍 買家市集</span>
        <div style={{
          marginLeft:'auto', background:'#1a1a1a',
          border:'1.5px solid #FFD700', padding:'2px 8px',
          fontSize:9, fontWeight:700, color:'#FFD700', ...EN,
        }}>💰 {gold} XP</div>
      </div>

      {/* Filter panel */}
      <div style={{
        flexShrink:0, padding:'8px 12px',
        borderBottom:'3px solid #000', background:'#f5f0e6',
        display:'flex', flexDirection:'column', gap:6,
      }}>
        {/* Search */}
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          border:'2.5px solid #000', background:'#fff', padding:'5px 8px',
          boxShadow:'2px 2px 0 #000',
        }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="搜尋商品名稱..."
            style={{ flex:1, border:'none', outline:'none', fontSize:11, background:'transparent', ...ZH }} />
        </div>

        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          {/* Category */}
          <select value={catFilt} onChange={e => setCatFilt(e.target.value as ThriftCategory | 'all')}
            style={{
              flex:1, padding:'5px 6px', border:'2.5px solid #000',
              background:'#fff', fontSize:10, outline:'none', ...ZH,
            }}>
            <option value="all">📂 全部類別</option>
            {(Object.keys(CAT_ICON) as ThriftCategory[]).map(c => (
              <option key={c} value={c}>{CAT_ICON[c]} {c}</option>
            ))}
          </select>
        </div>

        {/* Price slider */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:9, fontWeight:900, flexShrink:0, ...ZH }}>💶 最高預算</span>
          <input type="range" min={0} max={maxPossible} step={5}
            value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
            style={{ flex:1, accentColor:'#000' }} />
          <span style={{
            fontSize:10, fontWeight:900, ...EN,
            minWidth:38, textAlign:'right', color:'#003A70',
          }}>€{maxPrice}</span>
        </div>
        <div style={{ fontSize:8, color:'#888', ...ZH }}>
          共 {filtered.length} 件符合 · {filtered.filter(i=>!i.isSold).length} 件可購買
        </div>
      </div>

      {/* Grid */}
      <div style={{
        flex:1, overflowY:'auto', padding:10,
        display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10,
        alignContent:'start',
      }}>
        {filtered.length === 0 && (
          <div style={{
            gridColumn:'1/-1', textAlign:'center',
            padding:'40px 0', color:'#aaa', fontSize:12, ...ZH,
          }}>
            😢 找不到符合的商品
          </div>
        )}
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} gold={gold} onBuy={onBuy} />
        ))}
      </div>
    </div>
  );
}

// ─── Role Gate ────────────────────────────────────────────────────────────────
function RoleGate({ onSelect }: { onSelect: (role: 'buyer' | 'seller') => void }) {
  return (
    <div style={{
      height:'100%', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'#FDFBF7', gap:24, padding:24,
    }}>
      {/* Logo */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:36 }}>♻️</div>
        <div style={{ fontSize:16, fontWeight:900, letterSpacing:'0.04em', ...ZH, marginTop:6 }}>
          Thrift Shop
        </div>
        <div style={{
          fontSize:10, color:'#888', marginTop:2, ...ZH,
          letterSpacing:'0.06em',
        }}>離愛二手出清市集</div>
        <div style={{
          marginTop:6, padding:'3px 12px',
          border:'2px solid #000', fontSize:9, ...ZH,
          background:'#f5f0e6',
        }}>
          前輩出清 × 後輩採購 · 台灣打工人互助平台
        </div>
      </div>

      {/* Role buttons */}
      <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:280 }}>
        <button onClick={() => onSelect('buyer')} style={{
          padding:'16px 24px',
          border:'3px solid #000', boxShadow:'6px 6px 0 #000',
          background:'#FFD700', fontSize:14, fontWeight:900,
          cursor:'pointer', letterSpacing:'0.04em',
          transition:'all 0.1s', ...ZH,
        }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='none'; }}
          onMouseUp={e   => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='6px 6px 0 #000'; }}
        >
          🙋 我是買家
          <div style={{ fontSize:9, fontWeight:400, marginTop:2, color:'#555' }}>Browse & Buy</div>
        </button>

        <button onClick={() => onSelect('seller')} style={{
          padding:'16px 24px',
          border:'3px solid #000', boxShadow:'6px 6px 0 #000',
          background:'#1a1a1a', color:'#FFD700',
          fontSize:14, fontWeight:900, cursor:'pointer',
          letterSpacing:'0.04em', transition:'all 0.1s', ...ZH,
        }}
          onMouseDown={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='none'; }}
          onMouseUp={e   => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='6px 6px 0 #000'; }}
        >
          📦 我是賣家
          <div style={{ fontSize:9, fontWeight:400, marginTop:2, color:'#888' }}>Post & Sell</div>
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display:'flex', gap:16,
        fontSize:9, color:'#aaa', ...ZH,
      }}>
        <span>📦 {SEED.length} 件出清中</span>
        <span>🤝 台灣打工人互助</span>
      </div>
    </div>
  );
}

// ─── Thrift Screen Root ───────────────────────────────────────────────────────
export function ThriftScreen() {
  const { derived, dispatch } = useGame();
  const gold = derived.totalXP;

  const [role,   setRole]   = useState<'buyer' | 'seller' | null>(null);
  const [items,  setItems]  = useState<ThriftItem[]>(SEED);

  const handleSell = useCallback((data: Omit<ThriftItem,'id'|'isSold'|'sellerId'>) => {
    const newItem: ThriftItem = {
      ...data,
      id:       `u_${Date.now()}`,
      sellerId: 'me',
      isSold:   false,
    };
    setItems(prev => [newItem, ...prev]);
    setRole(null);
  }, []);

  const handleBuy = useCallback((item: ThriftItem) => {
    if (derived.totalXP < item.price) return;
    // Deduct XP (gold) — toggle a dummy task to subtract, or use UNLOCK_BADGE
    // For now mark sold and note the cost
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSold: true } : i));
    // Show purchase toast (future: integrate with bag)
    alert(`✅ 已收購「${item.name}」！\n花費 €${item.price}（XP 等同金幣）\n記得與賣家聯繫：${item.contact}`);
  }, [derived.totalXP]);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Top bar (shown on all sub-views) */}
      <div style={{
        flexShrink:0,
        background:'linear-gradient(135deg,#1a1a1a,#2C1A08)',
        color:'#FFD700', padding:'7px 14px',
        borderBottom:'3px solid #000',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ fontSize:18 }}>♻️</span>
        <div>
          <div style={{ fontSize:12, fontWeight:900, ...ZH }}>Thrift Shop</div>
          <div style={{ fontSize:8, color:'#C9A96E', ...ZH }}>離愛二手出清市集</div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
          <div style={{
            background:'#2a2a2a', border:'1.5px solid #FFD700',
            padding:'2px 8px', fontSize:9, fontWeight:700, ...EN,
          }}>
            <span style={{ color:'#FFD700' }}>💰 {gold} XP</span>
          </div>
          <div style={{
            background:'#2a2a2a', border:'1.5px solid #555',
            padding:'2px 8px', fontSize:8, color:'#aaa', ...ZH,
          }}>
            {items.filter(i=>!i.isSold).length} 件在售
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:'hidden' }}>
        {role === null && (
          <RoleGate onSelect={setRole} />
        )}
        {role === 'seller' && (
          <SellerForm onSubmit={handleSell} onBack={() => setRole(null)} />
        )}
        {role === 'buyer' && (
          <BuyerView items={items} gold={gold} onBuy={handleBuy} onBack={() => setRole(null)} />
        )}
      </div>
    </div>
  );
}
