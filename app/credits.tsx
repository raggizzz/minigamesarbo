// ============================================
// ArboGame — Credits Screen
// ============================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GameButton } from '../src/components/ui/GameButton';

const CREDITS = [
  { title: 'Desenvolvimento', items: ['ArboGame Team'] },
  { title: 'Design & Arte', items: ['Ilustrações originais para o jogo'] },
  { title: 'Conteúdo Educacional', items: ['Baseado em materiais do', 'Ministério da Saúde'] },
  { title: 'Tecnologia', items: ['React Native + Expo', 'TypeScript', 'Zustand'] },
  { title: 'Fontes de Informação', items: ['Fiocruz', 'OMS - Arboviroses', 'SUS - Guia de Vigilância'] },
  { title: 'Agradecimentos', items: ['A todos que combatem o mosquito', 'diariamente em suas comunidades 💚'] },
];

export default function CreditsScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_menu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>⭐ Créditos</Text>

        <Image
          source={require('../assets/images/game/character_agent.png')}
          style={styles.character}
          resizeMode="contain"
        />

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {CREDITS.map((section, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(i * 120).duration(300)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, j) => (
                  <Text key={j} style={styles.sectionItem}>{item}</Text>
                ))}
              </View>
            </Animated.View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Feito com 💚 para a saúde pública</Text>
            <Text style={styles.footerVersion}>ArboGame v1.0</Text>
          </View>
        </ScrollView>

        <View style={styles.btnWrap}>
          <GameButton title="← Voltar" onPress={() => router.back()} variant="ghost" size="md" fullWidth />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: 20 },
  title: {
    fontSize: 28, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  character: { width: 80, height: 80, alignSelf: 'center', marginBottom: 12 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20, gap: 12 },
  section: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: { color: '#FBBF24', fontSize: 14, fontWeight: '800', marginBottom: 6, letterSpacing: 0.5 },
  sectionItem: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 20 },
  footer: { alignItems: 'center', marginTop: 16, paddingVertical: 16 },
  footerText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  footerVersion: { color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 4 },
  btnWrap: { maxWidth: 300, width: '100%', alignSelf: 'center', marginTop: 8 },
});
