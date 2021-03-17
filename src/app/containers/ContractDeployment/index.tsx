import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export function ContractDeployment() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(translations.contractDeployment.title)}</title>
        <meta
          name="description"
          content={t(translations.contractDeployment.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.contractDeployment.tip)}>
        {t(translations.contractDeployment.title)}
      </PageHeader>
      <div style={{ border: '1px solid red' }}>xxxx</div>
    </>
  );
}
