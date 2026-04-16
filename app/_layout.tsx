// ============================================
// ArboGame — Root Layout
// ============================================

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../src/store/gameStore';

export default function RootLayout() {
  const loadProgress = useGameStore((s) => s.loadProgress);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="howtoplay" />
        <Stack.Screen name="credits" />
        <Stack.Screen
          name="game/[levelId]"
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="victory" />
        <Stack.Screen name="defeat" />
      </Stack>
    </>
  );
}
