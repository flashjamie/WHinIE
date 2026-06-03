import React from 'react';
import { useGame } from '../../context/GameContext';
import { AvatarCustomizer } from '../shared/AvatarCustomizer';
import { MultiSelectDropdown } from '../shared/MultiSelectDropdown';
import { TRANSIT_HUB_OPTIONS, AIRLINE_OPTIONS, ZH, EN } from '../../data/constants';
import type { Gender } from '../../types';

const inputBase: React.CSSProperties = {
  width: '100%', padding: '7px 10px',
  border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
  background: '#FDFBF7', fontSize: 13, outline: 'none',
  borderRadius: 3, ...ZH,
};
const labelBase: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, marginBottom: 4,
  display: 'block', letterSpacing: '0.06em', ...ZH,
};

export function SetupScreen() {
  const { state, dispatch, navigate } = useGame();
  const { player } = state;

  const set = (type: Parameters<typeof dispatch>[0]['type'], value: string) =>
    dispatch({ type: type as never, value } as never);

  const handleSubmit = () => {
    dispatch({ type: 'NAVIGATE', screen: 'HOME' });
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── LEFT 45% – Avatar ─────────────────────────────────────── */}
      <div style={{
        width: '45%', flexShrink: 0,
        borderRight: '3px solid #000',
        background: 'linear-gradient(170deg,#f0ece0 0%,#FDFBF7 60%)',
        padding: 10, display: 'flex', flexDirection: 'column',
      }}>
        <AvatarCustomizer />
      </div>

      {/* ── RIGHT 55% – Passport Form ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          background: '#000', color: '#FDFBF7',
          padding: '8px 14px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>🛂</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.08em', ...ZH }}>
              冒險者護照 — 身份設定面板
            </div>
            <div style={{ fontSize: 9, color: '#aaa', letterSpacing: '0.12em', ...EN }}>
              PASSPORT CONFIGURATION PANEL · REPUBLIC OF IRELAND
            </div>
          </div>
        </div>

        {/* Scrollable form */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: 9,
        }}>

          {/* 1. Name */}
          <div>
            <label style={labelBase}>🏷 冒險者稱號</label>
            <input
              value={player.name}
              onChange={e => dispatch({ type: 'SET_PLAYER_NAME', value: e.target.value })}
              placeholder="請輸入你的姓名..."
              style={inputBase}
            />
          </div>

          {/* 2. Gender */}
          <div>
            <label style={labelBase}>⚧ 生理性別</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { v: 'female' as Gender, label: '女 ♀', active: '#FF69B4' },
                { v: 'male'  as Gender, label: '男 ♂', active: '#1E90FF' },
              ]).map(({ v, label, active }) => (
                <button key={v}
                  onClick={() => dispatch({ type: 'SET_GENDER', value: v })}
                  style={{
                    flex: 1, padding: '9px 8px',
                    border: '3px solid #000', borderRadius: 100,
                    boxShadow: player.gender === v
                      ? 'inset 3px 3px 8px rgba(0,0,0,0.25)'
                      : '4px 4px 0 #000',
                    background: player.gender === v ? active : '#FDFBF7',
                    color:      player.gender === v ? '#fff'  : '#000',
                    cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    transform:  player.gender === v ? 'translate(2px,2px)' : 'none',
                    transition: 'all 0.15s', ...ZH,
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Logistics Core Group */}
          <div style={{
            border: '3px solid #000', boxShadow: '4px 4px 0 #000',
            padding: 9, background: '#f0ece0',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 5,
              letterSpacing: '0.06em', ...ZH,
            }}>
              <span style={{ fontSize: 14 }}>🛫</span>
              跨境後勤動態排程核心
            </div>

            {/* Date + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 7 }}>
              <div>
                <label style={{ ...labelBase, fontSize: 9 }}>啟程日期</label>
                <input type="date"
                  value={player.arrivalDate}
                  onChange={e => dispatch({ type: 'SET_ARRIVAL_DATE', value: e.target.value })}
                  style={{ ...inputBase, fontSize: 12, padding: '5px 7px' }}
                />
              </div>
              <div>
                <label style={{ ...labelBase, fontSize: 9 }}>班機時間 (24h)</label>
                <input type="time"
                  value={player.flightTime}
                  onChange={e => dispatch({ type: 'SET_FLIGHT_TIME', value: e.target.value })}
                  style={{ ...inputBase, fontSize: 12, padding: '5px 7px', ...EN }}
                />
              </div>
            </div>

            {/* Transit Hubs */}
            <div style={{ marginBottom: 7 }}>
              <MultiSelectDropdown
                label="中轉地點 (Transit Hub)"
                options={TRANSIT_HUB_OPTIONS}
                selected={player.transitHubs}
                onToggle={hub => dispatch({ type: 'TOGGLE_TRANSIT', hub })}
                tagColor="#FFD700"
              />
            </div>

            {/* Airlines */}
            <div style={{ marginBottom: 7 }}>
              <MultiSelectDropdown
                label="航空公司 (Airlines)"
                options={AIRLINE_OPTIONS}
                selected={player.airlines}
                onToggle={airline => dispatch({ type: 'TOGGLE_AIRLINE', airline })}
                tagColor="#b6e3f4"
              />
            </div>

            {/* Flight Number */}
            <div>
              <label style={{ ...labelBase, fontSize: 9 }}>航班編號 (Flight No.)</label>
              <input
                value={player.flightNumber}
                onChange={e =>
                  dispatch({
                    type: 'SET_FLIGHT_NUM',
                    value: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
                  })
                }
                placeholder="例如: EK367 或 BR087..."
                style={{ ...inputBase, fontSize: 12, padding: '5px 7px', ...EN }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ padding: '8px 14px', borderTop: '2px solid #000', flexShrink: 0 }}>
          <button
            onClick={handleSubmit}
            onMouseDown={e => {
              const b = e.currentTarget;
              b.style.transform = 'translate(4px,4px)';
              b.style.boxShadow = 'none';
            }}
            onMouseUp={e => {
              const b = e.currentTarget;
              b.style.transform = 'none';
              b.style.boxShadow = '6px 6px 0 #000';
            }}
            style={{
              width: '100%', padding: 13,
              background: 'rgba(124,58,237,0.55)',
              border: '3px solid #000', boxShadow: '6px 6px 0 #000',
              color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'all 0.1s', ...ZH,
            }}>
            👾 啟動愛爾蘭冒險
          </button>
        </div>
      </div>
    </div>
  );
}
