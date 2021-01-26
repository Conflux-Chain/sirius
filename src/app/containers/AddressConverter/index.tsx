/**
 *
 * AddressConverter
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';

export function AddressConverter() {
  const { t } = useTranslation();

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.header.addressConverter)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.sponsor.title)}</PageHeader>
      <StyledSubtitleWrapper>AddressConverter</StyledSubtitleWrapper>
      <StyledInputWrapper></StyledInputWrapper>
      <StyledResultWrapper>
        <Card>result here</Card>
      </StyledResultWrapper>
      <StyledRemarkWrapper>remark here</StyledRemarkWrapper>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 2.2857rem;

  ${media.s} {
    padding: 1.1429rem;
  }
`;

const StyledSubtitleWrapper = styled.p`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;

const StyledInputWrapper = styled.div``;
const StyledResultWrapper = styled.div``;
const StyledRemarkWrapper = styled.div``;
