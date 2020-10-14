import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components';
import Text from '../../components/Text';
import PageHeader from '../../components/PageHeader';
import { media } from '../../../styles/media';
import numeral from 'numeral';
import { Card, Textarea } from '@cfxjs/react-ui';
import { Description } from '../../components/Description';
import { useParams } from 'react-router-dom';

const StyledTokensWrapper = styled.div`
  padding: 32px 0;

  ${media.s} {
    padding-bottom: 0;
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
  const { hash } = useParams<{
    hash: string;
  }>();

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
      <StyledCardWrapper>
        <Card className="sirius-Transactions-card">
          <Description title={'Transation Hash'}>
            0x6e2861532a6a6935cc88bf7a55e60a25d66cc61b384e23636dea103083a3460e
          </Description>
          <Description title={'Executed Epoch'}>12</Description>
          <Description title={'Input Data'}>
            <Textarea
              width="100%"
              placeholder="CSS（层叠样式表）用于设置和布置网页 - 例如，更改内容的字体，颜色，大小和间距，将其拆分为多个列，或添加动画和其他装饰功能。"
              value=""
              defaultValue=""
              minHeight="118px"
              variant="solid"
            />
          </Description>
        </Card>
      </StyledCardWrapper>
    </StyledTokensWrapper>
  );
};

const StyledCardWrapper = styled.div`
  .card.sirius-Transactions-card {
    .content {
      padding: 0 18px;
    }
  }
`;
