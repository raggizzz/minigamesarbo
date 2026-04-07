import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LevelConfig } from '../../types/game';
import { getThreatPalette } from '../../data/campaign';

interface MissionBriefingModalProps {
  level: LevelConfig;
  visible: boolean;
  onStart: () => void;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  level,
  visible,
  onStart,
}) => {
  if (!visible) return null;

  const threat = getThreatPalette(level.threatLevel);
  const threatColor = threat.colors[0];

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.overlay}>
      <View style={styles.scrim} />

      <Animated.View entering={FadeInDown.delay(100).duration(350)} style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>PLANO DE CAMPO</Text>
            <Text style={styles.recordId}>Registro da missao {String(level.id).padStart(2, '0')}</Text>
          </View>
          <View style={styles.sealBox}>
            <Text style={styles.sealText}>VS</Text>
          </View>
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{level.name}</Text>
            <Text style={styles.subtitle}>{level.district}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.threatChip, { borderColor: threatColor }]}>
            <View style={[styles.threatDot, { backgroundColor: threatColor }]} />
            <Text style={styles.threatText}>Ameaca {level.threatLevel}</Text>
          </View>
          <View style={styles.badgeChip}>
            <Text style={styles.badgeText}>{level.badge.name}</Text>
          </View>
        </View>

        <Text style={styles.briefing}>{level.briefing}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missao principal</Text>
          <Text style={styles.sectionText}>{level.objective}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desafio extra</Text>
          <Text style={styles.sectionText}>
            {level.bonusObjective.title}: {level.bonusObjective.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orientacao da equipe</Text>
          <Text style={styles.sectionText}>{level.supportTip}</Text>
        </View>

        <Text style={styles.footerNote}>
          Registre a acao correta em cada foco para manter o bairro protegido.
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.86}>
          <Text style={styles.startButtonText}>Iniciar vistoria</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 60,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 23, 14, 0.62)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#F6F0E2',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#CCBEA3',
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#7C6A4A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  recordId: {
    color: '#988566',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sealBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8DFC8',
    borderWidth: 1,
    borderColor: '#BAA27A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    color: '#6E5737',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  titleRow: {
    borderTopWidth: 1,
    borderTopColor: '#DED2BA',
    paddingTop: 14,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: '#241C13',
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6A5A43',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  threatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FCF8EF',
    borderWidth: 1,
  },
  threatDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  threatText: {
    color: '#352B1E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  badgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#EFE4CA',
    borderWidth: 1,
    borderColor: '#D0B986',
  },
  badgeText: {
    color: '#5A482B',
    fontSize: 12,
    fontWeight: '700',
  },
  briefing: {
    color: '#46392A',
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#FFF9EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0D5BF',
    gap: 4,
  },
  sectionTitle: {
    color: '#2D2318',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 20,
  },
  footerNote: {
    color: '#756245',
    fontSize: 12,
    lineHeight: 18,
  },
  startButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: '#E8DFC8',
    borderWidth: 1.5,
    borderColor: '#8D7443',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#2C241A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
