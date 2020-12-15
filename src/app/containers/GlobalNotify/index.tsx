/**
 * GlobalNotify
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import pubsubLib from 'utils/pubsub';
import { useNotifications } from '@cfxjs/react-ui';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';

export function GlobalNotify() {
  const { t } = useTranslation();
  const [, setNotifications] = useNotifications();

  useEffect(() => {
    const unsubscribe = pubsubLib.subscribe(
      'notify',
      ({ code, message }: { code: number; message?: string }) => {
        const title = t(translations.general.error.title);
        const description =
          t(translations.general.error.description[code]) ||
          message ||
          t(translations.general.error.description[20000]); //

        setNotifications({
          icon: <XCircleFill color="#e15c56" />,
          title,
          content: description,
        });
      },
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
