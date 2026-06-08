import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const TW: [number, number] = [121, 25];
const IE: [number, number] = [-8, 53];

// ─── World Map ────────────────────────────────────────────────────────────────
function WorldMap() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#6bbde3', position: 'relative' }}>
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: 153, center: [20, 20] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#8dc04a"
                stroke="#5a8a2e"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover:   { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Flight arc */}
        <Line
          from={TW}
          to={IE}
          stroke="#1a1a1a"
          strokeWidth={1.8}
          strokeDasharray="5,4"
          strokeLinecap="round"
        />

        {/* Taiwan pin */}
        <Marker coordinates={TW}>
          <circle r={6} fill="#e74c3c" stroke="#c0392b" strokeWidth={1.5} />
          <circle r={2.5} cx={-2} cy={-2} fill="rgba(255,255,255,0.5)" />
          <text y={16} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#1a1a1a" fontFamily="sans-serif">台灣</text>
        </Marker>

        {/* Ireland pin */}
        <Marker coordinates={IE}>
          <circle r={6} fill="#e74c3c" stroke="#c0392b" strokeWidth={1.5} />
          <circle r={2.5} cx={-2} cy={-2} fill="rgba(255,255,255,0.5)" />
          <text y={16} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#1a1a1a" fontFamily="sans-serif">愛爾蘭</text>
        </Marker>
      </ComposableMap>

      {/* TRAVEL JOURNAL watermark */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: 52, fontWeight: 900, fontStyle: 'italic',
          fontFamily: "'Georgia', serif", letterSpacing: '0.15em',
          color: 'rgba(0,0,0,0.06)', lineHeight: 1.1, userSelect: 'none',
        }}>TRAVEL</div>
        <div style={{
          fontSize: 52, fontWeight: 900, fontStyle: 'italic',
          fontFamily: "'Georgia', serif", letterSpacing: '0.15em',
          color: 'rgba(0,0,0,0.06)', lineHeight: 1.1, userSelect: 'none',
        }}>JOURNAL</div>
      </div>
    </div>
  );
}

// ─── Cover Screen ─────────────────────────────────────────────────────────────
export function CoverScreen() {
  const { state, navigate } = useGame();

  const handleLogin = (_provider: string) => {
    const isFirstTime = !state.player.name;
    navigate(isFirstTime ? 'SETUP' : 'HOME');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 8,
    }}>
      {/* Portrait mode warning */}
      <div style={{
        display: 'none',
        position: 'absolute', inset: 0, background: '#1A0D06',
        zIndex: 999, alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }} className="portrait-warning">
        <div style={{ fontSize: 48 }}>📱</div>
        <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, ...ZH }}>
          請旋轉裝置為橫向
        </div>
        <div style={{ color: '#C9A96E', fontSize: 12, ...EN }}>
          Please rotate to landscape
        </div>
      </div>

      {/* Book cover frame */}
      <div style={{
        width: '100%', maxWidth: 920,
        height: '100%', maxHeight: 580,
        display: 'flex', flexDirection: 'column',
        border: '6px solid #000',
        boxShadow: '12px 12px 0 #000, 0 0 60px rgba(0,0,0,0.7)',
        position: 'relative', overflow: 'hidden',
        background: '#FDFBF7',
      }}>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <WorldMap />

          {/* Login card overlay */}
          <div style={{
            position: 'absolute', bottom: 18, left: '50%',
            transform: 'translateX(-50%)',
            background: '#FDFBF7',
            border: '3px solid #000',
            boxShadow: '5px 5px 0 #000',
            padding: '14px 20px',
            width: 280,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 13, letterSpacing: '0.15em', ...ZH }}>
              ☘ 冒險者登入
            </div>

            <button onClick={() => handleLogin('google')} style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              padding: '7px 12px', border: '2px solid #000',
              boxShadow: '3px 3px 0 #000', background: '#fff',
              cursor: 'pointer', fontWeight: 700, fontSize: 11,
              transition: 'all 0.1s', ...EN,
            }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translate(3px,3px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 #000'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              以 Google 繼續
            </button>

            <button onClick={() => handleLogin('apple')} style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              padding: '7px 12px', border: '2px solid #000',
              boxShadow: '3px 3px 0 #000', background: '#000',
              cursor: 'pointer', fontWeight: 700, fontSize: 11, color: '#fff',
              transition: 'all 0.1s', ...EN,
            }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translate(3px,3px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 #000'; }}
            >
              <svg width="14" height="16" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-148.4-106c-43.3-68.8-68.7-136.3-68.7-200.9 0-178.7 171.2-283.7 338.7-283.7 82.1 0 150.3 37.5 201.9 37.5 49.4 0 126.7-40.8 220.9-40.8 36.5 0 86.5 3.5 122.7 40.2zm-352.4-87.5c19.1-22.3 35.6-53.5 35.6-84.7 0-4.5-.4-9-1.2-12.6-33.6 1.3-73.9 22.3-97.6 47.8-18.4 20.5-37.1 51.7-37.1 83.3 0 4.9.7 9.8 1 11.5 2.1.4 5.2.7 8.2.7 30.5 0 68.9-20.1 91.1-45.9z"/>
              </svg>
              以 Apple 繼續
            </button>

            <div style={{ textAlign: 'center', fontSize: 9, color: '#888', ...ZH }}>
              登入即同意服務條款 · Prototype 版本
            </div>
          </div>
        </div>

        {/* Bottom title strip */}
        <div style={{
          background: '#000', color: '#FDFBF7',
          padding: '6px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '3px solid #000',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', ...ZH }}>
            ☘ Working Holiday Ireland
          </span>
          <span style={{
            fontSize: 18, fontWeight: 900, letterSpacing: '0.3em',
            fontFamily: "'Georgia', serif", fontStyle: 'italic',
          }}>
            TRAVEL JOURNAL
          </span>
          <span style={{ fontSize: 10, color: '#FFD700', letterSpacing: '0.1em', ...EN }}>
            v1.0 · PROTOTYPE
          </span>
        </div>
      </div>

      {/* Landscape prompt CSS */}
      <style>{`
        @media (orientation: portrait) {
          .portrait-warning { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
