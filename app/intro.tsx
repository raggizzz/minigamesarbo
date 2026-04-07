// ============================================
// ArboGame — Introduction Screen with art
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameButton } from '../src/components/ui/GameButton';
import { useGameStore } from '../src/store/gameStore';

const INTRO_SLIDES = [
  {
    emoji: '🏙️',
    title: 'A cidade está em perigo!',
    text: 'Um surto de arboviroses está se aproximando. Casos de dengue, zika e chikungunya estão aumentando...',
    gradientColors: ['rgba(239,68,68,0.2)', 'rgba(239,68,68,0.05)'] as [string, string],
  },
  {
    emoji: '🦟',
    title: 'O vilão: Aedes aegypti',
    text: 'O mosquito transmissor se reproduz em água parada. Ele pode estar mais perto do que você imagina!',
    gradientColors: ['rgba(251,191,36,0.2)', 'rgba(251,191,36,0.05)'] as [string, string],
  },
  {
    emoji: '🛡️',
    title: 'Você é a esperança!',
    text: 'Como Agente Mirim da Saúde, sua missão é percorrer a cidade, eliminar focos e proteger a comunidade.',
    gradientColors: ['rgba(34,197,94,0.2)', 'rgba(34,197,94,0.05)'] as [string, string],
  },
  {
    emoji: '🎮',
    title: 'Está pronto?',
    text: 'São 5 missões. Use seus conhecimentos, seja rápido e salve a cidade das arboviroses!',
    gradientColors: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.05)'] as [string, string],
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const setIntroSeen = useGameStore((s) => s.setIntroSeen);

  const slide = INTRO_SLIDES[currentSlide];
  const isLast = currentSlide === INTRO_SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      setIntroSeen();
      router.replace('/levels');
    } else {
      setCurrentSlide((s) => s + 1);
    }
  };

  const handleSkip = () => {
    setIntroSeen();
    router.replace('/levels');
  };

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_menu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Skip */}
        <View style={styles.skipContainer}>
          <GameButton title="Pular ⏩" onPress={handleSkip} variant="ghost" size="sm" />
        </View>

        {/* Character */}
        <Image
          source={require('../assets/images/game/character_agent.png')}
          style={styles.character}
          resizeMode="contain"
        />

        {/* Slide */}
        <Animated.View key={currentSlide} entering={SlideInRight.duration(400)} style={styles.slideContainer}>
          <LinearGradient colors={slide.gradientColors} style={styles.slideCard}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideText}>{slide.text}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {INTRO_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
          ))}
        </View>

        {/* Next */}
        <View style={styles.buttonContainer}>
          <GameButton
            title={isLast ? 'Começar Missão! 🚀' : 'Próximo →'}
            onPress={handleNext}
            variant={isLast ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24 },
  skipContainer: { alignItems: 'flex-end' },
  character: { width: 100, height: 100, alignSelf: 'center', marginTop: 10 },
  slideContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  slideCard: {
    width: '100%', maxWidth: 340, borderRadius: 24, padding: 30, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  slideEmoji: { fontSize: 64, marginBottom: 16 },
  slideTitle: {
    fontSize: 26, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  slideText: {
    fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 26, maxWidth: 280,
  },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: '#22C55E', width: 24 },
  buttonContainer: { maxWidth: 300, width: '100%', alignSelf: 'center' },
});
