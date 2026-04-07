// ============================================
// ArboGame â€” Defeat Screen with illustrated art
// ============================================

import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getLevelConfig } from '../src/data/levels';
import { GameButton } from '../src/components/ui/GameButton';
import { LevelId } from '../src/types/game';

const DEFEAT_REASONS: Record<string, { emoji: string; title: string; message: string }> = {
  lives: {
    emoji: '💔',
    title: 'Sem vidas!',
    message: 'A equipe cometeu erros demais e a operacao foi interrompida.',
  },
  time: {
    emoji: '⏰',
    title: 'Tempo esgotado!',
    message: 'A resposta foi lenta demais e o mosquito ganhou vantagem.',
  },
  infestation: {
    emoji: '🦟',
    title: 'Infestacao fora de controle!',
    message: 'A pressao subiu alem do limite seguro para o bairro.',
  },
  knowledge: {
    emoji: '🩺',
    title: 'Triagem insuficiente!',
    message: 'A precisao clinica ficou abaixo do minimo exigido para liberar a comunidade.',
  },
};

export default function DefeatScreen() {
  const params = useLocalSearchParams<{ levelId: string; reason: string }>();
  const router = useRouter();
  const levelId = parseInt(params.levelId || '1', 10) as LevelId;
  const levelConfig = getLevelConfig(levelId);
  const reason = DEFEAT_REASONS[params.reason || 'time'] || DEFEAT_REASONS.time;

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_defeat.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.32)', 'rgba(0,0,0,0.64)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.icon}>{reason.emoji}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380)} style={styles.titleContainer}>
          <Text style={styles.title}>{reason.title}</Text>
          <Text style={styles.message}>{reason.message}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(560)} style={styles.tipCard}>
          <Text style={styles.tipEyebrow}>RECOMENDACAO TATICA</Text>
          <Text style={styles.tipTitle}>{levelConfig?.bonusObjective.title}</Text>
          <Text style={styles.tipText}>{levelConfig?.supportTip}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(760)} style={styles.lessonCard}>
          <Text style={styles.lessonLabel}>Aprendizado de campo</Text>
          <Text style={styles.lessonText}>{levelConfig?.educationalMessage}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(950)} style={styles.btns}>
          <GameButton
            title="Tentar novamente"
            emoji="🔁"
            onPress={() => router.replace(`/game/${levelId}`)}
            variant="danger"
            size="lg"
            fullWidth
          />
          <GameButton
            title="Menu de niveis"
            emoji="📋"
            onPress={() => router.replace('/levels')}
            variant="ghost"
            size="md"
            fullWidth
          />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  icon: { fontSize: 70, marginBottom: 12 },
  titleContainer: { alignItems: 'center', marginBottom: 22 },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.76)',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 300,
  },
  tipCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tipEyebrow: {
    color: 'rgba(147,197,253,0.86)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  tipText: {
    color: 'rgba(226,232,240,0.72)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  lessonCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    backgroundColor: 'rgba(37,99,235,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  lessonLabel: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lessonText: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  btns: { width: '100%', maxWidth: 320, gap: 10 },
});
