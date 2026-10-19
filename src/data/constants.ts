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
    objective: '領取愛爾蘭打工度假簽證授權書（WHA）。',
    guide: [
      '📬 收到核准通知後\n確認 Email 標題中的「批次號碼」與「序號」，前往領取時須主動告知。',

      '🏢 方式 A｜親自領取\n• 單位：梵音文化事業有限公司\n• 地址：台北市開封街一段 105 號 4 樓之 3\n• 電話：02-23710209 蔡小姐\n• 時間：每週三、五 10:00–15:00\n⚠ 其他時間請先電話預約，勿直接前往。',

      '📁 方式 A｜須攜帶文件\n① 護照正本（驗畢退還）\n② 護照影本（照片號碼頁，空白處寫上批號與序號）\n   ▸ 換發新護照者，新舊兩本須一併出示\n③ 電子機票影本（單程或來回均可）\n④ 醫療保險英文投保證明（不須附保單）',

      '🤝 方式 B｜請人代領\n需攜帶文件如方式 A\n\n另需：\n• 手寫授權書：「授權 ○○（姓名及身分證字號）代領」\n• 代領人身分證\n• 申請者護照正本\n\n⚠ 申請人在國外時，可以護照照片頁影本代替正本。',

      '📮 方式 C｜郵件領取\n寄件地址：台北北門郵局 11861 號信箱　梵音文化事業公司 蔡小姐收\n隨附文件：護照影本、電子機票影本、英文投保證明\n回郵信封：A4 牛皮信封，寫收件人姓名與電話\n   信封正面註明「批次貼上證件掛號」，貼 43 元郵資\n⚠ 簽證為 A4 尺寸且已護貝，請務必附 A4 信封。',

      '🛡 保險文件規格\n• 期限：自入境愛爾蘭起算 12 個月（停留長短不影響，均須一年期保單）\n• 保額：三百萬以上\n• Covering Nation：Ireland\n• 旅平險 / 海外醫療險 / 打工度假險 均符合資格\n\n停留三個月以上者，入境後須備保險英文證明正本＋授權書，用於辦理 IRP 居留許可。',
    ],
    reward: '解鎖【愛爾蘭旅人】稱號 ',
  },
  { id: 'tw_remit',     icon: '🏦', label: '辦理海外金融帳戶',       level: 'LV0_TW', xp:  80, optional: false,
    objective: '建議先申辦 Wise帳戶，到愛爾蘭後再視需求申請Revolut或實體銀行帳戶。' },
  { id: 'tw_esim',      icon: '📱', label: '購買愛爾蘭電話卡',        level: 'LV0_TW', xp:  60, optional: false,
    objective: '出發前購買 eSIM 或預付 SIM 卡，確保抵達後立即有網路，並取得當地電話號碼（開戶、面試常需要）。 \n\n📶 愛爾蘭三大電信比較\n以下均提供預付卡方案（Prepay Plans），4 週加值一次，無需綁約，適合打工度假族群。\n⚠資料參考時間：2026年9月',
    guide: [
      
      '📡 Three（3）\n• 方案：All You Can Eat — €20 / 4 週，吃到飽\n• 歐洲漫遊：30 GB\n• 特色：愛爾蘭最多人使用，幾乎是打工度假 / 遊學首選\n• 網址：https://www.three.ie/esim.html',

      '📡 Vodafone\n• 方案：All You Can Eat — €20 / 4 週，吃到飽\n• 歐洲漫遊：45 GB\n• 特色：歐洲漫遊量最大，常往返歐洲各國者特別適合\n• 網址：https://www.vodafone.ie/sim-only/pay-as-you-go',

      '📡 eir\n• 方案：Unlimited — €20 / 4 週，吃到飽\n• 歐洲漫遊：45 GB\n• 特色：歐洲漫遊量與 Vodafone相當\n• 網址：https://eir.ie/shop/mobile/prepay',

      '💡 選購建議\n• 三家月費相同，主要差在歐洲漫遊量\n• 常去歐洲旅行 → Vodafone 或 eir 更划算\n• 可出發前於台灣購買預付 eSIM，落地即用，無需排隊辦門市',
    ] },
   { id: 'tw_meds',      icon: '💊', label: '備好常備藥品',           level: 'LV0_TW', xp:  40, optional: true,
    objective: '向家醫科或診所取得處方，備妥足夠的常備藥品（感冒、腸胃、止痛等）。' },
  { id: 'tw_luggage',   icon: '📦', label: '行李清單確認',           level: 'LV0_TW', xp:  60, optional: false,
    objective: '完成打包清單確認，托運及隨身行李符合航空公司規定。' },
  { id: 'tw_checkin',   icon: '✈️', label: '班機 Check-in',          level: 'LV0_TW', xp:  80, optional: false,
    objective: '完成航班 Check-in 並取得電子登機證，確認中轉航班資訊。' },
  { id: 'tw_accomm',    icon: '🏠', label: '短期住宿預訂',           level: 'LV0_TW', xp:  70, optional: false,
    objective: '預訂抵達愛爾蘭的短期住宿（青旅 / Airbnb），作為找長期租屋的落腳點。' },

  // LV.1 愛爾蘭落地 ────────────────────
  { id: 'ie_irp',    icon: '🏛️', label: 'IRP 居留許可登記',        level: 'LV1_IE', xp: 200, optional: false,
    objective: '實體 IRP 卡是在愛爾蘭工作、租屋的重要身分證明。\n⚠️ 抵達後盡早預約，辦理期限依入境章及官方指示。\n\n申請流程：① 建立帳號＋身分驗證 → ② 線上預約首次登記 → ③ 備齊紙本文件與規費 → ④ Burgh Quay 現場辦理 → ⑤ 等待實體 IRP 卡寄到家',
    guide: [
      '🖥️ STEP 01｜建立帳號，完成身分驗證\n準備：護照正本、Email、可收訊息且能上網的手機\n\n官方入口：portal.irishimmigration.ie/en\n\n① 註冊帳號＋設定驗證器\n填寫資料、驗證 Email，依畫面設定 Authenticator。\n② 開啟官方提供的 ID-Pal 連結\n依系統通知下載 App，拍攝護照正本並完成人臉掃描。\n③ 確認資料並提交\n姓名須與護照一致，完成驗證後才可進入預約流程。',
      '📅 STEP 02｜線上預約首次登記\n預約本身免費｜抵達愛爾蘭後盡早操作\n\n登入帳號 → 選擇「First Time Registration Appointment」\n依序填寫居住郡、首次登記與居留類別。\n打工度假簽證選 Stamp 1。\n\n在行事曆選擇地點、日期與時間。\n✅ 完成後保存 Confirmation Email，建議列印備用。\n\n📖 線上申請教學：greatstudyabroad.com（搜尋「愛爾蘭IRP線上申請教學2025」）',
      '📄 STEP 03｜備齊紙本文件與規費\nStamp 1 所需文件（依官方清單為準）：\n• 有效護照正本\n• 預約確認信（Confirmation Email 列印版）\n• 愛爾蘭地址證明\n• 財力證明（銀行存款證明，建議 €3,000 以上）\n• 打工度假簽證授權書（WHA）\n• 規費：€300（持實體信用卡或金融卡繳付）\n\n完整清單請參考官方頁面：\nirishimmigration.ie → Required Documents → Stamp 1\n\n⚠️ 文件依自身狀況準備，勿漏掉財力證明。',
      '🏛️ STEP 04｜前往 Burgh Quay 現場辦理\nRegistration Office\n13–14 Burgh Quay, Dublin 2, D02 XK70\n預留 30–60 分鐘辦理，另加交通與候位時間，建議提早抵達。\n\n① 報到領號碼：在報到機取得號碼，等候叫號\n② 審查紙本文件：移民官核對身分與簽證資格\n③ 拍照＋採集指紋：現場拍攝 IRP 照片，完成指紋掃描\n④ 繳費＋確認許可：刷卡繳費（€300），完成居留登記\n\n⚠️ 離開前：拿回護照，確認居留資料與寄卡地址正確。',
      '📬 STEP 05｜在家等 IRP 卡寄到\n實體卡郵寄到登記時填寫的愛爾蘭住址，不會現場領卡。\n約 15 個工作天（不含週末及國定假日）。\n\n讓卡片順利找到你：\n① 確認住址、房號與 Eircode（郵遞區號）填寫正確\n② 收到後核對姓名、效期及 Stamp 類別\n③ 保留登記資料，方便日後查詢\n\n⚠️ 超過 15 個工作天未收到？\n登入 Customer Service Portal，使用「Submit Query」查詢。',
    ],
    reward: '解鎖【IRP 完成】稱號\n+200 EXP',
    disclaimer: '資訊核對 2026.10.19　僅供參考' },
  { id: 'ie_ppsn',   icon: '🔢', label: '申辦 PPSN 號碼',          level: 'LV1_IE', xp: 200, optional: false,
    objective: 'PPSN 是愛爾蘭個人公共服務號碼，找工作、開戶、申請退稅都需要用到。\n必須人在愛爾蘭境內才能申請，無法在台灣預辦。\n⚠️ 沒有 PPSN 就開始工作，薪資會被扣取緊急稅（Emergency Tax），稅率約 40%。\n\n申請流程：① 註冊 MyGovID → ② MyWelfare 填申請＋預約 → ③ 備齊文件 → ④ 現場查驗 → ⑤ 等候郵寄通知',
    guide: [
      '💻 STEP 01–02｜建立帳號，線上申請與預約\n官方入口：MyGovID.ie + MyWelfare.ie\n\n① 註冊 Basic MyGovID\n前往 MyGovID.ie，填寫資料、設定密碼並驗證 Email。\n基本版帳號即可申請 PPSN，不必先持有 PSC。\n\n② 登入 MyWelfare，申請 PPS Number\n填寫個人資料及需要 PPSN 的實際理由。\n查看系統列出的應備文件清單。\n在線上流程中選擇現場預約的地點、日期與時間。\n\n✅ 預約後查看 MyWelfare 通知，保存預約資訊與文件清單，也留意垃圾郵件匣。',
      '📋 STEP 02.5｜申請理由要有文件支持\n依你實際需要使用的服務，準備對應證明：\n\n• 開始工作：雇主信、工作合約或 Offer Letter（重點是已開始工作，不是單純找工作）\n• 學校／課程註冊：學校註冊信等證明，可請學校說明為何需要 PPSN\n• 駕照或其他公共服務：依申請目的準備對應文件\n\n⚠️ 學生身分不等於自動獲配 PPSN，須說明具體用途並提供證明。',
      '📄 STEP 03｜現場文件，一次備齊\n以預約通知所列文件為準，準備實體正本：\n\n✅ 護照正本（台灣申請人準備有效護照）\n✅ 3 個月內的地址證明（須有姓名與住址：銀行信／帳單、租約等）\n✅ 需要 PPSN 的證明（雇主信、工作合約或學校信）\n✅ 預約資訊與補充文件（依通知清單準備；學生證可作補充）\n\n💡 暫住親友家，沒有自己的帳單？\n可用住戶帳單正本＋帳單持有人確認你同住的說明。',
      '🏢 STEP 04｜前往指定中心現場查驗\n依預約時間前往，攜帶所有要求的正本文件。\n\n• 配合身分與申請用途查驗\n• 若需補件，依官員或後續通知指示處理\n\n⚠️ 會面完成後仍有後續審查，不代表當場核准。',
      '📬 STEP 05｜等候審查與 PPSN 郵寄通知\n核准後，PPSN 以郵件通知寄送。\n\n• 確認住址、房號與 Eircode（郵遞區號）正確\n• 收到正式信件後，核對姓名與號碼\n• 審查與寄送時間依個案及官方通知，無固定天數\n\n需要追蹤申請？\n查看 MyWelfare 通知，或聯絡當地 PPS Number Allocation Centre。',
    ],
    reward: '解鎖【PPSN 取得】稱號\n+200 EXP',
    disclaimer: '資訊核對 2026.10.19　僅供參考' },
  { id: 'ie_bank',   icon: '💳', label: '開立實體銀行帳戶',       level: 'LV1_IE', xp: 180, optional: false,
    objective: '在 AIB 開立 Current Account，以便收取薪資、繳租及日常消費。\n適用於居住愛爾蘭共和國、年滿 16 歲的個人申請者。\n\n申請流程：① 備好文件 → ② 下載 App 完成身分驗證 → ③ 填寫 Legal Questions → ④ 收取地址驗證碼 → ⑤ 收卡啟用帳戶',
    guide: [
      '📋 STEP 01｜下載 App，先備好這些\n• 有效護照正本（需支援 NFC 晶片的晶片護照）\n• Email + 手機號碼（可收驗證訊息、網路穩定）\n• 愛爾蘭住址及 Eircode（郵遞區號），且能確實收到信件\n• IRP 及其他補充文件（如銀行要求，備妥居留及地址證明）\n\n下載 AIB Mobile → 點選「Join AIB」\n舊版 App 可能顯示「Become an AIB Customer」，依畫面操作。',
      '🪪 STEP 02｜完成身分驗證\n① 核對姓名、生日及聯絡方式，完成 Email 驗證\n② 準備護照正本，依 App 指示拍攝、NFC 晶片讀取或自拍\n\n如果 App 要求 Video Call：\n• 展示護照配合證件檢查，回答身分問題\n• 服務時間每日 07:00–23:00，請使用穩定 Wi-Fi\n\n⚠️ 護照不支援 NFC 或驗證失敗？\n聯絡 AIB 或預約分行，攜帶身分及地址證明親臨辦理。',
      '⚖️ STEP 03｜Legal Questions：照實填寫\n系統會確認個人背景、稅務資料及開戶用途，分 3 類問題：\n① 職業／就學狀況、居住情況與開戶用途\n② 是否為美國公民、在哪些國家具有稅務居民身分\n③ 各稅務居民國家及稅籍編號（TIN）\n\n💡「愛爾蘭稅務居民」打工度假者通常選 No\n不確定時先查 Revenue 或諮詢稅務專業人士，不能直接照抄他人答案！\n\n完成問答 → 閱讀相關文件 → 依流程選擇 AIB 分行',
      '🔢 STEP 04｜搞清楚這 4 組號碼\n• 8 位｜Registration number：網銀註冊號碼，由 AIB 提供。不是你的收款帳號或 IBAN。\n• 5 位｜PAC：Personal Access Code，由你自行設定。用於登入網銀／App，非郵寄的卡片 PIN。\n• 6 位｜地址驗證碼：AIB 郵寄到住址的驗證碼，收到後回 App 輸入完成地址驗證。\n• PIN｜金融卡密碼：配合實體金融卡使用，供 ATM 或插卡交易驗證，與 PAC 不同。\n\n💡 記好 Registration number 與自設的 PAC，依 App 完成登入設定。',
      '📬 STEP 05｜收信後，先驗證地址\n① 收到地址驗證信\n將信上 6 位數驗證碼輸入 App。\n驗證碼有效期 30 天；輸入後最多等待 24 小時帳戶才完全啟用。\n\n② 金融卡與 PIN 函\n金融卡與 PIN 分開郵寄，不一定同天到達。\n發卡前提是已完成有效地址驗證，請依 AIB 通知等候。\n\n⚠️ 地址碼沒收到、過期或住址已變更？\nAIB 表示地址碼無法重寄，需攜帶身分與地址證明至分行處理。',
    ],
    reward: '解鎖【開戶成功】稱號\n+180 EXP',
    disclaimer: '資訊核對 2026.10.19　僅供參考' },
  { id: 'ie_leap',   icon: '🚌', label: '辦理 Leap Card',           level: 'LV1_IE', xp:  80, optional: false,
    objective: '購買並儲值 Leap Card 公共交通卡，搭乘巴士、DART、Luas 皆可使用。' },
  { id: 'ie_house',  icon: '🏠', label: '找到長期住所',             level: 'LV1_IE', xp: 250, optional: false,
    objective: '可透過 Daft.ie 或租屋社團／打工度假社群找到長期租屋，簽訂租約。' },

  // LV.2 工作生活 ──────────────────────
  { id: 'ie_job',          icon: '💼', label: '完成第一份工作申請',  level: 'LV2_IE', xp: 300, optional: false,
    objective: '嘗試投遞 CV 。' },
  { id: 'ie_supermarket',  icon: '🛒', label: '攻略當地超市',        level: 'LV2_IE', xp:  60, optional: false,
    objective: '熟悉 Dunnes Stores、Tesco、Lidl、Aldi 各超市的價格與特色，制定省錢採購策略。' },
  { id: 'ie_explore',      icon: '🌿', label: '探索愛爾蘭新地區',    level: 'LV2_IE', xp: 100, optional: true,
    objective: '走訪一個你從未去過的地區，紀錄你的發現。' },
  { id: 'ie_course',       icon: '📚', label: '報名語言或職業課程',  level: 'LV2_IE', xp: 150, optional: true,
    objective: '報名英語課、職業培訓或線上課程，提升技能或語言能力。' },
];

// ─── 日常任務 (Daily Tasks) ───────────────────────────────────────────────────
export const DAILY_TASKS: DailyTask[] = [
  { id: 'daily_checkin',  icon: '☀️', label: '今日目標打卡',         xp: 20  },
  { id: 'daily_cook',     icon: '🍳', label: '自煮一餐（省錢技能）', xp: 30  },
  { id: 'daily_walk',     icon: '🚶', label: '步行超過 10,000 步',    xp: 25  },
  { id: 'daily_english',  icon: '📝', label: '學習 5 個新英語單詞',  xp: 30  },
  { id: 'daily_cafe',     icon: '☕', label: '發現一家好咖啡館',     xp: 15  },
  { id: 'daily_rain',     icon: '☔', label: '帶傘出門',xp: 10  },
];

// ─── 背包.md – Bag Items ──────────────────────────────────────────────────────
export const BAG_ITEMS: BagItem[] = [
  { id: 'bag_passport', icon: '🛂', label: '護照',       sublabel: 'Taiwan Passport',     slot: 'document', obtained: true  },
  { id: 'bag_visa',     icon: '📄', label: '打工度假簽證', sublabel: 'WHV Stamp',          slot: 'document', obtained: false },
  { id: 'bag_irp',      icon: '🪪', label: 'IRP 卡',      sublabel: 'Residence Permit',    slot: 'card',     obtained: false },
  { id: 'bag_ppsn',     icon: '📋', label: 'PPSN 信件',   sublabel: 'PPS Number Letter',   slot: 'document', obtained: false },
  { id: 'bag_aib',      icon: '💳', label: 'AIB 銀行卡',  sublabel: 'AIB Debit Card',      slot: 'card',     obtained: false },
  { id: 'bag_leap',     icon: '🚌', label: 'Leap Card',   sublabel: 'Transport Card',      slot: 'card',     obtained: false },
  { id: 'bag_sim',      icon: '📱', label: '愛爾蘭 SIM', sublabel: 'Three / Vodafone',     slot: 'card',     obtained: false },
  { id: 'bag_key',      icon: '🔑', label: '公寓鑰匙',    sublabel: 'Apartment Key',       slot: 'gear',     obtained: false },
  { id: 'bag_umbrella', icon: '☂️', label: '雨傘',        sublabel: '愛爾蘭必備 ☔',        slot: 'gear',     obtained: false },
  { id: 'bag_bag',      icon: '🎒', label: '每日通勤包',  sublabel: 'Daily Commute Bag',   slot: 'gear',     obtained: true  },
  { id: 'bag_plug',     icon: '🔌', label: '轉接插頭',    sublabel: 'Type G Adapter (IE)', slot: 'misc',     obtained: false },
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
  { id: 'visa_done',      emoji: '🛂', title: '愛爾蘭旅人',  titleEn: 'Ireland Adventurer', desc: '完成簽證領取，啟動愛爾蘭冒險！',      color: '#FF6B35', unlockKey: 'visa_done'         },
  { id: 'transit_maniac', emoji: '🔀', title: '轉機狂人',   titleEn: 'Transit Maniac',     desc: '選擇了複雜的多段中轉航線',            color: '#9B59B6', unlockKey: 'hasComplexRouting' },
  { id: 'ireland_landed', emoji: '☘️', title: '愛爾蘭登陸', titleEn: 'Ireland Landed',     desc: '成功抵達翡翠島！',                    color: '#00A651', unlockKey: 'hasArrived'        },
  { id: 'passport_done',  emoji: '🛂', title: '護照完成',   titleEn: 'Passport Ready',     desc: '完整填寫了冒險者護照資料',            color: '#E67E22', unlockKey: 'hasFullProfile'    },
  { id: 'flight_ready',   emoji: '✈️', title: '飛行準備',   titleEn: 'Flight Ready',       desc: '填妥航班編號與起飛時間',              color: '#2980B9', unlockKey: 'hasFlightInfo'     },
  { id: 'time_traveler',  emoji: '🕐', title: '時空旅人',   titleEn: 'Time Traveler',      desc: '擁有中轉時區同步能力',                color: '#16A085', unlockKey: 'hasTransitTz'      },
  { id: 'irp_done',       emoji: '🏛️', title: 'IRP 完成',   titleEn: 'IRP Registered',    desc: '完成外國人居留許可登記',              color: '#27AE60', unlockKey: 'irp_done'          },
  { id: 'ppsn_done',      emoji: '🔢', title: 'PPSN 取得',  titleEn: 'PPSN Obtained',      desc: '拿到愛爾蘭公共服務號碼',              color: '#2ECC71', unlockKey: 'ppsn_done'         },
  { id: 'bank_open',      emoji: '💳', title: '開戶成功',   titleEn: 'Bank Opened',        desc: '成功開立本地銀行帳戶',                color: '#3498DB', unlockKey: 'bank_open'         },
  { id: 'pub_first',      emoji: '🍺', title: 'Pub 初體驗', titleEn: 'First Pint',         desc: '進入愛爾蘭 Pub 喝下第一杯',          color: '#C0392B', unlockKey: 'pubVisited'        },
  { id: 'rain_survivor',  emoji: '☔', title: '雨中求生',   titleEn: 'Rain Survivor',      desc: '在都柏林雨天仍然出門並帶了傘',        color: '#2C3E50', unlockKey: 'rainSurvived'      },
  { id: 'house_found',    emoji: '🏠', title: '找到家',     titleEn: 'Home Found',         desc: '找到都柏林長期住所',                  color: '#8E44AD', unlockKey: 'house_found'       },
  { id: 'first_job',      emoji: '💼', title: '第一份工作', titleEn: 'First Job',          desc: '在愛爾蘭拿到第一份工作',              color: '#F39C12', unlockKey: 'first_job'         },
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
