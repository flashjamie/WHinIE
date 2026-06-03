import React, { useState, useEffect } from 'react';
import { clockAt, ZH, EN } from '../../data/constants';
import { useGame } from '../../context/GameContext';

interface ClockCardProps {
  flag:    string;
  name:    string;
  sub:     string;
  offset:  number | null;
  bg:      string;
}

function ClockCard({ flag, name, sub, offset, bg }: ClockCardProps) {
  const [time, setTime] = useState(offset !== null ? clockAt(offset) : '--:--:--');

  useEffect(() => {
    if (offset === null) return;
    const id = setInterval(() => setTime(clockAt(offset)), 1000);
    return () => clearInterval(id);
  }, [offset]);

  return (
    <div style={{
      border: '2.5px solid #000', boxShadow: '3px 3px 0 #000',
      background: bg, padding: '8px 6px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 16 }}>{flag}</div>
      <div style={{ fontSize: 10, fontWeight: 700, ...ZH }}>{name}</div>
      <div style={{ fontSize: 8, color: '#777', marginBottom: 4, ...EN }}>{sub}</div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', ...EN }}>{time}</div>
    </div>
  );
}

export function ThreeWorldClocks() {
  const { derived } = useGame();
  const { transitTz } = derived;

  const clocks = [
    { flag: '🇹🇼', name: '台灣',        sub: 'GMT+8',                       offset: 8,                    bg: '#FFE4E1' },
    { flag: '✈️',   name: transitTz.name, sub: transitTz.offset ? `GMT+${transitTz.offset}` : '—', offset: transitTz.offset || null, bg: '#EDE7F6' },
    { flag: '🇮🇪', name: '愛爾蘭',      sub: 'GMT+1 (IST)',                  offset: 1,                    bg: '#E8F5E9' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
      {clocks.map(c => <ClockCard key={c.name} {...c} />)}
    </div>
  );
}
