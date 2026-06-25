import {
  AgeGroup,
  AGE_GROUP_LABELS,
  ConsultationGoal,
  CONSULTATION_GOAL_LABELS,
  UserRole,
  USER_ROLE_LABELS,
  WizardFormData,
} from '@clickjurist/shared';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

interface WizardProps {
  step: number;
  data: WizardFormData;
  onChange: (data: Partial<WizardFormData>) => void;
}

function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-4 rounded-xl mb-3 border ${
        selected
          ? 'bg-brand-blue/20 border-brand-cyan'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <Text className={`text-base ${selected ? 'text-brand-cyan font-semibold' : 'text-white'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function WizardStep({ step, data, onChange }: WizardProps) {
  const toggleGoal = (goal: ConsultationGoal) => {
    const goals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    onChange({ goals });
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {step === 0 && (
        <View>
          <Text className="text-white text-xl font-bold mb-2">Ваш возраст</Text>
          <Text className="text-brand-muted mb-6">
            Важно для определения ответственности по УК и КоАП
          </Text>
          {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
            <OptionButton
              key={key}
              label={label}
              selected={data.ageGroup === key}
              onPress={() => onChange({ ageGroup: key })}
            />
          ))}
        </View>
      )}

      {step === 1 && (
        <View>
          <Text className="text-white text-xl font-bold mb-2">Ваша роль</Text>
          <Text className="text-brand-muted mb-6">Кто вы в этой ситуации?</Text>
          {(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([key, label]) => (
            <OptionButton
              key={key}
              label={label}
              selected={data.role === key}
              onPress={() => onChange({ role: key })}
            />
          ))}
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-white text-xl font-bold mb-2">Тема</Text>
          <Text className="text-brand-muted mb-6">Коротко: о чём вопрос?</Text>
          <TextInput
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-base"
            placeholder="Например: блокировка карты"
            placeholderTextColor="#64748B"
            value={data.topic}
            onChangeText={(topic) => onChange({ topic })}
            maxLength={100}
          />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text className="text-white text-xl font-bold mb-2">Суть ситуации</Text>
          <Text className="text-brand-muted mb-6">
            Опишите своими словами. Не указывайте ФИО, адреса и телефоны.
          </Text>
          <TextInput
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-base min-h-[160px]"
            placeholder="Расскажите, что произошло..."
            placeholderTextColor="#64748B"
            value={data.description}
            onChangeText={(description) => onChange({ description })}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />
        </View>
      )}

      {step === 4 && (
        <View>
          <Text className="text-white text-xl font-bold mb-2">Что вам нужно?</Text>
          <Text className="text-brand-muted mb-6">Можно выбрать несколько вариантов</Text>
          {(Object.entries(CONSULTATION_GOAL_LABELS) as [ConsultationGoal, string][]).map(
            ([key, label]) => (
              <OptionButton
                key={key}
                label={label}
                selected={data.goals.includes(key)}
                onPress={() => toggleGoal(key)}
              />
            ),
          )}
        </View>
      )}
    </ScrollView>
  );
}

export const INITIAL_WIZARD_DATA: WizardFormData = {
  ageGroup: AgeGroup.OVER_18,
  role: UserRole.VICTIM,
  topic: '',
  description: '',
  goals: [ConsultationGoal.CONSULTATION],
};

export function isStepValid(step: number, data: WizardFormData): boolean {
  switch (step) {
    case 2:
      return data.topic.trim().length >= 3;
    case 3:
      return data.description.trim().length >= 10;
    case 4:
      return data.goals.length > 0;
    default:
      return true;
  }
}
