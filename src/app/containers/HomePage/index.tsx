import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <span>HomePage container</span>
    </>
  );
}
