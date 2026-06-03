import React, { useState, useRef, useEffect } from 'react';
import { ZH, EN } from '../../data/constants';

interface Props {
  label:        string;
  options:      string[];
  selected:     string[];
  onToggle:     (v: string) => void;
  tagColor:     string;
  placeholder?: string;
  allowCustom?: boolean;
}

export function MultiSelectDropdown({
  label, options, selected, onToggle, tagColor,
  placeholder = '點選選擇...', allowCustom = true,
}: Props) {
  const [open,       setOpen]       = useState(false);
  const [customVal,  setCustomVal]  = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addCustom = () => {
    const v = customVal.trim();
    if (v && !selected.includes(v)) { onToggle(v); }
    setCustomVal('');
  };

  const triggerStyle: React.CSSProperties = {
    width: '100%', minHeight: '32px',
    padding: '4px 8px',
    border: '2.5px solid #000',
    boxShadow: open ? 'none' : '3px 3px 0 #000',
    transform: open ? 'translate(2px,2px)' : 'none',
    background: '#FDFBF7',
    cursor: 'pointer', textAlign: 'left',
    display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center',
    transition: 'all 0.1s',
    ...ZH,
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, marginBottom: 3, ...ZH }}>{label}</div>

      {/* Trigger */}
      <div style={triggerStyle} onClick={() => setOpen(o => !o)} role="button" tabIndex={0}>
        {selected.length === 0
          ? <span style={{ color: '#aaa', fontSize: 11 }}>{placeholder}</span>
          : selected.map(s => (
              <span key={s} style={{
                background: tagColor, border: '1.5px solid #000',
                padding: '0 5px 0 6px', fontSize: 10, borderRadius: 2,
                display: 'inline-flex', alignItems: 'center', gap: 3,
                ...ZH,
              }}>
                {s.length > 12 ? s.slice(0, 10) + '…' : s}
                <button
                  onClick={e => { e.stopPropagation(); onToggle(s); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontWeight: 900, fontSize: 11, padding: 0, lineHeight: 1,
                    ...EN,
                  }}
                >×</button>
              </span>
            ))
        }
        <span style={{ marginLeft: 'auto', fontSize: 9, color: '#777', ...EN }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 1px)', left: 0, right: 0, zIndex: 300,
          background: '#FDFBF7', border: '2.5px solid #000', boxShadow: '4px 4px 0 #000',
          maxHeight: 180, overflowY: 'auto',
        }}>
          {options.map(opt => {
            const isSel = selected.includes(opt);
            const isCustomPlaceholder = opt === '其他';
            return (
              <div key={opt}
                onClick={() => !isCustomPlaceholder && onToggle(opt)}
                style={{
                  padding: '5px 10px',
                  cursor: isCustomPlaceholder ? 'default' : 'pointer',
                  background: isSel ? tagColor : 'transparent',
                  borderBottom: '1px solid #e8e4da',
                  fontSize: 11,
                  display: 'flex', alignItems: 'center', gap: 6,
                  ...ZH,
                }}
                onMouseEnter={e => {
                  if (!isSel && !isCustomPlaceholder)
                    (e.currentTarget as HTMLDivElement).style.background = '#f5f0e8';
                }}
                onMouseLeave={e => {
                  if (!isSel)
                    (e.currentTarget as HTMLDivElement).style.background = isSel ? tagColor : 'transparent';
                }}
              >
                <span style={{ fontSize: 12, ...EN }}>{isSel ? '☑' : '☐'}</span>
                {opt}
                {isCustomPlaceholder && <span style={{ fontSize: 9, color: '#999', ...EN }}> (自訂輸入↓)</span>}
              </div>
            );
          })}

          {/* Custom input */}
          {allowCustom && (
            <div style={{ padding: '4px 6px', borderTop: '2px solid #000', background: '#f5f0e8', display: 'flex', gap: 4 }}>
              <input
                placeholder="自訂輸入 + Enter"
                value={customVal}
                onChange={e => setCustomVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                onClick={e => e.stopPropagation()}
                style={{
                  flex: 1, padding: '3px 6px',
                  border: '1.5px solid #000', background: '#FDFBF7',
                  fontSize: 11, outline: 'none',
                  ...ZH,
                }}
              />
              <button
                onClick={e => { e.stopPropagation(); addCustom(); }}
                style={{
                  padding: '2px 8px', border: '1.5px solid #000',
                  background: '#FFD700', cursor: 'pointer', fontSize: 11,
                  ...EN,
                }}
              >+</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
