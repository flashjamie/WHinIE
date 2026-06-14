import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ZH, EN } from '../../data/constants';
import { useGame } from '../../context/GameContext';
import type { AibEntry } from '../../context/GameContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type EntryType = 'income' | 'expense';

const CATEGORIES = ['房租','餐飲','交通','通訊','醫療','娛樂','薪資','其他','超市'] as const;
type Category = typeof CATEGORIES[number];

const CAT_ICON: Record<Category, string> = {
  房租:'🏠', 餐飲:'🍽️', 交通:'🚌', 通訊:'📱',
  醫療:'💊', 娛樂:'🎮', 薪資:'💰', 其他:'📦',超市:'🛒'
};

type Entry = AibEntry;

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
    <div style={{ display:'flex', flexDirection:'column' }}>

      {/* ── Add Form ── */}
      <div style={{
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

      {/* ── Entry list ── */}
      <div style={{ padding:'6px 12px', display:'flex', flexDirection:'column', gap:5 }}>
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
        borderTop:'3px solid #000',
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
  const [chartMode,   setChartMode]   = useState<'week'|'month'>('week');
  // selectedMonth: 'YYYY-MM' for week mode navigation
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().slice(0,7));
  // selectedMonthOffset for month mode (0 = current 6 months, -6 = prev 6 months...)
  const [monthOffset, setMonthOffset] = useState(0);

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
    if (catFilter.size > 0 && !catFilter.has(e.category as any)) return false;
    if (search && !e.desc.toLowerCase().includes(search.toLowerCase()) &&
        !e.category.includes(search)) return false;
    return true;
  }), [entries, typeFilter, catFilter, search]);

  // ── Chart data: week mode (weeks within selectedMonth) ──
  const weekChartData = useMemo(() => {
    const map: Record<string, { exp: number; inc: number }> = {};
    entries.forEach(e => {
      if (e.date.slice(0,7) !== selectedMonth) return;
      const ws = weekStart(e.date);
      if (!map[ws]) map[ws] = { exp:0, inc:0 };
      if (e.type === 'expense') map[ws].exp += e.eur;
      else                       map[ws].inc += e.eur;
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b));
  }, [entries, selectedMonth]);

  // ── Chart data: month mode (6 months window) ──
  const monthChartData = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() + monthOffset - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
    }
    return months.map(m => {
      const exp = entries.filter(e => e.type==='expense' && e.date.slice(0,7)===m).reduce((s,e)=>s+e.eur,0);
      const inc = entries.filter(e => e.type==='income'  && e.date.slice(0,7)===m).reduce((s,e)=>s+e.eur,0);
      return { month: m, label: m.slice(5), exp, inc };
    });
  }, [entries, monthOffset]);

  const maxWeek  = Math.max(...weekChartData.map(([,v])=>Math.max(v.exp,v.inc)), 1);
  const maxMonth = Math.max(...monthChartData.map(r=>Math.max(r.exp,r.inc)), 1);

  // Month nav helpers
  const prevMonth = () => {
    const [y,m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m-2, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  };
  const nextMonth = () => {
    const [y,m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  };
  const monthLabel = (ym: string) => {
    const [y,m] = ym.split('-');
    return `${y}年${parseInt(m)}月`;
  };

  // Survival runway
  const last7 = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    return entries
      .filter(e => e.type==='expense' && new Date(e.date) >= cutoff)
      .reduce((s,e) => s+e.eur, 0);
  }, [entries]);
  const avgDaily  = last7 / 7;
  const gold      = 900;
  const runway    = avgDaily > 0 ? Math.floor(gold / avgDaily) : 999;
  const runwayPct = Math.min(100, (runway / 180) * 100);
  const runwayColor = runway >= 60 ? '#00A651' : runway >= 30 ? '#F59E0B' : '#E74C3C';

  const totalFiltered    = filtered.reduce((s,e) => s + (e.type==='income'?e.eur:-e.eur), 0);
  const totalInFiltered  = filtered.filter(e=>e.type==='income').reduce((s,e)=>s+e.eur,0);
  const totalOutFiltered = filtered.filter(e=>e.type==='expense').reduce((s,e)=>s+e.eur,0);

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>

      {/* ── Survival runway ── */}
      <div style={{
        margin:'8px 12px 0',
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
        padding:'8px 12px 6px',
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

      {/* ── Charts + list ── */}
      <div style={{ padding:'8px 12px', display:'flex', flexDirection:'column', gap:8 }}>

        {/* Chart block */}
        <div style={{ border:'2.5px solid #000', boxShadow:'3px 3px 0 #000', overflow:'hidden' }}>
          {/* Chart header */}
          <div style={{
            background:'#000', color:'#FFD700',
            padding:'5px 10px', fontSize:9, fontWeight:900,
            display:'flex', alignItems:'center', gap:6, ...ZH,
          }}>
            <span>📊 累計統計條</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
              {(['week','month'] as const).map(m => (
                <button key={m} onClick={() => setChartMode(m)} style={{
                  padding:'2px 8px', border:'1.5px solid #FFD700',
                  background: chartMode===m ? '#FFD700' : 'transparent',
                  color: chartMode===m ? '#000' : '#FFD700',
                  fontSize:8, fontWeight:900, cursor:'pointer', ...ZH,
                }}>{m==='week'?'週視圖':'月視圖'}</button>
              ))}
            </div>
            <span style={{ color:'#f87171', marginLeft:4 }}>■ 支出</span>
            <span style={{ color:'#4ade80' }}>■ 收入</span>
          </div>

          {/* Week mode: nav by month */}
          {chartMode === 'week' && (
            <>
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'4px 10px', borderBottom:'1.5px solid #ccc', background:'#f5f0e6',
              }}>
                <button onClick={prevMonth} style={{
                  padding:'2px 10px', border:'2px solid #000', background:'#fff',
                  cursor:'pointer', fontSize:12, fontWeight:900,
                }}>‹</button>
                <span style={{ fontSize:10, fontWeight:700, ...ZH }}>{monthLabel(selectedMonth)}</span>
                <button onClick={nextMonth} style={{
                  padding:'2px 10px', border:'2px solid #000', background:'#fff',
                  cursor:'pointer', fontSize:12, fontWeight:900,
                }}>›</button>
              </div>
              <div style={{ padding:'8px 10px', display:'flex', flexDirection:'column', gap:6 }}>
                {weekChartData.length === 0 && (
                  <div style={{ textAlign:'center', color:'#aaa', fontSize:9, padding:'8px 0', ...ZH }}>本月無資料</div>
                )}
                {weekChartData.map(([ws, { exp, inc }]) => {
                  const ePct = Math.round((exp / maxWeek) * 100);
                  const iPct = Math.round((inc / maxWeek) * 100);
                  return (
                    <div key={ws} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ fontSize:9, color:'#555', flexShrink:0, width:36, ...EN }}>{fmt(ws)}</div>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
                        {exp > 0 && (
                          <div style={{ height:10, background:'#e8e4da', border:'2px solid #000', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${ePct}%`, background:'#F97316', transition:'width 0.4s' }}/>
                          </div>
                        )}
                        {inc > 0 && (
                          <div style={{ height:8, background:'#e8f5ec', border:'1.5px solid #000', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${iPct}%`, background:'#00A651', transition:'width 0.4s' }}/>
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink:0, textAlign:'right', minWidth:48 }}>
                        {exp > 0 && <div style={{ fontSize:10, fontWeight:700, color:'#E74C3C', ...EN }}>€{exp}</div>}
                        {inc > 0 && <div style={{ fontSize:8, color:'#00A651', ...EN }}>+€{inc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Month mode: nav by 6-month window */}
          {chartMode === 'month' && (
            <>
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'4px 10px', borderBottom:'1.5px solid #ccc', background:'#f5f0e6',
              }}>
                <button onClick={() => setMonthOffset(o => o - 6)} style={{
                  padding:'2px 10px', border:'2px solid #000', background:'#fff',
                  cursor:'pointer', fontSize:12, fontWeight:900,
                }}>‹</button>
                <span style={{ fontSize:9, fontWeight:700, ...ZH }}>
                  {monthChartData[0]?.month.slice(0,7).replace('-','年')}月 ～ {monthChartData[5]?.month.slice(0,7).replace('-','年')}月
                </span>
                <button onClick={() => setMonthOffset(o => o + 6)} style={{
                  padding:'2px 10px', border:'2px solid #000', background:'#fff',
                  cursor:'pointer', fontSize:12, fontWeight:900,
                }}>›</button>
              </div>
              <div style={{ padding:'8px 10px', display:'flex', flexDirection:'column', gap:6 }}>
                {monthChartData.every(r => r.exp === 0 && r.inc === 0) && (
                  <div style={{ textAlign:'center', color:'#aaa', fontSize:9, padding:'8px 0', ...ZH }}>此區間無資料</div>
                )}
                {monthChartData.map(({ month, label, exp, inc }) => {
                  const ePct = Math.round((exp / maxMonth) * 100);
                  const iPct = Math.round((inc / maxMonth) * 100);
                  return (
                    <div key={month} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ fontSize:9, color:'#555', flexShrink:0, width:36, ...EN }}>{label}</div>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
                        {exp > 0 && (
                          <div style={{ height:10, background:'#e8e4da', border:'2px solid #000', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${ePct}%`, background:'#F97316', transition:'width 0.4s' }}/>
                          </div>
                        )}
                        {inc > 0 && (
                          <div style={{ height:8, background:'#e8f5ec', border:'1.5px solid #000', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${iPct}%`, background:'#00A651', transition:'width 0.4s' }}/>
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink:0, textAlign:'right', minWidth:52 }}>
                        {exp > 0 && <div style={{ fontSize:10, fontWeight:700, color:'#E74C3C', ...EN }}>€{exp}</div>}
                        {inc > 0 && <div style={{ fontSize:8, color:'#00A651', ...EN }}>+€{inc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

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
              <span style={{ fontSize:14 }}>{CAT_ICON[e.category as Category]}</span>
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
        borderTop:'3px solid #000',
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
  const { state, dispatch }  = useGame();
  const [tab, setTab]        = useState<'ledger'|'report'>('ledger');
  const entries = state.aibEntries as Entry[];

  const addEntry = useCallback((e: Omit<Entry,'id'>) => {
    dispatch({ type: 'ADD_AIB_ENTRY', entry: { ...e, id: Date.now().toString() } });
  }, [dispatch]);

  const delEntry = useCallback((id: string) => {
    dispatch({ type: 'DEL_AIB_ENTRY', id });
  }, [dispatch]);

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>

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

      {/* ── Content ── */}
      <div>
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
