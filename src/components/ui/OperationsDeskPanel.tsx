import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DeskStat {
  label: string;
  value: string;
}

interface OperationsDeskPanelProps {
  levelName: string;
  district: string;
  missionProgress: string;
  objective: string;
  supportTip: string;
  educationalMessage: string;
  top: number;
  stats: DeskStat[];
  compact?: boolean;
}

export const OperationsDeskPanel: React.FC<OperationsDeskPanelProps> = ({
  levelName,
  district,
  missionProgress,
  objective,
  stats,
  compact = false,
}) => {
  return (
    <View pointerEvents="none" style={[styles.wrapper, compact && styles.wrapperCompact]}>
      <View style={[styles.card, compact && styles.cardCompact]}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>MESA DE OPERACAO</Text>
            <Text numberOfLines={1} style={[styles.title, compact && styles.titleCompact]}>
              {levelName}
            </Text>
            {!compact ? (
              <Text numberOfLines={1} style={styles.subtitle}>{district}</Text>
            ) : null}
          </View>
          <View style={[styles.stamp, compact && styles.stampCompact]}>
            <Text style={styles.stampText}>CAMPO</Text>
          </View>
        </View>

        <View style={[styles.progressBand, compact && styles.progressBandCompact]}>
          <Text style={styles.progressLabel}>Andamento em campo</Text>
          <Text numberOfLines={compact ? 1 : 2} style={[styles.progressValue, compact && styles.progressValueCompact]}>
            {missionProgress || objective}
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statChip, compact && styles.statChipCompact]}>
              <Text style={[styles.statValue, compact && styles.statValueCompact]}>{stat.value}</Text>
              <Text style={[styles.statLabel, compact && styles.statLabelCompact]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    zIndex: 6,
  },
  wrapperCompact: {
    left: 8,
    right: 8,
    bottom: 8,
  },
  card: {
    backgroundColor: 'rgba(246, 240, 226, 0.98)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCBEA3',
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  cardCompact: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: '#7C6A4A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  title: {
    color: '#241C13',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  titleCompact: {
    fontSize: 14,
  },
  subtitle: {
    color: '#6A5A43',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  stamp: {
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BAA27A',
    backgroundColor: '#E8DFC8',
  },
  stampCompact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  stampText: {
    color: '#6E5737',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  progressBand: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#E0D5BF',
  },
  progressBandCompact: {
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  progressLabel: {
    color: '#7C6A4A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressValue: {
    color: '#33291E',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 15,
  },
  progressValueCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: '#EFE4CA',
    borderWidth: 1,
    borderColor: '#D0B986',
    alignItems: 'center',
  },
  statChipCompact: {
    borderRadius: 11,
    paddingVertical: 7,
  },
  statValue: {
    color: '#3A2E1E',
    fontSize: 13,
    fontWeight: '900',
  },
  statValueCompact: {
    fontSize: 12,
  },
  statLabel: {
    color: '#756245',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  statLabelCompact: {
    fontSize: 8,
  },
});
