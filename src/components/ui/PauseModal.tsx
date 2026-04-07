// ============================================
// ArboGame — Pause Modal
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../styles/theme';
import { GameButton } from './GameButton';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
  onMenu,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.pauseIcon}>⏸️</Text>
          <Text style={styles.title}>Jogo Pausado</Text>

          <View style={styles.buttons}>
            <GameButton
              title="Continuar"
              emoji="▶️"
              onPress={onResume}
              variant="primary"
              size="lg"
              fullWidth
            />
            <GameButton
              title="Reiniciar"
              emoji="🔄"
              onPress={onRestart}
              variant="secondary"
              size="md"
              fullWidth
            />
            <GameButton
              title="Voltar ao Menu"
              emoji="🏠"
              onPress={onMenu}
              variant="ghost"
              size="md"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xxl,
  },
  container: {
    backgroundColor: COLORS.menuBg,
    borderRadius: SIZES.radiusXL,
    padding: SIZES.xxxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...SHADOWS.large,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pauseIcon: {
    fontSize: 48,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.text3XL,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SIZES.xxl,
  },
  buttons: {
    width: '100%',
    gap: SIZES.md,
  },
});
