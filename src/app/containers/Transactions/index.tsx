import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import Text from '../../components/Text';
import PageHeader from '../../components/PageHeader';
import { media } from '../../../styles/media';
import numeral from 'numeral';
import { Card } from '@cfxjs/react-ui';

const StyledTokensWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding: 2.2857rem 0;

  ${media.s} {
    padding: 1.1429rem;
  }
`;

const StyledTextWrapper = styled.span`
  font-weight: 400;
  line-height: 1.7143rem;
  font-size: 1rem;
  &:hover {
    font-weight: 500;
    color: #1e3de4;
  }
`;

const renderTextEllipsis = value => {
  return (
    <Text span maxwidth={'5.7143rem'} hoverValue={value}>
      <StyledTextWrapper>{value}</StyledTextWrapper>
    </Text>
  );
};

export const Transactions = () => {
  const { t } = useTranslation();

  return (
    <StyledTokensWrapper>
      <Helmet>
        <title>{t(translations.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.transactions.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transactions.title)}</PageHeader>
      <Card>
        <Text p>一个基础的卡片。</Text>
      </Card>
    </StyledTokensWrapper>
  );
};
