import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ScreenId, PlayerProfile, AvatarConfig, Gender } from '../types';
import { DEFAULT_AVATAR, getDayStatus, resolveTransitTz } from '../data/constants';

// ─── AIB Entry type (shared) ──────────────────────────────────────────────────
export type AibEntryType = 'income' | 'expense';
export interface AibEntry {
  id:       string;
  type:     AibEntryType;
  eur:      number;
  category: string;
  desc:     string;
  date:     string;
}

// ─── State Shape ──────────────────────────────────────────────────────────────
export interface GameState {
  currentScreen:   ScreenId;
  player:          PlayerProfile;
  completedTasks:  Set<string>;
  completedDaily:  Set<string>;
  showParticles:   boolean;
  activeEvent:     string | null;          // RandomEvent id
  unlockedBadges:  Set<string>;
  aibEntries:      AibEntry[];
}

const INIT_PLAYER: PlayerProfile = {
  name:         '',
  gender:       '',
  city:         '',
  arrivalDate:  '',
  flightTime:   '',
  transitHubs:  [],
  airlines:     [],
  flightNumber: '',
  avatar: DEFAULT_AVATAR,
};

const INITIAL_STATE: GameState = {
  currentScreen:  'COVER',
  player:         INIT_PLAYER,
  completedTasks: new Set(),
  completedDaily: new Set(),
  showParticles:  false,
  activeEvent:    null,
  unlockedBadges: new Set(),
  aibEntries:     [],
};

// ─── Actions ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'NAVIGATE';        screen: ScreenId }
  | { type: 'SET_PLAYER_NAME'; value: string }
  | { type: 'SET_GENDER';      value: Gender }
  | { type: 'SET_CITY';        value: string }
  | { type: 'SET_ARRIVAL_DATE';value: string }
  | { type: 'SET_FLIGHT_TIME'; value: string }
  | { type: 'TOGGLE_TRANSIT';  hub: string }
  | { type: 'TOGGLE_AIRLINE';  airline: string }
  | { type: 'SET_FLIGHT_NUM';  value: string }
  | { type: 'SET_AVATAR';      cfg: Partial<AvatarConfig> }
  | { type: 'TOGGLE_TASK';     id: string }
  | { type: 'TOGGLE_DAILY';    id: string }
  | { type: 'SHOW_PARTICLES' }
  | { type: 'HIDE_PARTICLES' }
  | { type: 'SET_EVENT';       id: string | null }
  | { type: 'UNLOCK_BADGE';    id: string }
  | { type: 'ADD_AIB_ENTRY';  entry: AibEntry }
  | { type: 'DEL_AIB_ENTRY';  id: string };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentScreen: action.screen };

    case 'SET_PLAYER_NAME':
      return { ...state, player: { ...state.player, name: action.value } };

    case 'SET_GENDER':
      return { ...state, player: { ...state.player, gender: action.value } };

    case 'SET_CITY':
      return { ...state, player: { ...state.player, city: action.value } };

    case 'SET_ARRIVAL_DATE':
      return { ...state, player: { ...state.player, arrivalDate: action.value } };

    case 'SET_FLIGHT_TIME':
      return { ...state, player: { ...state.player, flightTime: action.value } };

    case 'TOGGLE_TRANSIT': {
      const hubs = state.player.transitHubs.includes(action.hub)
        ? state.player.transitHubs.filter(h => h !== action.hub)
        : [...state.player.transitHubs, action.hub];
      return { ...state, player: { ...state.player, transitHubs: hubs } };
    }

    case 'TOGGLE_AIRLINE': {
      const lines = state.player.airlines.includes(action.airline)
        ? state.player.airlines.filter(a => a !== action.airline)
        : [...state.player.airlines, action.airline];
      return { ...state, player: { ...state.player, airlines: lines } };
    }

    case 'SET_FLIGHT_NUM':
      return { ...state, player: { ...state.player, flightNumber: action.value } };

    case 'SET_AVATAR':
      return { ...state, player: { ...state.player, avatar: { ...state.player.avatar, ...action.cfg } } };

    case 'TOGGLE_TASK': {
      const next = new Set(state.completedTasks);
      next.has(action.id) ? next.delete(action.id) : next.add(action.id);
      return { ...state, completedTasks: next };
    }

    case 'TOGGLE_DAILY': {
      const next = new Set(state.completedDaily);
      next.has(action.id) ? next.delete(action.id) : next.add(action.id);
      return { ...state, completedDaily: next };
    }

    case 'SHOW_PARTICLES':
      return { ...state, showParticles: true };

    case 'HIDE_PARTICLES':
      return { ...state, showParticles: false };

    case 'SET_EVENT':
      return { ...state, activeEvent: action.id };

    case 'UNLOCK_BADGE': {
      const next = new Set(state.unlockedBadges);
      next.add(action.id);
      return { ...state, unlockedBadges: next };
    }

    case 'ADD_AIB_ENTRY':
      return { ...state, aibEntries: [action.entry, ...state.aibEntries] };

    case 'DEL_AIB_ENTRY':
      return { ...state, aibEntries: state.aibEntries.filter(e => e.id !== action.id) };

    default:
      return state;
  }
}

// ─── Derived / Computed ───────────────────────────────────────────────────────
export interface GameDerived {
  dayStatus:          ReturnType<typeof getDayStatus>;
  transitTz:          ReturnType<typeof resolveTransitTz>;
  hasComplexRouting:  boolean;
  hasArrived:         boolean;
  hasFullProfile:     boolean;
  hasFlightInfo:      boolean;
  hasTransitTz:       boolean;
  irpDone:            boolean;
  ppsnDone:           boolean;
  bankDone:           boolean;
  jobDone:            boolean;
  houseDone:          boolean;
  pubVisited:         boolean;
  rainSurvived:       boolean;
  totalXP:            number;
  aibBalance:         number;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface GameContextValue {
  state:    GameState;
  derived:  GameDerived;
  dispatch: React.Dispatch<Action>;
  navigate: (screen: ScreenId) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
import { MAIN_TASKS } from '../data/constants';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const navigate = useCallback((screen: ScreenId) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  const { player, completedTasks } = state;

  const dayStatus         = getDayStatus(player.arrivalDate);
  const transitTz         = resolveTransitTz(player.transitHubs, player.airlines);
  const hasArrived        = dayStatus.type === 'arrived';
  const hasComplexRouting = player.transitHubs.length > 1
    || (player.transitHubs.length >= 1 && player.airlines.length > 1);

  const totalXP = MAIN_TASKS
    .filter(t => completedTasks.has(t.id))
    .reduce((s, t) => s + t.xp, 0);

  const aibBalance = state.aibEntries.reduce(
    (s, e) => s + (e.type === 'income' ? e.eur : -e.eur), 0
  );

  const derived: GameDerived = {
    dayStatus,
    transitTz,
    hasComplexRouting,
    hasArrived,
    hasFullProfile:  !!player.name && !!player.arrivalDate,
    hasFlightInfo:   !!player.flightNumber && player.airlines.length > 0,
    hasTransitTz:    transitTz.offset !== 0,
    irpDone:         completedTasks.has('ie_irp'),
    ppsnDone:        completedTasks.has('ie_ppsn'),
    bankDone:        completedTasks.has('ie_bank'),
    jobDone:         completedTasks.has('ie_job'),
    houseDone:       completedTasks.has('ie_house'),
    pubVisited:      state.unlockedBadges.has('pub_first'),
    rainSurvived:    state.unlockedBadges.has('rain_survivor'),
    totalXP,
    aibBalance,
  };

  return (
    <GameContext.Provider value={{ state, derived, dispatch, navigate }}>
      {children}
    </GameContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
