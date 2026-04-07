import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRAINING_MODES, TrainingChoice, TrainingMode, TrainingModeId } from '../src/data/trainingModes';

type SessionState = {
  modeId: TrainingModeId;
  index: number;
  score: number;
  streak: number;
  bestStreak: number;
  selectedChoiceId: string | null;
};

const createSession = (modeId: TrainingModeId): SessionState => ({
  modeId,
  index: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  selectedChoiceId: null,
});

export default function TrainingScreen() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);

  const activeMode = useMemo(
    () => TRAINING_MODES.find((mode) => mode.id === session?.modeId) ?? null,
    [session?.modeId]
  );
  const prompt = activeMode ? activeMode.deck[session?.index ?? 0] : null;
  const isFinished = !!activeMode && !!session && session.index >= activeMode.deck.length;

  const handleStartMode = (mode: TrainingMode) => {
    setSession(createSession(mode.id));
  };

  const handleAnswer = (choice: TrainingChoice) => {
    if (!session || session.selectedChoiceId) return;

    const nextStreak = choice.isCorrect ? session.streak + 1 : 0;
    setSession({
      ...session,
      selectedChoiceId: choice.id,
      score: session.score + (choice.isCorrect ? 120 : 40),
      streak: nextStreak,
      bestStreak: Math.max(session.bestStreak, nextStreak),
    });
  };

  const handleNext = () => {
    if (!session || !activeMode) return;

    setSession((current) =>
      current
        ? {
            ...current,
            index: current.index + 1,
            selectedChoiceId: null,
          }
        : current
    );
  };

  const restartMode = () => {
    if (!activeMode) return;
    setSession(createSession(activeMode.id));
  };

  const exitToHub = () => {
    setSession(null);
  };

  return (
    <ImageBackground
      source={require('../assets/images/game/bg_menu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => (session ? exitToHub() : router.back())}>
            <Text style={styles.backText}>{session ? 'Voltar aos treinos' : 'Voltar'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Desafios Extras</Text>
        </View>

        {!session ? (
          <ScrollView contentContainerStyle={styles.hubContent} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCard}>
              <Text style={styles.heroEyebrow}>CENTRAL DE TREINO</Text>
              <Text style={styles.heroTitle}>Mais jogos curtos para treinar olho, decisao e orientacao</Text>
              <Text style={styles.heroText}>
                Entre numa rodada rapida, aprenda um conceito novo e volte mais forte para a campanha.
              </Text>
            </View>

            {TRAINING_MODES.map((mode) => (
              <View key={mode.id} style={styles.modeCard}>
                <View style={[styles.modeAccent, { backgroundColor: mode.accent }]} />
                <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeText}>{mode.description}</Text>
                <View style={styles.modeFooter}>
                  <Text style={styles.modeInfo}>{mode.deck.length} rodadas por sessao</Text>
                  <TouchableOpacity
                    style={[styles.modeButton, { borderColor: mode.accent }]}
                    onPress={() => handleStartMode(mode)}
                    activeOpacity={0.82}
                  >
                    <Text style={styles.modeButtonText}>Comecar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : isFinished && activeMode ? (
          <View style={styles.sessionWrap}>
            <View style={styles.resultCard}>
              <Text style={styles.heroEyebrow}>RELATORIO FINAL</Text>
              <Text style={styles.resultTitle}>{activeMode.title}</Text>
              <Text style={styles.resultScore}>{session.score} pontos</Text>
              <Text style={styles.resultText}>
                Melhor sequencia: x{session.bestStreak}. Voce concluiu {activeMode.deck.length} situacoes de treino.
              </Text>

              <TouchableOpacity style={styles.primaryButton} onPress={restartMode} activeOpacity={0.84}>
                <Text style={styles.primaryButtonText}>Jogar de novo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={exitToHub} activeOpacity={0.84}>
                <Text style={styles.secondaryButtonText}>Escolher outro treino</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : activeMode && prompt && session ? (
          <View style={styles.sessionWrap}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionBadge}>
                <Text style={styles.sessionBadgeText}>
                  {session.index + 1}/{activeMode.deck.length}
                </Text>
              </View>
              <View style={styles.sessionStat}>
                <Text style={styles.sessionStatValue}>{session.score}</Text>
                <Text style={styles.sessionStatLabel}>Pontos</Text>
              </View>
              <View style={styles.sessionStat}>
                <Text style={styles.sessionStatValue}>x{session.streak}</Text>
                <Text style={styles.sessionStatLabel}>Sequencia</Text>
              </View>
            </View>

            <View style={styles.promptCard}>
              <Text style={styles.modeSubtitle}>{activeMode.subtitle}</Text>
              <Text style={styles.promptTitle}>{prompt.prompt}</Text>
              <Text style={styles.promptContext}>{prompt.context}</Text>

              <View style={styles.choiceList}>
                {prompt.choices.map((choice) => {
                  const isSelected = session.selectedChoiceId === choice.id;
                  const showCorrect = session.selectedChoiceId && choice.isCorrect;

                  return (
                    <TouchableOpacity
                      key={choice.id}
                      style={[
                        styles.choiceButton,
                        isSelected && styles.choiceSelected,
                        showCorrect && styles.choiceCorrect,
                      ]}
                      onPress={() => handleAnswer(choice)}
                      disabled={!!session.selectedChoiceId}
                      activeOpacity={0.84}
                    >
                      <Text style={styles.choiceLabel}>{choice.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {session.selectedChoiceId ? (
                <>
                  <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Leitura da equipe</Text>
                    <Text style={styles.feedbackText}>
                      {prompt.choices.find((choice) => choice.id === session.selectedChoiceId)?.feedback}
                    </Text>
                    <Text style={styles.feedbackLesson}>{prompt.lesson}</Text>
                  </View>

                  <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.84}>
                    <Text style={styles.primaryButtonText}>
                      {session.index === activeMode.deck.length - 1 ? 'Ver resultado' : 'Proxima situacao'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 11, 10, 0.38)',
  },
  safe: { flex: 1, alignItems: 'stretch', paddingHorizontal: 18, paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(246, 240, 226, 0.92)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
  },
  backText: {
    color: '#3B2F1E',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFF7E5',
    fontSize: 22,
    fontWeight: '900',
  },
  hubContent: {
    width: '100%',
    alignItems: 'stretch',
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    width: '100%',
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(246, 240, 226, 0.96)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    marginBottom: 14,
  },
  heroEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#241C13',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 4,
  },
  heroText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  modeCard: {
    width: '100%',
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'rgba(255, 249, 238, 0.96)',
    borderWidth: 1,
    borderColor: '#E0D5BF',
    marginBottom: 12,
  },
  modeAccent: {
    width: 48,
    height: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  modeSubtitle: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modeTitle: {
    color: '#241C13',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  modeText: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  modeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  modeInfo: {
    color: '#756245',
    fontSize: 12,
    fontWeight: '600',
  },
  modeButton: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3EAD7',
    borderWidth: 1.5,
  },
  modeButtonText: {
    color: '#2C241A',
    fontSize: 13,
    fontWeight: '800',
  },
  sessionWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  sessionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sessionBadge: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(246, 240, 226, 0.94)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
  },
  sessionBadgeText: {
    color: '#3B2F1E',
    fontSize: 15,
    fontWeight: '900',
  },
  sessionStat: {
    minWidth: 86,
    borderRadius: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(246, 240, 226, 0.94)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    alignItems: 'center',
  },
  sessionStatValue: {
    color: '#241C13',
    fontSize: 15,
    fontWeight: '900',
  },
  sessionStatLabel: {
    color: '#756245',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  promptCard: {
    width: '100%',
    borderRadius: 24,
    padding: 18,
    backgroundColor: 'rgba(246, 240, 226, 0.98)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
    gap: 12,
  },
  promptTitle: {
    color: '#241C13',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  promptContext: {
    color: '#5B4D3B',
    fontSize: 13,
    lineHeight: 20,
  },
  choiceList: {
    gap: 10,
  },
  choiceButton: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D8CCB6',
  },
  choiceSelected: {
    borderColor: '#8D7443',
    backgroundColor: '#F4EAD5',
  },
  choiceCorrect: {
    borderColor: '#5B7F63',
    backgroundColor: '#EBF3EA',
  },
  choiceLabel: {
    color: '#2C241A',
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#E0D5BF',
  },
  feedbackTitle: {
    color: '#2D2318',
    fontSize: 12,
    fontWeight: '800',
  },
  feedbackText: {
    color: '#4B4032',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  feedbackLesson: {
    color: '#756245',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8DFC8',
    borderWidth: 1.5,
    borderColor: '#8D7443',
  },
  primaryButtonText: {
    color: '#2C241A',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 249, 238, 0.88)',
    borderWidth: 1,
    borderColor: '#D6CAB2',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#5B4D3B',
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    backgroundColor: 'rgba(246, 240, 226, 0.98)',
    borderWidth: 1,
    borderColor: '#CCBEA3',
  },
  resultTitle: {
    color: '#241C13',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  resultScore: {
    color: '#486B7B',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 14,
  },
  resultText: {
    color: '#5B4D3B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 18,
  },
});
