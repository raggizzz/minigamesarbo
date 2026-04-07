// ============================================
// ArboGame — Quiz Questions (Nível 3 & 5)
// ============================================

import { QuizQuestion } from '../types/game';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // === SINTOMAS ===
  {
    id: 'q1',
    question: 'Qual destes é um sintoma comum da dengue?',
    options: [
      { id: 'q1a', text: 'Febre alta', emoji: '🤒', isCorrect: true },
      { id: 'q1b', text: 'Cabelo caindo', emoji: '💇', isCorrect: false },
      { id: 'q1c', text: 'Dor de dente', emoji: '🦷', isCorrect: false },
      { id: 'q1d', text: 'Visão embaçada', emoji: '👓', isCorrect: false },
    ],
    correctId: 'q1a',
    explanation: 'Febre alta é um dos primeiros sintomas da dengue, geralmente acompanhada de dor no corpo.',
    category: 'sintoma',
  },
  {
    id: 'q2',
    question: 'Qual sintoma pode indicar dengue?',
    options: [
      { id: 'q2a', text: 'Coceira no nariz', emoji: '👃', isCorrect: false },
      { id: 'q2b', text: 'Dor atrás dos olhos', emoji: '👁️', isCorrect: true },
      { id: 'q2c', text: 'Dor de ouvido', emoji: '👂', isCorrect: false },
      { id: 'q2d', text: 'Tontura leve', emoji: '💫', isCorrect: false },
    ],
    correctId: 'q2b',
    explanation: 'Dor atrás dos olhos é um sintoma característico da dengue.',
    category: 'sintoma',
  },
  {
    id: 'q3',
    question: 'Que sinal pode aparecer no corpo com arboviroses?',
    options: [
      { id: 'q3a', text: 'Manchas vermelhas', emoji: '🔴', isCorrect: true },
      { id: 'q3b', text: 'Manchas azuis', emoji: '🔵', isCorrect: false },
      { id: 'q3c', text: 'Cabelos brancos', emoji: '🦳', isCorrect: false },
      { id: 'q3d', text: 'Unhas quebradiças', emoji: '💅', isCorrect: false },
    ],
    correctId: 'q3a',
    explanation: 'Manchas vermelhas pelo corpo podem ser um sinal importante de dengue ou zika.',
    category: 'sintoma',
  },
  {
    id: 'q4',
    question: 'Qual sintoma é comum entre dengue, zika e chikungunya?',
    options: [
      { id: 'q4a', text: 'Espirros', emoji: '🤧', isCorrect: false },
      { id: 'q4b', text: 'Tosse seca', emoji: '😷', isCorrect: false },
      { id: 'q4c', text: 'Dor no corpo', emoji: '🤕', isCorrect: true },
      { id: 'q4d', text: 'Soluço', emoji: '😯', isCorrect: false },
    ],
    correctId: 'q4c',
    explanation: 'Dor no corpo é um sintoma presente nas três arboviroses mais comuns.',
    category: 'sintoma',
  },
  {
    id: 'q5',
    question: 'Qual é um sintoma mais específico da chikungunya?',
    options: [
      { id: 'q5a', text: 'Dor forte nas articulações', emoji: '🦴', isCorrect: true },
      { id: 'q5b', text: 'Dor de garganta', emoji: '🗣️', isCorrect: false },
      { id: 'q5c', text: 'Falta de ar', emoji: '💨', isCorrect: false },
      { id: 'q5d', text: 'Dor de barriga', emoji: '🤢', isCorrect: false },
    ],
    correctId: 'q5a',
    explanation: 'Dor intensa nas articulações é um sintoma muito característico da chikungunya.',
    category: 'sintoma',
  },

  // === PREVENÇÃO ===
  {
    id: 'q6',
    question: 'O que fazer com pneus velhos no quintal?',
    options: [
      { id: 'q6a', text: 'Deixar ao ar livre', emoji: '🌤️', isCorrect: false },
      { id: 'q6b', text: 'Cobrir ou descartar', emoji: '♻️', isCorrect: true },
      { id: 'q6c', text: 'Encher de água', emoji: '💧', isCorrect: false },
      { id: 'q6d', text: 'Pintar de azul', emoji: '🎨', isCorrect: false },
    ],
    correctId: 'q6b',
    explanation: 'Pneus velhos acumulam água e são um dos maiores criadouros do Aedes aegypti.',
    category: 'prevencao',
  },
  {
    id: 'q7',
    question: 'Com que frequência devemos verificar a caixa d\'água?',
    options: [
      { id: 'q7a', text: 'Uma vez por ano', emoji: '📅', isCorrect: false },
      { id: 'q7b', text: 'Nunca', emoji: '❌', isCorrect: false },
      { id: 'q7c', text: 'Regularmente', emoji: '✅', isCorrect: true },
      { id: 'q7d', text: 'Só quando esvaziar', emoji: '🚰', isCorrect: false },
    ],
    correctId: 'q7c',
    explanation: 'A caixa d\'água precisa estar sempre tampada e deve ser verificada regularmente.',
    category: 'prevencao',
  },
  {
    id: 'q8',
    question: 'Qual é o melhor jeito de cuidar do pratinho do vaso de planta?',
    options: [
      { id: 'q8a', text: 'Deixar com água', emoji: '💧', isCorrect: false },
      { id: 'q8b', text: 'Colocar areia ou eliminar a água', emoji: '🏖️', isCorrect: true },
      { id: 'q8c', text: 'Cobrir com papel', emoji: '📄', isCorrect: false },
      { id: 'q8d', text: 'Ignorar', emoji: '🤷', isCorrect: false },
    ],
    correctId: 'q8b',
    explanation: 'Colocar areia no pratinho ou eliminar a água parada impede a reprodução do mosquito.',
    category: 'prevencao',
  },

  // === AÇÃO ===
  {
    id: 'q9',
    question: 'O que fazer se suspeitar de dengue?',
    options: [
      { id: 'q9a', text: 'Ignorar os sintomas', emoji: '🙈', isCorrect: false },
      { id: 'q9b', text: 'Tomar remédio sem consulta', emoji: '💊', isCorrect: false },
      { id: 'q9c', text: 'Procurar um posto de saúde', emoji: '🏥', isCorrect: true },
      { id: 'q9d', text: 'Esperar passar sozinho', emoji: '⏳', isCorrect: false },
    ],
    correctId: 'q9c',
    explanation: 'Ao suspeitar de dengue, é importante procurar orientação médica rapidamente.',
    category: 'acao',
  },
  {
    id: 'q10',
    question: 'Combater o mosquito é responsabilidade de quem?',
    options: [
      { id: 'q10a', text: 'Só do governo', emoji: '🏛️', isCorrect: false },
      { id: 'q10b', text: 'Só dos médicos', emoji: '👨‍⚕️', isCorrect: false },
      { id: 'q10c', text: 'De toda a comunidade', emoji: '👥', isCorrect: true },
      { id: 'q10d', text: 'Só dos vizinhos', emoji: '🏡', isCorrect: false },
    ],
    correctId: 'q10c',
    explanation: 'Todos temos responsabilidade no combate aos mosquitos transmissores!',
    category: 'acao',
  },

  // === ALERTA ===
  {
    id: 'q11',
    question: 'Quando devemos procurar ajuda médica urgente?',
    options: [
      { id: 'q11a', text: 'Sangramento inesperado', emoji: '🩸', isCorrect: true },
      { id: 'q11b', text: 'Dor de cabeça leve', emoji: '😐', isCorrect: false },
      { id: 'q11c', text: 'Fome excessiva', emoji: '🍽️', isCorrect: false },
      { id: 'q11d', text: 'Sono durante o dia', emoji: '😴', isCorrect: false },
    ],
    correctId: 'q11a',
    explanation: 'Sangramento pode ser sinal de dengue grave. Procure ajuda imediatamente!',
    category: 'alerta',
  },
  {
    id: 'q12',
    question: 'Qual medicamento NÃO devemos tomar com suspeita de dengue?',
    options: [
      { id: 'q12a', text: 'Dipirona', emoji: '💊', isCorrect: false },
      { id: 'q12b', text: 'Aspirina', emoji: '⚠️', isCorrect: true },
      { id: 'q12c', text: 'Paracetamol', emoji: '💊', isCorrect: false },
      { id: 'q12d', text: 'Soro', emoji: '🥤', isCorrect: false },
    ],
    correctId: 'q12b',
    explanation: 'Aspirina pode causar sangramento e é contraindicada na suspeita de dengue!',
    category: 'alerta',
  },
];

export const getShuffledQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
