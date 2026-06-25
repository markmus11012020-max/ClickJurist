import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConsultationResponse, WizardFormData } from '@clickjurist/shared';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = '@clickjurist/session';
const HISTORY_KEY = '@clickjurist/history';

export interface StoredSession {
  sessionId: string;
  form: WizardFormData;
  response?: ConsultationResponse;
  isPaid: boolean;
  createdAt: string;
}

export async function getOrCreateSessionId(): Promise<string> {
  const existing = await AsyncStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = uuidv4();
  await AsyncStorage.setItem(SESSION_KEY, id);
  return id;
}

export async function saveSession(session: StoredSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, session.sessionId);
  const history = await getHistory();
  const filtered = history.filter((h) => h.sessionId !== session.sessionId);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([session, ...filtered].slice(0, 20)));
}

export async function getHistory(): Promise<StoredSession[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredSession[];
  } catch {
    return [];
  }
}

export async function updatePaymentStatus(sessionId: string, isPaid: boolean): Promise<void> {
  const history = await getHistory();
  const updated = history.map((h) =>
    h.sessionId === sessionId ? { ...h, isPaid } : h,
  );
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}
