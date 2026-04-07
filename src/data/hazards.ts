// ============================================
// ArboGame — Hazards & Solutions Data
// Positions mapped to PORTRAIT background illustrations
// ============================================

import { Hazard, Solution } from '../types/game';

// === LEVEL 1 — Perigo em Casa ===
// Mapped to bg_level1.png (portrait, house interior):
// Top: shelves with plants + window + water filter
// Center: floral couch (left), clay filter (center), kitchen counter with bottles (right)
// Bottom: coffee table with plant pot (center), red bucket (right)
export const LEVEL1_HAZARDS: Hazard[] = [
  {
    id: 'h1_vaso',
    type: 'vaso_planta',
    label: 'Vaso de Planta',
    emoji: '🪴',
    correctAction: 'esvaziar',
    // Plant pot on coffee table with water-filled saucer (center-bottom)
    position: { x: 0.42, y: 0.78 },
    description: 'Prato com água parada embaixo do vaso',
    solved: false,
  },
  {
    id: 'h1_garrafa',
    type: 'garrafa_aberta',
    label: 'Garrafa Aberta',
    emoji: '🍶',
    correctAction: 'tampar',
    // Open soda bottles on kitchen counter (right side, mid-height)
    position: { x: 0.70, y: 0.55 },
    description: 'Garrafa sem tampa acumulando água',
    solved: false,
  },
  {
    id: 'h1_balde',
    type: 'balde_destampado',
    label: 'Balde Destampado',
    emoji: '🪣',
    correctAction: 'tampar',
    // Red bucket with water under kitchen counter (bottom-right)
    position: { x: 0.73, y: 0.73 },
    description: 'Balde sem tampa acumulando água',
    solved: false,
  },
  {
    id: 'h1_caixa',
    type: 'caixa_dagua',
    label: 'Filtro de Barro',
    emoji: '🏺',
    correctAction: 'tampar',
    // Clay water filter on wooden stand (center)
    position: { x: 0.47, y: 0.58 },
    description: 'Filtro de barro sem tampa acumulando água',
    solved: false,
  },
];

// === LEVEL 2 — Mutirão de Limpeza ===
// Mapped to bg_level2.png (portrait, backyard/street):
// Top: sky + houses + clogged gutter on orange house
// Center: tire (left), abandoned pool (center), drainage ditch (right)
// Bottom: plant pots with water saucers, more trash
export const LEVEL2_HAZARDS: Hazard[] = [
  {
    id: 'h2_pneu',
    type: 'pneu_velho',
    label: 'Pneu Velho',
    emoji: '⭕',
    correctAction: 'limpar',
    correctSolution: 'saco_lixo',
    // Old tire leaning against house wall (left, mid-height)
    position: { x: 0.15, y: 0.62 },
    description: 'Pneus velhos acumulando água da chuva',
    solved: false,
  },
  {
    id: 'h2_piscina',
    type: 'latinha',
    label: 'Piscina Suja',
    emoji: '🏊',
    correctAction: 'limpar',
    correctSolution: 'limpeza',
    // Abandoned green swimming pool (center)
    position: { x: 0.45, y: 0.62 },
    description: 'Piscina abandonada com água parada e verde',
    solved: false,
  },
  {
    id: 'h2_entulho',
    type: 'entulho',
    label: 'Entulho na Sarjeta',
    emoji: '🧱',
    correctAction: 'limpar',
    correctSolution: 'pa',
    // Trash/rubble in the drainage ditch (right side)
    position: { x: 0.85, y: 0.68 },
    description: 'Entulho e lixo na sarjeta acumulando água',
    solved: false,
  },
  {
    id: 'h2_calha',
    type: 'calha_entupida',
    label: 'Calha Entupida',
    emoji: '🏚️',
    correctAction: 'limpar',
    correctSolution: 'limpeza',
    // Clogged gutter on roof (top-left, on the orange house)
    position: { x: 0.20, y: 0.28 },
    description: 'Calha entupida com folhas e água parada',
    solved: false,
  },
  {
    id: 'h2_lixo',
    type: 'lixo_acumulado',
    label: 'Lixo na Vala',
    emoji: '🗑️',
    correctAction: 'limpar',
    correctSolution: 'saco_lixo',
    // Trash bag near the pool/yard (center area)
    position: { x: 0.55, y: 0.50 },
    description: 'Lixo espalhado na vala acumulando água',
    solved: false,
  },
  {
    id: 'h2_vasos',
    type: 'recipiente_animal',
    label: 'Vasos no Jardim',
    emoji: '🪴',
    correctAction: 'limpar',
    correctSolution: 'limpeza',
    // Plant pots with standing water in saucers (bottom-left)
    position: { x: 0.25, y: 0.85 },
    description: 'Pratos de vasos acumulando água no jardim',
    solved: false,
  },
];

export const LEVEL2_SOLUTIONS: Solution[] = [
  { id: 's_saco', type: 'saco_lixo', label: 'Saco de Lixo', emoji: '🗑️' },
  { id: 's_tampa', type: 'tampa', label: 'Tampa', emoji: '🔒' },
  { id: 's_pa', type: 'pa', label: 'Pá', emoji: '🧹' },
  { id: 's_limpeza', type: 'limpeza', label: 'Limpeza', emoji: '🧽' },
];

// === LEVEL 4 — Mapa do Bairro ===
export const LEVEL4_MAP_POINTS = [
  {
    id: 'mp1',
    label: 'Casa 1',
    emoji: '🏠',
    position: { x: 0.20, y: 0.30 },
    hazards: [
      { ...LEVEL1_HAZARDS[3], id: 'mp1_h1', position: { x: 0.5, y: 0.5 } },
    ],
    completed: false,
  },
  {
    id: 'mp2',
    label: 'Casa 2',
    emoji: '🏡',
    position: { x: 0.50, y: 0.25 },
    hazards: [
      { ...LEVEL2_HAZARDS[0], id: 'mp2_h1', position: { x: 0.5, y: 0.5 } },
    ],
    completed: false,
  },
  {
    id: 'mp3',
    label: 'Casa 3',
    emoji: '🏘️',
    position: { x: 0.80, y: 0.35 },
    hazards: [
      { ...LEVEL2_HAZARDS[4], id: 'mp3_h1', position: { x: 0.5, y: 0.5 } },
    ],
    completed: false,
  },
  {
    id: 'mp4',
    label: 'Praça',
    emoji: '🌳',
    position: { x: 0.35, y: 0.65 },
    hazards: [
      { ...LEVEL2_HAZARDS[1], id: 'mp4_h1', position: { x: 0.3, y: 0.5 } },
      { ...LEVEL1_HAZARDS[1], id: 'mp4_h2', position: { x: 0.7, y: 0.5 } },
    ],
    completed: false,
  },
  {
    id: 'mp5',
    label: 'Escola',
    emoji: '🏫',
    position: { x: 0.65, y: 0.60 },
    hazards: [
      { ...LEVEL1_HAZARDS[0], id: 'mp5_h1', position: { x: 0.5, y: 0.5 } },
    ],
    completed: false,
  },
];
