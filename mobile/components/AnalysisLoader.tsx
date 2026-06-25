import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const LOADER_PHASES = [
  { until: 3000, text: 'Анализ проблемы...' },
  { until: 6000, text: 'Автоматический аудит и вычитка текста...' },
  { until: 8000, text: 'Подготовка анонимного бланка...' },
  { until: Infinity, text: 'Завершаем обработку...' },
];

export function AnalysisLoader() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const ms = Date.now() - start;
      setElapsed(ms);
      const idx = LOADER_PHASES.findIndex((p) => ms < p.until);
      setPhaseIndex(idx === -1 ? LOADER_PHASES.length - 1 : idx);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-brand-dark px-8">
      <ActivityIndicator size="large" color="#00F0FF" />
      <Text className="text-brand-cyan text-lg font-semibold mt-6 text-center">
        {LOADER_PHASES[phaseIndex].text}
      </Text>
      <Text className="text-brand-muted text-sm mt-2">
        {Math.floor(elapsed / 1000)} сек.
      </Text>
    </View>
  );
}
