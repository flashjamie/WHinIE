import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AvatarCustomizer } from '../shared/AvatarCustomizer';
import { MultiSelectDropdown } from '../shared/MultiSelectDropdown';
import { TRANSIT_HUB_OPTIONS, AIRLINE_OPTIONS, ZH, EN } from '../../data/constants';
import type { Gender } from '../../types';

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
  background: '#FDFBF7', fontSize: 14, outline: 'none',
  borderRadius: 3, ...ZH,
};
const labelBase: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, marginBottom: 5,
  display: 'block', letterSpacing: '0.06em', ...ZH,
};
const disabledInput: React.CSSProperties = {
  ...inputBase,
  background: '#E8E4DA', color: '#aaa',
  boxShadow: 'none', border: '2.5px solid #ccc',
  pointerEvents: 'none' as const,
};

export function SetupScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const [isFlightTBD, setIsFlightTBD] = useState(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f0ece0' }}>

      {/* ── Header ── */}
      <div style={{
        background: '#000', color: '#FDFBF7',
        padding: '10px 16px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🛂</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', ...ZH }}>
            冒險者護照 — 身份設定
          </div>
          <div style={{ fontSize: 9, color: '#aaa', letterSpacing: '0.12em', ...EN }}>
            PASSPORT CONFIGURATION · REPUBLIC OF IRELAND
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Avatar section */}
        <div style={{
          background: 'linear-gradient(170deg,#f0ece0 0%,#FDFBF7 80%)',
          borderBottom: '3px solid #000',
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', marginBottom: 10, ...ZH }}>
            🎭 角色外觀
          </div>
          <AvatarCustomizer />
        </div>

        {/* Form section */}
        <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Name */}
          <div>
            <label style={labelBase}>🏷 冒險者稱號</label>
            <input
              value={player.name}
              onChange={e => dispatch({ type: 'SET_PLAYER_NAME', value: e.target.value })}
              placeholder="請輸入你的姓名..."
              style={inputBase}
            />
          </div>

          {/* Gender */}
          <div>
            <label style={labelBase}>⚧ 生理性別</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {([
                { v: 'female' as Gender, label: '女 ♀', active: '#FF69B4' },
                { v: 'male'   as Gender, label: '男 ♂', active: '#1E90FF' },
              ]).map(({ v, label, active }) => (
                <button key={v}
                  onClick={() => dispatch({ type: 'SET_GENDER', value: v })}
                  style={{
                    flex: 1, padding: '12px 8px',
                    border: '3px solid #000', borderRadius: 100,
                    boxShadow: player.gender === v
                      ? 'inset 3px 3px 8px rgba(0,0,0,0.25)'
                      : '4px 4px 0 #000',
                    background: player.gender === v ? active : '#FDFBF7',
                    color:      player.gender === v ? '#fff' : '#000',
                    cursor: 'pointer', fontSize: 15, fontWeight: 700,
                    transform:  player.gender === v ? 'translate(2px,2px)' : 'none',
                    transition: 'all 0.15s', ...ZH,
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Flight info */}
          <div style={{
            border: '3px solid #000', boxShadow: '4px 4px 0 #000',
            padding: 12, background: '#FDFBF7',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6, ...ZH }}>
                <span style={{ fontSize: 16 }}>🛫</span>出發航班資訊
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, ...ZH }}>
                <div
                  onClick={() => setIsFlightTBD(v => !v)}
                  style={{
                    width: 18, height: 18,
                    border: '2px solid #000',
                    background: isFlightTBD ? '#FF6B35' : '#FDFBF7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  {isFlightTBD && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>
                尚未確定
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ ...labelBase, fontSize: 10, color: isFlightTBD ? '#aaa' : '#000' }}>啟程日期</label>
                <input type="date"
                  value={player.arrivalDate}
                  onChange={e => !isFlightTBD && dispatch({ type: 'SET_ARRIVAL_DATE', value: e.target.value })}
                  disabled={isFlightTBD}
                  style={isFlightTBD ? { ...disabledInput, fontSize: 13, padding: '8px 10px' } : { ...inputBase, fontSize: 13, padding: '8px 10px' }}
                />
              </div>
              <div>
                <label style={{ ...labelBase, fontSize: 10, color: isFlightTBD ? '#aaa' : '#000' }}>班機時間 (24h)</label>
                <input type="time"
                  value={player.flightTime}
                  onChange={e => !isFlightTBD && dispatch({ type: 'SET_FLIGHT_TIME', value: e.target.value })}
                  disabled={isFlightTBD}
                  style={isFlightTBD ? { ...disabledInput, fontSize: 13, padding: '8px 10px', ...EN } : { ...inputBase, fontSize: 13, padding: '8px 10px', ...EN }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10, opacity: isFlightTBD ? 0.4 : 1, pointerEvents: isFlightTBD ? 'none' : 'auto' }}>
              <MultiSelectDropdown
                label="中轉地點 (Transit Hub)"
                options={TRANSIT_HUB_OPTIONS}
                selected={player.transitHubs}
                onToggle={hub => dispatch({ type: 'TOGGLE_TRANSIT', hub })}
                tagColor="#FFD700"
              />
            </div>

            <div style={{ marginBottom: 10, opacity: isFlightTBD ? 0.4 : 1, pointerEvents: isFlightTBD ? 'none' : 'auto' }}>
              <MultiSelectDropdown
                label="航空公司 (Airlines)"
                options={AIRLINE_OPTIONS}
                selected={player.airlines}
                onToggle={airline => dispatch({ type: 'TOGGLE_AIRLINE', airline })}
                tagColor="#b6e3f4"
              />
            </div>

            <div>
              <label style={{ ...labelBase, fontSize: 10, color: isFlightTBD ? '#aaa' : '#000' }}>航班編號 (Flight No.)</label>
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
                style={isFlightTBD ? { ...disabledInput, fontSize: 13, padding: '8px 10px', ...EN } : { ...inputBase, fontSize: 13, padding: '8px 10px', ...EN }}
              />
            </div>

            {isFlightTBD && (
              <div style={{
                marginTop: 10, padding: '7px 10px',
                background: '#FFE082', border: '2px solid #F59E0B',
                fontSize: 10, ...ZH, color: '#7C5A00',
              }}>
                ⏳ 航班資訊未定，稍後可在此補填。
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ paddingBottom: 20 }}>
            <button
              onClick={handleSubmit}
              onMouseDown={e => {
                if (!isFormValid) return;
                e.currentTarget.style.transform = 'translate(4px,4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={e => {
                if (!isFormValid) return;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '6px 6px 0 #000';
              }}
              style={{
                width: '100%', padding: 15,
                background: isFormValid ? 'rgba(124,58,237,0.6)' : 'rgba(180,180,180,0.5)',
                border: '3px solid #000',
                boxShadow: isFormValid ? '6px 6px 0 #000' : 'none',
                color: isFormValid ? '#fff' : '#aaa',
                fontSize: 16, fontWeight: 900,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                opacity: isFormValid ? 1 : 0.5,
                letterSpacing: '0.06em', transition: 'all 0.1s',
                pointerEvents: isFormValid ? 'auto' : 'none',
                ...ZH,
              }}>
              👾 啟動愛爾蘭冒險
            </button>
            {!isFormValid && (
              <div style={{ textAlign: 'center', fontSize: 10, marginTop: 6, color: '#E74C3C', ...ZH }}>
                ✗ 請填寫姓名、性別，以及航班資訊（或勾選「尚未確定」）
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
