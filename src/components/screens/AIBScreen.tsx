import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ZH, EN } from '../../data/constants';

// ─── Types ────────────────────────────────────────────────────────────────────
type EntryType = 'income' | 'expense';

const CATEGORIES = ['房租','餐飲','交通','通訊','醫療','娛樂','薪資','其他'] as const;
type Category = typeof CATEGORIES[number];

const CAT_ICON: Record<Category, string> = {
  房租:'🏠', 餐飲:'🍽️', 交通:'🚌', 通訊:'📱',
  醫療:'💊', 娛樂:'🎮', 薪資:'💰', 其他:'📦',
};

interface Entry {
  id:       string;
  type:     EntryType;
  eur:      number;
  category: Category;
  desc:     string;
  date:     string; // YYYY-MM-DD
}

const SEED: Entry[] = [
  { id:'1', type:'income',  eur:300,  category:'薪資', desc:'週薪', date:'2026-05-15' },
  { id:'2', type:'income',  eur:300,  category:'薪資', desc:'週薪', date:'2026-05-08' },
  { id:'3', type:'income',  eur:300,  category:'薪資', desc:'週薪', date:'2026-05-01' },
  { id:'4', type:'income',  eur:100,  category:'薪資', desc:'額外班', date:'2026-05-20' },
  { id:'5', type:'expense', eur:500,  category:'房租', desc:'五月房租', date:'2026-05-08' },
  { id:'6', type:'expense', eur:61,   category:'餐飲', desc:'Lidl 採購', date:'2026-05-12' },
  { id:'7', type:'expense', eur:45,   category:'娛樂', desc:'電影票+酒吧', date:'2026-05-06' },
  { id:'8', type:'expense', eur:15,   category:'醫療', desc:'藥局', date:'2026-05-11' },
  { id:'9', type:'expense', eur:22,   category:'交通', desc:'Leap Card 加值', date:'2026-05-14' },
  { id:'10',type:'expense', eur:18,   category:'通訊', desc:'SIM 月費', date:'2026-05-03' },
  { id:'11',type:'expense', eur:10,   category:'餐飲', desc:'咖啡廳', date:'2026-05-18' },
];

// week start (Mon) for a date
function weekStart(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function fmt(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth()+1}/${dt.getDate()}`;
}

// ─── Exchange Rate Hook ───────────────────────────────────────────────────────
function useExchangeRate() {
  const [rate, setRate] = useState(36.67);
  const [live, setLive] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    // Placeholder for real API fetch
    // fetch('https://api.exchangerate.host/latest?base=EUR&symbols=TWD')
    //   .then(r => r.json()).then(d => { setRate(d.rates.TWD); setLive(true); })
    //   .catch(() => {});
    setRate(36.67);
    setLive(false);
    setDate(new Date().toLocaleDateString('zh-TW', { month:'numeric', day:'numeric' }));
  }, []);

  return { rate, live, date };
}

// ─── Ledger Tab ───────────────────────────────────────────────────────────────
function LedgerTab({
  entries, onAdd, onDelete, rate,
}: {
  entries:  Entry[];
  onAdd:    (e: Omit<Entry,'id'>) => void;
  onDelete: (id: string) => void;
  rate:     number;
}) {
  const [formType, setFormType]   = useState<EntryType>('expense');
  const [formEur,  setFormEur]    = useState('');
  const [formCat,  setFormCat]    = useState<Category>('餐飲');
  const [formDesc, setFormDesc]   = useState('');
  const [formDate, setFormDate]   = useState(() => new Date().toISOString().slice(0,10));

  const submit = () => {
    const n = parseFloat(formEur);
    if (!n || n <= 0) return;
    onAdd({ type: formType, eur: n, category: formCat, desc: formDesc || formCat, date: formDate });
    setFormEur(''); setFormDesc('');
  };

  const totalIncome  = entries.filter(e => e.type === 'income').reduce((s,e) => s+e.eur, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s,e) => s+e.eur, 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

      {/* ── Add Form ── */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px',
        borderBottom: '3px solid #000',
        background: '#f5f0e6',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* Type toggle + amount */}
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={() => setFormType('income')} style={{
            padding:'5px 12px', border:'2.5px solid #000',
            boxShadow: formType==='income' ? 'none' : '2px 2px 0 #000',
            transform: formType==='income' ? 'translate(2px,2px)' : 'none',
            background: formType==='income' ? '#00A651' : '#FDFBF7',
            color: formType==='income' ? '#fff' : '#000',
            fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
          }}>＋ 收入</button>
          <button onClick={() => setFormType('expense')} style={{
            padding:'5px 12px', border:'2.5px solid #000',
            boxShadow: formType==='expense' ? 'none' : '2px 2px 0 #000',
            transform: formType==='expense' ? 'translate(2px,2px)' : 'none',
            background: formType==='expense' ? '#E74C3C' : '#FDFBF7',
            color: formType==='expense' ? '#fff' : '#000',
            fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
          }}>－ 支出</button>

          <input type="number" step="0.01" min="0"
            value={formEur} onChange={e => setFormEur(e.target.value)}
            placeholder="€ 金額"
            style={{
              width:90, padding:'5px 8px', border:'2.5px solid #000',
              background:'#fff', fontSize:12, outline:'none', ...EN,
            }}
          />

          {/* Category select */}
          <select value={formCat} onChange={e => setFormCat(e.target.value as Category)}
            style={{
              flex:1, padding:'5px 6px', border:'2.5px solid #000',
              background:'#fff', fontSize:11, outline:'none', ...ZH,
            }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICON[c]} {c}</option>)}
          </select>
        </div>

        {/* Desc + date + submit */}
        <div style={{ display:'flex', gap:6 }}>
          <input type="text"
            value={formDesc} onChange={e => setFormDesc(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="說明（選填）"
            style={{
              flex:1, padding:'5px 8px', border:'2.5px solid #000',
              background:'#fff', fontSize:11, outline:'none', ...ZH,
            }}
          />
          <input type="date"
            value={formDate} onChange={e => setFormDate(e.target.value)}
            style={{
              padding:'5px 7px', border:'2.5px solid #000',
              background:'#fff', fontSize:11, outline:'none', ...EN,
            }}
          />
          <button onClick={submit} style={{
            padding:'5px 14px', border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
            background:'#FFD700', fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
          }}>記帳 ＋</button>
        </div>

        {/* NTD preview */}
        {formEur && parseFloat(formEur) > 0 && (
          <div style={{ fontSize:9, color:'#7A5C2E', ...ZH }}>
            ≈ NT$ {Math.round(parseFloat(formEur) * rate).toLocaleString()}
          </div>
        )}
      </div>

      {/* ── Entry list (only this scrolls) ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'6px 12px', display:'flex', flexDirection:'column', gap:5 }}>
        {[...entries].sort((a,b) => b.date.localeCompare(a.date)).map(e => (
          <div key={e.id} style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'8px 10px',
            border:'2.5px solid #000', boxShadow:'2px 2px 0 #000',
            background: e.type==='income' ? '#f0faf4' : '#fff8f8',
          }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{CAT_ICON[e.category]}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, ...ZH }}>{e.desc || e.category}</div>
              <div style={{ fontSize:8, color:'#888', ...EN }}>
                ≈ NT$ {Math.round(e.eur * rate).toLocaleString()}　{e.date}
              </div>
            </div>
            <div style={{
              fontSize:14, fontWeight:900, flexShrink:0,
              color: e.type==='income' ? '#00A651' : '#E74C3C',
              ...EN,
            }}>
              {e.type==='income' ? '+' : '-'}€{e.eur}
            </div>
            <button onClick={() => onDelete(e.id)} style={{
              width:22, height:22, border:'1.5px solid #ccc',
              background:'#fff', color:'#E74C3C', cursor:'pointer',
              fontSize:12, fontWeight:900, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>×</button>
          </div>
        ))}
      </div>

      {/* ── Footer totals ── */}
      <div style={{
        flexShrink:0, borderTop:'3px solid #000',
        background:'#1a1a1a', color:'#fff',
        padding:'6px 14px', display:'flex', gap:16, alignItems:'center',
        fontSize:11, fontWeight:700,
      }}>
        <span style={{ color:'#4ade80', ...EN }}>收入 €{totalIncome.toFixed(2)}</span>
        <span style={{ color:'#f87171', ...EN }}>支出 €{totalExpense.toFixed(2)}</span>
        <span style={{ marginLeft:'auto', color:'#FFD700', ...EN }}>
          結餘 {totalIncome - totalExpense >= 0 ? '+' : ''}€{(totalIncome - totalExpense).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab({ entries, rate }: { entries: Entry[]; rate: number }) {
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState<'all'|'income'|'expense'>('all');
  const [catFilter,   setCatFilter]   = useState<Set<Category>>(new Set());

  const toggleCat = useCallback((c: Category) => {
    setCatFilter(prev => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  }, []);

  const clearFilters = () => { setSearch(''); setTypeFilter('all'); setCatFilter(new Set()); };
  const hasFilter = search || typeFilter !== 'all' || catFilter.size > 0;

  // Filtered entries
  const filtered = useMemo(() => entries.filter(e => {
    if (typeFilter === 'income'  && e.type !== 'income')  return false;
    if (typeFilter === 'expense' && e.type !== 'expense') return false;
    if (catFilter.size > 0 && !catFilter.has(e.category)) return false;
    if (search && !e.desc.toLowerCase().includes(search.toLowerCase()) &&
        !e.category.includes(search)) return false;
    return true;
  }), [entries, typeFilter, catFilter, search]);

  // Weekly groups (expenses only for chart)
  const weeklyExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(e => e.type === 'expense').forEach(e => {
      const ws = weekStart(e.date);
      map[ws] = (map[ws] ?? 0) + e.eur;
    });
    return Object.entries(map)
      .sort(([a],[b]) => b.localeCompare(a))
      .slice(0, 5);
  }, [filtered]);

  const weeklyIncome = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(e => e.type === 'income').forEach(e => {
      const ws = weekStart(e.date);
      map[ws] = (map[ws] ?? 0) + e.eur;
    });
    return map;
  }, [filtered]);

  const maxExpense = Math.max(...weeklyExpenses.map(([,v]) => v), 1);

  // Survival runway
  const last7 = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    return entries
      .filter(e => e.type==='expense' && new Date(e.date) >= cutoff)
      .reduce((s,e) => s+e.eur, 0);
  }, [entries]);
  const avgDaily  = last7 / 7;
  const gold      = 900; // placeholder
  const runway    = avgDaily > 0 ? Math.floor(gold / avgDaily) : 999;
  const runwayPct = Math.min(100, (runway / 180) * 100);
  const runwayColor = runway >= 60 ? '#00A651' : runway >= 30 ? '#F59E0B' : '#E74C3C';

  const totalFiltered    = filtered.reduce((s,e) => s + (e.type==='income'?e.eur:-e.eur), 0);
  const totalInFiltered  = filtered.filter(e=>e.type==='income').reduce((s,e)=>s+e.eur,0);
  const totalOutFiltered = filtered.filter(e=>e.type==='expense').reduce((s,e)=>s+e.eur,0);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>

      {/* ── Survival runway ── */}
      <div style={{
        flexShrink:0, margin:'8px 12px 0',
        border:'3px solid #000', boxShadow:'4px 4px 0 #000',
        background: runway < 30 ? '#FDECEA' : runway < 60 ? '#FFF9E6' : '#E8F5EC',
        padding:'8px 12px',
      }}>
        <div style={{ fontSize:9, fontWeight:900, color:runwayColor, letterSpacing:'0.08em', ...EN }}>
          🔥 生存血條燃燒率（過去 7 天日均 €{avgDaily.toFixed(1)}）
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, margin:'4px 0' }}>
          <span style={{ fontSize:10, ...ZH }}>
            {runway >= 999 ? '✅ 尚無支出紀錄' : `✅ 依目前燃燒率，現有資金約可再撐`}
          </span>
          {runway < 999 && (
            <span style={{ fontSize:28, fontWeight:900, color:runwayColor, ...EN, lineHeight:1 }}>
              {runway}
            </span>
          )}
          {runway < 999 && <span style={{ fontSize:13, fontWeight:700, ...ZH }}>天</span>}
        </div>
        {/* Progress bar */}
        <div style={{
          height:14, background:'#e8e4da',
          border:'2.5px solid #000', overflow:'hidden',
        }}>
          <div style={{
            height:'100%', width:`${runwayPct}%`,
            background: runwayColor,
            borderRight: runwayPct < 100 ? '2px solid #000' : 'none',
            transition:'width 0.5s ease',
          }}/>
        </div>
        <div style={{ fontSize:8, color:'#666', marginTop:3, ...ZH }}>
          現有 {gold} 金幣 · 期望目標 180 天
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{
        flexShrink:0, padding:'8px 12px 6px',
        borderBottom:'3px solid #000', display:'flex', flexDirection:'column', gap:6,
      }}>
        {/* Search */}
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <div style={{
            flex:1, display:'flex', alignItems:'center',
            border:'2.5px solid #000', background:'#fff', padding:'5px 8px', gap:5,
          }}>
            <span style={{ fontSize:11 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜尋（如：Tesco、房租…）"
              style={{ flex:1, border:'none', outline:'none', fontSize:10, background:'transparent', ...ZH }}
            />
          </div>
          {/* Type toggles */}
          {(['all','income','expense'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding:'4px 8px', border:'2.5px solid #000',
              boxShadow: typeFilter===t ? 'none' : '2px 2px 0 #000',
              transform: typeFilter===t ? 'translate(2px,2px)' : 'none',
              background: typeFilter===t
                ? (t==='income' ? '#00A651' : t==='expense' ? '#E74C3C' : '#000')
                : '#FDFBF7',
              color: typeFilter===t ? '#fff' : '#000',
              fontSize:9, fontWeight:900, cursor:'pointer', ...ZH,
            }}>
              {t==='all'?'全部':t==='income'?'🌿 收入':'🔥 支出'}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {CATEGORIES.map(c => {
            const on = catFilter.has(c);
            return (
              <button key={c} onClick={() => toggleCat(c)} style={{
                padding:'3px 9px', border:'2px solid #000',
                boxShadow: on ? 'none' : '2px 2px 0 #000',
                transform: on ? 'translate(2px,2px)' : 'none',
                background: on ? '#1a1a1a' : '#FDFBF7',
                color: on ? '#FFD700' : '#000',
                fontSize:9, fontWeight:700, cursor:'pointer', borderRadius:100,
                ...ZH,
              }}>{c}</button>
            );
          })}
          {hasFilter && (
            <button onClick={clearFilters} style={{
              padding:'3px 9px', border:'2px dashed #E74C3C',
              background:'#fff', color:'#E74C3C',
              fontSize:9, fontWeight:700, cursor:'pointer', borderRadius:100, ...ZH,
            }}>× 清除</button>
          )}
        </div>
      </div>

      {/* ── Charts + list (scrollable) ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 12px', display:'flex', flexDirection:'column', gap:8 }}>

        {/* Weekly bars */}
        {weeklyExpenses.length > 0 && (
          <div style={{ border:'2.5px solid #000', boxShadow:'3px 3px 0 #000', overflow:'hidden' }}>
            <div style={{
              background:'#000', color:'#FFD700',
              padding:'5px 10px', fontSize:9, fontWeight:900,
              display:'flex', justifyContent:'space-between', ...ZH,
            }}>
              <span>📊 週累計統計條</span>
              <span style={{ color:'#f87171' }}>■ 支出</span>
              <span style={{ color:'#4ade80', marginLeft:8 }}>■ 收入</span>
            </div>
            <div style={{ padding:'8px 10px', display:'flex', flexDirection:'column', gap:6 }}>
              {weeklyExpenses.map(([ws, exp]) => {
                const inc = weeklyIncome[ws] ?? 0;
                const pct = Math.round((exp / maxExpense) * 100);
                return (
                  <div key={ws} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    {/* Date label */}
                    <div style={{ fontSize:9, color:'#555', flexShrink:0, width:34, ...EN }}>
                      {fmt(ws)}
                    </div>
                    {/* Bar container */}
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
                      {/* Expense bar */}
                      <div style={{
                        height:10, background:'#e8e4da',
                        border:'2px solid #000', overflow:'hidden',
                      }}>
                        <div style={{
                          height:'100%', width:`${pct}%`,
                          background:'#F97316',
                          borderRight: pct < 100 ? '1.5px solid #000' : 'none',
                          transition:'width 0.4s ease',
                        }}/>
                      </div>
                      {/* Income bar */}
                      {inc > 0 && (
                        <div style={{
                          height:6, background:'#e8f5ec',
                          border:'1.5px solid #000', overflow:'hidden',
                        }}>
                          <div style={{
                            height:'100%',
                            width:`${Math.min(100, Math.round((inc / maxExpense) * 100))}%`,
                            background:'#00A651', transition:'width 0.4s ease',
                          }}/>
                        </div>
                      )}
                    </div>
                    {/* Amount */}
                    <div style={{ flexShrink:0, textAlign:'right', minWidth:44 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#E74C3C', ...EN }}>€{exp}</div>
                      {inc > 0 && <div style={{ fontSize:8, color:'#00A651', ...EN }}>+€{inc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtered detail list */}
        <div style={{ border:'2.5px solid #000', boxShadow:'3px 3px 0 #000', overflow:'hidden' }}>
          <div style={{
            background:'#000', color:'#fff',
            padding:'5px 10px', fontSize:9, fontWeight:900,
            display:'flex', justifyContent:'space-between', ...ZH,
          }}>
            <span>▸ 篩選明細（{filtered.length} 筆）</span>
            <span style={{ ...EN, color:'#aaa' }}>
              收入 €{totalInFiltered} · 支出 €{totalOutFiltered}
            </span>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding:'12px', textAlign:'center', color:'#aaa', fontSize:10, ...ZH }}>
              無符合條件的紀錄
            </div>
          )}
          {[...filtered].sort((a,b) => b.date.localeCompare(a.date)).map(e => (
            <div key={e.id} style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'6px 10px', borderTop:'1px solid #e8e4da',
              background: e.type==='income' ? '#f0faf4' : '#FDFBF7',
            }}>
              <span style={{ fontSize:14 }}>{CAT_ICON[e.category]}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:600, ...ZH }}>{e.desc}</div>
                <div style={{ fontSize:8, color:'#aaa', ...EN }}>{e.category} · {e.date}</div>
              </div>
              <div style={{
                fontSize:12, fontWeight:900,
                color: e.type==='income' ? '#00A651' : '#E74C3C', ...EN,
              }}>
                {e.type==='income' ? '+' : '-'}€{e.eur}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer summary */}
      <div style={{
        flexShrink:0, borderTop:'3px solid #000',
        background:'#1a1a1a', padding:'5px 12px',
        display:'flex', gap:12, fontSize:10, fontWeight:700, color:'#fff',
      }}>
        <span style={{ ...EN }}>篩選 {filtered.length}/{entries.length} 筆</span>
        <span style={{ marginLeft:'auto', color: totalFiltered>=0?'#4ade80':'#f87171', ...EN }}>
          {totalFiltered>=0?'+':''}€{totalFiltered.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ─── AIB Screen Root ──────────────────────────────────────────────────────────
export function AIBScreen() {
  const { rate, live, date } = useExchangeRate();
  const [tab,     setTab]     = useState<'ledger'|'report'>('ledger');
  const [entries, setEntries] = useState<Entry[]>(SEED);

  const addEntry = useCallback((e: Omit<Entry,'id'>) => {
    setEntries(prev => [{ ...e, id: Date.now().toString() }, ...prev]);
  }, []);

  const delEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* ── Header ── */}
      <div style={{
        flexShrink:0,
        background:'linear-gradient(135deg,#0a3a1a,#1a6b3a)',
        color:'#fff', padding:'7px 12px',
        borderBottom:'3px solid #000',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ fontSize:18 }}>🏦</span>
        <span style={{ fontSize:13, fontWeight:900, ...ZH }}>AIB 記帳本</span>
        <div style={{
          marginLeft:'auto',
          background: live ? '#00A651' : '#2a2a2a',
          border:'1.5px solid #FFD700', padding:'2px 8px',
          fontSize:9, fontWeight:700, ...EN,
          display:'flex', alignItems:'center', gap:4,
        }}>
          <span>💱</span>
          <span style={{ color:'#FFD700' }}>€1 = NT${rate.toFixed(2)}</span>
        </div>
        {/* EUR/TWD ticker strip */}
        <div style={{ fontSize:8, color:'#aaa', ...EN, flexShrink:0 }}>
          {live ? `LIVE · ${date}` : `REF · ${date || '模擬'}`}
        </div>
      </div>

      {/* EUR rate sub-bar */}
      <div style={{
        flexShrink:0, background:'#111',
        padding:'3px 12px',
        display:'flex', gap:12, fontSize:8, color:'#ccc', ...EN,
      }}>
        <span>EUR/TWD <span style={{ color:'#4ade80' }}>{rate.toFixed(2)}</span> <span style={{ color:'#4ade80' }}>▲+0.12</span></span>
        <span>EUR/USD <span style={{ color:'#f87171' }}>1.073</span> <span style={{ color:'#f87171' }}>▼-0.004</span></span>
        <span>EUR/CNY <span style={{ color:'#4ade80' }}>7.75</span> <span style={{ color:'#4ade80' }}>▲+0.03</span></span>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        flexShrink:0, display:'flex',
        borderBottom:'3px solid #000',
        background:'#f0ece0',
      }}>
        {([
          { id:'ledger' as const, label:'📝 記帳本' },
          { id:'report' as const, label:'📊 生存報表' },
        ]).map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:'9px 4px',
            border:'none',
            borderRight: i === 0 ? '2.5px solid #000' : 'none',
            background: tab===t.id ? '#000' : 'transparent',
            color: tab===t.id ? '#FFD700' : '#555',
            fontWeight: tab===t.id ? 900 : 400,
            fontSize:11, cursor:'pointer',
            transition:'all 0.12s',
            ...ZH,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content (fills remaining height, no outer scroll) ── */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab === 'ledger' && (
          <LedgerTab entries={entries} onAdd={addEntry} onDelete={delEntry} rate={rate} />
        )}
        {tab === 'report' && (
          <ReportTab entries={entries} rate={rate} />
        )}
      </div>
    </div>
  );
}
