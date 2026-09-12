/**
 * WHinIE – Knowledge Base Constants
 * Source: 主線任務.md / 日常任務.md / 商店.md / 背包.md / 隨機事件.md / Ireland.pdf
 * All data reflects real Irish WHV logistics & Dublin daily life.
 */

import type {
  Task, DailyTask, BagItem,
  RandomEvent, Badge, BankStep, GuildPost,
  AvatarConfig, ScreenId,
} from '../types';

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Itim&family=Noto+Sans+TC:wght@300;400;500;700;900&family=Dynalight&display=swap";

// EN/number: Itim first, Cre Happiness fallback alias via CSS var, then generic
// ZH: Noto Sans TC only — explicitly NO 新細明體 / PMingLiU
export const ZH = {
  fontFamily: "'Noto Sans TC', 'Microsoft JhengHei UI', 'Microsoft JhengHei', 'PingFang TC', 'Heiti TC', sans-serif",
} as const;
export const EN = {
  fontFamily: "'Itim', 'Cre Happiness', cursive",
} as const;

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export const TABS: { id: ScreenId; label: string; emoji: string }[] = [
  { id: 'HOME',        label: 'HOME',          emoji: '🏠' },
  { id: 'AIB',         label: 'AIB Bank',      emoji: '🏦' },
  { id: 'TASK',        label: 'Task',          emoji: '📋' },
  { id: 'GUILD',       label: 'GUILD',         emoji: '⚔️' },
  { id: 'DUNNES',      label: 'Thrift Shop',   emoji: '♻️' },
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
  {
    id: 'tw_passport', icon: '🛂', label: '簽證領取', level: 'LV0_TW', xp: 100, optional: false,
    objective: '完成愛爾蘭打工度假簽證申請，並成功在台灣領取簽證貼紙或核准信。',
    guide: [
      '【申請資格】年齡 18–35 歲的中華民國國民，護照效期須超過 1 年。',
      '【申請管道】透過愛爾蘭移民局官網（Irish Immigration）線上提交申請，或至愛爾蘭駐台辦事處遞件。',
      '【所需文件】有效護照、護照照片、財力證明（建議 3,000 EUR 以上等值存款）、無犯罪紀錄證明（須至警察局申辦英文版）、旅遊醫療保險（須保一年以上）。',
      '【申請費用】簽證申請費用約 TWD 3,000－4,000（依當年匯率浮動）。',
      '【審核時間】一般約 4－8 週，建議提前 3 個月申請，旺季更需提早。',
      '【核准後】收到核准信（Approval Letter）後，需在 12 個月內入境愛爾蘭，入境後再辦理 IRP 居留許可。',
      '【小提醒】簽證核准後不代表直接取得居留許可，入境後仍需至 GNIB/INIS 登記 IRP。',
    ],
    reward: '解鎖【愛爾蘭旅人】稱號 · 開啟 LV0 台灣整備任務鏈',
  },
  { id: 'tw_vaccine',   icon: '💉', label: '接種旅行疫苗',           level: 'LV0_TW', xp:  50, optional: true,
    objective: '確認並完成出國前的必要疫苗接種。' },
  { id: 'tw_remit',     icon: '🏦', label: '辦理海外金融帳戶',       level: 'LV0_TW', xp:  80, optional: false,
    objective: '申辦 Wise 或 Revolut 帳戶，以低手續費方式在愛爾蘭使用與匯款。' },
  { id: 'tw_esim',      icon: '📱', label: '購買愛爾蘭 eSIM',        level: 'LV0_TW', xp:  60, optional: false,
    objective: '出發前購買愛爾蘭落地即用的 eSIM 或預付 SIM 卡，確保抵達後立即有網路。' },
  { id: 'tw_meds',      icon: '💊', label: '備好常備藥品',           level: 'LV0_TW', xp:  40, optional: true,
    objective: '向家醫科或診所取得處方，備妥至少 3 個月常備藥品（感冒、腸胃、止痛）。' },
  { id: 'tw_luggage',   icon: '📦', label: '行李清單確認',           level: 'LV0_TW', xp:  60, optional: false,
    objective: '完成打包清單確認，托運行李不超過 23 kg，隨身行李符合航空公司規定。' },
  { id: 'tw_checkin',   icon: '✈️', label: '班機 Check-in',          level: 'LV0_TW', xp:  80, optional: false,
    objective: '完成航班 Check-in 並取得行動登機證，確認中轉航班資訊。' },
  { id: 'tw_accomm',    icon: '🏠', label: '短期住宿預訂',           level: 'LV0_TW', xp:  70, optional: false,
    objective: '預訂抵達愛爾蘭前幾晚的短期住宿（青旅 / Airbnb），作為找長期租屋的落腳點。' },

  // LV.1 愛爾蘭落地 ────────────────────
  { id: 'ie_irp',    icon: '🏛️', label: 'IRP 居留許可登記',        level: 'LV1_IE', xp: 200, optional: false,
    objective: '抵達愛爾蘭後 90 天內完成 IRP（Irish Residence Permit）外國人居留許可登記。' },
  { id: 'ie_ppsn',   icon: '🔢', label: '申辦 PPSN 號碼',          level: 'LV1_IE', xp: 200, optional: false,
    objective: '向愛爾蘭社會保障部（Intreo）申辦 PPSN 公共服務號碼，是工作、開戶、就醫的必要憑證。' },
  { id: 'ie_bank',   icon: '💳', label: '開立 AIB 銀行帳戶',       level: 'LV1_IE', xp: 180, optional: false,
    objective: '持 IRP 卡與 PPSN 前往 AIB 銀行開立本地帳戶，以收取薪資與繳租。' },
  { id: 'ie_leap',   icon: '🚌', label: '辦理 Leap Card',           level: 'LV1_IE', xp:  80, optional: false,
    objective: '購買並儲值 Leap Card 公共交通卡，搭乘都柏林巴士、DART、Luas 皆可使用。' },
  { id: 'ie_sim',    icon: '📞', label: '辦理本地 SIM 卡',          level: 'LV1_IE', xp:  80, optional: false,
    objective: '至 Three 或 Vodafone 門市辦理愛爾蘭本地 SIM，取得當地電話號碼（開戶/面試常需要）。' },
  { id: 'ie_house',  icon: '🏠', label: '找到長期住所',             level: 'LV1_IE', xp: 250, optional: false,
    objective: '透過 Daft.ie 或 Facebook 租屋社團找到長期租屋，簽訂租約。' },

  // LV.2 工作生活 ──────────────────────
  { id: 'ie_job',          icon: '💼', label: '完成第一份工作申請',  level: 'LV2_IE', xp: 300, optional: false,
    objective: '投遞 CV 並成功獲得第一份工作 Offer，完成報到。' },
  { id: 'ie_supermarket',  icon: '🛒', label: '攻略當地超市',        level: 'LV2_IE', xp:  60, optional: false,
    objective: '熟悉 Dunnes Stores、Tesco、Lidl、Aldi 各超市的價格與特色，制定省錢採購策略。' },
  { id: 'ie_explore',      icon: '🌿', label: '探索都柏林新地區',    level: 'LV2_IE', xp: 100, optional: true,
    objective: '走訪都柏林一個你從未去過的地區，紀錄你的發現。' },
  { id: 'ie_course',       icon: '📚', label: '報名語言或職業課程',  level: 'LV2_IE', xp: 150, optional: true,
    objective: '報名英語課、職業培訓或線上課程，提升技能或語言能力。' },
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
  const mouth        = MOUTH_OPTIONS[cfg.mouthIdx]?.value            ?? 'smile';
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
    eyebrows:            'neutral',
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
