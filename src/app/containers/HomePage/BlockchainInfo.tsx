import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Loadable';
import { translations } from '../../../locales/i18n';
import { media } from '../../../styles/media';
import { formatNumber } from '../../../utils';
import {
  LineChart as Chart,
  SmallChart,
} from '../../components/Chart/Loadable';
import { reqHomeDashboard } from '../../../utils/httpRequest';
import { Link } from 'react-router-dom';

function Info(title, number: any) {
  return (
    <div className="info">
      <div className="title">{title}</div>
      <div className="number">{number}</div>
    </div>
  );
}

// TODO redesign
export function BlockchainInfo({ timestamp = 1 }: { timestamp?: number }) {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<any>({});

  useEffect(() => {
    reqHomeDashboard()
      .then(res => {
        setDashboardData(res || {});
      })
      .catch(e => {
        console.error(e);
      });
  }, [timestamp]);

  return (
    <CardWrapper>
      <Card>
        <Grid.Container gap={1} justify="center" className="stats-container">
          <Grid xs={24} sm={24} md={3}>
            {Info(
              t(translations.statistics.home.currentEpoch),
              `${dashboardData.epochNumber ? dashboardData.epochNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3.5}>
            {Info(
              t(translations.statistics.home.currentBlockNumber),
              `${dashboardData.blockNumber ? dashboardData.blockNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3.5}>
            {Info(
              t(translations.statistics.home.account),
              `${
                dashboardData.addressCount
                  ? formatNumber(dashboardData.addressCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3}>
            {Info(
              <Link to={'/chart/dailyTransaction'} className="info-link">
                {t(translations.statistics.home.transactions)}
              </Link>,
              `${
                dashboardData.transactionCount
                  ? formatNumber(dashboardData.transactionCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2.5}>
            {Info(
              <Link to={'/chart/contractDeploy'} className="info-link">
                {t(translations.statistics.home.contract)}
              </Link>,
              `${
                dashboardData.contractCount
                  ? formatNumber(dashboardData.contractCount, {
                      withUnit: false,
                      keepDecimal: false,
                    })
                  : '--'
              }`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3.5}>
            {Info(
              <Link to="/chart/blockTime" className="info-link">
                {t(translations.charts.blockTime.title)}
              </Link>,
              <SmallChart plain={true} indicator="blockTime" />,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2.5}>
            {Info(
              <Link to="/chart/tps" className="info-link">
                {t(translations.charts.tps.title)}
              </Link>,
              <SmallChart plain={true} indicator="tps" />,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={2.5}>
            {Info(
              <Link to="/chart/hashRate" className="info-link">
                {t(translations.charts.hashRate.title)}
              </Link>,
              <SmallChart plain={true} indicator="hashRate" />,
            )}
          </Grid>
        </Grid.Container>
      </Card>
      <div className="charts">
        <Grid.Container gap={2.7} justify="center">
          <Grid xs={24} sm={24} md={12} className="chart-item">
            <Chart
              indicator="dailyTransaction"
              widthRatio="100%"
              minHeight={180}
              withDetailLink={true}
            />
          </Grid>
          <Grid xs={24} sm={24} md={12} className="chart-item">
            <Chart
              indicator="accountGrowth"
              widthRatio="100%"
              minHeight={180}
              withDetailLink={true}
            />
          </Grid>
        </Grid.Container>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 16px;
  width: 100%;

  .charts {
    margin-top: 20px;
    width: calc(100% - 1px); // fix shaking

    .chart-item {
      > div {
        padding: 12px 18px;
      }

      ${media.m} {
        > div {
          padding: 10px 12px 5px;
        }
      }
    }
  }

  .stats-container {
    padding: 12px 0;

    ${media.m} {
      padding: 0;
    }

    > .item {
      &:nth-child(2),
      &:nth-child(5) {
        border-right: 1px solid #e8e9ea;
      }

      &:nth-child(3),
      &:nth-child(6) {
        padding-left: 3rem;
      }

      ${media.m} {
        max-width: 100%;
        border-right: none !important;
        padding-left: 0 !important;
        border-bottom: 1px solid #e8e9ea;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    ${media.m} {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      font-size: 14px;
      font-weight: normal;
      color: #7e8598;
      line-height: 24px;
      white-space: nowrap;

      ${media.s} {
        font-size: 12px;
      }
    }

    .number {
      font-size: 18px;
      font-weight: bold;
      color: #282d30;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-start;

      ${media.s} {
        font-size: 16px;
      }

      .trend {
        margin-left: 10px;
      }
    }
  }

  .info-link,
  .chart-link {
    cursor: pointer;

    &:hover {
      border-bottom: 1px solid #1e3de4;
    }
  }
`;
