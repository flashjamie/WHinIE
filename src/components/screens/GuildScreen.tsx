import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ZH, EN } from '../../data/constants';
import { useGame } from '../../context/GameContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type PostType    = '揪團' | '資訊分享';
type SOSCategory = '租屋詐騙' | '合約糾紛' | '健康狀況' | '工作問題' | '其他';

interface BoardPost {
  id:        string;
  type:      PostType;
  tag:       string;
  title:     string;
  content:   string;
  author:    string;
  city:      string;
  timestamp: string;
  likes:     number;
  pinColor:  string;
  tilt:      number;
}

interface SOSPost {
  id:        string;
  category:  SOSCategory;
  title:     string;
  content:   string;
  anon:      boolean;
  author:    string;
  city:      string;
  timestamp: string;
  helpers:   number;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_POSTS: BoardPost[] = [
  {
    id:'b1', type:'揪團', tag:'IRP 辦理', tilt:-1.5, pinColor:'#E74C3C',
    title:'有人這週要一起去辦 IRP 嗎？',
    content:'Dublin 1 的 Burgh Quay 現在要提前預約，週四下午有位子，找 1-2 位戰友一起去，路上也好有個照應☘️',
    author:'Wei Chen', city:'Dublin', timestamp:'2 小時前', likes:12,
  },
  {
    id:'b2', type:'資訊分享', tag:'購物情報', tilt:1, pinColor:'#3B82F6',
    title:'Dunnes Store 有特價 Skyr 希臘優格！',
    content:'Cornelscourt 那間現在 Skyr 打折 €1.49，我買了 6 罐 😂 有需要的快去，不確定還剩多少。',
    author:'Lin Mei', city:'Dublin', timestamp:'3 小時前', likes:38,
  },
  {
    id:'b3', type:'揪團', tag:'咖啡廳探索', tilt:2, pinColor:'#F59E0B',
    title:'Cork 咖啡廳 Walk-in 戰友募集',
    content:'想找個有插座 + WiFi 的咖啡廳工作，Cork City Centre 附近，有沒有人想一起？下週一或二都可以！',
    author:'Hsiao Yu', city:'Cork', timestamp:'昨天', likes:7,
  },
  {
    id:'b4', type:'資訊分享', tag:'稅務教學', tilt:-0.5, pinColor:'#10B981',
    title:'第一份薪水被扣 40% 緊急稅 — 別慌，這樣做',
    content:'剛到愛爾蘭還沒設定稅號的話，公司會自動扣 40% 緊急稅。解法：登入 myAccount → Manage your tax → 聯絡公司提供薪資資訊 → Revenue 會退還多扣的。通常 2-4 週內處理完。',
    author:'James Huang', city:'Dublin', timestamp:'2 天前', likes:91,
  },
  {
    id:'b5', type:'資訊分享', tag:'IRP 名額', tilt:1.5, pinColor:'#A855F7',
    title:'⚡ IRP 本週釋出名額通知',
    content:'剛看到 Burgh Quay INIS 官網，本週四 14:00~16:00 有線上預約名額開放，手腳要快！連結在 irishimmigration.ie',
    author:'Ting Wang', city:'Dublin', timestamp:'5 小時前', likes:55,
  },
  {
    id:'b6', type:'資訊分享', tag:'圖書館', tilt:-2, pinColor:'#6B7280',
    title:'Galway City Library 有免費列印服務',
    content:'Galway 的朋友注意！St. Augustine Street 圖書館可以免費黑白列印（每天 20 頁限制），帶隨身碟或用館內電腦都可以。超好用！',
    author:'Amy Tsai', city:'Galway', timestamp:'3 天前', likes:29,
  },
  {
    id:'b7', type:'揪團', tag:'超市採購', tilt:0.5, pinColor:'#E74C3C',
    title:'週六 Lidl 拼車採購，Limerick',
    content:'住 Dooradoyle 附近的人有沒有想要週六下午一起去 Lidl 採購的？可以分攤車資，我有車 🚗',
    author:'Kevin Lin', city:'Limerick', timestamp:'昨天', likes:14,
  },
  {
    id:'b8', type:'資訊分享', tag:'PPSN 攻略', tilt:-1, pinColor:'#3B82F6',
    title:'PPSN 申請流程完整攻略（2025 版）',
    content:'① 到 gov.ie 預約 Intreo Centre ② 帶護照 + 愛爾蘭地址證明（如租約或銀行信） ③ 說明來申請 PPSN ④ 當場審核，約 1-2 週收到信。Dublin 要特別早預約，Cork/Galway 相對快！',
    author:'Sophie Chen', city:'Cork', timestamp:'1 週前', likes:134,
  },
  {
    id:'b9', type:'資訊分享', tag:'餐廳優惠', tilt:2, pinColor:'#F59E0B',
    title:'Cork 某餐廳固定週二套餐特價',
    content:'Patrick Street 附近的 Farmgate Café，每週二午餐套餐 €12 含湯 + 主菜 + 茶/咖啡，份量很夠，推薦給在 Cork 的朋友！',
    author:'Mei Lin', city:'Cork', timestamp:'4 天前', likes:22,
  },
  {
    id:'b10', type:'資訊分享', tag:'雨天去處', tilt:-1.5, pinColor:'#10B981',
    title:'最適合雨天的安靜圖書館＆咖啡廳清單',
    content:'1. Pearse Street Library（免費 WiFi，插座多）\n2. Chapters Bookstore 地下室咖啡（超安靜）\n3. Irish Film Institute bar（有點昏暗但文青感十足）\n雨天必備口袋清單！',
    author:'Po Han', city:'Dublin', timestamp:'5 天前', likes:77,
  },
];

const SEED_SOS: SOSPost[] = [
  {
    id:'s1', category:'租屋詐騙',
    title:'轉帳後房東消失，已報警求助',
    content:'在 Daft 上找到一間 Dublin 的房子，轉帳 €1,500 訂金後對方消失。已報警但想問有沒有人有類似經驗，或知道還有什麼管道可以追回錢？',
    anon:true, author:'', city:'Dublin', timestamp:'1 小時前', helpers:8,
  },
  {
    id:'s2', category:'合約糾紛',
    title:'試用期被強迫加班，合法嗎？',
    content:'公司說試用期內要求每週 50 小時，但合約只寫 39 小時。老闆說不做就走人。請問愛爾蘭法律怎麼規定試用期加班？有沒有人遇過類似情況？',
    anon:false, author:'小明', city:'Cork', timestamp:'昨天', helpers:15,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const TYPE_STYLE: Record<PostType, { bg: string; accent: string; label: string }> = {
  揪團:    { bg: '#FFFDE7', accent: '#F59E0B', label: '🤝 揪團' },
  資訊分享: { bg: '#F0F4FF', accent: '#3B82F6', label: '📋 資訊分享' },
};

const SOS_CAT: Record<SOSCategory, { color: string; icon: string }> = {
  租屋詐騙: { color: '#E74C3C', icon: '🏠' },
  合約糾紛: { color: '#F59E0B', icon: '📄' },
  健康狀況: { color: '#E91E63', icon: '🏥' },
  工作問題: { color: '#9C27B0', icon: '💼' },
  其他:     { color: '#607D8B', icon: '❓' },
};

// ─── SOS Modal ────────────────────────────────────────────────────────────────
// ─── SOS Reply type ───────────────────────────────────────────────────────────
interface SOSReply {
  id:        string;
  author:    string;
  city:      string;
  content:   string;
  timestamp: string;
}

// ─── SOS Detail (inner panel) ─────────────────────────────────────────────────
function SOSDetail({
  post, onBack, playerName, playerCity,
}: {
  post:        SOSPost;
  onBack:      () => void;
  playerName:  string;
  playerCity:  string;
}) {
  const cat = SOS_CAT[post.category];
  const [replies,  setReplies]  = useState<SOSReply[]>([]);
  const [replyTxt, setReplyTxt] = useState('');

  const sendReply = () => {
    if (!replyTxt.trim()) return;
    const now = new Date();
    const ts = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setReplies(prev => [...prev, {
      id: Date.now().toString(),
      author: playerName || '匿名冒險者',
      city: playerCity || '',
      content: replyTxt.trim(),
      timestamp: ts,
    }]);
    setReplyTxt('');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Back bar */}
      <button onClick={onBack} style={{
        flexShrink:0, display:'flex', alignItems:'center', gap:6,
        padding:'8px 14px', border:'none', borderBottom:'2px solid #FFCDD2',
        background:'#FDECEA', cursor:'pointer', fontSize:10, color:'#C62828', ...ZH,
      }}>← 返回求助列表</button>

      <div style={{ flex:1, overflowY:'auto' }}>
        {/* Post body */}
        <div style={{ padding:'12px 14px', borderBottom:'2px solid #FFCDD2' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
            <span style={{
              background: cat.color, color:'#fff',
              fontSize:8, fontWeight:900, padding:'2px 8px', ...ZH,
            }}>{cat.icon} {post.category}</span>
            {post.anon && (
              <span style={{ fontSize:8, color:'#888', border:'1px solid #ddd', padding:'1px 5px', ...ZH }}>匿名發布</span>
            )}
            <span style={{ marginLeft:'auto', fontSize:8, color:'#bbb', ...EN }}>{post.timestamp}</span>
          </div>
          <div style={{ fontSize:14, fontWeight:900, marginBottom:8, lineHeight:1.4, ...ZH }}>{post.title}</div>
          <div style={{ fontSize:11, color:'#444', lineHeight:1.8, whiteSpace:'pre-line', ...ZH }}>{post.content}</div>
          {!post.anon && post.author && (
            <div style={{ marginTop:8, fontSize:9, color:'#888', ...ZH }}>
              {post.author}
              {post.city && <span style={{ marginLeft:4, ...EN }}>座標：{post.city}</span>}
            </div>
          )}
        </div>

        {/* Replies */}
        <div style={{ padding:'10px 14px' }}>
          <div style={{ fontSize:9, fontWeight:900, color:'#888', marginBottom:8, ...ZH }}>
            💬 經驗分享 · 留言區（{replies.length}）
          </div>
          {replies.length === 0 && (
            <div style={{ fontSize:10, color:'#ccc', textAlign:'center', padding:'12px 0', ...ZH }}>
              還沒有人留言，成為第一個分享經驗的人吧！
            </div>
          )}
          {replies.map(r => (
            <div key={r.id} style={{
              marginBottom:8, padding:'8px 10px',
              background:'#fff', border:'1.5px solid #FFCDD2',
              boxShadow:'2px 2px 0 #FFCDD2',
            }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', marginBottom:4, ...ZH }}>
                {r.author}
                {r.city && <span style={{ marginLeft:4, color:'#E74C3C', ...EN }}>座標：{r.city}</span>}
                <span style={{ marginLeft:6, color:'#bbb', fontWeight:400, ...EN }}>{r.timestamp}</span>
              </div>
              <div style={{ fontSize:11, color:'#333', lineHeight:1.7, ...ZH }}>{r.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply input */}
      <div style={{
        flexShrink:0, padding:'10px 14px',
        borderTop:'2px solid #FFCDD2', background:'#FFF5F5',
        display:'flex', gap:8,
      }}>
        <input
          value={replyTxt}
          onChange={e => setReplyTxt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendReply()}
          placeholder="分享你的經驗或建議…"
          style={{
            flex:1, padding:'8px 10px', fontSize:11,
            border:'2px solid #FFCDD2', outline:'none',
            background:'#fff', ...ZH,
          }}
        />
        <button onClick={sendReply} style={{
          padding:'8px 12px', border:'2px solid #E74C3C',
          background:'#E74C3C', color:'#fff',
          fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
          boxShadow:'2px 2px 0 #c0392b',
        }}>送出</button>
      </div>
    </div>
  );
}

function SOSModal({
  onClose, playerName, playerCity,
}: {
  onClose:    () => void;
  playerName: string;
  playerCity: string;
}) {
  const [posts,      setPosts]      = useState<SOSPost[]>(SEED_SOS);
  const [view,       setView]       = useState<'list'|'new'>('list');
  const [detailId,   setDetailId]   = useState<string|null>(null);
  const [anon,       setAnon]       = useState(true);
  const [cat,        setCat]        = useState<SOSCategory>('其他');
  const [title,      setTitle]      = useState('');
  const [content,    setContent]    = useState('');

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    const ts = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setPosts(prev => [{
      id: Date.now().toString(), category: cat,
      title: title.trim(), content: content.trim(),
      anon, author: anon ? '' : (playerName || '匿名'),
      city: playerCity || '', timestamp: ts, helpers: 0,
    }, ...prev]);
    setTitle(''); setContent(''); setView('list');
  };

  const detailPost = detailId ? posts.find(p => p.id === detailId) : null;

  return ReactDOM.createPortal(
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.85)',
      display:'flex', flexDirection:'column',
    }} onClick={onClose}>
      <div style={{
        margin:'auto', width:'100%', maxWidth:420, maxHeight:'92vh',
        display:'flex', flexDirection:'column',
        background:'#FFF5F5', border:'3px solid #E74C3C',
        boxShadow:'8px 8px 0 rgba(231,76,60,0.4)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background:'#E74C3C', color:'#fff',
          padding:'10px 14px', display:'flex', alignItems:'center', gap:8, flexShrink:0,
        }}>
          <span style={{ fontSize:20 }}>📮</span>
          <div>
            <div style={{ fontSize:13, fontWeight:900, ...ZH }}>互助安全網 SOS</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.75)', ...ZH }}>匿名求助 · 台灣人互助</div>
          </div>
          <button onClick={onClose} style={{
            marginLeft:'auto', background:'none', border:'none',
            color:'#fff', fontSize:20, cursor:'pointer', lineHeight:1,
          }}>✕</button>
        </div>

        {/* Notice bar */}
        <div style={{
          flexShrink:0, background:'#FDECEA', borderBottom:'2px solid #FFCDD2',
          padding:'6px 14px', fontSize:9, color:'#C62828', ...ZH,
        }}>
          ⚠️ 此版面僅供台灣打工人互助交流，如遇緊急情況請優先撥打 112。
        </div>

        {/* Tab — hidden when in detail view */}
        {!detailPost && (
          <div style={{ flexShrink:0, display:'flex', borderBottom:'2px solid #FFCDD2' }}>
            {([
              { id:'list' as const, label:'📋 求助紀錄' },
              { id:'new'  as const, label:'🆘 發起求助' },
            ]).map((t, i) => (
              <button key={t.id} onClick={() => setView(t.id)} style={{
                flex:1, padding:'8px 4px', border:'none',
                borderRight: i===0 ? '1.5px solid #FFCDD2' : 'none',
                background: view===t.id ? '#E74C3C' : '#FFF5F5',
                color: view===t.id ? '#fff' : '#E74C3C',
                fontWeight: view===t.id ? 900 : 400,
                fontSize:11, cursor:'pointer', ...ZH,
              }}>{t.label}</button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex:1, overflowY: detailPost ? 'hidden' : 'auto', display:'flex', flexDirection:'column' }}>

          {/* Detail view */}
          {detailPost && (
            <SOSDetail
              post={detailPost}
              onBack={() => setDetailId(null)}
              playerName={playerName}
              playerCity={playerCity}
            />
          )}

          {/* List view */}
          {!detailPost && view === 'list' && (
            <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:10 }}>
              {posts.map(p => {
                const c = SOS_CAT[p.category];
                return (
                  <div key={p.id}
                    onClick={() => setDetailId(p.id)}
                    style={{
                      border:`2.5px solid ${c.color}`,
                      boxShadow:`3px 3px 0 ${c.color}55`,
                      background:'#fff', padding:'10px 12px',
                      cursor:'pointer', transition:'transform 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                      <span style={{
                        background: c.color, color:'#fff',
                        fontSize:8, fontWeight:900, padding:'2px 7px', ...ZH,
                      }}>{c.icon} {p.category}</span>
                      {p.anon && (
                        <span style={{
                          fontSize:8, color:'#888', border:'1px solid #ddd',
                          padding:'1px 5px', ...ZH,
                        }}>匿名發布</span>
                      )}
                      <span style={{ marginLeft:'auto', fontSize:8, color:'#bbb', ...EN }}>{p.timestamp}</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:900, marginBottom:4, ...ZH }}>{p.title}</div>
                    <div style={{
                      fontSize:10, color:'#555', lineHeight:1.6, ...ZH,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                    }}>{p.content}</div>
                    <div style={{
                      marginTop:8, display:'flex', alignItems:'center', gap:8, fontSize:9, color:'#888',
                    }}>
                      {!p.anon && p.author && (
                        <span style={{ ...ZH }}>
                          {p.author}
                          {p.city && <span style={{ marginLeft:4, ...EN }}>座標：{p.city}</span>}
                        </span>
                      )}
                      <span style={{ marginLeft:'auto', color: c.color, fontWeight:900, ...ZH }}>
                        🤝 {p.helpers} 人伸出援手
                      </span>
                    </div>
                    <div style={{ marginTop:4, fontSize:8, color: c.color, textAlign:'right', fontWeight:700, ...ZH }}>
                      點擊查看全文 →
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === 'new' && (
            <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
              {/* Anonymous toggle */}
              <div style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'8px 10px', background:'#FDECEA', border:'1.5px solid #FFCDD2',
                cursor:'pointer',
              }} onClick={() => setAnon(v => !v)}>
                <div style={{
                  width:18, height:18, border:'2px solid #E74C3C',
                  background: anon ? '#E74C3C' : '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  {anon && <span style={{ color:'#fff', fontSize:11, fontWeight:900 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:900, ...ZH }}>匿名發布</div>
                  <div style={{ fontSize:8, color:'#888', ...ZH }}>勾選後，其他人看不到你的名字</div>
                </div>
              </div>

              {/* Category */}
              <div>
                <div style={{ fontSize:9, fontWeight:900, marginBottom:5, ...ZH }}>求助類別</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {(Object.keys(SOS_CAT) as SOSCategory[]).map(c => (
                    <button key={c} onClick={() => setCat(c)} style={{
                      padding:'4px 10px', border:`2px solid ${SOS_CAT[c].color}`,
                      background: cat===c ? SOS_CAT[c].color : '#fff',
                      color: cat===c ? '#fff' : SOS_CAT[c].color,
                      fontSize:10, fontWeight:700, cursor:'pointer', ...ZH,
                    }}>{SOS_CAT[c].icon} {c}</button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <div style={{ fontSize:9, fontWeight:900, marginBottom:4, ...ZH }}>求助標題</div>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="簡述你的困難…"
                  style={{
                    width:'100%', padding:'8px 10px', fontSize:12,
                    border:`2px solid #E74C3C`, outline:'none',
                    background:'#fff', ...ZH, boxSizing:'border-box',
                  }}
                />
              </div>

              {/* Content */}
              <div>
                <div style={{ fontSize:9, fontWeight:900, marginBottom:4, ...ZH }}>詳細說明</div>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={5}
                  placeholder="請描述情況、目前進度，或你需要什麼協助…"
                  style={{
                    width:'100%', padding:'8px 10px', fontSize:11,
                    border:`2px solid #E74C3C`, outline:'none', resize:'none',
                    background:'#fff', lineHeight:1.6, ...ZH, boxSizing:'border-box',
                  }}
                />
              </div>

              <button onClick={submit} style={{
                padding:'12px', border:'3px solid #E74C3C', boxShadow:'4px 4px 0 #E74C3C',
                background:'#E74C3C', color:'#fff',
                fontSize:13, fontWeight:900, cursor:'pointer', ...ZH,
              }}>🆘 發出求助</button>

              <div style={{ fontSize:9, color:'#aaa', textAlign:'center', ...ZH }}>
                發出後，公會其他成員將看到這則求助
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── New Post Form ────────────────────────────────────────────────────────────
function NewPostForm({
  onSubmit, onCancel,
}: {
  onSubmit: (p: Omit<BoardPost,'id'|'likes'|'tilt'|'pinColor'>) => void;
  onCancel: () => void;
}) {
  const [type,    setType]    = useState<PostType>('揪團');
  const [tag,     setTag]     = useState('');
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const { state } = useGame();

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    const now = new Date();
    const ts = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    onSubmit({
      type, tag: tag.trim() || type,
      title: title.trim(), content: content.trim(),
      author: state.player.name || '匿名冒險者',
      city: state.player.city || '',
      timestamp: ts,
    });
    setTitle(''); setContent(''); setTag('');
  };

  const st = TYPE_STYLE[type];

  return (
    <div style={{
      margin:'0 10px 12px', border:`3px solid ${st.accent}`,
      boxShadow:`4px 4px 0 ${st.accent}`,
      background: st.bg, padding:'12px',
      display:'flex', flexDirection:'column', gap:8,
    }}>
      <div style={{ fontSize:10, fontWeight:900, color: st.accent, ...ZH }}>📌 新增告示</div>

      {/* Type */}
      <div style={{ display:'flex', gap:6 }}>
        {(['揪團','資訊分享'] as PostType[]).map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            flex:1, padding:'6px',
            border:`2.5px solid ${TYPE_STYLE[t].accent}`,
            background: type===t ? TYPE_STYLE[t].accent : '#fff',
            color: type===t ? '#fff' : TYPE_STYLE[t].accent,
            fontWeight:900, fontSize:10, cursor:'pointer', ...ZH,
          }}>{TYPE_STYLE[t].label}</button>
        ))}
      </div>

      <input
        value={tag} onChange={e => setTag(e.target.value)}
        placeholder="標籤（如：IRP、購物、租屋…）"
        style={{
          padding:'6px 9px', border:'2px solid #ccc', fontSize:10,
          outline:'none', background:'#fff', ...ZH,
        }}
      />
      <input
        value={title} onChange={e => setTitle(e.target.value)}
        placeholder="告示標題（必填）"
        style={{
          padding:'7px 9px', border:`2px solid ${st.accent}`, fontSize:12,
          fontWeight:700, outline:'none', background:'#fff', ...ZH,
        }}
      />
      <textarea
        value={content} onChange={e => setContent(e.target.value)}
        rows={3}
        placeholder="內容詳情…"
        style={{
          padding:'7px 9px', border:'2px solid #ccc', fontSize:11,
          resize:'none', outline:'none', background:'#fff', lineHeight:1.6, ...ZH,
        }}
      />
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={submit} style={{
          flex:1, padding:'8px', border:`2.5px solid ${st.accent}`,
          boxShadow:`3px 3px 0 ${st.accent}`, background: st.accent, color:'#fff',
          fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
        }}>📌 釘上告示板</button>
        <button onClick={onCancel} style={{
          padding:'8px 14px', border:'2px solid #ccc',
          background:'#fff', fontSize:11, cursor:'pointer', ...ZH,
        }}>取消</button>
      </div>
    </div>
  );
}

// ─── Board Reply type ─────────────────────────────────────────────────────────
interface BoardReply {
  id:        string;
  author:    string;
  city:      string;
  content:   string;
  timestamp: string;
}

// ─── Post Detail Modal ────────────────────────────────────────────────────────
function PostDetailModal({ post, onClose, onLike, liked }: {
  post:    BoardPost;
  onClose: () => void;
  onLike:  () => void;
  liked:   boolean;
}) {
  const { state } = useGame();
  const st = TYPE_STYLE[post.type];
  const [replies,  setReplies]  = useState<BoardReply[]>([]);
  const [replyTxt, setReplyTxt] = useState('');

  const sendReply = () => {
    if (!replyTxt.trim()) return;
    const now = new Date();
    const ts = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setReplies(prev => [...prev, {
      id: Date.now().toString(),
      author: state.player.name || '匿名冒險者',
      city: state.player.city || '',
      content: replyTxt.trim(),
      timestamp: ts,
    }]);
    setReplyTxt('');
  };

  return ReactDOM.createPortal(
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.75)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'16px',
    }} onClick={onClose}>
      <div style={{
        width:'100%', maxWidth:400, maxHeight:'85vh',
        display:'flex', flexDirection:'column',
        background: st.bg,
        border:`3px solid ${st.accent}`,
        boxShadow:`6px 6px 0 rgba(0,0,0,0.35)`,
        position:'relative',
      }} onClick={e => e.stopPropagation()}>

        {/* Colored pin */}
        <div style={{
          position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
          width:18, height:18, borderRadius:'50%',
          background: post.pinColor, border:'2.5px solid rgba(0,0,0,0.3)',
          boxShadow:'0 3px 6px rgba(0,0,0,0.35)', zIndex:2,
        }}/>

        {/* Header */}
        <div style={{
          background: st.accent, padding:'10px 14px',
          display:'flex', alignItems:'center', gap:8, flexShrink:0,
        }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
              <span style={{
                background:'rgba(255,255,255,0.25)', color:'#fff',
                fontSize:8, fontWeight:900, padding:'1px 6px', ...ZH,
              }}>{st.label}</span>
              <span style={{ fontSize:8, color:'rgba(255,255,255,0.8)', ...ZH }}>#{post.tag}</span>
            </div>
            <div style={{ fontSize:13, fontWeight:900, color:'#fff', lineHeight:1.3, ...ZH }}>
              {post.title}
            </div>
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none', color:'#fff',
            fontSize:18, cursor:'pointer', lineHeight:1, flexShrink:0,
          }}>✕</button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {/* Post content */}
          <div style={{ padding:'14px', borderBottom:`2px solid ${st.accent}33` }}>
            <div style={{ fontSize:12, color:'#333', lineHeight:1.8, whiteSpace:'pre-line', ...ZH }}>
              {post.content}
            </div>
            <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, fontWeight:700, color:'#444', ...ZH }}>
                  {post.author}
                  {post.city && <span style={{ marginLeft:5, color: st.accent, ...EN }}>座標：{post.city}</span>}
                </div>
                <div style={{ fontSize:8, color:'#aaa', ...EN }}>{post.timestamp}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onLike(); }} style={{
                display:'flex', alignItems:'center', gap:4,
                border:`2px solid ${liked ? st.accent : 'rgba(0,0,0,0.15)'}`,
                background: liked ? st.accent : 'rgba(255,255,255,0.8)',
                color: liked ? '#fff' : '#333',
                padding:'5px 12px', cursor: liked ? 'default' : 'pointer',
                fontSize:11, fontWeight:700, flexShrink:0, ...ZH,
                boxShadow:'2px 2px 0 rgba(0,0,0,0.12)',
              }}>
                ❤️ {post.likes}
              </button>
            </div>
          </div>

          {/* Replies */}
          <div style={{ padding:'10px 14px' }}>
            <div style={{ fontSize:9, fontWeight:900, color:'#888', marginBottom:8, ...ZH }}>
              💬 留言（{replies.length}）
            </div>
            {replies.length === 0 && (
              <div style={{ fontSize:10, color:'#ccc', textAlign:'center', padding:'10px 0', ...ZH }}>
                還沒有留言，來回應這則告示吧！
              </div>
            )}
            {replies.map(r => (
              <div key={r.id} style={{
                marginBottom:8, padding:'8px 10px',
                background:'rgba(255,255,255,0.7)',
                border:`1.5px solid ${st.accent}44`,
                boxShadow:`2px 2px 0 ${st.accent}22`,
              }}>
                <div style={{ fontSize:9, fontWeight:700, color:'#555', marginBottom:3, ...ZH }}>
                  {r.author}
                  {r.city && <span style={{ marginLeft:4, color: st.accent, ...EN }}>座標：{r.city}</span>}
                  <span style={{ marginLeft:6, color:'#bbb', fontWeight:400, ...EN }}>{r.timestamp}</span>
                </div>
                <div style={{ fontSize:11, color:'#333', lineHeight:1.7, ...ZH }}>{r.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply input */}
        <div style={{
          flexShrink:0, padding:'10px 14px',
          borderTop:`2px solid ${st.accent}44`,
          background:'rgba(255,255,255,0.6)',
          display:'flex', gap:8,
        }}>
          <input
            value={replyTxt}
            onChange={e => setReplyTxt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendReply()}
            placeholder="留下你的回應…"
            style={{
              flex:1, padding:'8px 10px', fontSize:11,
              border:`2px solid ${st.accent}88`, outline:'none',
              background:'#fff', ...ZH,
            }}
          />
          <button onClick={sendReply} style={{
            padding:'8px 12px',
            border:`2px solid ${st.accent}`,
            background: st.accent, color:'#fff',
            fontWeight:900, fontSize:11, cursor:'pointer', ...ZH,
            boxShadow:`2px 2px 0 ${st.accent}88`,
          }}>送出</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
const PIN_COLORS = ['#E74C3C','#3B82F6','#F59E0B','#10B981','#A855F7','#6B7280'];

function PostCard({ post, onLike, liked }: { post: BoardPost; onLike: () => void; liked: boolean }) {
  const [showDetail, setShowDetail] = useState(false);
  const st = TYPE_STYLE[post.type];
  return (
    <>
      {showDetail && (
        <PostDetailModal
          post={post}
          onClose={() => setShowDetail(false)}
          onLike={onLike}
          liked={liked}
        />
      )}
      <div style={{
        background: st.bg,
        border:'2px solid rgba(0,0,0,0.15)',
        boxShadow:'3px 4px 10px rgba(0,0,0,0.22)',
        padding:'10px 10px 8px',
        transform: `rotate(${post.tilt}deg)`,
        position:'relative',
        transition:'transform 0.15s',
        cursor:'pointer',
      }}
        onClick={() => setShowDetail(true)}
        onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)')}
        onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${post.tilt}deg)`)}
      >
        {/* Pin */}
        <div style={{
          position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
          width:14, height:14, borderRadius:'50%',
          background: post.pinColor,
          border:'2px solid rgba(0,0,0,0.3)',
          boxShadow:'0 2px 4px rgba(0,0,0,0.3)',
          zIndex:2,
        }}/>

        {/* Type badge */}
        <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:5, marginTop:2 }}>
          <span style={{
            background: st.accent, color:'#fff',
            fontSize:7, fontWeight:900, padding:'1px 6px', ...ZH,
          }}>{st.label}</span>
          <span style={{
            fontSize:7, color:'#888', background:'rgba(0,0,0,0.06)',
            padding:'1px 5px', ...ZH,
          }}>#{post.tag}</span>
        </div>

        {/* Left accent bar */}
        <div style={{
          borderLeft:`3px solid ${st.accent}`,
          paddingLeft:7, marginBottom:5,
        }}>
          <div style={{ fontSize:11, fontWeight:900, lineHeight:1.35, ...ZH }}>{post.title}</div>
        </div>

        <div style={{
          fontSize:9, color:'#444', lineHeight:1.6, ...ZH,
          whiteSpace:'pre-line',
          display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>
          {post.content}
        </div>

        {/* Footer */}
        <div style={{ marginTop:7, display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:8, fontWeight:700, color:'#555', ...ZH, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {post.author}
              {post.city && <span style={{ marginLeft:4, color: st.accent, ...EN }}>座標：{post.city}</span>}
            </div>
            <div style={{ fontSize:7, color:'#bbb', ...EN }}>{post.timestamp}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onLike(); }} style={{
            display:'flex', alignItems:'center', gap:3,
            border:'1.5px solid rgba(0,0,0,0.15)',
            background:'rgba(255,255,255,0.7)', padding:'2px 7px',
            cursor:'pointer', fontSize:9, flexShrink:0, ...ZH,
            boxShadow:'1px 1px 0 rgba(0,0,0,0.12)',
          }}>
            ❤️ {post.likes}
          </button>
        </div>

        {/* Read more hint */}
        <div style={{
          marginTop:4, fontSize:7, color: st.accent,
          textAlign:'right', fontWeight:700, ...ZH,
        }}>點擊查看全文 →</div>
      </div>
    </>
  );
}

// ─── Guild Screen Root ─────────────────────────────────────────────────────────
export function GuildScreen() {
  const { state } = useGame();
  const [posts,     setPosts]     = useState<BoardPost[]>(SEED_POSTS);
  const [filter,    setFilter]    = useState<PostType | 'all'>('all');
  const [showForm,  setShowForm]  = useState(false);
  const [showSOS,   setShowSOS]   = useState(false);
  const [likesMap,  setLikesMap]  = useState<Record<string, boolean>>({});

  const addPost = (p: Omit<BoardPost,'id'|'likes'|'tilt'|'pinColor'>) => {
    const tilts      = [-1.5, 1, -1, 2, 0.5, 1.5, -2, 0];
    const idx        = posts.length % tilts.length;
    const pinIdx     = posts.length % PIN_COLORS.length;
    setPosts(prev => [{
      ...p, id: Date.now().toString(), likes: 0,
      tilt: tilts[idx], pinColor: PIN_COLORS[pinIdx],
    }, ...prev]);
    setShowForm(false);
  };

  const handleLike = (id: string) => {
    if (likesMap[id]) return;
    setLikesMap(prev => ({ ...prev, [id]: true }));
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ minHeight:'100%', display:'block' }}>
      {showSOS && (
        <SOSModal
          onClose={() => setShowSOS(false)}
          playerName={state.player.name}
          playerCity={state.player.city || ''}
        />
      )}

      {/* ── Sticky Header ── */}
      <div style={{
        position:'sticky', top:0, zIndex:20,
        background:'#2C1A0E', color:'#C9A96E',
        padding:'9px 14px', borderBottom:'3px solid #000',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ fontSize:20 }}>⚔️</span>
        <div>
          <div style={{ fontSize:13, fontWeight:900, ...ZH }}>冒險者公會</div>
          <div style={{ fontSize:8, color:'#666', ...EN }}>GUILD QUEST BOARD · 台灣人在愛爾蘭</div>
        </div>
        {/* SOS mailbox */}
        <button onClick={() => setShowSOS(true)} style={{
          marginLeft:'auto', display:'flex', flexDirection:'column',
          alignItems:'center', gap:1,
          background:'#E74C3C', border:'2.5px solid #000', boxShadow:'3px 3px 0 #000',
          padding:'5px 9px', cursor:'pointer', color:'#fff',
        }}>
          <span style={{ fontSize:16, lineHeight:1 }}>📮</span>
          <span style={{ fontSize:7, fontWeight:900, ...ZH }}>互助安全網</span>
        </button>
      </div>

      {/* ── Cork Board ── */}
      <div style={{
        background:'#8B6239',
        backgroundImage:`
          radial-gradient(ellipse at 20% 30%, rgba(120,80,30,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 75% 70%, rgba(90,55,20,0.3) 0%, transparent 50%),
          repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.025) 4px, rgba(0,0,0,0.025) 5px)
        `,
        padding:'8px',
        borderBottom:'4px solid #5C3A1A',
      }}>
        {/* Wooden frame top bar */}
        <div style={{
          background:'linear-gradient(180deg,#5C3A1A,#7A4D22)',
          padding:'6px 12px', marginBottom:10,
          borderRadius:3, border:'1.5px solid #3A1C08',
          display:'flex', alignItems:'center', gap:8,
          boxShadow:'0 3px 6px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize:11, ...ZH, color:'#C9A96E', fontWeight:900 }}>📜 公會告示板</span>
          <div style={{ display:'flex', gap:5, marginLeft:4 }}>
            {(['all','揪團','資訊分享'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:'2px 8px',
                border:`1.5px solid ${filter===f ? '#FFD700' : 'rgba(201,169,110,0.4)'}`,
                background: filter===f ? '#FFD700' : 'rgba(0,0,0,0.25)',
                color: filter===f ? '#000' : '#C9A96E',
                fontSize:8, fontWeight: filter===f ? 900 : 400, cursor:'pointer', ...ZH,
              }}>{f==='all' ? '全部' : f}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(v => !v)} style={{
            marginLeft:'auto', padding:'3px 10px',
            border:'2px solid #FFD700', background: showForm ? '#FFD700' : 'transparent',
            color: showForm ? '#000' : '#FFD700',
            fontSize:9, fontWeight:900, cursor:'pointer', ...ZH,
          }}>
            {showForm ? '✕ 取消' : '📌 釘上告示'}
          </button>
        </div>

        {/* New post form */}
        {showForm && (
          <NewPostForm onSubmit={addPost} onCancel={() => setShowForm(false)} />
        )}

        {/* Post grid */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:18,
          padding:'4px 6px 10px',
        }}>
          {filtered.map(post => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} liked={!!likesMap[post.id]} />
          ))}
          {filtered.length === 0 && (
            <div style={{
              gridColumn:'1/-1', textAlign:'center',
              color:'rgba(255,255,255,0.5)', fontSize:11, padding:'30px 0', ...ZH,
            }}>暫無告示，來釘第一張吧！</div>
          )}
        </div>
      </div>

      {/* ── Player CTA strip ── */}
      <div style={{
        padding:'8px 14px',
        background:'#1a0e06', display:'flex', alignItems:'center', gap:8,
        borderTop:'2px solid #000',
      }}>
        <span style={{ fontSize:14 }}>✍️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#C9A96E', ...ZH }}>
            {state.player.name || '冒險者'}
            {state.player.city && (
              <span style={{
                marginLeft:6, fontSize:8, fontWeight:900,
                background:'#FFD700', color:'#000', padding:'1px 5px',
                border:'1px solid #000', ...EN,
              }}>📍 座標：{state.player.city}</span>
            )}
          </div>
          <div style={{ fontSize:8, color:'#555', marginTop:1, ...ZH }}>點擊「釘上告示」分享你的情報！</div>
        </div>
      </div>
    </div>
  );
}
