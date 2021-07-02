import React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { LineChart as Chart, PieChart } from '../../components/Chart/Loadable';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '@cfxjs/react-ui';

interface RouteParams {
  indicator: string;
}

export function ChartDetail() {
  const { t } = useTranslation();
  const history = useHistory();
  const { indicator } = useParams<RouteParams>();

  let title = t(translations.charts.subtitle2);
  let chartType = 'line';
  switch (indicator) {
    case 'circulating':
    case 'issued':
      title = t(translations.charts.subtitle1);
      chartType = 'pie';
      break;
    case 'dailyTransaction':
    case 'dailyTransactionCFX':
    case 'dailyTransactionTokens':
      title = t(translations.charts.subtitle3);
      break;
    case 'cfxHoldingAccounts':
    case 'accountGrowth':
    case 'activeAccounts':
      title = t(translations.charts.subtitle4);
      break;
    case 'contractAmount':
    case 'contractGrowth':
    case 'contractDeploy':
      title = t(translations.charts.subtitle5);
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
          <Button
            variant="solid"
            color="primary"
            size="small"
            onClick={() => history.goBack()}
          >
            {t(translations.general.back)}
          </Button>
        </HeaderWrap>
        {indicator ? (
          <ChartsWrap>
            {chartType === 'line' ? (
              <Chart width={chartWidth} indicator={indicator} />
            ) : chartType === 'pie' ? (
              <PieChart width={chartWidth} indicator={indicator} />
            ) : null}
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
  padding: 32px 0;

  ${media.m} {
    padding: 32px 10px;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.1429rem;
  padding: 0;
  justify-content: space-between;
  align-items: baseline;

  .btn {
    font-size: 14px !important;
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
