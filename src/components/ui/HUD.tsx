// ============================================
// ArboGame - HUD (Heads-Up Display)
// Responsive mobile-first status bar
// ============================================

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface HUDProps {
  timeRemaining: number;
  lives: number;
  score: number;
  combo: number;
  onPause: () => void;
  objective: string;
  missionProgress?: string;
  infestationLevel?: number;
  compact?: boolean;
}

const Heart: React.FC<{ filled: boolean; compact: boolean }> = ({ filled, compact }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (!filled) return;

    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [filled, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: filled ? scale.value : 1 }],
  }));

  return (
    <Animated.Text style={[styles.heartIcon, compact && styles.heartIconCompact, style]}>
      {filled ? '❤️' : '🖤'}
    </Animated.Text>
  );
};

export const HUD: React.FC<HUDProps> = ({
  timeRemaining,
  lives,
  score,
  combo,
  onPause,
  objective,
  missionProgress,
  infestationLevel,
  compact = false,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining <= 15;
  const primaryStatus = missionProgress || objective;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.42)', 'rgba(0,0,0,0)']}
        style={[styles.topGradient, compact && styles.topGradientCompact]}
      />

      <View style={[styles.mainRow, compact && styles.mainRowCompact]}>
        <TouchableOpacity
          style={[styles.pauseBtn, compact && styles.pauseBtnCompact]}
          onPress={onPause}
          activeOpacity={0.7}
        >
          <Text style={[styles.pauseIcon, compact && styles.pauseIconCompact]}>⏸️</Text>
        </TouchableOpacity>

        <View style={[styles.hudChip, compact && styles.hudChipCompact, isLowTime && styles.hudChipDanger]}>
          <Text style={[styles.chipIcon, compact && styles.chipIconCompact]}>⏱️</Text>
          <Text style={[styles.chipValue, compact && styles.chipValueCompact, isLowTime && styles.chipValueDanger]}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>

        <View style={styles.livesContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart key={index} filled={index < lives} compact={compact} />
          ))}
        </View>

        <View style={[styles.hudChip, compact && styles.hudChipCompact]}>
          <Text style={[styles.chipIcon, compact && styles.chipIconCompact]}>💎</Text>
          <Text style={[styles.chipValue, compact && styles.chipValueCompact]}>{score}</Text>
        </View>
      </View>

      {combo >= 2 ? (
        <Animated.View style={[styles.comboContainer, compact && styles.comboContainerCompact]}>
          <LinearGradient
            colors={['rgba(255,183,0,0.2)', 'rgba(255,183,0,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.comboGradient, compact && styles.comboGradientCompact]}
          >
            <Text style={[styles.comboText, compact && styles.comboTextCompact]}>🔥 x{combo} COMBO</Text>
          </LinearGradient>
        </Animated.View>
      ) : null}

      {infestationLevel !== undefined ? (
        <View style={[styles.infestationContainer, compact && styles.infestationContainerCompact]}>
          <Text style={[styles.infestationLabel, compact && styles.infestationLabelCompact]}>🦟 Infestacao</Text>
          <View style={styles.barOuter}>
            <LinearGradient
              colors={
                infestationLevel < 50
                  ? ['#22C55E', '#16A34A']
                  : infestationLevel < 75
                    ? ['#FACC15', '#F59E0B']
                    : ['#EF4444', '#DC2626']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.barFill, { width: `${Math.min(100, infestationLevel)}%` }]}
            />
          </View>
          <Text style={[styles.infestationPct, compact && styles.infestationPctCompact]}>
            {Math.round(infestationLevel)}%
          </Text>
        </View>
      ) : null}

      <View style={[styles.objectiveRibbon, compact && styles.objectiveRibbonCompact]}>
        <Text numberOfLines={1} style={[styles.objectiveText, compact && styles.objectiveTextCompact]}>
          🎯 {compact ? primaryStatus : objective}
        </Text>
      </View>

      {!compact && missionProgress ? (
        <View style={styles.progressRibbon}>
          <Text numberOfLines={1} style={styles.progressText}>📡 {missionProgress}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  containerCompact: {
    paddingTop: 2,
    paddingHorizontal: 8,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 96,
  },
  topGradientCompact: {
    height: 70,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mainRowCompact: {
    gap: 6,
  },
  pauseBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtnCompact: {
    width: 36,
    height: 36,
    borderRadius: 11,
  },
  pauseIcon: {
    fontSize: 18,
  },
  pauseIconCompact: {
    fontSize: 16,
  },
  hudChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hudChipCompact: {
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },
  hudChipDanger: {
    borderColor: 'rgba(239,68,68,0.5)',
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  chipIcon: {
    fontSize: 14,
  },
  chipIconCompact: {
    fontSize: 12,
  },
  chipValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  chipValueCompact: {
    fontSize: 14,
  },
  chipValueDanger: {
    color: '#FCA5A5',
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  heartIcon: {
    fontSize: 20,
  },
  heartIconCompact: {
    fontSize: 18,
  },
  comboContainer: {
    marginTop: 6,
    alignItems: 'center',
  },
  comboContainerCompact: {
    marginTop: 4,
  },
  comboGradient: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,183,0,0.25)',
  },
  comboGradientCompact: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  comboText: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  comboTextCompact: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  infestationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  infestationContainerCompact: {
    gap: 6,
    marginTop: 5,
  },
  infestationLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  infestationLabelCompact: {
    fontSize: 10,
  },
  barOuter: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  infestationPct: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
  infestationPctCompact: {
    fontSize: 10,
    width: 28,
  },
  objectiveRibbon: {
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10,
  },
  objectiveRibbonCompact: {
    marginTop: 4,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  objectiveText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 11,
    fontWeight: '600',
  },
  objectiveTextCompact: {
    fontSize: 10,
    textAlign: 'center',
  },
  progressRibbon: {
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(34,197,94,0.14)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.18)',
  },
  progressText: {
    color: '#DCFCE7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
