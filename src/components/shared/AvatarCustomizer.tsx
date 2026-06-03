import React, { useState } from 'react';
import type { AvatarTab } from '../../types';
import { HAIR_OPTIONS, OUTFIT_OPTIONS, EYES_OPTIONS, MOUTH_OPTIONS, buildAvatarUrl, ZH, EN } from '../../data/constants';
import { useGame } from '../../context/GameContext';

const TAB_LABELS: Record<AvatarTab, string> = {
  hair: '髮型', outfit: '服裝', eyes: '眼睛', mouth: '嘴巴',
};

export function AvatarCustomizer() {
  const { state, dispatch } = useGame();
  const { avatar }          = state.player;
  const [tab, setTab]       = useState<AvatarTab>('hair');

  const optionsMap: Record<AvatarTab, typeof HAIR_OPTIONS> = {
    hair: HAIR_OPTIONS, outfit: OUTFIT_OPTIONS, eyes: EYES_OPTIONS, mouth: MOUTH_OPTIONS,
  };
  const currentOptions = optionsMap[tab];
  const currentIdx = { hair: avatar.hairIdx, outfit: avatar.outfitIdx, eyes: avatar.eyesIdx, mouth: avatar.mouthIdx }[tab];
  const setIdx = (idx: number) =>
    dispatch({ type: 'SET_AVATAR', cfg: {
      ...(tab === 'hair'   ? { hairIdx: idx }
        : tab === 'outfit' ? { outfitIdx: idx }
        : tab === 'eyes'   ? { eyesIdx: idx }
        : { mouthIdx: idx }),
    }});

  const avatarUrl = buildAvatarUrl(avatar);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      {/* Polaroid Frame */}
      <div style={{
        position: 'relative', background: '#fff',
        border: '3px solid #000', boxShadow: '5px 5px 0 #000',
        padding: 6, flexShrink: 0,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '18px 18px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          background: '#fff', padding: '5px 5px 18px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          border: '1px solid #ddd', width: 110,
        }}>
          <img src={avatarUrl} alt="avatar" style={{ width: '100%', display: 'block' }} />
        </div>
        {/* LIVE badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#000', color: '#00FF41',
          fontSize: 8, padding: '2px 6px', letterSpacing: '0.08em',
          border: '1.5px solid #00FF41',
          display: 'flex', alignItems: 'center', gap: 3, ...EN,
        }}>
          <span style={{ animation: 'blink 1s step-start infinite' }}>●</span> LIVE
        </div>
        <div style={{ marginTop: 5, fontSize: 12, fontWeight: 700, textAlign: 'center', ...ZH }}>
          {state.player.name || '冒險者'}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {(Object.keys(TAB_LABELS) as AvatarTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '4px 2px',
            border: '2px solid #000',
            boxShadow: tab === t ? 'none' : '2px 2px 0 #000',
            background: tab === t ? '#FFD700' : '#FDFBF7',
            cursor: 'pointer', fontSize: 10, fontWeight: 700,
            transform: tab === t ? 'translate(2px,2px)' : 'none',
            transition: 'all 0.1s', ...ZH,
          }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Options grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${currentOptions.length <= 6 ? 3 : 4}, 1fr)`,
        gap: 4, overflowY: 'auto', flex: 1,
      }}>
        {currentOptions.map((opt, idx) => (
          <button key={opt.value} onClick={() => setIdx(idx)} style={{
            padding: '5px 3px',
            border: '2px solid #000',
            boxShadow: currentIdx === idx ? 'none' : '2px 2px 0 #000',
            background: currentIdx === idx ? '#FFD700' : '#FDFBF7',
            cursor: 'pointer', fontSize: 9,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            transform: currentIdx === idx ? 'translate(2px,2px)' : 'none',
            transition: 'all 0.1s', ...ZH,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
