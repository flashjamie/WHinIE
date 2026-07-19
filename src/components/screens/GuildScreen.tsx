import React, { useState } from 'react';
import { GUILD_POSTS, ZH, EN } from '../../data/constants';
import { useGame } from '../../context/GameContext';

export function GuildScreen() {
  const { state } = useGame();
  const [likes, setLikes] = useState<Record<string, number>>({});

  const like = (id: string) =>
    setLikes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#2C1A0E', color: '#C9A96E',
        padding: '10px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>⚔️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, ...ZH }}>冒險者公會</div>
          <div style={{ fontSize: 9, color: '#888', ...EN }}>GUILD BOARD · Community Notes</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: '#FFD700', color: '#000',
          border: '2px solid #000', padding: '3px 10px', fontSize: 11, ...ZH,
        }}>
          台灣人在愛爾蘭
        </div>
      </div>

      {/* Board */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        backgroundImage: `
          repeating-linear-gradient(
            0deg, transparent, transparent 23px,
            rgba(0,0,0,0.04) 24px
          )
        `,
      }}>
        {GUILD_POSTS.map(post => (
          <div key={post.id} style={{
            border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
            background: '#FDFBF7', padding: '10px 12px',
          }}>
            {/* Author row */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <div style={{
                width: 32, height: 32, border: '2px solid #000',
                background: '#b6e3f4', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>
                {post.avatar}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, ...EN }}>{post.author}</div>
                <div style={{ fontSize: 9, color: '#888', ...ZH }}>{post.time}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    background: '#FFD700', border: '1px solid #000',
                    padding: '1px 5px', fontSize: 8, ...ZH,
                  }}>#{tag}</span>
                ))}
              </div>
            </div>
            {/* Content */}
            <div style={{ fontSize: 11, lineHeight: 1.6, color: '#222', ...ZH }}>
              {post.content}
            </div>
            {/* Like row */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => like(post.id)} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                border: '1.5px solid #000', background: '#FDFBF7',
                padding: '3px 8px', cursor: 'pointer', fontSize: 10,
                boxShadow: '2px 2px 0 #000',
                ...ZH,
              }}>
                ❤️ {post.likes + (likes[post.id] ?? 0)}
              </button>
              <span style={{ fontSize: 9, color: '#aaa', ...ZH }}>分享你的看法</span>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{
          border: '2px dashed #ccc', padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8, background: '#f5f0e8',
        }}>
          <span style={{ fontSize: 16 }}>✍️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, ...ZH }}>
              {state.player.name || '冒險者'}
              {state.player.city && (
                <span style={{
                  marginLeft: 6, fontSize: 8, fontWeight: 900,
                  background: '#FFD700', color: '#000', padding: '1px 5px',
                  border: '1px solid #000', ...EN,
                }}>📍 座標：{state.player.city}</span>
              )}
            </div>
            <div style={{ fontSize: 9, color: '#888', marginTop: 2, ...ZH }}>加入討論吧！（貼文功能即將上線）</div>
          </div>
        </div>
      </div>
    </div>
  );
}
