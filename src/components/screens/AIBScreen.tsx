import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AIB_STEPS, ZH, EN } from '../../data/constants';

const EUR_RATE = 34.2; // NTD per EUR (approximate)

interface LedgerEntry {
  id: string;
  date: string;
  desc: string;
  eur: number;
}

type Tab = 'guide' | 'ledger' | 'report';

// ─── Ledger Tab ───────────────────────────────────────────────────────────────
function LedgerTab() {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { id: '1', date: new Date().toISOString().slice(0, 10), desc: '超市採購 (Lidl)', eur: 28.5 },
    { id: '2', date: new Date().toISOString().slice(0, 10), desc: 'Leap 交通卡加值', eur: 20 },
  ]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), desc: '', eur: '' });

  const addEntry = () => {
    if (!form.desc || !form.eur) return;
    setEntries(prev => [...prev, {
      id: Date.now().toString(),
      date: form.date,
      desc: form.desc,
      eur: parseFloat(form.eur),
    }]);
    setForm(f => ({ ...f, desc: '', eur: '' }));
  };

  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  const totalEur = entries.reduce((s, e) => s + e.eur, 0);
  const totalNtd = totalEur * EUR_RATE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Rate badge */}
      <div style={{
        background: '#003A8C', color: '#fff',
        padding: '5px 10px', display: 'flex', gap: 10, alignItems: 'center',
        border: '2px solid #000', fontSize: 10, ...EN,
      }}>
        <span style={{ fontWeight: 700 }}>€1 ≈ NT${EUR_RATE}</span>
        <span style={{ color: '#aed6f1', fontSize: 9, ...ZH }}>匯率參考值（實際依當日為準）</span>
      </div>

      {/* Entry list */}
      <div style={{ border: '2.5px solid #000', overflow: 'hidden' }}>
        <div style={{
          background: '#000', color: '#fff',
          padding: '5px 10px', fontSize: 10, fontWeight: 900, ...ZH,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>📝 支出紀錄</span>
          <span style={{ ...EN, fontSize: 9, color: '#aaa' }}>
            €{totalEur.toFixed(2)} ≈ NT${Math.round(totalNtd).toLocaleString()}
          </span>
        </div>

        {entries.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#aaa', fontSize: 10, ...ZH }}>
            尚無紀錄，請新增支出
          </div>
        )}

        {entries.map(e => (
          <div key={e.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderTop: '1px solid #e8e4da',
            background: '#FDFBF7',
          }}>
            <div style={{ fontSize: 9, color: '#999', flexShrink: 0, ...EN }}>{e.date}</div>
            <div style={{ flex: 1, fontSize: 11, ...ZH }}>{e.desc}</div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, ...EN }}>€{e.eur.toFixed(2)}</div>
              <div style={{ fontSize: 9, color: '#888', ...EN }}>NT${Math.round(e.eur * EUR_RATE).toLocaleString()}</div>
            </div>
            <button onClick={() => removeEntry(e.id)} style={{
              width: 18, height: 18, border: '1.5px solid #E74C3C',
              background: '#fff', color: '#E74C3C', cursor: 'pointer',
              fontSize: 11, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontWeight: 900,
            }}>×</button>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div style={{
        border: '3px solid #000', boxShadow: '3px 3px 0 #000',
        padding: 9, background: '#f0ece0',
      }}>
        <div style={{ fontSize: 9, fontWeight: 900, marginBottom: 6, ...ZH }}>＋ 新增支出</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
          <input
            type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            style={{
              padding: '5px 7px', border: '2px solid #000', background: '#FDFBF7',
              fontSize: 11, outline: 'none', ...EN,
            }}
          />
          <input
            type="number" step="0.01" min="0"
            value={form.eur}
            onChange={e => setForm(f => ({ ...f, eur: e.target.value }))}
            placeholder="金額 (€)"
            style={{
              padding: '5px 7px', border: '2px solid #000', background: '#FDFBF7',
              fontSize: 11, outline: 'none', ...EN,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text" value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addEntry()}
            placeholder="支出說明..."
            style={{
              flex: 1, padding: '5px 8px', border: '2px solid #000',
              background: '#FDFBF7', fontSize: 11, outline: 'none', ...ZH,
            }}
          />
          <button onClick={addEntry} style={{
            padding: '5px 14px', border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
            background: '#FFD700', cursor: 'pointer', fontWeight: 900, fontSize: 11, ...ZH,
          }}>記帳</button>
        </div>
        {form.eur && (
          <div style={{ marginTop: 4, fontSize: 9, color: '#7A5C2E', ...ZH }}>
            ≈ NT${Math.round(parseFloat(form.eur || '0') * EUR_RATE).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Report Tab ───────────────────────────────────────────────────────────────
function ReportTab() {
  const weeklyData = [
    { label: '第1週', eur: 210, budget: 280 },
    { label: '第2週', eur: 185, budget: 280 },
    { label: '第3週', eur: 320, budget: 280 },
    { label: '本週',  eur: 95,  budget: 280 },
  ];

  const totalSpent = weeklyData.reduce((s, w) => s + w.eur, 0);
  const avgDaily   = totalSpent / (weeklyData.length * 7);
  const goldLeft   = 2000; // placeholder; can wire to state
  const runwayDays = Math.floor(goldLeft / avgDaily);

  const runwayColor =
    runwayDays >= 30 ? '#00A651' :
    runwayDays >= 14 ? '#F59E0B' : '#E74C3C';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Runway warning card */}
      <div style={{
        border: `3px solid ${runwayColor}`,
        boxShadow: `4px 4px 0 ${runwayColor}`,
        padding: '10px 14px',
        background: runwayDays < 14 ? '#FDECEA' : runwayDays < 30 ? '#FFF9E6' : '#E8F5EC',
      }}>
        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', color: runwayColor, ...EN, marginBottom: 3 }}>
          ⚠ SURVIVAL RUNWAY
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: runwayColor, ...EN, lineHeight: 1 }}>
            {runwayDays}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, ...ZH, color: runwayColor }}>天後見底</span>
        </div>
        <div style={{ marginTop: 5, fontSize: 9, color: '#666', ...ZH }}>
          現有存款 €{goldLeft} ÷ 日均支出 €{avgDaily.toFixed(1)} = {runwayDays} 天
        </div>
        {runwayDays < 14 && (
          <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, color: '#E74C3C', ...ZH }}>
            🚨 高風險：存款即將見底，請立即規劃收入來源！
          </div>
        )}
      </div>

      {/* Weekly spend bars */}
      <div style={{ border: '2.5px solid #000', overflow: 'hidden' }}>
        <div style={{
          background: '#000', color: '#fff',
          padding: '5px 10px', fontSize: 10, fontWeight: 900, ...ZH,
        }}>
          📊 週支出追蹤（預算 €280/週）
        </div>
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weeklyData.map((w, i) => {
            const pct = Math.min(100, (w.eur / w.budget) * 100);
            const over = w.eur > w.budget;
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, ...ZH }}>{w.label}</span>
                  <span style={{ fontSize: 10, ...EN, color: over ? '#E74C3C' : '#000' }}>
                    €{w.eur} / €{w.budget}
                    {over && <span style={{ marginLeft: 4, color: '#E74C3C' }}>+超支</span>}
                  </span>
                </div>
                {/* Track */}
                <div style={{
                  height: 14, background: '#e8e4da',
                  border: '2px solid #000', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${pct}%`,
                    background: over ? '#E74C3C' : '#F97316',
                    transition: 'width 0.4s ease',
                  }} />
                  {/* Budget line */}
                  <div style={{
                    position: 'absolute', left: '100%', top: -2, bottom: -2,
                    width: 2, background: '#000',
                    display: pct >= 100 ? 'none' : 'block',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
        border: '2.5px solid #000',
      }}>
        {[
          { label: '月均支出', val: `€${(totalSpent / weeklyData.length * 4).toFixed(0)}` },
          { label: '日均支出', val: `€${avgDaily.toFixed(1)}` },
          { label: 'NTD 換算', val: `NT$${Math.round(avgDaily * EUR_RATE * 30).toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '8px 10px', textAlign: 'center',
            borderRight: i < 2 ? '2px solid #000' : 'none',
            background: '#FDFBF7',
          }}>
            <div style={{ fontSize: 9, color: '#888', ...ZH }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 900, ...EN }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Guide Tab ────────────────────────────────────────────────────────────────
function GuideTab() {
  const { state, dispatch, derived } = useGame();
  const { completedTasks }           = state;
  const { ppsnDone, bankDone }       = derived;

  const stepDone: Record<string, boolean> = {
    aib_ppsn:    ppsnDone,
    aib_address: completedTasks.has('ie_house'),
    aib_online:  false,
    aib_visit:   false,
    aib_wait:    bankDone,
    aib_pin:     bankDone,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!ppsnDone && (
        <div style={{
          border: '3px solid #E74C3C', background: '#FDECEA',
          padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 11, ...ZH }}>
            <strong>尚未取得 PPSN！</strong> 前往 Task 頁面先完成「申辦 PPSN」任務。
          </div>
        </div>
      )}

      {AIB_STEPS.map((step, idx) => {
        const done = stepDone[step.id];
        return (
          <div key={step.id} style={{
            border: `2.5px solid ${done ? '#00A651' : '#000'}`,
            boxShadow: done ? '3px 3px 0 #00A651' : '3px 3px 0 #000',
            padding: '10px 12px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            background: done ? '#e8f5ec' : '#FDFBF7', transition: 'all 0.3s',
          }}>
            <div style={{
              width: 28, height: 28, border: '2.5px solid #000',
              background: done ? '#00A651' : '#FDFBF7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontWeight: 900, fontSize: 12, ...EN,
            }}>
              {done ? <span style={{ color: '#fff' }}>✓</span> : idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 14 }}>{step.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, ...ZH }}>{step.label}</span>
              </div>
              <div style={{ fontSize: 10, color: '#666', ...ZH }}>{step.note}</div>
            </div>
          </div>
        );
      })}

      <div style={{
        border: '2px dashed #003A8C', padding: '10px 12px',
        background: '#EBF5FF', display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#003A8C', ...ZH }}>📋 AIB 開戶小知識</div>
        {[
          '標準 Current Account 無月費（維持 €2,500 以上餘額）',
          '申請時需提供：護照 + PPSN + 愛爾蘭地址證明',
          '銀行卡通常 3-5 工作天郵寄到府',
          'AIB App 支援繁體中文介面切換',
          'Revolut / Wise 同時開設，兩者搭配最省手續費',
        ].map((tip, i) => (
          <div key={i} style={{ fontSize: 10, display: 'flex', gap: 5, ...ZH }}>
            <span style={{ color: '#003A8C' }}>·</span> {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AIB Screen Root ──────────────────────────────────────────────────────────
export function AIBScreen() {
  const { derived } = useGame();
  const { bankDone } = derived;
  const [activeTab, setActiveTab] = useState<Tab>('guide');

  const TABS: { id: Tab; label: string }[] = [
    { id: 'guide',  label: '🏦 開戶攻略' },
    { id: 'ledger', label: '📝 記帳本' },
    { id: 'report', label: '📊 生存報表' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(135deg,#003A8C,#0052CC)',
        color: '#fff', padding: '8px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 22 }}>🏦</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', ...EN }}>AIB Bank</div>
          <div style={{ fontSize: 9, color: '#aaa', ...ZH }}>Allied Irish Banks · 開戶 × 記帳</div>
        </div>
        {bankDone && (
          <div style={{
            marginLeft: 'auto', background: '#00A651', color: '#fff',
            border: '2px solid #fff', padding: '3px 10px', fontSize: 11, ...ZH,
          }}>✓ 開戶完成</div>
        )}
      </div>

      {/* Capsule tab bar */}
      <div style={{
        flexShrink: 0,
        display: 'flex', gap: 0,
        borderBottom: '3px solid #000',
        background: '#f0ece0',
      }}>
        {TABS.map((t, i) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            borderRight: i < TABS.length - 1 ? '2px solid #000' : 'none',
            background: activeTab === t.id ? '#000' : 'transparent',
            color: activeTab === t.id ? '#FFD700' : '#555',
            fontWeight: activeTab === t.id ? 900 : 400,
            fontSize: 10, cursor: 'pointer',
            ...ZH,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
        {activeTab === 'guide'  && <GuideTab />}
        {activeTab === 'ledger' && <LedgerTab />}
        {activeTab === 'report' && <ReportTab />}
      </div>
    </div>
  );
}
