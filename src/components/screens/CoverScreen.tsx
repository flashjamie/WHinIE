import React, { useRef, useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, useMapContext } from 'react-simple-maps';
import { useGame } from '../../context/GameContext';
import { ZH, EN } from '../../data/constants';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const TW: [number, number] = [121, 25];
const IE: [number, number] = [-8, 53];

// ─── Web Audio page-turn synthesizer ─────────────────────────────────────────
function playPageTurn() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Layer 1: filtered noise burst (main rustle)
    const bufLen  = ctx.sampleRate * 0.35;
    const buffer  = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);

    const source  = ctx.createBufferSource();
    source.buffer = buffer;

    const filter  = ctx.createBiquadFilter();
    filter.type   = 'bandpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
    filter.Q.value = 0.8;

    const gain    = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    // Layer 2: second softer swish slightly delayed
    const buf2   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d2     = buf2.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d2[i] = (Math.random() * 2 - 1);
    const src2   = ctx.createBufferSource();
    src2.buffer  = buf2;
    const f2     = ctx.createBiquadFilter();
    f2.type      = 'lowpass';
    f2.frequency.value = 1200;
    const g2     = ctx.createGain();
    g2.gain.setValueAtTime(0, ctx.currentTime + 0.08);
    g2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.14);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
    src2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
    src2.start(ctx.currentTime + 0.08);

    setTimeout(() => ctx.close(), 600);
  } catch {}
}

// ─── Flight Arc ───────────────────────────────────────────────────────────────
function FlightArc() {
  const { projection } = useMapContext();
  const pTW = projection(TW);
  const pIE = projection(IE);
  if (!pTW || !pIE) return null;
  const [x1, y1] = pTW;
  const [x2, y2] = pIE;
  const cpX = (x1 + x2) / 2;
  const cpY = (Math.min(y1, y2) + (y1 + y2) / 2) / 2 - 40;
  const mx  = 0.25 * x1 + 0.5 * cpX + 0.25 * x2;
  const my  = 0.25 * y1 + 0.5 * cpY + 0.25 * y2;
  const tx  = (cpX - x1) * 0.5 + (x2 - cpX) * 0.5;
  const ty  = (cpY - y1) * 0.5 + (y2 - cpY) * 0.5;
  const angle = Math.atan2(ty, tx) * (180 / Math.PI);
  return (
    <g>
      <path d={`M ${x1},${y1} Q ${cpX},${cpY} ${x2},${y2}`}
        stroke="#7A5C2E" strokeWidth={1.5} strokeDasharray="5,4"
        strokeLinecap="round" fill="none" />
      <g transform={`translate(${mx},${my}) rotate(${angle})`}>
        <text textAnchor="middle" dominantBaseline="middle"
          fontSize={13} style={{ userSelect:'none' }}>✈</text>
      </g>
    </g>
  );
}

function WorldMap() {
  return (
    <div style={{ width:'100%', height:'100%', background:'#F2EBD9', position:'relative' }}>
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: 340, center: [65, 35] }}
        style={{ width:'100%', height:'100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => geographies.map(geo => (
            <Geography key={geo.rsmKey} geography={geo}
              fill="#C4A87A" stroke="#F2EBD9" strokeWidth={0.8}
              style={{ default:{outline:'none'}, hover:{outline:'none'}, pressed:{outline:'none'} }}
            />
          ))}
        </Geographies>
        <FlightArc />
        <Marker coordinates={TW}>
          <circle r={5} fill="#8B3A2A" stroke="#F2EBD9" strokeWidth={1.5} />
          <circle r={2} cx={-1.5} cy={-1.5} fill="rgba(255,255,255,0.4)" />
          <text y={14} textAnchor="middle" fontSize={7} fontWeight="bold"
            fill="#4A3010">台灣</text>
        </Marker>
        <Marker coordinates={IE}>
          <circle r={5} fill="#8B3A2A" stroke="#F2EBD9" strokeWidth={1.5} />
          <circle r={2} cx={-1.5} cy={-1.5} fill="rgba(255,255,255,0.4)" />
          <text y={14} textAnchor="middle" fontSize={7} fontWeight="bold"
            fill="#4A3010">愛爾蘭</text>
        </Marker>
      </ComposableMap>
    </div>
  );
}

// ─── Cover Screen ─────────────────────────────────────────────────────────────
export function CoverScreen() {
  const { state, navigate }  = useGame();
  const [phase, setPhase]    = useState<'closed' | 'opening' | 'open'>('closed');
  const [showInner, setShowInner] = useState(false);

  const handleOpen = useCallback(() => {
    if (phase !== 'closed') return;
    playPageTurn();
    setPhase('opening');
    // Reveal inner content halfway through the flip
    setTimeout(() => setShowInner(true), 280);
    // After animation completes, navigate
    setTimeout(() => {
      navigate(!state.player.name ? 'SETUP' : 'HOME');
    }, 750);
  }, [phase, state.player.name, navigate]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 40% 50%, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes bookOpen {
          0%   { transform: perspective(1200px) rotateY(0deg);   }
          100% { transform: perspective(1200px) rotateY(-170deg); }
        }
        @keyframes pageRifle {
          0%   { transform: perspective(1200px) rotateY(0deg); }
          30%  { transform: perspective(1200px) rotateY(-40deg); }
          60%  { transform: perspective(1200px) rotateY(-120deg); }
          100% { transform: perspective(1200px) rotateY(-170deg); }
        }
        @keyframes shadowPulse {
          0%   { opacity: 0.7; }
          50%  { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
        @keyframes pageShadow {
          0%   { opacity:0; }
          20%  { opacity:0.4; }
          80%  { opacity:0.3; }
          100% { opacity:0; }
        }
      `}</style>

      {/* Book scene wrapper — provides 3D perspective */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 430,
        height: '100%', maxHeight: 900,
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}>

        {/* ── BACK (inner content revealed after flip) ── */}
        {showInner && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#F5EDD6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 2,
            border: '2px solid #2A1208',
          }}>
            <div style={{ fontSize: 32, opacity: 0.3 }}>☘️</div>
          </div>
        )}

        {/* ── FRONT COVER (the book cover that flips) ── */}
        <div
          onClick={handleOpen}
          style={{
            position: 'absolute', inset: 0,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            animation: phase === 'opening'
              ? 'pageRifle 0.72s cubic-bezier(0.4,0,0.2,1) forwards'
              : 'none',
            cursor: phase === 'closed' ? 'pointer' : 'default',
            borderRadius: 2,
            // Book cover drop shadow
            filter: 'drop-shadow(12px 12px 24px rgba(0,0,0,0.85))',
          }}
        >
          {/* Cover face */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(160deg, #4A2510 0%, #3A1C0C 40%, #2C1208 100%)',
            borderRadius: 2,
            border: '2px solid #1A0A04',
            overflow: 'hidden',
          }}>
            {/* Leather texture lines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `repeating-linear-gradient(
                170deg,
                transparent 0px, transparent 4px,
                rgba(255,255,255,0.022) 4px, rgba(255,255,255,0.022) 5px
              ), repeating-linear-gradient(
                80deg,
                transparent 0px, transparent 8px,
                rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 9px
              )`,
            }} />

            {/* Left spine shadow */}
            <div style={{
              position:'absolute', left:0, top:0, bottom:0, width:18,
              background:'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 60%, transparent)',
              pointerEvents:'none',
            }} />

            {/* Gold border frame */}
            <div style={{
              position: 'absolute', inset: 12,
              border: '1.5px solid rgba(201,169,110,0.55)',
              borderRadius: 1,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: 16,
              border: '0.5px solid rgba(201,169,110,0.25)',
              borderRadius: 1,
              pointerEvents: 'none',
            }} />

            {/* Corner ornaments */}
            {[
              { top:8, left:8 },
              { top:8, right:8 },
              { bottom:8, left:8 },
              { bottom:8, right:8 },
            ].map((pos, i) => (
              <div key={i} style={{
                position:'absolute', ...pos,
                width:16, height:16,
                color:'rgba(201,169,110,0.7)',
                fontSize:14, lineHeight:'14px',
                display:'flex', alignItems:'center', justifyContent:'center',
                pointerEvents:'none',
              }}>✦</div>
            ))}

            {/* Map in upper area */}
            <div style={{ flex:1, overflow:'hidden', position:'relative', margin:'28px 20px 8px' }}>
              {/* Sepia overlay on map */}
              <div style={{
                position:'absolute', inset:0,
                background:'rgba(60,28,8,0.18)',
                zIndex:1, pointerEvents:'none',
                mixBlendMode:'multiply',
              }} />
              <WorldMap />
            </div>

            {/* Bottom text area */}
            <div style={{
              padding:'14px 24px 22px',
              background:'linear-gradient(0deg, rgba(0,0,0,0.35) 0%, transparent 100%)',
              flexShrink:0,
            }}>
              {/* Thin gold line */}
              <div style={{
                height:1, background:'linear-gradient(90deg, transparent, rgba(201,169,110,0.7), transparent)',
                marginBottom:12,
              }} />

              <div style={{
                fontSize: 28, fontWeight: 900, letterSpacing: '0.1em', lineHeight: 1,
                color: '#C9A96E',
                textShadow: '0 1px 4px rgba(0,0,0,0.6), 0 0 20px rgba(201,169,110,0.25)',
              }}>TRAVEL</div>
              <div style={{
                fontSize: 28, fontWeight: 900, letterSpacing: '0.1em', lineHeight: 1,
                color: '#C9A96E',
                textShadow: '0 1px 4px rgba(0,0,0,0.6), 0 0 20px rgba(201,169,110,0.25)',
              }}>JOURNAL</div>
              <div style={{
                fontSize: 8, letterSpacing: '0.28em', marginTop: 5,
                color: 'rgba(201,169,110,0.6)',
              }}>WORKING HOLIDAY · IRELAND</div>

              <div style={{ marginTop:14 }}>
                {/* OPEN button */}
                <button
                  onClick={e => { e.stopPropagation(); handleOpen(); }}
                  style={{
                    padding: '9px 22px',
                    background: 'transparent',
                    color: '#C9A96E',
                    border: '1.5px solid rgba(201,169,110,0.7)',
                    cursor: 'pointer',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.2em',
                    boxShadow: '0 0 12px rgba(201,169,110,0.15)',
                    transition: 'all 0.2s',
                    pointerEvents: phase === 'closed' ? 'auto' : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(201,169,110,0.12)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(201,169,110,0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(201,169,110,0.15)';
                  }}
                >
                  OPEN ☘
                </button>
              </div>
            </div>

            {/* Fore-edge (right side of book, pages visible) */}
            <div style={{
              position:'absolute', right:-6, top:8, bottom:8,
              width:6,
              background:'repeating-linear-gradient(0deg, #F5EDD6 0px, #E8DFC8 1px, #F2EBD9 2px)',
              borderRadius:'0 2px 2px 0',
              boxShadow:'2px 0 4px rgba(0,0,0,0.4)',
            }} />
          </div>

          {/* Cover back face (seen during flip) */}
          <div style={{
            position:'absolute', inset:0,
            backfaceVisibility:'hidden',
            transform:'rotateY(180deg)',
            background:'linear-gradient(160deg, #3A1C0C, #2C1208)',
            borderRadius:2,
          }} />
        </div>

        {/* Page-turn sweep shadow */}
        {phase === 'opening' && (
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 60%)',
            pointerEvents:'none',
            animation:'pageShadow 0.72s ease forwards',
            borderRadius:2,
          }} />
        )}
      </div>
    </div>
  );
}
