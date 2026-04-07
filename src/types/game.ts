// ============================================
// ArboGame — Core Game Types
// ============================================

export type LevelId = 1 | 2 | 3 | 4 | 5;

export type ActionType = 'tampar' | 'esvaziar' | 'limpar' | 'ignorar' | 'reportar';

export type ThreatLevel = 'Baixa' | 'Media' | 'Alta' | 'Critica';

export type BonusObjectiveType =
  | 'preserve_lives'
  | 'finish_fast'
  | 'accuracy'
  | 'infestation_cap'
  | 'combo';

export type HazardType =
  | 'vaso_planta'
  | 'garrafa_aberta'
  | 'balde_destampado'
  | 'caixa_dagua'
  | 'pneu_velho'
  | 'latinha'
  | 'entulho'
  | 'calha_entupida'
  | 'lixo_acumulado'
  | 'recipiente_animal';

export type SolutionType =
  | 'saco_lixo'
  | 'tampa'
  | 'pa'
  | 'limpeza'
  | 'esvaziar'
  | 'virar';

export interface Hazard {
  id: string;
  type: HazardType;
  label: string;
  emoji: string;
  correctAction: ActionType;
  correctSolution?: SolutionType;
  position: { x: number; y: number };
  description: string;
  solved: boolean;
}

export interface Solution {
  id: string;
  type: SolutionType;
  label: string;
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
  category: 'sintoma' | 'prevencao' | 'acao' | 'alerta';
}

export interface QuizOption {
  id: string;
  text: string;
  emoji: string;
  isCorrect: boolean;
}

export interface BonusObjective {
  type: BonusObjectiveType;
  title: string;
  description: string;
  rewardText: string;
  target: number;
}

export interface CampaignBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MissionStats {
  score: number;
  remainingLives: number;
  timeRemaining: number;
  correctAnswers: number;
  totalAnswers: number;
  maxCombo: number;
  infestationLevel: number;
}

export interface MapPoint {
  id: string;
  label: string;
  emoji: string;
  position: { x: number; y: number };
  hazards: Hazard[];
  completed: boolean;
}

export interface LevelConfig {
  id: LevelId;
  name: string;
  subtitle: string;
  emoji: string;
  district: string;
  threatLevel: ThreatLevel;
  description: string;
  briefing: string;
  supportTip: string;
  timeLimit: number; // seconds
  lives: number;
  objective: string;
  mechanic: 'tap_action' | 'drag_drop' | 'quiz' | 'map_missions' | 'mixed';
  educationalMessage: string;
  bonusObjective: BonusObjective;
  badge: CampaignBadge;
  maxScore: number;
}

export interface GameState {
  currentLevel: LevelId;
  score: number;
  lives: number;
  timeRemaining: number;
  combo: number;
  maxCombo: number;
  correctAnswers: number;
  totalAnswers: number;
  infestationLevel: number; // 0-100
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
}

export interface LevelProgress {
  levelId: LevelId;
  unlocked: boolean;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  highScore: number;
  bestTime: number;
}

export interface PlayerProgress {
  levels: Record<LevelId, LevelProgress>;
  totalScore: number;
  badgesUnlocked: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  hasSeenIntro: boolean;
}

export type StarRating = 0 | 1 | 2 | 3;
