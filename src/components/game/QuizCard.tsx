// ============================================
// ArboGame - Quiz Card (Level 3)
// Triage sheet with faster educational feedback
// ============================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { SIZES, SHADOWS } from '../../styles/theme';
import { QuizOption, QuizQuestion } from '../../types/game';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

const CATEGORY_LABELS: Record<QuizQuestion['category'], string> = {
  sintoma: 'Sinais clinicos',
  prevencao: 'Prevencao',
  acao: 'Conduta',
  alerta: 'Alerta',
};

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const scale = useSharedValue(1);

  const handleSelect = (option: QuizOption) => {
    if (showResult) return;

    setSelectedId(option.id);
    setShowResult(true);

    scale.value = withSequence(
      withSpring(0.98, { damping: 11 }),
      withSpring(1, { damping: 13 })
    );

    setTimeout(() => {
      onAnswer(option.isCorrect);
      setSelectedId(null);
      setShowResult(false);
    }, 1300);
  };

  const getOptionStyle = (option: QuizOption) => {
    if (!showResult) {
      return selectedId === option.id
        ? styles.optionSelected
        : styles.optionDefault;
    }

    if (option.isCorrect) return styles.optionCorrect;
    if (selectedId === option.id && !option.isCorrect) return styles.optionWrong;
    return styles.optionDefault;
  };

  const getOptionTextStyle = (option: QuizOption) => {
    if (!showResult) return styles.optionText;
    if (option.isCorrect) return styles.optionTextCorrect;
    if (selectedId === option.id && !option.isCorrect) return styles.optionTextWrong;
    return styles.optionText;
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={SlideInRight.duration(320)} style={[styles.container, cardStyle]}>
      <View style={styles.sheet}>
        <View style={styles.headerRow}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{CATEGORY_LABELS[question.category]}</Text>
          </View>
          <View style={styles.progressChip}>
            <Text style={styles.progressChipText}>{questionNumber}/{totalQuestions}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(questionNumber / totalQuestions) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.questionEyebrow}>FICHA DE TRIAGEM</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, getOptionStyle(option)]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.78}
              disabled={showResult}
            >
              <View style={styles.optionIndex}>
                <Text style={styles.optionIndexText}>{index + 1}</Text>
              </View>
              <Text style={[styles.optionText, getOptionTextStyle(option)]}>
                {option.text}
              </Text>
              {showResult && option.isCorrect ? (
                <Text style={styles.resultMarkCorrect}>OK</Text>
              ) : null}
              {showResult && selectedId === option.id && !option.isCorrect ? (
                <Text style={styles.resultMarkWrong}>X</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {showResult ? (
          <Animated.View entering={FadeIn.duration(220)} style={styles.explanationBand}>
            <Text style={styles.explanationTitle}>
              {question.options.find((option) => option.id === selectedId)?.isCorrect
                ? 'Orientacao confirmada'
                : 'Reforce o aprendizado'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </Animated.View>
        ) : (
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              Leia com calma e escolha a orientacao mais segura para a comunidade.
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sheet: {
    borderRadius: SIZES.radiusXL,
    backgroundColor: 'rgba(246, 240, 226, 0.97)',
    borderWidth: 1,
    borderColor: '#D1C3A7',
    padding: 14,
    gap: 10,
    ...SHADOWS.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F7EEDC',
    borderWidth: 1,
    borderColor: '#C8B389',
  },
  categoryText: {
    color: '#5C4A33',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  progressChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E7D9B9',
  },
  progressChipText: {
    color: '#3E2F1D',
    fontSize: 10,
    fontWeight: '900',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E9DFC9',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#9E7A42',
  },
  questionBlock: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#DED2BA',
    alignItems: 'center',
  },
  questionEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  questionText: {
    color: '#2F261B',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFDFC',
  },
  optionDefault: {
    borderColor: '#D8C9AE',
  },
  optionSelected: {
    borderColor: '#9D7A43',
    backgroundColor: '#FBF4E5',
  },
  optionCorrect: {
    borderColor: '#7F9B79',
    backgroundColor: '#EAF2E6',
  },
  optionWrong: {
    borderColor: '#B77A69',
    backgroundColor: '#F8ECE7',
  },
  optionIndex: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1E5CC',
    borderWidth: 1,
    borderColor: '#C8B389',
  },
  optionIndexText: {
    color: '#5B4A35',
    fontSize: 12,
    fontWeight: '900',
  },
  optionText: {
    flex: 1,
    color: '#2E261C',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  optionTextCorrect: {
    flex: 1,
    color: '#395441',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  optionTextWrong: {
    flex: 1,
    color: '#7B3F36',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  resultMarkCorrect: {
    color: '#395441',
    fontSize: 12,
    fontWeight: '900',
  },
  resultMarkWrong: {
    color: '#7B3F36',
    fontSize: 14,
    fontWeight: '900',
  },
  explanationBand: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#DED2BA',
    gap: 4,
  },
  explanationTitle: {
    color: '#2F261B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  explanationText: {
    color: '#564737',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  footerNote: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3E9D3',
  },
  footerNoteText: {
    color: '#5A4B37',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
});
