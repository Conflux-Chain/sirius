import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useDashboardDag } from '../../../utils/api';

export function HomePage() {
  const { t } = useTranslation();
  const { data, error } = useDashboardDag();
  console.log(data);
  return (
    <>
      <Helmet>
        <title>{t(translations.homepage.title)}</title>
        <meta
          name="description"
          content={t(translations.homepage.description)}
        />
      </Helmet>
      <span>HomePage container</span>
    </>
  );
}
