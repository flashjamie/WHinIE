import React from 'react';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

// ─── World Map SVG ────────────────────────────────────────────────────────────
// ViewBox 0 0 800 420, equirectangular projection
// x = (lon+180)/360×800,  y = (85-lat)/170×420
// Taiwan  (25°N, 121°E) → (669, 141)
// Ireland (53°N,  -8°E) → (382,  79)
function WorldMap() {
  const LAND = '#8dc04a';
  const LAND_S = '#5a8a2e';
  const OCEAN = '#6bbde3';

  return (
    <svg viewBox="0 0 800 420" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="800" height="420" fill={OCEAN} />

      {/* vintage grid */}
      {[80,160,240,320,400,480,560,640,720].map(x =>
        <line key={`vg${x}`} x1={x} y1={0} x2={x} y2={420} stroke="rgba(0,0,100,0.07)" strokeWidth="0.5" />)}
      {[60,120,180,240,300,360].map(y =>
        <line key={`hg${y}`} x1={0} y1={y} x2={800} y2={y} stroke="rgba(0,0,100,0.07)" strokeWidth="0.5" />)}

      {/* ── Continents (simplified polygons) ── */}

      {/* North America */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 55,42 L 95,30 L 135,32 L 165,28 L 192,36 L 205,50 L 208,66
        L 198,80 L 185,96 L 178,115 L 182,138 L 178,160 L 165,180
        L 150,198 L 138,215 L 125,208 L 112,192 L 100,175
        L 88,158 L 76,142 L 68,124 L 66,104 L 70,82 L 60,62 Z" />

      {/* Greenland */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 210,18 L 238,12 L 258,20 L 262,35 L 245,46 L 220,48 L 208,36 Z" />

      {/* Central America */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 150,198 L 162,205 L 168,218 L 162,230 L 152,232 L 144,222 Z" />

      {/* South America */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 162,238 L 185,228 L 210,235 L 225,252 L 232,272 L 235,298
        L 228,325 L 216,350 L 202,370 L 188,375 L 174,368
        L 162,350 L 154,325 L 150,298 L 150,270 L 154,250 Z" />

      {/* Europe */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 338,80 L 355,65 L 372,58 L 390,60 L 404,70 L 408,82
        L 400,92 L 385,100 L 368,104 L 352,98 L 340,88 Z" />

      {/* Scandinavia */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 370,55 L 384,42 L 396,34 L 410,40 L 413,54 L 404,65
        L 390,68 L 375,62 Z" />

      {/* UK */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 346,65 L 354,60 L 358,68 L 354,76 L 346,74 Z" />

      {/* Ireland (small, near pin) */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 337,68 L 344,64 L 347,70 L 343,76 L 336,74 Z" />

      {/* Eurasia main body */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 345,82 L 390,68 L 435,62 L 478,64 L 518,68 L 556,72
        L 592,76 L 626,84 L 656,96 L 680,112 L 700,130
        L 710,152 L 705,172 L 688,186 L 664,196 L 636,202
        L 608,205 L 578,204 L 550,200 L 522,194 L 498,186
        L 475,178 L 455,168 L 436,156 L 418,144 L 402,130
        L 388,116 L 372,104 L 356,96 L 344,90 Z" />

      {/* India */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 550,148 L 570,142 L 584,154 L 588,174 L 580,198
        L 564,212 L 550,210 L 540,196 L 537,174 L 542,156 Z" />

      {/* Indochina */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 622,164 L 638,158 L 650,168 L 646,186 L 634,196 L 620,190 L 614,176 Z" />

      {/* Africa */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 358,130 L 392,120 L 424,124 L 442,138 L 448,158 L 445,182
        L 438,208 L 427,234 L 416,260 L 408,285 L 402,312
        L 396,338 L 388,356 L 378,358 L 368,346 L 360,320
        L 355,292 L 353,264 L 352,236 L 350,208 L 348,182
        L 350,158 L 354,140 Z" />

      {/* Arabian Peninsula */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 452,124 L 474,116 L 495,122 L 502,138 L 496,158
        L 478,166 L 460,160 L 450,145 Z" />

      {/* Australia */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 640,262 L 668,252 L 698,255 L 722,268 L 732,286
        L 728,308 L 712,320 L 685,324 L 658,318 L 640,305
        L 632,286 L 634,270 Z" />

      {/* Japan */}
      <path fill={LAND} stroke={LAND_S} strokeWidth="0.8" d="
        M 698,96 L 707,90 L 714,98 L 711,110 L 702,114 L 696,106 Z" />

      {/* ── TRAVEL JOURNAL watermark ── */}
      <text x="400" y="215" textAnchor="middle"
        fill="rgba(0,0,0,0.07)" fontSize="58" fontStyle="italic"
        fontFamily="'Georgia', serif" letterSpacing="6" fontWeight="bold">TRAVEL</text>
      <text x="400" y="278" textAnchor="middle"
        fill="rgba(0,0,0,0.07)" fontSize="58" fontStyle="italic"
        fontFamily="'Georgia', serif" letterSpacing="6" fontWeight="bold">JOURNAL</text>

      {/* ── Flight path: Taiwan(669,141) → Ireland(382,79) ── */}
      {/* Control point high north: (490, 14) for a nice arc */}
      <path d="M 669,141 Q 500,14 382,79"
        stroke="#1a1a1a" strokeWidth="1.8" strokeDasharray="5,4"
        fill="none" opacity="0.7" />

      {/* ── 3D Pins ── */}
      {/* Taiwan pin */}
      <ellipse cx={669} cy={150} rx={5} ry={2} fill="rgba(0,0,0,0.2)" />
      <path d="M 669,115 L 673,141 L 665,141 Z" fill="#c0392b" />
      <circle cx={669} cy={112} r={10} fill="#e74c3c" stroke="#c0392b" strokeWidth="1.5" />
      <circle cx={666} cy={109} r={3.5} fill="rgba(255,255,255,0.45)" />
      <text x="669" y="143" textAnchor="middle" fontSize="8" fill="#333" fontFamily="sans-serif"
        fontWeight="700" dy="10">台灣</text>

      {/* Ireland pin */}
      <ellipse cx={382} cy={88} rx={5} ry={2} fill="rgba(0,0,0,0.2)" />
      <path d="M 382,54 L 386,79 L 378,79 Z" fill="#c0392b" />
      <circle cx={382} cy={51} r={10} fill="#e74c3c" stroke="#c0392b" strokeWidth="1.5" />
      <circle cx={379} cy={48} r={3.5} fill="rgba(255,255,255,0.45)" />
      <text x="382" y="81" textAnchor="middle" fontSize="8" fill="#333" fontFamily="sans-serif"
        fontWeight="700" dy="10">愛爾蘭</text>

      {/* ── Plane at midpoint of bezier (t=0.5) ── */}
      {/* P(0.5) = 0.25×(669,141) + 0.5×(500,14) + 0.25×(382,79) = (513, 62) */}
      {/* Tangent direction: going left+slightly down → rotate ~200° */}
      <g transform="translate(513,57) rotate(200)">
        <text fontSize="22" textAnchor="middle" dominantBaseline="middle">✈</text>
      </g>
    </svg>
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

            {/* Social login buttons */}
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
