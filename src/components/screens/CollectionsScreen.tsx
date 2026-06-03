import React from 'react';
import { useGame } from '../../context/GameContext';
import { BADGES, ZH, EN } from '../../data/constants';

export function CollectionsScreen() {
  const { derived, state } = useGame();

  // Map unlockKey → runtime boolean
  const unlockMap: Record<string, boolean> = {
    hasComplexRouting: derived.hasComplexRouting,
    hasArrived:        derived.hasArrived,
    hasFullProfile:    derived.hasFullProfile,
    hasFlightInfo:     derived.hasFlightInfo,
    hasTransitTz:      derived.hasTransitTz,
    irpDone:           derived.irpDone,
    ppsnDone:          derived.ppsnDone,
    bankDone:          derived.bankDone,
    jobDone:           derived.jobDone,
    houseDone:         derived.houseDone,
    pubVisited:        derived.pubVisited,
    rainSurvived:      derived.rainSurvived,
  };

  const unlockedCount = BADGES.filter(b => unlockMap[b.unlockKey]).length;

  // Today as unlock date for newly unlocked badges
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });

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
          <div style={{ fontSize: 9, color: '#888', ...EN }}>MILESTONE COLLECTION · SCRAPBOOK</div>
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
          const unlocked = unlockMap[badge.unlockKey] ?? false;
          return (
            <div key={badge.id} style={{
              border: `3px solid ${unlocked ? '#000' : '#ccc'}`,
              boxShadow: unlocked ? '4px 4px 0 #000' : '4px 4px 0 #ccc',
              background: '#FDFBF7',
              padding: '10px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              position: 'relative', overflow: 'hidden',
              filter: unlocked ? 'none' : 'grayscale(90%)',
              transition: 'all 0.35s',
              animation: unlocked ? 'fadeSlideIn 0.4s ease-out both' : 'none',
            }}>
              {/* Top color strip */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 4, background: unlocked ? badge.color : '#ccc',
                transition: 'background 0.5s',
              }} />
              <span style={{ fontSize: 26, marginTop: 4 }}>{badge.emoji}</span>
              <div style={{
                fontSize: 11, fontWeight: 900, textAlign: 'center',
                color: unlocked ? '#000' : '#aaa', ...ZH,
              }}>{badge.title}</div>
              <div style={{ fontSize: 8, color: '#888', ...EN }}>{badge.titleEn}</div>
              <div style={{ fontSize: 9, color: '#666', textAlign: 'center', lineHeight: 1.3, ...ZH }}>
                {badge.desc}
              </div>

              {/* Unlock checkmark */}
              {unlocked && (
                <>
                  <div style={{
                    position: 'absolute', top: 7, right: 5,
                    background: badge.color, color: '#fff',
                    fontSize: 8, padding: '1px 4px',
                    border: '1px solid #000', ...EN,
                  }}>✓ UNLOCKED</div>
                  {/* Handwritten date sticky note */}
                  <div style={{
                    marginTop: 2,
                    background: '#FFFACD', border: '1px solid #ccc',
                    padding: '2px 5px', fontSize: 8, color: '#555',
                    transform: 'rotate(-1.5deg)',
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.15)',
                    ...EN,
                  }}>
                    {today}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 轉機狂人 special callout */}
      {derived.hasComplexRouting && (
        <div style={{
          flexShrink: 0, margin: '0 12px 10px',
          border: '3px solid #9B59B6', boxShadow: '4px 4px 0 #9B59B6',
          background: 'rgba(155,89,182,0.08)', padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'fadeSlideIn 0.5s ease-out both',
        }}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#9B59B6', ...ZH }}>
              【轉機狂人】徽章解鎖！
            </div>
            <div style={{ fontSize: 10, color: '#555', ...ZH }}>
              你選擇了複雜的多段中轉航線，展現了航線規劃大師的素養。
              解鎖日期：{today}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
