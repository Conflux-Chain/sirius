import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { LineChart as Chart } from '../../components/Chart/Loadable';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useParams } from 'react-router-dom';
import { Link } from '../../components/Link/Loadable';

interface RouteParams {
  indicator: string;
}

export function ChartDetail() {
  const { t } = useTranslation();
  const { indicator } = useParams<RouteParams>();

  let title = t(translations.charts.subtitle2);
  switch (indicator) {
    case 'marketInfo':
      title = t(translations.charts.subtitle1);
      break;
    case 'dailyTransaction':
    case 'dailyTransactionCFX':
    case 'dailyTransactionTokens':
      title = t(translations.charts.subtitle3);
      break;
    case 'cfxHoldingAccounts':
    case 'accountGrowth':
      title = t(translations.charts.subtitle4);
      break;
    default:
      break;
  }

  const clientWidth = document.body.clientWidth;
  let chartWidth = clientWidth - 36;

  if (chartWidth > 1368) chartWidth = 1368;
  if (chartWidth < 365) chartWidth = 365;

  return (
    <>
      <Helmet>
        <title>
          {t(translations.charts.title)} - {t(`charts.${indicator}.title`)}
        </title>
        <meta name="description" content={t(translations.charts.description)} />
      </Helmet>
      <PageWrap>
        <HeaderWrap>
          <div className="title">{title}</div>
          <Link href="/charts">{t(translations.general.back)}</Link>
        </HeaderWrap>
        {indicator ? (
          <ChartsWrap>
            <Chart width={chartWidth} indicator={indicator} />
          </ChartsWrap>
        ) : null}
      </PageWrap>
    </>
  );
}

const ChartsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    margin-right: 0;
    margin-bottom: 24px;
    background-color: #fff;
  }
  > div:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 872px) {
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    > div {
      margin-bottom: 24px !important;
    }
  }
`;

const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 0 8px;
  ${media.s} {
    padding: 32px 0;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.1429rem;
  padding: 0;
  justify-content: space-between;
  align-items: baseline;

  a.link {
    border-bottom: 1px solid #1e3de4;
    &:hover {
      border-bottom: 1px solid #0f23bd;
    }
  }

  .subtitle {
    font-size: 1rem;
    color: #7e8598;
    line-height: 1.7143rem;
    margin-bottom: 0.8571rem;
  }
  .title {
    font-size: 1.7143rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 2.2857rem;
  }
`;
