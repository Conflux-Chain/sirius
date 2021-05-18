import { useTranslation } from 'react-i18next';
import React from 'react';
import { translations } from 'locales/i18n';
import { toThousands } from 'utils';

export const Nonce = ({ nonce, position }) => {
  const { t } = useTranslation();

  return (
    <>
      {toThousands(nonce)}{' '}
      {t(translations.transaction.inThePosition, {
        position,
      })}
    </>
  );
};
