// ============================================
// ArboGame — Custom Button Component
// ============================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, SHADOWS } from '../../styles/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'accent' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  emoji?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const VARIANT_COLORS: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: '#446B58', text: COLORS.white, border: '#314B3D' },
  secondary: { bg: '#587086', text: COLORS.white, border: '#3D4F60' },
  danger: { bg: '#8A5148', text: COLORS.white, border: '#633A33' },
  accent: { bg: '#C3A261', text: '#2B241C', border: '#8D7443' },
  ghost: { bg: 'rgba(8, 18, 28, 0.2)', text: COLORS.white, border: 'rgba(255,255,255,0.16)' },
  outline: { bg: 'rgba(11, 20, 28, 0.12)', text: '#F5EFE3', border: 'rgba(245,239,227,0.5)' },
};

const SIZE_STYLES: Record<ButtonSize, { height: number; paddingH: number; fontSize: number; emojiSize: number }> = {
  sm: { height: 40, paddingH: 16, fontSize: 14, emojiSize: 16 },
  md: { height: 52, paddingH: 24, fontSize: 16, emojiSize: 20 },
  lg: { height: 60, paddingH: 32, fontSize: 18, emojiSize: 24 },
};

export const GameButton: React.FC<GameButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  emoji,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const colors = VARIANT_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: colors.bg,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingH,
          borderColor: colors.border,
          borderWidth: 1.5,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        SHADOWS.small,
        animatedStyle,
        style,
      ]}
    >
      <View style={styles.content}>
        {emoji && (
          <Text style={[styles.emoji, { fontSize: sizeStyle.emojiSize }]}>
            {emoji}
          </Text>
        )}
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: sizeStyle.fontSize,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
