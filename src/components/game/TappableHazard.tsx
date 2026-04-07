// ============================================
// ArboGame â€” Scene Hotspot
// Educational field marker with grounded action sheet
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
  note: string;
  accent: string;
  tint: string;
}

const ACTIONS: ActionSpec[] = [
  {
    type: 'tampar',
    icon: 'T',
    label: 'Tampar recipiente',
    note: 'Fechar a abertura para impedir nova agua exposta.',
    accent: '#486B7B',
    tint: '#E8F0F3',
  },
  {
    type: 'esvaziar',
    icon: 'E',
    label: 'Esvaziar agua',
    note: 'Remover a agua parada e deixar o local seco.',
    accent: '#5B7F63',
    tint: '#EBF3EA',
  },
  {
    type: 'limpar',
    icon: 'L',
    label: 'Limpar o foco',
    note: 'Higienizar para nao deixar resquicios de criadouro.',
    accent: '#8A6A3E',
    tint: '#F6EFE2',
  },
  {
    type: 'reportar',
    icon: 'R',
    label: 'Reportar risco',
    note: 'Acionar um adulto ou equipe para tratar o local.',
    accent: '#8B4C45',
    tint: '#F7ECE9',
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
  const compact = containerWidth <= 360 || containerHeight <= 360;

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.55);

  React.useEffect(() => {
    if (!hazard.solved) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.28, { duration: 1100, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.08, { duration: 1100 }),
          withTiming(0.55, { duration: 0 })
        ),
        -1
      );
    }
  }, [hazard.solved, ringOpacity, ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const size = compact ? 50 : 58;
  const x = hazard.position.x * containerWidth - size / 2;
  const y = hazard.position.y * containerHeight - size / 2;
  const popupWidth = Math.min(compact ? 210 : 236, Math.max(188, containerWidth - 18));
  const popupHeightEstimate = compact ? 248 : 282;
  const spaceAbove = y;
  const spaceBelow = containerHeight - (y + size);
  const openBelow = spaceAbove < popupHeightEstimate * 0.78 || spaceBelow > spaceAbove;
  const popupLeftEdge = x + size / 2 - popupWidth / 2;
  const popupRightEdge = popupLeftEdge + popupWidth;
  let popupTranslateX = 0;

  if (popupLeftEdge < 8) {
    popupTranslateX = 8 - popupLeftEdge;
  } else if (popupRightEdge > containerWidth - 8) {
    popupTranslateX = (containerWidth - 8) - popupRightEdge;
  }

  if (hazard.solved) {
    return (
      <Animated.View
        entering={ZoomIn.springify()}
        style={[styles.hotspot, { left: x, top: y, width: size, height: size }]}
      >
        <View style={styles.solvedDot}>
          <Text style={styles.solvedCheck}>OK</Text>
        </View>
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
      <Animated.View style={[styles.pulseRing, ringStyle]} />

      <TouchableOpacity
        style={styles.tapTarget}
        onPress={() => setShowActions((value) => !value)}
        activeOpacity={0.78}
      >
        <View style={styles.markerCore}>
          <Text style={styles.markerWarning}>!</Text>
        </View>
      </TouchableOpacity>

      {showActions ? (
        <View style={styles.floatingLabel}>
          <Text style={styles.labelText}>{hazard.label}</Text>
        </View>
      ) : null}

      {showActions ? (
        <Animated.View
          entering={ZoomIn.springify().duration(220)}
          pointerEvents="box-none"
          style={[
            styles.actionPopup,
            openBelow ? styles.actionPopupBelow : styles.actionPopupAbove,
            { transform: [{ translateX: popupTranslateX }] },
          ]}
        >
          <View style={[styles.popupInner, compact && styles.popupInnerCompact, { width: popupWidth }]}>
            <View style={styles.popupHeader}>
              <View style={styles.popupHeaderCopy}>
                <Text style={styles.popupEyebrow}>FICHA DE INSPECAO</Text>
                <Text style={[styles.popupTitle, compact && styles.popupTitleCompact]}>{hazard.label}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowActions(false)} style={styles.closeBtn}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.popupDescription, compact && styles.popupDescriptionCompact]}>{hazard.description}</Text>
            <Text style={[styles.popupPrompt, compact && styles.popupPromptCompact]}>Qual medida preventiva resolve esse foco?</Text>

            <View style={styles.popupActions}>
              {ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.type}
                  style={[styles.actionBtn, compact && styles.actionBtnCompact, { borderColor: action.accent }]}
                  onPress={() => {
                    setShowActions(false);
                    onAction(hazard.id, action.type);
                  }}
                  activeOpacity={0.82}
                >
                  <View style={[styles.actionBadge, compact && styles.actionBadgeCompact, { backgroundColor: action.tint, borderColor: action.accent }]}>
                    <Text style={[styles.actionBadgeText, { color: action.accent }]}>{action.icon}</Text>
                  </View>
                  <View style={styles.actionCopy}>
                    <Text style={[styles.actionLabel, compact && styles.actionLabelCompact]}>{action.label}</Text>
                    <Text style={[styles.actionNote, compact && styles.actionNoteCompact]}>{action.note}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  pulseRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.6,
    borderColor: '#B17732',
    borderStyle: 'dashed',
  },
  tapTarget: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCore: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8EDD2',
    borderWidth: 2,
    borderColor: '#B17732',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  markerWarning: {
    color: '#7A4B17',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  floatingLabel: {
    position: 'absolute',
    top: -24,
    backgroundColor: '#F6ECD8',
    borderWidth: 1,
    borderColor: '#B59B6A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 10,
  },
  labelText: {
    color: '#32281C',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  solvedDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E7F0E4',
    borderWidth: 1.5,
    borderColor: '#6E8A67',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solvedCheck: {
    fontSize: 11,
    fontWeight: '900',
    color: '#395441',
    letterSpacing: 0.4,
  },
  actionPopup: {
    position: 'absolute',
    zIndex: 220,
    alignItems: 'center',
  },
  actionPopupAbove: {
    bottom: 70,
  },
  actionPopupBelow: {
    top: 70,
  },
  popupInner: {
    backgroundColor: '#F7F1E4',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1C3A7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 30,
    zIndex: 240,
    gap: 8,
  },
  popupInnerCompact: {
    borderRadius: 16,
    padding: 12,
    gap: 7,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  popupHeaderCopy: {
    flex: 1,
  },
  popupEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  popupTitle: {
    color: '#1F2933',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  popupTitleCompact: {
    fontSize: 15,
  },
  closeBtn: {
    paddingVertical: 2,
  },
  closeText: {
    color: '#7C6A4A',
    fontSize: 11,
    fontWeight: '700',
  },
  popupDescription: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 17,
  },
  popupDescriptionCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
  popupPrompt: {
    color: '#27313B',
    fontSize: 12,
    fontWeight: '800',
  },
  popupPromptCompact: {
    fontSize: 11,
  },
  popupActions: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  actionBtnCompact: {
    gap: 8,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 9,
  },
  actionBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeCompact: {
    width: 30,
    height: 30,
    borderRadius: 9,
  },
  actionBadgeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  actionCopy: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    color: '#1F2933',
    fontSize: 12,
    fontWeight: '800',
  },
  actionLabelCompact: {
    fontSize: 11,
  },
  actionNote: {
    color: '#5C6670',
    fontSize: 11,
    lineHeight: 15,
  },
  actionNoteCompact: {
    fontSize: 9,
    lineHeight: 12,
  },
});
