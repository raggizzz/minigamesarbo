import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCampaignProfile, getNextAvailableLevel } from '../src/data/campaign';
import { useGameStore } from '../src/store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const progress = useGameStore((state) => state.progress);
  const { toggleMusic, toggleSound } = useGameStore();
  const campaign = getCampaignProfile(progress);
  const nextMission = getNextAvailableLevel(progress);

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_menu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Image
              source={require('../assets/images/game/character_agent.png')}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.eyebrow}>VIGILANCIA JUVENIL</Text>
          <Text style={styles.title}>ArboGame</Text>
          <Text style={styles.subtitle}>Campanha escolar contra dengue, zika e chikungunya</Text>
        </View>

        <View style={styles.dossier}>
          <View style={styles.rankRow}>
            <View style={styles.rankCopy}>
              <Text style={styles.sectionEyebrow}>DOSSIE DA CAMPANHA</Text>
              <Text style={styles.rankTitle}>{campaign.rankTitle}</Text>
              <Text style={styles.rankSubtitle}>{campaign.rankSubtitle}</Text>
            </View>
            <View style={styles.cityBadge}>
              <Text style={styles.cityBadgeValue}>#{campaign.leaguePlacement}</Text>
              <Text style={styles.cityBadgeLabel}>cidade</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{campaign.completedLevels}/5</Text>
              <Text style={styles.statLabel}>Missoes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{campaign.totalStars}</Text>
              <Text style={styles.statLabel}>Estrelas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{campaign.badgeCount}</Text>
              <Text style={styles.statLabel}>Insignias</Text>
            </View>
          </View>

          <View style={styles.nextMissionCard}>
            <Text style={styles.sectionEyebrow}>PROXIMA OPERACAO</Text>
            <Text style={styles.nextMissionTitle}>{nextMission.name}</Text>
            <Text style={styles.nextMissionText}>
              {nextMission.district} · {nextMission.objective}
            </Text>
          </View>

          <View style={styles.buttonsColumn}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push(progress.hasSeenIntro ? '/levels' : '/intro')}
              activeOpacity={0.86}
            >
              <Text style={styles.primaryButtonText}>
                {progress.hasSeenIntro ? 'Abrir campanha' : 'Comecar campanha'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/training')}
              activeOpacity={0.86}
            >
              <Text style={styles.secondaryButtonText}>Desafios extras</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/howtoplay')}
                activeOpacity={0.82}
              >
                <Text style={styles.linkButtonText}>Como jogar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/credits')}
                activeOpacity={0.82}
              >
                <Text style={styles.linkButtonText}>Creditos</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.togglePill, progress.soundEnabled && styles.togglePillActive]}
                onPress={toggleSound}
                activeOpacity={0.82}
              >
                <Text style={styles.toggleText}>{progress.soundEnabled ? 'Som ligado' : 'Som desligado'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.togglePill, progress.musicEnabled && styles.togglePillActive]}
                onPress={toggleMusic}
                activeOpacity={0.82}
              >
                <Text style={styles.toggleText}>{progress.musicEnabled ? 'Musica ligada' : 'Musica desligada'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.version}>v1.2 operacao expandida</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 14, 13, 0.36)',
  },
  safeArea: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 8,
  },
  badge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#E8DFC8',
    backgroundColor: 'rgba(246, 240, 226, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeImage: {
    width: 76,
    height: 76,
  },
  eyebrow: {
    color: '#FFF1CF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#FFF8EA',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: 'rgba(255, 248, 234, 0.82)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 320,
  },
  dossier: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: 'rgba(246, 240, 226, 0.97)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    padding: 18,
    gap: 16,
  },
  rankRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  rankCopy: {
    flex: 1,
  },
  sectionEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rankTitle: {
    color: '#241C13',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  rankSubtitle: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  cityBadge: {
    width: 76,
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: '#EFE4CA',
    borderWidth: 1,
    borderColor: '#D0B986',
    alignItems: 'center',
  },
  cityBadgeValue: {
    color: '#3A2E1E',
    fontSize: 22,
    fontWeight: '900',
  },
  cityBadgeLabel: {
    color: '#756245',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#E0D5BF',
    alignItems: 'center',
  },
  statValue: {
    color: '#241C13',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#756245',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  nextMissionCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#DED2BA',
  },
  nextMissionTitle: {
    color: '#241C13',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  nextMissionText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  buttonsColumn: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#E8DFC8',
    borderWidth: 1.5,
    borderColor: '#8D7443',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#2C241A',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#3B2F1E',
    fontSize: 16,
    fontWeight: '800',
  },
  linkRow: {
    flexDirection: 'row',
    gap: 10,
  },
  linkButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 252, 245, 0.96)',
    borderWidth: 1,
    borderColor: '#D6CAB2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: '#5B4D3B',
    fontSize: 13,
    fontWeight: '700',
  },
  footerRow: {
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  togglePill: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#D6CAB2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: '#EFE4CA',
    borderColor: '#D0B986',
  },
  toggleText: {
    color: '#5B4D3B',
    fontSize: 11,
    fontWeight: '700',
  },
  version: {
    color: '#8A7A61',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
