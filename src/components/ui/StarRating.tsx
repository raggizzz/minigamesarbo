// ============================================
// ArboGame — Star Rating Display
// ============================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StarRating as StarRatingType } from '../../types/game';

interface StarRatingProps {
  stars: StarRatingType;
  size?: number;
  animated?: boolean;
}

const Star: React.FC<{ filled: boolean; index: number; size: number; animated: boolean }> = ({
  filled,
  index,
  size,
  animated,
}) => {
  const scale = useSharedValue(animated ? 0 : 1);
  const rotation = useSharedValue(animated ? -30 : 0);

  useEffect(() => {
    if (animated && filled) {
      scale.value = withDelay(
        index * 300,
        withSequence(
          withSpring(1.3, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        )
      );
      rotation.value = withDelay(
        index * 300,
        withSequence(
          withTiming(15, { duration: 150 }),
          withTiming(-15, { duration: 150 }),
          withTiming(0, { duration: 150 })
        )
      );
    }
  }, [animated, filled, index, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.starContainer, animatedStyle]}>
      <Text style={[styles.star, { fontSize: size }]}>
        {filled ? '⭐' : '☆'}
      </Text>
    </Animated.View>
  );
};

export const StarRatingDisplay: React.FC<StarRatingProps> = ({
  stars,
  size = 32,
  animated = true,
}) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          filled={i < stars}
          index={i}
          size={size}
          animated={animated}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    textAlign: 'center',
  },
});
