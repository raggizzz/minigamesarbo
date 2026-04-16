import React from 'react';
import {
  Image,
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
import { getCampaignProfile, getNextAvailableLevel } from '../src/data/campaign';
import { useGameStore } from '../src/store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const progress = useGameStore((state) => state.progress);
  const { toggleMusic, toggleSound } = useGameStore();
  const campaign = getCampaignProfile(progress);
  const nextMission = getNextAvailableLevel(progress);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* FUNDO — absoluteFill garante cobertura total inclusive safe areas */}
      <ImageBackground
        source={require('../assets/images/game/bg_menu.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        {/* Gradiente escuro no rodapé (cobre safe area inferior) */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.bottomGrad}
          pointerEvents="none"
        />
      </ImageBackground>

      {/* CONTEÚDO — scroll para telas pequenas */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
        ]}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Image
              source={require('../assets/images/game/character_agent.png')}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.eyebrow}>🦟 VIGILANCIA JUVENIL</Text>
          <Text style={styles.title}>ArboGame</Text>
          <Text style={styles.subtitle}>Campanha escolar contra dengue, zika e chikungunya</Text>
        </View>

        {/* DOSSIE */}
        <View style={styles.dossier}>

          {/* RANK + LIGA */}
          <View style={styles.rankRow}>
            <View style={styles.rankCopy}>
              <Text style={styles.sectionEyebrow}>DOSSIÊ DA CAMPANHA</Text>
              <Text style={styles.rankTitle}>{campaign.rankTitle}</Text>
              <Text style={styles.rankSubtitle}>{campaign.rankSubtitle}</Text>
            </View>
            <View style={styles.cityBadge}>
              <Text style={styles.cityBadgeValue}>#{campaign.leaguePlacement}</Text>
              <Text style={styles.cityBadgeLabel}>cidade</Text>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardBlue]}>
              <Text style={styles.statEmoji}>🗺️</Text>
              <Text style={[styles.statValue, styles.statValueBlue]}>{campaign.completedLevels}/5</Text>
              <Text style={styles.statLabel}>Missões</Text>
            </View>
            <View style={[styles.statCard, styles.statCardYellow]}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={[styles.statValue, styles.statValueYellow]}>{campaign.totalStars}</Text>
              <Text style={styles.statLabel}>Estrelas</Text>
            </View>
            <View style={[styles.statCard, styles.statCardGreen]}>
              <Text style={styles.statEmoji}>🏅</Text>
              <Text style={[styles.statValue, styles.statValueGreen]}>{campaign.badgeCount}</Text>
              <Text style={styles.statLabel}>Insígnias</Text>
            </View>
          </View>

          {/* PRÓXIMA MISSÃO */}
          <View style={styles.nextMissionCard}>
            <Text style={styles.sectionEyebrow}>⚡ PRÓXIMA OPERAÇÃO</Text>
            <Text style={styles.nextMissionTitle}>{nextMission.name}</Text>
            <Text style={styles.nextMissionText}>
              {nextMission.district} · {nextMission.objective}
            </Text>
          </View>

          {/* BOTÕES */}
          <View style={styles.buttonsColumn}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push(progress.hasSeenIntro ? '/levels' : '/intro')}
              activeOpacity={0.86}
            >
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>
                  {progress.hasSeenIntro ? '🗺️  Abrir campanha' : '🚀  Começar campanha'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/training')}
              activeOpacity={0.86}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>⚡  Desafios extras</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.linkRow}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/howtoplay')}
                activeOpacity={0.82}
              >
                <Text style={styles.linkButtonText}>❓ Como jogar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/credits')}
                activeOpacity={0.82}
              >
                <Text style={styles.linkButtonText}>🏆 Créditos</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.togglePill, progress.soundEnabled && styles.togglePillActive]}
              onPress={toggleSound}
              activeOpacity={0.82}
            >
              <Text style={styles.toggleText}>{progress.soundEnabled ? '🔊 Som' : '🔇 Som'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.togglePill, progress.musicEnabled && styles.togglePillActive]}
              onPress={toggleMusic}
              activeOpacity={0.82}
            >
              <Text style={styles.toggleText}>{progress.musicEnabled ? '🎵 Música' : '🎵 off'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v1.2 operação expandida</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 6, 4, 0.5)',
  },
  bottomGrad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  scroll: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },

  // HERO
  hero: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  badge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#22C55E',
    backgroundColor: 'rgba(246, 240, 226, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 8,
  },
  badgeImage: {
    width: 72,
    height: 72,
  },
  eyebrow: {
    color: '#86EFAC',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 300,
  },

  // DOSSIE CARD
  dossier: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: 'rgba(255,253,248,0.97)',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 12,
  },
  rankRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  rankCopy: { flex: 1 },
  sectionEyebrow: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rankTitle: {
    color: '#14532D',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },
  rankSubtitle: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  cityBadge: {
    width: 72,
    borderRadius: 16,
    paddingVertical: 10,
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    alignItems: 'center',
  },
  cityBadgeValue: {
    color: '#14532D',
    fontSize: 20,
    fontWeight: '900',
  },
  cityBadgeLabel: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 2,
  },
  statCardBlue:   { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' },
  statCardYellow: { backgroundColor: '#FEFCE8', borderColor: '#FDE047' },
  statCardGreen:  { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  statEmoji: { fontSize: 18 },
  statValue:      { fontSize: 18, fontWeight: '900' },
  statValueBlue:  { color: '#1D4ED8' },
  statValueYellow:{ color: '#A16207' },
  statValueGreen: { color: '#15803D' },
  statLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
  },

  // NEXT MISSION
  nextMissionCard: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  nextMissionTitle: {
    color: '#14532D',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },
  nextMissionText: {
    color: '#374151',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },

  // BUTTONS
  buttonsColumn: {
    gap: 8,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnGradient: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 8,
  },
  linkButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },

  // FOOTER
  footerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  togglePill: {
    flex: 1,
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  toggleText: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '700',
  },
  version: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
