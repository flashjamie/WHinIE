import React, { useState, useCallback } from 'react';
import { ComposableMap as _ComposableMap, Geographies, Geography, Marker as _Marker, useMapContext } from 'react-simple-maps';
import { useGame } from '../../context/GameContext';

const ComposableMap = _ComposableMap as React.ComponentType<any>;
const Marker        = _Marker        as React.ComponentType<any>;

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const TW: [number, number] = [121, 25];
const IE: [number, number] = [-8, 53];

// ─── Web Audio page-turn synthesizer ─────────────────────────────────────────
function playPageTurn() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufLen = ctx.sampleRate * 0.35;

    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    source.start();

    const buf2 = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d2   = buf2.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d2[i] = (Math.random() * 2 - 1);
    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    const f2 = ctx.createBiquadFilter();
    f2.type = 'lowpass'; f2.frequency.value = 1200;
    const g2 = ctx.createGain();
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
        stroke="rgba(201,169,110,0.5)" strokeWidth={1.2} strokeDasharray="5,4"
        strokeLinecap="round" fill="none" />
      <g transform={`translate(${mx},${my}) rotate(${angle})`}>
        <text textAnchor="middle" dominantBaseline="middle"
          fontSize={11} style={{ userSelect: 'none' }}>✈</text>
      </g>
    </g>
  );
}

// Map rendered full-bleed as background layer, blended into cover
function CoverMap() {
  return (
    <ComposableMap
      projection="geoEquirectangular"
      projectionConfig={{ scale: 340, center: [65, 35] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) => geographies.map(geo => (
          <Geography key={geo.rsmKey} geography={geo}
            fill="rgba(201,169,110,0.28)"
            stroke="rgba(60,28,8,0.4)"
            strokeWidth={0.5}
            style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
          />
        ))}
      </Geographies>
      <FlightArc />
      <Marker coordinates={TW}>
        <circle r={4} fill="#C9A96E" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
        <text y={13} textAnchor="middle" fontSize={6} fontWeight="bold" fill="rgba(201,169,110,0.9)">台灣</text>
      </Marker>
      {/* @ts-ignore react-simple-maps Marker children type */}
      <Marker coordinates={IE}>
        <circle r={4} fill="#C9A96E" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
        <text y={13} textAnchor="middle" fontSize={6} fontWeight="bold" fill="rgba(201,169,110,0.9)">愛爾蘭</text>
      </Marker>
    </ComposableMap>
  );
}

// ─── Cover Screen ─────────────────────────────────────────────────────────────
export function CoverScreen() {
  const { state, navigate } = useGame();
  const [phase, setPhase]   = useState<'closed' | 'opening' | 'open'>('closed');
  const [showInner, setShowInner] = useState(false);

  const handleOpen = useCallback(() => {
    if (phase !== 'closed') return;
    playPageTurn();
    setPhase('opening');
    setTimeout(() => setShowInner(true), 280);
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
        @keyframes pageRifle {
          0%   { transform: perspective(1200px) rotateY(0deg); }
          30%  { transform: perspective(1200px) rotateY(-40deg); }
          60%  { transform: perspective(1200px) rotateY(-120deg); }
          100% { transform: perspective(1200px) rotateY(-170deg); }
        }
        @keyframes pageShadow {
          0%   { opacity: 0; }
          20%  { opacity: 0.4; }
          80%  { opacity: 0.3; }
          100% { opacity: 0; }
        }
        .cover-title, .cover-title * {
          font-family: 'Dynalight', cursive !important;
        }
        .cover-open-btn:hover {
          background: rgba(201,169,110,0.15) !important;
          box-shadow: 0 0 24px rgba(201,169,110,0.4) !important;
        }
      `}</style>

      {/* Book scene wrapper */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 430,
        height: '100%', maxHeight: 900,
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}>

        {/* ── BACK: inner page revealed after flip ── */}
        {showInner && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#F5EDD6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 2, border: '2px solid #2A1208',
          }}>
            <div style={{ fontSize: 32, opacity: 0.3 }}>☘️</div>
          </div>
        )}

        {/* ── FRONT COVER ── */}
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
            filter: 'drop-shadow(12px 12px 24px rgba(0,0,0,0.85))',
          }}
        >
          {/* Cover face */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(160deg, #4A2510 0%, #3A1C0C 40%, #2C1208 100%)',
            borderRadius: 2,
            border: '2px solid #1A0A04',
            overflow: 'hidden',
          }}>

            {/* Leather texture */}
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
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 18,
              background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 60%, transparent)',
              pointerEvents: 'none',
            }} />

            {/* Map — full bleed, blended into cover */}
            <div style={{
              position: 'absolute', inset: 0,
              opacity: 1,
              pointerEvents: 'none',
            }}>
              <CoverMap />
            </div>

            {/* Gradient vignette over map so bottom text stays readable */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 30%, rgba(30,12,4,0.65) 65%, rgba(20,8,2,0.92) 100%)',
            }} />

            {/* Gold border frame */}
            <div style={{ position: 'absolute', inset: 12, border: '1.5px solid rgba(201,169,110,0.45)', borderRadius: 1, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 16, border: '0.5px solid rgba(201,169,110,0.2)', borderRadius: 1, pointerEvents: 'none' }} />

            {/* Corner ornaments */}
            {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', ...pos,
                width: 16, height: 16,
                color: 'rgba(201,169,110,0.65)',
                fontSize: 14, lineHeight: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>✦</div>
            ))}

            {/* ── TRAVEL JOURNAL title — centered lower area ── */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0,
              bottom: '22%',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              pointerEvents: 'none',
            }}>
              {/* Thin gold rule above */}
              <div style={{
                width: '55%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.7), transparent)',
                marginBottom: 16,
              }} />

              <div className="cover-title" style={{
                fontSize: 68,
                lineHeight: 0.95,
                color: '#C9A96E',
                fontFamily: "'Dynalight', cursive",
                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(201,169,110,0.3)',
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}>
                Travel<br />Journal
              </div>

              {/* Subtitle */}
              <div style={{
                marginTop: 10,
                fontSize: 8, letterSpacing: '0.3em',
                color: 'rgba(201,169,110,0.6)',
                textTransform: 'uppercase',
              }}>
                Working Holiday · Ireland
              </div>

              {/* Thin gold rule below */}
              <div style={{
                width: '55%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.7), transparent)',
                marginTop: 14,
              }} />
            </div>

            {/* ── OPEN button — bottom-right corner ── */}
            <button
              className="cover-open-btn"
              onClick={e => { e.stopPropagation(); handleOpen(); }}
              style={{
                position: 'absolute',
                bottom: 28, right: 28,
                padding: '8px 20px',
                background: 'transparent',
                color: '#C9A96E',
                border: '1.5px solid rgba(201,169,110,0.65)',
                cursor: 'pointer',
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.25em',
                boxShadow: '0 0 12px rgba(201,169,110,0.15)',
                transition: 'all 0.2s',
                pointerEvents: phase === 'closed' ? 'auto' : 'none',
              }}
            >
              OPEN ☘
            </button>

            {/* Fore-edge pages */}
            <div style={{
              position: 'absolute', right: -6, top: 8, bottom: 8, width: 6,
              background: 'repeating-linear-gradient(0deg, #F5EDD6 0px, #E8DFC8 1px, #F2EBD9 2px)',
              borderRadius: '0 2px 2px 0',
              boxShadow: '2px 0 4px rgba(0,0,0,0.4)',
            }} />
          </div>

          {/* Cover back face during flip */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg, #3A1C0C, #2C1208)',
            borderRadius: 2,
          }} />
        </div>

        {/* Page-turn sweep shadow */}
        {phase === 'opening' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 60%)',
            pointerEvents: 'none',
            animation: 'pageShadow 0.72s ease forwards',
            borderRadius: 2,
          }} />
        )}
      </div>
    </div>
  );
}
