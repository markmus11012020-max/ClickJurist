import { WizardFormData } from '@clickjurist/shared';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { Logo } from '@/components/Logo';
import {
  INITIAL_WIZARD_DATA,
  isStepValid,
  WizardStep,
} from '@/components/WizardStep';

const STEPS = ['Возраст', 'Роль', 'Тема', 'Суть', 'Цель'];
const TOTAL_STEPS = STEPS.length;

export default function HomeScreen() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_WIZARD_DATA);

  const updateForm = (partial: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = isStepValid(step, formData);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      router.push({
        pathname: '/result',
        params: { form: JSON.stringify(formData) },
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-1 px-6 pt-4">
        <View className="items-center mb-6">
          <Logo size="sm" showTagline={false} />
        </View>

        <View className="flex-row mb-6">
          {STEPS.map((label, i) => (
            <View key={label} className="flex-1 items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  i <= step ? 'bg-brand-blue' : 'bg-white/10'
                }`}
              >
                <Text className="text-white text-xs font-bold">{i + 1}</Text>
              </View>
              <Text className="text-brand-muted text-[10px] mt-1">{label}</Text>
            </View>
          ))}
        </View>

        <WizardStep step={step} data={formData} onChange={updateForm} />

        <View className="flex-row gap-3 py-4">
          {step > 0 && (
            <Pressable
              onPress={handleBack}
              className="flex-1 py-4 rounded-xl border border-white/20 items-center"
            >
              <Text className="text-white font-semibold">Назад</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleNext}
            disabled={!canProceed}
            className={`flex-1 py-4 rounded-xl items-center ${
              canProceed ? 'bg-brand-blue' : 'bg-white/10'
            }`}
          >
            <Text className={`font-semibold ${canProceed ? 'text-white' : 'text-brand-muted'}`}>
              {step === TOTAL_STEPS - 1 ? 'Погнали!' : 'Далее'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
