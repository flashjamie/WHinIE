import React, { useId } from 'react';
import { useGame } from '../../context/GameContext';
import { TABS, ZH } from '../../data/constants';

// ─── Parchment SVG texture (inline data URI) ──────────────────────────────────
const PARCHMENT_FILTER_ID = 'parchment-tex';

function ParchmentDefs() {
  return (
    <defs>
      <filter id={PARCHMENT_FILTER_ID} x="0%" y="0%" width="100%" height="100%"
        colorInterpolationFilters="sRGB">
        {/* Fiber noise */}
        <feTurbulence type="fractalNoise" baseFrequency="0.65 0.12"
          numOctaves="4" seed="3" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
        {/* Edge darkening */}
        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2"
          seed="9" result="edgeNoise" />
        <feDisplacementMap in="blended" in2="edgeNoise" scale="3"
          xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* Torn-edge mask for left side */}
      <clipPath id="torn-left">
        <path d="
          M 0 0
          L 14 0
          Q 11 12 14 22  Q 10 32 15 44  Q 12 58 14 72
          Q 10 86 14 100 Q 11 115 13 130 Q 15 145 12 160
          Q 10 175 14 190 Q 12 205 15 220 Q 11 235 13 250
          Q 15 265 12 280 Q 10 295 14 310 Q 11 325 13 340
          Q 15 355 12 370 Q 10 385 14 400 Q 11 415 13 430
          Q 15 445 12 460 Q 10 475 14 490 Q 12 505 15 520
          Q 11 535 13 550 Q 15 565 12 580 Q 10 595 14 610
          Q 12 625 14 640
          L 0 640
          Z
        " />
      </clipPath>

      {/* Leather tab gradient */}
      <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#7B4A2D" />
        <stop offset="40%"  stopColor="#5C3317" />
        <stop offset="100%" stopColor="#3D1F0A" />
      </linearGradient>
      <linearGradient id="leatherActive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#A0663A" />
        <stop offset="50%"  stopColor="#8B5232" />
        <stop offset="100%" stopColor="#6B3A1F" />
      </linearGradient>
    </defs>
  );
}

// ─── Vertical leather tab ─────────────────────────────────────────────────────
interface LeatherTabProps {
  label:    string;
  active:   boolean;
  onClick:  () => void;
  tabIndex: number;
  total:    number;
}

function LeatherTab({ label, active, onClick, tabIndex, total }: LeatherTabProps) {
  const tabH = Math.floor(580 / total); // distribute across ~580px

  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        position: 'relative',
        width: active ? 52 : 46,
        height: tabH,
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'width 0.15s ease',
        marginLeft: active ? -6 : 0,
        zIndex: active ? 2 : 1,
      }}
    >
      {/* Tab body */}
      <div style={{
        position: 'absolute',
        inset: '2px 0',
        background: active
          ? 'linear-gradient(135deg, #A0663A 0%, #8B5232 50%, #6B3A1F 100%)'
          : 'linear-gradient(135deg, #7B4A2D 0%, #5C3317 50%, #3D1F0A 100%)',
        borderRadius: '0 8px 8px 0',
        border: `2px solid ${active ? '#C9A96E' : '#2A1208'}`,
        borderLeft: active ? '3px solid #FFD700' : '2px solid #2A1208',
        boxShadow: active
          ? '3px 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '2px 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        {/* Leather grain lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
          )`,
        }} />
        {/* Active gold accent strip */}
        {active && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 3,
            background: 'linear-gradient(180deg, #FFD700, #C9A040, #FFD700)',
          }} />
        )}
        {/* Gold text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: active ? '#FFE580' : '#C9A96E',
            textShadow: active
              ? '0 0 6px rgba(255,215,0,0.6), 0 1px 2px rgba(0,0,0,0.8)'
              : '0 1px 2px rgba(0,0,0,0.6)',
            fontFamily: "'Itim', 'Noto Sans TC', cursive",
            userSelect: 'none',
          }}>
            {label}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Notebook Container ───────────────────────────────────────────────────────
export function NotebookContainer({ children }: { children: React.ReactNode }) {
  const { state, navigate } = useGame();
  const { currentScreen }   = state;

  const allTabs = [
    ...TABS,
    { id: 'SETUP' as const, label: '⚙ 角色設定', emoji: '⚙️' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at 30% 50%, #3D1F0A 0%, #1A0D06 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 8,
    }}>
      {/* Notebook outer frame */}
      <div style={{
        width: '100%', maxWidth: 1100,
        height: '100%', maxHeight: 650,
        display: 'flex',
        position: 'relative',
        filter: 'drop-shadow(12px 12px 24px rgba(0,0,0,0.8))',
      }}>
        {/* Spine / binding */}
        <div style={{
          width: 18, flexShrink: 0,
          background: 'linear-gradient(180deg, #5C3317 0%, #3D1F0A 100%)',
          borderRadius: '4px 0 0 4px',
          border: '3px solid #1A0D06',
          borderRight: 'none',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-evenly',
          boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.5)',
        }}>
          {/* Spine rivets */}
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #C9A96E, #7B5A2A)',
              border: '1px solid #2A1208',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }} />
          ))}
        </div>

        {/* Page area */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: '#F5EDD6',
          // Parchment layered gradients
          backgroundImage: `
            radial-gradient(ellipse at 5% 5%,   rgba(139,90,43,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 95% 10%,  rgba(139,90,43,0.08) 0%, transparent 35%),
            radial-gradient(ellipse at 15% 95%,  rgba(139,90,43,0.10) 0%, transparent 40%),
            radial-gradient(ellipse at 85% 90%,  rgba(139,90,43,0.07) 0%, transparent 35%),
            radial-gradient(ellipse at 50% 50%,  rgba(200,170,120,0.04) 0%, transparent 70%),
            repeating-linear-gradient(
              0deg,
              transparent 0px, transparent 18px,
              rgba(139,90,43,0.025) 18px, rgba(139,90,43,0.025) 19px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px, transparent 24px,
              rgba(139,90,43,0.015) 24px, rgba(139,90,43,0.015) 25px
            )
          `,
          border: '3px solid #2A1208',
          borderLeft: 'none',
          borderRight: 'none',
        }}>
          {/* Torn left edge overlay */}
          <svg
            style={{
              position: 'absolute', left: 0, top: 0,
              width: 18, height: '100%',
              zIndex: 5, pointerEvents: 'none',
            }}
            viewBox="0 0 18 640" preserveAspectRatio="none"
          >
            <ParchmentDefs />
            {/* Torn edge shape */}
            <path
              d={`
                M 0 0
                L 14 0
                Q 11 14 15 26 Q 10 40 14 54 Q 12 68 15 82
                Q 10 96 13 110 Q 15 124 11 138 Q 13 152 14 166
                Q 10 180 13 194 Q 11 208 15 222 Q 12 236 14 250
                Q 10 264 13 278 Q 15 292 11 306 Q 13 320 14 334
                Q 10 348 13 362 Q 11 376 15 390 Q 12 404 14 418
                Q 10 432 13 446 Q 15 460 11 474 Q 13 488 14 502
                Q 10 516 13 530 Q 11 544 15 558 Q 12 572 14 586
                Q 10 600 13 614 Q 15 628 14 640
                L 0 640
                Z
              `}
              fill="#D4B896"
              opacity={0.5}
            />
            {/* Shadow line */}
            <path
              d={`
                M 14 0
                Q 11 14 15 26 Q 10 40 14 54 Q 12 68 15 82
                Q 10 96 13 110 Q 15 124 11 138 Q 13 152 14 166
                Q 10 180 13 194 Q 11 208 15 222 Q 12 236 14 250
                Q 10 264 13 278 Q 15 292 11 306 Q 13 320 14 334
                Q 10 348 13 362 Q 11 376 15 390 Q 12 404 14 418
                Q 10 432 13 446 Q 15 460 11 474 Q 13 488 14 502
                Q 10 516 13 530 Q 11 544 15 558 Q 12 572 14 586
                Q 10 600 13 614 Q 15 628 14 640
              `}
              fill="none"
              stroke="rgba(90,50,15,0.35)"
              strokeWidth={1.5}
            />
          </svg>

          {/* Fiber texture overlay (SVG filter layer) */}
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              zIndex: 1, pointerEvents: 'none',
              opacity: 0.18,
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="fiber-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.75 0.08"
                numOctaves="3" seed="7" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
              <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
            </filter>
            <rect width="100%" height="100%"
              fill="#8B5E3C"
              filter="url(#fiber-noise)"
            />
          </svg>

          {/* Corner age stains */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 120, height: 120,
            background: 'radial-gradient(ellipse at 0% 0%, rgba(101,67,33,0.18) 0%, transparent 70%)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 100, height: 100,
            background: 'radial-gradient(ellipse at 100% 100%, rgba(101,67,33,0.15) 0%, transparent 70%)',
            zIndex: 2, pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </div>

        {/* Right leather tab column */}
        <div style={{
          width: 52, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start',
          paddingTop: 10, paddingBottom: 10,
          background: 'transparent',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* Background leather binding panel */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #3D1F0A 0%, #2C1810 50%, #1A0D06 100%)',
            border: '3px solid #1A0D06',
            borderLeft: '3px solid #2A1208',
            borderRadius: '0 4px 4px 0',
          }} />

          {/* Main nav tabs */}
          <div style={{
            position: 'relative', zIndex: 1,
            flex: 1, width: '100%',
            display: 'flex', flexDirection: 'column',
            paddingTop: 4,
          }}>
            {TABS.map((tab, i) => (
              <LeatherTab
                key={tab.id}
                label={tab.label}
                active={currentScreen === tab.id}
                onClick={() => navigate(tab.id)}
                tabIndex={i}
                total={TABS.length}
              />
            ))}
          </div>

          {/* Setup tab pinned at bottom */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', paddingBottom: 4 }}>
            <button
              onClick={() => navigate('SETUP')}
              title="角色設定"
              style={{
                position: 'relative',
                width: currentScreen === 'SETUP' ? 52 : 46,
                height: 52,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: currentScreen === 'SETUP' ? -6 : 0,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                position: 'absolute', inset: '2px 0',
                background: currentScreen === 'SETUP'
                  ? 'linear-gradient(135deg, #FFD700, #C9A040)'
                  : 'linear-gradient(135deg, #7B4A2D, #3D1F0A)',
                borderRadius: '0 8px 8px 0',
                border: `2px solid ${currentScreen === 'SETUP' ? '#C9A96E' : '#2A1208'}`,
                borderLeft: currentScreen === 'SETUP' ? '3px solid #FFE580' : '2px solid #2A1208',
                boxShadow: '3px 2px 8px rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  writingMode: 'vertical-rl',
                  fontSize: 9, fontWeight: 900,
                  color: currentScreen === 'SETUP' ? '#3D1F0A' : '#C9A96E',
                  letterSpacing: '0.1em',
                  fontFamily: "'Noto Sans TC', sans-serif",
                  userSelect: 'none',
                }}>
                  ⚙ 角色
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
