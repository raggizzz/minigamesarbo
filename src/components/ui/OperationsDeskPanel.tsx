import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  stats: DeskStat[];
  compact?: boolean;
}

export const OperationsDeskPanel: React.FC<OperationsDeskPanelProps> = ({
  missionProgress,
  objective,
  stats,
  compact = false,
}) => {
  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        style={styles.fadeIn}
        pointerEvents="none"
      />
      <View style={[styles.card, compact && styles.cardCompact]}>
        {/* PROGRESSO */}
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, compact && styles.progressTextCompact]} numberOfLines={1}>
            📡 {missionProgress || objective}
          </Text>
        </View>

        {/* STATS */}
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
    left: 0,
    right: 0,
    bottom: 0,
  },
  fadeIn: {
    height: 40,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(10,10,14,0.88)',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cardCompact: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 6,
  },

  progressRow: {
    alignItems: 'center',
  },
  progressText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressTextCompact: {
    fontSize: 11,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  statChipCompact: {
    borderRadius: 10,
    paddingVertical: 7,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  statValueCompact: {
    fontSize: 13,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  statLabelCompact: {
    fontSize: 8,
  },
});
