import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { DescriptionPanel } from './DescriptionPanel';

export function Block() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();

  return (
    <>
      <Helmet>
        <title>{t(translations.block.title)}</title>
        <meta name="description" content={t(translations.block.description)} />
      </Helmet>
      <PageHeader>{t(translations.block.title)}</PageHeader>
      <DescriptionPanel />
      {/* <StyledBrWrapper /> */}
      {/* <BottomTablePanel /> */}
    </>
  );
}

const StyledBrWrapper = styled.br`
  margin-top: 2.2857rem;
`;
