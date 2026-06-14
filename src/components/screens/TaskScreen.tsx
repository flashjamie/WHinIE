import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { MAIN_TASKS, DAILY_TASKS, ZH, EN } from '../../data/constants';
import type { TaskLevel } from '../../types';

const LEVEL_META: Record<TaskLevel, { label: string; emoji: string; activeColor: string; lockedColor: string }> = {
  LV0_TW: { label: '🇹🇼 台灣整備任務',     emoji: '🧋', activeColor: '#FF6B35', lockedColor: '#888' },
  LV1_IE: { label: '🇮🇪 愛爾蘭落地任務',   emoji: '☘️', activeColor: '#00A651', lockedColor: '#aaa' },
  LV2_IE: { label: '🇮🇪 工作生活進階任務', emoji: '💼', activeColor: '#2980B9', lockedColor: '#bbb' },
};

// ─── Task Group ───────────────────────────────────────────────────────────────
function TaskGroup({ level }: { level: TaskLevel }) {
  const { state, derived, dispatch } = useGame();
  const { completedTasks } = state;
  const { hasArrived }     = derived;

  const tasks   = MAIN_TASKS.filter(t => t.level === level);
  const meta    = LEVEL_META[level];
  const isLocked =
    (level === 'LV0_TW' && hasArrived) ||
    (level === 'LV1_IE' && !hasArrived) ||
    (level === 'LV2_IE' && !hasArrived);

  const doneCount = tasks.filter(t => completedTasks.has(t.id)).length;
  const levelXP   = tasks.filter(t => completedTasks.has(t.id)).reduce((s, t) => s + t.xp, 0);

  return (
    <div style={{
      border: `3px solid ${isLocked ? '#ccc' : '#000'}`,
      boxShadow: isLocked ? '4px 4px 0 #ccc' : '4px 4px 0 #000',
      overflow: 'hidden', opacity: isLocked ? 0.42 : 1,
      transition: 'all 0.5s', position: 'relative',
    }}>
      <div style={{
        background: isLocked ? '#aaa' : meta.activeColor,
        color: '#fff', padding: '7px 12px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 16 }}>{isLocked ? '🔒' : meta.emoji}</span>
        <span style={{ fontWeight: 700, fontSize: 12, ...ZH }}>{meta.label}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, ...EN }}>{doneCount}/{tasks.length}</span>
          {levelXP > 0 && (
            <span style={{
              background: '#FFD700', color: '#000',
              padding: '1px 6px', fontSize: 9, border: '1px solid #000', ...EN,
            }}>+{levelXP} XP</span>
          )}
          {isLocked && level !== 'LV0_TW' && (
            <span style={{ fontSize: 9, background: '#555', padding: '1px 6px', border: '1px solid #fff', ...ZH }}>
              抵達後解鎖
            </span>
          )}
          {isLocked && level === 'LV0_TW' && (
            <span style={{ fontSize: 9, background: '#555', padding: '1px 6px', border: '1px solid #fff', ...ZH }}>
              ✓ 已完成階段
            </span>
          )}
        </div>
      </div>

      {tasks.map(task => {
        const done = completedTasks.has(task.id);
        return (
          <div key={task.id}
            onClick={() => !isLocked && dispatch({ type: 'TOGGLE_TASK', id: task.id })}
            style={{
              padding: '7px 12px', borderTop: '1px solid #e8e4da',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              background: done ? (level === 'LV0_TW' ? '#f0f0f0' : '#e8f5ec') : '#FDFBF7',
              transition: 'background 0.15s',
            }}>
            <div style={{
              width: 18, height: 18, border: '2px solid #000', flexShrink: 0,
              background: done ? meta.activeColor : '#FDFBF7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
            </div>
            <span style={{ fontSize: 13 }}>{task.icon}</span>
            <span style={{
              fontSize: 12, flex: 1,
              textDecoration: done ? 'line-through' : 'none',
              color: done ? '#888' : isLocked ? '#ccc' : '#000',
              ...ZH,
            }}>{task.label}</span>
            <span style={{ fontSize: 9, color: '#aaa', flexShrink: 0, ...EN }}>+{task.xp} XP</span>
            {task.optional && (
              <span style={{
                fontSize: 8, background: '#f5f0e8', border: '1px solid #ccc',
                padding: '1px 4px', ...ZH,
              }}>選填</span>
            )}
          </div>
        );
      })}

      {isLocked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(0,0,0,0.03) 8px,rgba(0,0,0,0.03) 16px)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

// ─── Daily Task Section ───────────────────────────────────────────────────────
function DailyTaskSection() {
  const { state, dispatch } = useGame();
  const { completedDaily }  = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Progress bar */}
      <div style={{
        border: '2.5px solid #000', overflow: 'hidden',
        boxShadow: '3px 3px 0 #000',
      }}>
        <div style={{
          background: '#FFD700', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 6,
          borderBottom: '2px solid #000',
        }}>
          <span style={{ fontSize: 14 }}>📅</span>
          <span style={{ fontWeight: 900, fontSize: 12, ...ZH }}>今日日常任務</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, ...EN }}>
            {completedDaily.size} / {DAILY_TASKS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: '#e8e4da' }}>
          <div style={{
            height: '100%',
            width: `${(completedDaily.size / DAILY_TASKS.length) * 100}%`,
            background: '#00A651', transition: 'width 0.3s',
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '2.5px solid #000' }}>
        {DAILY_TASKS.map(task => {
          const done = completedDaily.has(task.id);
          return (
            <div key={task.id}
              onClick={() => dispatch({ type: 'TOGGLE_DAILY', id: task.id })}
              style={{
                padding: '10px 6px', textAlign: 'center',
                borderRight: '1px solid #e8e4da',
                borderBottom: '1px solid #e8e4da',
                cursor: 'pointer',
                background: done ? '#fffbe0' : '#FDFBF7',
                transition: 'background 0.15s',
                position: 'relative',
              }}>
              {done && (
                <div style={{
                  position: 'absolute', top: 3, right: 3,
                  width: 12, height: 12, background: '#00A651',
                  border: '1.5px solid #000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, color: '#fff', fontWeight: 900,
                }}>✓</div>
              )}
              <div style={{ fontSize: 22 }}>{task.icon}</div>
              <div style={{ fontSize: 9, fontWeight: done ? 700 : 400, ...ZH, marginTop: 2 }}>{task.label}</div>
              <div style={{ fontSize: 8, color: '#888', ...EN }}>+{task.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Task Screen Root ─────────────────────────────────────────────────────────
export function TaskScreen() {
  const { derived, dispatch } = useGame();
  const { dayStatus, hasArrived, totalXP } = derived;
  const [activeTab, setActiveTab] = useState<'main' | 'daily'>('main');

  useEffect(() => {
    if (hasArrived) dispatch({ type: 'SHOW_PARTICLES' });
  }, [hasArrived]); // eslint-disable-line react-hooks/exhaustive-deps

  const hudBg  = hasArrived ? '#a8f0a8' : dayStatus.type === 'countdown' ? '#FFE082' : '#e8e4d8';
  const hudMsg =
    dayStatus.type === 'arrived'   ? `☘️ 登陸愛爾蘭：Day ${dayStatus.days}`
  : dayStatus.type === 'countdown' ? `✈️ 出發倒數 D-${dayStatus.days} 天`
  : '🛰️ 台灣整備中';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HUD */}
      <div style={{
        flexShrink: 0, background: hudBg,
        borderBottom: '3px solid #000', padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>{hasArrived ? '☘️' : '🗓️'}</span>
        <span style={{ fontSize: 12, fontWeight: 700, ...ZH }}>{hudMsg}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#555', fontWeight: 700, ...EN }}>
          {totalXP} XP
        </span>
      </div>

      {/* Capsule tab navigation */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        padding: '8px 14px',
        gap: 8,
        borderBottom: '3px solid #000',
        background: '#f0ece0',
      }}>
        {([
          { id: 'main'  as const, label: '📝 主線任務' },
          { id: 'daily' as const, label: '📅 日常任務' },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '7px 12px',
            border: '3px solid #000',
            boxShadow: activeTab === tab.id ? 'inset 2px 2px 0 rgba(0,0,0,0.2)' : '3px 3px 0 #000',
            background: activeTab === tab.id ? '#000' : '#FDFBF7',
            color: activeTab === tab.id ? '#FFD700' : '#000',
            fontWeight: 900, fontSize: 11, cursor: 'pointer',
            transform: activeTab === tab.id ? 'translate(2px,2px)' : 'none',
            transition: 'all 0.1s',
            ...ZH,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activeTab === 'main' && (
          <>
            <TaskGroup level="LV0_TW" />
            <TaskGroup level="LV1_IE" />
            <TaskGroup level="LV2_IE" />
          </>
        )}
        {activeTab === 'daily' && <DailyTaskSection />}
      </div>
    </div>
  );
}
