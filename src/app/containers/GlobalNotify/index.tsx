/**
 * GlobalNotify
 */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import pubsubLib from 'utils/pubsub';
import { useNotifications } from '@cfxjs/react-ui';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';

export function GlobalNotify() {
  const { t } = useTranslation();
  const [, setNotifications] = useNotifications();
  const codes = useRef({});

  useEffect(() => {
    const unsubscribe = pubsubLib.subscribe(
      'notify',
      ({ code, message }: { code: number; message?: string }) => {
        // only notify once of same code error
        if (!codes.current[code]) {
          const title = t(translations.general.error.title);
          const description =
            t(translations.general.error.description[code]) ||
            message ||
            t(translations.general.error.description[20000]);

          setNotifications({
            icon: <XCircleFill color="#e15c56" />,
            title,
            content: description,
            delay: 0,
            onClose: () => {
              codes.current[code] = false;
            },
          });

          codes.current[code] = true;
        }
      },
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
