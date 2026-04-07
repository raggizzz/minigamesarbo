// ============================================
// ArboGame â€” Victory Screen with illustrated art
// ============================================

import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LEVELS } from '../src/data/levels';
import { getCampaignProfile } from '../src/data/campaign';
import { GameButton } from '../src/components/ui/GameButton';
import { StarRatingDisplay } from '../src/components/ui/StarRating';
import { useGameStore } from '../src/store/gameStore';
import { LevelId, StarRating } from '../src/types/game';

export default function VictoryScreen() {
  const params = useLocalSearchParams<{
    levelId: string;
    score: string;
    stars: string;
    isLastLevel: string;
    bonusAchieved?: string;
    bonusTitle?: string;
    bonusProgress?: string;
    badgeName?: string;
    badgeIcon?: string;
    badgeUnlocked?: string;
    accuracy?: string;
    maxCombo?: string;
    timeUsed?: string;
    remainingLives?: string;
  }>();
  const router = useRouter();
  const progress = useGameStore((state) => state.progress);
  const campaign = getCampaignProfile(progress);

  const levelId = parseInt(params.levelId || '1', 10) as LevelId;
  const score = parseInt(params.score || '0', 10);
  const stars = parseInt(params.stars || '0', 10) as StarRating;
  const isLastLevel = params.isLastLevel === 'true';
  const levelConfig = LEVELS.find((level) => level.id === levelId);
  const bonusAchieved = params.bonusAchieved === 'true';
  const badgeUnlocked = params.badgeUnlocked === 'true';

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_victory.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.titleContainer}>
          <Text style={styles.title}>{isLastLevel ? 'CAMPANHA COMPLETA!' : 'VITORIA!'}</Text>
          <Text style={styles.subtitle}>
            {isLastLevel ? 'A cidade ganhou uma nova lideranca.' : `${levelConfig?.name} concluida`}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350)} style={styles.starsContainer}>
          <StarRatingDisplay stars={stars} size={48} animated={true} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.scoreCard}>
          <LinearGradient
            colors={['rgba(0,0,0,0.56)', 'rgba(0,0,0,0.34)']}
            style={styles.scoreCardInner}
          >
            <Text style={styles.scoreLabel}>Pontuacao final</Text>
            <Text style={styles.scoreValue}>💎 {score}</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(650)} style={styles.debriefGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{params.timeUsed ?? '0'}s</Text>
            <Text style={styles.statLabel}>Tempo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{params.accuracy ?? '100'}%</Text>
            <Text style={styles.statLabel}>Precisao</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>x{params.maxCombo ?? '0'}</Text>
            <Text style={styles.statLabel}>Combo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{params.remainingLives ?? '0'}</Text>
            <Text style={styles.statLabel}>Vidas</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800)}
          style={[styles.bonusCard, bonusAchieved ? styles.bonusCardSuccess : styles.bonusCardPending]}
        >
          <Text style={styles.bonusTitle}>
            {bonusAchieved ? 'Bonus tatico concluido' : 'Bonus tatico pendente'}
          </Text>
          <Text style={styles.bonusMain}>{params.bonusTitle}</Text>
          <Text style={styles.bonusText}>{params.bonusProgress}</Text>
          <Text style={styles.bonusText}>
            {params.badgeIcon} {params.badgeName}
            {badgeUnlocked ? ' desbloqueada!' : bonusAchieved ? ' reforcada no seu dossie.' : ''}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(950)} style={styles.messageCard}>
          <Text style={styles.messageIcon}>📚</Text>
          <Text style={styles.messageText}>{levelConfig?.educationalMessage}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1100)} style={styles.campaignCard}>
          <Text style={styles.campaignLabel}>Status da campanha</Text>
          <Text style={styles.campaignTitle}>{campaign.rankTitle}</Text>
          <Text style={styles.campaignText}>
            #{campaign.leaguePlacement} na liga simulada e {campaign.badgeCount} insignias no dossie.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1250)} style={styles.btns}>
          {!isLastLevel ? (
            <GameButton
              title="Proxima missao"
              emoji="▶️"
              onPress={() => router.replace(`/game/${levelId + 1}`)}
              variant="primary"
              size="lg"
              fullWidth
            />
          ) : null}
          <GameButton
            title="Jogar novamente"
            emoji="🔁"
            onPress={() => router.replace(`/game/${levelId}`)}
            variant="secondary"
            size="md"
            fullWidth
          />
          <GameButton
            title="Menu de niveis"
            emoji="📋"
            onPress={() => router.replace('/levels')}
            variant="ghost"
            size="md"
            fullWidth
          />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  titleContainer: { alignItems: 'center', marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: '600',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  starsContainer: { marginBottom: 18 },
  scoreCard: { width: '100%', maxWidth: 320, borderRadius: 18, marginBottom: 14 },
  scoreCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  scoreLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '600' },
  scoreValue: { color: '#FBBF24', fontSize: 26, fontWeight: '800' },
  debriefGrid: {
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '47%',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: 'rgba(226,232,240,0.66)',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  bonusCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  bonusCardSuccess: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderColor: 'rgba(34,197,94,0.2)',
  },
  bonusCardPending: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  bonusTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  bonusMain: { color: '#FDE68A', fontSize: 16, fontWeight: '900', marginTop: 4 },
  bonusText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 18, marginTop: 4 },
  messageCard: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
  },
  messageIcon: { fontSize: 24 },
  messageText: { flex: 1, color: '#86EFAC', fontSize: 13, lineHeight: 20, fontWeight: '500' },
  campaignCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  campaignLabel: {
    color: 'rgba(148,163,184,0.84)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  campaignTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  campaignText: {
    color: 'rgba(226,232,240,0.68)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  btns: { width: '100%', maxWidth: 320, gap: 10 },
});
