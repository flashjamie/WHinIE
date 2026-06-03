import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SHOP_ITEMS, ZH, EN } from '../../data/constants';
import type { ShopCategory } from '../../types';

const CAT_LABELS: Record<ShopCategory, string> = {
  essential: '🍞 主食必備', fresh: '🥬 新鮮食材', snack: '🍫 愛爾蘭零食', household: '🏠 居家廚房',
};

export function DunnesScreen() {
  const { state, dispatch, derived } = useGame();
  const { cartItems } = state;
  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'all'>('all');

  const categories: (ShopCategory | 'all')[] = ['all', 'essential', 'fresh', 'snack', 'household'];
  const filtered = activeCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(i => i.category === activeCategory);

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, background: '#003A70', color: '#fff',
        padding: '8px 14px', borderBottom: '3px solid #000',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>🛒</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', ...ZH }}>
            Dunnes Stores 採購清單
          </div>
          <div style={{ fontSize: 9, color: '#aaa', ...EN }}>Ireland's Own · Quality Food & Value</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {cartCount > 0 && (
            <div style={{
              background: '#FFD700', color: '#000',
              border: '2px solid #000', padding: '3px 10px',
              fontSize: 11, fontWeight: 700, ...EN,
            }}>
              🛒 {cartCount} items · €{derived.cartTotal.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{
        flexShrink: 0, display: 'flex', gap: 4, padding: '6px 14px',
        borderBottom: '2px solid #000', background: '#f5f0e8', overflowX: 'auto',
      }}>
        {categories.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0, padding: '4px 10px',
              border: '2px solid #000',
              boxShadow: activeCategory === cat ? 'none' : '2px 2px 0 #000',
              background: activeCategory === cat ? '#003A70' : '#FDFBF7',
              color:      activeCategory === cat ? '#fff'    : '#000',
              transform:  activeCategory === cat ? 'translate(2px,2px)' : 'none',
              cursor: 'pointer', fontSize: 10, fontWeight: 600,
              transition: 'all 0.1s', ...ZH,
            }}>
            {cat === 'all' ? '🏪 全部' : CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 10,
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7,
        alignContent: 'start',
      }}>
        {filtered.map(item => {
          const qty = cartItems[item.id] ?? 0;
          return (
            <div key={item.id} style={{
              border: '2.5px solid #000',
              boxShadow: qty > 0 ? '3px 3px 0 #003A70' : '3px 3px 0 #000',
              background: qty > 0 ? '#e8f5ff' : '#FDFBF7',
              padding: '8px 6px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', ...ZH }}>
                {item.nameZh}
              </div>
              <div style={{ fontSize: 8, color: '#777', textAlign: 'center', ...EN }}>
                {item.name}
              </div>
              {item.tip && (
                <div style={{
                  fontSize: 8, color: '#888', textAlign: 'center',
                  background: '#FFFACD', padding: '1px 4px',
                  border: '1px solid #ddd', ...ZH,
                }}>💡 {item.tip}</div>
              )}
              <div style={{ fontSize: 12, fontWeight: 900, color: '#003A70', ...EN }}>
                €{item.price.toFixed(2)}
              </div>
              {/* Qty controls */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                {qty > 0 && (
                  <button onClick={() => dispatch({ type: 'CART_REMOVE', id: item.id })} style={{
                    width: 20, height: 20, border: '2px solid #000',
                    background: '#FF6B6B', color: '#fff', cursor: 'pointer',
                    fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...EN,
                  }}>−</button>
                )}
                {qty > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, minWidth: 16, textAlign: 'center', ...EN }}>{qty}</span>
                )}
                <button onClick={() => dispatch({ type: 'CART_ADD', id: item.id })} style={{
                  width: 20, height: 20, border: '2px solid #000',
                  background: '#FFD700', color: '#000', cursor: 'pointer',
                  fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...EN,
                }}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart summary bar */}
      {cartCount > 0 && (
        <div style={{
          flexShrink: 0, padding: '8px 14px',
          borderTop: '3px solid #000', background: '#003A70', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 12, ...ZH }}>購物車共 {cartCount} 項</span>
          <span style={{ fontSize: 14, fontWeight: 900, ...EN }}>€{derived.cartTotal.toFixed(2)}</span>
          <button onClick={() => dispatch({ type: 'CART_CLEAR' })} style={{
            marginLeft: 'auto', padding: '4px 12px',
            border: '2px solid #fff', background: 'transparent', color: '#fff',
            cursor: 'pointer', fontSize: 10, ...ZH,
          }}>清空</button>
        </div>
      )}
    </div>
  );
}
