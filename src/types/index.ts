// ─── Screen & Navigation ──────────────────────────────────────────────────────
export type ScreenId =
  | 'COVER'
  | 'SETUP'
  | 'HOME'
  | 'AIB'
  | 'TASK'
  | 'GUILD'
  | 'DUNNES'
  | 'BAG'
  | 'COLLECTIONS';

export type AvatarTab =
  | 'hair' | 'rearHair' | 'outfit' | 'eyes' | 'mouth'
  | 'hairColor' | 'skinColor' | 'clothesColor';
export type Gender = 'female' | 'male' | '';

// ─── Avatar ───────────────────────────────────────────────────────────────────
export interface AvatarConfig {
  hairIdx:         number;
  rearHairIdx:     number;
  outfitIdx:       number;
  eyesIdx:         number;
  mouthIdx:        number;
  hairColorIdx:    number;
  skinColorIdx:    number;
  clothesColorIdx: number;
}

// ─── Player / Passport ────────────────────────────────────────────────────────
export interface PlayerProfile {
  name:         string;
  gender:       Gender;
  arrivalDate:  string; // YYYY-MM-DD
  flightTime:   string; // HH:mm
  transitHubs:  string[];
  airlines:     string[];
  flightNumber: string;
  avatar:       AvatarConfig;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export type TaskLevel = 'LV0_TW' | 'LV1_IE' | 'LV2_IE';
export interface Task {
  id:       string;
  icon:     string;
  label:    string;
  level:    TaskLevel;
  xp:       number;
  optional: boolean;
}

// ─── Daily Tasks ──────────────────────────────────────────────────────────────
export interface DailyTask {
  id:    string;
  icon:  string;
  label: string;
  xp:    number;
}

// ─── Shop / Dunnes ────────────────────────────────────────────────────────────
export type ShopCategory = 'essential' | 'snack' | 'fresh' | 'household';
export interface ShopItem {
  id:       string;
  icon:     string;
  name:     string;
  nameZh:   string;
  price:    number;   // EUR
  category: ShopCategory;
  tip?:     string;
}

// ─── Bag ──────────────────────────────────────────────────────────────────────
export type BagSlot = 'document' | 'card' | 'gear' | 'misc';
export interface BagItem {
  id:       string;
  icon:     string;
  label:    string;
  sublabel: string;
  slot:     BagSlot;
  obtained: boolean; // linked to task completion in context
}

// ─── Random Events ────────────────────────────────────────────────────────────
export interface RandomEvent {
  id:      string;
  icon:    string;
  title:   string;
  desc:    string;
  effect?: string; // flavour text
  xp:      number;
}

// ─── Collections / Badges ─────────────────────────────────────────────────────
export interface Badge {
  id:          string;
  emoji:       string;
  title:       string;
  titleEn:     string;
  desc:        string;
  color:       string;
  /** Evaluated at runtime in context – function stored as string key */
  unlockKey:   string;
}

// ─── AIB Bank ─────────────────────────────────────────────────────────────────
export interface BankStep {
  id:    string;
  icon:  string;
  label: string;
  note:  string;
  url?:  string;
}

// ─── Guild ────────────────────────────────────────────────────────────────────
export interface GuildPost {
  id:       string;
  avatar:   string;
  author:   string;
  time:     string;
  content:  string;
  tags:     string[];
  likes:    number;
}
