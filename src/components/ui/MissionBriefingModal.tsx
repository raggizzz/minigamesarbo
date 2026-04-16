import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { LevelConfig } from '../../types/game';
import { getThreatPalette } from '../../data/campaign';

interface MissionBriefingModalProps {
  level: LevelConfig;
  visible: boolean;
  onStart: () => void;
}

const THREAT_COLORS: Record<string, [string, string]> = {
  Baixa:    ['#22C55E', '#16A34A'],
  Media:    ['#3B82F6', '#2563EB'],
  Alta:     ['#F59E0B', '#D97706'],
  Crítica:  ['#EF4444', '#DC2626'],
};

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  level,
  visible,
  onStart,
}) => {
  if (!visible) return null;

  const threat = getThreatPalette(level.threatLevel);
  const threatColor = threat.colors[0];
  const [gradStart, gradEnd] = THREAT_COLORS[level.threatLevel] ?? ['#22C55E', '#16A34A'];

  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.overlay}>
      <View style={styles.scrim} />

      <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.cardWrapper}>
        <ScrollView
          contentContainerStyle={styles.card}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.eyebrow}>🗂 PLANO DE CAMPO</Text>
              <Text style={styles.recordId}>Missão {String(level.id).padStart(2, '0')}</Text>
            </View>
            <LinearGradient colors={[gradStart, gradEnd]} style={styles.sealBox}>
              <Text style={styles.sealText}>VS</Text>
            </LinearGradient>
          </View>

          {/* TÍTULO */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{level.name}</Text>
            <Text style={styles.subtitle}>📍 {level.district}</Text>
          </View>

          {/* THREAT + BADGE */}
          <View style={styles.metaRow}>
            <View style={[styles.threatChip, { borderColor: threatColor, backgroundColor: threatColor + '18' }]}>
              <View style={[styles.threatDot, { backgroundColor: threatColor }]} />
              <Text style={[styles.threatText, { color: threatColor }]}>Ameaça {level.threatLevel}</Text>
            </View>
            <View style={styles.badgeChip}>
              <Text style={styles.badgeText}>🏅 {level.badge.name}</Text>
            </View>
          </View>

          {/* BRIEFING */}
          <Text style={styles.briefing}>{level.briefing}</Text>

          {/* MISSÃO PRINCIPAL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Missão principal</Text>
            <Text style={styles.sectionText}>{level.objective}</Text>
          </View>

          {/* DESAFIO EXTRA */}
          <View style={styles.sectionBonus}>
            <Text style={styles.sectionTitle}>⭐ Desafio extra</Text>
            <Text style={styles.sectionText}>
              {level.bonusObjective.title}: {level.bonusObjective.description}
            </Text>
          </View>

          {/* DICA */}
          <View style={styles.tipRow}>
            <Text style={styles.tipText}>💡 {level.supportTip}</Text>
          </View>

          {/* BOTÃO INICIAR */}
          <TouchableOpacity
            style={styles.startButtonOuter}
            onPress={onStart}
            activeOpacity={0.86}
          >
            <LinearGradient
              colors={[gradStart, gradEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>🚀  Iniciar vistoria</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
    zIndex: 60,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '92%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    gap: 14,
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  eyebrow: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  recordId: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sealBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // TÍTULO
  titleBlock: {
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },

  // META
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  threatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  threatDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  threatText: {
    fontSize: 12,
    fontWeight: '800',
  },
  badgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  badgeText: {
    color: '#14532D',
    fontSize: 12,
    fontWeight: '700',
  },

  // BRIEFING
  briefing: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
  },

  // SEÇÕES
  section: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  sectionBonus: {
    backgroundColor: '#FEFCE8',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 20,
  },

  // DICA
  tipRow: {
    backgroundColor: '#ECFEFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },
  tipText: {
    color: '#0E7490',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  // BOTÃO
  startButtonOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 2,
  },
  startButtonGradient: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
