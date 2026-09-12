import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MAIN_TASKS, DAILY_TASKS, ZH, EN } from '../../data/constants';
import type { Task, TaskLevel } from '../../types';

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  panelBg:    '#0d1b2a',
  panelBd:    '#1e3a5f',
  listBg:     '#0a1520',
  activeBg:   '#1a3a5c',
  activeGold: '#C9A96E',
  gold:       '#D4AF37',
  dimGold:    '#8B6239',
  green:      '#2ecc71',
  red:        '#e74c3c',
  white:      '#eef2f7',
  muted:      '#7a8fa6',
  catTW:      '#FF6B35',
  catIE1:     '#00A651',
  catIE2:     '#2980B9',
  catDaily:   '#C9A96E',
  doneBg:     '#0d2b1a',
} as const;

const LEVEL_META: Record<TaskLevel, { label: string; color: string; emoji: string }> = {
  LV0_TW: { label: '🇹🇼 台灣整備',     color: P.catTW,    emoji: '🧋' },
  LV1_IE: { label: '🇮🇪 愛爾蘭落地',   color: P.catIE1,   emoji: '☘️' },
  LV2_IE: { label: '🇮🇪 工作生活進階', color: P.catIE2,   emoji: '💼' },
};

type TabKey = 'main' | 'daily';

// ─── Quest Detail Panel ───────────────────────────────────────────────────────
function QuestDetail({ task, done, onToggle }: { task: Task; done: boolean; onToggle: () => void }) {
  const meta = LEVEL_META[task.level];
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: P.panelBg, borderLeft: `2px solid ${P.panelBd}`,
      height: '100%', overflow: 'hidden',
    }}>
      {/* Quest title bar */}
      <div style={{
        background: done ? '#0d2b1a' : '#0a2240',
        borderBottom: `2px solid ${done ? P.green : P.gold}`,
        padding: '12px 14px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>{task.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: done ? P.green : P.gold, ...ZH }}>
            {task.label}
          </span>
          {task.optional && (
            <span style={{
              fontSize: 8, background: '#2a2a00', color: '#C9A96E',
              border: '1px solid #C9A96E', padding: '1px 5px', marginLeft: 2, ...ZH,
            }}>選填</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: 9, color: meta.color, background: `${meta.color}22`,
            border: `1px solid ${meta.color}55`, padding: '1px 6px', ...ZH,
          }}>{meta.label}</span>
          <span style={{
            fontSize: 9, color: P.gold, background: '#1a1500',
            border: `1px solid ${P.gold}55`, padding: '1px 6px', ...EN,
          }}>+{task.xp} XP</span>
          {done && (
            <span style={{
              fontSize: 9, color: P.green, background: '#0d2b1a',
              border: `1px solid ${P.green}55`, padding: '1px 6px', ...ZH,
            }}>✓ 已完成</span>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Objective */}
        {task.objective && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: P.activeGold, letterSpacing: '0.1em', marginBottom: 6, ...ZH }}>
              ◆ 必要任務目標
            </div>
            <div style={{
              background: '#0a1a2e', border: `1px solid ${P.panelBd}`,
              padding: '10px 12px',
            }}>
              <span style={{ fontSize: 11, color: P.white, lineHeight: 1.7, ...ZH }}>{task.objective}</span>
            </div>
          </div>
        )}

        {/* Guide steps */}
        {task.guide && task.guide.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: P.activeGold, letterSpacing: '0.1em', marginBottom: 6, ...ZH }}>
              ◆ 任務指引
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {task.guide.map((step, i) => (
                <div key={i} style={{
                  background: '#071525', border: `1px solid ${P.panelBd}`,
                  padding: '8px 12px', display: 'flex', gap: 8,
                }}>
                  <span style={{ fontSize: 9, color: P.gold, flexShrink: 0, fontWeight: 900, marginTop: 1, ...EN }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 11, color: '#c5d8ec', lineHeight: 1.7, ...ZH }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No content placeholder */}
        {!task.objective && (!task.guide || task.guide.length === 0) && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.4,
          }}>
            <span style={{ fontSize: 32 }}>📜</span>
            <span style={{ fontSize: 11, color: P.muted, ...ZH }}>任務指引即將更新…</span>
          </div>
        )}

        {/* Reward */}
        {task.reward && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: P.activeGold, letterSpacing: '0.1em', marginBottom: 6, ...ZH }}>
              ◆ 任務獎勵
            </div>
            <div style={{
              background: '#1a1500', border: `1px solid ${P.gold}44`,
              padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>🏆</span>
              <span style={{ fontSize: 10, color: P.gold, lineHeight: 1.6, ...ZH }}>{task.reward}</span>
            </div>
          </div>
        )}
        <div style={{
          background: '#1a1500', border: `1px solid ${P.gold}44`,
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>⭐</span>
          <span style={{ fontSize: 10, color: P.gold, ...EN }}>+{task.xp} EXP</span>
        </div>
      </div>

      {/* Accept / Complete button */}
      <div style={{
        flexShrink: 0, padding: '10px 14px',
        borderTop: `2px solid ${P.panelBd}`,
        background: '#070f1a',
      }}>
        <button onClick={onToggle} style={{
          width: '100%', padding: '11px',
          background: done ? '#0d2b1a' : 'linear-gradient(135deg,#1a3a5c,#0a2240)',
          border: `2px solid ${done ? P.green : P.gold}`,
          color: done ? P.green : P.gold,
          fontSize: 12, fontWeight: 900, cursor: 'pointer',
          letterSpacing: '0.08em', transition: 'all 0.15s', ...ZH,
        }}>
          {done ? '✓ 取消完成標記' : '領取獎勵'}
        </button>
      </div>
    </div>
  );
}

// ─── Daily Detail Panel ───────────────────────────────────────────────────────
function DailyDetail({ task, done, onToggle }: {
  task: typeof DAILY_TASKS[0]; done: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: P.panelBg, borderLeft: `2px solid ${P.panelBd}`, height: '100%', overflow: 'hidden',
    }}>
      <div style={{
        background: done ? '#0d2b1a' : '#1a1500',
        borderBottom: `2px solid ${done ? P.green : P.catDaily}`,
        padding: '12px 14px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>{task.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 900, color: done ? P.green : P.catDaily, ...ZH }}>{task.label}</span>
        </div>
        <span style={{ fontSize: 9, color: P.gold, border: `1px solid ${P.gold}55`, background: '#1a1500', padding: '1px 6px', ...EN }}>
          +{task.xp} XP
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, opacity: 0.45 }}>
        <span style={{ fontSize: 36 }}>📅</span>
        <span style={{ fontSize: 11, color: P.muted, ...ZH }}>每日任務 · 完成後點擊領取</span>
      </div>
      <div style={{ flexShrink: 0, padding: '10px 14px', borderTop: `2px solid ${P.panelBd}`, background: '#070f1a' }}>
        <button onClick={onToggle} style={{
          width: '100%', padding: '11px',
          background: done ? '#0d2b1a' : '#1a1500',
          border: `2px solid ${done ? P.green : P.catDaily}`,
          color: done ? P.green : P.catDaily,
          fontSize: 12, fontWeight: 900, cursor: 'pointer',
          letterSpacing: '0.08em', transition: 'all 0.15s', ...ZH,
        }}>
          {done ? '✓ 取消完成標記' : '領取獎勵'}
        </button>
      </div>
    </div>
  );
}

// ─── Empty right panel ────────────────────────────────────────────────────────
function EmptyDetail() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12,
      background: P.panelBg, borderLeft: `2px solid ${P.panelBd}`,
    }}>
      <span style={{ fontSize: 42, opacity: 0.3 }}>📜</span>
      <span style={{ fontSize: 12, color: P.muted, ...ZH, opacity: 0.5 }}>點選左側任務查看詳情</span>
    </div>
  );
}

// ─── Task Screen Root ─────────────────────────────────────────────────────────
export function TaskScreen() {
  const { state, derived, dispatch } = useGame();
  const { completedTasks, completedDaily } = state;
  const { dayStatus, hasArrived, totalXP } = derived;

  const [activeTab,    setActiveTab]    = useState<TabKey>('main');
  const [selectedMain, setSelectedMain] = useState<string | null>(MAIN_TASKS[0]?.id ?? null);
  const [selectedDaily,setSelectedDaily]= useState<string | null>(DAILY_TASKS[0]?.id ?? null);

  const hudMsg =
    dayStatus.type === 'arrived'   ? `☘️ 登陸愛爾蘭：Day ${dayStatus.days}`
  : dayStatus.type === 'countdown' ? `✈️ 出發倒數 D-${dayStatus.days} 天`
  : '🛰️ 台灣整備中';

  // group main tasks by level, with locking logic
  const levels: TaskLevel[] = ['LV0_TW', 'LV1_IE', 'LV2_IE'];
  const isLocked = (level: TaskLevel) =>
    (level === 'LV0_TW' && hasArrived) ||
    ((level === 'LV1_IE' || level === 'LV2_IE') && !hasArrived);

  const selectedMainTask  = MAIN_TASKS.find(t => t.id === selectedMain) ?? null;
  const selectedDailyTask = DAILY_TASKS.find(t => t.id === selectedDaily) ?? null;

  // count for tab badges
  const mainDone  = MAIN_TASKS.filter(t => completedTasks.has(t.id)).length;
  const dailyDone = completedDaily.size;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#070f1a' }}>

      {/* ── HUD ── */}
      <div style={{
        background: '#2C1A0E', borderBottom: '3px solid #000',
        padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontSize: 18 }}>{hasArrived ? '☘️' : '🗓️'}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A96E', ...ZH }}>{hudMsg}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#8B6239', fontWeight: 700, ...EN }}>{totalXP} XP</span>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', background: '#040c14',
        borderBottom: `2px solid ${P.panelBd}`, flexShrink: 0,
      }}>
        {([
          { key: 'main'  as TabKey, label: '主線任務', done: mainDone,  total: MAIN_TASKS.length },
          { key: 'daily' as TabKey, label: '日常任務', done: dailyDone, total: DAILY_TASKS.length },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '9px 8px',
            background: activeTab === tab.key ? P.activeBg : 'transparent',
            border: 'none', borderBottom: activeTab === tab.key ? `2px solid ${P.gold}` : '2px solid transparent',
            color: activeTab === tab.key ? P.gold : P.muted,
            fontSize: 11, fontWeight: 900, cursor: 'pointer', ...ZH,
          }}>
            {tab.label}
            <span style={{ marginLeft: 5, fontSize: 9, ...EN }}>
              {tab.done}/{tab.total}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main content: left list + right detail ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left quest list */}
        <div style={{
          width: 150, flexShrink: 0,
          background: P.listBg, borderRight: `2px solid ${P.panelBd}`,
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {activeTab === 'main' && levels.map(level => {
            const meta    = LEVEL_META[level];
            const locked  = isLocked(level);
            const tasks   = MAIN_TASKS.filter(t => t.level === level);
            const lvDone  = tasks.filter(t => completedTasks.has(t.id)).length;
            return (
              <div key={level}>
                {/* Category header */}
                <div style={{
                  padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
                  background: `${meta.color}18`, borderBottom: `1px solid ${meta.color}44`,
                  borderTop: `1px solid ${meta.color}44`,
                  opacity: locked ? 0.5 : 1,
                }}>
                  <span style={{ fontSize: 11 }}>{locked ? '🔒' : meta.emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, color: meta.color, flex: 1, ...ZH }}>{meta.label}</span>
                  <span style={{ fontSize: 8, color: P.muted, ...EN }}>{lvDone}/{tasks.length}</span>
                </div>
                {/* Quest items */}
                {tasks.map(task => {
                  const done    = completedTasks.has(task.id);
                  const active  = selectedMain === task.id;
                  return (
                    <div key={task.id}
                      onClick={() => !locked && setSelectedMain(task.id)}
                      style={{
                        padding: '8px 10px', borderBottom: `1px solid ${P.panelBd}`,
                        background: active ? P.activeBg : done ? P.doneBg : 'transparent',
                        borderLeft: active ? `3px solid ${P.gold}` : '3px solid transparent',
                        cursor: locked ? 'not-allowed' : 'pointer',
                        opacity: locked ? 0.35 : 1,
                        transition: 'background 0.15s',
                        display: 'flex', alignItems: 'flex-start', gap: 6,
                      }}>
                      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{task.icon}</span>
                      <span style={{
                        fontSize: 10, lineHeight: 1.4,
                        color: done ? P.green : active ? P.gold : P.white,
                        textDecoration: done ? 'line-through' : 'none',
                        ...ZH,
                      }}>{task.label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {activeTab === 'daily' && DAILY_TASKS.map(task => {
            const done   = completedDaily.has(task.id);
            const active = selectedDaily === task.id;
            return (
              <div key={task.id}
                onClick={() => setSelectedDaily(task.id)}
                style={{
                  padding: '8px 10px', borderBottom: `1px solid ${P.panelBd}`,
                  background: active ? P.activeBg : done ? P.doneBg : 'transparent',
                  borderLeft: active ? `3px solid ${P.catDaily}` : '3px solid transparent',
                  cursor: 'pointer', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{task.icon}</span>
                <span style={{
                  fontSize: 10, lineHeight: 1.4,
                  color: done ? P.green : active ? P.catDaily : P.white,
                  textDecoration: done ? 'line-through' : 'none',
                  ...ZH,
                }}>{task.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right detail panel */}
        {activeTab === 'main' && selectedMainTask ? (
          <QuestDetail
            task={selectedMainTask}
            done={completedTasks.has(selectedMainTask.id)}
            onToggle={() => dispatch({ type: 'TOGGLE_TASK', id: selectedMainTask.id })}
          />
        ) : activeTab === 'daily' && selectedDailyTask ? (
          <DailyDetail
            task={selectedDailyTask}
            done={completedDaily.has(selectedDailyTask.id)}
            onToggle={() => dispatch({ type: 'TOGGLE_DAILY', id: selectedDailyTask.id })}
          />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </div>
  );
}
