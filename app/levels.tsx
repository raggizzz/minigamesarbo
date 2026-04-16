import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCampaignProfile } from '../src/data/campaign';
import { LEVELS } from '../src/data/levels';
import { StarRatingDisplay } from '../src/components/ui/StarRating';
import { useGameStore } from '../src/store/gameStore';
import { LevelId } from '../src/types/game';

// Cada nível com gradiente próprio (vibrante)
const LEVEL_GRADIENTS: [string, string][] = [
  ['#22C55E', '#16A34A'],   // Level 1 - verde
  ['#3B82F6', '#2563EB'],   // Level 2 - azul
  ['#F59E0B', '#D97706'],   // Level 3 - âmbar
  ['#EF4444', '#DC2626'],   // Level 4 - vermelho
  ['#8B5CF6', '#7C3AED'],   // Level 5 - roxo
];

const LEVEL_EMOJIS = ['🏠', '🌿', '🩺', '🏘️', '🏙️'];
const LEVEL_LIGHT_BG = ['#F0FDF4', '#EFF6FF', '#FFFBEB', '#FFF1F2', '#F5F3FF'];
const LEVEL_BORDER = ['#86EFAC', '#93C5FD', '#FDE68A', '#FCA5A5', '#C4B5FD'];

export default function LevelsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = useGameStore((state) => state.progress);
  const levels = progress.levels || {};
  const campaign = getCampaignProfile(progress);

  const isLevelUnlocked = (levelId: LevelId) => {
    if (levelId === 1) return true;
    const previousLevel = (levelId - 1) as LevelId;
    return levels[previousLevel]?.completed ?? false;
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../assets/images/game/bg_levels_path.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Conteúdo — usando insets manuais para nunca mostrar fundo branco */}
      <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.82}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🗺️ Campanha</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>⭐ {progress.totalScore}</Text>
          </View>
        </View>

        {/* RANK CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryEyebrow}>🏆 TRILHA DA CIDADE</Text>
            <Text style={styles.summaryTitle}>{campaign.rankTitle}</Text>
            <Text style={styles.summaryText}>
              {campaign.completedLevels} missões concluídas · sobe de patente!
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeValue}>#{campaign.leaguePlacement}</Text>
            <Text style={styles.summaryBadgeLabel}>liga</Text>
          </View>
        </View>

        {/* DESAFIOS EXTRAS */}
        <TouchableOpacity
          style={styles.trainingCard}
          onPress={() => router.push('/training')}
          activeOpacity={0.84}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trainingGradient}
          >
            <Text style={styles.trainingEmoji}>⚡</Text>
            <View style={styles.trainingCopy}>
              <Text style={styles.trainingTitle}>Desafios extras</Text>
              <Text style={styles.trainingText}>Classificação, resposta rápida e triagem sentinela.</Text>
            </View>
            <Text style={styles.trainingArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* LISTA DE NÍVEIS */}
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {LEVELS.map((level, index) => {
            const [gradStart, gradEnd] = LEVEL_GRADIENTS[index] ?? ['#6B7280', '#4B5563'];
            const emoji = LEVEL_EMOJIS[index] ?? '🎯';
            const lightBg = LEVEL_LIGHT_BG[index] ?? '#F9FAFB';
            const borderColor = LEVEL_BORDER[index] ?? '#E5E7EB';
            const unlocked = isLevelUnlocked(level.id);
            const levelData = levels[level.id];

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  { backgroundColor: lightBg, borderColor },
                  !unlocked && styles.levelCardLocked,
                ]}
                onPress={() => unlocked && router.push(`/game/${level.id}`)}
                disabled={!unlocked}
                activeOpacity={0.84}
              >
                {/* CABEÇALHO DO CARD */}
                <View style={styles.levelTopRow}>
                  <LinearGradient
                    colors={unlocked ? [gradStart, gradEnd] : ['#9CA3AF', '#6B7280']}
                    style={styles.levelBadge}
                  >
                    <Text style={styles.levelBadgeEmoji}>{unlocked ? emoji : '🔒'}</Text>
                  </LinearGradient>

                  <View style={styles.levelCopy}>
                    <Text style={[styles.levelDistrict, !unlocked && styles.muted]}>{level.district}</Text>
                    <Text style={[styles.levelTitle, !unlocked && styles.mutedStrong]}>{level.name}</Text>
                  </View>

                  <View style={[styles.threatChip, { borderColor }]}>
                    <Text style={styles.threatChipText}>{level.threatLevel}</Text>
                  </View>
                </View>

                {/* OBJETIVO */}
                <Text style={[styles.levelObjective, !unlocked && styles.muted]}>{level.objective}</Text>

                {/* META */}
                <View style={styles.levelMetaRow}>
                  <Text style={[styles.levelMetaText, !unlocked && styles.muted]}>
                    🏅 {level.badge.name}
                  </Text>
                  <Text style={[styles.levelMetaText, !unlocked && styles.muted]}>
                    🎯 {level.bonusObjective.title}
                  </Text>
                </View>

                {/* RESULTADO OU CTA */}
                {levelData?.completed ? (
                  <View style={styles.completedRow}>
                    <StarRatingDisplay stars={levelData.stars} size={16} />
                    <Text style={styles.completedText}>Melhor: {levelData.highScore} pts</Text>
                  </View>
                ) : unlocked ? (
                  <LinearGradient
                    colors={[gradStart, gradEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playButton}
                  >
                    <Text style={styles.playButtonText}>Jogar agora  →</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.lockedText}>🔒 Conclua a missão anterior para liberar</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0806', // fallback sólido para antes da imagem carregar
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 8, 6, 0.38)',
  },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 14,
    paddingBottom: 8,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 10,
  },
  backBtn: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  backText: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  scoreBadgeText: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '800',
  },

  // SUMMARY CARD
  summaryCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,253,248,0.97)',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    padding: 14,
    marginBottom: 10,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryEyebrow: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryTitle: {
    color: '#14532D',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryText: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  summaryBadge: {
    width: 68,
    borderRadius: 14,
    paddingVertical: 10,
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    alignItems: 'center',
  },
  summaryBadgeValue: {
    color: '#14532D',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryBadgeLabel: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
  },

  // TRAINING CARD
  trainingCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  trainingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  trainingEmoji: {
    fontSize: 28,
  },
  trainingCopy: {
    flex: 1,
  },
  trainingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  trainingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  trainingArrow: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },

  // SCROLL
  scrollView: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    alignItems: 'stretch',
    paddingBottom: 24,
    gap: 10,
  },

  // LEVEL CARD
  levelCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  levelCardLocked: {
    opacity: 0.65,
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeEmoji: {
    fontSize: 26,
  },
  levelCopy: {
    flex: 1,
  },
  levelDistrict: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },
  levelTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 1,
  },
  threatChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
  },
  threatChipText: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '800',
  },
  levelObjective: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
  },
  levelMetaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  levelMetaText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  completedText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  playButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 2,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  lockedText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  muted: {
    color: '#9CA3AF',
  },
  mutedStrong: {
    color: '#6B7280',
  },
});
