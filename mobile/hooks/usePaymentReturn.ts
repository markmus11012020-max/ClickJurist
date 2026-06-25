import * as Linking from 'expo-linking';
import { useEffect } from 'react';

/** Обработка возврата после оплаты: clickjurist://payment-success?session=... */
export function usePaymentReturn(onSessionReturn: (sessionId: string) => void) {
  useEffect(() => {
    const handleUrl = (url: string) => {
      const parsed = Linking.parse(url);
      if (parsed.path === 'payment-success' || parsed.hostname === 'payment-success') {
        const session = parsed.queryParams?.session;
        if (typeof session === 'string') {
          onSessionReturn(session);
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [onSessionReturn]);
}
