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
    <div style={{ width: '100%', height: '100%', background: '#F2EBD9', position: 'relative' }}>
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: 153, center: [10, 15] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#C4A87A"
                stroke="#F2EBD9"
                strokeWidth={0.8}
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
          stroke="#7A5C2E"
          strokeWidth={1.5}
          strokeDasharray="4,3"
          strokeLinecap="round"
        />

        {/* Taiwan pin */}
        <Marker coordinates={TW}>
          <circle r={5} fill="#8B3A2A" stroke="#F2EBD9" strokeWidth={1.5} />
          <circle r={2} cx={-1.5} cy={-1.5} fill="rgba(255,255,255,0.4)" />
          <text y={14} textAnchor="middle" fontSize={7} fontWeight="bold"
            fill="#4A3010" fontFamily="Georgia, serif">台灣</text>
        </Marker>

        {/* Ireland pin */}
        <Marker coordinates={IE}>
          <circle r={5} fill="#8B3A2A" stroke="#F2EBD9" strokeWidth={1.5} />
          <circle r={2} cx={-1.5} cy={-1.5} fill="rgba(255,255,255,0.4)" />
          <text y={14} textAnchor="middle" fontSize={7} fontWeight="bold"
            fill="#4A3010" fontFamily="Georgia, serif">愛爾蘭</text>
        </Marker>
      </ComposableMap>
    </div>
  );
}

// ─── Cover Screen ─────────────────────────────────────────────────────────────
export function CoverScreen() {
  const { state, navigate } = useGame();
  const [showLogin, setShowLogin] = React.useState(false);

  const handleLogin = (_provider: string) => {
    navigate(!state.player.name ? 'SETUP' : 'HOME');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#2C1A08',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 12,
    }}>
      {/* Portrait warning */}
      <div style={{
        display: 'none',
        position: 'absolute', inset: 0, background: '#2C1A08', zIndex: 999,
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }} className="portrait-warning">
        <div style={{ fontSize: 48 }}>📱</div>
        <div style={{ color: '#C4A87A', fontSize: 16, fontWeight: 700, ...ZH }}>請旋轉裝置為橫向</div>
        <div style={{ color: '#8B7050', fontSize: 12, ...EN }}>Please rotate to landscape</div>
      </div>

      {/* Book frame */}
      <div style={{
        width: '100%', maxWidth: 900,
        height: '100%', maxHeight: 570,
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        background: '#F2EBD9',
        /* Book spine shadow on left */
        boxShadow: 'inset 6px 0 18px rgba(0,0,0,0.18), 14px 14px 0 #1A0D06, 0 0 50px rgba(0,0,0,0.6)',
        border: '1px solid #B8A882',
      }}>

        {/* Linen texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(180,160,120,0.06) 2px, rgba(180,160,120,0.06) 4px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 3px,
            rgba(180,160,120,0.04) 3px, rgba(180,160,120,0.04) 6px
          )`,
        }} />

        {/* Spine accent */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
          background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
          zIndex: 2,
        }} />

        {/* Map — top 60% */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 0 }}>
          <WorldMap />
        </div>

        {/* Bottom panel */}
        <div style={{
          background: '#F2EBD9',
          borderTop: '1.5px solid rgba(180,150,100,0.4)',
          padding: '12px 28px 16px',
          zIndex: 3,
          flexShrink: 0,
        }}>
          {!showLogin ? (
            /* Title view */
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  fontSize: 36, fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1,
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  color: '#2C1A08',
                }}>TRAVEL</div>
                <div style={{
                  fontSize: 36, fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1,
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  color: '#2C1A08',
                }}>JOURNAL</div>
                <div style={{
                  fontSize: 10, letterSpacing: '0.25em', marginTop: 4,
                  color: '#7A5C2E', fontFamily: "'Georgia', serif",
                }}>WORKING HOLIDAY · IRELAND</div>
              </div>

              {/* Open button */}
              <button onClick={() => setShowLogin(true)} style={{
                padding: '10px 22px',
                background: '#2C1A08',
                color: '#F2EBD9',
                border: '2px solid #2C1A08',
                cursor: 'pointer',
                fontFamily: "'Georgia', serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.15em',
                boxShadow: '4px 4px 0 #7A5C2E',
                transition: 'all 0.1s',
              }}
                onMouseDown={e => { e.currentTarget.style.transform = 'translate(4px,4px)'; e.currentTarget.style.boxShadow = 'none'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #7A5C2E'; }}
              >
                OPEN ☘
              </button>
            </div>
          ) : (
            /* Login view */
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#2C1A08', ...ZH, marginBottom: 8 }}>
                  ☘ 冒險者登入
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleLogin('google')} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                    padding: '8px 10px', border: '2px solid #2C1A08',
                    boxShadow: '3px 3px 0 #7A5C2E', background: '#fff',
                    cursor: 'pointer', fontWeight: 700, fontSize: 11, ...EN,
                  }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 #7A5C2E'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google 登入
                  </button>
                  <button onClick={() => handleLogin('apple')} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                    padding: '8px 10px', border: '2px solid #2C1A08',
                    boxShadow: '3px 3px 0 #7A5C2E', background: '#2C1A08',
                    cursor: 'pointer', fontWeight: 700, fontSize: 11, color: '#F2EBD9', ...EN,
                  }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 #7A5C2E'; }}
                  >
                    <svg width="12" height="14" viewBox="0 0 814 1000" fill="#F2EBD9">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-148.4-106c-43.3-68.8-68.7-136.3-68.7-200.9 0-178.7 171.2-283.7 338.7-283.7 82.1 0 150.3 37.5 201.9 37.5 49.4 0 126.7-40.8 220.9-40.8 36.5 0 86.5 3.5 122.7 40.2zm-352.4-87.5c19.1-22.3 35.6-53.5 35.6-84.7 0-4.5-.4-9-1.2-12.6-33.6 1.3-73.9 22.3-97.6 47.8-18.4 20.5-37.1 51.7-37.1 83.3 0 4.9.7 9.8 1 11.5 2.1.4 5.2.7 8.2.7 30.5 0 68.9-20.1 91.1-45.9z"/>
                    </svg>
                    Apple 登入
                  </button>
                </div>
                <div style={{ fontSize: 8, color: '#9A8060', marginTop: 4, ...ZH }}>
                  登入即同意服務條款 · Prototype 版本
                </div>
              </div>
              <button onClick={() => setShowLogin(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#7A5C2E', fontSize: 18, lineHeight: 1,
              }}>←</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (orientation: portrait) {
          .portrait-warning { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
