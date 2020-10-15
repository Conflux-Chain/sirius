import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

export const Tokens = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
    </>
  );
};
