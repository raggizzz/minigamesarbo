// ============================================
// ArboGame – Scene Hotspot
// Educational field marker – dark overlay UI
// ============================================

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ActionType, Hazard } from '../../types/game';

interface ActionSpec {
  type: ActionType;
  icon: string;
  label: string;
  accent: string;
  bg: string;
  textColor: string;
}

const ACTIONS: ActionSpec[] = [
  {
    type: 'tampar',
    icon: '🔒',
    label: 'Tampar',
    accent: '#60A5FA',
    bg: 'rgba(37,99,235,0.25)',
    textColor: '#93C5FD',
  },
  {
    type: 'esvaziar',
    icon: '💧',
    label: 'Esvaziar',
    accent: '#34D399',
    bg: 'rgba(5,150,105,0.25)',
    textColor: '#6EE7B7',
  },
  {
    type: 'limpar',
    icon: '🧹',
    label: 'Limpar',
    accent: '#FCD34D',
    bg: 'rgba(180,83,9,0.25)',
    textColor: '#FDE68A',
  },
  {
    type: 'reportar',
    icon: '📣',
    label: 'Reportar',
    accent: '#F87171',
    bg: 'rgba(185,28,28,0.25)',
    textColor: '#FCA5A5',
  },
];

interface TappableHazardProps {
  hazard: Hazard;
  onAction: (hazardId: string, action: ActionType) => void;
  containerWidth: number;
  containerHeight: number;
}

export const TappableHazard: React.FC<TappableHazardProps> = ({
  hazard,
  onAction,
  containerWidth,
  containerHeight,
}) => {
  const [showActions, setShowActions] = useState(false);
  const compact = containerWidth <= 380 || containerHeight <= 380;

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.8);

  React.useEffect(() => {
    if (!hazard.solved) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.7, { duration: 850, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 850 }),
          withTiming(0.8, { duration: 0 })
        ),
        -1
      );
    }
  }, [hazard.solved, ringOpacity, ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const size = compact ? 48 : 54;
  const x = hazard.position.x * containerWidth - size / 2;
  const y = hazard.position.y * containerHeight - size / 2;

  // Popup sizing & clamping
  const popupW = Math.min(compact ? 200 : 220, containerWidth - 20);
  const popupH = compact ? 220 : 248;
  const spaceAbove = y;
  const spaceBelow = containerHeight - (y + size);
  const openBelow = spaceAbove < popupH * 0.9 || spaceBelow > spaceAbove;

  const rawLeft = x + size / 2 - popupW / 2;
  const clampedLeft = Math.max(8, Math.min(rawLeft, containerWidth - popupW - 8));
  const translateX = clampedLeft - rawLeft;

  if (hazard.solved) {
    return (
      <Animated.View
        entering={ZoomIn.springify()}
        style={[styles.hotspot, { left: x, top: y, width: size, height: size }]}
      >
        <Text style={styles.solvedEmoji}>✅</Text>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.hotspot,
        { left: x, top: y, width: size, height: size },
        showActions && styles.hotspotActive,
      ]}
    >
      {/* ANEL DE PULSO */}
      <Animated.View style={[styles.pulseRing, ringStyle]} />

      {/* BOTÃO DO MARCADOR */}
      <TouchableOpacity
        style={styles.tapTarget}
        onPress={() => setShowActions((v) => !v)}
        activeOpacity={0.75}
      >
        <View style={[styles.markerCore, showActions && styles.markerCoreActive]}>
          <Text style={styles.markerEmoji}>🦟</Text>
        </View>
      </TouchableOpacity>

      {/* POPUP ESCURO */}
      {showActions ? (
        <Animated.View
          entering={ZoomIn.springify().duration(180)}
          pointerEvents="box-none"
          style={[
            styles.popup,
            openBelow ? styles.popupBelow : styles.popupAbove,
            { width: popupW, transform: [{ translateX }] },
          ]}
        >
          {/* HEADER */}
          <View style={styles.popupHeader}>
            <View style={styles.popupHeaderLeft}>
              <Text style={styles.popupEyebrow}>🦟 FOCO IDENTIFICADO</Text>
              <Text style={[styles.popupTitle, compact && styles.popupTitleSm]} numberOfLines={1}>
                {hazard.label}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowActions(false)} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* DESCRIÇÃO COMPACTA */}
          {!compact ? (
            <Text style={styles.popupDesc} numberOfLines={2}>{hazard.description}</Text>
          ) : null}

          {/* AÇÕES – grid 2×2 */}
          <View style={styles.actionsGrid}>
            {ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.type}
                style={[styles.actionBtn, { backgroundColor: action.bg, borderColor: action.accent }]}
                onPress={() => {
                  setShowActions(false);
                  onAction(hazard.id, action.type);
                }}
                activeOpacity={0.75}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionLabel, { color: action.textColor }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  hotspot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  hotspotActive: {
    zIndex: 120,
    elevation: 40,
  },

  // ANEL
  pulseRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#EF4444',
  },

  // MARCADOR
  tapTarget: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCore: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  markerCoreActive: {
    backgroundColor: 'rgba(239,68,68,0.3)',
    borderColor: '#FCA5A5',
  },
  markerEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },

  // SOLVED
  solvedEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },

  // POPUP ESCURO
  popup: {
    position: 'absolute',
    zIndex: 220,
    borderRadius: 18,
    backgroundColor: 'rgba(8,12,20,0.93)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 30,
  },
  popupAbove: {
    bottom: 56,
  },
  popupBelow: {
    top: 56,
  },

  popupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  popupHeaderLeft: {
    flex: 1,
  },
  popupEyebrow: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  popupTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  popupTitleSm: {
    fontSize: 13,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '800',
  },

  popupDesc: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    lineHeight: 15,
  },

  // GRID 2×2
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  actionBtn: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  actionIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
});
