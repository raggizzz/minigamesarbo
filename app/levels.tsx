import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCampaignProfile } from '../src/data/campaign';
import { LEVELS } from '../src/data/levels';
import { StarRatingDisplay } from '../src/components/ui/StarRating';
import { useGameStore } from '../src/store/gameStore';
import { LevelId } from '../src/types/game';

const LEVEL_ACCENTS = ['#5B7F63', '#486B7B', '#8A6A3E', '#B17732', '#8B4C45'];

export default function LevelsScreen() {
  const router = useRouter();
  const progress = useGameStore((state) => state.progress);
  const levels = progress.levels || {};
  const campaign = getCampaignProfile(progress);

  const isLevelUnlocked = (levelId: LevelId) => {
    if (levelId === 1) return true;
    const previousLevel = (levelId - 1) as LevelId;
    return levels[previousLevel]?.completed ?? false;
  };

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_levels_path.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.82}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campanha</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{progress.totalScore} pts</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryEyebrow}>TRILHA DA CIDADE</Text>
            <Text style={styles.summaryTitle}>{campaign.rankTitle}</Text>
            <Text style={styles.summaryText}>
              {campaign.completedLevels} missoes concluídas. Falta pouco para subir de patente.
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeValue}>#{campaign.leaguePlacement}</Text>
            <Text style={styles.summaryBadgeLabel}>liga</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.trainingCard}
          onPress={() => router.push('/training')}
          activeOpacity={0.84}
        >
          <Text style={styles.summaryEyebrow}>CONTEUDO NOVO</Text>
          <Text style={styles.trainingTitle}>Abrir desafios extras</Text>
          <Text style={styles.trainingText}>
            Treinos curtos de classificacao, resposta rapida e triagem sentinela.
          </Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {LEVELS.map((level, index) => {
            const accent = LEVEL_ACCENTS[index] || LEVEL_ACCENTS[0];
            const unlocked = isLevelUnlocked(level.id);
            const levelData = levels[level.id];

            return (
              <TouchableOpacity
                key={level.id}
                style={[styles.levelCard, !unlocked && styles.levelCardLocked]}
                onPress={() => unlocked && router.push(`/game/${level.id}`)}
                disabled={!unlocked}
                activeOpacity={0.84}
              >
                <View style={[styles.levelAccent, { backgroundColor: accent }]} />
                <View style={styles.levelTopRow}>
                  <View style={[styles.levelBadge, !unlocked && styles.levelBadgeLocked]}>
                    <Text style={styles.levelBadgeText}>{unlocked ? level.id : 'X'}</Text>
                  </View>
                  <View style={styles.levelCopy}>
                    <Text style={[styles.levelSubtitle, !unlocked && styles.muted]}>{level.district}</Text>
                    <Text style={[styles.levelTitle, !unlocked && styles.mutedStrong]}>{level.name}</Text>
                  </View>
                  <View style={styles.threatChip}>
                    <Text style={styles.threatChipText}>{level.threatLevel}</Text>
                  </View>
                </View>

                <Text style={[styles.levelObjective, !unlocked && styles.muted]}>{level.objective}</Text>

                <View style={styles.levelMetaRow}>
                  <Text style={[styles.levelMetaText, !unlocked && styles.muted]}>
                    Insignia: {level.badge.name}
                  </Text>
                  <Text style={[styles.levelMetaText, !unlocked && styles.muted]}>
                    Bonus: {level.bonusObjective.title}
                  </Text>
                </View>

                {levelData?.completed ? (
                  <View style={styles.completedRow}>
                    <StarRatingDisplay stars={levelData.stars} size={16} />
                    <Text style={styles.completedText}>Melhor pontuacao {levelData.highScore}</Text>
                  </View>
                ) : (
                  <Text style={[styles.pendingText, !unlocked && styles.muted]}>
                    {unlocked ? 'Pronto para iniciar esta operacao.' : 'Conclua a missao anterior para liberar.'}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 11, 10, 0.28)',
  },
  safe: {
    flex: 1,
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(246, 240, 226, 0.94)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
  },
  backText: {
    color: '#3B2F1E',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFF8EA',
    fontSize: 26,
    fontWeight: '900',
  },
  scoreBadge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(246, 240, 226, 0.94)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
  },
  scoreBadgeText: {
    color: '#3B2F1E',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryCard: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(246, 240, 226, 0.97)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    padding: 16,
    marginBottom: 12,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  summaryTitle: {
    color: '#241C13',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  summaryText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  summaryBadge: {
    width: 76,
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: '#EFE4CA',
    borderWidth: 1,
    borderColor: '#D0B986',
    alignItems: 'center',
  },
  summaryBadgeValue: {
    color: '#3A2E1E',
    fontSize: 20,
    fontWeight: '900',
  },
  summaryBadgeLabel: {
    color: '#756245',
    fontSize: 11,
    fontWeight: '700',
  },
  trainingCard: {
    width: '100%',
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(255, 249, 238, 0.96)',
    borderWidth: 1,
    borderColor: '#E0D5BF',
    marginBottom: 12,
  },
  trainingTitle: {
    color: '#241C13',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  trainingText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  scrollContent: {
    width: '100%',
    alignItems: 'stretch',
    paddingBottom: 32,
    gap: 12,
  },
  levelCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(246, 240, 226, 0.98)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    padding: 16,
    marginBottom: 12,
  },
  levelCardLocked: {
    opacity: 0.72,
  },
  levelAccent: {
    width: 52,
    height: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8DFC8',
    borderWidth: 1,
    borderColor: '#BAA27A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeLocked: {
    backgroundColor: '#E9E0D8',
  },
  levelBadgeText: {
    color: '#3B2F1E',
    fontSize: 20,
    fontWeight: '900',
  },
  levelCopy: {
    flex: 1,
  },
  levelSubtitle: {
    color: '#756245',
    fontSize: 11,
    fontWeight: '700',
  },
  levelTitle: {
    color: '#241C13',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 1,
  },
  threatChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#D6CAB2',
  },
  threatChipText: {
    color: '#5B4D3B',
    fontSize: 11,
    fontWeight: '800',
  },
  levelObjective: {
    color: '#4B4032',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  levelMetaRow: {
    gap: 4,
    marginTop: 10,
  },
  levelMetaText: {
    color: '#756245',
    fontSize: 11,
    fontWeight: '700',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  completedText: {
    color: '#5B7F63',
    fontSize: 12,
    fontWeight: '700',
  },
  pendingText: {
    color: '#756245',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
  muted: {
    color: '#90816D',
  },
  mutedStrong: {
    color: '#6E6250',
  },
});
