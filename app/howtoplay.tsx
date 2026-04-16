// ============================================
// ArboGame — How to Play Screen
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameButton } from '../src/components/ui/GameButton';

const INSTRUCTIONS = [
  { emoji: '👆', title: 'Toque nos focos', desc: 'Encontre criadouros do mosquito e toque neles para agir.' },
  { emoji: '🔧', title: 'Escolha a ação', desc: 'Tampar, esvaziar, limpar ou reportar — cada foco tem uma solução!' },
  { emoji: '⏱️', title: 'Contra o relógio', desc: 'Complete antes do tempo acabar para ganhar mais estrelas.' },
  { emoji: '❤️', title: 'Não erre!', desc: 'Você tem 3 vidas. Ações erradas custam uma vida.' },
  { emoji: '🔥', title: 'Combos', desc: 'Acerte várias seguidas para ganhar bônus de combo!' },
  { emoji: '📋', title: 'Quiz', desc: 'No nível 3, teste seus conhecimentos sobre arboviroses.' },
  { emoji: '🗺️', title: 'Mapa', desc: 'Nos níveis avançados, explore o bairro e inspecione locais.' },
  { emoji: '⭐', title: 'Estrelas', desc: 'Ganhe até 3 estrelas por nível. Tente completar tudo!' },
];

export default function HowToPlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/game/bg_menu.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>📖 Como Jogar</Text>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {INSTRUCTIONS.map((item, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(i * 100).duration(300)}>
              <View style={styles.card}>
                <View style={styles.emojiCircle}>
                  <Text style={styles.cardEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.btnWrap}>
          <GameButton title="← Voltar" onPress={() => router.back()} variant="ghost" size="md" fullWidth />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1, padding: 20 },
  title: {
    fontSize: 28, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 16,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  scroll: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 20, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  emojiCircle: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardEmoji: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  cardDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 3, lineHeight: 19 },
  btnWrap: { maxWidth: 300, width: '100%', alignSelf: 'center', marginTop: 8 },
});
