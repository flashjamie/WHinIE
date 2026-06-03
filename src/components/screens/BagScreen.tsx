import React from 'react';
import { useGame } from '../../context/GameContext';
import { BAG_ITEMS, ZH, EN } from '../../data/constants';
import type { BagSlot } from '../../types';

const SLOT_META: Record<BagSlot, { label: string; color: string }> = {
  document:  { label: '📄 重要文件',   color: '#E74C3C' },
  card:      { label: '💳 卡片',        color: '#2980B9' },
  gear:      { label: '🎒 裝備',        color: '#27AE60' },
  misc:      { label: '📦 其他',        color: '#95A5A6' },
};

export function BagScreen() {
  const { state, derived } = useGame();
  const { completedTasks } = state;

  // Sync bag obtained status with completed tasks
  const taskToItem: Record<string, string> = {
    ie_irp:  'bag_irp',
    ie_ppsn: 'bag_ppsn',
    ie_bank: 'bag_aib',
    ie_leap: 'bag_leap',
    ie_sim:  'bag_sim',
    ie_house:'bag_key',
    tw_checkin: 'bag_visa',
  };

  const obtainedIds = new Set(
    BAG_ITEMS.filter(b => b.obtained).map(b => b.id)
  );
  Object.entries(taskToItem).forEach(([taskId, itemId]) => {
    if (completedTasks.has(taskId)) obtainedIds.add(itemId);
  });

  const slots: BagSlot[] = ['document', 'card', 'gear', 'misc'];
  const obtainedCount = Array.from(obtainedIds).filter(id => BAG_ITEMS.some(b => b.id === id)).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#2C3E50', color: '#fff',
        padding: '8px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>🎒</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, ...ZH }}>冒險者背包</div>
          <div style={{ fontSize: 9, color: '#aaa', ...EN }}>INVENTORY · Essential Items</div>
        </div>
        <div style={{
          marginLeft: 'auto', background: '#FFD700', color: '#000',
          padding: '3px 10px', border: '2px solid #000',
          fontSize: 11, fontWeight: 700, ...EN,
        }}>
          {obtainedCount} / {BAG_ITEMS.length}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {slots.map(slot => {
          const items = BAG_ITEMS.filter(b => b.slot === slot);
          const meta  = SLOT_META[slot];
          return (
            <div key={slot} style={{ border: '2.5px solid #000', boxShadow: '3px 3px 0 #000', overflow: 'hidden' }}>
              <div style={{
                background: meta.color, color: '#fff',
                padding: '5px 12px', fontSize: 11, fontWeight: 700, ...ZH,
              }}>
                {meta.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {items.map(item => {
                  const obtained = obtainedIds.has(item.id);
                  return (
                    <div key={item.id} style={{
                      padding: '8px 5px',
                      borderRight: '1px solid #e8e4da',
                      borderBottom: '1px solid #e8e4da',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      background: obtained ? '#FDFBF7' : '#f0ece0',
                      filter: obtained ? 'none' : 'grayscale(70%)',
                      opacity: obtained ? 1 : 0.6,
                      transition: 'all 0.3s',
                    }}>
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <div style={{ fontSize: 9, fontWeight: 700, textAlign: 'center', ...ZH }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 8, color: '#888', textAlign: 'center', ...EN }}>
                        {item.sublabel}
                      </div>
                      <div style={{
                        fontSize: 8, fontWeight: 700,
                        color: obtained ? '#00A651' : '#ccc', ...EN,
                      }}>
                        {obtained ? '✓ 已取得' : '○ 未取得'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Tip note */}
        <div style={{
          border: '2px dashed #ccc', padding: '8px 12px',
          background: '#FFFACD', fontSize: 10,
          display: 'flex', gap: 6, alignItems: 'flex-start', ...ZH,
        }}>
          <span>💡</span>
          <span>完成 Task 頁面中的對應任務，可自動解鎖此處的對應物品。例如完成「申辦 PPSN」後，背包中的 PPSN 信件會標記為「已取得」。</span>
        </div>
      </div>
    </div>
  );
}
