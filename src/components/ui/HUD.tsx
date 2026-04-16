// ============================================
// ArboGame - HUD (Heads-Up Display)
// Compact responsive status bar
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
        withTiming(1.18, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
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
  const statusLine = missionProgress ? `${objective}  ·  ${missionProgress}` : objective;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.46)', 'rgba(0,0,0,0)']}
        style={[styles.topGradient, compact && styles.topGradientCompact]}
      />

      {/* LINHA PRINCIPAL */}
      <View style={[styles.mainRow, compact && styles.mainRowCompact]}>
        <TouchableOpacity
          style={[styles.pauseBtn, compact && styles.pauseBtnCompact]}
          onPress={onPause}
          activeOpacity={0.7}
        >
          <Text style={styles.pauseIcon}>⏸</Text>
        </TouchableOpacity>

        {/* TEMPO */}
        <View style={[styles.hudChip, compact && styles.hudChipCompact, isLowTime && styles.hudChipDanger]}>
          <Text style={[styles.chipIcon, compact && styles.chipIconCompact]}>⏱</Text>
          <Text style={[styles.chipValue, compact && styles.chipValueCompact, isLowTime && styles.chipValueDanger]}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>

        {/* VIDAS */}
        <View style={styles.livesContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} filled={i < lives} compact={compact} />
          ))}
        </View>

        {/* SCORE */}
        <View style={[styles.hudChip, compact && styles.hudChipCompact]}>
          <Text style={[styles.chipIcon, compact && styles.chipIconCompact]}>💎</Text>
          <Text style={[styles.chipValue, compact && styles.chipValueCompact]}>{score}</Text>
        </View>
      </View>

      {/* COMBO + INFESTAÇÃO na mesma linha */}
      {(combo >= 2 || infestationLevel !== undefined) ? (
        <View style={[styles.secondRow, compact && styles.secondRowCompact]}>
          {combo >= 2 ? (
            <View style={styles.comboPill}>
              <LinearGradient
                colors={['rgba(251,191,36,0.28)', 'rgba(251,191,36,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.comboPillGradient}
              >
                <Text style={[styles.comboText, compact && styles.comboTextCompact]}>🔥 x{combo} COMBO</Text>
              </LinearGradient>
            </View>
          ) : null}

          {infestationLevel !== undefined ? (
            <View style={[styles.infestRow, compact && styles.infestRowCompact]}>
              <Text style={[styles.infestLabel, compact && styles.infestLabelCompact]}>🦟</Text>
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
              <Text style={[styles.infestPct, compact && styles.infestPctCompact]}>
                {Math.round(infestationLevel)}%
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* BARRA DE STATUS (objetivo + progresso) */}
      <View style={[styles.statusRibbon, compact && styles.statusRibbonCompact]}>
        <Text numberOfLines={1} style={[styles.statusText, compact && styles.statusTextCompact]}>
          🎯 {statusLine}
        </Text>
      </View>
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
    height: 90,
  },
  topGradientCompact: {
    height: 68,
  },

  // LINHA PRINCIPAL
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mainRowCompact: {
    gap: 5,
  },
  pauseBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtnCompact: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  pauseIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hudChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  hudChipCompact: {
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hudChipDanger: {
    borderColor: 'rgba(239,68,68,0.6)',
    backgroundColor: 'rgba(239,68,68,0.18)',
  },
  chipIcon: {
    fontSize: 13,
  },
  chipIconCompact: {
    fontSize: 11,
  },
  chipValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  chipValueCompact: {
    fontSize: 13,
  },
  chipValueDanger: {
    color: '#FCA5A5',
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  heartIcon: {
    fontSize: 20,
  },
  heartIconCompact: {
    fontSize: 17,
  },

  // LINHA SECUNDÁRIA (combo + infestação)
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  secondRowCompact: {
    marginTop: 3,
    gap: 6,
  },
  comboPill: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  comboPillGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  comboText: {
    color: '#FCD34D',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  comboTextCompact: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  infestRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infestRowCompact: {
    gap: 4,
  },
  infestLabel: {
    fontSize: 13,
  },
  infestLabelCompact: {
    fontSize: 11,
  },
  barOuter: {
    flex: 1,
    height: 7,
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
  infestPct: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '700',
    width: 30,
    textAlign: 'right',
  },
  infestPctCompact: {
    fontSize: 10,
    width: 26,
  },

  // STATUS RIBBON (objetivo + progresso fundidos)
  statusRibbon: {
    marginTop: 5,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.36)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusRibbonCompact: {
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTextCompact: {
    fontSize: 10,
  },
});
