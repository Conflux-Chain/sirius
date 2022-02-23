import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { Card } from 'app/components/Card/Loadable';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { formatNumber, formatBalance, formatTimeStamp } from 'utils';
import { LineChart as Chart, SmallChart } from 'app/components/Chart/Loadable';
import {
  reqHomeDashboard,
  reqHomeDashboardOfPOSSummary,
  reqTransferTPS,
} from 'utils/httpRequest';
import { Link } from 'react-router-dom';
import lodash from 'lodash';
import iconPos from 'images/homepage/pos.png';
import iconPow from 'images/homepage/pow.png';

function Info(title, number: any) {
  return (
    <div className="info">
      <div className="title">{title}</div>
      <div className="number">{number || '--'}</div>
    </div>
  );
}

// TODO redesign
export function BlockchainInfo({ timestamp = 1 }: { timestamp?: number }) {
  const { t } = useTranslation();
  // const iszh = i18n.language.includes('zh');
  const [dashboardData, setDashboardData] = useState<any>({});
  const [POSSummaryInfo, setPOSSummaryInfo] = useState<any>({});
  const [transferData, setTransferData] = useState<any>({});

  useEffect(() => {
    reqHomeDashboard()
      .then(res => {
        setDashboardData(res || {});
      })
      .catch(e => {
        console.error(e);
      });

    reqHomeDashboardOfPOSSummary()
      .then(res => setPOSSummaryInfo(res))
      .catch(e => {
        console.error('get pos homepage summary info error: ', e);
      });

    reqTransferTPS()
      .then(res => {
        if (res.code === 0) {
          setTransferData(res.data);
        }
      })
      .catch(e => {
        console.log('reqTransferTPS error: ', e);
      });
  }, [timestamp]);

  return (
    <CardWrapper>
      <Card className="homepage-info-pow">
        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container stats-container-pow-top"
        >
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.currentEpoch),
              `${dashboardData.epochNumber ? dashboardData.epochNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.finalizedEpoch),
              POSSummaryInfo.posPivotDecision,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.home.currentBlockNumber),
              `${dashboardData.blockNumber ? dashboardData.blockNumber : '--'}`,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
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
          <Grid xs={24} sm={24} md={4}>
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
          <Grid xs={24} sm={24} md={4}>
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
        </Grid.Container>

        <div className="stats-container stats-container-split"></div>

        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container stats-container-pow-bottom"
        >
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/chart/tps" className="info-link">
                {t(translations.charts.tps.title)}
              </Link>,
              <SmallChart plain={true} indicator="tps" />,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.charts.tokenTransferTps.title),
              lodash.isNil(transferData?.tps)
                ? '--'
                : formatNumber(transferData?.tps, {
                    withUnit: false,
                  }),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/chart/blockTime" className="info-link">
                {t(translations.charts.blockTime.title)}
              </Link>,
              <SmallChart plain={true} indicator="blockTime" />,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              <Link to="/chart/hashRate" className="info-link">
                {t(translations.charts.hashRate.title)}
              </Link>,
              <SmallChart plain={true} indicator="hashRate" />,
            )}
          </Grid>
        </Grid.Container>

        <div className="homepage-infoType-container">
          <img src={iconPow} alt=""></img>
        </div>
      </Card>

      <Card className="homepage-info-pos">
        <Grid.Container
          gap={1}
          justify="flex-start"
          className="stats-container"
        >
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.currentBlockNumber),
              POSSummaryInfo.latestCommitted,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.totalLocked),
              formatBalance(POSSummaryInfo.totalPosStakingTokens),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={3}>
            {Info(
              t(translations.statistics.pos.totalInterest),
              formatBalance(POSSummaryInfo.totalPosRewardDrip),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={5}>
            {Info(
              t(translations.statistics.pos.lastInterestDistributionEpoch),
              lodash.isNil(POSSummaryInfo.lastDistributeBlock) ? (
                '--'
              ) : (
                <span>
                  <span>{POSSummaryInfo.lastDistributeBlock} </span>
                  {POSSummaryInfo.lastDistributeBlockTime ? (
                    <span className="pos-block-timestamp">
                      {formatTimeStamp(POSSummaryInfo.lastDistributeBlockTime)}
                    </span>
                  ) : null}
                </span>
              ),
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.totalAccountCount),
              POSSummaryInfo.posAccountCount,
            )}
          </Grid>
          <Grid xs={24} sm={24} md={4}>
            {Info(
              t(translations.statistics.pos.votingBlock),
              POSSummaryInfo.latestVoted,
            )}
          </Grid>
        </Grid.Container>

        <div className="homepage-infoType-container pos">
          <img src={iconPos} alt=""></img>
        </div>
      </Card>
      <div className="charts">
        <Grid.Container gap={2.7} justify="center">
          <Grid xs={24} sm={24} md={12} className="overview-chart-item">
            <Chart
              indicator="dailyTransaction"
              widthRatio="100%"
              minHeight={180}
              withDetailLink={true}
              hideRoom={true}
              limit={33}
            />
          </Grid>
          <Grid xs={24} sm={24} md={12} className="overview-chart-item">
            <Chart
              indicator="accountGrowth"
              widthRatio="100%"
              minHeight={180}
              withDetailLink={true}
              hideRoom={true}
              limit={33}
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

  .card {
    position: relative;

    &.homepage-info-pos,
    &.homepage-info-pow {
      margin-top: 20px;
      position: relative;
    }

    &.homepage-info-pow {
      .stats-container-pow-top {
        .item {
          &:nth-child(3) {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              border-right: 1px solid #e8e9ea;
              height: 70%;
              top: 15%;
              right: 15%;
            }
          }

          /* &:nth-child(4) {
            padding-left: 2rem;
          } */
        }
      }

      .stats-container-pow-bottom {
        .item {
          &:nth-child(2) {
            position: relative;

            &::after {
              content: '';
              position: absolute;
              border-right: 1px solid #e8e9ea;
              height: 70%;
              top: 15%;
              right: 15%;
            }
          }

          /* &:nth-child(3) {
            padding-left: 5rem;
          } */
        }
      }
    }

    &.homepage-info-pos {
      .item {
        &:nth-child(2) {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            border-right: 1px solid #e8e9ea;
            height: 70%;
            top: 15%;
            right: 15%;
          }
        }

        &:nth-child(4) {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            border-right: 1px solid #e8e9ea;
            height: 70%;
            top: 15%;
            right: 5%;
          }
        }
      }

      .pos-block-timestamp {
        font-size: 12px;
        color: #999999;
        padding-left: 10px;
      }
    }

    .homepage-infoType-container {
      position: absolute;
      right: -2px;
      top: -2px;
      bottom: -2px;
      z-index: 1;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1e3de4;
      border-radius: 0px 5px 5px 0px;

      &.pos {
        background: #309eee;
      }
    }
  }

  .stats-container {
    padding: 12px 0;

    ${media.m} {
      padding: 0;
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    &.stats-container-pow-bottom {
      margin-top: 1px solid #e8e9ea;
    }

    &.stats-container-split {
      border-top: 1px solid #e8e9ea;
      padding: 0;
    }

    & > .item {
      ${media.m} {
        max-width: 100%;
        border-right: none !important;
        padding-left: 0 !important;
        border-bottom: 1px solid #e8e9ea;
        margin-right: 36px;

        &:last-child {
          border-bottom: none;
        }

        &::after {
          display: none;
        }
      }
    }
  }

  .charts {
    margin-top: 20px;
    width: calc(100% - 1px); // fix shaking

    .overview-chart-item {
      > div {
        padding: 12px 18px;
        width: 100%;
        height: 210px;
        min-height: inherit;
        overflow: hidden;
      }

      ${media.m} {
        > div {
          padding: 10px 12px 5px;
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
