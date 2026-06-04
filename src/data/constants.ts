/**
 * WHinIE – Knowledge Base Constants
 * Source: 主線任務.md / 日常任務.md / 商店.md / 背包.md / 隨機事件.md / Ireland.pdf
 * All data reflects real Irish WHV logistics & Dublin daily life.
 */

import type {
  Task, DailyTask, ShopItem, BagItem,
  RandomEvent, Badge, BankStep, GuildPost,
  AvatarConfig, ScreenId,
} from '../types';

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Itim&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap";

export const ZH = {
  fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif",
} as const;
export const EN = { fontFamily: "'Itim', cursive" } as const;

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const TABS: { id: ScreenId; label: string; emoji: string }[] = [
  { id: 'HOME',        label: 'HOME',          emoji: '🏠' },
  { id: 'AIB',         label: 'AIB Bank',      emoji: '🏦' },
  { id: 'TASK',        label: 'Task',          emoji: '📋' },
  { id: 'GUILD',       label: 'GUILD',         emoji: '⚔️' },
  { id: 'DUNNES',      label: 'DUNNES',        emoji: '🛒' },
  { id: 'BAG',         label: 'BAG',           emoji: '🎒' },
  { id: 'COLLECTIONS', label: 'COLLECTIONS',  emoji: '📔' },
];

// ─── Avatar Options ───────────────────────────────────────────────────────────
export const HAIR_OPTIONS: { label: string; value: string; emoji: string }[] = [
  { label: '無前髮', value: '',           emoji: '🙂' },
  { label: '梳邊',   value: 'sideComed',  emoji: '💇' },
  { label: '削邊',   value: 'undercut',   emoji: '✂️' },
  { label: '刺蝟',   value: 'spiky',      emoji: '⚡' },
  { label: '丸子',   value: 'bun',        emoji: '🍡' },
];

export const REAR_HAIR_OPTIONS: { label: string; value: string; emoji: string }[] = [
  { label: '無後髮', value: '',             emoji: '🙂' },
  { label: '長直',   value: 'longStraight', emoji: '💁' },
  { label: '長波',   value: 'longWavy',     emoji: '🌊' },
  { label: '肩長',   value: 'shoulderHigh', emoji: '👱' },
  { label: '頸長',   value: 'neckHigh',     emoji: '💆' },
];

export const OUTFIT_OPTIONS = [
  { label: '高領', value: 'turtleNeck', emoji: '🧥' },
  { label: '外套', value: 'openJacket', emoji: '🧣' },
  { label: '洋裝', value: 'dress',      emoji: '👗' },
  { label: '襯衫', value: 'shirt',      emoji: '👔' },
  { label: 'T恤',  value: 'tShirt',     emoji: '👕' },
];

export const EYES_OPTIONS = [
  { label: '開心', value: 'happy',  emoji: '😊' },
  { label: '圓眼', value: 'wide',   emoji: '👁️' },
  { label: '弓眼', value: 'bow',    emoji: '🙂' },
  { label: '溫柔', value: 'humble', emoji: '😌' },
  { label: '眨眼', value: 'wink',   emoji: '😉' },
];

export const MOUTH_OPTIONS = [
  { label: '大笑', value: 'laugh', emoji: '😄' },
  { label: '生氣', value: 'angry', emoji: '😠' },
  { label: '張嘴', value: 'agape', emoji: '😮' },
  { label: '微笑', value: 'smile', emoji: '🙂' },
  { label: '難過', value: 'sad',   emoji: '😢' },
];

export const HAIR_COLOR_OPTIONS = [
  { label: '黑色', value: '2c1b18', swatch: '#2c1b18' },
  { label: '深棕', value: '4a312c', swatch: '#4a312c' },
  { label: '棕色', value: '724133', swatch: '#724133' },
  { label: '淺棕', value: 'a55728', swatch: '#a55728' },
  { label: '金棕', value: 'b58143', swatch: '#b58143' },
  { label: '金色', value: 'd6b370', swatch: '#d6b370' },
  { label: '紅色', value: 'c93305', swatch: '#c93305' },
  { label: '粉色', value: 'f59797', swatch: '#f59797' },
  { label: '米白', value: 'ecdcbf', swatch: '#ecdcbf' },
  { label: '銀白', value: 'e8e1e1', swatch: '#e8e1e1' },
];

export const SKIN_COLOR_OPTIONS = [
  { label: '瓷白', value: 'f8d5c2', swatch: '#f8d5c2' },
  { label: '米膚', value: 'f3c49a', swatch: '#f3c49a' },
  { label: '小麥', value: 'd08b5b', swatch: '#d08b5b' },
  { label: '蜜棕', value: 'ae5d29', swatch: '#ae5d29' },
  { label: '深棕', value: '694d3d', swatch: '#694d3d' },
  { label: '巧克力', value: '3c1f0f', swatch: '#3c1f0f' },
];

export const CLOTHES_COLOR_OPTIONS = [
  { label: '海軍藍', value: '264653', swatch: '#264653' },
  { label: '翠綠',   value: '2a9d8f', swatch: '#2a9d8f' },
  { label: '橙黃',   value: 'e9c46a', swatch: '#e9c46a' },
  { label: '暖橘',   value: 'f4a261', swatch: '#f4a261' },
  { label: '朱紅',   value: 'e76f51', swatch: '#e76f51' },
  { label: '純白',   value: 'ffffff', swatch: '#ffffff' },
  { label: '炭黑',   value: '222222', swatch: '#222222' },
  { label: '薰衣草', value: 'b39ddb', swatch: '#b39ddb' },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  hairIdx: 1, rearHairIdx: 0, outfitIdx: 0,
  eyesIdx: 0, mouthIdx: 3,
  hairColorIdx: 0, skinColorIdx: 0, clothesColorIdx: 0,
};

// ─── Transit / Airlines ───────────────────────────────────────────────────────
export const TRANSIT_HUB_OPTIONS = [
  '阿拉伯聯合大公國', '土耳其', '卡達', '香港',
  '荷蘭', '英國', '法國', '德國', '其他',
];

export const AIRLINE_OPTIONS = [
  '阿提哈德航空 (Etihad)',
  '阿聯酋航空 (Emirates)',
  '土耳其航空 (Turkish Airlines)',
  '卡達航空 (Qatar Airways)',
  '國泰航空 (Cathay Pacific)',
  '中華航空 (China Airlines)',
  '長榮航空 (EVA Air)',
  '愛爾蘭航空 (Aer Lingus)',
  '瑞安航空 (Ryanair)',
  '荷蘭皇家航空 (KLM)',
  '法國航空 (Air France)',
  '漢莎航空 (Lufthansa)',
  '英國航空 (British Airways)',
  '其他',
];

// Transit timezone lookup
export interface TransitTz { name: string; offset: number }
export function resolveTransitTz(hubs: string[], lines: string[]): TransitTz {
  const s = [...hubs, ...lines].join(' ');
  if (/阿拉伯|阿聯酋|Emirates|阿提哈德|Etihad/.test(s))  return { name: 'Dubai',     offset: 4 };
  if (/土耳其|Turkish/.test(s))                           return { name: 'Istanbul',  offset: 3 };
  if (/卡達|Qatar/.test(s))                               return { name: 'Doha',      offset: 3 };
  if (/香港|國泰|Cathay/.test(s))                         return { name: 'Hong Kong', offset: 8 };
  if (/荷蘭|KLM/.test(s))                                 return { name: 'Amsterdam', offset: 2 };
  if (/英國|British/.test(s))                             return { name: 'London',    offset: 1 };
  if (/法國|Air France/.test(s))                          return { name: 'Paris',     offset: 2 };
  if (/德國|Lufthansa/.test(s))                           return { name: 'Frankfurt', offset: 2 };
  return { name: '中轉機場', offset: 0 };
}

// ─── 主線任務 (Main Quests) ───────────────────────────────────────────────────
export const MAIN_TASKS: Task[] = [
  // LV.0 台灣整備 ──────────────────────
  { id: 'tw_passport',  icon: '🛂', label: '準備護照 & 簽證文件',          level: 'LV0_TW', xp: 100, optional: false },
  { id: 'tw_vaccine',   icon: '💉', label: '接種旅行疫苗（確認有效期）',   level: 'LV0_TW', xp:  50, optional: true  },
  { id: 'tw_remit',     icon: '🏦', label: '辦理 Wise / Revolut 海外匯款', level: 'LV0_TW', xp:  80, optional: false },
  { id: 'tw_esim',      icon: '📱', label: '購買愛爾蘭 eSIM 或 SIM 卡',   level: 'LV0_TW', xp:  60, optional: false },
  { id: 'tw_meds',      icon: '💊', label: '備好常備藥品三個月份',         level: 'LV0_TW', xp:  40, optional: true  },
  { id: 'tw_luggage',   icon: '📦', label: '行李清單確認（23 kg 限制）',   level: 'LV0_TW', xp:  60, optional: false },
  { id: 'tw_checkin',   icon: '✈️', label: '班機 Check-in & 行動登機證',   level: 'LV0_TW', xp:  80, optional: false },
  { id: 'tw_accomm',    icon: '🏠', label: '聯繫愛爾蘭到達前短期住宿',    level: 'LV0_TW', xp:  70, optional: false },

  // LV.1 愛爾蘭落地 ────────────────────
  { id: 'ie_irp',       icon: '🏛️', label: 'IRP 外國人居留許可登記',      level: 'LV1_IE', xp: 200, optional: false },
  { id: 'ie_ppsn',      icon: '🔢', label: '申辦 PPSN 公共服務號碼',      level: 'LV1_IE', xp: 200, optional: false },
  { id: 'ie_bank',      icon: '💳', label: '開立 AIB 本地銀行帳戶',        level: 'LV1_IE', xp: 180, optional: false },
  { id: 'ie_leap',      icon: '🚌', label: '辦理 Leap Card 公共交通卡',    level: 'LV1_IE', xp:  80, optional: false },
  { id: 'ie_sim',       icon: '📞', label: '辦理本地 SIM（Three / Vodafone）', level: 'LV1_IE', xp:  80, optional: false },
  { id: 'ie_house',     icon: '🏠', label: '找到長期住所（Daft.ie）',      level: 'LV1_IE', xp: 250, optional: false },

  // LV.2 工作生活 ──────────────────────
  { id: 'ie_job',       icon: '💼', label: '完成第一份工作申請',           level: 'LV2_IE', xp: 300, optional: false },
  { id: 'ie_supermarket',icon: '🛒',label: '搞懂 Dunnes / Tesco / Lidl 價格', level: 'LV2_IE', xp: 60, optional: false },
  { id: 'ie_explore',   icon: '🌿', label: '探索都柏林一個新地區',         level: 'LV2_IE', xp: 100, optional: true  },
  { id: 'ie_course',    icon: '📚', label: '報名英語或職業課程',           level: 'LV2_IE', xp: 150, optional: true  },
];

// ─── 日常任務 (Daily Tasks) ───────────────────────────────────────────────────
export const DAILY_TASKS: DailyTask[] = [
  { id: 'daily_checkin',  icon: '☀️', label: '今日目標打卡',         xp: 20  },
  { id: 'daily_cook',     icon: '🍳', label: '自煮一餐（省錢技能）', xp: 30  },
  { id: 'daily_walk',     icon: '🚶', label: '步行超過 8,000 步',    xp: 25  },
  { id: 'daily_english',  icon: '📝', label: '學習 5 個新英語單詞',  xp: 30  },
  { id: 'daily_cafe',     icon: '☕', label: '發現一家好咖啡館',     xp: 15  },
  { id: 'daily_rain',     icon: '☔', label: '帶傘出門（都柏林必備）',xp: 10  },
];

// ─── 商店.md – Dunnes Store 清單 ──────────────────────────────────────────────
export const SHOP_ITEMS: ShopItem[] = [
  // Essential
  { id: 's_bread',    icon: '🍞', name: "Brennan's White Bread",   nameZh: '白吐司',       price: 1.29, category: 'essential', tip: '愛爾蘭必備主食' },
  { id: 's_eggs',     icon: '🥚', name: 'Free Range Eggs (6pk)',    nameZh: '放養雞蛋',     price: 2.49, category: 'essential' },
  { id: 's_milk',     icon: '🥛', name: 'Avonmore Milk 2L',         nameZh: '鮮奶 2L',      price: 1.89, category: 'essential' },
  { id: 's_oats',     icon: '🌾', name: "Flahavan's Oats 1kg",      nameZh: '燕麥片',       price: 2.49, category: 'essential', tip: '愛爾蘭國民早餐' },
  { id: 's_butter',   icon: '🧈', name: 'Kerrygold Butter 200g',    nameZh: '金牌奶油',     price: 2.79, category: 'essential', tip: '愛爾蘭驕傲' },
  // Fresh
  { id: 's_potato',   icon: '🥔', name: 'Washed Potatoes 2kg',      nameZh: '馬鈴薯',       price: 2.99, category: 'fresh' },
  { id: 's_chicken',  icon: '🍗', name: 'Chicken Fillets 500g',      nameZh: '雞胸肉',       price: 5.99, category: 'fresh' },
  { id: 's_tomato',   icon: '🍅', name: 'Tomatoes 6pk',              nameZh: '番茄',         price: 1.99, category: 'fresh' },
  { id: 's_garlic',   icon: '🧄', name: 'Garlic Bulb',               nameZh: '蒜頭',         price: 0.79, category: 'fresh' },
  { id: 's_onion',    icon: '🧅', name: 'Brown Onions 1kg',          nameZh: '洋蔥',         price: 1.29, category: 'fresh' },
  { id: 's_banana',   icon: '🍌', name: 'Bananas (bunch)',           nameZh: '香蕉',         price: 1.09, category: 'fresh' },
  // Snack
  { id: 's_tayto',    icon: '🥔', name: 'Tayto Cheese & Onion',      nameZh: '泰托洋芋片',   price: 1.49, category: 'snack', tip: '愛爾蘭人的國寶零食' },
  { id: 's_chocolate',icon: '🍫', name: 'Cadbury Dairy Milk 200g',   nameZh: '吉百利巧克力', price: 2.49, category: 'snack' },
  { id: 's_tea',      icon: '🫖', name: "Barry's Tea 80 bags",       nameZh: '愛爾蘭紅茶',   price: 3.29, category: 'snack', tip: '不懂 Barry's Tea 就不懂愛爾蘭' },
  // Household
  { id: 's_soy',      icon: '🧴', name: 'Soy Sauce',                 nameZh: '醬油',         price: 1.99, category: 'household' },
  { id: 's_rice',     icon: '🍚', name: 'Long Grain Rice 1kg',       nameZh: '長粒米',       price: 1.69, category: 'household' },
  { id: 's_noodle',   icon: '🍜', name: 'Egg Noodles 375g',          nameZh: '雞蛋麵',       price: 1.99, category: 'household' },
  { id: 's_umbrella', icon: '☂️', name: 'Compact Umbrella',          nameZh: '折疊傘（必備）', price: 6.99, category: 'household', tip: '愛爾蘭天氣隨時變，一定要買' },
];

// ─── 背包.md – Bag Items ──────────────────────────────────────────────────────
export const BAG_ITEMS: BagItem[] = [
  { id: 'bag_passport', icon: '🛂', label: '護照',       sublabel: 'Taiwan Passport',     slot: 'document', obtained: true  },
  { id: 'bag_visa',     icon: '📄', label: '工作假期簽證', sublabel: 'WHV Stamp',          slot: 'document', obtained: false },
  { id: 'bag_irp',      icon: '🪪', label: 'IRP 卡',      sublabel: 'Residence Permit',    slot: 'card',     obtained: false },
  { id: 'bag_ppsn',     icon: '📋', label: 'PPSN 信件',   sublabel: 'PPS Number Letter',   slot: 'document', obtained: false },
  { id: 'bag_aib',      icon: '💳', label: 'AIB 銀行卡',  sublabel: 'AIB Debit Card',      slot: 'card',     obtained: false },
  { id: 'bag_leap',     icon: '🚌', label: 'Leap Card',   sublabel: 'Transport Card',      slot: 'card',     obtained: false },
  { id: 'bag_sim',      icon: '📱', label: '愛爾蘭 SIM', sublabel: 'Three / Vodafone',     slot: 'card',     obtained: false },
  { id: 'bag_key',      icon: '🔑', label: '公寓鑰匙',    sublabel: 'Apartment Key',       slot: 'gear',     obtained: false },
  { id: 'bag_umbrella', icon: '☂️', label: '雨傘',        sublabel: '都柏林必備 ☔',        slot: 'gear',     obtained: false },
  { id: 'bag_bag',      icon: '🎒', label: '每日通勤包',  sublabel: 'Daily Commute Bag',   slot: 'gear',     obtained: true  },
  { id: 'bag_plug',     icon: '🔌', label: '轉接插頭',    sublabel: 'Type G Adapter (IE)', slot: 'misc',     obtained: false },
  { id: 'bag_healthcard',icon:'💊', label: '歐洲健康卡',  sublabel: 'EHIC (if applicable)',slot: 'document', obtained: false },
];

// ─── 隨機事件.md ──────────────────────────────────────────────────────────────
export const RANDOM_EVENTS: RandomEvent[] = [
  { id: 're_rain',    icon: '☔', title: '突然暴雨！',         desc: '都柏林的天氣說變就變，你有帶傘嗎？',                   effect: '未帶傘 → 全身濕透，心情 -10',       xp: 0  },
  { id: 're_seagull', icon: '🐦', title: '海鷗搶走薯條！',    desc: '在 Temple Bar 附近吃薯條被海鷗偷走，愛爾蘭式洗禮。',   effect: '損失 1 份薯條，獲得都柏林傳說',     xp: 30 },
  { id: 're_pub',     icon: '🍺', title: 'Pub 初體驗！',      desc: '愛爾蘭同事邀你一起去 Pub，你去嗎？',                   effect: '接受邀請 → 解鎖 Pub 初體驗勳章',   xp: 50 },
  { id: 're_flat',    icon: '🏠', title: '租屋噩夢',          desc: '都柏林房租暴貴，一間臥室每月 €1,800，你找到隊友了嗎？', effect: '多人合租 → 每人省下 €600/月',       xp: 0  },
  { id: 're_interview',icon:'💼', title: '面試通知！',        desc: '你投出的 CV 有回應了！面試在明天早上 9:00，準備好了嗎？',effect: '成功通關 → 解鎖第一份工作勳章',    xp: 100},
  { id: 're_rainbow', icon: '🌈', title: '都柏林彩虹出現！',  desc: '雨後突然出現完整彩虹，這是愛爾蘭在歡迎你。',           effect: '拍照紀念 → 心情 +50',              xp: 20 },
  { id: 're_busker',  icon: '🎸', title: '街頭藝人驚豔',     desc: 'Grafton Street 的街頭藝人演奏了你最愛的歌。',           effect: '投下 €1 → 獲得好運加持',          xp: 15 },
  { id: 're_dart',    icon: '🚊', title: 'DART 誤點',         desc: 'DART 又誤點了…愛爾蘭交通的日常。',                   effect: '等待 20 分鐘，獲得耐心 +5',         xp: 5  },
  { id: 're_tayto',   icon: '🥔', title: '發現 Tayto！',      desc: '你在便利店找到了 Tayto Cheese & Onion，愛爾蘭國寶零食，',effect: '試吃後愛上 → 解鎖 Tayto 成就',   xp: 10 },
  { id: 're_bank',    icon: '💳', title: 'AIB 開戶等待',      desc: 'AIB 開戶需要 PPSN + 地址證明，準備好你的文件了嗎？',   effect: '文件齊全 → 加速審核',              xp: 0  },
];

// ─── Collections / Badges ────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  { id: 'transit_maniac', emoji: '🔀', title: '轉機狂人',   titleEn: 'Transit Maniac',   desc: '選擇了複雜的多段中轉航線',              color: '#9B59B6', unlockKey: 'hasComplexRouting' },
  { id: 'ireland_landed', emoji: '☘️', title: '愛爾蘭登陸', titleEn: 'Ireland Landed',   desc: '成功抵達翡翠島！',                      color: '#00A651', unlockKey: 'hasArrived'        },
  { id: 'passport_done',  emoji: '🛂', title: '護照完成',   titleEn: 'Passport Ready',   desc: '完整填寫了冒險者護照資料',              color: '#E67E22', unlockKey: 'hasFullProfile'    },
  { id: 'flight_ready',   emoji: '✈️', title: '飛行準備',   titleEn: 'Flight Ready',     desc: '填妥航班編號與起飛時間',                color: '#2980B9', unlockKey: 'hasFlightInfo'     },
  { id: 'time_traveler',  emoji: '🕐', title: '時空旅人',   titleEn: 'Time Traveler',    desc: '擁有中轉時區同步能力',                  color: '#16A085', unlockKey: 'hasTransitTz'      },
  { id: 'irp_done',       emoji: '🏛️', title: 'IRP 完成',   titleEn: 'IRP Registered',  desc: '完成外國人居留許可登記',                color: '#27AE60', unlockKey: 'irpDone'           },
  { id: 'ppsn_done',      emoji: '🔢', title: 'PPSN 取得',  titleEn: 'PPSN Obtained',    desc: '拿到愛爾蘭公共服務號碼',                color: '#2ECC71', unlockKey: 'ppsnDone'          },
  { id: 'bank_open',      emoji: '💳', title: '開戶成功',   titleEn: 'Bank Opened',      desc: '成功開立本地銀行帳戶',                  color: '#3498DB', unlockKey: 'bankDone'          },
  { id: 'pub_first',      emoji: '🍺', title: 'Pub 初體驗', titleEn: 'First Pint',       desc: '進入愛爾蘭 Pub 喝下第一杯',            color: '#C0392B', unlockKey: 'pubVisited'        },
  { id: 'rain_survivor',  emoji: '☔', title: '雨中求生',   titleEn: 'Rain Survivor',    desc: '在都柏林雨天仍然出門並帶了傘',          color: '#2C3E50', unlockKey: 'rainSurvived'      },
  { id: 'house_found',    emoji: '🏠', title: '找到家',     titleEn: 'Home Found',       desc: '找到都柏林長期住所',                    color: '#8E44AD', unlockKey: 'houseDone'         },
  { id: 'first_job',      emoji: '💼', title: '第一份工作', titleEn: 'First Job',        desc: '在愛爾蘭拿到第一份工作',                color: '#F39C12', unlockKey: 'jobDone'           },
];

// ─── AIB Bank Steps ───────────────────────────────────────────────────────────
export const AIB_STEPS: BankStep[] = [
  { id: 'aib_ppsn',    icon: '🔢', label: '先取得 PPSN',               note: '沒有 PPSN 無法開戶，務必先辦理' },
  { id: 'aib_address', icon: '🏠', label: '準備愛爾蘭地址證明',         note: '房東信件或 Utility Bill（電費/水費帳單）' },
  { id: 'aib_online',  icon: '💻', label: '線上預約 AIB 開戶',         note: '前往 aib.ie 點選 Current Account，選擇分行' },
  { id: 'aib_visit',   icon: '🏦', label: '攜帶護照 + PPSN + 地址親臨', note: '帶齊文件，約 30 分鐘可完成手續' },
  { id: 'aib_wait',    icon: '📬', label: '等待銀行卡郵寄',             note: '通常 3-5 個工作天，寄到你的愛爾蘭地址' },
  { id: 'aib_pin',     icon: '🔐', label: '電話或線上設定 PIN 碼',      note: '第一次使用前需至少進行一筆交易' },
];

// ─── Guild Posts (Community Board) ────────────────────────────────────────────
export const GUILD_POSTS: GuildPost[] = [
  {
    id: 'g1', avatar: '😎', author: 'Chen Wei', time: '2 小時前',
    content: '終於拿到 PPSN 了！等了三週，建議大家一到都柏林就馬上去 Intreo Centre 預約，不要拖！',
    tags: ['PPSN', '辦理心得'], likes: 24,
  },
  {
    id: 'g2', avatar: '🌸', author: 'Lin Mei', time: '昨天',
    content: 'Daft.ie 找房心得：預算 €1,000 以下在都柏林市中心幾乎不可能，建議往 D9/D11 方向找合租，我最後找到一個 4 人合租每人 €750，還算ok。',
    tags: ['租屋', '都柏林'], likes: 38,
  },
  {
    id: 'g3', avatar: '🎸', author: 'Tsai Min', time: '2 天前',
    content: '強烈推薦 Grafton Street 週末的 Street Performance！完全免費，表演水準超高，而且可以練習英文聽力哈哈',
    tags: ['都柏林生活', '閒遊'], likes: 15,
  },
  {
    id: 'g4', avatar: '🍜', author: 'Wang Jia', time: '3 天前',
    content: 'Asian Market（南大街 Asia Market）有台灣泡麵！但一包要 €2.5，忍痛了…偶爾解思鄉情還是值的',
    tags: ['台灣食物', '亞洲超市'], likes: 51,
  },
  {
    id: 'g5', avatar: '☔', author: 'Huang Ting', time: '1 週前',
    content: '都柏林天氣預報完全不準，建議永遠帶傘。今天出門明明預報晴天，結果被淋成落湯雞😭',
    tags: ['天氣', '生活小知識'], likes: 67,
  },
];

// ─── Utility Helpers ─────────────────────────────────────────────────────────
export function buildAvatarUrl(cfg: AvatarConfig): string {
  const hair         = HAIR_OPTIONS[cfg.hairIdx]?.value              ?? '';
  const rearHair     = REAR_HAIR_OPTIONS[cfg.rearHairIdx ?? 0]?.value ?? '';
  const outfit       = OUTFIT_OPTIONS[cfg.outfitIdx]?.value          ?? 'tShirt';
  const eyes         = EYES_OPTIONS[cfg.eyesIdx]?.value              ?? 'happy';
  const eyebrows     = EYEBROWS_OPTIONS[cfg.eyebrowsIdx ?? 0]?.value ?? 'up';
  const mouth        = MOUTH_OPTIONS[cfg.mouthIdx]?.value            ?? 'smile';
  const beard        = BEARD_OPTIONS[cfg.beardIdx ?? 0]?.value       ?? '';
  const hairColor    = HAIR_COLOR_OPTIONS[cfg.hairColorIdx ?? 0]?.value     ?? '2c1b18';
  const skinColor    = SKIN_COLOR_OPTIONS[cfg.skinColorIdx ?? 0]?.value     ?? 'f8d5c2';
  const clothesColor = CLOTHES_COLOR_OPTIONS[cfg.clothesColorIdx ?? 0]?.value ?? '264653';

  const p = new URLSearchParams({
    seed:                'WHinIE-fixed',
    backgroundColor:     'b6e3f4',
    hairColor,
    skinColor,
    clothesColor,
    clothes:             outfit,
    eyes,
    mouth,
    hairProbability:     hair     ? '100' : '0',
    rearHairProbability: rearHair ? '100' : '0',
  });

  if (hair)     p.set('hair',     hair);
  if (rearHair) p.set('rearHair', rearHair);

  return `https://api.dicebear.com/9.x/toon-head/svg?${p.toString()}`;
}

export function clockAt(offsetHours: number): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const t   = new Date(utc + offsetHours * 3600000);
  return t.toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function getDayStatus(arrivalDate: string): {
  type: 'none' | 'countdown' | 'arrived';
  days: number;
} {
  if (!arrivalDate) return { type: 'none', days: 0 };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const arr   = new Date(arrivalDate); arr.setHours(0, 0, 0, 0);
  const diff  = Math.floor((arr.getTime() - today.getTime()) / 86400000);
  if (diff > 0) return { type: 'countdown', days: diff };
  return { type: 'arrived', days: Math.abs(diff) };
}
