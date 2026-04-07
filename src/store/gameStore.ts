// ============================================
// ArboGame — Game Store (Zustand)
// ============================================

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LevelId, PlayerProgress, LevelProgress, StarRating, GameState } from '../types/game';
import { GAME_CONSTANTS } from '../styles/theme';

const STORAGE_KEY = '@arbogame_progress';

const DEFAULT_LEVEL_PROGRESS: LevelProgress = {
  levelId: 1,
  unlocked: false,
  completed: false,
  stars: 0,
  highScore: 0,
  bestTime: 0,
};

const DEFAULT_PROGRESS: PlayerProgress = {
  levels: {
    1: { ...DEFAULT_LEVEL_PROGRESS, levelId: 1, unlocked: true },
    2: { ...DEFAULT_LEVEL_PROGRESS, levelId: 2 },
    3: { ...DEFAULT_LEVEL_PROGRESS, levelId: 3 },
    4: { ...DEFAULT_LEVEL_PROGRESS, levelId: 4 },
    5: { ...DEFAULT_LEVEL_PROGRESS, levelId: 5 },
  },
  totalScore: 0,
  badgesUnlocked: [],
  soundEnabled: true,
  musicEnabled: true,
  hasSeenIntro: false,
};

const DEFAULT_GAME_STATE: GameState = {
  currentLevel: 1,
  score: 0,
  lives: GAME_CONSTANTS.DEFAULT_LIVES,
  timeRemaining: 90,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  infestationLevel: 0,
  isPaused: false,
  isGameOver: false,
  isVictory: false,
};

interface GameStore {
  // Player progress
  progress: PlayerProgress;
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;

  // Game state
  gameState: GameState;
  initLevel: (levelId: LevelId, timeLimit: number) => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  updateTime: (time: number) => void;
  addCorrectAnswer: () => void;
  addWrongAnswer: () => void;
  updateInfestation: (delta: number) => void;
  togglePause: () => void;
  setVictory: () => void;
  setGameOver: () => void;

  // Level completion
  completeLevel: (levelId: LevelId, score: number, stars: StarRating, timeUsed: number) => void;
  unlockBadge: (badgeId: string) => boolean;

  // Settings
  toggleSound: () => void;
  toggleMusic: () => void;
  setIntroSeen: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  progress: DEFAULT_PROGRESS,
  gameState: DEFAULT_GAME_STATE,

  loadProgress: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as PlayerProgress;
        set({
          progress: {
            ...DEFAULT_PROGRESS,
            ...parsed,
            levels: {
              ...DEFAULT_PROGRESS.levels,
              ...parsed.levels,
            },
            badgesUnlocked: parsed.badgesUnlocked ?? DEFAULT_PROGRESS.badgesUnlocked,
          },
        });
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  },

  saveProgress: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  },

  resetProgress: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ progress: DEFAULT_PROGRESS });
    } catch (e) {
      console.error('Failed to reset progress:', e);
    }
  },

  initLevel: (levelId: LevelId, timeLimit: number) => {
    set({
      gameState: {
        ...DEFAULT_GAME_STATE,
        currentLevel: levelId,
        timeRemaining: timeLimit,
      },
    });
  },

  addScore: (points: number) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        score: Math.max(0, state.gameState.score + points),
      },
    }));
  },

  loseLife: () => {
    set((state) => {
      const newLives = state.gameState.lives - 1;
      return {
        gameState: {
          ...state.gameState,
          lives: newLives,
          isGameOver: newLives <= 0,
        },
      };
    });
  },

  incrementCombo: () => {
    set((state) => {
      const newCombo = state.gameState.combo + 1;
      let bonusPoints = 0;
      if (newCombo === 3) bonusPoints = GAME_CONSTANTS.COMBO_3_BONUS;
      if (newCombo === 5) bonusPoints = GAME_CONSTANTS.COMBO_5_BONUS;

      return {
        gameState: {
          ...state.gameState,
          combo: newCombo,
          maxCombo: Math.max(newCombo, state.gameState.maxCombo),
          score: state.gameState.score + bonusPoints,
        },
      };
    });
  },

  resetCombo: () => {
    set((state) => ({
      gameState: { ...state.gameState, combo: 0 },
    }));
  },

  updateTime: (time: number) => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        timeRemaining: time,
        isGameOver: time <= 0 ? true : state.gameState.isGameOver,
      },
    }));
  },

  addCorrectAnswer: () => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        correctAnswers: state.gameState.correctAnswers + 1,
        totalAnswers: state.gameState.totalAnswers + 1,
      },
    }));
  },

  addWrongAnswer: () => {
    set((state) => ({
      gameState: {
        ...state.gameState,
        totalAnswers: state.gameState.totalAnswers + 1,
      },
    }));
  },

  updateInfestation: (delta: number) => {
    set((state) => {
      const newLevel = Math.max(0, Math.min(100, state.gameState.infestationLevel + delta));
      return {
        gameState: {
          ...state.gameState,
          infestationLevel: newLevel,
          isGameOver: newLevel >= 100 ? true : state.gameState.isGameOver,
        },
      };
    });
  },

  togglePause: () => {
    set((state) => ({
      gameState: { ...state.gameState, isPaused: !state.gameState.isPaused },
    }));
  },

  setVictory: () => {
    set((state) => ({
      gameState: { ...state.gameState, isVictory: true },
    }));
  },

  setGameOver: () => {
    set((state) => ({
      gameState: { ...state.gameState, isGameOver: true },
    }));
  },

  completeLevel: (levelId: LevelId, score: number, stars: StarRating, timeUsed: number) => {
    set((state) => {
      const currentProgress = state.progress.levels[levelId];
      const nextLevelId = (levelId + 1) as LevelId;
      const newLevels = { ...state.progress.levels };

      // Update current level
      newLevels[levelId] = {
        ...currentProgress,
        completed: true,
        stars: Math.max(currentProgress.stars, stars) as StarRating,
        highScore: Math.max(currentProgress.highScore, score),
        bestTime: currentProgress.bestTime === 0
          ? timeUsed
          : Math.min(currentProgress.bestTime, timeUsed),
      };

      // Unlock next level
      if (nextLevelId <= 5 && newLevels[nextLevelId]) {
        newLevels[nextLevelId] = {
          ...newLevels[nextLevelId],
          unlocked: true,
        };
      }

      const totalScore = Object.values(newLevels).reduce(
        (sum, l) => sum + l.highScore,
        0
      );

      return {
        progress: {
          ...state.progress,
          levels: newLevels,
          totalScore,
        },
      };
    });
    // Auto-save
    get().saveProgress();
  },

  unlockBadge: (badgeId: string) => {
    const alreadyUnlocked = get().progress.badgesUnlocked.includes(badgeId);
    if (alreadyUnlocked) return false;

    set((state) => ({
      progress: {
        ...state.progress,
        badgesUnlocked: [...state.progress.badgesUnlocked, badgeId],
      },
    }));
    get().saveProgress();
    return true;
  },

  toggleSound: () => {
    set((state) => ({
      progress: { ...state.progress, soundEnabled: !state.progress.soundEnabled },
    }));
    get().saveProgress();
  },

  toggleMusic: () => {
    set((state) => ({
      progress: { ...state.progress, musicEnabled: !state.progress.musicEnabled },
    }));
    get().saveProgress();
  },

  setIntroSeen: () => {
    set((state) => ({
      progress: { ...state.progress, hasSeenIntro: true },
    }));
    get().saveProgress();
  },
}));

// Utility: calculate stars from score
export const calculateStars = (score: number, maxScore: number): StarRating => {
  const ratio = score / maxScore;
  if (ratio >= GAME_CONSTANTS.THREE_STARS_THRESHOLD) return 3;
  if (ratio >= GAME_CONSTANTS.TWO_STARS_THRESHOLD) return 2;
  if (ratio >= GAME_CONSTANTS.ONE_STAR_THRESHOLD) return 1;
  return 0;
};
