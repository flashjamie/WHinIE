import React from 'react';
import { useGame } from '../../context/GameContext';
import { AIB_STEPS, ZH, EN } from '../../data/constants';

export function AIBScreen() {
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(135deg,#003A8C,#0052CC)',
        color: '#fff', padding: '10px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 22 }}>🏦</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', ...EN }}>AIB Bank</div>
          <div style={{ fontSize: 9, color: '#aaa', ...ZH }}>Allied Irish Banks · 開戶攻略</div>
        </div>
        {bankDone && (
          <div style={{
            marginLeft: 'auto', background: '#00A651', color: '#fff',
            border: '2px solid #fff', padding: '3px 10px', fontSize: 11, ...ZH,
          }}>
            ✓ 開戶完成
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Warning if no PPSN */}
        {!ppsnDone && (
          <div style={{
            border: '3px solid #E74C3C', background: '#FDECEA',
            padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 11, ...ZH }}>
              <strong>尚未取得 PPSN！</strong> 前往 Task 頁面先完成「申辦 PPSN」任務，沒有 PPSN 無法辦理 AIB 銀行帳戶。
            </div>
          </div>
        )}

        {/* Step-by-step guide */}
        {AIB_STEPS.map((step, idx) => {
          const done = stepDone[step.id];
          return (
            <div key={step.id} style={{
              border: `2.5px solid ${done ? '#00A651' : '#000'}`,
              boxShadow: done ? '3px 3px 0 #00A651' : '3px 3px 0 #000',
              padding: '10px 12px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
              background: done ? '#e8f5ec' : '#FDFBF7',
              transition: 'all 0.3s',
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

        {/* Info card */}
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
            <div key={i} style={{
              fontSize: 10, display: 'flex', gap: 5, alignItems: 'flex-start', ...ZH,
            }}>
              <span style={{ color: '#003A8C' }}>·</span> {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
