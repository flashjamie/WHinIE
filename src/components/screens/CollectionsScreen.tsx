import React from 'react';
import { useGame } from '../../context/GameContext';
import { BADGES, ZH, EN } from '../../data/constants';

export function CollectionsScreen() {
  const { state } = useGame();
  const { unlockedBadges } = state;

  const unlockedCount = unlockedBadges.size;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#2C1A0E', color: '#C9A96E',
        padding: '10px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>📔</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', ...ZH }}>時空旅人里程碑</div>
          <div style={{ fontSize: 9, color: '#8B6239', ...EN }}>MILESTONE COLLECTION · SCRAPBOOK</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: '#FFD700', color: '#000',
          padding: '3px 10px', border: '2px solid #000',
          fontSize: 11, fontWeight: 700, ...EN,
        }}>
          {unlockedCount} / {BADGES.length}
        </div>
      </div>

      {/* Badge grid */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 12,
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,
        alignContent: 'start',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '22px 22px',
      }}>
        {BADGES.map(badge => {
          const unlocked = unlockedBadges.has(badge.id);

          if (!unlocked) {
            // Hidden badge — show mystery card
            return (
              <div key={badge.id} style={{
                border: '3px solid #ccc',
                boxShadow: '4px 4px 0 #ccc',
                background: '#f0ece0',
                padding: '10px 6px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 4, background: '#ccc',
                }} />
                <span style={{ fontSize: 26, marginTop: 4, filter: 'grayscale(1) opacity(0.25)' }}>🔒</span>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#bbb', ...ZH }}>???</div>
                <div style={{ fontSize: 8, color: '#ccc', ...EN }}>LOCKED</div>
                <div style={{
                  fontSize: 9, color: '#ccc', textAlign: 'center',
                  lineHeight: 1.3, ...ZH,
                }}>完成相關任務後解鎖</div>
              </div>
            );
          }

          // Unlocked badge
          return (
            <div key={badge.id} style={{
              border: `3px solid #000`,
              boxShadow: '4px 4px 0 #000',
              background: '#FDFBF7',
              padding: '10px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              position: 'relative', overflow: 'hidden',
              animation: 'fadeSlideIn 0.4s ease-out both',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: badge.color,
              }} />
              <div style={{
                position: 'absolute', top: 7, right: 5,
                background: badge.color, color: '#fff',
                fontSize: 8, padding: '1px 4px',
                border: '1px solid #000', ...EN,
              }}>✓ UNLOCKED</div>
              <span style={{ fontSize: 26, marginTop: 4 }}>{badge.emoji}</span>
              <div style={{ fontSize: 11, fontWeight: 900, textAlign: 'center', color: '#000', ...ZH }}>
                {badge.title}
              </div>
              <div style={{ fontSize: 8, color: '#888', ...EN }}>{badge.titleEn}</div>
              <div style={{ fontSize: 9, color: '#666', textAlign: 'center', lineHeight: 1.3, ...ZH }}>
                {badge.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {unlockedCount === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          textAlign: 'center', opacity: 0.4,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 40 }}>📔</div>
          <div style={{ fontSize: 11, marginTop: 8, ...ZH }}>完成任務後徽章將在此解鎖</div>
        </div>
      )}
    </div>
  );
}
