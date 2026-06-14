import React, { useState } from 'react';
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
const disabledInput: React.CSSProperties = {
  ...inputBase,
  background: '#E8E4DA', color: '#aaa',
  boxShadow: 'none', border: '2.5px solid #ccc',
  pointerEvents: 'none' as const,
};

export function SetupScreen() {
  const { state, dispatch, navigate } = useGame();
  const { player } = state;

  const [isFlightTBD, setIsFlightTBD] = useState(false);

  // Validation
  const isFormValid =
    player.name.trim() !== '' &&
    player.gender !== '' &&
    (isFlightTBD || (
      player.arrivalDate !== '' &&
      player.flightTime !== '' &&
      player.flightNumber !== ''
    ));

  const handleSubmit = () => {
    if (!isFormValid) return;
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

          {/* 3. 出發航班資訊 */}
          <div style={{
            border: '3px solid #000', boxShadow: '4px 4px 0 #000',
            padding: 9, background: '#f0ece0',
          }}>
            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 900,
                display: 'flex', alignItems: 'center', gap: 5,
                letterSpacing: '0.06em', ...ZH,
              }}>
                <span style={{ fontSize: 14 }}>🛫</span>
                出發航班資訊
              </div>

              {/* TBD checkbox */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', fontSize: 10, fontWeight: 700, ...ZH,
              }}>
                <div
                  onClick={() => setIsFlightTBD(v => !v)}
                  style={{
                    width: 16, height: 16,
                    border: '2px solid #000',
                    background: isFlightTBD ? '#FF6B35' : '#FDFBF7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {isFlightTBD && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>
                尚未確定
              </label>
            </div>

            {/* Date + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 7 }}>
              <div>
                <label style={{ ...labelBase, fontSize: 9, color: isFlightTBD ? '#aaa' : '#000' }}>啟程日期</label>
                <input type="date"
                  value={player.arrivalDate}
                  onChange={e => !isFlightTBD && dispatch({ type: 'SET_ARRIVAL_DATE', value: e.target.value })}
                  disabled={isFlightTBD}
                  style={isFlightTBD ? { ...disabledInput, fontSize: 12, padding: '5px 7px' } : { ...inputBase, fontSize: 12, padding: '5px 7px' }}
                />
              </div>
              <div>
                <label style={{ ...labelBase, fontSize: 9, color: isFlightTBD ? '#aaa' : '#000' }}>班機時間 (24h)</label>
                <input type="time"
                  value={player.flightTime}
                  onChange={e => !isFlightTBD && dispatch({ type: 'SET_FLIGHT_TIME', value: e.target.value })}
                  disabled={isFlightTBD}
                  style={isFlightTBD ? { ...disabledInput, fontSize: 12, padding: '5px 7px', ...EN } : { ...inputBase, fontSize: 12, padding: '5px 7px', ...EN }}
                />
              </div>
            </div>

            {/* Transit Hubs */}
            <div style={{ marginBottom: 7, opacity: isFlightTBD ? 0.4 : 1, pointerEvents: isFlightTBD ? 'none' : 'auto' }}>
              <MultiSelectDropdown
                label="中轉地點 (Transit Hub)"
                options={TRANSIT_HUB_OPTIONS}
                selected={player.transitHubs}
                onToggle={hub => dispatch({ type: 'TOGGLE_TRANSIT', hub })}
                tagColor="#FFD700"
              />
            </div>

            {/* Airlines */}
            <div style={{ marginBottom: 7, opacity: isFlightTBD ? 0.4 : 1, pointerEvents: isFlightTBD ? 'none' : 'auto' }}>
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
              <label style={{ ...labelBase, fontSize: 9, color: isFlightTBD ? '#aaa' : '#000' }}>航班編號 (Flight No.)</label>
              <input
                value={player.flightNumber}
                onChange={e =>
                  !isFlightTBD && dispatch({
                    type: 'SET_FLIGHT_NUM',
                    value: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
                  })
                }
                disabled={isFlightTBD}
                placeholder="例如: EK367 或 BR087..."
                style={isFlightTBD ? { ...disabledInput, fontSize: 12, padding: '5px 7px', ...EN } : { ...inputBase, fontSize: 12, padding: '5px 7px', ...EN }}
              />
            </div>

            {/* TBD notice */}
            {isFlightTBD && (
              <div style={{
                marginTop: 8, padding: '5px 8px',
                background: '#FFE082', border: '2px solid #F59E0B',
                fontSize: 9, ...ZH, color: '#7C5A00',
              }}>
                ⏳ 航班資訊未定，稍後可在此補填。
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{ padding: '8px 14px', borderTop: '2px solid #000', flexShrink: 0 }}>
          <button
            onClick={handleSubmit}
            onMouseDown={e => {
              if (!isFormValid) return;
              const b = e.currentTarget;
              b.style.transform = 'translate(4px,4px)';
              b.style.boxShadow = 'none';
            }}
            onMouseUp={e => {
              if (!isFormValid) return;
              const b = e.currentTarget;
              b.style.transform = 'none';
              b.style.boxShadow = '6px 6px 0 #000';
            }}
            style={{
              width: '100%', padding: 13,
              background: isFormValid ? 'rgba(124,58,237,0.55)' : 'rgba(180,180,180,0.5)',
              border: '3px solid #000',
              boxShadow: isFormValid ? '6px 6px 0 #000' : 'none',
              color: isFormValid ? '#fff' : '#aaa',
              fontSize: 15, fontWeight: 900,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              opacity: isFormValid ? 1 : 0.5,
              letterSpacing: '0.06em', transition: 'all 0.1s',
              pointerEvents: isFormValid ? 'auto' : 'none',
              ...ZH,
            }}>
            👾 啟動愛爾蘭冒險
          </button>
          {!isFormValid && (
            <div style={{
              textAlign: 'center', fontSize: 9, marginTop: 4,
              color: '#E74C3C', ...ZH,
            }}>
              ✗ 請填寫姓名、性別，以及航班資訊（或勾選「尚未確定」）
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
