import {
  BonusObjective,
  CampaignBadge,
  LevelConfig,
  MissionStats,
  PlayerProgress,
  ThreatLevel,
} from '../types/game';
import { LEVELS } from './levels';

export interface CampaignProfile {
  completedLevels: number;
  totalStars: number;
  badgeCount: number;
  totalScore: number;
  rankTitle: string;
  rankSubtitle: string;
  leaguePlacement: number;
  leaguePercentile: number;
  completionPercent: number;
  nextRankTitle: string | null;
  nextRankPointsLeft: number;
}

interface RankDefinition {
  minPower: number;
  title: string;
  subtitle: string;
}

const CAMPAIGN_RANKS: RankDefinition[] = [
  { minPower: 0, title: 'Recruta da Vigilancia', subtitle: 'Ainda em treinamento de campo.' },
  { minPower: 1800, title: 'Guarda de Quintal', subtitle: 'Ja protege as primeiras casas do bairro.' },
  { minPower: 3600, title: 'Patrulheiro Sanitario', subtitle: 'Resposta rapida e boa leitura de risco.' },
  { minPower: 5600, title: 'Comandante de Mutirao', subtitle: 'Coordena operacoes com impacto real na cidade.' },
  { minPower: 8200, title: 'Lenda Dengue Zero', subtitle: 'Referencia local no combate as arboviroses.' },
];

const THREAT_PALETTES: Record<ThreatLevel, { colors: [string, string]; text: string }> = {
  Baixa: { colors: ['#34D399', '#059669'], text: '#D1FAE5' },
  Media: { colors: ['#38BDF8', '#2563EB'], text: '#DBEAFE' },
  Alta: { colors: ['#F59E0B', '#D97706'], text: '#FEF3C7' },
  Critica: { colors: ['#F43F5E', '#BE123C'], text: '#FFE4E6' },
};

export const getThreatPalette = (threatLevel: ThreatLevel) => {
  return THREAT_PALETTES[threatLevel];
};

export const getCampaignBadge = (badgeId: string): CampaignBadge | undefined => {
  return LEVELS.find((level) => level.badge.id === badgeId)?.badge;
};

const getCampaignPower = (progress: PlayerProgress) => {
  const totalStars = Object.values(progress.levels).reduce((sum, level) => sum + level.stars, 0);
  const completedLevels = Object.values(progress.levels).filter((level) => level.completed).length;
  const badgeCount = progress.badgesUnlocked.length;

  return progress.totalScore + totalStars * 220 + completedLevels * 280 + badgeCount * 420;
};

export const getCampaignProfile = (progress: PlayerProgress): CampaignProfile => {
  const completedLevels = Object.values(progress.levels).filter((level) => level.completed).length;
  const totalStars = Object.values(progress.levels).reduce((sum, level) => sum + level.stars, 0);
  const badgeCount = progress.badgesUnlocked.length;
  const power = getCampaignPower(progress);

  const currentRank = [...CAMPAIGN_RANKS].reverse().find((rank) => power >= rank.minPower) || CAMPAIGN_RANKS[0];
  const nextRank = CAMPAIGN_RANKS.find((rank) => rank.minPower > power) || null;
  const leaguePlacement = Math.max(8, 260 - Math.floor(power / 120));
  const leaguePercentile = Math.min(99, Math.max(3, 100 - Math.floor(power / 95)));

  return {
    completedLevels,
    totalStars,
    badgeCount,
    totalScore: progress.totalScore,
    rankTitle: currentRank.title,
    rankSubtitle: currentRank.subtitle,
    leaguePlacement,
    leaguePercentile,
    completionPercent: Math.round((completedLevels / LEVELS.length) * 100),
    nextRankTitle: nextRank?.title ?? null,
    nextRankPointsLeft: nextRank ? Math.max(0, nextRank.minPower - power) : 0,
  };
};

export const getNextAvailableLevel = (progress: PlayerProgress): LevelConfig => {
  return (
    LEVELS.find((level) => progress.levels[level.id]?.unlocked && !progress.levels[level.id]?.completed) ||
    LEVELS[LEVELS.length - 1]
  );
};

export const evaluateBonusObjective = (bonusObjective: BonusObjective, stats: MissionStats) => {
  const accuracy = stats.totalAnswers > 0 ? stats.correctAnswers / stats.totalAnswers : 1;

  switch (bonusObjective.type) {
    case 'preserve_lives':
      return {
        achieved: stats.remainingLives >= bonusObjective.target,
        progressLabel: `${stats.remainingLives}/${bonusObjective.target} vidas preservadas`,
      };
    case 'finish_fast':
      return {
        achieved: stats.timeRemaining >= bonusObjective.target,
        progressLabel: `${stats.timeRemaining}s restantes`,
      };
    case 'accuracy':
      return {
        achieved: accuracy >= bonusObjective.target,
        progressLabel: `${Math.round(accuracy * 100)}% de precisao`,
      };
    case 'infestation_cap':
      return {
        achieved: stats.infestationLevel <= bonusObjective.target,
        progressLabel: `${Math.round(stats.infestationLevel)}% de infestacao`,
      };
    case 'combo':
      return {
        achieved: stats.maxCombo >= bonusObjective.target,
        progressLabel: `Combo maximo x${stats.maxCombo}`,
      };
    default:
      return {
        achieved: false,
        progressLabel: 'Bonus nao avaliado',
      };
  }
};
