// ============================================
// ArboGame — Design Theme
// ============================================

export const COLORS = {
  // Primary palette
  primary: '#2ECC71',        // Verde saúde
  primaryDark: '#27AE60',
  primaryLight: '#A9DFBF',

  // Secondary
  secondary: '#3498DB',      // Azul céu
  secondaryDark: '#2980B9',
  secondaryLight: '#AED6F1',

  // Accent
  accent: '#F1C40F',         // Amarelo alerta
  accentDark: '#F39C12',
  accentLight: '#F9E79F',

  // Danger
  danger: '#E74C3C',         // Vermelho erro
  dangerDark: '#C0392B',
  dangerLight: '#F5B7B1',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  lightGray: '#ECF0F1',
  gray: '#BDC3C7',
  darkGray: '#7F8C8D',
  dark: '#2C3E50',
  black: '#1A1A2E',

  // Game specific
  infestationRed: '#E74C3C',
  infestationYellow: '#F39C12',
  infestationGreen: '#2ECC71',
  comboGold: '#FFD700',
  starGold: '#FFC107',
  starEmpty: '#D5D5D5',
  heartRed: '#E74C3C',

  // Backgrounds
  menuBg: '#1A1A2E',
  menuBgGradientStart: '#0F3460',
  menuBgGradientEnd: '#16213E',
  gameplayBg: '#87CEEB',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

export const FONTS = {
  regular: 'System',
  bold: 'System',
  // Will use system fonts, which look great on mobile
} as const;

export const SIZES = {
  // Text
  textXS: 10,
  textSM: 12,
  textMD: 14,
  textLG: 16,
  textXL: 20,
  text2XL: 24,
  text3XL: 32,
  text4XL: 40,
  text5XL: 48,

  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Border radius
  radiusSM: 8,
  radiusMD: 12,
  radiusLG: 16,
  radiusXL: 20,
  radiusRound: 999,

  // Button
  buttonHeight: 52,
  buttonHeightSM: 40,

  // HUD
  hudHeight: 60,
  hudIconSize: 28,
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  }),
} as const;

export const GAME_CONSTANTS = {
  // Scoring
  CORRECT_ACTION: 100,
  FAST_BONUS: 50,
  FAST_THRESHOLD_MS: 3000,
  COMBO_3_BONUS: 100,
  COMBO_5_BONUS: 250,
  ERROR_PENALTY: -50,
  LEVEL_COMPLETE: 500,
  THREE_STARS_BONUS: 300,

  // Stars
  ONE_STAR_THRESHOLD: 0.5,
  TWO_STARS_THRESHOLD: 0.75,
  THREE_STARS_THRESHOLD: 0.9,

  // Lives
  DEFAULT_LIVES: 3,

  // Quiz
  QUIZ_PASS_RATE: 0.8,

  // Infestation
  INFESTATION_RATE: 0.5,     // per second
  INFESTATION_ERROR: 10,     // per error
  INFESTATION_CORRECT: -5,   // per correct answer
  INFESTATION_MAX: 100,
} as const;
