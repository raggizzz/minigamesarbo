// ============================================
// ArboGame — Gameplay Screen
// Full-screen responsive + scene-integrated
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, Image,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_CONSTANTS } from '../../src/styles/theme';
import { useGameStore, calculateStars } from '../../src/store/gameStore';
import { evaluateBonusObjective } from '../../src/data/campaign';
import { getLevelConfig } from '../../src/data/levels';
import { LEVEL1_HAZARDS, LEVEL2_HAZARDS, LEVEL2_SOLUTIONS, LEVEL4_MAP_POINTS } from '../../src/data/hazards';
import { getShuffledQuestions } from '../../src/data/quizQuestions';
import { HUD } from '../../src/components/ui/HUD';
import { MissionBriefingModal } from '../../src/components/ui/MissionBriefingModal';
import { OperationsDeskPanel } from '../../src/components/ui/OperationsDeskPanel';
import { PauseModal } from '../../src/components/ui/PauseModal';
import { TappableHazard } from '../../src/components/game/TappableHazard';
import { QuizCard } from '../../src/components/game/QuizCard';
import { ActionType, Hazard, LevelId, QuizQuestion } from '../../src/types/game';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Background images per level
const LEVEL_BACKGROUNDS: Record<number, any> = {
  1: require('../../assets/images/game/bg_level1.png'),
  2: require('../../assets/images/game/bg_level2.png'),
  3: require('../../assets/images/game/bg_level3.png'),
  4: require('../../assets/images/game/bg_level4.png'),
  5: require('../../assets/images/game/bg_level5.png'),
};

const LEVEL2_TOOL_META: Record<string, {
  code: string;
  note: string;
  accent: string;
  tint: string;
}> = {
  saco_lixo: {
    code: 'SL',
    note: 'Recolhe lixo e objetos que acumulam agua.',
    accent: '#7D6240',
    tint: '#F4E9D7',
  },
  tampa: {
    code: 'TP',
    note: 'Fecha recipientes que devem ficar cobertos.',
    accent: '#486B7B',
    tint: '#E8F0F3',
  },
  pa: {
    code: 'PA',
    note: 'Remove folhas, barro e entulho acumulado.',
    accent: '#8A6A3E',
    tint: '#F5ECDD',
  },
  limpeza: {
    code: 'LM',
    note: 'Escova e higieniza locais com agua parada.',
    accent: '#5B7F63',
    tint: '#EBF3EA',
  },
};

const LEVEL2_TRAY_COLLAPSED_HEIGHT = 78;
const LEVEL2_TRAY_EXPANDED_HEIGHT = 154;

// ======= LEVEL 1 GAMEPLAY — Hazards in house scene =======
const Level1Gameplay: React.FC<{
  onCorrect: () => void;
  onWrong: () => void;
  onComplete: () => void;
  onProgressChange: (label: string) => void;
  areaWidth: number;
  areaHeight: number;
}> = ({ onCorrect, onWrong, onComplete, onProgressChange, areaWidth, areaHeight }) => {
  const [hazards, setHazards] = useState<Hazard[]>(
    LEVEL1_HAZARDS.map((h) => ({ ...h, solved: false }))
  );

  useEffect(() => {
    const solvedCount = hazards.filter((hazard) => hazard.solved).length;
    onProgressChange(`Focos eliminados ${solvedCount}/${hazards.length}`);
  }, [hazards, onProgressChange]);

  const handleAction = (hazardId: string, action: ActionType) => {
    const hazard = hazards.find((h) => h.id === hazardId);
    if (!hazard) return;
    if (action === hazard.correctAction) {
      onCorrect();
      const updated = hazards.map((h) =>
        h.id === hazardId ? { ...h, solved: true } : h
      );
      setHazards(updated);
      if (updated.every((h) => h.solved)) setTimeout(() => onComplete(), 500);
    } else {
      onWrong();
    }
  };

  return (
    <>
      {hazards.map((hazard) => (
        <TappableHazard
          key={hazard.id}
          hazard={hazard}
          onAction={handleAction}
          containerWidth={areaWidth}
          containerHeight={areaHeight}
        />
      ))}
    </>
  );
};

// ======= LEVEL 2 GAMEPLAY — Items with tools =======
const Level2Gameplay: React.FC<{
  onCorrect: () => void;
  onWrong: () => void;
  onComplete: () => void;
  onProgressChange: (label: string) => void;
  areaWidth: number;
  areaHeight: number;
  compact: boolean;
}> = ({ onCorrect, onWrong, onComplete, onProgressChange, areaWidth, areaHeight, compact }) => {
  const [hazards, setHazards] = useState<Hazard[]>(
    LEVEL2_HAZARDS.map((h) => ({ ...h, solved: false }))
  );
  const [activeHazardId, setActiveHazardId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeHazard = hazards.find((hazard) => hazard.id === activeHazardId && !hazard.solved) ?? null;
  const solvedCount = hazards.filter((hazard) => hazard.solved).length;
  const trayHeight = activeHazard
    ? (compact ? 126 : LEVEL2_TRAY_EXPANDED_HEIGHT)
    : (compact ? 66 : LEVEL2_TRAY_COLLAPSED_HEIGHT);

  useEffect(() => {
    onProgressChange(`Mutirao concluido ${solvedCount}/${hazards.length}`);
  }, [hazards, onProgressChange, solvedCount]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 1800);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const handleHazardTap = (hazardId: string) => {
    const hazard = hazards.find((h) => h.id === hazardId);
    if (!hazard || hazard.solved) return;
    setActiveHazardId(hazardId);
    setStatusMessage(null);
  };

  const handleSolutionPress = (solutionType: string) => {
    if (!activeHazard) {
      setStatusMessage('Toque em um foco primeiro para abrir a vistoria.');
      return;
    }

    if (activeHazard.correctSolution === solutionType) {
      onCorrect();
      const updated = hazards.map((h) =>
        h.id === activeHazard.id ? { ...h, solved: true } : h
      );
      setHazards(updated);
      setStatusMessage(`${activeHazard.label} tratado com sucesso.`);
      setActiveHazardId(null);
      if (updated.every((h) => h.solved)) setTimeout(() => onComplete(), 500);
    } else {
      onWrong();
      setStatusMessage('Essa medida nao resolve esse foco. Observe e tente outra abordagem.');
    }
  };

  return (
    <View style={styles.level2Layout}>
      {hazards.map((hazard) => {
        const selected = hazard.id === activeHazardId;
        const SIZE = compact
          ? (selected ? 52 : 44)
          : (selected ? 58 : 50);
        const effectiveHeight = compact ? areaHeight - 42 : areaHeight - 18;
        const cx = hazard.position.x * areaWidth - SIZE / 2;
        const cy = hazard.position.y * effectiveHeight - SIZE / 2;

        return (
          <TouchableOpacity
            key={hazard.id}
            style={[
              styles.level2Hotspot,
              { left: cx, top: cy, width: SIZE, height: SIZE },
              hazard.solved && styles.level2HotspotSolved,
              selected && styles.level2HotspotSelected,
            ]}
            onPress={() => handleHazardTap(hazard.id)}
            disabled={hazard.solved}
            activeOpacity={0.7}
          >
            {!hazard.solved ? <View style={styles.level2PingRing} /> : null}
            <View pointerEvents="none" style={styles.level2VisualMask}>
              {hazard.solved ? (
                <View style={styles.level2SolvedDot}>
                  <Text style={styles.level2SolvedText}>OK</Text>
                </View>
              ) : (
                <View style={[styles.level2Marker, selected && styles.level2MarkerSelected]}>
                  <Text style={[styles.level2MarkerText, selected && styles.level2MarkerTextSelected]}>!</Text>
                </View>
              )}
            </View>
            {selected ? (
              <View style={styles.level2FocusTag}>
                <Text style={styles.level2FocusTagText}>{hazard.label}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}

      <View style={[styles.toolTray, compact && styles.toolTrayCompact, { minHeight: trayHeight }]}>
        <View style={[styles.toolTrayHeader, compact && styles.toolTrayHeaderCompact]}>
          <View style={styles.toolTrayHeaderCopy}>
            <Text style={styles.toolBarEyebrow}>ROTA DE CAMPO</Text>
            <Text numberOfLines={1} style={[styles.toolTrayTitle, compact && styles.toolTrayTitleCompact]}>
              {activeHazard ? activeHazard.label : 'Toque em um foco do cenario'}
            </Text>
            <Text numberOfLines={compact ? 1 : 2} style={[styles.toolTrayHelper, compact && styles.toolTrayHelperCompact]}>
              {activeHazard
                ? activeHazard.description
                : 'Toque em um marcador para abrir a vistoria do local.'}
            </Text>
          </View>
          <View style={[styles.toolTrayCounter, compact && styles.toolTrayCounterCompact]}>
            <Text style={[styles.toolTrayCounterValue, compact && styles.toolTrayCounterValueCompact]}>{solvedCount}/{hazards.length}</Text>
            <Text style={[styles.toolTrayCounterLabel, compact && styles.toolTrayCounterLabelCompact]}>tratados</Text>
          </View>
        </View>

        {statusMessage ? (
          <View style={[styles.toolStatus, compact && styles.toolStatusCompact]}>
            <Text numberOfLines={compact ? 1 : 2} style={[styles.toolStatusText, compact && styles.toolStatusTextCompact]}>{statusMessage}</Text>
          </View>
        ) : null}

        {activeHazard ? (
          <View style={styles.toolGridCompact}>
            {LEVEL2_SOLUTIONS.map((sol) => {
              const meta = LEVEL2_TOOL_META[sol.type];

              return (
                <TouchableOpacity
                  key={`guide_${sol.id}`}
                  style={[styles.toolChoice, compact && styles.toolChoiceCompact, { borderColor: meta.accent, backgroundColor: meta.tint }]}
                  onPress={() => handleSolutionPress(sol.type)}
                  activeOpacity={0.82}
                >
                  <View style={[styles.toolBadge, compact && styles.toolBadgeCompact, { borderColor: meta.accent }]}>
                    <Text style={[styles.toolBadgeText, { color: meta.accent }]}>{meta.code}</Text>
                  </View>
                  <Text numberOfLines={2} style={[styles.toolChoiceLabel, compact && styles.toolChoiceLabelCompact]}>{sol.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
};

// ======= LEVEL 3 GAMEPLAY — Quiz =======
const Level3Gameplay: React.FC<{
  onCorrect: () => void;
  onWrong: () => void;
  onComplete: () => void;
  onFail: () => void;
  onProgressChange: (label: string) => void;
}> = ({ onCorrect, onWrong, onComplete, onFail, onProgressChange }) => {
  const [questions] = useState<QuizQuestion[]>(() => getShuffledQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    onProgressChange(`Casos resolvidos ${currentIndex}/${questions.length}`);
  }, [currentIndex, onProgressChange, questions.length]);

  const handleAnswer = (isCorrect: boolean) => {
    const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
    const answeredCount = currentIndex + 1;

    if (isCorrect) {
      onCorrect();
      setCorrectCount(finalCorrect);
    } else {
      onWrong();
    }

    onProgressChange(`Casos resolvidos ${answeredCount}/${questions.length}`);

    if (answeredCount >= questions.length) {
      if (finalCorrect / questions.length >= GAME_CONSTANTS.QUIZ_PASS_RATE) {
        setTimeout(() => onComplete(), 500);
      } else {
        setTimeout(() => onFail(), 600);
      }
      return;
    }

    setCurrentIndex((i) => i + 1);
  };

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.quizDone}>
        <Text style={styles.quizDoneEmoji}>📝</Text>
        <Text style={styles.quizDoneText}>Quiz Completo!</Text>
        <Text style={styles.quizDoneScore}>{correctCount}/{questions.length}</Text>
      </View>
    );
  }

  return (
    <View style={styles.quizArea}>
      <QuizCard
        question={questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    </View>
  );
};

// ======= LEVEL 4 GAMEPLAY — Map =======
const Level4Gameplay: React.FC<{
  onCorrect: () => void;
  onWrong: () => void;
  onComplete: () => void;
  onProgressChange: (label: string) => void;
  areaWidth: number;
  areaHeight: number;
}> = ({ onCorrect, onWrong, onComplete, onProgressChange, areaWidth, areaHeight }) => {
  const [mapPoints, setMapPoints] = useState(
    LEVEL4_MAP_POINTS.map((p) => ({ ...p, completed: false }))
  );
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [activeHazards, setActiveHazards] = useState<Hazard[]>([]);

  useEffect(() => {
    if (activePoint) {
      const completedHazards = activeHazards.filter((hazard) => hazard.solved).length;
      const pointLabel = mapPoints.find((point) => point.id === activePoint)?.label ?? 'Setor';
      onProgressChange(`${pointLabel}: ${completedHazards}/${activeHazards.length} focos`);
      return;
    }

    const completedPoints = mapPoints.filter((point) => point.completed).length;
    onProgressChange(`Setores protegidos ${completedPoints}/${mapPoints.length}`);
  }, [activeHazards, activePoint, mapPoints, onProgressChange]);

  const handleMapPointPress = (pointId: string) => {
    const point = mapPoints.find((p) => p.id === pointId);
    if (!point || point.completed) return;
    setActivePoint(pointId);
    setActiveHazards(point.hazards.map((h) => ({ ...h, solved: false })));
  };

  const handleHazardAction = (hazardId: string, action: ActionType) => {
    const hazard = activeHazards.find((h) => h.id === hazardId);
    if (!hazard) return;
    if (action === hazard.correctAction) {
      onCorrect();
      const updated = activeHazards.map((h) =>
        h.id === hazardId ? { ...h, solved: true } : h
      );
      setActiveHazards(updated);
      if (updated.every((h) => h.solved)) {
        const updatedPoints = mapPoints.map((p) =>
          p.id === activePoint ? { ...p, completed: true } : p
        );
        setMapPoints(updatedPoints);
        setActivePoint(null);
        if (updatedPoints.every((p) => p.completed)) setTimeout(() => onComplete(), 500);
      }
    } else {
      onWrong();
    }
  };

  if (activePoint) {
    return (
      <View style={styles.miniMission}>
        <TouchableOpacity style={styles.miniBack} onPress={() => setActivePoint(null)}>
          <Text style={styles.miniBackText}>← Mapa</Text>
        </TouchableOpacity>
        <Text style={styles.miniTitle}>
          {mapPoints.find((p) => p.id === activePoint)?.emoji}{' '}
          {mapPoints.find((p) => p.id === activePoint)?.label}
        </Text>
        {activeHazards.map((hazard) => (
          <TappableHazard
            key={hazard.id}
            hazard={hazard}
            onAction={handleHazardAction}
            containerWidth={areaWidth}
            containerHeight={areaHeight * 0.7}
          />
        ))}
      </View>
    );
  }

  return (
    <>
      {mapPoints.map((point) => {
        const px = point.position.x * areaWidth - 28;
        const py = point.position.y * areaHeight - 28;
        return (
          <TouchableOpacity
            key={point.id}
            style={[styles.mapPin, { left: px, top: py }, point.completed && styles.mapPinDone]}
            onPress={() => handleMapPointPress(point.id)}
            disabled={point.completed}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={point.completed ? ['#DCEEDB', '#CDE4C8'] : ['#FFF9EE', '#F1E5CC']}
              style={styles.mapPinInner}
            >
              <Text style={styles.mapPinEmoji}>{point.completed ? 'OK' : point.emoji}</Text>
            </LinearGradient>
            <Text style={[styles.mapPinLabel, point.completed && styles.mapPinLabelDone]}>
              {point.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

// ======= LEVEL 5 GAMEPLAY (MIXED) =======
const Level5Gameplay: React.FC<{
  onCorrect: () => void;
  onWrong: () => void;
  onComplete: () => void;
  onProgressChange: (label: string) => void;
  areaWidth: number;
  areaHeight: number;
}> = ({ onCorrect, onWrong, onComplete, onProgressChange, areaWidth, areaHeight }) => {
  const [phase, setPhase] = useState<'hazards' | 'quiz'>('hazards');
  const [hazards, setHazards] = useState<Hazard[]>(
    [...LEVEL1_HAZARDS.slice(0, 2), ...LEVEL2_HAZARDS.slice(0, 2)].map((h, i) => ({
      ...h, id: `l5_${i}`, solved: false,
      position: { x: 0.15 + (i % 3) * 0.3, y: 0.4 + Math.floor(i / 3) * 0.25 },
    }))
  );
  const [questions] = useState<QuizQuestion[]>(() => getShuffledQuestions(5));
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  useEffect(() => {
    if (phase === 'hazards') {
      const solvedCount = hazards.filter((hazard) => hazard.solved).length;
      onProgressChange(`Fase 1: ${solvedCount}/${hazards.length} focos`);
      return;
    }

    onProgressChange(`Fase 2: ${currentQuizIndex}/${questions.length} respostas`);
  }, [currentQuizIndex, hazards, onProgressChange, phase, questions.length]);

  const handleHazardAction = (hazardId: string, action: ActionType) => {
    const hazard = hazards.find((h) => h.id === hazardId);
    if (!hazard) return;
    if (action === hazard.correctAction) {
      onCorrect();
      const updated = hazards.map((h) => h.id === hazardId ? { ...h, solved: true } : h);
      setHazards(updated);
      if (updated.every((h) => h.solved)) setPhase('quiz');
    } else { onWrong(); }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) onCorrect(); else onWrong();
    const answeredCount = currentQuizIndex + 1;
    onProgressChange(`Fase 2: ${answeredCount}/${questions.length} respostas`);
    if (answeredCount >= questions.length) onComplete();
    else setCurrentQuizIndex((i) => i + 1);
  };

  if (phase === 'quiz') {
    if (currentQuizIndex >= questions.length) return null;
    return (
      <View style={styles.quizArea}>
        <View style={styles.phaseTag}>
          <LinearGradient colors={['rgba(231,225,207,0.98)', 'rgba(245,240,228,0.98)']} style={styles.phaseTagInner}>
            <Text style={styles.phaseTagText}>FASE 2 | TRIAGEM FINAL</Text>
          </LinearGradient>
        </View>
        <QuizCard question={questions[currentQuizIndex]} questionNumber={currentQuizIndex + 1}
          totalQuestions={questions.length} onAnswer={handleQuizAnswer} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.phaseTag}>
        <LinearGradient colors={['rgba(231,225,207,0.98)', 'rgba(245,240,228,0.98)']} style={styles.phaseTagInner}>
          <Text style={styles.phaseTagText}>FASE 1 | OPERACAO DE CAMPO</Text>
        </LinearGradient>
      </View>
      {hazards.map((hazard) => (
        <TappableHazard key={hazard.id} hazard={hazard} onAction={handleHazardAction}
          containerWidth={areaWidth} containerHeight={areaHeight} />
      ))}
    </>
  );
};

// ======= MAIN GAMEPLAY SCREEN =======
export default function GameplayScreen() {
  const { levelId: levelIdParam } = useLocalSearchParams<{ levelId: string }>();
  const levelId = parseInt(levelIdParam || '1', 10) as LevelId;
  const router = useRouter();
  const levelConfig = getLevelConfig(levelId);
  const {
    gameState, initLevel, addScore, loseLife, incrementCombo, resetCombo,
    updateTime, addCorrectAnswer, addWrongAnswer, updateInfestation,
    togglePause, setVictory, setGameOver, completeLevel, unlockBadge,
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastActionTimeRef = useRef<number>(Date.now());
  const [sceneLayout, setSceneLayout] = useState({ width: SCREEN_W, height: SCREEN_H });
  const [missionProgress, setMissionProgress] = useState('');
  const [showBriefing, setShowBriefing] = useState(true);
  const [defeatReason, setDefeatReason] = useState<'lives' | 'time' | 'infestation' | 'knowledge'>('time');

  const feedbackScale = useSharedValue(0.96);
  const feedbackOpacity = useSharedValue(0);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const feedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
    opacity: feedbackOpacity.value,
  }));

  useEffect(() => {
    if (!levelConfig) return;
    initLevel(levelId, levelConfig.timeLimit);
    startTimeRef.current = Date.now();
    lastActionTimeRef.current = Date.now();
    setMissionProgress('');
    setShowBriefing(true);
    setDefeatReason('time');
  }, [initLevel, levelConfig, levelId]);

  useEffect(() => {
    if (!levelConfig || showBriefing) return;
    timerRef.current = setInterval(() => {
      if (gameState.isPaused || gameState.isGameOver || gameState.isVictory) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, levelConfig.timeLimit - elapsed);
      updateTime(remaining);
      if (levelId >= 4) updateInfestation(GAME_CONSTANTS.INFESTATION_RATE / 10);
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState.isGameOver, gameState.isPaused, gameState.isVictory, levelConfig, levelId, showBriefing, updateInfestation, updateTime]);

  useEffect(() => {
    if (!gameState.isGameOver || gameState.isVictory) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let resolvedReason = defeatReason;
    if (resolvedReason === 'time') {
      resolvedReason = gameState.lives <= 0
        ? 'lives'
        : gameState.infestationLevel >= 100
          ? 'infestation'
          : 'time';
    }

    const timeout = setTimeout(() => {
      router.replace({
        pathname: '/defeat',
        params: {
          levelId: String(levelId),
          reason: resolvedReason,
        },
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [defeatReason, gameState.infestationLevel, gameState.isGameOver, gameState.isVictory, gameState.lives, levelId, router]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const showFeedback = (type: 'correct' | 'wrong') => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedbackType(type);
    feedbackScale.value = 0.96;
    feedbackOpacity.value = 0;
    feedbackScale.value = withSequence(
      withTiming(1, { duration: 90 }),
      withSpring(1.03, { damping: 12, stiffness: 220 }),
      withTiming(0.98, { duration: 120 })
    );
    feedbackOpacity.value = withSequence(
      withTiming(1, { duration: 70 }),
      withTiming(0, { duration: 240 })
    );
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackType(null);
      feedbackTimeoutRef.current = null;
    }, 330);
  };

  const handleCorrect = () => {
    const now = Date.now();
    const timeSince = now - lastActionTimeRef.current;
    lastActionTimeRef.current = now;
    let points = GAME_CONSTANTS.CORRECT_ACTION;
    if (timeSince < GAME_CONSTANTS.FAST_THRESHOLD_MS) points += GAME_CONSTANTS.FAST_BONUS;
    addScore(points);
    incrementCombo();
    addCorrectAnswer();
    if (levelId >= 4) updateInfestation(GAME_CONSTANTS.INFESTATION_CORRECT);
    showFeedback('correct');
  };

  const handleWrong = () => {
    addScore(GAME_CONSTANTS.ERROR_PENALTY);
    resetCombo();
    loseLife();
    addWrongAnswer();
    if (levelId >= 4) updateInfestation(GAME_CONSTANTS.INFESTATION_ERROR);
    showFeedback('wrong');
  };

  const handleKnowledgeFailure = () => {
    setDefeatReason('knowledge');
    setGameOver();
  };

  const handleLevelComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const completionBonus =
      GAME_CONSTANTS.LEVEL_COMPLETE +
      (calculateStars(gameState.score + GAME_CONSTANTS.LEVEL_COMPLETE, levelConfig?.maxScore || 1) === 3
        ? GAME_CONSTANTS.THREE_STARS_BONUS
        : 0);
    const finalScore = gameState.score + completionBonus;
    const stars = calculateStars(finalScore, levelConfig?.maxScore || 1);
    const timeUsed = Math.max(0, (levelConfig?.timeLimit || 90) - gameState.timeRemaining);
    addScore(completionBonus);
    setVictory();
    completeLevel(levelId, finalScore, stars, timeUsed);

    const bonusResult = evaluateBonusObjective(levelConfig!.bonusObjective, {
      score: finalScore,
      remainingLives: gameState.lives,
      timeRemaining: gameState.timeRemaining,
      correctAnswers: gameState.correctAnswers,
      totalAnswers: gameState.totalAnswers,
      maxCombo: gameState.maxCombo,
      infestationLevel: gameState.infestationLevel,
    });
    const badgeUnlocked = bonusResult.achieved ? unlockBadge(levelConfig!.badge.id) : false;
    const accuracy = gameState.totalAnswers > 0
      ? Math.round((gameState.correctAnswers / gameState.totalAnswers) * 100)
      : 100;

    setTimeout(() => {
      router.replace({
        pathname: '/victory',
        params: {
          levelId: String(levelId),
          score: String(finalScore),
          stars: String(stars),
          isLastLevel: String(levelId === 5),
          bonusAchieved: String(bonusResult.achieved),
          bonusTitle: levelConfig?.bonusObjective.title,
          bonusProgress: bonusResult.progressLabel,
          badgeName: levelConfig?.badge.name,
          badgeIcon: levelConfig?.badge.icon,
          badgeUnlocked: String(badgeUnlocked),
          accuracy: String(accuracy),
          maxCombo: String(gameState.maxCombo),
          timeUsed: String(timeUsed),
          remainingLives: String(gameState.lives),
        },
      });
    }, 800);
  };

  const handleResume = () => {
    togglePause();
    startTimeRef.current = Date.now() - ((levelConfig?.timeLimit || 90) - gameState.timeRemaining) * 1000;
  };
  const handleMissionStart = () => {
    startTimeRef.current = Date.now();
    lastActionTimeRef.current = Date.now();
    setShowBriefing(false);
  };
  const handleRestart = () => {
    togglePause();
    if (levelConfig) {
      initLevel(levelId, levelConfig.timeLimit);
      startTimeRef.current = Date.now();
      lastActionTimeRef.current = Date.now();
      setMissionProgress('');
      setShowBriefing(true);
      setDefeatReason('time');
    }
  };
  const handleBackToMenu = () => { if (timerRef.current) clearInterval(timerRef.current); router.replace('/levels'); };

  if (!levelConfig) {
    return <View style={styles.container}><Text style={styles.errorText}>Nível não encontrado</Text></View>;
  }

  const bgImage = LEVEL_BACKGROUNDS[levelId] || LEVEL_BACKGROUNDS[1];
  const isCompactViewport = sceneLayout.width <= 390 || sceneLayout.height <= 640;

  const imageAspect = 1; // square images
  let imgRenderW = sceneLayout.width;
  let imgRenderH = sceneLayout.width * (1 / imageAspect); // = sceneLayout.width for square
  let imgOffsetX = 0;
  let imgOffsetY = Math.max(16, sceneLayout.height * 0.05);
  if (imgRenderH > sceneLayout.height) {
    imgRenderH = sceneLayout.height;
    imgRenderW = sceneLayout.height * imageAspect;
    imgOffsetX = (sceneLayout.width - imgRenderW) / 2;
    imgOffsetY = 0;
  }
  const reservedBottomSpace = levelId === 2
    ? (isCompactViewport ? 218 : sceneLayout.height < 520 ? 176 : 162)
    : levelId === 3
      ? 0
      : (isCompactViewport ? 192 : 0);

  if (reservedBottomSpace > 0) {
    const maxImageSize = Math.max(250, sceneLayout.height - reservedBottomSpace);
    if (imgRenderH > maxImageSize) {
      imgRenderH = maxImageSize;
      imgRenderW = maxImageSize * imageAspect;
      imgOffsetX = (sceneLayout.width - imgRenderW) / 2;
      imgOffsetY = isCompactViewport ? 6 : 10;
    }
  }

  const deskTop = Math.min(
    Math.max(imgOffsetY + imgRenderH + 12, sceneLayout.height * 0.58),
    sceneLayout.height - 220
  );
  const deskStats = [
    { label: 'Tempo', value: `${gameState.timeRemaining}s` },
    { label: 'Vidas', value: `${gameState.lives}` },
    levelId >= 4
      ? { label: 'Infestacao', value: `${Math.round(gameState.infestationLevel)}%` }
      : { label: 'Combo', value: `x${gameState.combo}` },
  ];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <SafeAreaView style={styles.safeArea}>
        {/* HUD at top — over dark background */}
        <View style={styles.hudBar}>
          <HUD
            timeRemaining={gameState.timeRemaining}
            lives={gameState.lives}
            score={gameState.score}
            combo={gameState.combo}
            onPause={() => togglePause()}
            objective={levelConfig.objective}
            missionProgress={missionProgress}
            infestationLevel={levelId >= 4 ? gameState.infestationLevel : undefined}
            compact={isCompactViewport}
          />
        </View>

        {/* Scene area — fills remaining space */}
        <View
          style={styles.sceneArea}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setSceneLayout({ width, height });
          }}
        >
          <Image
            source={bgImage}
            style={styles.sceneBackdrop}
            resizeMode="cover"
            blurRadius={14}
          />
          <LinearGradient
            colors={['rgba(1,8,20,0.78)', 'rgba(1,8,20,0.18)', 'rgba(1,8,20,0.72)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Background image — contain mode so full image is always visible */}
          <Image
            source={bgImage}
            style={[styles.sceneBgImage, {
              width: imgRenderW,
              height: imgRenderH,
              marginTop: imgOffsetY,
              marginLeft: imgOffsetX,
            }]}
            resizeMode="contain"
          />

          {/* Hazard layer — positioned relative to the rendered image */}
          <View style={[styles.hazardLayer, {
            left: imgOffsetX,
            top: imgOffsetY,
            width: imgRenderW,
            height: imgRenderH,
          }]}>
            {levelId === 1 && (
              <Level1Gameplay onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW} areaHeight={imgRenderH} />
            )}
            {levelId === 2 && (
              <Level2Gameplay onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW} areaHeight={imgRenderH} compact={isCompactViewport} />
            )}
            {levelId === 4 && (
              <Level4Gameplay onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW} areaHeight={imgRenderH} />
            )}
            {levelId === 5 && (
              <Level5Gameplay onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW} areaHeight={imgRenderH} />
            )}
          </View>

          {/* Quiz levels don't need image-relative positioning */}
          {levelId === 3 && (
            <View style={styles.quizOverlay}>
              <Level3Gameplay
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onComplete={handleLevelComplete}
                onFail={handleKnowledgeFailure}
                onProgressChange={setMissionProgress}
              />
            </View>
          )}

          {!showBriefing && levelId !== 2 && levelId !== 3 ? (
            <OperationsDeskPanel
              top={deskTop}
              levelName={levelConfig.name}
              district={levelConfig.district}
              missionProgress={missionProgress}
              objective={levelConfig.objective}
              supportTip={levelConfig.supportTip}
              educationalMessage={levelConfig.educationalMessage}
              stats={deskStats}
              compact={isCompactViewport}
            />
          ) : null}
        </View>

        {/* Feedback flash */}
        {feedbackType ? (
          <Animated.View style={[styles.feedbackOverlay, feedbackStyle]} pointerEvents="none">
          <View
            style={[
              styles.feedbackStamp,
              feedbackType === 'correct' ? styles.feedbackStampCorrect : styles.feedbackStampWrong,
            ]}
          >
            <Text
              style={[
                styles.feedbackStampTitle,
                feedbackType === 'correct' ? styles.feedbackStampTitleCorrect : styles.feedbackStampTitleWrong,
              ]}
            >
              {feedbackType === 'correct' ? 'MEDIDA CORRETA' : 'REVEJA A ACAO'}
            </Text>
            <Text style={styles.feedbackStampBody}>
              {feedbackType === 'correct'
                ? 'O foco foi tratado com a orientacao adequada.'
                : 'Essa medida nao elimina o criadouro. Observe e tente novamente.'}
            </Text>
          </View>
          <Text style={styles.feedbackEmoji}>{feedbackType === 'correct' ? '✅' : '❌'}</Text>
          <Text style={[styles.feedbackText, { color: feedbackType === 'correct' ? '#22C55E' : '#EF4444' }]}>
            {feedbackType === 'correct' ? 'Correto!' : 'Errado!'}
          </Text>
          </Animated.View>
        ) : null}

        <MissionBriefingModal
          level={levelConfig}
          visible={showBriefing}
          onStart={handleMissionStart}
        />
        <PauseModal visible={gameState.isPaused} onResume={handleResume} onRestart={handleRestart} onMenu={handleBackToMenu} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  hudBar: {
    zIndex: 20,
  },
  sceneArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sceneBackdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.48,
  },
  sceneBgImage: {
    position: 'absolute',
  },
  hazardLayer: {
    position: 'absolute',
    zIndex: 24,
    elevation: 24,
  },
  quizOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  errorText: { color: '#FFF', fontSize: 20, textAlign: 'center', marginTop: 100 },

  // Level 2 hotspots (scene-integrated)
  level2Layout: {
    ...StyleSheet.absoluteFillObject,
  },
  level2Hotspot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  level2HotspotSolved: {
    opacity: 0.62,
  },
  level2HotspotSelected: {
    zIndex: 16,
  },
  level2VisualMask: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  level2PingRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: 'rgba(177, 119, 50, 0.45)',
    borderStyle: 'dashed',
  },
  level2Marker: {
    width: 36,
    height: 36,
    borderRadius: 11,
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
  level2MarkerSelected: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF4DB',
    borderColor: '#9E611B',
  },
  level2MarkerText: {
    color: '#7A4B17',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 18,
  },
  level2MarkerTextSelected: {
    fontSize: 18,
  },
  level2SolvedDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E7F0E4',
    borderWidth: 1.5,
    borderColor: '#6E8A67',
    alignItems: 'center',
    justifyContent: 'center',
  },
  level2SolvedText: {
    color: '#395441',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  level2FocusTag: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#F6ECD8',
    borderWidth: 1,
    borderColor: '#B59B6A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  level2FocusTagText: {
    color: '#32281C',
    fontSize: 10,
    fontWeight: '800',
  },

  // Tool bar (Level 2)
  toolTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(247,241,228,0.98)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1, borderColor: '#D1C3A7',
    gap: 8,
  },
  toolTrayCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 6,
  },
  toolBarTitle: { display: 'none' },
  toolBarEyebrow: {
    color: '#7C6A4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  toolTrayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  toolTrayHeaderCompact: {
    gap: 8,
  },
  toolTrayHeaderCopy: {
    flex: 1,
  },
  toolTrayTitle: {
    color: '#241C13',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  toolTrayTitleCompact: {
    fontSize: 14,
  },
  toolTrayHelper: {
    color: '#655540',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  toolTrayHelperCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  toolTrayCounter: {
    minWidth: 66,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#EFE4CA',
    borderWidth: 1,
    borderColor: '#D0B986',
    alignItems: 'center',
  },
  toolTrayCounterCompact: {
    minWidth: 58,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  toolTrayCounterValue: {
    color: '#3A2E1E',
    fontSize: 16,
    fontWeight: '900',
  },
  toolTrayCounterValueCompact: {
    fontSize: 14,
  },
  toolTrayCounterLabel: {
    color: '#756245',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 1,
  },
  toolTrayCounterLabelCompact: {
    fontSize: 8,
  },
  toolStatus: {
    backgroundColor: '#FFF9EE',
    borderWidth: 1,
    borderColor: '#D6CAB2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  toolStatusCompact: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  toolStatusText: {
    color: '#4C4030',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  toolStatusTextCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  toolGridCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  toolChoice: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  toolChoiceCompact: {
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  toolBadge: {
    width: 31,
    height: 31,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F1E3',
  },
  toolBadgeCompact: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  toolBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  toolChoiceLabel: {
    flex: 1,
    color: '#2E261C',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
  toolChoiceLabelCompact: {
    fontSize: 10,
    lineHeight: 12,
  },

  // Quiz
  quizArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  quizDone: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  quizDoneEmoji: { fontSize: 48 },
  quizDoneText: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 12 },
  quizDoneScore: { color: '#22C55E', fontSize: 18, fontWeight: '600', marginTop: 4 },

  // Map pins (Level 4)
  mapPin: {
    position: 'absolute', width: 56, height: 56, alignItems: 'center', zIndex: 5,
  },
  mapPinDone: { opacity: 0.5 },
  mapPinInner: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#C8B389',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  mapPinEmoji: {
    fontSize: 18,
    color: '#3B2F22',
    fontWeight: '900',
  },
  mapPinLabel: {
    color: '#4F3E2B',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(246,236,216,0.96)',
    borderWidth: 1,
    borderColor: '#BDA174',
  },
  mapPinLabelDone: {
    color: '#45624A',
    borderColor: '#8DB18D',
    backgroundColor: '#E7F0E4',
  },
  miniMission: { flex: 1, position: 'relative', paddingTop: 8 },
  miniBack: {
    backgroundColor: 'rgba(246,240,226,0.96)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, alignSelf: 'flex-start', marginLeft: 12, marginBottom: 4,
    borderWidth: 1, borderColor: '#CDBB96',
  },
  miniBackText: { color: '#5A4B37', fontSize: 12, fontWeight: '700' },
  miniTitle: {
    color: '#FFF8EA', fontSize: 14, fontWeight: '900', marginLeft: 12, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },

  // Phase tag (Level 5)
  phaseTag: { alignItems: 'center', marginVertical: 6, zIndex: 10 },
  phaseTagInner: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C8B389',
  },
  phaseTagText: { color: '#5A4933', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },

  // Feedback overlay
  feedbackOverlay: {
    position: 'absolute', top: '40%', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center', zIndex: 50,
  },
  feedbackEmoji: { display: 'none' },
  feedbackText: {
    display: 'none',
  },
  feedbackStamp: {
    width: 220,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    backgroundColor: '#F7F1E4',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  feedbackStampCorrect: {
    borderColor: '#6E8A67',
  },
  feedbackStampWrong: {
    borderColor: '#A36A58',
  },
  feedbackStampTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  feedbackStampTitleCorrect: {
    color: '#395441',
  },
  feedbackStampTitleWrong: {
    color: '#7B3F36',
  },
  feedbackStampBody: {
    color: '#4B4032',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
