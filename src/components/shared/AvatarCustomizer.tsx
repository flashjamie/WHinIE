import React, { useState } from 'react';
import type { AvatarTab } from '../../types';
import {
  HAIR_OPTIONS, OUTFIT_OPTIONS, EYES_OPTIONS, MOUTH_OPTIONS,
  HAIR_COLOR_OPTIONS, buildAvatarUrl, ZH, EN,
} from '../../data/constants';
import { useGame } from '../../context/GameContext';

const TAB_LABELS: Record<AvatarTab, string> = {
  hair: '髮型', outfit: '服裝', eyes: '眼睛', mouth: '嘴巴', color: '髮色',
};

function HairPreview({ hairValue, colorValue, size = 48 }: { hairValue: string; colorValue: string; size?: number }) {
  const p = new URLSearchParams({
    seed: 'preview', backgroundColor: 'transparent',
    top: hairValue, hairColor: colorValue,
    eyes: 'default', mouth: 'default', clothe: 'hoodie',
  });
  const url = `https://api.dicebear.com/9.x/avataaars/svg?${p.toString()}`;
  return (
    <img
      src={url}
      alt={hairValue}
      style={{ width: size, height: size, display: 'block', objectFit: 'contain' }}
    />
  );
}

export function AvatarCustomizer() {
  const { state, dispatch } = useGame();
  const { avatar }          = state.player;
  const [tab, setTab]       = useState<AvatarTab>('hair');

  const currentHairColor = HAIR_COLOR_OPTIONS[avatar.hairColorIdx ?? 0]?.value ?? 'black';

  const setIdx = (idx: number) => {
    const cfg: Partial<typeof avatar> = {};
    if (tab === 'hair')   cfg.hairIdx   = idx;
    if (tab === 'outfit') cfg.outfitIdx = idx;
    if (tab === 'eyes')   cfg.eyesIdx   = idx;
    if (tab === 'mouth')  cfg.mouthIdx  = idx;
    if (tab === 'color')  cfg.hairColorIdx = idx;
    dispatch({ type: 'SET_AVATAR', cfg });
  };

  const currentIdx =
    tab === 'hair'   ? avatar.hairIdx :
    tab === 'outfit' ? avatar.outfitIdx :
    tab === 'eyes'   ? avatar.eyesIdx :
    tab === 'mouth'  ? avatar.mouthIdx :
    (avatar.hairColorIdx ?? 0);

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
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {(Object.keys(TAB_LABELS) as AvatarTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '4px 2px',
            border: '2px solid #000',
            boxShadow: tab === t ? 'none' : '2px 2px 0 #000',
            background: tab === t ? '#FFD700' : '#FDFBF7',
            cursor: 'pointer', fontSize: 9, fontWeight: 700,
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
        gridTemplateColumns: tab === 'color' ? 'repeat(5,1fr)' : 'repeat(4,1fr)',
        gap: 4, overflowY: 'auto', flex: 1,
      }}>
        {tab === 'hair' && HAIR_OPTIONS.map((opt, idx) => (
          <button key={opt.value} onClick={() => setIdx(idx)} style={{
            padding: '4px 2px',
            border: '2px solid #000',
            boxShadow: currentIdx === idx ? 'none' : '2px 2px 0 #000',
            background: currentIdx === idx ? '#FFD700' : '#FDFBF7',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
            transform: currentIdx === idx ? 'translate(2px,2px)' : 'none',
            transition: 'all 0.1s',
          }}>
            <HairPreview hairValue={opt.value} colorValue={currentHairColor} size={52} />
            <span style={{ fontSize: 9, ...ZH }}>{opt.label}</span>
          </button>
        ))}

        {tab === 'color' && HAIR_COLOR_OPTIONS.map((opt, idx) => (
          <button key={opt.value} onClick={() => setIdx(idx)} style={{
            padding: '6px 4px',
            border: `2px solid ${currentIdx === idx ? '#000' : '#ccc'}`,
            boxShadow: currentIdx === idx ? 'none' : '2px 2px 0 #000',
            background: currentIdx === idx ? '#FFD700' : '#FDFBF7',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            transform: currentIdx === idx ? 'translate(2px,2px)' : 'none',
            transition: 'all 0.1s',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: opt.swatch,
              border: '2px solid #000',
            }} />
            <span style={{ fontSize: 8, ...ZH }}>{opt.label}</span>
          </button>
        ))}

        {tab !== 'hair' && tab !== 'color' && (
          tab === 'outfit' ? OUTFIT_OPTIONS :
          tab === 'eyes'   ? EYES_OPTIONS :
          MOUTH_OPTIONS
        ).map((opt, idx) => (
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
