// ============================================
// ArboGame - Quiz Card (Level 3)
// Triage sheet with educational feedback
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
import { LinearGradient } from 'expo-linear-gradient';
import { QuizOption, QuizQuestion } from '../../types/game';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

const CATEGORY_META: Record<QuizQuestion['category'], { label: string; emoji: string; color: string; bg: string }> = {
  sintoma:   { label: 'Sinais Clínicos', emoji: '🩺', color: '#0E7490', bg: '#ECFEFF' },
  prevencao: { label: 'Prevenção',       emoji: '🛡️', color: '#16A34A', bg: '#F0FDF4' },
  acao:      { label: 'Conduta',         emoji: '⚡', color: '#D97706', bg: '#FFFBEB' },
  alerta:    { label: 'Alerta',          emoji: '🚨', color: '#DC2626', bg: '#FFF1F2' },
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

  const meta = CATEGORY_META[question.category];

  const handleSelect = (option: QuizOption) => {
    if (showResult) return;

    setSelectedId(option.id);
    setShowResult(true);

    scale.value = withSequence(
      withSpring(0.97, { damping: 11 }),
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
      return selectedId === option.id ? styles.optionSelected : styles.optionDefault;
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

  const progressPct = (questionNumber / totalQuestions) * 100;

  return (
    <Animated.View entering={SlideInRight.duration(280)} style={[styles.container, cardStyle]}>
      <View style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={[styles.categoryChip, { backgroundColor: meta.bg, borderColor: meta.color }]}>
            <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
            <Text style={[styles.categoryText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <View style={styles.progressChip}>
            <Text style={styles.progressChipText}>{questionNumber}/{totalQuestions}</Text>
          </View>
        </View>

        {/* BARRA DE PROGRESSO */}
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressPct}%` }]}
          />
        </View>

        {/* PERGUNTA */}
        <View style={styles.questionBlock}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* OPÇÕES */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, getOptionStyle(option)]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.78}
              disabled={showResult}
            >
              <View style={[
                styles.optionIndex,
                showResult && option.isCorrect && styles.optionIndexCorrect,
                showResult && selectedId === option.id && !option.isCorrect && styles.optionIndexWrong,
              ]}>
                <Text style={styles.optionIndexText}>
                  {showResult && option.isCorrect ? '✓' : showResult && selectedId === option.id && !option.isCorrect ? '✗' : String(index + 1)}
                </Text>
              </View>
              <Text style={[styles.optionText, getOptionTextStyle(option)]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EXPLICAÇÃO OU DICA */}
        {showResult ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.explanationBand,
              question.options.find((o) => o.id === selectedId)?.isCorrect
                ? styles.explanationBandCorrect
                : styles.explanationBandWrong,
            ]}
          >
            <Text style={styles.explanationTitle}>
              {question.options.find((o) => o.id === selectedId)?.isCorrect ? '✅ Correto!' : '❌ Atenção!'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </Animated.View>
        ) : (
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              💡 Escolha a orientação mais segura para a comunidade.
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sheet: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  categoryEmoji: {
    fontSize: 13,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  progressChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressChipText: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '800',
  },

  // BARRA
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  // PERGUNTA
  questionBlock: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  questionText: {
    color: '#111827',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
    textAlign: 'center',
  },

  // OPÇÕES
  optionsContainer: {
    gap: 7,
  },
  option: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionDefault: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  optionCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF1F2',
  },
  optionIndex: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionIndexCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  optionIndexWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionIndexText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '900',
  },
  optionText: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  optionTextCorrect: {
    flex: 1,
    color: '#15803D',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },
  optionTextWrong: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
  },

  // EXPLICAÇÃO
  explanationBand: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    borderWidth: 1.5,
  },
  explanationBandCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  explanationBandWrong: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FCA5A5',
  },
  explanationTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },
  explanationText: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  footerNote: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  footerNoteText: {
    color: '#92400E',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
});
