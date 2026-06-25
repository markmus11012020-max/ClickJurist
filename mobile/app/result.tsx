import { ConsultationResponse, PDF_PRICE_RANGE, WizardFormData } from '@clickjurist/shared';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { AnalysisLoader } from '@/components/AnalysisLoader';
import { usePaymentReturn } from '@/hooks/usePaymentReturn';
import { checkPaymentStatus, createPayment, fetchPaymentConfig, requestConsultation } from '@/services/api';
import { exportPdf } from '@/services/pdf';
import { getOrCreateSessionId, saveSession, updatePaymentStatus } from '@/services/storage';

type Tab = 'consultation' | 'document' | 'plan';

const markdownStyles = {
  body: { color: '#E2E8F0', fontSize: 15, lineHeight: 24 },
  heading2: { color: '#00F0FF', fontSize: 17, marginTop: 16, marginBottom: 8 },
  bullet_list: { marginVertical: 8 },
};

export default function ResultScreen() {
  const params = useLocalSearchParams<{ form: string }>();
  const form = JSON.parse(params.form || '{}') as WizardFormData;

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<ConsultationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('consultation');
  const [sessionId, setSessionId] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [clarification, setClarification] = useState('');
  const [submittingClarification, setSubmittingClarification] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [pdfPrice, setPdfPrice] = useState(PDF_PRICE_RANGE.default);

  const verifyPayment = useCallback(async (sid?: string) => {
    const id = sid || sessionId;
    if (!id) return false;
    const paid = await checkPaymentStatus(id);
    if (paid) {
      setIsPaid(true);
      await updatePaymentStatus(id, true);
      setTab('document');
    }
    return paid;
  }, [sessionId]);

  usePaymentReturn((returnedSessionId) => {
    if (returnedSessionId === sessionId || !sessionId) {
      verifyPayment(returnedSessionId);
    }
  });

  useEffect(() => {
    fetchPaymentConfig().then((cfg) => {
      setPaymentEnabled(cfg.enabled);
      setPdfPrice(cfg.price);
    });
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && sessionId && !isPaid) {
        verifyPayment();
      }
    });
    return () => sub.remove();
  }, [sessionId, isPaid, verifyPayment]);

  const fetchConsultation = useCallback(
    async (clarificationText?: string) => {
      setLoading(true);
      setError(null);
      try {
        const sid = await getOrCreateSessionId();
        setSessionId(sid);
        const result = await requestConsultation({
          form,
          sessionId: sid,
          clarification: clarificationText,
        });
        setResponse(result);
        await saveSession({
          sessionId: sid,
          form,
          response: result,
          isPaid: false,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const handleClarification = async () => {
    if (!clarification.trim()) return;
    setSubmittingClarification(true);
    await fetchConsultation(clarification);
    setSubmittingClarification(false);
  };

  const handlePayment = async () => {
    if (!paymentEnabled) {
      setError('Оплата PDF пока не подключена на сервере');
      return;
    }
    try {
      const { confirmationUrl } = await createPayment(sessionId, pdfPrice);
      await Linking.openURL(confirmationUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось открыть страницу оплаты');
    }
  };

  const handleCheckPayment = async () => {
    await verifyPayment();
  };

  const handleExportPdf = async () => {
    if (!response || !isPaid) return;
    await exportPdf(response);
  };

  if (loading) return <AnalysisLoader />;

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-brand-dark items-center justify-center px-6">
        <Text className="text-red-400 text-center mb-4">{error}</Text>
        <Pressable onPress={() => router.back()} className="bg-brand-blue px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Назад</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const needsClarification = response?.clarification_request.needs_more_data;

  return (
    <SafeAreaView className="flex-1 bg-brand-dark">
      <View className="flex-row border-b border-white/10">
        {(['consultation', 'document', 'plan'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 py-3 items-center ${tab === t ? 'border-b-2 border-brand-cyan' : ''}`}
          >
            <Text className={`text-sm font-semibold ${tab === t ? 'text-brand-cyan' : 'text-brand-muted'}`}>
              {t === 'consultation' ? 'Консультация' : t === 'document' ? 'Документ' : 'План'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {tab === 'consultation' && response && (
          <Markdown style={markdownStyles}>
            {response.legal_analysis.user_friendly_consultation}
          </Markdown>
        )}

        {tab === 'plan' && response && (
          <View>
            {response.step_by_step_plan.map((step, i) => (
              <View key={i} className="flex-row mb-3">
                <Text className="text-brand-cyan font-bold mr-3">{i + 1}.</Text>
                <Text className="text-white flex-1">{step}</Text>
              </View>
            ))}
            {response.step_by_step_plan.length === 0 && (
              <Text className="text-brand-muted">План действий будет сформирован после уточнения.</Text>
            )}
          </View>
        )}

        {tab === 'document' && (
          <View>
            {needsClarification ? (
              <View className="items-center py-12">
                <Text className="text-brand-muted text-center">
                  Формирование документа...
                </Text>
                <Text className="text-white text-center mt-4">
                  Сначала ответьте на уточняющий вопрос во вкладке «Консультация»
                </Text>
              </View>
            ) : !isPaid ? (
              <View className="items-center py-8">
                <Text className="text-white text-center mb-2">
                  Скачивание анонимного PDF
                </Text>
                <Text className="text-brand-muted text-center mb-6">
                  Консультация бесплатна. Бланк документа — {pdfPrice} ₽
                </Text>
                {paymentEnabled ? (
                  <>
                    <Pressable onPress={handlePayment} className="bg-brand-blue px-8 py-4 rounded-xl mb-3">
                      <Text className="text-white font-semibold">Оплатить и скачать</Text>
                    </Pressable>
                    <Pressable onPress={handleCheckPayment} className="py-2">
                      <Text className="text-brand-cyan">Проверить оплату</Text>
                    </Pressable>
                  </>
                ) : (
                  <Text className="text-brand-muted text-center">
                    Оплата PDF скоро будет доступна. Консультация уже готова во вкладке выше.
                  </Text>
                )}
              </View>
            ) : (
              <View className="items-center py-8">
                <Text className="text-green-400 mb-4">Оплата подтверждена</Text>
                <Pressable onPress={handleExportPdf} className="bg-brand-blue px-8 py-4 rounded-xl">
                  <Text className="text-white font-semibold">Скачать PDF</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {needsClarification && tab === 'consultation' && (
          <View className="mt-6 p-4 bg-white/5 rounded-xl border border-brand-cyan/30">
            <Text className="text-brand-cyan font-semibold mb-2">Нужно уточнение</Text>
            <Text className="text-white mb-4">
              {response?.clarification_request.question}
            </Text>
            <TextInput
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-3"
              placeholder="Ваш ответ..."
              placeholderTextColor="#64748B"
              value={clarification}
              onChangeText={setClarification}
              multiline
            />
            <Pressable
              onPress={handleClarification}
              disabled={submittingClarification}
              className="bg-brand-blue py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">
                {submittingClarification ? 'Отправка...' : 'Отправить уточнение'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Pressable onPress={() => router.replace('/')} className="py-4 items-center border-t border-white/10">
        <Text className="text-brand-muted">Новый вопрос</Text>
      </Pressable>
    </SafeAreaView>
  );
}
