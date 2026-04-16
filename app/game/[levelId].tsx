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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_CONSTANTS } from '../../src/styles/theme';
import { useGameStore, calculateStars } from '../../src/store/gameStore';
import { evaluateBonusObjective } from '../../src/data/campaign';
import { getLevelConfig, LEVELS } from '../../src/data/levels';
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
  emoji: string;
  note: string;
  accent: string;
  tint: string;
}> = {
  saco_lixo: {
    emoji: '🗑️',
    note: 'Recolhe lixo e objetos que acumulam água.',
    accent: '#FCD34D',
    tint: 'rgba(180,83,9,0.28)',
  },
  tampa: {
    emoji: '🔒',
    note: 'Fecha recipientes que devem ficar cobertos.',
    accent: '#93C5FD',
    tint: 'rgba(37,99,235,0.28)',
  },
  pa: {
    emoji: '⛏️',
    note: 'Remove folhas, barro e entulho acumulado.',
    accent: '#C4B5FD',
    tint: 'rgba(109,40,217,0.28)',
  },
  limpeza: {
    emoji: '🧽',
    note: 'Escova e higieniza locais com água parada.',
    accent: '#67E8F9',
    tint: 'rgba(8,145,178,0.28)',
  },
};

const LEVEL2_TRAY_COLLAPSED_HEIGHT = 78;
const LEVEL2_TRAY_EXPANDED_HEIGHT = 154;

export function generateStaticParams() {
  return LEVELS.map((level) => ({
    levelId: String(level.id),
  }));
}

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
  imgOffsetX: number;
  imgOffsetY: number;
  compact: boolean;
}> = ({ onCorrect, onWrong, onComplete, onProgressChange, areaWidth, areaHeight, imgOffsetX, imgOffsetY, compact }) => {
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
        const cx = imgOffsetX + hazard.position.x * areaWidth - SIZE / 2;
        const cy = imgOffsetY + hazard.position.y * areaHeight - SIZE / 2;

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
            {!hazard.solved ? <View style={[styles.level2PingRing, selected && styles.level2PingRingSelected]} /> : null}
            <View pointerEvents="none" style={styles.level2VisualMask}>
              {hazard.solved ? (
                <View style={styles.level2SolvedDot}>
                  <Text style={styles.level2SolvedEmoji}>✅</Text>
                </View>
              ) : (
                <View style={[styles.level2Marker, selected && styles.level2MarkerSelected]}>
                  <Text style={styles.level2MarkerEmoji}>🦟</Text>
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
                  <Text style={styles.toolBadgeEmoji}>{meta.emoji}</Text>
                  <Text numberOfLines={2} style={[styles.toolChoiceLabel, compact && styles.toolChoiceLabelCompact, { color: meta.accent }]}>{sol.label}</Text>
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
              colors={point.completed ? ['#22C55E', '#16A34A'] : ['#FFFFFF', '#F3F4F6']}
              style={styles.mapPinInner}
            >
              <Text style={styles.mapPinEmoji}>{point.completed ? '✅' : point.emoji}</Text>
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

  const insets = useSafeAreaInsets();
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

  // ── Imagem quadrada: cabe totalmente em qualquer orientação ──
  // imgSize = menor dimensão → portrait: usa largura; landscape/PC: usa altura.
  // Centraliza nos dois eixos para sempre mostrar a imagem inteira.
  const imgSize = Math.min(sceneLayout.width, sceneLayout.height);
  const imgRenderW = imgSize;
  const imgRenderH = imgSize;
  const imgOffsetX = (sceneLayout.width - imgSize) / 2;
  const imgOffsetY = (sceneLayout.height - imgSize) / 2;
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

      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
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
          {/* Fundo desfocado — cobre toda a sceneArea */}
          <Image
            source={bgImage}
            style={styles.sceneBackdrop}
            resizeMode="cover"
            blurRadius={20}
          />
          {/* Overlay escuro para legibilidade */}
          <View style={styles.sceneOverlay} pointerEvents="none" />
          <LinearGradient
            colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.38, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {/* Background image — cover mode fills entire wrapper; offset is not needed with cover */}
          <View
            pointerEvents="none"
            style={[styles.sceneBgImageWrapper, {
              top: imgOffsetY,
              left: imgOffsetX,
              width: imgRenderW,
              height: imgRenderH,
              overflow: 'hidden',
              backgroundColor: '#000',
            }]}
          >
            <Image
              source={bgImage}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          </View>

          {/* Hazard layer — sized/positioned to match the rendered image.
              box-none so the container itself never intercepts touches. */}
          <View
            pointerEvents="box-none"
            style={[styles.hazardLayer, {
              left: imgOffsetX,
              top: imgOffsetY,
              width: imgRenderW,
              height: imgRenderH,
            }]}
          >
            {levelId === 1 && (
              <Level1Gameplay onCorrect={handleCorrect} onWrong={handleWrong} onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW} areaHeight={imgRenderH} />
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

          {/* Level 2 rendered in its own absoluteFill view so toolTray sits at
              the real screen bottom, not at the bottom of the square image area */}
          {levelId === 2 && (
            <View style={styles.level2FullLayer}>
              <Level2Gameplay
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onComplete={handleLevelComplete}
                onProgressChange={setMissionProgress}
                areaWidth={imgRenderW}
                areaHeight={imgRenderH}
                imgOffsetX={imgOffsetX}
                imgOffsetY={imgOffsetY}
                compact={isCompactViewport}
              />
            </View>
          )}

          {/* Level 3 quiz — high zIndex so it sits above hazardLayer */}
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

          {/* Painel de stats só no nível 4 (mapa) onde o contexto é necessário */}
          {!showBriefing && levelId === 4 ? (
            <OperationsDeskPanel
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
      </View>
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
    backgroundColor: '#000',
  },
  hudBar: {
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  sceneArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  sceneBackdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.62,
  },
  sceneOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  sceneBgImageWrapper: {
    position: 'absolute',
  },
  hazardLayer: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
  },
  // Level 2 needs its own full-screen layer so the tool tray
  // anchors to the real screen bottom, not the image bottom.
  level2FullLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 24,
    elevation: 24,
  },
  quizOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 30,
    elevation: 30,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: 'rgba(239, 68, 68, 0.7)',
  },
  level2PingRingSelected: {
    borderColor: 'rgba(239, 68, 68, 1)',
    borderWidth: 3,
  },
  level2Marker: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 4,
  },
  level2MarkerSelected: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.3)',
    borderColor: '#FCA5A5',
    shadowOpacity: 0.7,
  },
  level2MarkerEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  level2SolvedDot: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  level2SolvedEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  level2FocusTag: {
    position: 'absolute',
    top: -28,
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  level2FocusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // Tool bar (Level 2) — tema escuro para não tampar
  toolTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8,12,20,0.94)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
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
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
  toolTrayTitleCompact: {
    fontSize: 13,
  },
  toolTrayHelper: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  toolTrayHelperCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  toolTrayCounter: {
    minWidth: 60,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    alignItems: 'center',
  },
  toolTrayCounterCompact: {
    minWidth: 52,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  toolTrayCounterValue: {
    color: '#86EFAC',
    fontSize: 15,
    fontWeight: '900',
  },
  toolTrayCounterValueCompact: {
    fontSize: 13,
  },
  toolTrayCounterLabel: {
    color: 'rgba(134,239,172,0.7)',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 1,
  },
  toolTrayCounterLabelCompact: {
    fontSize: 8,
  },
  toolStatus: {
    backgroundColor: 'rgba(180,83,9,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
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
    color: '#FDE68A',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
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
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // backgroundColor e borderColor definidos inline pelo meta de cada ferramenta
    // (já vem com tint escuro do LEVEL2_TOOL_META)
  },
  toolChoiceCompact: {
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  toolBadgeEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  toolChoiceLabel: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    // cor é definida inline pelo accent de cada ferramenta
  },
  toolChoiceLabelCompact: {
    fontSize: 11,
    lineHeight: 13,
  },

  // Quiz
  quizArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 12 },
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
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  mapPinEmoji: {
    fontSize: 22,
  },
  mapPinLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mapPinLabelDone: {
    color: '#FFFFFF',
    borderColor: 'rgba(34,197,94,0.4)',
    backgroundColor: 'rgba(22,163,74,0.7)',
  },
  miniMission: { flex: 1, position: 'relative', paddingTop: 8 },
  miniBack: {
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, alignSelf: 'flex-start', marginLeft: 12, marginBottom: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  miniBackText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  miniTitle: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginLeft: 12, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },

  // Phase tag (Level 5)
  phaseTag: { alignItems: 'center', marginVertical: 6, zIndex: 10 },
  phaseTagInner: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  phaseTagText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },

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
